/**
 * ==============================================================================
 * FITNESS, DIET & YOGA WELLNESS SERVICE (Sections 6, 7 & 8)
 * Workout routines, budget meal plans, grocery list generator, and yoga assistant
 * ==============================================================================
 */

const { db } = require('../db/database');

/**
 * Generate Personalized Workout Plan (Scenario C)
 */
function generateWorkoutPlan(userId, options = {}) {
  const profile = db.prepare('SELECT * FROM user_profiles WHERE user_id = ?').get(userId) || {};
  const goal = options.goal || profile.fitness_goal || 'general_fitness';
  const env = options.environment || 'home';
  const level = options.level || 'beginner';
  const equipment = options.equipment || ['bodyweight', 'dumbbells'];

  const routines = [];

  if (env === 'home') {
    routines.push({
      day: 'Monday & Thursday (Upper Body & Core)',
      exercises: [
        { name: 'Standard / Incline Push-ups', sets: 3, reps: '10-12', rest: '60s', notes: 'Maintain straight spine, engage core' },
        { name: 'Dumbbell / Backpack Floor Press', sets: 3, reps: '12', rest: '60s', notes: 'Alternative: Wide-grip push-ups' },
        { name: 'Plank Hold', sets: 3, reps: '30-45 sec', rest: '45s', notes: 'Breathe evenly, do not sag lower back' },
        { name: 'Dumbbell Bent-over Row', sets: 3, reps: '12', rest: '60s', notes: 'Strengthens upper back against slouching' }
      ]
    });
    routines.push({
      day: 'Tuesday & Friday (Lower Body & Mobility)',
      exercises: [
        { name: 'Bodyweight Air Squats', sets: 3, reps: '15', rest: '60s', notes: 'Knees track over toes, full depth' },
        { name: 'Walking Lunges', sets: 3, reps: '10 per leg', rest: '60s', notes: 'Keep torso upright' },
        { name: 'Glute Bridges', sets: 3, reps: '15', rest: '45s', notes: 'Activates glutes after prolonged sitting' },
        { name: 'Calf Raises', sets: 3, reps: '20', rest: '30s', notes: 'Hold top position for 1 second' }
      ]
    });
    routines.push({
      day: 'Wednesday & Saturday (Cardio & Active Recovery)',
      exercises: [
        { name: 'Brisk Walk / Jogging', sets: 1, reps: '25 mins', rest: 'N/A', notes: 'Aerobic heart health' },
        { name: 'Full Body Mobility Flow', sets: 1, reps: '15 mins', rest: 'N/A', notes: 'Hamstring & hip flexor stretches' }
      ]
    });
  } else {
    // Gym Routine
    routines.push({
      day: 'Push Day (Chest, Shoulders, Triceps)',
      exercises: [
        { name: 'Barbell / Dumbbell Bench Press', sets: 4, reps: '8-10', rest: '90s', notes: 'Controlled eccentric descent' },
        { name: 'Overhead Dumbbell Shoulder Press', sets: 3, reps: '10', rest: '75s', notes: 'Full overhead extension' },
        { name: 'Cable Tricep Pushdowns', sets: 3, reps: '12', rest: '60s', notes: 'Lock elbows at your side' }
      ]
    });
    routines.push({
      day: 'Pull Day (Back & Biceps)',
      exercises: [
        { name: 'Lat Pulldown / Pull-ups', sets: 4, reps: '8-12', rest: '90s', notes: 'Retract scapula first' },
        { name: 'Seated Cable Row', sets: 3, reps: '10-12', rest: '75s', notes: 'Squeeze shoulder blades' },
        { name: 'Incline Dumbbell Bicep Curls', sets: 3, reps: '12', rest: '60s', notes: 'Strict form, no swinging' }
      ]
    });
  }

  return {
    userGoal: goal,
    environment: env,
    experienceLevel: level,
    weeklyFrequency: '3-4 days/week with mandatory rest days',
    safetyDisclaimer: 'Notice: General exercise guidance only. Warm up for 5 minutes prior to lifting. If experiencing sharp pain, cease immediately and consult a physician.',
    routines
  };
}

/**
 * Generate Personalized Budget Diet & Meal Plan (Scenario D)
 */
