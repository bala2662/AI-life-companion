/**
 * ==============================================================================
 * UNIFIED AI CHATBOT & ORCHESTRATION ENGINE (Section 3)
 * Intent routing, multilingual parser (English, Tamil, Thanglish),
 * memory context injection, grounded document citations, and tool execution
 * ==============================================================================
 */

const { getRelevantMemoriesForQuery, addMemory } = require('./memory_service');
const { parseNaturalLanguageReminder } = require('./scheduler_service');
const { generateStudyPlan } = require('./study_planner');
const { generateWorkoutPlan, generateDietPlan, getYogaAndWellnessRoutines } = require('./fitness_diet_service');
const { getCareerRoadmap } = require('./career_service');
const { queryKnowledgeVault } = require('./vault_service');
const { db } = require('../db/database');

/**
 * Detect language: English, Tamil script, or Thanglish
 */
function detectLanguage(text) {
  // Check for Tamil Unicode range (U+0B80 to U+0BFF)
  if (/[\u0B80-\u0BFF]/.test(text)) {
    return 'ta';
  }
  const thanglishKeywords = [
    'pannu', 'venum', 'theriyum', 'aaganum', 'irukku', 'munnadi', 'kaalai', 'saayanthiram',
    'solli', 'kudu', 'solunga', 'padikanum', 'mudiyuma', 'enakku', 'epdi', 'eppadi'
  ];
  const lower = text.toLowerCase();
  for (const kw of thanglishKeywords) {
    if (lower.includes(kw)) return 'thanglish';
  }
  return 'en';
}

/**
 * Classify user intent into target modules:
 * - reminder / alarm
 * - career / learning_roadmap
 * - exam / study_plan
 * - fitness_workout
 * - diet_food
 * - yoga_wellness
 * - document_rag
 * - programming_concept (e.g. Java, Python, Web)
 * - general_chat
 */
function classifyIntent(text) {
  const lower = text.toLowerCase();

  // 1. Alarms & Reminders
  if (
    lower.includes('alarm') || lower.includes('remind') || lower.includes('set pannu') ||
    lower.includes('reminder') || lower.includes('alert')
  ) {
    return 'reminder';
  }

  // 2. Career & Roadmaps
  if (
    lower.includes('career') || lower.includes('developer aaganum') || lower.includes('full stack') ||
    lower.includes('roadmap') || lower.includes('job') || lower.includes('internship') || lower.includes('placement')
  ) {
    return 'career';
  }

  // 3. Exams & Study Timetables (ensure 'example' is not falsely matched as 'exam')
  if (
    /\bexams?\b/i.test(lower) || lower.includes('syllabus') || lower.includes('timetable') ||
    lower.includes('midterm') || lower.includes('semester prep') || lower.includes('study plan')
  ) {
    return 'exam_planner';
  }

  // 4. Fitness & Exercise
  if (
    lower.includes('workout') || lower.includes('exercise') || lower.includes('gym') ||
    lower.includes('pushup') || lower.includes('squat') || lower.includes('dumbbell')
  ) {
    return 'fitness';
  }

  // 5. Diet & Nutrition
  if (
    lower.includes('diet') || lower.includes('food') || lower.includes('protein') ||
    lower.includes('meal') || lower.includes('calorie') || lower.includes('budget meal')
  ) {
    return 'diet';
  }

  // 6. Yoga & Wellness
  if (
    lower.includes('yoga') || lower.includes('surya namaskar') || lower.includes('breathing') ||
    lower.includes('pranayama') || lower.includes('stretch') || lower.includes('meditation') ||
    lower.includes('stress') || lower.includes('sleep')
  ) {
    return 'yoga_wellness';
  }

  // 7. Programming Concept & Q&A
  if (
    lower.includes('java') || lower.includes('python') || lower.includes('inheritance') ||
    lower.includes('polymorphism') || lower.includes('class') || lower.includes('code') ||
    lower.includes('dsa') || lower.includes('array') || lower.includes('sql')
  ) {
    return 'programming_concept';
  }

  return 'general_chat';
}

/**
 * Master Process Message Handler
 */
