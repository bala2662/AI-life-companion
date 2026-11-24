/**
 * ==============================================================================
 * AI UNIFIED LIFE COMPANION — DATABASE ENGINE (node:sqlite)
 * Full Relational Database Schema with 21 Entities (Prompt Section 16)
 * ==============================================================================
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const DB_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = process.env.DB_PATH || path.join(DB_DIR, 'life_companion.sqlite');
const db = new DatabaseSync(DB_PATH);

// Enable WAL mode & foreign keys for performance and data integrity
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

/**
 * Initialize all database tables matching Prompt Section 16
 */
function initDatabase() {
  db.exec(`
    -- 1. Users
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. User Profiles
    CREATE TABLE IF NOT EXISTS user_profiles (
      user_id TEXT PRIMARY KEY,
      education_level TEXT,
      course TEXT,
      semester TEXT,
      preferred_language TEXT DEFAULT 'en',
      daily_available_hours REAL DEFAULT 4.0,
      study_habits TEXT,
      career_goal TEXT DEFAULT 'java_backend',
      fitness_goal TEXT DEFAULT 'general_fitness',
      age INTEGER,
      height_cm REAL,
      weight_kg REAL,
      activity_level TEXT DEFAULT 'moderate',
      dietary_preference TEXT DEFAULT 'flexible',
      food_budget TEXT DEFAULT 'moderate',
      allergies TEXT,
      meal_timings TEXT,
      water_goal_ml INTEGER DEFAULT 2500,
      sleep_goal_hours REAL DEFAULT 7.5,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 3. User Memories (Personal Memory System)
    CREATE TABLE IF NOT EXISTS user_memories (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      category TEXT NOT NULL, -- learning, career, fitness, diet, personal, schedule
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      is_confirmed_fact INTEGER DEFAULT 1, -- 1=fact, 0=ai_suggestion
      is_active INTEGER DEFAULT 1,
      source TEXT DEFAULT 'user_provided', -- user_provided, ai_inferred, uploaded_doc
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 4. Goals
    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL, -- study, career, fitness, wellness, life
      target_date TEXT,
      progress_pct INTEGER DEFAULT 0,
      status TEXT DEFAULT 'in_progress', -- in_progress, completed, overdue, paused
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 5. Skills
    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL, -- programming, framework, tools, soft_skills
      proficiency_level TEXT DEFAULT 'beginner', -- beginner, intermediate, advanced
      verified_by_quiz INTEGER DEFAULT 0,
      notes TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 6. Exams
    CREATE TABLE IF NOT EXISTS exams (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      subject_name TEXT NOT NULL,
      exam_date TEXT NOT NULL,
      exam_time TEXT,
      room TEXT,
      total_marks INTEGER DEFAULT 100,
      prep_priority TEXT DEFAULT 'high',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 7. Subjects
    CREATE TABLE IF NOT EXISTS subjects (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      code TEXT,
      faculty TEXT,
      total_chapters INTEGER DEFAULT 5,
      completed_chapters INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 8. Syllabus Topics
    CREATE TABLE IF NOT EXISTS syllabus_topics (
      id TEXT PRIMARY KEY,
      subject_id TEXT NOT NULL,
      topic_name TEXT NOT NULL,
      difficulty TEXT DEFAULT 'medium', -- easy, medium, hard
      status TEXT DEFAULT 'pending', -- pending, in_progress, completed
      revision_count INTEGER DEFAULT 0,
      last_revised TEXT,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    );

    -- 9. Study Sessions
    CREATE TABLE IF NOT EXISTS study_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      subject_id TEXT,
      topic TEXT NOT NULL,
      scheduled_date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      duration_mins INTEGER DEFAULT 45,
      status TEXT DEFAULT 'scheduled', -- scheduled, completed, missed, rescheduled
      notes TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 10. Calendar Events (Timetable slots & commitments)
    CREATE TABLE IF NOT EXISTS calendar_events (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      day_of_week TEXT, -- Monday, Tuesday, ...
      title TEXT NOT NULL,
      event_type TEXT DEFAULT 'class', -- class, lab, study, exam, break, personal
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      location TEXT,
      alarm_active INTEGER DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 11. Reminders & Alarms (Section 5 Persistent Engine)
    CREATE TABLE IF NOT EXISTS reminders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      reminder_type TEXT DEFAULT 'custom', -- study, assignment, fitness, meal, hydration, yoga, sleep, custom
      trigger_time TEXT NOT NULL, -- ISO or HH:MM
      recurring_days TEXT, -- JSON array e.g. ["Mon", "Wed"]
      tone TEXT DEFAULT 'chime', -- chime, digital, bell, radar
      is_active INTEGER DEFAULT 1,
      snoozed_until TEXT,
      acknowledged_at TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 12. Tasks
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      goal_id TEXT,
      title TEXT NOT NULL,
      priority TEXT DEFAULT 'medium', -- low, medium, high
      due_date TEXT,
      completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 13. Workout Plans
    CREATE TABLE IF NOT EXISTS workout_plans (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      level TEXT DEFAULT 'beginner', -- beginner, intermediate, advanced
      environment TEXT DEFAULT 'home', -- home, gym
      schedule_days TEXT, -- JSON array
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 14. Workout Sessions
    CREATE TABLE IF NOT EXISTS workout_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      plan_id TEXT,
      exercise_name TEXT NOT NULL,
      sets INTEGER DEFAULT 3,
      reps INTEGER DEFAULT 12,
      duration_mins INTEGER DEFAULT 20,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 15. Meal Plans
    CREATE TABLE IF NOT EXISTS meal_plans (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      day_of_week TEXT,
      meal_type TEXT NOT NULL, -- breakfast, lunch, dinner, snack
      meal_name TEXT NOT NULL,
      protein_grams REAL DEFAULT 0,
      budget_tier TEXT DEFAULT 'budget', -- budget, moderate, premium
      recipe_tips TEXT,
      is_completed INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 16. Wellness Activities (Yoga, Breathing, Posture)
    CREATE TABLE IF NOT EXISTS wellness_activities (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      activity_name TEXT NOT NULL,
      category TEXT DEFAULT 'yoga', -- yoga, breathing, meditation, desk_stretch
      duration_mins INTEGER DEFAULT 10,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 17. Learning Roadmaps
    CREATE TABLE IF NOT EXISTS learning_roadmaps (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      target_role TEXT NOT NULL,
      current_milestone TEXT,
      progress_pct INTEGER DEFAULT 0,
      modules_json TEXT, -- JSON array of milestones and topics
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 18. Uploaded Documents (Knowledge Vault & RAG)
    CREATE TABLE IF NOT EXISTS uploaded_documents (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      filename TEXT NOT NULL,
      file_size INTEGER,
      content_text TEXT,
      chunks_json TEXT, -- Extracted text chunks for retrieval
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 19. Progress Records
    CREATE TABLE IF NOT EXISTS progress_records (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      metric_type TEXT NOT NULL, -- study_hours, tasks_done, water_ml, sleep_hours, workout_sessions
      metric_val REAL NOT NULL,
      record_date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 20. User Preferences
    CREATE TABLE IF NOT EXISTS user_preferences (
      user_id TEXT PRIMARY KEY,
      theme TEXT DEFAULT 'light',
      memory_enabled INTEGER DEFAULT 1,
      sound_enabled INTEGER DEFAULT 1,
      voice_readout INTEGER DEFAULT 1,
      language TEXT DEFAULT 'en',
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 21. Notification Settings
    CREATE TABLE IF NOT EXISTS notification_settings (
      user_id TEXT PRIMARY KEY,
      browser_notifications INTEGER DEFAULT 1,
      alarm_audio INTEGER DEFAULT 1,
      reminder_offset_mins INTEGER DEFAULT 10,
      quiet_hours_start TEXT DEFAULT '22:30',
      quiet_hours_end TEXT DEFAULT '06:30',
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  seedDefaultDemoData();
}

/**
 * Seed initial sample data for quick testing and demonstration
 */
function seedDefaultDemoData() {
  const userCheck = db.prepare('SELECT id FROM users WHERE email = ?').get('alex.smith@university.edu');
  if (userCheck) return; // already seeded

  const demoUserId = 'user-alex-1';
  // Password hash for 'password123' (simplified demo hash)
  const passHash = 'sha256:ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f';

  const insertUser = db.prepare(`
    INSERT INTO users (id, email, password_hash, name)
    VALUES (?, ?, ?, ?)
  `);
  insertUser.run(demoUserId, 'alex.smith@university.edu', passHash, 'Alex Smith');

  const insertProfile = db.prepare(`
    INSERT INTO user_profiles (
      user_id, education_level, course, semester, preferred_language,
      daily_available_hours, career_goal, fitness_goal, water_goal_ml, sleep_goal_hours,
      dietary_preference, food_budget
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertProfile.run(
    demoUserId, 'Undergraduate', 'Computer Science & Engineering', 'Semester 3',
    'en', 4.0, 'java_backend', 'lean_muscle', 2500, 7.5, 'non_veg', 'budget'
  );

  const insertPref = db.prepare(`
    INSERT INTO user_preferences (user_id, theme, memory_enabled, sound_enabled, voice_readout, language)
    VALUES (?, 'light', 1, 1, 1, 'en')
  `);
  insertPref.run(demoUserId);

  const insertNotif = db.prepare(`
    INSERT INTO notification_settings (user_id, browser_notifications, alarm_audio, reminder_offset_mins)
    VALUES (?, 1, 1, 5)
  `);
  insertNotif.run(demoUserId);

  // Insert Core Memories
  const insertMem = db.prepare(`
    INSERT INTO user_memories (id, user_id, category, title, content, is_confirmed_fact, is_active, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertMem.run(
    'mem-1', demoUserId, 'learning', 'Java Knowledge Level',
    'Beginner in Java programming. Knows basic loops, variables, conditionals. Currently mastering Object-Oriented Programming (Classes, Inheritance, Polymorphism).',
    1, 1, 'user_provided'
  );

  insertMem.run(
    'mem-2', demoUserId, 'career', 'Career Target & Goal',
    'Aims to become a Full-Stack / Java Backend Developer. Daily dedicated study capacity is 1 to 2 hours.',
    1, 1, 'user_provided'
  );

  insertMem.run(
    'mem-3', demoUserId, 'diet', 'Food Budget & Preferences',
    'Prefers affordable high-protein meals (eggs, lentils, chicken, soya chunks). Budget is student-friendly.',
    1, 1, 'user_provided'
  );

  insertMem.run(
    'mem-4', demoUserId, 'fitness', 'Workout Environment',
    'Home workout with light dumbbells and bodyweight resistance. Prefers morning 20-minute routines.',
    1, 1, 'user_provided'
  );

  // Insert Exams
  const insertExam = db.prepare(`
    INSERT INTO exams (id, user_id, subject_name, exam_date, exam_time, room, prep_priority)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertExam.run('exam-1', demoUserId, 'Object-Oriented Programming with Java', '2026-11-15', '10:00', 'Hall 4B', 'high');
  insertExam.run('exam-2', demoUserId, 'Database Management Systems (DBMS)', '2026-11-20', '14:00', 'Hall 2A', 'medium');

  // Insert Subjects & Topics
  const insertSubject = db.prepare('INSERT INTO subjects (id, user_id, name, code, total_chapters, completed_chapters) VALUES (?, ?, ?, ?, ?, ?)');
  insertSubject.run('sub-1', demoUserId, 'Java Programming', 'CS301', 5, 2);

  const insertTopic = db.prepare('INSERT INTO syllabus_topics (id, subject_id, topic_name, difficulty, status) VALUES (?, ?, ?, ?, ?)');
  insertTopic.run('top-1', 'sub-1', 'Classes & Objects', 'easy', 'completed');
  insertTopic.run('top-2', 'sub-1', 'Inheritance & Method Overriding', 'medium', 'completed');
  insertTopic.run('top-3', 'sub-1', 'Polymorphism & Abstract Classes', 'hard', 'in_progress');
  insertTopic.run('top-4', 'sub-1', 'Interfaces & Packages', 'medium', 'pending');
  insertTopic.run('top-5', 'sub-1', 'Exception Handling & File I/O', 'hard', 'pending');

  // Insert Timetable Events
  const insertEvent = db.prepare(`
    INSERT INTO calendar_events (id, user_id, day_of_week, title, event_type, start_time, end_time, location, alarm_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertEvent.run('tt-1', demoUserId, 'Monday', 'Java OOP Lecture', 'class', '09:00', '10:30', 'Room 302', 1);
  insertEvent.run('tt-2', demoUserId, 'Monday', 'Data Structures Lab', 'lab', '11:00', '13:00', 'Lab 2', 1);
  insertEvent.run('tt-3', demoUserId, 'Wednesday', 'DBMS Lecture', 'class', '14:00', '15:30', 'Room 105', 1);
  insertEvent.run('tt-4', demoUserId, 'Friday', 'Full Stack Workshop', 'class', '10:00', '12:00', 'Seminar Hall', 1);

  // Insert Default Reminders
  const insertReminder = db.prepare(`
    INSERT INTO reminders (id, user_id, title, reminder_type, trigger_time, recurring_days, tone, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertReminder.run('rem-1', demoUserId, 'Morning Java Study Alarm', 'study', '06:00', '["Mon","Tue","Wed","Thu","Fri"]', 'chime', 1);
  insertReminder.run('rem-2', demoUserId, 'Hydration Check - Drink Water', 'hydration', '10:00', '["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]', 'digital', 1);
  insertReminder.run('rem-3', demoUserId, 'Evening Workout Routine', 'fitness', '18:00', '["Mon","Wed","Fri"]', 'bell', 1);

  // Insert Sample Tasks
  const insertTask = db.prepare('INSERT INTO tasks (id, user_id, title, priority, due_date, completed) VALUES (?, ?, ?, ?, ?, ?)');
  insertTask.run('task-1', demoUserId, 'Complete Java Abstract Classes Exercise', 'high', '2026-10-28', 0);
  insertTask.run('task-2', demoUserId, 'Read DBMS Normalization Chapter 3', 'medium', '2026-10-30', 0);
  insertTask.run('task-3', demoUserId, 'Drink 2.5L Water Goal', 'low', '2026-10-26', 1);

  // Insert Meal Plans
  const insertMeal = db.prepare('INSERT INTO meal_plans (id, user_id, day_of_week, meal_type, meal_name, protein_grams, budget_tier, recipe_tips) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  insertMeal.run('meal-1', demoUserId, 'Daily', 'Breakfast', '2 Boiled Eggs + Oats / Idli with Sambar', 16, 'budget', 'Affordable protein source, quick prep');
  insertMeal.run('meal-2', demoUserId, 'Daily', 'Lunch', 'Brown Rice / Rice + Dal (Lentils) + Soya Chunks Curry', 24, 'budget', 'High protein plant-based budget combination');
  insertMeal.run('meal-3', demoUserId, 'Daily', 'Dinner', 'Chapati + Paneer / Chicken Stir-Fry + Steamed Veggies', 28, 'moderate', 'Light digestible carbs before sleep');
  insertMeal.run('meal-4', demoUserId, 'Daily', 'Snack', 'Roasted Peanuts & Sprout Chaat', 12, 'budget', 'Clean energy booster for afternoon study');
}

// Initialize tables and demo data on load
initDatabase();

module.exports = {
  db,
  initDatabase
};
