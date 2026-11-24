<?php
/**
 * Database Configuration & Connection Manager
 * Platform: PHP 8+, MySQL (PDO) with utf8mb4
 * Supports both live MySQL and self-contained SQLite fallback if MySQL is stopped
 */

declare(strict_types=1);

class Database {
    private static ?PDO $instance = null;
    private static string $driverUsed = 'mysql';

    public static function getConnection(): PDO {
        if (self::$instance !== null) {
            return self::$instance;
        }

        // Database credentials (configurable via environment or defaults)
        $host = getenv('DB_HOST') ?: '127.0.0.1';
        $port = getenv('DB_PORT') ?: '3306';
        $dbname = getenv('DB_NAME') ?: 'ai_life_companion';
        $user = getenv('DB_USER') ?: 'root';
        $pass = getenv('DB_PASS') !== false ? getenv('DB_PASS') : '';

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ];

        try {
            $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
            self::$instance = new PDO($dsn, $user, $pass, $options);
            self::$driverUsed = 'mysql';
            return self::$instance;
        } catch (PDOException $e) {
            // If MySQL is not running or accessible, fallback to SQLite for seamless local execution
            $sqlitePath = __DIR__ . '/../ai_life_companion_fallback.sqlite';
            try {
                self::$instance = new PDO("sqlite:" . $sqlitePath);
                self::$instance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                self::$instance->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
                self::$driverUsed = 'sqlite';
                self::initSqliteTables(self::$instance);
                return self::$instance;
            } catch (Exception $sqle) {
                // If both fail, send structured JSON error
                http_response_code(500);
                header('Content-Type: application/json; charset=UTF-8');
                echo json_encode([
                    'success' => false,
                    'error' => 'Database connection failed',
                    'message' => 'Could not connect to MySQL (' . $e->getMessage() . ') nor fallback SQLite (' . $sqle->getMessage() . '). Please start MySQL in XAMPP.'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }
        }
    }

    public static function getDriver(): string {
        return self::$driverUsed;
    }

    private static function initSqliteTables(PDO $db): void {
        // Quick schema sync for SQLite fallback if running without MySQL service
        $db->exec("
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT DEFAULT 'student',
                avatar TEXT DEFAULT 'AS',
                learning_level TEXT DEFAULT 'Beginner (Java)',
                language_pref TEXT DEFAULT 'en',
                streak_count INTEGER DEFAULT 14,
                synergy_score INTEGER DEFAULT 88,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS user_profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER UNIQUE NOT NULL,
                age INTEGER DEFAULT 20,
                height_cm REAL DEFAULT NULL,
                weight_kg REAL DEFAULT NULL,
                education_level TEXT DEFAULT 'Bachelor of Engineering (CSE)',
                course TEXT DEFAULT 'Computer Science',
                semester TEXT DEFAULT 'Year 2, Semester 3',
                target_career TEXT DEFAULT 'Junior Java / Spring Boot Backend Engineer',
                daily_available_hours REAL DEFAULT 6.0,
                sleep_goal_hours REAL DEFAULT 7.5,
                water_goal_ml INTEGER DEFAULT 2500,
                dietary_pref TEXT DEFAULT 'Vegetarian / Budget Friendly',
                budget_level TEXT DEFAULT 'Student Budget (₹100 - ₹200 / day)',
                explanation_style TEXT DEFAULT 'Visual analogies, simple real-world examples & runnable code',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS personal_memories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                category TEXT DEFAULT 'learning',
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                is_confirmed_fact INTEGER DEFAULT 1,
                confidence REAL DEFAULT 1.0,
                tags TEXT DEFAULT '',
                is_active INTEGER DEFAULT 1,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS user_profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER UNIQUE NOT NULL,
                age INTEGER DEFAULT 20,
                height_cm REAL DEFAULT NULL,
                weight_kg REAL DEFAULT NULL,
                education_level TEXT DEFAULT 'Bachelor of Engineering (CSE)',
                course TEXT DEFAULT 'Computer Science',
                semester TEXT DEFAULT 'Year 2, Semester 3',
                target_career TEXT DEFAULT 'Junior Java / Spring Boot Backend Engineer',
                daily_available_hours REAL DEFAULT 6.0,
                sleep_goal_hours REAL DEFAULT 7.5,
                water_goal_ml INTEGER DEFAULT 2500,
                dietary_pref TEXT DEFAULT 'Vegetarian / Budget Friendly',
                budget_level TEXT DEFAULT 'Student Budget (₹100 - ₹200 / day)',
                explanation_style TEXT DEFAULT 'Visual analogies, simple real-world examples & runnable code',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                category TEXT DEFAULT 'academic',
                priority TEXT DEFAULT 'medium',
                due_date TEXT,
                due_time TEXT,
                estimated_minutes INTEGER DEFAULT 45,
                is_completed INTEGER DEFAULT 0,
                completed_at TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS chat_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                conversation_id INTEGER DEFAULT 1,
                user_id INTEGER NOT NULL,
                sender_type TEXT NOT NULL,
                message_text TEXT NOT NULL,
                context_retrieved TEXT,
                reasoning_meta TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS reminders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                category TEXT DEFAULT 'study',
                reminder_time TEXT NOT NULL,
                repeat_days TEXT DEFAULT 'Mon,Tue,Wed,Thu,Fri',
                sound_enabled INTEGER DEFAULT 1,
                tone TEXT DEFAULT 'chime',
                is_active INTEGER DEFAULT 1,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS exercise_library (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                muscle_group TEXT NOT NULL,
                difficulty TEXT DEFAULT 'beginner',
                equipment TEXT DEFAULT 'Bodyweight',
                correct_technique TEXT NOT NULL,
                step_by_step TEXT NOT NULL,
                target_sets INTEGER DEFAULT 3,
                target_reps TEXT DEFAULT '10-12 reps',
                duration_sec INTEGER DEFAULT 0,
                rest_sec INTEGER DEFAULT 60,
                safety_guidance TEXT NOT NULL,
                easier_variation TEXT,
                harder_variation TEXT,
                icon TEXT DEFAULT '🏋️',
                demo_tip TEXT
            );
            CREATE TABLE IF NOT EXISTS fitness_profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER UNIQUE NOT NULL,
                experience_level TEXT DEFAULT 'beginner',
                workout_goal TEXT NOT NULL,
                equipment_available TEXT NOT NULL,
                workout_location TEXT DEFAULT 'home',
                available_minutes_per_day INTEGER DEFAULT 30,
                workout_days_per_week INTEGER DEFAULT 4,
                physical_limitations TEXT,
                injuries TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS workout_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                plan_id INTEGER DEFAULT 1,
                workout_title TEXT NOT NULL,
                duration_minutes INTEGER DEFAULT 25,
                perceived_effort INTEGER DEFAULT 7,
                energy_level TEXT DEFAULT 'moderate',
                soreness_feedback TEXT,
                notes TEXT,
                completed_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS workout_session_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id INTEGER NOT NULL,
                exercise_name TEXT NOT NULL,
                set_number INTEGER NOT NULL,
                reps_completed INTEGER NOT NULL,
                weight_kg REAL DEFAULT 0,
                feedback TEXT DEFAULT 'suitable'
            );
            CREATE TABLE IF NOT EXISTS meal_plans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                day_of_week TEXT NOT NULL,
                meal_type TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                ingredients TEXT NOT NULL,
                prep_steps TEXT NOT NULL,
                approx_protein_g REAL DEFAULT 15,
                approx_calories INTEGER DEFAULT 450,
                approx_cost_inr INTEGER DEFAULT 40,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS career_profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER UNIQUE NOT NULL,
                target_role TEXT NOT NULL,
                current_skills TEXT NOT NULL,
                desired_skills TEXT NOT NULL,
                experience_summary TEXT,
                resume_notes TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS timetable_slots (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                day_of_week TEXT NOT NULL,
                start_time TEXT NOT NULL,
                end_time TEXT NOT NULL,
                subject_code TEXT NOT NULL,
                subject_name TEXT NOT NULL,
                room TEXT DEFAULT '',
                instructor TEXT DEFAULT '',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS workout_plans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                goal TEXT NOT NULL,
                split_type TEXT DEFAULT '4-day upper-lower',
                days_per_week INTEGER DEFAULT 4,
                is_active INTEGER DEFAULT 1,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS workout_plan_days (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                plan_id INTEGER NOT NULL,
                day_name TEXT NOT NULL,
                focus_area TEXT NOT NULL,
                estimated_duration_min INTEGER DEFAULT 35,
                exercises_json TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS career_interviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                topic TEXT NOT NULL,
                question TEXT NOT NULL,
                user_answer TEXT NOT NULL,
                ai_score REAL DEFAULT 8.0,
                ai_feedback TEXT NOT NULL,
                suggested_answer TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS study_plans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                subject_code TEXT NOT NULL,
                subject_name TEXT NOT NULL,
                target_exam_date TEXT NOT NULL,
                daily_available_hours REAL DEFAULT 3.0,
                total_portions INTEGER DEFAULT 10,
                completed_portions INTEGER DEFAULT 6,
                plan_json TEXT,
                status TEXT DEFAULT 'active',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS study_notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                subject TEXT DEFAULT 'General',
                content TEXT NOT NULL,
                summary TEXT,
                tags TEXT DEFAULT '',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS user_habits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                habit_key TEXT NOT NULL,
                habit_name TEXT NOT NULL,
                target_daily_count INTEGER DEFAULT 1,
                current_count INTEGER DEFAULT 0,
                unit TEXT DEFAULT 'times',
                last_logged_date TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS password_resets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL,
                token TEXT NOT NULL,
                expires_at DATETIME NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS uploaded_documents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                filename TEXT NOT NULL,
                file_type TEXT DEFAULT 'pdf',
                file_size INTEGER DEFAULT 0,
                page_count INTEGER DEFAULT 1,
                chunks_json TEXT NOT NULL,
                summary TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        ");

        // Seed exercise library in SQLite from database.sql if empty
        $exCheck = $db->query("SELECT COUNT(*) FROM exercise_library")->fetchColumn();
        if ($exCheck == 0) {
            $sqlFile = __DIR__ . '/../database.sql';
            if (file_exists($sqlFile)) {
                $sqlContent = file_get_contents($sqlFile);
                if (preg_match('/INSERT INTO `exercise_library`[\s\S]*?;\n/u', $sqlContent, $m)) {
                    $cleanSql = str_replace('`', '', $m[0]);
                    $cleanSql = preg_replace('/--[^\n]*\n/', "\n", $cleanSql);
                    $cleanSql = str_replace("\\'", "''", $cleanSql);
                    try { $db->exec($cleanSql); } catch (Exception $e) {}
                }
            }
        }

        // Seed timetable slots in SQLite if empty
        $ttCheck = $db->query("SELECT COUNT(*) FROM timetable_slots")->fetchColumn();
        if ($ttCheck == 0) {
            $ttSql = <<<'TTSQL'
INSERT INTO timetable_slots (user_id, day_of_week, start_time, end_time, subject_code, subject_name, room, instructor)
VALUES
(1, 'Mon', '09:00:00', '10:30:00', 'CS301', 'Data Structures & Algorithms', 'Hall B3', 'Prof. Harrison'),
(1, 'Mon', '11:00:00', '12:30:00', 'CS302', 'Object Oriented Programming (Java)', 'Lab 204', 'Dr. Sundaram'),
(1, 'Tue', '09:00:00', '10:30:00', 'CS303', 'Database Management Systems', 'Hall A1', 'Dr. Radhakrishnan'),
(1, 'Tue', '11:00:00', '12:30:00', 'CS304', 'Discrete Mathematics', 'Room 102', 'Prof. Wilson'),
(1, 'Wed', '09:00:00', '10:30:00', 'CS301', 'Data Structures & Algorithms', 'Hall B3', 'Prof. Harrison'),
(1, 'Wed', '14:00:00', '16:00:00', 'CS302', 'Java OOP Programming Lab', 'Lab 204', 'Dr. Sundaram'),
(1, 'Thu', '09:00:00', '10:30:00', 'CS303', 'Database Management Systems Lab', 'Lab 101', 'Dr. Radhakrishnan'),
(1, 'Fri', '10:00:00', '11:30:00', 'CS305', 'Web Development & Scripting', 'Room 205', 'Prof. Alagappan');
TTSQL;
            try { $db->exec($ttSql); } catch (Exception $e) {}
        }

        // Seed default user if not exists
        $userCheck = $db->query("SELECT COUNT(*) FROM users")->fetchColumn();
        if ($userCheck == 0) {
            $stmt = $db->prepare("INSERT INTO users (id, name, email, password_hash, role, learning_level, streak_count, synergy_score) VALUES 
                (1, 'Alex Smith', 'alex@alife.local', '$2y$10\$foTuV6wnn132SKXoheffe.AyPdZ24txLuT677JSzt1U/Cu5Llxk5e', 'student', 'Beginner (Java)', 14, 88),
                (2, 'Alex Smith', 'alex.smith@university.edu', '$2y$10\$E.3Bq74W5qiRToLuc7QzyuRXKy3U40H3KamXPoW7WAwZfS0XCKjoS', 'student', 'Beginner (Java)', 14, 88)");
            $stmt->execute();

            // Seed initial memories
            $memStmt = $db->prepare("INSERT INTO personal_memories (user_id, category, title, content, is_confirmed_fact) VALUES 
                (1, 'learning', 'Java Beginner Knowledge', 'Current programming background: Learned C fundamentals; now beginner level in Java (familiar with basic syntax, learning OOP inheritance, polymorphism).', 1),
                (1, 'learning', 'Mid-Term Exam Schedule', 'Object-Oriented Programming (CS301) Mid-Term Exam scheduled on November 15, 2026. Weak topics: Dynamic Method Dispatch and Interfaces.', 1),
                (1, 'tasks', 'Daily Productivity Schedule', 'Available dedicated study time: 1.5 hours on weekdays (4:30 PM - 6:00 PM). Prefer 25-minute Pomodoro focus blocks.', 1),
                (1, 'health', 'Hydration & Sleep Targets', 'Health limits and wellness goals: Target 2,500 ml daily water intake. Fixed 7.5 hours nightly sleep schedule.', 1),
                (1, 'career', 'Junior Java Backend Roadmap', 'Career milestone: Target placement as Junior Java / Spring Boot Backend Engineer within 8 months.', 1)
            ");
            $memStmt->execute();
        }
    }
}