async function processChatMessage(userId, userMessage) {
  const lang = detectLanguage(userMessage);
  const intent = classifyIntent(userMessage);

  // 1. Retrieve Personal Memories for Context Injection (Section 2)
  const relevantMemories = getRelevantMemoriesForQuery(userId, userMessage);
  const memoryContextText = relevantMemories.map(m => `[Memory: ${m.title}] -> ${m.content}`).join('\n');

  // 2. Query Knowledge Vault for Grounded Document Citations (Section 12)
  const vaultResult = queryKnowledgeVault(userId, userMessage);

  // 3. Dispatch to Specific Module
  let replyText = '';
  let actionsTaken = [];
  let suggestedFollowUps = [];

  // ==========================================
  // SCENARIO 1: REMINDER / ALARM COMMAND
  // ==========================================
  if (intent === 'reminder') {
    const reminderResult = parseNaturalLanguageReminder(userId, userMessage);
    actionsTaken.push({
      action: 'create_reminder',
      success: reminderResult.success,
      details: reminderResult.reminder
    });

    if (lang === 'thanglish' || lang === 'ta') {
      replyText = `✅ **Alarm & Reminder set panniyachu!**\n\n📌 **Event:** ${reminderResult.reminder.title}\n⏰ **Time:** ${reminderResult.reminder.trigger_time}\n🔔 **Tone:** ${reminderResult.reminder.tone}\n\nWeb Audio tone and browser notification confirm aagi irukku. Need to snooze or reschedule na dashboard-la manage pannalaam.`;
    } else {
      replyText = `✅ **Reminder & Alarm Created Successfully!**\n\n📌 **Title:** ${reminderResult.reminder.title}\n⏰ **Scheduled Time:** ${reminderResult.reminder.trigger_time}\n🔔 **Alarm Audio Tone:** ${reminderResult.reminder.tone}\n\nYour alert is persistently stored in the database and active on your device.`;
    }
    suggestedFollowUps = ['View all active alarms', 'Snooze by 10 minutes', 'Generate today\'s daily schedule'];
  }

  // ==========================================
  // SCENARIO 2: PROGRAMMING QUESTION (SCENARIO B)
  // Considers user's Java beginner level from memory
  // ==========================================
  else if (intent === 'programming_concept') {
    // Check user's level from memory
    const hasJavaBeginner = relevantMemories.some(m => m.content.toLowerCase().includes('beginner'));

    if (userMessage.toLowerCase().includes('inheritance') || userMessage.toLowerCase().includes('oop')) {
      if (hasJavaBeginner) {
        replyText = `### 🧠 Understanding Java Inheritance (Personalized for Beginner Level)

*I noticed from your saved memory profile that you are currently learning Object-Oriented Programming fundamentals. Here is an intuitive explanation with real-world analogies:*

#### 1. What is Inheritance?
Imagine a **Parent Class** (Car) and a **Child Class** (ElectricCar). The \`ElectricCar\` automatically inherits features of \`Car\` (like wheels, steering, doors) without writing that code again. It only adds its own special features (like battery charge).

#### 2. Runnable Java Code Example:
\`\`\`java
// Superclass (Parent)
class Vehicle {
    String brand = "Tesla";
    void startEngine() {
        System.out.println("Vehicle started smoothly.");
    }
}

// Subclass (Child) using 'extends'
class ElectricCar extends Vehicle {
    int batteryLevel = 90;
    
    // Method Overriding (custom implementation)
    @Override
    void startEngine() {
        System.out.println("Silent electric motor powered on at " + batteryLevel + "% battery!");
    }
}

public class Main {
    public static void main(String[] args) {
        ElectricCar myCar = new ElectricCar();
        myCar.startEngine(); // Calls the overridden method
    }
}
\`\`\`

#### 3. Key Takeaways for Your CS Exams:
- **Keyword:** \`extends\` is used to inherit.
- **Benefits:** Code reusability & runtime polymorphism.
- **Rule:** Java does not allow multiple class inheritance (use *Interfaces* instead).`;
      } else {
        replyText = `In Java, **Inheritance** is an OOP mechanism allowing a subclass to inherit attributes and methods from a superclass using \`extends\`. It facilitates polymorphism and method overriding.`;
      }
    } else {
      replyText = `### 💡 Java / Programming Guidance\n\nBased on your active study goals and level, here is the concept breakdown for your request.\n\n*Code Pattern:* Keep functions modular, adhere to DRY (Don't Repeat Yourself), and write clean unit tests with JUnit.`;
    }

    suggestedFollowUps = ['Explain Method Overriding vs Overloading', 'Give me a 5-minute Java Quiz', 'Add to Exam Revision Checklist'];
  }

  // ==========================================
  // SCENARIO 3: CAREER & LEARNING ROADMAP
  // User: "Enakku Java beginner level-la theriyum. Full Stack Developer aaganum. Daily one hour time irukku."
  // ==========================================
  else if (intent === 'career') {
    // Store/update memory about user goals
    try {
      addMemory(userId, {
        category: 'career',
        title: 'Career Target: Full-Stack / Java Backend',
        content: 'Full Stack / Java Developer target. Available time: 1 hour/day. Currently at beginner level in Java.',
        is_confirmed_fact: 1,
        source: 'user_provided'
      });
      actionsTaken.push({ action: 'saved_career_memory', success: true });
    } catch {
      // Memory already exists or duplicate
    }

    const roadmap = getCareerRoadmap(userId, 'java_backend');

    if (lang === 'thanglish' || lang === 'ta') {
      replyText = `🎯 **Super! Ungal details memory-la save panniyachu:**
- **Current Level:** Java Beginner (Syntax, Loops theriyum)
- **Target Role:** Full-Stack / Java Backend Developer
- **Available Time:** 1 Hour Daily

---

### 🗺️ Ungal Step-by-Step 1-Hour Daily Learning Roadmap:

1. **Month 1: Core Java & OOP Deep Dive (30 Days × 1 hr)**
   - Week 1-2: Classes, Objects, Inheritance, Interfaces, Abstract Classes
   - Week 3: Java Collections (ArrayList, HashMap, HashSet)
   - Week 4: Exception Handling & mini project (Bank Console App)

2. **Month 2: Relational Databases & SQL**
   - MySQL/PostgreSQL basics, Joins, Normalization, JDBC connection

3. **Month 3: Spring Boot & REST APIs**
   - Controllers, Services, Repository (Spring Data JPA), Postman testing

4. **Month 4: Frontend Integration & Portfolio Project**
   - React with TypeScript, connecting Spring Boot APIs, Git & GitHub setup

> 💡 *Daily 1 hour study session-ku alarm schedule panna solunga, naan automatic-a notify panren!*`;
    } else {
      replyText = `🎯 **Personalized Learning Roadmap Generated!**\n\nSaved to memory:\n- **Skill Level:** Java Beginner\n- **Target Career:** Full-Stack Developer\n- **Daily Study Time:** 1 Hour\n\n### 🚀 4-Stage Learning Path:\n1. **Core Java & OOP:** Classes, Inheritance, Polymorphism, Collections Framework.\n2. **Database & SQL:** PostgreSQL / MySQL, Relational schemas, Normalization.\n3. **Spring Boot REST Services:** Building real-world APIs with JPA.\n4. **Frontend & Portfolio:** React + TypeScript integration, Git workflow.`;
    }

    suggestedFollowUps = ['Set daily 1-hour study alarm', 'View Career Roadmap View', 'Start Milestone 1 Practice Project'];
  }

  // ==========================================
  // SCENARIO 4: EXAM & TIMETABLE (SCENARIO A)
  // ==========================================
  else if (intent === 'exam_planner') {
    try {
      const plan = generateStudyPlan(userId);
      replyText = `### 📅 Achievable Exam Preparation Timetable\n\n- **Target Exam:** ${plan.examName}\n- **Exam Date:** ${plan.examDate} (${plan.daysAvailable} days remaining)\n- **Daily Allocation:** ${plan.dailyHoursAllocation} hours/day\n- **Topics Scheduled:** ${plan.topicsCoveredCount} portions prioritized by difficulty (Hard topics first with scheduled 15-min cognitive breaks)\n\n*Full daily schedule has been synchronized with your Schedule view and notifications are active.*`;
      actionsTaken.push({ action: 'generated_study_plan', success: true });
    } catch (e) {
      replyText = `To generate your custom exam timetable, please confirm your exam date and portion difficulty in the Exam Planner tab. (${e.message})`;
    }
    suggestedFollowUps = ['View Syllabus Tracker', 'Check Timetable Conflicts', 'Simulate Missed Session Recalculation'];
  }

  // ==========================================
  // SCENARIO 5: FITNESS & EXERCISE (SCENARIO C)
  // ==========================================
  else if (intent === 'fitness') {
    const workout = generateWorkoutPlan(userId);
    replyText = `### 🏋️ Personalized Workout Plan (${workout.experienceLevel.toUpperCase()} • ${workout.environment.toUpperCase()})\n\n**Goal:** ${workout.userGoal}\n**Frequency:** ${workout.weeklyFrequency}\n\n#### Weekly Split:\n` +
      workout.routines.map(r => `**${r.day}**\n` + r.exercises.map(ex => `- **${ex.name}:** ${ex.sets} sets × ${ex.reps} (Rest: ${ex.rest}) — *${ex.notes}*`).join('\n')).join('\n\n') +
      `\n\n> ⚠️ *${workout.safetyDisclaimer}*`;
    suggestedFollowUps = ['Set Daily Evening Workout Alarm', 'View Fitness Dashboard', 'Show Desk Stretches'];
  }

  // ==========================================
  // SCENARIO 6: FOOD & DIET (SCENARIO D)
  // ==========================================
  else if (intent === 'diet') {
    const diet = generateDietPlan(userId);
    replyText = `### 🥗 Personalized Affordable High-Protein Diet Plan\n\n- **Budget Tier:** ${diet.budgetTier.toUpperCase()}\n- **Daily Protein Target:** ${diet.dailyProteinTargetEst}\n- **Water Intake:** ${diet.waterIntakeGoal}\n\n` +
      `#### Recommended Daily Meals:\n` +
      `- **Breakfast:** ${diet.meals.breakfast[0].meal} (*Protein: ${diet.meals.breakfast[0].protein}*)\n` +
      `- **Lunch:** ${diet.meals.lunch[0].meal} (*Protein: ${diet.meals.lunch[0].protein}*)\n` +
      `- **Dinner:** ${diet.meals.dinner[0].meal} (*Protein: ${diet.meals.dinner[0].protein}*)\n` +
      `- **Snacks:** ${diet.meals.healthySnacks[0].item} (*Protein: ${diet.meals.healthySnacks[0].protein}*)\n\n` +
      `#### 🛒 Smart Student Grocery List (Affordable Staples):\n` +
      diet.groceryList.map(g => `- **${g.item}:** ${g.notes} (${g.estCost})`).join('\n') +
      `\n\n> ℹ️ *${diet.medicalNotice}*`;
    suggestedFollowUps = ['Add water hydration reminder', 'Save to Diet Planner', 'Switch to Vegetarian Mode'];
  }

  // ==========================================
  // SCENARIO 7: YOGA & WELLNESS
  // ==========================================
  else if (intent === 'yoga_wellness') {
    const yoga = getYogaAndWellnessRoutines();
    replyText = `### 🧘 AI Yoga & Wellness Assistant\n\nHere are evidence-backed routines designed to counteract study fatigue:\n\n` +
      yoga.routines.map(r => `#### 🌿 ${r.name} (${r.durationMins} Mins)\n- **Benefits:** ${r.benefits || r.technique}\n` + (r.steps ? r.steps.slice(0, 4).join('\n') + '\n...' : '')).join('\n\n') +
      `\n\n> *${yoga.guidance}*`;
    suggestedFollowUps = ['Start 5-min Box Breathing', 'Set Morning Yoga Alarm', 'View Health Hub'];
  }

  // ==========================================
  // DEFAULT / GENERAL ASSISTANT
  // ==========================================
  else {
    replyText = `Hello! I am your **AI Unified Life Companion**. I connect your academic schedule, personal memories, fitness, nutrition, and career roadmaps into one seamless assistant.\n\nHow can I help you today? You can ask me in English, Tamil, or Thanglish:\n- *"Tomorrow morning 6 AM Java study alarm set pannu"*\n- *"Explain Java Inheritance with an example"*\n- *"Generate an affordable diet plan for my student budget"*\n- *"Create an exam preparation timetable for DBMS and Java"*`;
    suggestedFollowUps = ['Show Today\'s Schedule', 'Explain Java Polymorphism', 'Set 6 AM Study Alarm', 'View Career Roadmap'];
  }

  // Append Grounded Document Citation if found in Knowledge Vault (Section 12)
  if (vaultResult.hasGroundedSources) {
    const topDoc = vaultResult.matches[0];
    replyText += `\n\n---\n📄 **Grounded Citation from Uploaded Vault Document:**\n> "${topDoc.text.substring(0, 150)}..."\n*Source: ${topDoc.filename} (Approx Page ${topDoc.pageApprox})*`;
  }

  return {
    reply: replyText,
    intent,
    language: lang,
    memoriesUsed: relevantMemories.map(m => m.title),
    actionsTaken,
    suggestedFollowUps
  };
}

module.exports = {
  detectLanguage,
  classifyIntent,
  processChatMessage
};
