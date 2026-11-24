-- =============================================================================
-- AI UNIFIED LIFE COMPANION — DATABASE SCHEMA & INITIAL DATA
-- Database Name: ai_life_companion
-- Character Set: utf8mb4 / utf8mb4_unicode_ci
-- Target Platform: MySQL 8+ / MariaDB 10.4+ / XAMPP phpMyAdmin
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `ai_life_companion` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `ai_life_companion`;

-- Disable foreign key checks during table setup
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. USERS & AUTHENTICATION
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'student',
  `avatar` VARCHAR(255) DEFAULT 'AS',
  `learning_level` VARCHAR(50) DEFAULT 'Beginner (Java)',
  `language_pref` VARCHAR(10) DEFAULT 'en',
  `streak_count` INT UNSIGNED DEFAULT 14,
  `synergy_score` INT UNSIGNED DEFAULT 88,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`),
  KEY `idx_users_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. USER PROFILES (Academic, Daily, Preferences)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `user_profiles`;
CREATE TABLE `user_profiles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `age` TINYINT UNSIGNED DEFAULT 20,
  `height_cm` DECIMAL(5,2) DEFAULT NULL,
  `weight_kg` DECIMAL(5,2) DEFAULT NULL,
  `education_level` VARCHAR(100) DEFAULT 'Bachelor of Engineering (CSE)',
  `course` VARCHAR(100) DEFAULT 'Computer Science',
  `semester` VARCHAR(50) DEFAULT 'Year 2, Semester 3',
  `target_career` VARCHAR(100) DEFAULT 'Junior Java / Spring Boot Backend Engineer',
  `daily_available_hours` DECIMAL(4,2) DEFAULT 6.00,
  `sleep_goal_hours` DECIMAL(4,2) DEFAULT 7.50,
  `water_goal_ml` INT UNSIGNED DEFAULT 2500,
  `dietary_pref` VARCHAR(50) DEFAULT 'Vegetarian / Budget Friendly',
  `budget_level` VARCHAR(50) DEFAULT 'Student Budget (₹100 - ₹200 / day)',
  `explanation_style` VARCHAR(100) DEFAULT 'Visual analogies, simple real-world examples & runnable code',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_profile_user` (`user_id`),
  CONSTRAINT `fk_profile_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. PERSISTENT PERSONAL MEMORY
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `personal_memories`;
CREATE TABLE `personal_memories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `category` ENUM('learning','health','tasks','career','profile') NOT NULL DEFAULT 'learning',
  `title` VARCHAR(150) NOT NULL,
  `content` TEXT NOT NULL,
  `is_confirmed_fact` TINYINT(1) NOT NULL DEFAULT 1,
  `confidence` DECIMAL(3,2) NOT NULL DEFAULT 1.00,
  `tags` VARCHAR(255) DEFAULT '',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_mem_user_cat` (`user_id`, `category`),
  KEY `idx_mem_active` (`is_active`),
  CONSTRAINT `fk_mem_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. CONVERSATIONS & CHAT MESSAGES
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `conversations`;
CREATE TABLE `conversations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL DEFAULT 'Study & Life Session',
  `intent` VARCHAR(50) DEFAULT 'Education',
  `domain` VARCHAR(50) DEFAULT 'General',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_conv_user` (`user_id`),
  CONSTRAINT `fk_conv_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `chat_messages`;
CREATE TABLE `chat_messages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `conversation_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `sender_type` ENUM('user','assistant') NOT NULL,
  `message_text` LONGTEXT NOT NULL,
  `context_retrieved` TEXT DEFAULT NULL,
  `reasoning_meta` TEXT DEFAULT NULL,
  `tokens_used` INT UNSIGNED DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_msg_conv` (`conversation_id`),
  KEY `idx_msg_user` (`user_id`),
  KEY `idx_msg_created` (`created_at`),
  CONSTRAINT `fk_msg_conv` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_msg_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. TIMETABLE & COLLEGE SCHEDULE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `timetable_slots`;