function generateDietPlan(userId, options = {}) {
  const profile = db.prepare('SELECT * FROM user_profiles WHERE user_id = ?').get(userId) || {};
  const budget = options.budget || profile.food_budget || 'budget';
  const preference = options.preference || profile.dietary_preference || 'flexible';

  const isVeg = preference === 'vegetarian' || preference === 'vegan';

  const breakfastOptions = isVeg
    ? [
        { meal: 'Moong Dal Chilla / Sprouts Dosa + Mint Chutney', protein: '14g', budget: 'Affordable staple' },
        { meal: 'Oatmeal with Milk/Soymilk, Chia Seeds & Banana', protein: '12g', budget: 'High fiber & low cost' },
        { meal: 'Paneer Bhurji with 2 Whole Wheat Chapatis', protein: '18g', budget: 'Nutrient dense' }
      ]
    : [
        { meal: '3 Whole Eggs (Boiled / Scrambled) + 2 Slices Whole Grain Toast', protein: '18g', budget: 'Under Rs. 30 / ultra affordable' },
        { meal: 'Egg Omelette with Veggies + Oats Porridge', protein: '20g', budget: 'Clean sustained energy' },
        { meal: 'Idli (3 pcs) + Sambar + 2 Boiled Eggs', protein: '16g', budget: 'Classic balanced breakfast' }
      ];

  const lunchOptions = isVeg
    ? [
        { meal: 'Brown / Parboiled Rice + Thick Dal Tadka + Soya Chunks Curry + Cucumber Salad', protein: '26g', budget: 'Highest protein plant combo' },
        { meal: 'Rajma / Chole Curry + 2 Rotis + Curd (Dahi)', protein: '22g', budget: 'Rich in iron & micronutrients' }
      ]
    : [
        { meal: 'Rice / Rotis + Chicken Breast Curry / Fish Curry + Dal + Mixed Salad', protein: '32g', budget: 'Lean high biological protein' },
        { meal: 'Egg Fried Rice with Extra Egg Whites & Steamed Broccoli/Beans', protein: '24g', budget: 'Quick meal prep' }
      ];

  const dinnerOptions = [
    { meal: '2 Whole Wheat Chapatis + Palak Paneer / Tofu + Moong Dal Soup', protein: '20g', budget: 'Light and restorative before sleep' },
    { meal: 'Warm Vegetable Lentil Stew / Soup with Roasted Chickpeas', protein: '16g', budget: 'Easy digestion' }
  ];

  const snacks = [
    { item: 'Roasted Chana (Chickpeas) & Peanuts (Handful)', protein: '9g', cost: 'Economical pocket snack' },
    { item: 'Sprouted Green Gram Chaat with Lemon & Onion', protein: '10g', cost: 'Rich in live enzymes' },
    { item: 'A glass of Buttermilk / Chaas with Roasted Cumin', protein: '4g', cost: 'Gut microbiome support' }
  ];

  // Grocery list generation
  const groceryList = [
    { item: isVeg ? 'Soya Chunks (Nutrela)' : 'Eggs (30-egg crate)', estCost: 'Economical bulk buy', notes: 'Primary daily protein' },
    { item: 'Yellow Moong Dal & Toor Dal (1 kg each)', estCost: 'Monthly staple', notes: 'Comfort food & protein' },
    { item: 'Whole Wheat Atta / Rice', estCost: 'Standard staple', notes: 'Carbohydrate fuel' },
    { item: 'Peanuts & Roasted Chana (500g)', estCost: 'Pocket friendly', notes: 'Study snack' },
    { item: 'Seasonal Fresh Greens (Spinach, Cucumber, Tomatoes)', estCost: 'Weekly fresh buy', notes: 'Vitamins & fiber' }
  ];

  return {
    budgetTier: budget,
    dietaryPreference: preference,
    dailyProteinTargetEst: '75g - 90g (balanced for student cognitive performance)',
    waterIntakeGoal: '2,500 - 3,000 ml daily (8-10 glasses)',
    medicalNotice: 'Medical Disclaimer: These suggestions are general nutritional guidelines. For clinical conditions (diabetes, allergies, renal considerations), consult a registered dietitian.',
    meals: {
      breakfast: breakfastOptions,
      lunch: lunchOptions,
      dinner: dinnerOptions,
      healthySnacks: snacks
    },
    groceryList
  };
}

/**
 * Get Yoga & Wellness routines
 */
function getYogaAndWellnessRoutines() {
  return {
    routines: [
      {
        id: 'yoga-1',
        name: 'Surya Namaskar (Sun Salutation)',
        level: 'Beginner to Intermediate',
        durationMins: 12,
        cycles: '6 to 12 cycles',
        benefits: 'Improves blood circulation to the brain, stretches entire posterior chain',
        steps: [
          '1. Pranamasana (Prayer Pose) - Exhale and focus',
          '2. Hastauttanasana (Raised Arms Pose) - Inhale and arch back gently',
          '3. Hastapadasana (Standing Forward Bend) - Exhale, touch toes',
          '4. Ashwa Sanchalanasana (Equestrian Pose) - Inhale, step right leg back',
          '5. Dandasana (Plank Pose) - Retain breath, body in a straight line',
          '6. Ashtanga Namaskara (Salute with 8 parts) - Exhale, knees-chest-chin to floor',
          '7. Bhujangasana (Cobra Pose) - Inhale, lift chest gently',
          '8. Adho Mukha Svanasana (Downward Dog) - Exhale, hips elevated',
          '9. Repeat steps on opposite leg to complete cycle'
        ]
      },
      {
        id: 'yoga-2',
        name: 'Pranayama & Box Breathing (Study Focus)',
        level: 'All levels',
        durationMins: 5,
        technique: '4 seconds Inhale -> 4 seconds Hold -> 4 seconds Exhale -> 4 seconds Hold',
        benefits: 'Lowers acute exam anxiety, stabilizes heart rate variability (HRV), restores concentration',
        audioCue: 'Use the interactive breathing circle in the Wellness tab'
      },
      {
        id: 'yoga-3',
        name: 'Desk Ergo Stretches (Neck & Lumbar)',
        level: 'Beginner',
        durationMins: 3,
        steps: [
          'Chin Tucks: Retract chin gently backwards, hold 5 seconds (5 reps)',
          'Seated Spinal Twist: Turn torso to each side, holding chair back (15 seconds each)',
          'Wrist & Forearm Flexion: Pull fingers back gently to relieve typing fatigue'
        ]
      }
    ],
    guidance: 'Perform on an empty or light stomach. Breathe naturally through the nose.'
  };
}

module.exports = {
  generateWorkoutPlan,
  generateDietPlan,
  getYogaAndWellnessRoutines
};
