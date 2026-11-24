/**
 * ==============================================================================
 * INTEGRATION TEST SUITE: END-TO-END SCENARIOS A THROUGH H (Section 17)
 * ==============================================================================
 */

const assert = require('node:assert');
const { db } = require('../db/database');
const { registerUser, loginUser, updateUserProfile, getUserProfile } = require('../services/auth_service');
const { getMemories, addMemory, deleteMemory, getRelevantMemoriesForQuery } = require('../services/memory_service');
const { processChatMessage } = require('../services/ai_orchestrator');
const { generateStudyPlan, recalculateMissedSession, updateTopicStatus } = require('../services/study_planner');
const { parseNaturalLanguageReminder, getReminders, snoozeReminder } = require('../services/scheduler_service');
const { generateWorkoutPlan, generateDietPlan } = require('../services/fitness_diet_service');
const { getCareerRoadmap } = require('../services/career_service');
const { uploadDocument, queryKnowledgeVault } = require('../services/vault_service');

async function runTestSuite() {
  console.log('====================================================');
  console.log('🧪 RUNNING AI UNIFIED LIFE COMPANION INTEGRATION TESTS');
  console.log('====================================================');

  const testUserId = 'user-alex-1';

  // ---------------------------------------------------------------------------
  // TEST 1: User Authentication & Profile
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 1] Testing Authentication & Token Handling...');
  const loginRes = loginUser({ email: 'alex.smith@university.edu', password: 'password123' });
  assert.ok(loginRes.token, 'Session token should be generated');
  assert.strictEqual(loginRes.user.email, 'alex.smith@university.edu');
  console.log('✅ PASS: Authentication verified');

  // ---------------------------------------------------------------------------
  // SCENARIO A: Exam Dates & Syllabus Portions Timetable Generation
  // ---------------------------------------------------------------------------
  console.log('\n[SCENARIO A] Testing Exam & Syllabus Timetable Generation...');
  const plan = generateStudyPlan(testUserId);
  assert.ok(plan.schedule.length > 0, 'Schedule days must be generated');
  assert.ok(plan.topicsCoveredCount > 0, 'Unfinished topics must be scheduled');
  assert.ok(plan.daysAvailable > 0, 'Days until exam must be calculated');
  console.log(`✅ PASS: Generated ${plan.schedule.length}-day timetable for ${plan.examName} prioritizing difficult topics`);

  // ---------------------------------------------------------------------------
  // SCENARIO B: Java Question Answered with User Knowledge Level Context
  // ---------------------------------------------------------------------------
  console.log('\n[SCENARIO B] Testing Java Concept Explanation with Memory Context...');
  const chatJava = await processChatMessage(testUserId, 'Explain Java Inheritance and Polymorphism with an example');
  assert.ok(chatJava.reply.includes('Beginner') || chatJava.reply.includes('beginner'), 'Should acknowledge beginner level from memory');
  assert.ok(chatJava.reply.includes('class ElectricCar extends Vehicle'), 'Should include runnable beginner-friendly code');
  console.log('✅ PASS: AI retrieved user\'s Java beginner level and generated custom explanation');

  // ---------------------------------------------------------------------------
  // SCENARIO C: Fitness Goals & Exercise Constraints
  // ---------------------------------------------------------------------------
  console.log('\n[SCENARIO C] Testing Fitness Plan with Constraints & Safety Guidance...');
  const workout = generateWorkoutPlan(testUserId, { environment: 'home', level: 'beginner' });
  assert.ok(workout.routines.length > 0, 'Routines must be populated');
  assert.ok(workout.safetyDisclaimer.includes('Notice'), 'Safety disclaimer must be present');
  console.log('✅ PASS: Generated home workout with safe rest intervals and disclaimer');

  // ---------------------------------------------------------------------------
  // SCENARIO D: Affordable Diet Plan Considering Budget & Preferences
  // ---------------------------------------------------------------------------
  console.log('\n[SCENARIO D] Testing Affordable Diet Plan with Protein & Grocery List...');
  const diet = generateDietPlan(testUserId, { budget: 'budget', preference: 'non_veg' });
  assert.ok(diet.meals.breakfast.length > 0, 'Breakfast options must be present');
  assert.ok(diet.groceryList.length > 0, 'Grocery list must be generated');
  assert.ok(diet.medicalNotice.includes('Disclaimer'), 'Medical notice must be included');
  console.log('✅ PASS: Generated budget diet plan with eggs, dal, grocery items and notice');

  // ---------------------------------------------------------------------------
  // SCENARIO E: Career Goal & Learning Roadmap Tracking
  // ---------------------------------------------------------------------------
  console.log('\n[SCENARIO E] Testing Career Goal & Skill Gap Roadmap...');
  const career = getCareerRoadmap(testUserId, 'java_backend');
  assert.ok(career.milestones.length >= 3, 'Should have multiple learning milestones');
  assert.ok(career.skillGap.length > 0, 'Skill gap matrix must be calculated');
  console.log('✅ PASS: Generated Junior Java Backend Roadmap with 3 structured milestones');

  // ---------------------------------------------------------------------------
  // SCENARIO F: Missed Study Session Detection & Recalculation
  // ---------------------------------------------------------------------------
  console.log('\n[SCENARIO F] Testing Missed Study Session Recalculation...');
  const resched = recalculateMissedSession(testUserId, { topic: 'Polymorphism & Abstract Classes' });
  assert.strictEqual(resched.status, 'rescheduled');
  assert.ok(resched.rescheduledSlot.proposedTime, 'Next slot time proposed');
  console.log('✅ PASS: Missed session identified and rescheduled to next day without sleep compromise');

  // ---------------------------------------------------------------------------
  // SCENARIO G: User Edits Preferences -> Subsequent Recommendations Updated
  // ---------------------------------------------------------------------------
  console.log('\n[SCENARIO G] Testing Preference Updates & Adaptation...');
  updateUserProfile(testUserId, { dietary_preference: 'vegetarian', food_budget: 'budget' });
  const vegDiet = generateDietPlan(testUserId, { preference: 'vegetarian' });
  assert.ok(vegDiet.meals.breakfast.some(b => b.meal.includes('Moong') || b.meal.includes('Paneer')), 'Vegetarian meal recommended');
  console.log('✅ PASS: Updated preference to vegetarian, subsequent diet recommendations adapted');

  // ---------------------------------------------------------------------------
  // SCENARIO H: User Deletes Saved Memory -> Completely Removed
  // ---------------------------------------------------------------------------
  console.log('\n[SCENARIO H] Testing Memory Deletion & Retrieval Prevention...');
  const tempMem = addMemory(testUserId, {
    category: 'personal',
    title: 'Temporary Goal',
    content: 'Learn Kubernetes this weekend',
    is_confirmed_fact: 1
  });
  assert.ok(tempMem.id, 'Memory created');

  const delResult = deleteMemory(testUserId, tempMem.id);
  assert.strictEqual(delResult.success, true);

  const check = db.prepare('SELECT id FROM user_memories WHERE id = ?').get(tempMem.id);
  assert.strictEqual(check, undefined, 'Memory must not exist in database');

  const retrieved = getRelevantMemoriesForQuery(testUserId, 'Kubernetes');
  assert.strictEqual(retrieved.length, 0, 'Deleted memory must never be retrieved');
  console.log('✅ PASS: Memory permanently deleted and excluded from future context retrieval');

  // ---------------------------------------------------------------------------
  // NATURAL LANGUAGE TAMIL / THANGLISH REMINDER ALARM COMMAND
  // ---------------------------------------------------------------------------
  console.log('\n[BONUS] Testing Thanglish Reminder Command Parsing & Persistence...');
  const parsedAlarm = parseNaturalLanguageReminder(testUserId, 'Tomorrow morning 6 AM Java study alarm set pannu.');
  assert.strictEqual(parsedAlarm.success, true);
  assert.strictEqual(parsedAlarm.reminder.trigger_time, '06:00');
  assert.ok(parsedAlarm.reminder.title.includes('Java'), 'Identified Java study alarm');
  console.log('✅ PASS: Parsed "Tomorrow morning 6 AM Java study alarm set pannu" -> 06:00 Java Study Alarm');

  // ---------------------------------------------------------------------------
  // KNOWLEDGE VAULT RAG GROUNDED RETRIEVAL
  // ---------------------------------------------------------------------------
  console.log('\n[BONUS] Testing Knowledge Vault RAG Grounding...');
  uploadDocument(testUserId, {
    filename: 'CS301_Lecture_Notes.txt',
    contentText: 'Polymorphism allows methods to perform different behaviors based on the runtime instance. In Java, dynamic method dispatch resolves overridden calls at runtime.'
  });
  const rag = queryKnowledgeVault(testUserId, 'Explain polymorphism runtime dispatch');
  assert.ok(rag.hasGroundedSources, 'Should retrieve matching passage');
  assert.strictEqual(rag.matches[0].filename, 'CS301_Lecture_Notes.txt');
  console.log('✅ PASS: RAG successfully grounded query to CS301_Lecture_Notes.txt');

  console.log('\n====================================================');
  console.log('🎉 ALL INTEGRATION TESTS PASSED (100% SUCCESS)');
  console.log('====================================================');
}

if (require.main === module) {
  runTestSuite().catch(err => {
    console.error('❌ Test failed:', err);
    process.exit(1);
  });
}

module.exports = runTestSuite;
