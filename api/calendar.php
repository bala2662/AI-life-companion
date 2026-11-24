<?php
/**
 * Calendar Integration & RFC 5545 iCalendar (.ICS) Exporter
 * Actions: export_ics, list_events
 */

declare(strict_types=1);

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../config/database.php';

$userId = Auth::requireAuth();
$pdo = Database::getConnection();

$action = $_GET['action'] ?? $_POST['action'] ?? 'export_ics';

switch ($action) {
    case 'export_ics':
        // 1. Fetch upcoming tasks with due dates
        $taskStmt = $pdo->prepare("SELECT id, title, category, priority, due_date, due_time, estimated_minutes FROM tasks WHERE user_id = ? AND is_completed = 0 AND due_date IS NOT NULL");
        $taskStmt->execute([$userId]);
        $tasks = $taskStmt->fetchAll();

        // 2. Fetch study plans / exam dates
        $examStmt = $pdo->prepare("SELECT id, subject_code, subject_name, target_exam_date FROM study_plans WHERE user_id = ? AND status = 'active'");
        $examStmt->execute([$userId]);
        $exams = $examStmt->fetchAll();

        // 3. Fetch weekly timetable slots
        $ttStmt = $pdo->prepare("SELECT id, day_of_week, start_time, end_time, subject_code, subject_name, room, instructor FROM timetable_slots WHERE user_id = ?");
        $ttStmt->execute([$userId]);
        $timetable = $ttStmt->fetchAll();

        // Build RFC 5545 .ics calendar content
        $ics = "BEGIN:VCALENDAR\r\n";
        $ics .= "VERSION:2.0\r\n";
        $ics .= "PRODID:-//AI Life Companion//Student Schedule & Deadlines//EN\r\n";
        $ics .= "CALSCALE:GREGORIAN\r\n";
        $ics .= "METHOD:PUBLISH\r\n";
        $ics .= "X-WR-CALNAME:AI Student Schedule\r\n";
        $ics .= "X-WR-TIMEZONE:UTC\r\n";

        $nowDt = gmdate('Ymd\THis\Z');

        // Export Exams
        foreach ($exams as $ex) {
            $dateStr = str_replace('-', '', $ex['target_exam_date']);
            $uid = "exam-" . $ex['id'] . "@ailifecompanion.local";
            $summary = "EXAM: " . addcslashes($ex['subject_name'], ",;\\");
            $desc = "Target Exam for " . addcslashes($ex['subject_code'] . " - " . $ex['subject_name'], ",;\\");

            $ics .= "BEGIN:VEVENT\r\n";
            $ics .= "UID:{$uid}\r\n";
            $ics .= "DTSTAMP:{$nowDt}\r\n";
            $ics .= "DTSTART;VALUE=DATE:{$dateStr}\r\n";
            $ics .= "DTEND;VALUE=DATE:{$dateStr}\r\n";
            $ics .= "SUMMARY:{$summary}\r\n";
            $ics .= "DESCRIPTION:{$desc}\r\n";
            $ics .= "CATEGORIES:ACADEMIC,EXAM\r\n";
            $ics .= "STATUS:CONFIRMED\r\n";
            $ics .= "BEGIN:VALARM\r\n";
            $ics .= "TRIGGER:-P1D\r\n";
            $ics .= "ACTION:DISPLAY\r\n";
            $ics .= "DESCRIPTION:Upcoming Exam Tomorrow: {$summary}\r\n";
            $ics .= "END:VALARM\r\n";
            $ics .= "END:VEVENT\r\n";
        }

        // Export Assignment / Task Deadlines
        foreach ($tasks as $t) {
            $dueDate = $t['due_date'];
            $dueTime = !empty($t['due_time']) ? $t['due_time'] : '23:59:00';
            $dtStart = gmdate('Ymd\THis\Z', (int)strtotime("{$dueDate} {$dueTime}"));
            $dtEnd = gmdate('Ymd\THis\Z', (int)strtotime("{$dueDate} {$dueTime}") + 3600);
            $uid = "task-" . $t['id'] . "@ailifecompanion.local";
            $summary = "[" . strtoupper($t['priority'] ?? 'TASK') . "] " . addcslashes($t['title'], ",;\\");
            $desc = "Task Deadline: " . addcslashes($t['title'], ",;\\") . " (" . $t['category'] . ")";

            $ics .= "BEGIN:VEVENT\r\n";
            $ics .= "UID:{$uid}\r\n";
            $ics .= "DTSTAMP:{$nowDt}\r\n";
            $ics .= "DTSTART:{$dtStart}\r\n";
            $ics .= "DTEND:{$dtEnd}\r\n";
            $ics .= "SUMMARY:{$summary}\r\n";
            $ics .= "DESCRIPTION:{$desc}\r\n";
            $ics .= "CATEGORIES:TASK,DEADLINE\r\n";
            $ics .= "BEGIN:VALARM\r\n";
            $ics .= "TRIGGER:-PT2H\r\n";
            $ics .= "ACTION:DISPLAY\r\n";
            $ics .= "DESCRIPTION:Assignment due in 2 hours: {$summary}\r\n";
            $ics .= "END:VALARM\r\n";
            $ics .= "END:VEVENT\r\n";
        }

        // Export Weekly Timetable (Next 4 weeks)
        $dayMap = ['Sun' => 0, 'Mon' => 1, 'Tue' => 2, 'Wed' => 3, 'Thu' => 4, 'Fri' => 5, 'Sat' => 6];
        foreach ($timetable as $slot) {
            $targetDayNum = $dayMap[$slot['day_of_week']] ?? 1;
            // Generate for current week and next 3 weeks
            for ($w = 0; $w < 4; $w++) {
                $timeOffset = strtotime("this week Sunday +{$targetDayNum} days +{$w} weeks");
                $dateStr = date('Y-m-d', $timeOffset);
                $startTime = $slot['start_time'];
                $endTime = $slot['end_time'];

                $dtStart = gmdate('Ymd\THis\Z', (int)strtotime("{$dateStr} {$startTime}"));
                $dtEnd = gmdate('Ymd\THis\Z', (int)strtotime("{$dateStr} {$endTime}"));
                $uid = "tt-{$slot['id']}-w{$w}@ailifecompanion.local";
                $summary = "CLASS: " . addcslashes($slot['subject_name'], ",;\\");
                $loc = addcslashes($slot['room'] . ($slot['instructor'] ? " (" . $slot['instructor'] . ")" : ""), ",;\\");

                $ics .= "BEGIN:VEVENT\r\n";
                $ics .= "UID:{$uid}\r\n";
                $ics .= "DTSTAMP:{$nowDt}\r\n";
                $ics .= "DTSTART:{$dtStart}\r\n";
                $ics .= "DTEND:{$dtEnd}\r\n";
                $ics .= "SUMMARY:{$summary}\r\n";
                $ics .= "LOCATION:{$loc}\r\n";
                $ics .= "CATEGORIES:TIMETABLE,LECTURE\r\n";
                $ics .= "END:VEVENT\r\n";
            }
        }

        $ics .= "END:VCALENDAR\r\n";

        header('Content-Type: text/calendar; charset=utf-8');
        header('Content-Disposition: attachment; filename="ai_life_companion_schedule.ics"');
        echo $ics;
        exit;

    case 'list_events':
        header('Content-Type: application/json; charset=UTF-8');
        $taskStmt = $pdo->prepare("SELECT id, title, category, priority, due_date, due_time FROM tasks WHERE user_id = ? AND is_completed = 0 AND due_date IS NOT NULL ORDER BY due_date ASC");
        $taskStmt->execute([$userId]);
        $tasks = $taskStmt->fetchAll();

        $examStmt = $pdo->prepare("SELECT id, subject_code, subject_name, target_exam_date FROM study_plans WHERE user_id = ? AND status = 'active' ORDER BY target_exam_date ASC");
        $examStmt->execute([$userId]);
        $exams = $examStmt->fetchAll();

        echo json_encode([
            'success' => true,
            'tasks' => $tasks,
            'exams' => $exams
        ], JSON_UNESCAPED_UNICODE);
        exit;

    default:
        http_response_code(400);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(['success' => false, 'error' => 'Unknown calendar action']);
        exit;
}