CREATE TABLE `timetable_slots` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `day_of_week` ENUM('Mon','Tue','Wed','Thu','Fri','Sat','Sun') NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `subject_code` VARCHAR(50) NOT NULL,
  `subject_name` VARCHAR(150) NOT NULL,
  `room` VARCHAR(50) DEFAULT '',
  `instructor` VARCHAR(100) DEFAULT '',
  `slot_type` VARCHAR(50) DEFAULT 'Lecture',
  `alarm_enabled` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tt_user_day` (`user_id`, `day_of_week`),
  CONSTRAINT `fk_tt_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. TASKS & COMMITMENTS
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(50) DEFAULT 'academic',
  `priority` ENUM('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  `due_date` DATE DEFAULT NULL,
  `due_time` TIME DEFAULT NULL,
  `estimated_minutes` INT UNSIGNED DEFAULT 45,
  `is_completed` TINYINT(1) NOT NULL DEFAULT 0,
  `completed_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tasks_user_status` (`user_id`, `is_completed`),
  KEY `idx_tasks_due` (`due_date`),
  CONSTRAINT `fk_tasks_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. STUDY PLANS & SYLLABUS TRACKING
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `study_plans`;
CREATE TABLE `study_plans` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `subject_code` VARCHAR(50) NOT NULL,
  `subject_name` VARCHAR(150) NOT NULL,
  `target_exam_date` DATE NOT NULL,
  `daily_available_hours` DECIMAL(4,2) DEFAULT 3.00,
  `total_portions` INT UNSIGNED DEFAULT 10,
  `completed_portions` INT UNSIGNED DEFAULT 6,
  `plan_json` LONGTEXT DEFAULT NULL,
  `status` ENUM('active','completed','archived') DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_study_user` (`user_id`),
  CONSTRAINT `fk_study_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7B. STUDY NOTES & SUMMARIES
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `study_notes`;
CREATE TABLE `study_notes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `subject` VARCHAR(100) DEFAULT 'General',
  `content` TEXT NOT NULL,
  `summary` TEXT DEFAULT NULL,
  `tags` VARCHAR(255) DEFAULT '',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notes_user` (`user_id`),
  CONSTRAINT `fk_notes_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8. FITNESS PROFILES
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `fitness_profiles`;
CREATE TABLE `fitness_profiles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `experience_level` ENUM('beginner','intermediate','advanced') NOT NULL DEFAULT 'beginner',
  `workout_goal` VARCHAR(150) NOT NULL DEFAULT 'Build functional strength, improve stamina, reduce desk fatigue',
  `equipment_available` VARCHAR(255) NOT NULL DEFAULT 'Bodyweight, Resistance Bands, Chair / Desk',
  `workout_location` ENUM('home','gym','outdoors') NOT NULL DEFAULT 'home',
  `available_minutes_per_day` INT UNSIGNED NOT NULL DEFAULT 30,
  `workout_days_per_week` TINYINT UNSIGNED NOT NULL DEFAULT 4,
  `physical_limitations` TEXT DEFAULT 'Mild lower back stiffness from long sitting sessions, no prior knee injuries',
  `injuries` TEXT DEFAULT 'None',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_fit_user` (`user_id`),
  CONSTRAINT `fk_fit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 9. COMPLETE EXERCISE LIBRARY (All 8 Categories)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `exercise_library`;
CREATE TABLE `exercise_library` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `muscle_group` ENUM('chest','back','shoulders','arms','legs','core','cardio','recovery') NOT NULL,
  `difficulty` ENUM('beginner','intermediate','advanced') NOT NULL DEFAULT 'beginner',
  `equipment` VARCHAR(100) NOT NULL DEFAULT 'Bodyweight',
  `correct_technique` TEXT NOT NULL,
  `step_by_step` TEXT NOT NULL,
  `target_sets` TINYINT UNSIGNED NOT NULL DEFAULT 3,
  `target_reps` VARCHAR(50) NOT NULL DEFAULT '10-12 reps',
  `duration_sec` INT UNSIGNED DEFAULT 0,
  `rest_sec` INT UNSIGNED NOT NULL DEFAULT 60,
  `safety_guidance` TEXT NOT NULL,
  `easier_variation` VARCHAR(150) DEFAULT NULL,
  `harder_variation` VARCHAR(150) DEFAULT NULL,
  `icon` VARCHAR(20) DEFAULT '🏋️',
  `demo_tip` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ex_muscle` (`muscle_group`),
  KEY `idx_ex_diff` (`difficulty`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 10. WORKOUT PLANS & ACTIVE SESSIONS
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `workout_plans`;
CREATE TABLE `workout_plans` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `split_type` VARCHAR(50) NOT NULL DEFAULT 'Full Body',
  `plan_json` LONGTEXT NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_wplan_user` (`user_id`),
  CONSTRAINT `fk_wplan_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `workout_sessions`;
CREATE TABLE `workout_sessions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `plan_id` INT UNSIGNED DEFAULT NULL,
  `workout_title` VARCHAR(150) NOT NULL,
  `duration_minutes` INT UNSIGNED NOT NULL DEFAULT 25,
  `perceived_effort` TINYINT UNSIGNED NOT NULL DEFAULT 7 COMMENT 'Scale 1-10',
  `energy_level` ENUM('low','moderate','high') NOT NULL DEFAULT 'moderate',
  `soreness_feedback` VARCHAR(255) DEFAULT 'Normal muscle activation, no joint pain',
  `notes` TEXT DEFAULT NULL,
  `completed_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_wsess_user` (`user_id`),
  CONSTRAINT `fk_wsess_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `workout_session_logs`;
CREATE TABLE `workout_session_logs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `session_id` INT UNSIGNED NOT NULL,
  `exercise_id` INT UNSIGNED DEFAULT NULL,
  `exercise_name` VARCHAR(100) NOT NULL,
  `set_number` TINYINT UNSIGNED NOT NULL,
  `reps_completed` TINYINT UNSIGNED NOT NULL,
  `weight_kg` DECIMAL(5,2) DEFAULT 0.00,
  `feedback` ENUM('too_easy','suitable','too_difficult','uncomfortable') NOT NULL DEFAULT 'suitable',
  PRIMARY KEY (`id`),
  KEY `idx_wslog_sess` (`session_id`),
  CONSTRAINT `fk_wslog_sess` FOREIGN KEY (`session_id`) REFERENCES `workout_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 11. MEAL PREFERENCES & DIET PLANS (Indian Student Budget Focus)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `meal_preferences`;
CREATE TABLE `meal_preferences` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `diet_type` ENUM('veg','non_veg','vegan','egg') NOT NULL DEFAULT 'veg',
  `budget_type` ENUM('student_budget','moderate','flexible') NOT NULL DEFAULT 'student_budget',
  `daily_cost_limit_inr` INT UNSIGNED NOT NULL DEFAULT 150,
  `protein_target_g` INT UNSIGNED NOT NULL DEFAULT 65,
  `calories_target` INT UNSIGNED NOT NULL DEFAULT 2200,
  `allergies` VARCHAR(255) DEFAULT 'None',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_mealpref_user` (`user_id`),
  CONSTRAINT `fk_mealpref_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `meal_plans`;
CREATE TABLE `meal_plans` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `day_of_week` ENUM('Mon','Tue','Wed','Thu','Fri','Sat','Sun') NOT NULL,
  `meal_type` ENUM('breakfast','lunch','dinner','snack') NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `ingredients` TEXT NOT NULL,
  `prep_steps` TEXT NOT NULL,
  `approx_protein_g` DECIMAL(4,1) NOT NULL DEFAULT 15.0,
  `approx_calories` INT UNSIGNED NOT NULL DEFAULT 450,
  `approx_cost_inr` INT UNSIGNED NOT NULL DEFAULT 40,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_mplan_user_day` (`user_id`, `day_of_week`),
  CONSTRAINT `fk_mplan_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 12. CAREER PROFILES & INTERVIEW PRACTICE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `career_profiles`;
CREATE TABLE `career_profiles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `target_role` VARCHAR(150) NOT NULL DEFAULT 'Junior Java / Spring Boot Backend Engineer',
  `current_skills` TEXT NOT NULL,
  `desired_skills` TEXT NOT NULL,
  `experience_summary` TEXT DEFAULT NULL,
  `resume_notes` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_career_user` (`user_id`),
  CONSTRAINT `fk_career_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `career_interviews`;
CREATE TABLE `career_interviews` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `topic` VARCHAR(100) NOT NULL,
  `question` TEXT NOT NULL,
  `user_answer` TEXT NOT NULL,
  `ai_score` DECIMAL(3,1) NOT NULL DEFAULT 8.0,
  `ai_feedback` TEXT NOT NULL,
  `suggested_answer` TEXT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cint_user` (`user_id`),
  CONSTRAINT `fk_cint_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 13. REMINDERS & ALARMS
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `reminders`;
CREATE TABLE `reminders` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `category` ENUM('alarm','study','hydration','posture','eye_rest','workout','meal','exam') NOT NULL DEFAULT 'study',
  `reminder_time` TIME NOT NULL,
  `repeat_days` VARCHAR(100) NOT NULL DEFAULT 'Mon,Tue,Wed,Thu,Fri',
  `sound_enabled` TINYINT(1) NOT NULL DEFAULT 1,
  `tone` VARCHAR(50) DEFAULT 'chime',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `last_triggered_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_rem_user_active` (`user_id`, `is_active`),
  CONSTRAINT `fk_rem_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 14. HEALTH HABITS & DAILY STREAKS
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `user_habits`;
CREATE TABLE `user_habits` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `habit_key` VARCHAR(50) NOT NULL,
  `habit_name` VARCHAR(100) NOT NULL,
  `target_daily_count` INT UNSIGNED NOT NULL DEFAULT 1,
  `current_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `unit` VARCHAR(50) DEFAULT 'times',
  `last_logged_date` DATE NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_habit_user_key_date` (`user_id`, `habit_key`, `last_logged_date`),
  CONSTRAINT `fk_habit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 15. PASSWORD RESETS
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `password_resets`;
CREATE TABLE `password_resets` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(150) NOT NULL,
  `token` VARCHAR(100) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pwd_reset_token` (`token`),
  KEY `idx_pwd_reset_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 16. UPLOADED STUDY DOCUMENTS & RAG CHUNKS
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `uploaded_documents`;
CREATE TABLE `uploaded_documents` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `file_type` VARCHAR(50) DEFAULT 'pdf',
  `file_size` INT UNSIGNED DEFAULT 0,
  `page_count` INT UNSIGNED DEFAULT 1,
  `chunks_json` LONGTEXT NOT NULL,
  `summary` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_doc_user` (`user_id`),
  CONSTRAINT `fk_doc_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- SEED DATA
-- =============================================================================

-- Seed User: Alex Smith (alex@alife.local / Alex@12345 and alex.smith@university.edu / password123)
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `avatar`, `learning_level`, `language_pref`, `streak_count`, `synergy_score`)
VALUES 
  (1, 'Alex Smith', 'alex@alife.local', '$2y$10$foTuV6wnn132SKXoheffe.AyPdZ24txLuT677JSzt1U/Cu5Llxk5e', 'student', 'AS', 'Beginner (Java)', 'en', 14, 88),
  (2, 'Alex Smith', 'alex.smith@university.edu', '$2y$10$E.3Bq74W5qiRToLuc7QzyuRXKy3U40H3KamXPoW7WAwZfS0XCKjoS', 'student', 'AS', 'Beginner (Java)', 'en', 14, 88)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Seed Profile
INSERT INTO `user_profiles` (`user_id`, `age`, `height_cm`, `weight_kg`, `education_level`, `course`, `semester`, `target_career`, `daily_available_hours`, `sleep_goal_hours`, `water_goal_ml`, `dietary_pref`, `budget_level`, `explanation_style`)
VALUES (1, 20, 172.50, 68.00, 'Bachelor of Technology', 'Computer Science and Engineering', 'Year 2, Semester 3', 'Junior Java / Spring Boot Backend Engineer', 6.00, 7.50, 2500, 'Vegetarian / Budget Friendly', 'Student Budget (₹120 - ₹180 / day)', 'Visual analogies, simple real-world examples & runnable code')
ON DUPLICATE KEY UPDATE `target_career`=VALUES(`target_career`);

-- Seed Personal Memories
INSERT INTO `personal_memories` (`user_id`, `category`, `title`, `content`, `is_confirmed_fact`, `confidence`, `tags`, `is_active`)
VALUES
(1, 'learning', 'Java Beginner Knowledge', 'Current programming background: Learned C fundamentals; now beginner level in Java (familiar with basic syntax, learning OOP inheritance, polymorphism, and collections).', 1, 1.00, 'java, programming, beginner, oop', 1),
(1, 'learning', 'Mid-Term Exam Schedule', 'Object-Oriented Programming (CS301) Mid-Term Exam scheduled on November 15, 2026. Weak topics: Dynamic Method Dispatch, Abstract Classes, and Interface Diamond Problem.', 1, 1.00, 'exam, dates, java, weak_topics', 1),
(1, 'tasks', 'Daily Productivity Schedule', 'Available dedicated study time: 1.5 hours on weekdays (4:30 PM - 6:00 PM), 3 hours on weekends. Prefer 25-minute Pomodoro focus blocks.', 1, 1.00, 'schedule, pomodoro, available_time', 1),
(1, 'health', 'Hydration & Sleep Targets', 'Health limits and wellness goals: Target 2,500 ml daily water intake. Fixed 7.5 hours nightly sleep schedule (11:00 PM to 6:30 AM). Sensitive to eye strain after 2 hours screen time.', 1, 1.00, 'water, hydration, sleep, wellness', 1),
(1, 'career', 'Junior Java Backend Roadmap', 'Career milestone: Target placement as Junior Java / Spring Boot Backend Engineer within 8 months. Current goal: Build a full REST API with MySQL persistence.', 1, 1.00, 'career, backend, java, spring_boot, jobs', 1),
(1, 'health', 'Budget Student Diet Preference', 'Vegetarian food preference; strictly budget-friendly student meals (dal, sprouts, eggs/paneer, seasonal vegetables, banana, peanuts) under ₹150/day.', 1, 1.00, 'diet, food, vegetarian, budget', 1);

-- Seed Initial Conversation & Messages
INSERT INTO `conversations` (`id`, `user_id`, `title`, `intent`, `domain`)
VALUES (1, 1, 'Java OOP & Study Onboarding', 'Education', 'Academic Study');

INSERT INTO `chat_messages` (`conversation_id`, `user_id`, `sender_type`, `message_text`, `context_retrieved`, `reasoning_meta`)
VALUES
(1, 1, 'user', 'Enakku Java beginner level-la theriyum. Full Stack Developer aaganum. Daily one hour time irukku.', NULL, NULL),
(1, 1, 'assistant', 'Hello Alex! I have updated my persistent memory with your details: **Java Beginner**, **Junior Backend / Full Stack Goal**, and **1 hour daily time**.

Here is your customized starting strategy:
1. **Core Java Foundations (Month 1-2):** Master Object-Oriented Principles (Inheritance, Polymorphism, Abstraction, Encapsulation) and Exception Handling.
2. **Databases & SQL (Month 3):** Relational schema design with MySQL, foreign keys, and JDBC connections.
3. **Spring Boot REST APIs (Month 4-5):** Build modular backend services with Spring Data JPA.

I will tailor all subsequent explanations to your Beginner level with simple analogies and code examples!', 'Java Beginner Knowledge; Junior Java Backend Roadmap', 'Intent: Education | Retrieved 2 memories | Confidence 1.0');

-- Seed Timetable Slots
INSERT INTO `timetable_slots` (`user_id`, `day_of_week`, `start_time`, `end_time`, `subject_code`, `subject_name`, `room`, `instructor`, `slot_type`)
VALUES
(1, 'Mon', '09:00:00', '10:30:00', 'CS301', 'Data Structures & Algorithms', 'Hall B3', 'Prof. Harrison', 'Lecture'),
(1, 'Mon', '11:00:00', '12:30:00', 'CS302', 'Object Oriented Programming (Java)', 'Lab 204', 'Dr. Sundaram', 'Lab'),
(1, 'Tue', '09:00:00', '10:30:00', 'CS303', 'Database Management Systems', 'Hall A1', 'Dr. Radhakrishnan', 'Lecture'),
(1, 'Tue', '11:00:00', '12:30:00', 'CS304', 'Discrete Mathematics', 'Room 102', 'Prof. Wilson', 'Lecture'),
(1, 'Wed', '09:00:00', '10:30:00', 'CS301', 'Data Structures & Algorithms', 'Hall B3', 'Prof. Harrison', 'Lecture'),
(1, 'Wed', '14:00:00', '16:00:00', 'CS302', 'Java OOP Programming Lab', 'Lab 204', 'Dr. Sundaram', 'Lab'),
(1, 'Thu', '09:00:00', '10:30:00', 'CS303', 'Database Management Systems Lab', 'Lab 101', 'Dr. Radhakrishnan', 'Lab'),
(1, 'Fri', '10:00:00', '11:30:00', 'CS305', 'Web Development & Scripting', 'Room 205', 'Prof. Alagappan', 'Lecture');

-- Seed Tasks
INSERT INTO `tasks` (`user_id`, `title`, `category`, `priority`, `due_date`, `due_time`, `estimated_minutes`, `is_completed`)
VALUES
(1, 'Complete Java OOP Lab 4: Inheritance Exercise', 'academic', 'urgent', CURDATE(), '23:59:00', 45, 0),
(1, 'Read Chapter 5: DBMS Normalization (1NF, 2NF, 3NF)', 'academic', 'high', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '18:00:00', 60, 0),
(1, 'DSA Practice: Implement Singly Linked List in Java', 'academic', 'medium', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '20:00:00', 40, 0),
(1, 'Complete 25-minute Morning Mobility & Yoga Session', 'health', 'medium', CURDATE(), '07:15:00', 25, 1),
(1, 'Review Spring Boot REST Controller tutorial', 'career', 'low', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '21:00:00', 30, 0);

-- Seed Study Plan
INSERT INTO `study_plans` (`user_id`, `subject_code`, `subject_name`, `target_exam_date`, `daily_available_hours`, `total_portions`, `completed_portions`, `status`, `plan_json`)
VALUES
(1, 'CS302', 'Object-Oriented Programming with Java', '2026-11-15', 2.00, 8, 4, 'active', 
'{"chapters":[{"name":"Classes & Constructors","status":"completed"},{"name":"Method Overloading & Overriding","status":"completed"},{"name":"Inheritance & Polymorphism","status":"completed"},{"name":"Interfaces & Packages","status":"in_progress"},{"name":"Exception Handling (try-catch-finally)","status":"pending"},{"name":"Java Collections Framework (List, Set, Map)","status":"pending"},{"name":"Generics & File I/O","status":"pending"},{"name":"Multithreading Basics","status":"pending"}]}');

-- =============================================================================
-- COMPLETE EXERCISE LIBRARY SEED (Prompt Section 9.B - 8 Muscle Groups)
-- =============================================================================
INSERT INTO `exercise_library` 
(`id`, `name`, `muscle_group`, `difficulty`, `equipment`, `correct_technique`, `step_by_step`, `target_sets`, `target_reps`, `duration_sec`, `rest_sec`, `safety_guidance`, `easier_variation`, `harder_variation`, `icon`, `demo_tip`)
VALUES
-- CHEST
(1, 'Standard Push-Ups', 'chest', 'intermediate', 'Bodyweight',
'Maintain rigid straight body line from head to heels. Elbows tucked at 45-degree angle, not flared 90 degrees.',
'1. Begin in high plank position with hands slightly wider than shoulder-width.\n2. Inhale and lower your chest until it is 2 inches above the ground.\n3. Exhale and drive through your palms back to starting position.\n4. Keep core and glutes squeezed throughout.',
3, '10-15 reps', 0, 60,
'Do not let lower back sag or hips hike upwards. Stop if you feel front shoulder pinching.',
'Knee Push-Ups', 'Decline Push-Ups', '💪', 'Keep neck neutral by looking 6 inches ahead of your hands.'),

(2, 'Knee Push-Ups', 'chest', 'beginner', 'Bodyweight',
'Pivot from knees while maintaining a straight line from crown of head to knees. Squeeze abs tight.',
'1. Kneel on a mat with hands slightly wider than shoulders.\n2. Walk knees back so torso forms a 45-degree slope.\n3. Lower chest towards the floor smoothly.\n4. Push up with controlled power.',
3, '8-12 reps', 0, 45,
'Place a soft mat under knees to avoid kneecap pressure.',
'Wall Push-Ups', 'Standard Push-Ups', '🧘', 'Great for building initial chest and triceps pressing strength.'),

(3, 'Incline Push-Ups', 'chest', 'beginner', 'Desk or Sturdy Chair',
'Hands placed on an elevated surface like a study desk or sturdy bench. Reduces gravitational load on chest.',
'1. Place hands shoulder-width on desk edge, walk feet back into incline plank.\n2. Lower chest towards edge of desk while keeping body completely straight.\n3. Push firmly back to full arm extension.',
3, '10-15 reps', 0, 45,
'Ensure desk or chair will not slide. Brace against wall if necessary.',
'Wall Push-Ups', 'Standard Push-Ups', '🪑', 'Excellent beginner exercise for students in dorm rooms.'),

(4, 'Decline Push-Ups', 'chest', 'advanced', 'Chair or Bed Edge',
'Elevate feet on chair/bed and place hands on floor. Shifts emphasis heavily onto upper clavicular chest and front delts.',
'1. Place toes on chair edge and palms on floor directly under shoulders.\n2. Engage glutes and core to prevent lumbar hyperextension.\n3. Lower chest until nose nearly brushes the floor, then press back up.',
3, '8-12 reps', 0, 75,
'Requires good core strength. Avoid if you have high blood pressure or wrist pain.',
'Standard Push-Ups', 'Pike Push-Ups', '🔥', 'Upper chest builder for intermediate/advanced lifters.'),

-- BACK
(5, 'Pull-Ups', 'back', 'advanced', 'Pull-Up Bar',
'Overhand grip slightly wider than shoulders. Pull chest up towards bar, engaging lats rather than pulling solely with biceps.',
'1. Grip bar with palms facing away.\n2. Depress shoulder blades down and back before bending elbows.\n3. Pull yourself up until your chin clears the bar.\n4. Lower with full control over 2-3 seconds.',
3, '5-8 reps', 0, 90,
'Never kip or swing uncontrollably. Control both the ascent and the negative descent.',
'Assisted Pull-Ups', 'Weighted Pull-Ups', '🧗', 'Gold standard upper body pulling movement.'),

(6, 'Assisted Pull-Ups', 'back', 'beginner', 'Resistance Band or Chair',
'Loop a resistance band over bar and under one foot/knee to reduce effective bodyweight.',
'1. Step one foot into hanging resistance band loop.\n2. Grip bar overhand and let the band assist in pulling chest upwards.\n3. Focus on contracting lats and pinching shoulder blades.',
3, '8-10 reps', 0, 60,
'Step out of band carefully to prevent snapping.',
'Doorway Rows', 'Standard Pull-Ups', '🎗️', 'Safest and fastest progression toward unassisted pull-ups.'),

(7, 'Resistance-Band Rows', 'back', 'beginner', 'Resistance Band',
'Anchor band around feet or door anchor. Keep spine tall, pull elbows backward along ribs.',
'1. Sit with legs extended, loop band around soles of feet.\n2. Hold handles with arms extended.\n3. Pull band back towards navel, squeezing shoulder blades together for 1 second.\n4. Slowly return under tension.',
3, '12-15 reps', 0, 45,
'Do not round shoulders or shrug neck upward.',
'Towel Isometric Rows', 'Backpack Rows', '🚣', 'Counters desk-slouch and strengthens rhomboids.'),

(8, 'Backpack Rows', 'back', 'intermediate', 'Loaded Backpack',
'Fill backpack with textbooks to desired weight. Hinge hips back at 45 degrees, pull backpack to lower ribcage.',
'1. Stand with feet hip-width, knees softly bent.\n2. Hinge forward from hips with flat back.\n3. Hold backpack top handle with both hands.\n4. Row weight upward towards abdomen, squeezing lats.',
3, '10-12 reps', 0, 60,
'Keep lower back flat. Never round spine when lifting weight from floor.',
'Resistance-Band Rows', 'Single-Arm Dumbbell Rows', '🎒', 'Student-friendly compound pulling exercise without gym equipment.'),

-- SHOULDERS
(9, 'Shoulder Taps', 'shoulders', 'beginner', 'Bodyweight',
'High plank position. Tap opposite shoulder with hand while resisting any hip rotation.',
'1. Assume high plank with feet slightly wider than normal for stability.\n2. Lift right hand and lightly tap left shoulder while keeping hips completely still.\n3. Return hand and repeat with left hand on right shoulder.',
3, '16-20 total taps', 0, 45,
'Imagine a glass of water balanced on your lower back that must not spill.',
'Knee Shoulder Taps', 'Plank to Downward Dog', '✋', 'Builds anti-rotational core stability and deltoid endurance.'),

(10, 'Pike Push-Ups', 'shoulders', 'intermediate', 'Bodyweight',
'Hips piked high in inverted V-shape. Directs pressing force down into anterior and lateral deltoids.',
'1. Start in downward-facing dog with hips pushed up and back.\n2. Lower top of head diagonally forward towards floor between hands.\n3. Press up and push head back through arms to starting V-shape.',
3, '8-10 reps', 0, 60,
'Keep elbows angled back at 45 degrees, never flaring outwards.',
'Incline Pike Push-Ups', 'Elevated Pike Push-Ups', '📐', 'Bodyweight precursor to handstand push-ups.'),

(11, 'Light Shoulder Raises (Lateral / Front)', 'shoulders', 'beginner', 'Water Bottles or Light Resistance Band',
'Stand tall, raise arms out to sides up to parallel with shoulders with slight bend in elbows.',
'1. Hold a 1-liter filled water bottle in each hand at sides.\n2. Raise arms out to sides until parallel to floor (lead with elbows).\n3. Pause for 1 second at top, then lower smoothly.',
3, '12-15 reps', 0, 45,
'Never swing body or use momentum. Do not raise above shoulder height to prevent impingement.',
'Arm Circles', 'Dumbbell Lateral Raises', '💧', 'Isolates lateral deltoids to improve posture and shoulder width.'),

-- ARMS
(12, 'Bicep Curls (Resistance Band / Water Bottles)', 'arms', 'beginner', 'Band or 2L Bottles',
'Keep elbows pinned firmly to ribcage. Rotate palms upward through movement.',
'1. Stand on center of resistance band holding handles with palms forward.\n2. Curl hands upward toward shoulders while elbows stay locked at sides.\n3. Squeeze biceps hard at top contraction for 1 second, then lower over 2 seconds.',
3, '12-15 reps', 0, 45,
'Do not sway hips or lean back to heave the weight up.',
'Isometric Towel Curls', 'Backpack Bicep Curls', '💪', 'Essential arm flexor strengthening.'),

(13, 'Triceps Dips (Chair or Bench)', 'arms', 'intermediate', 'Sturdy Chair or Bed',
'Sit on chair edge, hands gripping edge beside hips. Slide hips off and lower body vertically.',
'1. Place palms on edge of sturdy chair, knuckles forward.\n2. Bend elbows straight back to lower hips until elbows reach 90 degrees.\n3. Press through palms to lock out arms.',
3, '10-12 reps', 0, 60,
'Keep back close to the chair edge. Do not let shoulders roll forward into internal rotation.',
'Bent-Knee Chair Dips', 'Straight-Leg Chair Dips', '🪑', 'High-impact triceps strengthener for home workouts.'),

(14, 'Close-Grip Push-Ups (Diamond / Triceps)', 'arms', 'intermediate', 'Bodyweight',
'Hands placed directly under chest with index fingers and thumbs close together.',
'1. Set up in plank with hands inside shoulder-width.\n2. Lower chest to hands while keeping elbows grazing the sides of your ribcage.\n3. Press vigorously up through triceps.',
3, '8-10 reps', 0, 60,
'If wrists feel uncomfortable, separate hands slightly so thumbs are 4 inches apart.',
'Knee Close-Grip Push-Ups', 'Deficit Diamond Push-Ups', '💎', 'Massively activates lateral and medial triceps heads.'),

-- LEGS
(15, 'Bodyweight Squats', 'legs', 'beginner', 'Bodyweight',
'Feet shoulder-width apart, toes turned slightly out (15-30 degrees). Drive knees out in line with toes.',
'1. Stand tall with chest proud and hands clasped at chest.\n2. Push hips back first, then bend knees to descend until thighs are at least parallel to floor.\n3. Keep weight balanced across midfoot and heel.\n4. Drive through floor to stand upright.',
3, '15-20 reps', 0, 60,
'Never let knees cave inward (valgus collapse). Keep chest upright and heels on floor.',
'Chair-Assisted Squats', 'Jump Squats', '🦵', 'Foundational lower-body movement for quads, glutes, and hips.'),

(16, 'Walking / Forward Lunges', 'legs', 'intermediate', 'Bodyweight',
'Take an exaggerated stride forward. Lower back knee until it hovers 1 inch above floor.',
'1. Step forward with right foot into long stride.\n2. Lower hips until both knees form approximately 90-degree angles.\n3. Push through front heel to step forward into next lunge with left leg.',
3, '10 reps per leg', 0, 60,
'Keep torso vertical and front knee tracking directly over second toe.',
'Reverse Static Lunges', 'Jumping Lunges', '🚶', 'Unilateral leg builder that improves balance and hip mobility.'),

(17, 'Step-Ups', 'legs', 'beginner', 'Sturdy Step or Bench',
'Step full foot onto platform. Press down through heel without bouncing off trailing foot.',
'1. Stand facing a sturdy step or low bench (12-18 inches high).\n2. Place whole right foot onto step.\n3. Drive through right heel to lift body up, lightly touching left toes to top.\n4. Lower left foot back down with control.',
3, '10-12 reps per leg', 0, 45,
'Ensure bench is slip-proof and securely weighted.',
'Low Step-Ups (6 inches)', 'Weighted Backpack Step-Ups', '🪜', 'Excellent quad and glute builder with minimal knee strain.'),

(18, 'Calf Raises', 'legs', 'beginner', 'Bodyweight / Wall Support',
'Stand tall on balls of feet. Push straight up onto toes, holding peak contraction for 1 second.',
'1. Stand with balls of feet on edge of a step (or flat floor).\n2. Lower heels down to feel a deep calf stretch.\n3. Drive through big toes to elevate heels as high as possible.\n4. Squeeze calves at peak.',
3, '20-25 reps', 0, 30,
'Control the descent; avoid bouncing off Achilles tendon.',
'Two-Leg Floor Calf Raises', 'Single-Leg Calf Raises', '🦶', 'Strengthens gastrocnemius and soleus for running and walking endurance.'),

(19, 'Glute Bridges', 'legs', 'beginner', 'Bodyweight / Mat',
'Lie on back with knees bent at 90 degrees and feet flat on floor hip-width apart. Drive through heels.',
'1. Lie supine on mat, arms at sides, feet flat.\n2. Drive through heels to lift hips upward until thighs and torso align in a straight line.\n3. Squeeze glutes firmly at top for 2 seconds.\n4. Lower slowly without resting fully on floor between reps.',
3, '15-18 reps', 0, 45,
'Do not hyperextend lower back. Squeeze glutes and abs to initiate movement.',
'Floor Glute Bridge', 'Single-Leg Glute Bridge', '🌉', 'Direct antidote to tight hip flexors and dormant glutes from studying.'),

-- CORE
(20, 'Standard Plank', 'core', 'beginner', 'Bodyweight / Mat',
'Forearms on floor, elbows under shoulders. Body forms an unbroken straight plank from head to heels.',
'1. Place forearms parallel on mat with elbows under shoulders.\n2. Extend legs back on toes, engaging quads, glutes, and abs.\n3. Pull navel toward spine and hold steady while breathing continuously.',
3, '30-45 seconds', 45, 45,
'Never hold your breath. Do not let lower back sag towards the floor.',
'Knee Plank', 'Plank with Alternating Arm Reach', '📏', 'Premier isometric core builder for spinal protection.'),

(21, 'Side Planks', 'core', 'intermediate', 'Bodyweight / Mat',
'Lie on side propped on forearm. Elevate hips so body forms a diagonal line from shoulder to ankles.',
'1. Lie on right side with forearm on mat directly under shoulder.\n2. Stack feet or place top foot in front for stability.\n3. Lift hips off floor until body is straight.\n4. Hold for target duration, then switch sides.',
3, '20-30 seconds per side', 30, 45,
'Do not let hips sag towards the ground or roll torso forward.',
'Knee Side Plank', 'Side Plank with Top Leg Lift', '📐', 'Isolates obliques and quadratus lumborum to prevent lower back ache.'),

(22, 'Dead Bugs', 'core', 'beginner', 'Bodyweight / Mat',
'Lie on back with arms straight up and knees bent 90 degrees. Lower opposite arm and leg while pressing lower back into floor.',
'1. Lie on back with arms vertical and knees bent at 90 degrees (tabletop).\n2. Actively push lumbar spine completely flat against mat.\n3. Slowly extend right arm overhead and left leg forward until hovering 2 inches above floor.\n4. Return and alternate sides.',
3, '10 reps per side', 0, 45,
'If lower back arches off floor, stop and reduce extension range.',
'Bent-Knee Dead Bug', 'Weighted Dead Bug', '🐞', 'Best physical-therapy approved exercise for core stability.'),

(23, 'Bird Dogs', 'core', 'beginner', 'Bodyweight / Mat',
'Quadruped position on hands and knees. Reach opposite arm forward and leg backward while keeping hips level.',
'1. Begin on hands and knees with wrists under shoulders, knees under hips.\n2. Extend right arm straight forward and left leg straight back until parallel to floor.\n3. Hold for 2 seconds, maintaining square hips.\n4. Return with control and alternate sides.',
3, '10 reps per side', 0, 45,
'Do not rotate or tilt hips sideways. Keep neck neutral looking at mat.',
'Arm-Only / Leg-Only Reaches', 'Bird Dog with Elbow-to-Knee Crunch', '🐕', 'Strengthens posterior chain and deep spinal erectors safely.'),

(24, 'Controlled Crunches', 'core', 'beginner', 'Bodyweight / Mat',
'Lie on back with knees bent. Curl shoulder blades 2-3 inches off floor using abdominal contraction only.',
'1. Lie on back, feet flat on floor, fingertips resting lightly at temples.\n2. Exhale and contract abs to peel upper back off mat.\n3. Pause at peak contraction for 1 second.\n4. Inhale as you lower down smoothly.',
3, '15-20 reps', 0, 45,
'Do not pull or yank on your neck with your hands.',
'Feet-Elevated Crunch', 'Bicycle Crunches', '⚡', 'Isolates upper rectus abdominis with controlled tension.'),

-- FULL BODY & CARDIO
(25, 'Jumping Jacks', 'cardio', 'beginner', 'Bodyweight',
'Classic whole-body cardio movement. Jump feet wide while clapping hands overhead, then return together.',
'1. Stand tall with feet together, arms at sides.\n2. Lightly jump feet outward while swinging arms wide overhead.\n3. Jump feet back together as arms return to sides.\n4. Land softly on balls of feet.',
3, '45-60 seconds', 60, 45,
'Land with soft knees to protect joints. Wear supportive footwear.',
'Step Jacks (Low-Impact)', 'Star Jumps', '⭐', 'Elevates heart rate, stimulates lymphatic circulation, and warms muscles.'),

(26, 'Mountain Climbers', 'cardio', 'intermediate', 'Bodyweight',
'High plank position. Rapidly drive knees alternately toward chest in a running motion.',
'1. Start in push-up plank with hands under shoulders.\n2. Drive right knee rapidly towards chest without touching foot to floor.\n3. Quickly switch legs, driving left knee forward as right leg extends back.\n4. Maintain steady cadence.',
3, '30-45 seconds', 45, 60,
'Keep hips down level with shoulders; avoid bouncing hips up into the air.',
'Slow Controlled Climbers', 'Cross-Body Mountain Climbers', '🏔️', 'Cardio-core hybrid that burns calories and challenges abdominal endurance.'),

(27, 'Burpees (Full or Low-Impact)', 'cardio', 'advanced', 'Bodyweight',
'Drop into squat, kick feet back to plank, perform push-up (optional), jump feet back in and leap upward.',
'1. Stand with feet shoulder-width.\n2. Squat down and plant hands on floor.\n3. Jump feet back into plank.\n4. Lower chest to floor, push back up.\n5. Jump feet back toward hands, then jump up clapping overhead.',
3, '8-10 reps', 0, 75,
'Beginners should step feet back one by one rather than jumping to avoid knee strain.',
'Step-Back Burpees (No Push-Up)', 'Chest-to-Bar Burpees', '🔥', 'Ultimate calorie-burning full-body conditioning drill.'),

(28, 'Brisk Walking / Outdoor Walk', 'cardio', 'beginner', 'Walking Shoes',
'Maintain purposeful, rhythmic stride with arms swinging naturally. Promotes mental clarity after intense study.',
'1. Step out outdoors or on treadmill with upright posture.\n2. Walk at a pace where breathing is elevated but you can still hold a conversation (RPE 5/10).\n3. Keep shoulders relaxed and eyes forward.',
1, '20-30 minutes', 1500, 0,
'Stay hydrated and wear cushioned shoes.',
'Casual Walking', 'Hill Walking / Incline Walk', '👟', 'Best stress-reduction cardio for students with zero joint impact.'),

(29, 'Jogging / Interval Run', 'cardio', 'intermediate', 'Running Shoes',
'Light conversational jog alternated with brisk walking to build aerobic capacity.',
'1. Warm up with 3 minutes of brisk walking.\n2. Jog lightly for 60 seconds at comfortable pace.\n3. Walk for 60 seconds to recover.\n4. Repeat for 15-20 minutes total.',
1, '15-20 minutes', 1000, 0,
'Land lightly on midfoot, not heavily on heels. Stop immediately if shin splints flare up.',
'Brisk Power Walk', 'Tempo Run', '🏃', 'Cardiovascular endurance builder.'),

(30, 'Skipping / Jump Rope (or Ghost Roping)', 'cardio', 'intermediate', 'Jump Rope or Imaginary Rope',
'Jump just 1-2 inches off floor with light wrist rotations. Low equipment, high efficiency.',
'1. Hold rope handles at hip level with elbows close to torso.\n2. Rotate wrists to spin rope and bound lightly on balls of feet.\n3. If no rope is available, perform "ghost skipping" with matching rhythm.',
3, '60 seconds', 60, 45,
'Jump on a wooden floor or mat rather than hard concrete.',
'Single-Bounce Rope', 'Double Unders', '🪢', 'Develops fast-twitch ankle stiffness, coordination, and aerobic power.'),

(31, 'Low-Impact Cardio Dance / Step Sequence', 'cardio', 'beginner', 'Bodyweight',
'Continuous side-to-side steps with arm reaches and knee lifts without any jumping impact.',
'1. Step right foot wide, touch left foot beside it, repeat to left.\n2. Add alternating overhead arm reach with each step.\n3. Transition to gentle high knees with opposite elbow touches.\n4. Keep moving continuously to upbeat music.',
3, '5 minutes continuous', 300, 60,
'Keep core engaged and breathe rhythmically.',
'Marching in Place', 'High-Intensity Aerobic Step', '💃', 'Zero joint strain, perfect for upstairs dorms or apartments.'),

-- RECOVERY
(32, 'Dynamic Warm-Up Routine', 'recovery', 'beginner', 'Bodyweight',
'Full-body active mobility sequence: arm circles, torso twists, hip circles, and leg swings.',
'1. 10 Arm circles forward, 10 backward.\n2. 10 Gentle torso twists with arms loose.\n3. 10 Standing hip circles each direction.\n4. 10 Front-to-back leg swings holding a wall for balance.',
1, '5 minutes', 300, 0,
'Never force range of motion into sharp pain. Smooth, continuous movement.',
'Seated Gentle Joint Rotations', 'Full Dynamic Track Warmup', '🔄', 'Prepares synovial fluid and neural pathways before lifting.'),

(33, 'Desk Worker Stretch & Posture Reset', 'recovery', 'beginner', 'Chair / Desk',
'Targeted relief for tight chest, forward head posture, and stiff hip flexors from long study hours.',
'1. Doorway Chest Stretch: place forearm on door frame and lean forward gently (hold 30s per side).\n2. Seated Spinal Twist: sit tall, hold chair back and rotate torso (hold 20s per side).\n3. Standing Quad & Hip Flexor Stretch: pull ankle to glute, tuck pelvis (hold 30s per leg).',
1, '5-8 minutes', 360, 0,
'Breathe deeply into every stretch; never bounce or pulse aggressively.',
'Micro-Break Neck Rolls', 'Full Floor Yoga Sequence', '🧘', 'Directly combats academic study fatigue and tension headaches.'),

(34, 'Full-Body Mobility & Hip Opener', 'recovery', 'beginner', 'Yoga Mat',
'Deep lunging hip stretch, downward dog, and cat-cow movements to restore functional movement.',
'1. Cat-Cow: 10 cycles on hands and knees syncing breath with spine flexion and extension.\n2. Downward Dog into Cobra: 5 slow flows.\n3. World\'s Greatest Stretch: deep lunge with torso rotation towards front knee.',
1, '8-10 minutes', 500, 0,
'Listen to your body. Move with slow, mindful breaths.',
'Gentle Cat-Cow Only', 'Deep Pigeon Pose & Frog Stretch', '🦎', 'Essential restorative mobility for active student lifters.'),

(35, '4-7-8 Breathing & Meditation', 'recovery', 'beginner', 'Quiet Space / Chair',
'Parasympathetic nervous system activator: inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds.',
'1. Sit comfortably with spine straight and eyes closed.\n2. Empty lungs completely through mouth.\n3. Inhale quietly through nose for 4 seconds.\n4. Hold breath for 7 seconds without tension.\n5. Exhale forcefully through mouth making a whoosh sound for 8 seconds.\n6. Repeat 4 full cycles.',
1, '5 minutes', 300, 0,
'If holding for 7 seconds causes lightheadedness, reduce tempo to 3-3-6 ratio.',
'Simple Deep Belly Breathing', '15-Minute Guided Body Scan', '🌬️', 'Reduces cortisol, lowers heart rate, and resets mental focus before sleep.'),

(36, 'Full-Body Cooldown Routine', 'recovery', 'beginner', 'Mat',
'Gradual heart rate taper with standing forward fold, gentle hamstring stretch, and child\'s pose.',
'1. Walk slowly for 1 minute to let heart rate settle.\n2. Soft-knee standing forward fold letting arms hang heavy (hold 45s).\n3. Wide-knee Child\'s Pose on mat with arms outstretched (hold 60s).\n4. Deep belly breathing to close session.',
1, '5 minutes', 300, 0,
'Keep head elevated if feeling dizzy immediately after intense cardio.',
'Seated Meditation', 'Contrast Shower & Foam Rolling', '🧊', 'Accelerates post-workout waste clearance and reduces DOMS soreness.');

-- Seed Fitness Profile for Alex
INSERT INTO `fitness_profiles` 
(`user_id`, `experience_level`, `workout_goal`, `equipment_available`, `workout_location`, `available_minutes_per_day`, `workout_days_per_week`, `physical_limitations`, `injuries`)
VALUES
(1, 'beginner', 'Build core stability, relieve student desk stiffness, increase functional pressing and leg strength', 
 'Bodyweight, Sturdy Desk/Chair, Resistance Bands', 'home', 30, 4, 
 'Desk-slouch posture, mild lower back stiffness after 3 hours sitting, no acute injuries', 'None')
ON DUPLICATE KEY UPDATE `workout_goal`=VALUES(`workout_goal`);

-- Seed Workout Plan for Alex (Personalized 4-Day Home Routine)
INSERT INTO `workout_plans` (`user_id`, `title`, `split_type`, `is_active`, `plan_json`)
VALUES
(1, 'Student Synergy Full-Body & Mobility Plan', 'Full Body Split', 1,
'{"days":[{"day":"Mon","focus":"Upper Body Press & Core","exercises":[{"name":"Incline Push-Ups","sets":3,"reps":"10-12","rest":"45s"},{"name":"Resistance-Band Rows","sets":3,"reps":"12-15","rest":"45s"},{"name":"Standard Plank","sets":3,"reps":"30s","rest":"45s"},{"name":"Desk Posture Reset","sets":1,"reps":"5 min","rest":"0s"}]},{"day":"Tue","focus":"Active Recovery & Study Day","exercises":[{"name":"20-20-20 Eye Rest Rule","sets":1,"reps":"Hourly","rest":"0s"},{"name":"Brisk Walking / Outdoor Walk","sets":1,"reps":"20 min","rest":"0s"}]},{"day":"Wed","focus":"Lower Body & Posterior Chain","exercises":[{"name":"Bodyweight Squats","sets":3,"reps":"15","rest":"60s"},{"name":"Glute Bridges","sets":3,"reps":"15","rest":"45s"},{"name":"Dead Bugs","sets":3,"reps":"10 per side","rest":"45s"},{"name":"Calf Raises","sets":3,"reps":"20","rest":"30s"}]},{"day":"Thu","focus":"Desk Worker Posture & Yoga","exercises":[{"name":"Morning Stretch & Yoga","sets":1,"reps":"20 min","rest":"0s"},{"name":"Dynamic Warm-Up Routine","sets":1,"reps":"5 min","rest":"0s"}]},{"day":"Fri","focus":"Cardio & Conditioning Circuit","exercises":[{"name":"Jumping Jacks","sets":3,"reps":"45s","rest":"45s"},{"name":"Mountain Climbers","sets":3,"reps":"30s","rest":"60s"},{"name":"Triceps Dips (Chair)","sets":3,"reps":"10","rest":"45s"},{"name":"4-7-8 Breathing & Meditation","sets":1,"reps":"5 min","rest":"0s"}]},{"day":"Sat","focus":"Light Cardio & Outdoor Sport","exercises":[{"name":"Evening Walk / Jog","sets":1,"reps":"30 min","rest":"0s"}]},{"day":"Sun","focus":"Complete Rest & Weekly Reset","exercises":[{"name":"Full-Body Cooldown Routine","sets":1,"reps":"10 min","rest":"0s"}]}]}');

-- Seed Workout Session History
INSERT INTO `workout_sessions` (`id`, `user_id`, `plan_id`, `workout_title`, `duration_minutes`, `perceived_effort`, `energy_level`, `soreness_feedback`, `notes`, `completed_at`)
VALUES
(1, 1, 1, 'Upper Body Press & Core Session', 28, 6, 'moderate', 'Good chest and triceps engagement, zero shoulder discomfort', 'Substituted Incline Push-Ups on desk. Kept 45s rest intervals.', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2, 1, 1, 'Lower Body & Posture Session', 30, 7, 'high', 'Glutes and quads activated, lower back felt loose and comfortable', 'Glute bridges held for full 2-second peak pause.', DATE_SUB(NOW(), INTERVAL 1 DAY));

INSERT INTO `workout_session_logs` (`session_id`, `exercise_name`, `set_number`, `reps_completed`, `weight_kg`, `feedback`)
VALUES
(1, 'Incline Push-Ups', 1, 12, 0, 'suitable'),
(1, 'Incline Push-Ups', 2, 12, 0, 'suitable'),
(1, 'Incline Push-Ups', 3, 10, 0, 'suitable'),
(1, 'Resistance-Band Rows', 1, 15, 0, 'too_easy'),
(1, 'Resistance-Band Rows', 2, 15, 0, 'suitable'),
(1, 'Resistance-Band Rows', 3, 15, 0, 'suitable'),
(1, 'Standard Plank', 1, 35, 0, 'suitable'),
(1, 'Standard Plank', 2, 30, 0, 'suitable'),
(2, 'Bodyweight Squats', 1, 15, 0, 'suitable'),
(2, 'Bodyweight Squats', 2, 15, 0, 'suitable'),
(2, 'Bodyweight Squats', 3, 15, 0, 'suitable'),
(2, 'Glute Bridges', 1, 15, 0, 'suitable'),
(2, 'Glute Bridges', 2, 15, 0, 'suitable'),
(2, 'Glute Bridges', 3, 15, 0, 'suitable');

-- Seed Meal Preferences
INSERT INTO `meal_preferences` (`user_id`, `diet_type`, `budget_type`, `daily_cost_limit_inr`, `protein_target_g`, `calories_target`, `allergies`)
VALUES (1, 'veg', 'student_budget', 140, 65, 2150, 'None')
ON DUPLICATE KEY UPDATE `diet_type`=VALUES(`diet_type`);

-- Seed Meal Plans (Realistic Indian Student Budget)
INSERT INTO `meal_plans` (`user_id`, `day_of_week`, `meal_type`, `title`, `description`, `ingredients`, `prep_steps`, `approx_protein_g`, `approx_calories`, `approx_cost_inr`)
VALUES
(1, 'Mon', 'breakfast', 'Sprouted Moong & Oats Porridge', 'High-fiber energizing breakfast with complex carbs and plant protein.', 'Green Moong Sprouts (50g), Rolled Oats (40g), Milk or Water (200ml), Jaggery (1 tsp), Roasted Peanuts (15g)', '1. Steam sprouted moong for 4 mins.\n2. Boil oats in milk/water.\n3. Mix moong, oats, crushed peanuts and jaggery.', 18.0, 420, 30),
(1, 'Mon', 'lunch', 'Brown Lentil Dal, Steamed Rice & Cucumbers', 'Classic home-cooked protein staple with easy digestion for study afternoons.', 'Yellow Toor/Moong Dal (60g raw), Steamed Rice (1.5 cups), Cumin/Mustard tadka, 1 Cucumber sliced, Green chili', '1. Pressure cook dal with turmeric.\n2. Prepare quick tadka with cumin seeds and pinch of hing.\n3. Serve hot over rice with fresh cucumber slices.', 20.5, 620, 40),
(1, 'Mon', 'snack', 'Roasted Chana & Masala Chai', 'Crunchy, slow-burning afternoon study snack that prevents glucose crash.', 'Roasted Bengal Gram / Chana (40g), Fresh black/ginger tea (1 cup), Jaggery', '1. Measure roasted chana into a bowl.\n2. Brew ginger tea without excess refined sugar.', 8.5, 180, 15),
(1, 'Mon', 'dinner', 'Paneer Bhurji / Soya Chunks & 2 Roti', 'High-protein repair dinner to support muscle recovery and restful sleep.', 'Soya Chunks or Fresh Paneer (60g), 2 Whole Wheat Rotis, Onion, Tomato, Garam Masala', '1. Boil soya chunks, squeeze water and chop.\n2. Sauté with onion, tomato, cumin and turmeric.\n3. Enjoy hot with whole wheat phulkas.', 24.0, 520, 45);

-- Seed Career Profile
INSERT INTO `career_profiles` (`user_id`, `target_role`, `current_skills`, `desired_skills`, `experience_summary`, `resume_notes`)
VALUES
(1, 'Junior Java / Spring Boot Backend Engineer', 
 'Core Java (Beginner/Intermediate), C programming basics, Basic SQL commands, Git version control',
 'Spring Boot, Spring Data JPA, RESTful API Design, MySQL Schema Optimization, Docker, Unit Testing with JUnit',
 'Computer Science 2nd Year student; built small console applications, currently building full-stack college companion.',
 'Include GitHub repository links for practical projects; highlight OOP architecture, data structure efficiency, and clean code comments.')
ON DUPLICATE KEY UPDATE `target_role`=VALUES(`target_role`);

-- Seed Career Mock Interview
INSERT INTO `career_interviews` (`user_id`, `topic`, `question`, `user_answer`, `ai_score`, `ai_feedback`, `suggested_answer`)
VALUES
(1, 'Java OOP & Polymorphism', 
 'What is the exact technical difference between Method Overloading and Method Overriding in Java?',
 'Overloading is when two methods in the same class have the same name but different parameters. Overriding is when a child class provides a new implementation of a method that is already defined in its parent class.',
 8.5,
 'Strong conceptual answer! You accurately highlighted same class vs parent-child relationship. To score a 10/10, mention that Overloading is resolved at compile-time (static binding) while Overriding is resolved at runtime (dynamic method dispatch via vtable).',
 'Method Overloading occurs within the same class where two or more methods share the same name with different parameter signatures (type, count, or order); it is resolved at compile-time (static polymorphism). Method Overriding occurs across an inheritance hierarchy where a subclass provides a specific implementation of a method already declared in its superclass using the exact same signature and return type; it is resolved at runtime (dynamic polymorphism) using dynamic method dispatch.');

-- Seed Reminders
INSERT INTO `reminders` (`user_id`, `title`, `category`, `reminder_time`, `repeat_days`, `sound_enabled`, `tone`, `is_active`)
VALUES
(1, 'Morning Stretch & Yoga Alarm', 'workout', '06:45:00', 'Mon,Tue,Wed,Thu,Fri', 1, 'chime', 1),
(1, '20-20-20 Eye Rest Reminder', 'eye_rest', '11:00:00', 'Mon,Tue,Wed,Thu,Fri,Sat', 1, 'bell', 1),
(1, 'Water Hydration Goal (500ml)', 'hydration', '10:00:00', 'Mon,Tue,Wed,Thu,Fri,Sat,Sun', 1, 'water_drop', 1),
(1, 'Desk Posture Reset & Neck Relief', 'posture', '13:00:00', 'Mon,Tue,Wed,Thu,Fri', 1, 'chime', 1),
(1, 'Java OOP Lab Submission Deadline Alarm', 'alarm', '20:00:00', 'Mon', 1, 'digital', 1),
(1, 'Evening Walk & Aerobic Cardio', 'workout', '18:00:00', 'Mon,Wed,Fri', 1, 'bell', 1),
(1, 'Wind-down & Sleep Preparation', 'alarm', '22:30:00', 'Mon,Tue,Wed,Thu,Fri,Sat,Sun', 1, 'gentle', 1);

-- Seed Daily Habits
INSERT INTO `user_habits` (`user_id`, `habit_key`, `habit_name`, `target_daily_count`, `current_count`, `unit`, `last_logged_date`)
VALUES
(1, 'water_intake', 'Drink 2,500ml Water', 2500, 1750, 'ml', CURDATE()),
(1, 'eye_breaks', '20-20-20 Eye Rest Breaks', 6, 4, 'times', CURDATE()),
(1, 'pomodoro_study', 'Complete 25-min Study Blocks', 4, 3, 'sessions', CURDATE()),
(1, 'posture_checks', 'Spinal Posture & Neck Stretch', 5, 3, 'times', CURDATE());
