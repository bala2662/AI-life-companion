<?php
/**
 * Study, Timetable & Exam Preparation API
 * Actions: 
 * - get_timetable, add_timetable_slot, delete_timetable_slot
 * - get_study_plan, generate_study_plan
 * - solve_doubt, generate_quiz
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
    case 'get_timetable':
        $stmt = $pdo->prepare("SELECT * FROM timetable_slots WHERE user_id = ? ORDER BY FIELD(day_of_week,'Mon','Tue','Wed','Thu','Fri','Sat','Sun'), start_time ASC");
        $stmt->execute([$userId]);
        $slots = $stmt->fetchAll();
        echo json_encode(['success' => true, 'slots' => $slots], JSON_UNESCAPED_UNICODE);
        break;

    case 'add_timetable_slot':
        $day = trim($input['day_of_week'] ?? 'Mon');
        $start = trim($input['start_time'] ?? '09:00:00');
        $end = trim($input['end_time'] ?? '10:30:00');
        $code = trim($input['subject_code'] ?? 'CS301');
        $name = trim($input['subject_name'] ?? 'Subject');
        $room = trim($input['room'] ?? 'Hall B3');
        $instructor = trim($input['instructor'] ?? '');

        $stmt = $pdo->prepare("INSERT INTO timetable_slots (user_id, day_of_week, start_time, end_time, subject_code, subject_name, room, instructor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $day, $start, $end, $code, $name, $room, $instructor]);
        $id = (int)$pdo->lastInsertId();

        echo json_encode(['success' => true, 'message' => 'Class slot added', 'id' => $id]);
        break;

    case 'delete_timetable_slot':
        $id = (int)($_GET['id'] ?? $input['id'] ?? 0);
        $stmt = $pdo->prepare("DELETE FROM timetable_slots WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $userId]);
        echo json_encode(['success' => true, 'message' => 'Class slot removed']);
        break;

    case 'generate_study_plan':
        $examDate = trim($input['exam_date'] ?? '2026-11-15');
        $subject = trim($input['subject_name'] ?? 'Object-Oriented Programming (Java)');
        $hoursPerDay = (float)($input['hours_per_day'] ?? 2.5);
        $weakTopics = $input['weak_topics'] ?? ['Inheritance & Abstract Classes', 'Interfaces', 'Polymorphism'];

        // Calculate available days
        $target = new DateTime($examDate);
        $today = new DateTime();
        $diff = $today->diff($target);
        $daysAvailable = max(1, $diff->days);

        $planStructure = [
            'subject' => $subject,
            'exam_date' => $examDate,
            'days_available' => $daysAvailable,
            'daily_study_hours' => $hoursPerDay,
            'schedule' => [
                ['day' => 'Day 1-2', 'topic' => 'Class Architecture & Constructor Overloading', 'type' => 'Core Foundations', 'duration' => $hoursPerDay . ' hrs'],
                ['day' => 'Day 3-4', 'topic' => 'Inheritance Hierarchies & Method Overriding', 'type' => 'Weak Topic Focus', 'duration' => $hoursPerDay . ' hrs'],
                ['day' => 'Day 5', 'topic' => 'Interfaces & Diamond Problem Resolution', 'type' => 'Deep Focus & Code Exercises', 'duration' => $hoursPerDay . ' hrs'],
                ['day' => 'Day 6', 'topic' => 'Exception Handling & Custom Exceptions', 'type' => 'Practical Labs', 'duration' => $hoursPerDay . ' hrs'],
                ['day' => 'Day 7', 'topic' => 'Full Syllabus Revision & Mock Test', 'type' => 'Exam Simulation', 'duration' => $hoursPerDay . ' hrs']
            ]
        ];

        $planJson = json_encode($planStructure, JSON_UNESCAPED_UNICODE);
        $stmt = $pdo->prepare("INSERT INTO study_plans (user_id, subject_code, subject_name, target_exam_date, daily_available_hours, plan_json) VALUES (?, 'CS302', ?, ?, ?, ?)");
        $stmt->execute([$userId, $subject, $examDate, $hoursPerDay, $planJson]);
        $planId = (int)$pdo->lastInsertId();

        echo json_encode(['success' => true, 'plan_id' => $planId, 'plan' => $planStructure], JSON_UNESCAPED_UNICODE);
        break;

    case 'generate_quiz':
        $topic = trim($input['topic'] ?? 'Java OOP');
        $quiz = [
            'question' => 'Which keyword prevents a Java method from being overridden in a child class?',
            'options' => ['static', 'final', 'abstract', 'synchronized'],
            'correct_index' => 1,
            'explanation' => "In Java, marking a method with the 'final' modifier prevents subclasses from overriding it. Marking a class as 'final' prevents inheritance entirely (e.g., java.lang.String is final)."
        ];
        echo json_encode(['success' => true, 'quiz' => $quiz], JSON_UNESCAPED_UNICODE);
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Unknown study action']);
        break;
}
