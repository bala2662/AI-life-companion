<?php
/**
 * Meals & Student Diet Planner API
 * Actions: get_preferences, save_preferences, get_plan, generate_plan
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../config/database.php';

$userId = Auth::requireAuth();
$pdo = Database::getConnection();

$action = $_GET['action'] ?? $_POST['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?? [];
if (!empty($input['action'])) {
    $action = $input['action'];
}

switch ($action) {
    case 'get_preferences':
        $stmt = $pdo->prepare("SELECT * FROM meal_preferences WHERE user_id = ?");
        $stmt->execute([$userId]);
        $pref = $stmt->fetch();
        if (!$pref) {
            $pref = [
                'diet_type' => 'veg',
                'budget_type' => 'student_budget',
                'daily_cost_limit_inr' => 140,
                'protein_target_g' => 65,
                'calories_target' => 2200,
                'allergies' => 'None'
            ];
        }
        echo json_encode(['success' => true, 'preferences' => $pref], JSON_UNESCAPED_UNICODE);
        break;

    case 'save_preferences':
        $diet = trim($input['diet_type'] ?? 'veg');
        $budget = trim($input['budget_type'] ?? 'student_budget');
        $cost = (int)($input['daily_cost_limit_inr'] ?? 140);
        $protein = (int)($input['protein_target_g'] ?? 65);
        $calories = (int)($input['calories_target'] ?? 2200);
        $allergies = trim($input['allergies'] ?? 'None');

        $stmt = $pdo->prepare("
            INSERT INTO meal_preferences (user_id, diet_type, budget_type, daily_cost_limit_inr, protein_target_g, calories_target, allergies)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                diet_type = VALUES(diet_type),
                budget_type = VALUES(budget_type),
                daily_cost_limit_inr = VALUES(daily_cost_limit_inr),
                protein_target_g = VALUES(protein_target_g),
                calories_target = VALUES(calories_target),
                allergies = VALUES(allergies)
        ");
        $stmt->execute([$userId, $diet, $budget, $cost, $protein, $calories, $allergies]);

        echo json_encode(['success' => true, 'message' => 'Diet preferences saved']);
        break;

    case 'get_plan':
        $stmt = $pdo->prepare("SELECT * FROM meal_plans WHERE user_id = ? ORDER BY FIELD(day_of_week,'Mon','Tue','Wed','Thu','Fri','Sat','Sun'), FIELD(meal_type,'breakfast','lunch','snack','dinner')");
        $stmt->execute([$userId]);
        $meals = $stmt->fetchAll();
        echo json_encode(['success' => true, 'meals' => $meals], JSON_UNESCAPED_UNICODE);
        break;

    case 'generate_plan':
        $diet = trim($input['diet_type'] ?? 'veg');
        $meals = [];

        if ($diet === 'non_veg' || $diet === 'egg') {
            $meals = [
                ['meal_type' => 'breakfast', 'title' => '3 Boiled Eggs & Whole Wheat Toast', 'desc' => 'High-protein breakfast to start your study day.', 'ingredients' => '3 Large Eggs, 2 Whole Wheat Bread Slices, Black Pepper, Banana', 'protein' => 20.0, 'calories' => 380, 'cost' => 35],
                ['meal_type' => 'lunch', 'title' => 'Chicken / Egg Curry with Steamed Rice', 'desc' => 'Satisfying student meal with complete amino acid profile.', 'ingredients' => 'Chicken Breast / Eggs (150g/2 eggs), Onion-Tomato Masala, Rice (1.5 cups), Cucumber', 'protein' => 28.0, 'calories' => 640, 'cost' => 60],
                ['meal_type' => 'snack', 'title' => 'Roasted Peanuts & Green Tea', 'desc' => 'Healthy fats and sustained alertness.', 'ingredients' => 'Roasted Peanuts (35g), Green Tea (1 cup)', 'protein' => 8.5, 'calories' => 200, 'cost' => 15],
                ['meal_type' => 'dinner', 'title' => 'Dal Tadka, Egg Bhurji & 2 Phulkas', 'desc' => 'Light, easily digestible restorative dinner.', 'ingredients' => 'Yellow Dal, 2 Eggs scrambled with onion/chili, 2 Rotis', 'protein' => 22.0, 'calories' => 500, 'cost' => 35]
            ];
        } else {
            $meals = [
                ['meal_type' => 'breakfast', 'title' => 'Sprouted Moong & Oats Porridge', 'desc' => 'High-fiber energizing breakfast with plant protein.', 'ingredients' => 'Green Moong Sprouts (50g), Oats (40g), Milk/Water (200ml), Jaggery, Peanuts (15g)', 'protein' => 18.0, 'calories' => 420, 'cost' => 30],
                ['meal_type' => 'lunch', 'title' => 'Toor Dal, Steamed Rice & Cucumbers', 'desc' => 'Comforting home-style staple with balanced digestion.', 'ingredients' => 'Yellow Toor/Moong Dal (60g), Steamed Rice (1.5 cups), Cumin Tadka, Cucumber slices', 'protein' => 20.5, 'calories' => 620, 'cost' => 38],
                ['meal_type' => 'snack', 'title' => 'Roasted Chana (Bengal Gram) & Chai', 'desc' => 'Slow-burning study snack preventing evening brain fog.', 'ingredients' => 'Roasted Chana (40g), Ginger Tea', 'protein' => 8.5, 'calories' => 180, 'cost' => 15],
                ['meal_type' => 'dinner', 'title' => 'High-Protein Paneer Bhurji / Soya & 2 Roti', 'desc' => 'Optimal night-time recovery meal.', 'ingredients' => 'Soya Chunks or Paneer (60g), 2 Wheat Rotis, Onion-Tomato Tadka', 'protein' => 24.0, 'calories' => 520, 'cost' => 42]
            ];
        }

        // Save generated plan for user for Monday as template
        $pdo->prepare("DELETE FROM meal_plans WHERE user_id = ? AND day_of_week = 'Mon'")->execute([$userId]);
        $insStmt = $pdo->prepare("INSERT INTO meal_plans (user_id, day_of_week, meal_type, title, description, ingredients, prep_steps, approx_protein_g, approx_calories, approx_cost_inr) VALUES (?, 'Mon', ?, ?, ?, ?, 'Simple student cooking: boil, stir-fry, or prepare fresh in under 15 minutes.', ?, ?, ?)");

        foreach ($meals as $m) {
            $insStmt->execute([$userId, $m['meal_type'], $m['title'], $m['desc'], $m['ingredients'], $m['protein'], $m['calories'], $m['cost']]);
        }

        echo json_encode([
            'success' => true,
            'message' => 'Customized student budget meal plan generated',
            'meals' => $meals,
            'notice' => 'Approximate nutritional estimates for general student reference; adjust according to personal dietary requirements.'
        ], JSON_UNESCAPED_UNICODE);
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Unknown meal action']);
        break;
}
