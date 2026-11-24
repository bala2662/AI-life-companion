/**
 * ==============================================================================
 * PERSONAL AI MEMORY SERVICE (Section 2)
 * Full CRUD, categorized memory retrieval, semantic relevance, privacy controls
 * ==============================================================================
 */

const crypto = require('node:crypto');
const { db } = require('../db/database');

/**
 * Get all memories for a user, optionally filtered by category
 */
function getMemories(userId, category = null) {
  if (category && category !== 'all') {
    return db.prepare(`
      SELECT * FROM user_memories 
      WHERE user_id = ? AND category = ? 
      ORDER BY updated_at DESC
    `).all(userId, category);
  }
  return db.prepare(`
    SELECT * FROM user_memories 
    WHERE user_id = ? 
    ORDER BY updated_at DESC
  `).all(userId);
}

/**
 * Add a new personal memory record
 */
function addMemory(userId, { category, title, content, is_confirmed_fact = 1, source = 'user_provided' }) {
  if (!title || !content) {
    throw new Error('Title and content are required');
  }

  const memId = 'mem-' + crypto.randomUUID();
  const stmt = db.prepare(`
    INSERT INTO user_memories (id, user_id, category, title, content, is_confirmed_fact, is_active, source)
    VALUES (?, ?, ?, ?, ?, ?, 1, ?)
  `);

  stmt.run(memId, userId, category || 'learning', title, content, is_confirmed_fact ? 1 : 0, source);

  return db.prepare('SELECT * FROM user_memories WHERE id = ?').get(memId);
}

/**
 * Update an existing memory
 */
function updateMemory(userId, memoryId, updates) {
  const mem = db.prepare('SELECT * FROM user_memories WHERE id = ? AND user_id = ?').get(memoryId, userId);
  if (!mem) {
    throw new Error('Memory record not found or access denied');
  }

  const allowed = ['title', 'content', 'category', 'is_confirmed_fact', 'is_active'];
  const sets = [];
  const vals = [];

  for (const k of allowed) {
    if (updates[k] !== undefined) {
      sets.push(`${k} = ?`);
      vals.push(k === 'is_confirmed_fact' || k === 'is_active' ? (updates[k] ? 1 : 0) : updates[k]);
    }
  }

  sets.push("updated_at = CURRENT_TIMESTAMP");
  vals.push(memoryId, userId);

  db.prepare(`UPDATE user_memories SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`).run(...vals);

  return db.prepare('SELECT * FROM user_memories WHERE id = ?').get(memoryId);
}

/**
 * Toggle active status of a memory
 */
function toggleMemoryStatus(userId, memoryId) {
  const mem = db.prepare('SELECT is_active FROM user_memories WHERE id = ? AND user_id = ?').get(memoryId, userId);
  if (!mem) throw new Error('Memory not found');
  const newStatus = mem.is_active ? 0 : 1;
  db.prepare('UPDATE user_memories SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?').run(newStatus, memoryId, userId);
  return { id: memoryId, is_active: newStatus };
}

/**
 * Delete a memory record permanently
 */
function deleteMemory(userId, memoryId) {
  const result = db.prepare('DELETE FROM user_memories WHERE id = ? AND user_id = ?').run(memoryId, userId);
  if (result.changes === 0) {
    throw new Error('Memory record not found or could not be deleted');
  }
  return { success: true, deletedId: memoryId };
}

/**
 * Clear all memories in a given category or all memories
 */
function clearCategoryMemories(userId, category) {
  if (category && category !== 'all') {
    const result = db.prepare('DELETE FROM user_memories WHERE user_id = ? AND category = ?').run(userId, category);
    return { success: true, count: result.changes, category };
  } else {
    const result = db.prepare('DELETE FROM user_memories WHERE user_id = ?').run(userId);
    return { success: true, count: result.changes, category: 'all' };
  }
}

/**
 * Retrieve ONLY relevant context memories for a given query (Semantic & Keyword matcher)
 */
function getRelevantMemoriesForQuery(userId, query) {
  // Check if memory is enabled for user
  const pref = db.prepare('SELECT memory_enabled FROM user_preferences WHERE user_id = ?').get(userId);
  if (pref && pref.memory_enabled === 0) {
    return []; // User disabled memory
  }

  const allActive = db.prepare('SELECT * FROM user_memories WHERE user_id = ? AND is_active = 1').all(userId);
  if (allActive.length === 0) return [];

  const lowerQ = query.toLowerCase();
  const scored = allActive.map(mem => {
    let score = 0;
    const lowerContent = (mem.title + ' ' + mem.content + ' ' + mem.category).toLowerCase();

    // Category boosts
    if ((lowerQ.includes('java') || lowerQ.includes('code') || lowerQ.includes('study') || lowerQ.includes('exam')) && mem.category === 'learning') score += 5;
    if ((lowerQ.includes('career') || lowerQ.includes('job') || lowerQ.includes('developer') || lowerQ.includes('roadmap')) && mem.category === 'career') score += 5;
    if ((lowerQ.includes('food') || lowerQ.includes('diet') || lowerQ.includes('protein') || lowerQ.includes('meal')) && mem.category === 'diet') score += 5;
    if ((lowerQ.includes('workout') || lowerQ.includes('exercise') || lowerQ.includes('fitness') || lowerQ.includes('gym')) && mem.category === 'fitness') score += 5;
    if ((lowerQ.includes('alarm') || lowerQ.includes('remind') || lowerQ.includes('time') || lowerQ.includes('schedule')) && (mem.category === 'schedule' || mem.category === 'tasks')) score += 5;

    // Word matches
    const words = lowerQ.split(/\s+/).filter(w => w.length > 2);
    for (const w of words) {
      if (lowerContent.includes(w)) score += 2;
    }

    // Confirmed facts have higher trust ONLY IF there is already a topical match
    if (score > 0 && mem.is_confirmed_fact) score += 1;

    return { mem, score };
  });

  // Return highest relevance items (up to 4)
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(item => item.mem);
}

module.exports = {
  getMemories,
  addMemory,
  updateMemory,
  toggleMemoryStatus,
  deleteMemory,
  clearCategoryMemories,
  getRelevantMemoriesForQuery
};
