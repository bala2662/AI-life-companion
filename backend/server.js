/**
 * ==============================================================================
 * AI UNIFIED LIFE COMPANION — BACKEND REST API SERVER
 * Built with native Node.js HTTP & SQLite Engine (Prompt Sections 1-18)
 * ==============================================================================
 */

const http = require('node:http');
const url = require('node:url');
const fs = require('node:fs');
const path = require('node:path');

const {
  registerUser, loginUser, getUserProfile, updateUserProfile, verifyToken
} = require('./services/auth_service');

const {
  getMemories, addMemory, updateMemory, toggleMemoryStatus, deleteMemory, clearCategoryMemories
} = require('./services/memory_service');

const {
  processChatMessage
} = require('./services/ai_orchestrator');

const {
  getExamsAndSyllabus, addExam, updateTopicStatus, generateStudyPlan, recalculateMissedSession
} = require('./services/study_planner');

const {
  getReminders, createReminder, parseNaturalLanguageReminder, snoozeReminder, dismissReminder, deleteReminder
} = require('./services/scheduler_service');

const {
  generateWorkoutPlan, generateDietPlan, getYogaAndWellnessRoutines
} = require('./services/fitness_diet_service');

const {
  getCareerRoadmap
} = require('./services/career_service');

const {
  getDocuments, uploadDocument, queryKnowledgeVault, deleteDocument
} = require('./services/vault_service');

const PORT = process.env.PORT || 8000;
const FRONTEND_DIR = path.join(__dirname, '..');

/**
 * MIME Types for static assets
 */
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

/**
 * Helper to send JSON response
 */
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

/**
 * Helper to parse JSON body
 */
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Invalid JSON payload'));
      }
    });
  });
}

/**
 * Extract authenticated user ID from Authorization header or fallback to demo user
 */
function getAuthUserId(req) {
  const auth = req.headers['authorization'];
  if (auth && auth.startsWith('Bearer ')) {
    const token = auth.substring(7);
    const payload = verifyToken(token);
    if (payload && payload.userId) return payload.userId;
  }
  // Default to demo user for smooth local use
  return 'user-alex-1';
}

