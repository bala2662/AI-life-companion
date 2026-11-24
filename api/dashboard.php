<?php
/**
 * Personalized Dashboard & Real Performance Tracking API Endpoint
 * Action: stats
 * Replaces fake/hardcoded numbers with true user-specific database statistics.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../config/database.php';

$userId = Auth::requireAuth();
$pdo = Database::getConnection();

$action = $_GET['action'] ?? $_POST['action'] ?? 'stats';

switch ($action) {
    case 'stats':
        // 1. User Account & Profile
        $userStmt = $pdo->prepare("SELECT id, name, email, role, avatar, learning_level, streak_count, synergy_score FROM users WHERE id = ?");
        $userStmt->execute([$userId]);
        $user = $userStmt->fetch();

        $profStmt = $pdo->prepare("SELECT course, semester, target_career, water_goal_ml, sleep_goal_hours, daily_available_hours FROM user_profiles WHERE user_id = ?");
        $profStmt->execute([$userId]);
        $profile = $profStmt->fetch() ?: [
            'course' => 'Computer Science',
            'semester' => 'Undergraduate',
            'target_career' => 'Junior Software Engineer',
            'water_goal_ml' => 2500,
            'sleep_goal_hours' => 7.5,
            'daily_available_hours' => 3.0
        ];

        // 2. Real Task Metrics
        $taskTotalStmt = $pdo->prepare("SELECT COUNT(*) FROM tasks WHERE user_id = ?");
        $taskTotalStmt->execute([$userId]);
        $totalTasks = (int)$taskTotalStmt->fetchColumn();

        $taskDoneStmt = $pdo->prepare("SELECT COUNT(*) FROM tasks WHERE user_id = ? AND is_completed = 1");
        $taskDoneStmt->execute([$userId]);
        $doneTasks = (int)$taskDoneStmt->fetchColumn();

        $pendingTasks = max(0, $totalTasks - $doneTasks);
        $taskPercent = ($totalTasks > 0) ? (int)round(($doneTasks / $totalTasks) * 100) : 0;

        // Upcoming task deadlines
        $upcomingStmt = $pdo->prepare("SELECT id, title, category, priority, due_date, due_time FROM tasks WHERE user_id = ? AND is_completed = 0 ORDER BY due_date ASC, due_time ASC LIMIT 4");
        $upcomingStmt->execute([$userId]);
        $upcomingTasks = $upcomingStmt->fetchAll();

        // 3. Real Study & Academic Progress
        $planStmt = $pdo->prepare("SELECT id, subject_code, subject_name, target_exam_date, total_portions, completed_portions FROM study_plans WHERE user_id = ? AND status = 'active' ORDER BY target_exam_date ASC");
        $planStmt->execute([$userId]);
        $studyPlans = $planStmt->fetchAll();

        $totalPortions = 0;
        $completedPortions = 0;
        $nextExam = null;
        $todayStr = date('Y-m-d');

        foreach ($studyPlans as $sp) {
            $totalPortions += (int)$sp['total_portions'];
            $completedPortions += (int)$sp['completed_portions'];
            if (!$nextExam && $sp['target_exam_date'] >= $todayStr) {
                $daysLeft = (int)ceil((strtotime($sp['target_exam_date']) - strtotime($todayStr)) / 86400);
                $nextExam = [
                    'subject' => $sp['subject_name'],
                    'date' => $sp['target_exam_date'],
                    'days_remaining' => max(0, $daysLeft)
                ];
            }
        }

        $academicPercent = ($totalPortions > 0) ? (int)round(($completedPortions / $totalPortions) * 100) : 0;

        // 4. Real Water Hydration & Health Habits Today
        $waterGoal = (int)($profile['water_goal_ml'] ?? 2500);
        $habitStmt = $pdo->prepare("SELECT current_count FROM user_habits WHERE user_id = ? AND habit_key = 'water_intake' AND last_logged_date = ?");
        $habitStmt->execute([$userId, $todayStr]);
        $waterToday = (int)$habitStmt->fetchColumn();

        $waterPercent = ($waterGoal > 0) ? min(100, (int)round(($waterToday / $waterGoal) * 100)) : 0;
        $streak = (int)($user['streak_count'] ?? 0);

        // 5. Composite Synergy Score Calculation
        $isEmptyState = ($totalTasks === 0 && count($studyPlans) === 0 && $waterToday === 0);
        if ($isEmptyState) {
            $synergyScore = 0;
        } else {
            // Weighted formula based on actual user data
            $synergyScore = (int)round(
                ($taskPercent * 0.35) + 
                ($academicPercent * 0.35) + 
                ($waterPercent * 0.15) + 
                (min(100, $streak * 5) * 0.15)
            );
        }

        // 6. Context-Aware AI Recommendations Grounded on Real Data
        $recommendations = [];
        if ($isEmptyState) {
            $recommendations[] = "Welcome to your new workspace! Start by adding your courses in the Study Planner or logging your daily tasks.";
        } else {
            if ($pendingTasks > 0) {
                $recommendations[] = "You have {$pendingTasks} pending tasks. Prioritize urgent academic deadlines first.";
            }
            if ($nextExam) {
                $recommendations[] = "{$nextExam['subject']} exam is in {$nextExam['days_remaining']} days. Dedicate a 45-min Pomodoro focus session today.";
            }
            if ($waterPercent < 50) {
                $recommendations[] = "Hydration alert: You have logged {$waterToday}ml of {$waterGoal}ml today. Drink a glass of water before studying.";
            }
        }

        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role'],
                'avatar' => $user['avatar'],
                'learning_level' => $user['learning_level'],
                'streak_count' => $streak,
                'course' => $profile['course'],
                'target_career' => $profile['target_career']
            ],
            'metrics' => [
                'is_empty_state' => $isEmptyState,
                'synergy_score' => $synergyScore,
                'tasks' => [
                    'total' => $totalTasks,
                    'done' => $doneTasks,
                    'pending' => $pendingTasks,
                    'completion_rate' => $taskPercent,
                    'upcoming' => $upcomingTasks
                ],
                'academics' => [
                    'mastery_percent' => $academicPercent,
                    'total_portions' => $totalPortions,
                    'completed_portions' => $completedPortions,
                    'active_plans_count' => count($studyPlans),
                    'next_exam' => $nextExam
                ],
                'wellness' => [
                    'water_current_ml' => $waterToday,
                    'water_goal_ml' => $waterGoal,
                    'water_percent' => $waterPercent,
                    'streak_days' => $streak
                ]
            ],
            'ai_recommendations' => $recommendations
        ], JSON_UNESCAPED_UNICODE);
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Unknown dashboard action']);
        break;
}
