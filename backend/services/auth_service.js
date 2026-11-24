/**
 * ==============================================================================
 * AUTHENTICATION SERVICE & SESSION SECURITY
 * Secure password hashing, token verification, and user management
 * ==============================================================================
 */

const crypto = require('node:crypto');
const { db } = require('../db/database');

/**
 * Hash password using PBKDF2 with salt
 */
function hashPassword(password, salt = null) {
  if (!salt) {
    salt = crypto.randomBytes(16).toString('hex');
  }
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 32, 'sha256').toString('hex');
  return `pbkdf2:${salt}:${hash}`;
}

/**
 * Verify password against stored hash (supports both PBKDF2 and demo sha256)
 */
function verifyPassword(password, storedHash) {
  if (storedHash.startsWith('pbkdf2:')) {
    const [, salt, originalHash] = storedHash.split(':');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 32, 'sha256').toString('hex');
    return hash === originalHash;
  } else if (storedHash.startsWith('sha256:')) {
    // Demo hash support
    const target = storedHash.replace('sha256:', '');
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    return hash === target;
  }
  return false;
}

/**
 * Generate lightweight secure session token
 */
function generateToken(userId) {
  const payload = {
    userId,
    ts: Date.now()
  };
  const str = JSON.stringify(payload);
  const signature = crypto.createHmac('sha256', 'life-companion-secret-key-2026').update(str).digest('hex');
  return Buffer.from(str).toString('base64') + '.' + signature;
}

/**
 * Verify session token
 */
function verifyToken(token) {
  try {
    if (!token) return null;
    const [b64, signature] = token.split('.');
    if (!b64 || !signature) return null;
    const str = Buffer.from(b64, 'base64').toString('utf8');
    const expectedSig = crypto.createHmac('sha256', 'life-companion-secret-key-2026').update(str).digest('hex');
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(str);
    // Token valid for 30 days
    if (Date.now() - payload.ts > 30 * 24 * 60 * 60 * 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Register new user
 */
function registerUser({ email, password, name, course, semester }) {
  if (!email || !password || !name) {
    throw new Error('Email, password, and name are required');
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    throw new Error('A user with this email already exists');
  }

  const userId = 'user-' + crypto.randomUUID();
  const pwdHash = hashPassword(password);

  db.prepare(`
    INSERT INTO users (id, email, password_hash, name)
    VALUES (?, ?, ?, ?)
  `).run(userId, email, pwdHash, name);

  db.prepare(`
    INSERT INTO user_profiles (user_id, course, semester)
    VALUES (?, ?, ?)
  `).run(userId, course || 'Computer Science', semester || 'Semester 1');

  db.prepare(`
    INSERT INTO user_preferences (user_id) VALUES (?)
  `).run(userId);

  db.prepare(`
    INSERT INTO notification_settings (user_id) VALUES (?)
  `).run(userId);

  const token = generateToken(userId);
  return {
    token,
    user: {
      id: userId,
      email,
      name,
      course: course || 'Computer Science',
      semester: semester || 'Semester 1'
    }
  };
}

/**
 * Authenticate user
 */
function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error('Email and password required');
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!verifyPassword(password, user.password_hash)) {
    throw new Error('Invalid email or password');
  }

  const profile = db.prepare('SELECT * FROM user_profiles WHERE user_id = ?').get(user.id);
  const preferences = db.prepare('SELECT * FROM user_preferences WHERE user_id = ?').get(user.id);

  const token = generateToken(user.id);
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      profile: profile || {},
      preferences: preferences || {}
    }
  };
}

/**
 * Get user profile and preferences
 */
function getUserProfile(userId) {
  const user = db.prepare('SELECT id, email, name, created_at FROM users WHERE id = ?').get(userId);
  if (!user) return null;
  const profile = db.prepare('SELECT * FROM user_profiles WHERE user_id = ?').get(userId) || {};
  const preferences = db.prepare('SELECT * FROM user_preferences WHERE user_id = ?').get(userId) || {};
  return { ...user, profile, preferences };
}

/**
 * Update user profile
 */
function updateUserProfile(userId, updates) {
  const allowed = [
    'education_level', 'course', 'semester', 'preferred_language',
    'daily_available_hours', 'study_habits', 'career_goal', 'fitness_goal',
    'age', 'height_cm', 'weight_kg', 'activity_level', 'dietary_preference',
    'food_budget', 'allergies', 'meal_timings', 'water_goal_ml', 'sleep_goal_hours'
  ];

  const sets = [];
  const vals = [];

  for (const key of allowed) {
    if (updates[key] !== undefined) {
      sets.push(`${key} = ?`);
      vals.push(updates[key]);
    }
  }

  if (sets.length > 0) {
    vals.push(userId);
    db.prepare(`UPDATE user_profiles SET ${sets.join(', ')} WHERE user_id = ?`).run(...vals);
  }

  if (updates.name) {
    db.prepare('UPDATE users SET name = ? WHERE id = ?').run(updates.name, userId);
  }

  return getUserProfile(userId);
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};