/**
 * Main HTTP Server Request Listener
 */
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  try {
    // =========================================================================
    // 1. AUTHENTICATION APIs
    // =========================================================================
    if (pathname === '/api/auth/register' && method === 'POST') {
      const body = await parseBody(req);
      const result = registerUser(body);
      return sendJson(res, 201, result);
    }

    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await parseBody(req);
      const result = loginUser(body);
      return sendJson(res, 200, result);
    }

    if (pathname === '/api/auth/me' && method === 'GET') {
      const userId = getAuthUserId(req);
      const profile = getUserProfile(userId);
      return sendJson(res, 200, { user: profile });
    }

    if (pathname === '/api/auth/profile' && method === 'PUT') {
      const userId = getAuthUserId(req);
      const body = await parseBody(req);
      const updated = updateUserProfile(userId, body);
      return sendJson(res, 200, { success: true, profile: updated });
    }

    // =========================================================================
    // 2. PERSONAL MEMORY APIs (Section 2)
    // =========================================================================
    if (pathname === '/api/memory' && method === 'GET') {
      const userId = getAuthUserId(req);
      const category = parsedUrl.query.category || null;
      const memories = getMemories(userId, category);
      return sendJson(res, 200, { memories });
    }

    if (pathname === '/api/memory' && method === 'POST') {
      const userId = getAuthUserId(req);
      const body = await parseBody(req);
      const created = addMemory(userId, body);
      return sendJson(res, 201, { success: true, memory: created });
    }

    if (pathname.startsWith('/api/memory/') && method === 'PUT') {
      const userId = getAuthUserId(req);
      const memoryId = pathname.replace('/api/memory/', '');
      const body = await parseBody(req);
      const updated = updateMemory(userId, memoryId, body);
      return sendJson(res, 200, { success: true, memory: updated });
    }

    if (pathname.startsWith('/api/memory/') && method === 'DELETE') {
      const userId = getAuthUserId(req);
      const memoryId = pathname.replace('/api/memory/', '');
      const result = deleteMemory(userId, memoryId);
      return sendJson(res, 200, result);
    }

    if (pathname === '/api/memory/clear' && method === 'POST') {
      const userId = getAuthUserId(req);
      const body = await parseBody(req);
      const result = clearCategoryMemories(userId, body.category || 'all');
      return sendJson(res, 200, result);
    }

    // =========================================================================
    // 3. UNIFIED CHATBOT & MODULE ROUTER API (Section 3)
    // =========================================================================
    if (pathname === '/api/chat' && method === 'POST') {
      const userId = getAuthUserId(req);
      const body = await parseBody(req);
      if (!body.message) {
        return sendJson(res, 400, { error: 'Message field is required' });
      }
      const chatResponse = await processChatMessage(userId, body.message);
      return sendJson(res, 200, chatResponse);
    }

    // =========================================================================
    // 4. EXAM & STUDY PLANNER APIs (Section 4)
    // =========================================================================
    if (pathname === '/api/planner/exams' && method === 'GET') {
      const userId = getAuthUserId(req);
      const data = getExamsAndSyllabus(userId);
      return sendJson(res, 200, data);
    }

    if (pathname === '/api/planner/exams' && method === 'POST') {
      const userId = getAuthUserId(req);
      const body = await parseBody(req);
      const created = addExam(userId, body);
      return sendJson(res, 201, { success: true, exam: created });
    }

    if (pathname.startsWith('/api/planner/topic/') && method === 'PUT') {
      const userId = getAuthUserId(req);
      const topicId = pathname.replace('/api/planner/topic/', '');
      const body = await parseBody(req);
      const result = updateTopicStatus(userId, topicId, body.status);
      return sendJson(res, 200, result);
    }

    if (pathname === '/api/planner/generate' && method === 'POST') {
      const userId = getAuthUserId(req);
      const body = await parseBody(req);
      const plan = generateStudyPlan(userId, body);
      return sendJson(res, 200, plan);
    }

    if (pathname === '/api/planner/recalculate-missed' && method === 'POST') {
      const userId = getAuthUserId(req);
      const body = await parseBody(req);
      const result = recalculateMissedSession(userId, body);
      return sendJson(res, 200, result);
    }

    // =========================================================================
    // 5. SMART ALARM & REMINDER APIs (Section 5)
    // =========================================================================
    if (pathname === '/api/reminders' && method === 'GET') {
      const userId = getAuthUserId(req);
      const reminders = getReminders(userId);
      return sendJson(res, 200, { reminders });
    }

    if (pathname === '/api/reminders' && method === 'POST') {
      const userId = getAuthUserId(req);
      const body = await parseBody(req);
      let result;
      if (body.naturalCommand) {
        result = parseNaturalLanguageReminder(userId, body.naturalCommand);
      } else {
        const created = createReminder(userId, body);
        result = { success: true, reminder: created };
      }
      return sendJson(res, 201, result);
    }

    if (pathname.includes('/snooze') && method === 'POST') {
      const userId = getAuthUserId(req);
      const parts = pathname.split('/');
      const reminderId = parts[3];
      const body = await parseBody(req);
      const result = snoozeReminder(userId, reminderId, body.minutes || 10);
      return sendJson(res, 200, result);
    }

    if (pathname.includes('/dismiss') && method === 'POST') {
      const userId = getAuthUserId(req);
      const parts = pathname.split('/');
      const reminderId = parts[3];
      const result = dismissReminder(userId, reminderId);
      return sendJson(res, 200, result);
    }

    if (pathname.startsWith('/api/reminders/') && method === 'DELETE') {
      const userId = getAuthUserId(req);
      const reminderId = pathname.replace('/api/reminders/', '');
      const result = deleteReminder(userId, reminderId);
      return sendJson(res, 200, result);
    }

    // =========================================================================
    // 6. FITNESS, DIET & YOGA APIs (Sections 6, 7 & 8)
    // =========================================================================
    if (pathname === '/api/fitness/plan' && method === 'GET') {
      const userId = getAuthUserId(req);
      const plan = generateWorkoutPlan(userId, parsedUrl.query);
      return sendJson(res, 200, plan);
    }

    if (pathname === '/api/diet/plan' && method === 'GET') {
      const userId = getAuthUserId(req);
      const diet = generateDietPlan(userId, parsedUrl.query);
      return sendJson(res, 200, diet);
    }

    if (pathname === '/api/yoga/routines' && method === 'GET') {
      const yoga = getYogaAndWellnessRoutines();
      return sendJson(res, 200, yoga);
    }

    // =========================================================================
    // 7. CAREER DEVELOPMENT API (Section 9)
    // =========================================================================
    if (pathname === '/api/career/roadmap' && method === 'GET') {
      const userId = getAuthUserId(req);
      const role = parsedUrl.query.role || null;
      const roadmap = getCareerRoadmap(userId, role);
      return sendJson(res, 200, roadmap);
    }

    // =========================================================================
    // 8. KNOWLEDGE VAULT & RAG APIs (Section 12)
    // =========================================================================
    if (pathname === '/api/vault/documents' && method === 'GET') {
      const userId = getAuthUserId(req);
      const docs = getDocuments(userId);
      return sendJson(res, 200, { documents: docs });
    }

    if (pathname === '/api/vault/documents' && method === 'POST') {
      const userId = getAuthUserId(req);
      const body = await parseBody(req);
      const uploaded = uploadDocument(userId, body);
      return sendJson(res, 201, { success: true, document: uploaded });
    }

    if (pathname === '/api/vault/query' && method === 'POST') {
      const userId = getAuthUserId(req);
      const body = await parseBody(req);
      const queryResult = queryKnowledgeVault(userId, body.query || '');
      return sendJson(res, 200, queryResult);
    }

    // =========================================================================
    // 9. STATIC FRONTEND FILE SERVING
    // =========================================================================
    let reqFilePath = pathname === '/' ? '/index.html' : pathname;
    const safePath = path.normalize(path.join(FRONTEND_DIR, reqFilePath));

    // Security check: ensure path stays within FRONTEND_DIR
    if (safePath.startsWith(FRONTEND_DIR) && fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
      const ext = path.extname(safePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(safePath).pipe(res);
      return;
    }

    // Fallback: 404 for unknown endpoints
    return sendJson(res, 404, { error: 'Route not found', path: pathname });

  } catch (error) {
    console.error(`[API Error] ${method} ${pathname}:`, error);
    return sendJson(res, 500, { error: error.message || 'Internal Server Error' });
  }
});

// Start Server
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 AI Unified Life Companion Server Running!`);
    console.log(`📍 Web Dashboard: http://localhost:${PORT}`);
    console.log(`📡 REST API Base: http://localhost:${PORT}/api`);
    console.log(`💾 SQLite Database: Node 24 native WAL mode active`);
    console.log(`=======================================================`);
  });
}

module.exports = server;
