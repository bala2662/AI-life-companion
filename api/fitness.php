<?php
/**
 * Fitness & Workout Management API Endpoint
 * Actions: 
 * - get_profile, save_profile
 * - get_exercises (filters: muscle_group, difficulty, equipment)
 * - get_active_plan, generate_plan
 * - log_session, get_history
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/AIService.php';

$userId = Auth::requireAuth();
$pdo = Database::getConnection();

$action = $_GET['action'] ?? $_POST['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?? [];
if (!empty($input['action'])) {
    $action = $input['action'];
}

switch ($action) {
    case 'get_profile':
        $stmt = $pdo->prepare("SELECT * FROM fitness_profiles WHERE user_id = ?");
        $stmt->execute([$userId]);
        $profile = $stmt->fetch();
        if (!$profile) {
            // Default beginner profile
            $profile = [
                'experience_level' => 'beginner',
                'workout_goal' => 'Build core stability, relieve student desk stiffness, increase stamina',
                'equipment_available' => 'Bodyweight, Sturdy Chair, Resistance Bands',
                'workout_location' => 'home',
                'available_minutes_per_day' => 30,
                'workout_days_per_week' => 4,
                'physical_limitations' => 'Mild lower back stiffness from studying',
                'injuries' => 'None'
            ];
        }
        echo json_encode(['success' => true, 'profile' => $profile], JSON_UNESCAPED_UNICODE);
        break;

    case 'save_profile':
        $level = trim($input['experience_level'] ?? 'beginner');
        $goal = trim($input['workout_goal'] ?? '');
        $equipment = trim($input['equipment_available'] ?? 'Bodyweight');
        $location = trim($input['workout_location'] ?? 'home');
        $minutes = (int)($input['available_minutes_per_day'] ?? 30);
        $days = (int)($input['workout_days_per_week'] ?? 4);
        $limitations = trim($input['physical_limitations'] ?? '');
        $injuries = trim($input['injuries'] ?? 'None');

        $stmt = $pdo->prepare("
            INSERT INTO fitness_profiles (user_id, experience_level, workout_goal, equipment_available, workout_location, available_minutes_per_day, workout_days_per_week, physical_limitations, injuries)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                experience_level = VALUES(experience_level),
                workout_goal = VALUES(workout_goal),
                equipment_available = VALUES(equipment_available),
                workout_location = VALUES(workout_location),
                available_minutes_per_day = VALUES(available_minutes_per_day),
                workout_days_per_week = VALUES(workout_days_per_week),
                physical_limitations = VALUES(physical_limitations),
                injuries = VALUES(injuries)
        ");
        $stmt->execute([$userId, $level, $goal, $equipment, $location, $minutes, $days, $limitations, $injuries]);

        echo json_encode(['success' => true, 'message' => 'Fitness profile saved to database']);
        break;

    case 'get_exercises':
        $muscle = trim($_GET['muscle_group'] ?? 'all');
        $diff = trim($_GET['difficulty'] ?? 'all');
        $search = trim($_GET['search'] ?? '');

        $sql = "SELECT * FROM exercise_library WHERE 1=1";
        $params = [];

        if ($muscle !== 'all' && !empty($muscle)) {
            $sql .= " AND muscle_group = ?";
            $params[] = $muscle;
        }
        if ($diff !== 'all' && !empty($diff)) {
            $sql .= " AND difficulty = ?";
            $params[] = $diff;
        }
        if (!empty($search)) {
            $sql .= " AND (name LIKE ? OR correct_technique LIKE ?)";
            $params[] = "%{$search}%";
            $params[] = "%{$search}%";
        }
        $sql .= " ORDER BY muscle_group ASC, difficulty ASC, name ASC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $exercises = $stmt->fetchAll();

        echo json_encode(['success' => true, 'count' => count($exercises), 'exercises' => $exercises], JSON_UNESCAPED_UNICODE);
        break;

    case 'get_active_plan':
        $stmt = $pdo->prepare("SELECT * FROM workout_plans WHERE user_id = ? AND is_active = 1 ORDER BY id DESC LIMIT 1");
        $stmt->execute([$userId]);
        $plan = $stmt->fetch();
        if ($plan && !empty($plan['plan_json'])) {
            $plan['details'] = json_decode($plan['plan_json'], true);
        }
        echo json_encode(['success' => true, 'plan' => $plan], JSON_UNESCAPED_UNICODE);
        break;

    case 'generate_plan':
        // Retrieve fitness profile
        $pStmt = $pdo->prepare("SELECT * FROM fitness_profiles WHERE user_id = ?");
        $pStmt->execute([$userId]);
        $prof = $pStmt->fetch();

        $exp = $prof['experience_level'] ?? 'beginner';
        $goal = $prof['workout_goal'] ?? 'Functional strength and posture';
        $equip = $prof['equipment_available'] ?? 'Bodyweight';
        $mins = (int)($prof['available_minutes_per_day'] ?? 30);
        $daysCount = (int)($prof['workout_days_per_week'] ?? 4);

        // Fetch exercise library
        $libStmt = $pdo->query("SELECT id, name, muscle_group, difficulty, equipment, target_sets, target_reps, rest_sec FROM exercise_library");
        $allEx = $libStmt->fetchAll();

        // Build personalized plan structure
        $days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        $schedule = [];

        // Distribute workout days vs recovery days
        $focusMap = [
            'beginner' => [
                'Mon' => ['focus' => 'Upper Body Push & Pull', 'type' => 'upper'],
                'Tue' => ['focus' => 'Active Recovery & Posture Walk', 'type' => 'recovery'],
                'Wed' => ['focus' => 'Lower Body & Core Stability', 'type' => 'lower'],
                'Thu' => ['focus' => 'Desk Relief & Deep Yoga', 'type' => 'recovery'],
                'Fri' => ['focus' => 'Full-Body Circuit & Mobility', 'type' => 'full'],
                'Sat' => ['focus' => 'Outdoor Light Cardio & Leisure', 'type' => 'cardio'],
                'Sun' => ['focus' => 'Complete Rest & Rejuvenation', 'type' => 'rest']
            ],
            'intermediate' => [
                'Mon' => ['focus' => 'Chest, Shoulders & Triceps (Push)', 'type' => 'push'],
                'Tue' => ['focus' => 'Back, Biceps & Core (Pull)', 'type' => 'pull'],
                'Wed' => ['focus' => 'Quads, Hamstrings & Calves (Legs)', 'type' => 'legs'],
                'Thu' => ['focus' => 'Active Mobility & Low-Impact Cardio', 'type' => 'recovery'],
                'Fri' => ['focus' => 'Full-Body Functional Strength', 'type' => 'full'],
                'Sat' => ['focus' => 'HIIT & Core Conditioning', 'type' => 'cardio'],
                'Sun' => ['focus' => 'Complete Rest', 'type' => 'rest']
            ]
        ];

        $templates = $focusMap[$exp] ?? $focusMap['beginner'];

        foreach ($days as $d) {
            $info = $templates[$d];
            $dayExercises = [];

            if ($info['type'] === 'upper') {
                $dayExercises[] = ['name' => 'Incline Push-Ups', 'sets' => 3, 'reps' => '10-12', 'rest' => '45s'];
                $dayExercises[] = ['name' => 'Resistance-Band Rows', 'sets' => 3, 'reps' => '12-15', 'rest' => '45s'];
                $dayExercises[] = ['name' => 'Shoulder Taps', 'sets' => 3, 'reps' => '16 taps', 'rest' => '45s'];
                $dayExercises[] = ['name' => 'Desk Worker Stretch & Posture Reset', 'sets' => 1, 'reps' => '5 min', 'rest' => '0s'];
            } elseif ($info['type'] === 'lower') {
                $dayExercises[] = ['name' => 'Bodyweight Squats', 'sets' => 3, 'reps' => '15 reps', 'rest' => '60s'];
                $dayExercises[] = ['name' => 'Glute Bridges', 'sets' => 3, 'reps' => '15 reps', 'rest' => '45s'];
                $dayExercises[] = ['name' => 'Dead Bugs', 'sets' => 3, 'reps' => '10 per side', 'rest' => '45s'];
                $dayExercises[] = ['name' => 'Calf Raises', 'sets' => 3, 'reps' => '20 reps', 'rest' => '30s'];
            } elseif ($info['type'] === 'full') {
                $dayExercises[] = ['name' => 'Knee Push-Ups', 'sets' => 3, 'reps' => '10 reps', 'rest' => '45s'];
                $dayExercises[] = ['name' => 'Walking / Forward Lunges', 'sets' => 3, 'reps' => '10 per leg', 'rest' => '60s'];
                $dayExercises[] = ['name' => 'Standard Plank', 'sets' => 3, 'reps' => '30-45s', 'rest' => '45s'];
                $dayExercises[] = ['name' => '4-7-8 Breathing & Meditation', 'sets' => 1, 'reps' => '5 min', 'rest' => '0s'];
            } elseif ($info['type'] === 'recovery') {
                $dayExercises[] = ['name' => 'Dynamic Warm-Up Routine', 'sets' => 1, 'reps' => '5 min', 'rest' => '0s'];
                $dayExercises[] = ['name' => 'Full-Body Mobility & Hip Opener', 'sets' => 1, 'reps' => '8 min', 'rest' => '0s'];
                $dayExercises[] = ['name' => '20-20-20 Eye Rest Rule', 'sets' => 1, 'reps' => 'Hourly', 'rest' => '0s'];
            } elseif ($info['type'] === 'cardio') {
                $dayExercises[] = ['name' => 'Brisk Walking / Outdoor Walk', 'sets' => 1, 'reps' => '25 min', 'rest' => '0s'];
                $dayExercises[] = ['name' => 'Jumping Jacks', 'sets' => 3, 'reps' => '45s', 'rest' => '45s'];
            } else {
                $dayExercises[] = ['name' => 'Full-Body Cooldown Routine', 'sets' => 1, 'reps' => '10 min', 'rest' => '0s'];
            }

            $schedule[] = [
                'day' => $d,
                'focus' => $info['focus'],
                'exercises' => $dayExercises
            ];
        }

        $planJson = json_encode(['days' => $schedule], JSON_UNESCAPED_UNICODE);
        $title = "AI Personalized {$mins}-Min {$exp} Routine";

        // Deactivate old plans
        $pdo->prepare("UPDATE workout_plans SET is_active = 0 WHERE user_id = ?")->execute([$userId]);

        // Insert new plan
        $insStmt = $pdo->prepare("INSERT INTO workout_plans (user_id, title, split_type, is_active, plan_json) VALUES (?, ?, 'Personalized Split', 1, ?)");
        $insStmt->execute([$userId, $title, $planJson]);
        $planId = (int)$pdo->lastInsertId();

        echo json_encode([
            'success' => true,
            'message' => 'Customized workout plan generated successfully',
            'plan_id' => $planId,
            'title' => $title,
            'days' => $schedule
        ], JSON_UNESCAPED_UNICODE);
        break;

    case 'log_session':
        $title = trim($input['workout_title'] ?? 'Daily Workout Session');
        $duration = (int)($input['duration_minutes'] ?? 25);
        $effort = (int)($input['perceived_effort'] ?? 7);
        $energy = trim($input['energy_level'] ?? 'moderate');
        $soreness = trim($input['soreness_feedback'] ?? 'None');
        $notes = trim($input['notes'] ?? '');
        $logs = $input['exercise_logs'] ?? [];

        $stmt = $pdo->prepare("INSERT INTO workout_sessions (user_id, workout_title, duration_minutes, perceived_effort, energy_level, soreness_feedback, notes) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $title, $duration, $effort, $energy, $soreness, $notes]);
        $sessionId = (int)$pdo->lastInsertId();

        if (!empty($logs)) {
            $logStmt = $pdo->prepare("INSERT INTO workout_session_logs (session_id, exercise_name, set_number, reps_completed, weight_kg, feedback) VALUES (?, ?, ?, ?, ?, ?)");
            foreach ($logs as $l) {
                $exName = $l['name'] ?? 'Exercise';
                $setNum = (int)($l['set'] ?? 1);
                $reps = (int)($l['reps'] ?? 10);
                $weight = (float)($l['weight_kg'] ?? 0);
                $feedback = $l['feedback'] ?? 'suitable';
                $logStmt->execute([$sessionId, $exName, $setNum, $reps, $weight, $feedback]);
            }
        }

        echo json_encode(['success' => true, 'message' => 'Workout session saved to history', 'session_id' => $sessionId]);
        break;

    case 'get_history':
        $stmt = $pdo->prepare("SELECT * FROM workout_sessions WHERE user_id = ? ORDER BY completed_at DESC LIMIT 15");
        $stmt->execute([$userId]);
        $sessions = $stmt->fetchAll();

        foreach ($sessions as &$s) {
            $logStmt = $pdo->prepare("SELECT * FROM workout_session_logs WHERE session_id = ? ORDER BY id ASC");
            $logStmt->execute([$s['id']]);
            $s['logs'] = $logStmt->fetchAll();
        }

        echo json_encode(['success' => true, 'sessions' => $sessions], JSON_UNESCAPED_UNICODE);
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Unknown fitness action']);
        break;
}
