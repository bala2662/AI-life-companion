/**
 * ==============================================================================
 * KNOWLEDGE VAULT & RAG SERVICE (Section 12)
 * Document indexing, chunking, keyword/semantic retrieval, grounded citation generation
 * ==============================================================================
 */

const crypto = require('node:crypto');
const { db } = require('../db/database');

/**
 * List all documents uploaded by user
 */
function getDocuments(userId) {
  return db.prepare(`
    SELECT id, filename, file_size, uploaded_at 
    FROM uploaded_documents 
    WHERE user_id = ? 
    ORDER BY uploaded_at DESC
  `).all(userId);
}

/**
 * Upload and index a document (text or notes)
 */
function uploadDocument(userId, { filename, contentText }) {
  if (!filename || !contentText) {
    throw new Error('Filename and content text are required');
  }

  const docId = 'doc-' + crypto.randomUUID();
  const fileSize = Buffer.byteLength(contentText, 'utf8');

  // Split into chunks of ~500 characters
  const chunks = [];
  const paragraphs = contentText.split(/\n\s*\n/);
  paragraphs.forEach((p, idx) => {
    const trimmed = p.trim();
    if (trimmed.length > 20) {
      chunks.push({
        chunkId: `${docId}-chunk-${idx + 1}`,
        text: trimmed,
        pageApprox: Math.floor(idx / 3) + 1
      });
    }
  });

  const chunksJson = JSON.stringify(chunks);

  db.prepare(`
    INSERT INTO uploaded_documents (id, user_id, filename, file_size, content_text, chunks_json)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(docId, userId, filename, fileSize, contentText, chunksJson);

  return {
    id: docId,
    filename,
    file_size: fileSize,
    chunkCount: chunks.length
  };
}

/**
 * Retrieve grounded passages for a query (RAG)
 */
function queryKnowledgeVault(userId, query) {
  const docs = db.prepare('SELECT id, filename, chunks_json FROM uploaded_documents WHERE user_id = ?').all(userId);
  if (docs.length === 0) return { matches: [], groundedAnswer: null };

  const queryTerms = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const matchedChunks = [];

  for (const doc of docs) {
    try {
      const chunks = JSON.parse(doc.chunks_json || '[]');
      for (const ch of chunks) {
        let score = 0;
        const lowerText = ch.text.toLowerCase();
        for (const term of queryTerms) {
          if (lowerText.includes(term)) score += 2;
        }
        if (score > 0) {
          matchedChunks.push({
            documentId: doc.id,
            filename: doc.filename,
            pageApprox: ch.pageApprox,
            text: ch.text,
            score
          });
        }
      }
    } catch {
      // Chunk JSON parsing safeguard
    }
  }

  // Sort by score
  matchedChunks.sort((a, b) => b.score - a.score);
  const topMatches = matchedChunks.slice(0, 3);

  return {
    matches: topMatches,
    hasGroundedSources: topMatches.length > 0
  };
}

/**
 * Delete a document
 */
function deleteDocument(userId, docId) {
  const result = db.prepare('DELETE FROM uploaded_documents WHERE id = ? AND user_id = ?').run(docId, userId);
  if (result.changes === 0) throw new Error('Document not found');
  return { success: true, deletedId: docId };
}

module.exports = {
  getDocuments,
  uploadDocument,
  queryKnowledgeVault,
  deleteDocument
};
