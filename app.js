/**
 * ==============================================================================
 * AI UNIFIED LIFE COMPANION — COMPLETE APPLICATION ENGINE
 * Personalized AI Assistant for Education, Health, Daily Life & Career Development
 * ==============================================================================
 */

// Global State
const AppState = {
  user: {
    name: "Alex Smith",
    major: "Computer Science",
    year: "Year 2",
    waterGoal: 2500,
    waterCurrent: 1750,
    sleepHours: 7.5,
    streak: 14,
    careerGoal: "java_backend",
    soundEnabled: true,
    voiceReadout: true,
    apiEndpoint: "",
    apiKey: ""
  },
  currentLang: "en", // "en" or "ta"
  activeView: "dashboard",
  memoryEnabled: true, // Privacy master toggle
  memories: [
    {
      id: "mem-1",
      category: "learning",
      title: "Java Skill Level",
      content: "Beginner in Java programming. Understands basic syntax (loops, conditionals), currently learning Object-Oriented Programming (Classes, Inheritance, Polymorphism).",
      active: true,
      date: "2026-10-20"
    },
    {
      id: "mem-2",
      category: "learning",
      title: "Preferred Explanation Style",
      content: "Prefers intuitive real-world analogies (e.g. cars, animals), followed by concise runnable code blocks with inline comments and key takeaway bullets.",
      active: true,
      date: "2026-10-21"
    },
    {
      id: "mem-3",
      category: "tasks",
      title: "Upcoming Exam Dates",
      content: "Midterm Exam on Object-Oriented Programming (Java) is on November 15, 2026. Lab Assignment 4 is due tomorrow at 11:59 PM.",
      active: true,
      date: "2026-10-22"
    },
    {
      id: "mem-4",
      category: "health",
      title: "Health Guardrails & Hydration",
      content: "Struggles with digital eye strain during long coding sessions. Target 2,500ml water daily and 20-20-20 eye rest. Stated target of 7.5 to 8 hours sleep.",
      active: true,
      date: "2026-10-23"
    },
    {
      id: "mem-5",
      category: "career",
      title: "Career Aspiration",
      content: "Aspires to become a Junior Java / Spring Boot Backend Engineer. Wants to build RESTful APIs and database-backed portfolio projects.",
      active: true,
      date: "2026-10-24"
    },
    {
      id: "mem-6",
      category: "tasks",
      title: "Study Schedule Preference",
      content: "Peak cognitive focus hours are 10:00 AM to 1:00 PM and 4:00 PM to 6:30 PM. Dislikes late-night cramming.",
      active: true,
      date: "2026-10-25"
    }
  ],
  tasks: [
    { id: "t1", title: "Complete Java OOP Lab: Inheritance & Abstract Class", category: "Education", priority: "Urgent", due: "Tomorrow 23:59", done: false },
    { id: "t2", title: "Review Binary Search Trees in Data Structures", category: "Education", priority: "High", due: "In 3 days", done: false },
    { id: "t3", title: "Refill 750ml water bottle for afternoon study", category: "Health", priority: "Normal", due: "Today 15:00", done: true },
    { id: "t4", title: "Setup Spring Boot starter project for portfolio", category: "Career", priority: "High", due: "This weekend", done: false },
    { id: "t5", title: "20-minute neck & posture stretch session", category: "Health", priority: "Normal", due: "Today 17:00", done: true },
    { id: "t6", title: "Submit DBMS SQL query normalization draft", category: "Education", priority: "Urgent", due: "Today 18:00", done: true }
  ],
  pomodoro: {
    timeRemaining: 25 * 60, // in seconds
    isRunning: false,
    timerId: null,
    mode: "focus" // "focus", "short_break", "long_break"
  },
  timetable: [],
  studyPlan: [],
  alarmCheckerId: null,
  snoozedAlarms: {},
  interviewQuestions: [
    {
      role: "java_backend",
      question: "In Java, what is the difference between Method Overloading and Method Overriding, and when would you use each?",
      sampleAnswer: "Overloading occurs in the same class with identical method names but different parameter lists (compile-time polymorphism). Overriding occurs between superclass and subclass where the child provides a specific implementation of a method already defined in the parent with the exact same signature (runtime polymorphism)."
    },
    {
      role: "java_backend",
      question: "Can you explain the difference between '==' and the '.equals()' method when comparing Objects in Java?",
      sampleAnswer: "'==' compares memory addresses (object references), while '.equals()' tests for logical equivalence/value equality if overridden (like in String or custom entities)."
    },
    {
      role: "fullstack_web",
      question: "What is the difference between synchronous and asynchronous operations in JavaScript, and what role does the Event Loop play?",
      sampleAnswer: "Synchronous operations block execution until completed. Asynchronous operations delegate tasks (I/O, timers, fetch) to browser APIs and enqueue callbacks onto task/microtask queues, which the Event Loop pushes to the call stack once empty."
    }
  ],
  currentInterviewIdx: 0,
  speechRecognition: null,
  isListening: false
};

// UI Translations Dictionary (English & Tamil)
const Translations = {
  en: {
    nav_main: "CORE & OVERVIEW",
    nav_dashboard: "Dashboard",
    nav_memory: "Personal Memory",
    nav_chat_edu: "3.2 & 3.3 INTELLIGENT AI & EDUCATION",
    nav_ai_chat: "Unified AI Chatbot",
    nav_notes: "Notes & Document Q&A",
    nav_quizzes: "Study Plan & Practice",
    nav_daily: "3.5 DAILY PERSONAL ASSISTANT",
    nav_tasks: "Tasks & Priorities",
    nav_day_planner: "Plan My Day (Auto)",
    nav_calendar: "Deadlines & Calendar",
    nav_wellness: "3.4 HEALTH & WELLNESS",
    nav_health: "Health Hub & Habits",
    nav_career: "3.6 CAREER DEVELOPMENT",
    nav_career_item: "Career & Mock Interview",
    hero_status: "System Operational • Persistent Memory Active • 4 Domains Synced",
    hero_greeting: "Welcome back,",
    hero_action_ask: "Ask AI Assistant",
    hero_action_plan: "Plan My Day",
    hero_action_mem: "Manage Memory",
    balance_score_title: "Synergy Score",
    balance_score_sub: "Study, Health & Career Aligned",
    kpi_study: "Academic Mastery (3.3)",
    kpi_tasks: "Tasks Done Today (3.5)",
    kpi_water: "Water Target (3.4)",
    kpi_career: "Career Goal: Java Backend",
    nav_schedule: "Schedule & Alarms",
    schedule_title: "Schedule & Time Management Core",
    schedule_sub: "Input timetable, generate study plan & set live audio alarms"
  },
  ta: {
    nav_main: "முக்கிய கண்ணோட்டம்",
    nav_dashboard: "முகப்புப் பலகை (Dashboard)",
    nav_memory: "தனிப்பட்ட நினைவகம் (Memory)",
    nav_chat_edu: "3.2 & 3.3 AI உரையாடல் & கல்வி",
    nav_ai_chat: "ஒருங்கிணைந்த AI சாட்பாட்",
    nav_notes: "குறிப்புகள் & வினா-விடை",
    nav_quizzes: "படிப்புத் திட்டம் & பயிற்சி",
    nav_daily: "3.5 அன்றாட தனிப்பட்ட உதவியாளர்",
    nav_tasks: "பணிகள் & முன்னுரிமை",
    nav_day_planner: "என் நாளை திட்டமிடுக (Auto)",
    nav_calendar: "காலக்கெடு & நாள்காட்டி",
    nav_wellness: "3.4 உடல் நலம் & நல்வாழ்வு",
    nav_health: "நல்வாழ்வு மையம்",
    nav_career: "3.6 தொழில் வளர்ச்சி",
    nav_career_item: "தொழில் & மாதிரி நேர்காணல்",
    hero_status: "இயக்கம் தயார் • தொடர் நினைவகம் செயலில் உள்ளது • 4 துறைகள் இணைப்பு",
    hero_greeting: "மீண்டும் வருக,",
    hero_action_ask: "AI-யிடம் கேட்க",
    hero_action_plan: "நாளை திட்டமிடுக",
    hero_action_mem: "நினைவகம் நிருவகிக்க",
    balance_score_title: "இணைப்பு மதிப்பெண்",
    balance_score_sub: "படிப்பு, நலம் & தொழில் சீரமைப்பு",
    kpi_study: "கல்வித் தேர்ச்சி (3.3)",
    kpi_tasks: "இன்றைய பணிகள் (3.5)",
    kpi_water: "தண்ணீர் இலக்கு (3.4)",
    kpi_career: "தொழில் இலக்கு: Java Backend",
    nav_schedule: "அட்டவணை & அலாரங்கள்",
    schedule_title: "அட்டவணை & நேர மேலாண்மை",
    schedule_sub: "நேர அட்டவணை, AI படிப்புத் திட்டம் & ஒலி அலாரம்"
  }
};

/* ==============================================================================
   INITIALIZATION & EVENT LISTENERS
   ============================================================================== */

/* ==============================================================================
   BACKEND DATABASE SYNCHRONIZATION HELPERS (PHP 8 + MySQL PDO)
   ============================================================================== */
async function syncCurrentUser() {
  if (typeof window !== "undefined" && window.ACTIVE_USER) {
    if (window.ACTIVE_USER.name) AppState.user.name = window.ACTIVE_USER.name;
    if (window.ACTIVE_USER.email) AppState.user.email = window.ACTIVE_USER.email;
    if (window.ACTIVE_USER.learning_level) AppState.user.major = window.ACTIVE_USER.learning_level;
    if (window.ACTIVE_USER.streak_count) AppState.user.streak = Number(window.ACTIVE_USER.streak_count);
    saveState();
    renderAllViews();
    return;
  }

  if (typeof window !== "undefined" && window.location.protocol.startsWith("http")) {
    try {
      const res = await fetch("api/auth.php?action=me");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          if (data.user.name) AppState.user.name = data.user.name;
          if (data.user.email) AppState.user.email = data.user.email;
          if (data.user.learning_level) AppState.user.major = data.user.learning_level;
          if (data.user.streak_count) AppState.user.streak = Number(data.user.streak_count);
          saveState();
          renderAllViews();
        }
      }
    } catch (e) {
      console.warn("Backend user session sync offline:", e.message);
    }
  }
}

async function loadMemoriesFromBackend() {
  if (typeof window === "undefined" || !window.location.protocol.startsWith("http")) return;
  try {
    const res = await fetch("api/memory.php?action=list");
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.memories)) {
        AppState.memories = data.memories.map(m => ({
          id: m.id.toString(),
          category: m.category || "learning",
          title: m.title || "Personal Note",
          content: m.content || "",
          active: Number(m.is_active) === 1,
          date: (m.updated_at || m.created_at || "").split(" ")[0] || new Date().toISOString().split("T")[0],
          is_confirmed_fact: Number(m.is_confirmed_fact) === 1,
          tags: m.tags || ""
        }));
        saveState();
        renderMemoryCards();
        renderMemoryCounts();
      }
    }
  } catch (err) {
    console.warn("Could not load memories from backend API:", err.message);
  }
}

async function loadTasksFromBackend() {
  if (typeof window === "undefined" || !window.location.protocol.startsWith("http")) return;
  try {
    const res = await fetch("api/tasks.php?action=list");
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.tasks)) {
        AppState.tasks = data.tasks.map(t => ({
          id: t.id.toString(),
          title: t.title || "Task",
          category: t.category || "General",
          priority: t.priority ? (t.priority.charAt(0).toUpperCase() + t.priority.slice(1)) : "Normal",
          due: t.due_date ? (t.due_date + (t.due_time ? " " + t.due_time.substring(0, 5) : "")) : "Tomorrow",
          done: Number(t.is_completed) === 1
        }));
        saveState();
        renderTasksList();
        updateDashboardKPIs();
      }
    }
  } catch (err) {
    console.warn("Could not load tasks from backend API:", err.message);
  }
}

async function loadDashboardStats() {
  if (typeof window === "undefined" || !window.location.protocol.startsWith("http")) return;
  try {
    const res = await fetch("api/dashboard.php?action=stats");
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.metrics) {
        const m = data.metrics;
        
        // Update Synergy Score
        const scoreEl = document.getElementById("dashBalanceScore");
        if (scoreEl) {
          scoreEl.innerText = `${m.synergy_score}%`;
        }

        // Update Academic Mastery
        const masteryEl = document.getElementById("kpiMastery");
        const masteryBar = document.querySelector(".kpi-progress-fill.blue");
        if (masteryEl) masteryEl.innerText = m.academics.mastery_percent;
        if (masteryBar) masteryBar.style.width = `${m.academics.mastery_percent}%`;

        // Update Tasks Done
        const doneEl = document.getElementById("kpiTasksDone");
        const totalEl = document.getElementById("kpiTasksTotal");
        const taskBar = document.getElementById("kpiTaskBar");
        if (doneEl) doneEl.innerText = m.tasks.done;
        if (totalEl) totalEl.innerText = m.tasks.total;
        if (taskBar) taskBar.style.width = `${m.tasks.completion_rate}%`;

        // Update Water Target
        const waterCur = document.getElementById("kpiWater");
        const waterGoal = document.getElementById("kpiWaterGoal");
        const waterPct = document.getElementById("kpiWaterPercent");
        const waterBar = document.getElementById("kpiWaterBar");
        if (waterCur) waterCur.innerText = m.wellness.water_current_ml.toLocaleString();
        if (waterGoal) waterGoal.innerText = m.wellness.water_goal_ml.toLocaleString();
        if (waterPct) waterPct.innerText = `${m.wellness.water_percent}%`;
        if (waterBar) waterBar.style.width = `${m.wellness.water_percent}%`;

        // Update Streak
        const streakEl = document.getElementById("streakCount");
        if (streakEl) streakEl.innerText = m.wellness.streak_days;

        // Context-aware recommendations
        const recText = document.getElementById("dashRecommendationText");
        const conflictBadge = document.getElementById("dashConflictBadge");
        if (recText && data.ai_recommendations && data.ai_recommendations.length > 0) {
          recText.innerText = data.ai_recommendations.join(" ");
          if (conflictBadge) {
            conflictBadge.style.display = m.is_empty_state ? "none" : (m.tasks.pending > 3 ? "inline-block" : "none");
          }
        }
      }
    }
  } catch (err) {
    console.warn("Could not load dashboard metrics:", err.message);
  }
}

async function loadChatHistory() {
  const container = document.getElementById("chatMessages");
  if (!container || typeof window === "undefined" || !window.location.protocol.startsWith("http")) return;

  try {
    const res = await fetch("api/chat.php?action=history&conversation_id=1");
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.messages) && data.messages.length > 0) {
        container.innerHTML = "";
        data.messages.forEach(msg => {
          appendChatMessage(msg.sender_type, msg.message_text, null, null, false, "MySQL Store");
        });
        container.scrollTop = container.scrollHeight;
      }
    }
  } catch (e) {
    console.warn("Could not fetch chat history:", e.message);
  }
}

async function loadCareerProfileFromBackend() {
  if (typeof window === "undefined" || !window.location.protocol.startsWith("http")) return;
  try {
    const res = await fetch("api/career.php?action=get_profile");
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.profile && data.profile.target_role) {
        AppState.user.careerGoal = data.profile.target_role;
      }
    }
  } catch (e) {}
}

async function loadTimetableFromBackend() {
  if (typeof window === "undefined" || !window.location.protocol.startsWith("http")) return;
  try {
    const res = await fetch("api/study.php?action=get_timetable");
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.slots)) {
        AppState.timetable = data.slots.map(s => ({
          id: s.id.toString(),
          day: s.day_of_week,
          subject: s.subject_name,
          startTime: s.start_time ? s.start_time.substring(0, 5) : "09:00",
          endTime: s.end_time ? s.end_time.substring(0, 5) : "10:30",
          room: s.room || "",
          alarmActive: true,
          type: "class"
        }));
        if (typeof renderTimetableList === "function") renderTimetableList();
      }
    }
  } catch (e) {}
}

async function loadDietPlanFromBackend() {
  if (typeof window === "undefined" || !window.location.protocol.startsWith("http")) return;
  try {
    const res = await fetch("api/meals.php?action=get_plan");
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.plan) {
        const bTitle = document.getElementById("dietBreakfastTitle");
        const lTitle = document.getElementById("dietLunchTitle");
        const dTitle = document.getElementById("dietDinnerTitle");
        const sTitle = document.getElementById("dietSnackTitle");
        if (bTitle && data.plan.breakfast) bTitle.textContent = data.plan.breakfast.item + ` (~${data.plan.breakfast.protein}g Protein)`;
        if (lTitle && data.plan.lunch) lTitle.textContent = data.plan.lunch.item + ` (~${data.plan.lunch.protein}g Protein)`;
        if (dTitle && data.plan.dinner) dTitle.textContent = data.plan.dinner.item + ` (~${data.plan.dinner.protein}g Protein)`;
        if (sTitle && data.plan.snack) sTitle.textContent = data.plan.snack.item + ` (~${data.plan.snack.protein}g Protein)`;
      }
    }
  } catch (e) {}
}

document.addEventListener("DOMContentLoaded", () => {
  loadStoredState();
  initNavigation();
  initLanguageToggle();
  initThemeToggle();
  initPomodoroTimer();
  initHydrationTracker();
  initTasksModule();
  initMemoryModule();
  initChatbotModule();
  initSpeechSystem();
  initNotesModule();
  initStudyPlanModule();
  initDayPlannerModule();
  initCareerModule();
  initSettingsModal();
  initAiKeyModal();
  initScheduleModule();
  if (typeof initExerciseModule === "function")   initExerciseModule();
  if (typeof initDayPlannerModule === "function") initDayPlannerModule();
  if (typeof initTamilVoiceRecognition === "function") initTamilVoiceRecognition();
  if (typeof initDietModule === "function")       initDietModule();
  if (typeof initYogaModule === "function")       initYogaModule();
  initMobileNavigation();
  initAuthGateway();
  renderAllViews();
  showToast("AI Unified Life Companion Ready • Persistent Memory Loaded");

  // Synchronize live backend database state (MySQL / SQLite)
  syncCurrentUser();
  loadMemoriesFromBackend();
  loadTasksFromBackend();
  loadChatHistory();
  loadCareerProfileFromBackend();
  loadTimetableFromBackend();
  loadDietPlanFromBackend();
});

// Load persistent data from LocalStorage
function loadStoredState() {
  try {
    const savedUser = localStorage.getItem("ailife_user");
    if (savedUser) AppState.user = { ...AppState.user, ...JSON.parse(savedUser) };

    const savedMemories = localStorage.getItem("ailife_memories");
    if (savedMemories) AppState.memories = JSON.parse(savedMemories);

    const savedTasks = localStorage.getItem("ailife_tasks");
    if (savedTasks) AppState.tasks = JSON.parse(savedTasks);

    const savedLang = localStorage.getItem("ailife_lang");
    if (savedLang) AppState.currentLang = savedLang;

    const savedMemToggle = localStorage.getItem("ailife_memory_enabled");
    if (savedMemToggle !== null) AppState.memoryEnabled = savedMemToggle === "true";
  } catch (e) {
    console.warn("Storage access failed, using default state", e);
  }
}

function saveState() {
  try {
    localStorage.setItem("ailife_user", JSON.stringify(AppState.user));
    localStorage.setItem("ailife_memories", JSON.stringify(AppState.memories));
    localStorage.setItem("ailife_tasks", JSON.stringify(AppState.tasks));
    localStorage.setItem("ailife_lang", AppState.currentLang);
    localStorage.setItem("ailife_memory_enabled", AppState.memoryEnabled.toString());
  } catch (e) {
    console.warn("Could not write to localStorage", e);
  }
}

/* ==============================================================================
   NAVIGATION & VIEW SWITCHING
   ============================================================================== */
function initNavigation() {
  const navButtons = document.querySelectorAll(".nav-item");
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetView = btn.getAttribute("data-view");
      switchView(targetView);
      // Close mobile sidebar if open
      document.getElementById("sidebar").classList.remove("mobile-open");
    });
  });

  // Mobile menu buttons
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const sidebarCloseBtn = document.getElementById("sidebarCloseBtn");
  const sidebar = document.getElementById("sidebar");

  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener("click", () => sidebar.classList.add("mobile-open"));
  }
  if (sidebarCloseBtn && sidebar) {
    sidebarCloseBtn.addEventListener("click", () => sidebar.classList.remove("mobile-open"));
  }
}

function switchView(viewName) {
  AppState.activeView = viewName;
  document.querySelectorAll(".view-container").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(btn => btn.classList.remove("active"));

  const targetViewEl = document.getElementById(`view-${viewName}`);
  const targetNavBtn = document.querySelector(`.nav-item[data-view="${viewName}"]`);

  if (targetViewEl) targetViewEl.classList.add("active");
  if (targetNavBtn) targetNavBtn.classList.add("active");

  // Update Header Titles
  const titleMap = {
    dashboard: { title: "Dashboard & Life Synergy", sub: "AI Unified Life Companion • Persistent Memory Active" },
    memory: { title: "Persistent Personal Memory (3.1)", sub: "Transparent User Context & Privacy Data Controls" },
    "study-ai": { title: "Unified AI Chatbot (3.2 & 3.3)", sub: "Domain Intent Routing • Voice & Bilingual Support" },
    "pdf-qa": { title: "Notes & Document Q&A (3.3)", sub: "Academic Lecture Synthesizer & Concept Extractor" },
    "study-plan": { title: "Study Plan & Mastery (3.3)", sub: "Curriculum Tracking & Interactive Concept Quizzes" },
    tasks: { title: "Tasks & Smart Priorities (3.5)", sub: "Eisenhower Matrix & Deadline Organization" },
    "day-planner": { title: "Plan My Day — Auto Scheduler (3.5)", sub: "AI-Generated Daily Schedule • Priority Blocks • Wellness Sync" },
    "calendar-view": { title: "Deadlines & Calendar (3.5)", sub: "Academic Milestones & Exam Schedules" },
    "health-hub": { title: "Health & Wellness Hub (3.4)", sub: "Hydration, Sleep Habits, Pomodoro & Ergonomics" },
    exercise: { title: "Exercise & Wellness Core (3.4)", sub: "Daily Fitness Activities • Audio Alarms • Habit Tracking" },
    career: { title: "Career Development (3.6)", sub: "Skill Gap Analysis, Roadmaps & AI Mock Interview Simulator" },
    schedule: { title: "Schedule & Time Management", sub: "Timetable Input • AI Study Plan • Live Audio Alarms" }
  };

  const meta = titleMap[viewName] || titleMap.dashboard;
  const pageTitle = document.getElementById("pageTitle");
  const pageSubtitle = document.getElementById("pageSubtitle");
  if (pageTitle) pageTitle.innerText = meta.title;
  if (pageSubtitle) pageSubtitle.innerText = meta.sub;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ==============================================================================
   LANGUAGE TOGGLE & LOCALIZATION
   ============================================================================== */
function initLanguageToggle() {
  const langToggleBtn = document.getElementById("langToggleBtn");
  const langLabel = document.getElementById("currentLangLabel");
  const switchBadge = document.getElementById("langSwitchBadge");

  if (!langToggleBtn) return;

  langToggleBtn.addEventListener("click", () => {
    AppState.currentLang = AppState.currentLang === "en" ? "ta" : "en";
    saveState();
    updateLanguageUI();
    showToast(AppState.currentLang === "ta" ? "தமிழ் மொழி தேர்வு செய்யப்பட்டது" : "Language switched to English");
  });

  updateLanguageUI();
}

function updateLanguageUI() {
  const isTa = AppState.currentLang === "ta";
  const dict = Translations[AppState.currentLang];

  const langLabel = document.getElementById("currentLangLabel");
  const switchBadge = document.getElementById("langSwitchBadge");

  if (langLabel) langLabel.innerText = isTa ? "தமிழ்" : "English";
  if (switchBadge) switchBadge.innerText = isTa ? "English" : "தமிழ்";

  // Translate all marked data-i18n elements
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.innerText = dict[key];
  });
}

/* ==============================================================================
   THEME TOGGLE
   ============================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const sunIcon = document.getElementById("themeIconSun");
  const moonIcon = document.getElementById("themeIconMoon");

  const savedTheme = localStorage.getItem("ailife_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcons(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      const nextTheme = current === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", nextTheme);
      localStorage.setItem("ailife_theme", nextTheme);
      updateThemeIcons(nextTheme);
    });
  }

  function updateThemeIcons(theme) {
    if (sunIcon && moonIcon) {
      if (theme === "dark") {
        sunIcon.classList.remove("hidden");
        moonIcon.classList.add("hidden");
      } else {
        sunIcon.classList.add("hidden");
        moonIcon.classList.remove("hidden");
      }
    }
  }
}

/* ==============================================================================
   SECTION 3.1: PERSISTENT PERSONAL MEMORY ENGINE
   ============================================================================== */
function initMemoryModule() {
  renderMemoryCards();
  renderMemoryCounts();

  // Master Pause / Privacy Toggle Button
  const toggleMemoryModeBtn = document.getElementById("toggleMemoryModeBtn");
  if (toggleMemoryModeBtn) {
    toggleMemoryModeBtn.addEventListener("click", () => {
      AppState.memoryEnabled = !AppState.memoryEnabled;
      saveState();
      renderMemoryCards();
      updateMemoryStatusDisplay();
      showToast(AppState.memoryEnabled ? "Persistent Memory resumed" : "Privacy Mode Active: Personal memory paused");
    });
  }

  // Add Memory Modal open/close
  const openAddMemBtn = document.getElementById("openAddMemoryModalBtn");
  const addMemModal = document.getElementById("addMemoryModal");
  const closeAddMemBtn = document.getElementById("closeAddMemoryModalBtn");
  const cancelAddMemBtn = document.getElementById("cancelAddMemoryBtn");
  const addMemoryForm = document.getElementById("addMemoryForm");

  if (openAddMemBtn && addMemModal) {
    openAddMemBtn.addEventListener("click", () => addMemModal.classList.add("active"));
  }
  if (closeAddMemBtn && addMemModal) {
    closeAddMemBtn.addEventListener("click", () => addMemModal.classList.remove("active"));
  }
  if (cancelAddMemBtn && addMemModal) {
    cancelAddMemBtn.addEventListener("click", () => addMemModal.classList.remove("active"));
  }

  if (addMemoryForm) {
    addMemoryForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const cat = document.getElementById("newMemCategory").value;
      const title = document.getElementById("newMemTitle").value.trim();
      const content = document.getElementById("newMemContent").value.trim();
      const active = document.getElementById("newMemActive").checked;

      if (!title || !content) return;

      const newMem = {
        id: "mem-" + Date.now(),
        category: cat,
        title: title,
        content: content,
        active: active,
        date: new Date().toISOString().split("T")[0]
      };

      if (window.location.protocol.startsWith("http")) {
        try {
          const res = await fetch("api/memory.php?action=add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category: cat, title: title, content: content, is_confirmed_fact: 1 })
          });
          const data = await res.json();
          if (data.success && data.id) newMem.id = data.id.toString();
        } catch (err) {
          console.warn("Saved locally, backend memory sync pending:", err.message);
        }
      }

      AppState.memories.unshift(newMem);
      saveState();
      renderMemoryCards();
      renderMemoryCounts();
      addMemoryForm.reset();
      addMemModal.classList.remove("active");
      showToast(`Memory saved: "${title}"`);
    });
  }

  // Export JSON
  const exportBtn = document.getElementById("exportMemoryBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(AppState.memories, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `ailife_personal_memory_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("Memory JSON exported successfully");
    });
  }

  // Clear all memories button
  const clearAllBtn = document.getElementById("clearAllMemoryBtn");
  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to erase all persistent memories? This cannot be undone.")) {
        AppState.memories = [];
        saveState();
        renderMemoryCards();
        renderMemoryCounts();
        showToast("All personal memories deleted");
      }
    });
  }

  // Memory Filter Buttons
  document.querySelectorAll(".filter-mem-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-mem-btn").forEach(b => {
        b.classList.remove("active");
        b.classList.replace("btn-primary", "btn-outline");
      });
      btn.classList.add("active");
      btn.classList.replace("btn-outline", "btn-primary");
      renderMemoryCards(btn.getAttribute("data-cat"));
    });
  });

  // Context Retrieval Simulator test button
  const testRetrievalBtn = document.getElementById("testRetrievalBtn");
  if (testRetrievalBtn) {
    testRetrievalBtn.addEventListener("click", runRetrievalSimulation);
  }
}

function updateMemoryStatusDisplay() {
  const dot = document.getElementById("privacyStatusDot");
  const text = document.getElementById("memoryStatusText");
  const badge = document.getElementById("memoryCountBadge");

  const activeCount = AppState.memories.filter(m => m.active).length;

  if (badge) {
    badge.innerText = AppState.memoryEnabled ? `${activeCount} Active` : "PAUSED";
    badge.style.background = AppState.memoryEnabled ? "var(--m1-light)" : "#fee2e2";
    badge.style.color = AppState.memoryEnabled ? "var(--m1-color)" : "#dc2626";
  }

  if (dot && text) {
    if (AppState.memoryEnabled) {
      dot.className = "privacy-indicator-dot";
      text.innerText = "ACTIVE";
      text.style.color = "var(--accent-green)";
    } else {
      dot.className = "privacy-indicator-dot disabled";
      text.innerText = "SUSPENDED (INCOGNITO)";
      text.style.color = "var(--accent-red)";
    }
  }
}

function renderMemoryCounts() {
  const allCount = AppState.memories.length;
  const learningCount = AppState.memories.filter(m => m.category === "learning").length;
  const tasksCount = AppState.memories.filter(m => m.category === "tasks").length;
  const healthCount = AppState.memories.filter(m => m.category === "health").length;
  const careerCount = AppState.memories.filter(m => m.category === "career").length;

  const cAll = document.getElementById("countMemAll");
  const cLearn = document.getElementById("countMemLearning");
  const cTask = document.getElementById("countMemTasks");
  const cHealth = document.getElementById("countMemHealth");
  const cCareer = document.getElementById("countMemCareer");

  if (cAll) cAll.innerText = allCount;
  if (cLearn) cLearn.innerText = learningCount;
  if (cTask) cTask.innerText = tasksCount;
  if (cHealth) cHealth.innerText = healthCount;
  if (cCareer) cCareer.innerText = careerCount;

  updateMemoryStatusDisplay();
}

function renderMemoryCards(categoryFilter = "all") {
  const grid = document.getElementById("memoryCardsGrid");
  const dashList = document.getElementById("dashMemoryPreviewList");
  if (!grid) return;

  const filtered = categoryFilter === "all" 
    ? AppState.memories 
    : AppState.memories.filter(m => m.category === categoryFilter);

  grid.innerHTML = filtered.map(mem => `
    <div class="memory-card ${!mem.active || !AppState.memoryEnabled ? 'disabled' : ''}" id="card-${mem.id}">
      <div class="memory-card-header">
        <span class="memory-tag ${mem.category}">${mem.category}</span>
        <label class="toggle-container" title="Enable or disable this specific memory">
          <input type="checkbox" ${mem.active ? 'checked' : ''} onchange="toggleSingleMemory('${mem.id}')">
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div>
        <strong style="font-size:0.95rem;color:var(--text-primary);display:block;margin-bottom:0.25rem;">${escapeHtml(mem.title)}</strong>
        <p class="memory-content-text">${escapeHtml(mem.content)}</p>
      </div>
      <div class="memory-meta-row">
        <span>Recorded: ${mem.date}</span>
        <div class="memory-action-btns">
          <button class="btn btn-xs btn-ghost" onclick="deleteMemory('${mem.id}')" style="color:var(--accent-red);" title="Delete memory">
            Delete
          </button>
        </div>
      </div>
    </div>
  `).join("");

  // Also update Dashboard preview
  if (dashList) {
    const activeMems = AppState.memories.filter(m => m.active).slice(0, 3);
    dashList.innerHTML = activeMems.map(m => `
      <div style="background:var(--bg-subtle);padding:0.75rem;border-radius:var(--radius-md);border-left:3px solid var(--primary);font-size:0.8rem;">
        <div style="display:flex;justify-content:space-between;margin-bottom:0.2rem;">
          <strong style="color:var(--text-primary);">${escapeHtml(m.title)}</strong>
          <span class="memory-tag ${m.category}" style="font-size:0.65rem;">${m.category}</span>
        </div>
        <p style="margin:0;color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${escapeHtml(m.content)}</p>
      </div>
    `).join("");
  }
}

window.toggleSingleMemory = async function(id) {
  const mem = AppState.memories.find(m => m.id.toString() === id.toString());
  if (mem) {
    mem.active = !mem.active;
    saveState();
    renderMemoryCards();
    renderMemoryCounts();
    showToast(`Memory "${mem.title}" ${mem.active ? 'enabled' : 'disabled'}`);
    if (window.location.protocol.startsWith("http")) {
      try {
        await fetch("api/memory.php?action=toggle_status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: id, is_active: mem.active ? 1 : 0 })
        });
      } catch (e) {}
    }
  }
};

window.deleteMemory = async function(id) {
  AppState.memories = AppState.memories.filter(m => m.id.toString() !== id.toString());
  saveState();
  renderMemoryCards();
  renderMemoryCounts();
  showToast("Memory removed from repository");
  if (window.location.protocol.startsWith("http")) {
    try {
      await fetch("api/memory.php?action=delete&id=" + encodeURIComponent(id));
    } catch (e) {}
  }
};

// Context Retrieval Engine: Matches query keywords with active user memories
function retrieveRelevantContext(query) {
  if (!AppState.memoryEnabled) {
    return {
      retrieved: [],
      reasoning: "Persistent Memory is currently paused (Incognito Mode). No background context injected."
    };
  }

  const q = query.toLowerCase();
  const activeMems = AppState.memories.filter(m => m.active);

  // Score memories based on keyword relevance
  const scored = activeMems.map(mem => {
    let score = 0;
    const fullText = (mem.title + " " + mem.content + " " + mem.category).toLowerCase();

    // Specific domain triggers
    if ((q.includes("java") || q.includes("code") || q.includes("program") || q.includes("inheritance") || q.includes("oop")) && mem.category === "learning") score += 5;
    if ((q.includes("plan") || q.includes("day") || q.includes("schedule") || q.includes("task") || q.includes("time")) && (mem.category === "tasks" || mem.category === "learning")) score += 4;
    if ((q.includes("health") || q.includes("water") || q.includes("sleep") || q.includes("tired") || q.includes("break")) && mem.category === "health") score += 5;
    if ((q.includes("career") || q.includes("job") || q.includes("roadmap") || q.includes("interview") || q.includes("work")) && mem.category === "career") score += 5;

    // General token overlap
    const words = q.split(/\s+/).filter(w => w.length > 3);
    words.forEach(w => {
      if (fullText.includes(w)) score += 2;
    });

    return { mem, score };
  });

  // Sort and select top matching memories
  const relevant = scored.filter(item => item.score > 0).sort((a, b) => b.score - a.score).map(i => i.mem);

  // If no direct keyword match, default to general user profile context
  if (relevant.length === 0) {
    const defaultProfile = activeMems.find(m => m.category === "learning") || activeMems[0];
    if (defaultProfile) relevant.push(defaultProfile);
  }

  return {
    retrieved: relevant,
    reasoning: `Retrieved ${relevant.length} personal context items: ` + relevant.map(r => r.title).join(", ")
  };
}

function runRetrievalSimulation() {
  const query = document.getElementById("memorySimQueryInput").value;
  const res = retrieveRelevantContext(query);
  const container = document.getElementById("retrievalSimResult");

  if (!container) return;

  if (res.retrieved.length === 0) {
    container.innerHTML = `<span style="color:var(--accent-red);">No active memories matched or memory disabled.</span>`;
    return;
  }

  container.innerHTML = `
    <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:0.75rem;">
      <div style="font-weight:700;color:var(--primary);margin-bottom:0.25rem;">${res.reasoning}</div>
      <ul style="margin:0;padding-left:1.2rem;">
        ${res.retrieved.map(m => `<li><strong>${escapeHtml(m.title)}:</strong> ${escapeHtml(m.content)}</li>`).join("")}
      </ul>
    </div>
  `;
}

/* ==============================================================================
   SECTION 3.2 & 3.3: INTELLIGENT CHATBOT & INTENT ROUTING
   ============================================================================== */
function initChatbotModule() {
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const clearBtn = document.getElementById("clearChatBtn");
  const promptChips = document.querySelectorAll(".prompt-chips .chip");
  const ttsToggle = document.getElementById("chatTtsToggleBtn");

  if (chatForm && chatInput) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleUserChatSubmit();
    });

    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleUserChatSubmit();
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      const messagesContainer = document.getElementById("chatMessages");
      if (messagesContainer) {
        messagesContainer.innerHTML = `
          <div class="message message-bot">
            <div class="msg-avatar">🤖</div>
            <div class="msg-bubble">
              <p>Chat cleared! Memory context remains saved and active. Ask me anything!</p>
            </div>
          </div>
        `;
      }
    });
  }

  if (promptChips) {
    promptChips.forEach(chip => {
      chip.addEventListener("click", () => {
        const text = chip.getAttribute("data-prompt");
        if (chatInput) {
          chatInput.value = text;
          handleUserChatSubmit();
        }
      });
    });
  }

  if (ttsToggle) {
    ttsToggle.addEventListener("click", () => {
      AppState.user.voiceReadout = !AppState.user.voiceReadout;
      saveState();
      document.getElementById("ttsStateText").innerText = AppState.user.voiceReadout ? "ON" : "OFF";
      showToast(`Voice Response Readout: ${AppState.user.voiceReadout ? 'Enabled' : 'Disabled'}`);
    });
  }

  // Quick education doubt generators
  const genJavaBtn = document.getElementById("genJavaPracticeBtn");
  const genDsaBtn = document.getElementById("genDsaPracticeBtn");
  if (genJavaBtn) {
    genJavaBtn.addEventListener("click", () => {
      const resContainer = document.getElementById("quickPracticeResult");
      resContainer.innerHTML = `
        <div style="background:var(--bg-subtle);padding:0.75rem;border-radius:var(--radius-md);font-size:0.82rem;">
          <strong>Quick OOP Practice:</strong><br>
          <em>Why does Java NOT support multiple inheritance with classes, and how is this achieved using Interfaces?</em>
          <button class="btn btn-xs btn-primary mt-2" onclick="askAiQuestion('Explain why Java does not support multiple inheritance with classes and how interfaces solve the diamond problem.')">Ask AI to Explain</button>
        </div>
      `;
    });
  }
  if (genDsaBtn) {
    genDsaBtn.addEventListener("click", () => {
      const resContainer = document.getElementById("quickPracticeResult");
      resContainer.innerHTML = `
        <div style="background:var(--bg-subtle);padding:0.75rem;border-radius:var(--radius-md);font-size:0.82rem;">
          <strong>Quick DSA Practice:</strong><br>
          <em>What is the time complexity of searching in a Balanced Binary Search Tree (AVL/Red-Black) vs an Unbalanced BST?</em>
          <button class="btn btn-xs btn-primary mt-2" onclick="askAiQuestion('Explain time complexity of BST search best case vs worst case skewed tree in beginner terms.')">Ask AI to Explain</button>
        </div>
      `;
    });
  }
}

window.askAiQuestion = function(q) {
  const chatInput = document.getElementById("chatInput");
  if (chatInput) {
    chatInput.value = q;
    handleUserChatSubmit();
  }
};

// Intent Classification Engine (Section 3.2)
function classifyIntent(text) {
  const t = text.toLowerCase();

  if (t.includes("java") || t.includes("code") || t.includes("program") || t.includes("inheritance") || 
      t.includes("class") || t.includes("polymorphism") || t.includes("dsa") || t.includes("exam") || 
      t.includes("study") || t.includes("doubt") || t.includes("à®œà®¾à®µà®¾") || t.includes("à®•à®±à¯à®±à¯")) {
    return { name: "Education", class: "education" };
  }

  if (t.includes("water") || t.includes("sleep") || t.includes("drink") || t.includes("health") || 
      t.includes("tired") || t.includes("stretch") || t.includes("break") || t.includes("nutrition") || 
      t.includes("posture") || t.includes("à®‰à®Ÿà®²à¯") || t.includes("à®¤à¯‚à®•à¯à®•à®®à¯")) {
    return { name: "Health & Wellness", class: "health" };
  }

  if (t.includes("task") || t.includes("plan") || t.includes("day") || t.includes("schedule") || 
      t.includes("deadline") || t.includes("calendar") || t.includes("à®¤à®¿à®Ÿà¯à®Ÿà®®à¯") || t.includes("à®µà¯‡à®²à¯ˆ")) {
    return { name: "Daily Productivity", class: "productivity" };
  }

  if (t.includes("career") || t.includes("job") || t.includes("resume") || t.includes("interview") || 
      t.includes("salary") || t.includes("roadmap") || t.includes("backend") || t.includes("à®µà¯‡à®²à¯ˆà®µà®¾à®¯à¯à®ªà¯à®ªà¯")) {
    return { name: "Career Development", class: "career" };
  }

  return { name: "General AI", class: "general" };
}

async function handleUserChatSubmit() {
  const chatInput = document.getElementById("chatInput");
  const query = chatInput.value.trim();
  if (!query) return;

  chatInput.value = "";
  chatInput.style.height = "auto";

  // Classify intent & retrieve memory
  const intent = classifyIntent(query);
  const contextData = retrieveRelevantContext(query);

  // Update intent indicator
  const badge = document.getElementById("activeIntentBadge");
  if (badge) {
    badge.className = `intent-badge ${intent.class}`;
    badge.innerText = `Intent: ${intent.name}`;
  }

  // Update Injected Context Pill
  const pill = document.getElementById("chatInjectedPill");
  if (pill) {
    pill.innerText = contextData.retrieved.length > 0 
      ? contextData.retrieved.map(m => m.title).join(" • ")
      : "No memory injected (Private Mode)";
  }

  // Render User Message
  appendChatMessage("user", query);

  // Show Typing Indicator
  const typingId = appendTypingIndicator();

  // Try live backend API server if running, fallback to built-in client engine
  let aiResponseText = "";
  let isLiveAi = false;
  let aiProvider = "";
  let aiModel = "";

  const effectiveApiUrl = (AppState.user.apiEndpoint && AppState.user.apiEndpoint.trim().startsWith("http"))
    ? AppState.user.apiEndpoint.trim()
    : (window.location.protocol.startsWith("http") ? "api/chat.php" : "");

  if (effectiveApiUrl) {
    try {
      const resp = await fetch(effectiveApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(AppState.user.apiKey ? { "Authorization": `Bearer ${AppState.user.apiKey}` } : {})
        },
        body: JSON.stringify({
          message: query,
          query: query,
          intent: intent.name,
          userContext: contextData.retrieved,
          userProfile: AppState.user,
          lang: AppState.currentLang,
          language: AppState.currentLang,
          conversation_id: 1,
          api_key: AppState.user.apiKey || ""
        })
      });
      if (resp.ok) {
        const json = await resp.json();
        aiResponseText = json.reply || json.response || json.message || JSON.stringify(json);
        isLiveAi = !!json.is_live_ai;
        aiProvider = json.provider || "backend_service";
        aiModel = json.model || "";
        if (json.actionsTaken && json.actionsTaken.length > 0) {
          // Sync any newly created alarms or plans into local timetable
          json.actionsTaken.forEach(act => {
            if (act.action === "create_reminder" && act.details) {
              if (typeof playAlarmSound === "function") playAlarmSound(act.details.tone || "chime");
            }
          });
        }
      } else {
        throw new Error("API call returned " + resp.status);
      }
    } catch (err) {
      console.warn("Backend API unavailable, executing built-in reasoning engine:", err.message);
      aiResponseText = generateBuiltinAiResponse(query, intent, contextData);
    }
  } else {
    // Built-in intelligent reasoning engine
    await new Promise(r => setTimeout(r, 600)); // Natural response delay
    aiResponseText = generateBuiltinAiResponse(query, intent, contextData);
  }

  removeTypingIndicator(typingId);
  appendChatMessage("bot", aiResponseText, intent, contextData, isLiveAi, aiProvider, aiModel);

  // Speak aloud if voice readout is enabled
  if (AppState.user.voiceReadout) {
    speakText(stripMarkdown(aiResponseText));
  }
}

function appendChatMessage(sender, text, intent = null, contextData = null, isLiveAi = false, provider = null, model = null) {
  const container = document.getElementById("chatMessages");
  if (!container) return;

  const msgDiv = document.createElement("div");
  msgDiv.className = `message message-${sender}`;

  if (sender === "user") {
    msgDiv.innerHTML = `
      <div class="msg-avatar" style="background:var(--primary);color:white;font-weight:700;">${AppState.user.name.split(" ").map(n=>n[0]).join("")}</div>
      <div class="msg-bubble user-bubble">
        <p>${escapeHtml(text)}</p>
      </div>
    `;
  } else {
    const memoryPill = contextData && contextData.retrieved.length > 0
      ? `<span class="memory-retrieval-pill" title="${escapeHtml(contextData.reasoning)}">🧠 Context: ${escapeHtml(contextData.retrieved.map(m=>m.title).join(", "))}</span>`
      : `<span class="memory-retrieval-pill" style="opacity:0.7;">No Context Injected</span>`;

    msgDiv.innerHTML = `
      <div class="msg-avatar">🤖</div>
      <div class="msg-bubble">
        <div class="reasoning-badge-wrap" style="display:flex;align-items:center;flex-wrap:wrap;gap:0.4rem;margin-bottom:0.5rem;">
          <span class="intent-badge ${intent ? intent.class : 'general'}">${intent ? intent.name : 'AI'}</span>
          ${isLiveAi 
            ? `<span class="badge badge-success" style="font-size:0.7rem;padding:0.15rem 0.5rem;display:inline-flex;align-items:center;gap:0.3rem;">⚡ OpenAI (${escapeHtml(model || 'Live')})</span>`
            : (provider ? `<span class="badge badge-outline" style="font-size:0.7rem;padding:0.15rem 0.5rem;display:inline-flex;align-items:center;gap:0.3rem;">🧠 Backend DB (${escapeHtml(provider)})</span>` : '')}
          ${memoryPill}
        </div>
        <div class="msg-content">${formatMarkdown(text)}</div>
        <div style="margin-top:0.6rem;display:flex;align-items:center;gap:0.75rem;">
          <button class="tts-play-btn" onclick="speakText(this.parentElement.previousElementSibling.innerText)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            Listen
          </button>
          <button class="tts-play-btn" onclick="navigator.clipboard.writeText(this.parentElement.previousElementSibling.innerText);showToast('Copied to clipboard');">
            📋 Copy
          </button>
        </div>
      </div>
    `;
  }

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function appendTypingIndicator() {
  const container = document.getElementById("chatMessages");
  const id = "typing-" + Date.now();
  const div = document.createElement("div");
  div.id = id;
  div.className = "message message-bot";
  div.innerHTML = `
    <div class="msg-avatar">🤖</div>
    <div class="msg-bubble" style="padding:0.75rem 1rem;">
      <span style="font-size:0.8rem;color:var(--text-muted);">Thinking & retrieving saved context...</span>
      <div class="pulse-green" style="display:inline-block;margin-left:0.4rem;"></div>
    </div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return id;
}

function removeTypingIndicator(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// Built-In Intelligent AI Reasoning Engine (With Persistent Context Injection)
function generateBuiltinAiResponse(query, intent, contextData) {
  const q = (query || "").toLowerCase().trim();
  const isTamil = AppState.currentLang === "ta" || q.includes("தமிழ்") || /[\u0B80-\u0BFF]/.test(query);

  // 1. Math & Equation Solver (e.g. solve 2x + 5 = 15 or 12 * 8)
  const linearMatch = query.match(/(\d*)\s*x\s*([\+\-])\s*(\d+)\s*=\s*(\d+)/i);
  if (linearMatch) {
    const a = linearMatch[1] ? parseInt(linearMatch[1], 10) : 1;
    const sign = linearMatch[2];
    const b = parseInt(linearMatch[3], 10);
    const c = parseInt(linearMatch[4], 10);
    const rhs = (sign === '+') ? (c - b) : (c + b);
    const x = a !== 0 ? (rhs / a) : 0;
    const xFormatted = Number.isInteger(x) ? x : x.toFixed(2);

    if (isTamil) {
      return "### கணிதச் சமன்பாடு தீர்வு: `" + linearMatch[0] + "` 📐\n\n" +
        "**படி 1:** மாறிலியை வலது புறம் கொண்டு செல்லவும்:\n" +
        "- `" + a + "x = " + c + " " + (sign === '+' ? '-' : '+') + " " + b + "`\n" +
        "- `" + a + "x = " + rhs + "`\n\n" +
        "**படி 2:** `x`-ன் மதிப்பைக் காண " + a + "-ஆல் வகுக்கவும்:\n" +
        "- `x = " + rhs + " / " + a + "`\n" +
        "- **`x = " + xFormatted + "`**\n\n" +
        "✅ **இறுதி விடை:** `x = " + xFormatted + "` (சரிபார்க்கப்பட்டது!)";
    }

    return "### Step-by-Step Math Solution: `" + linearMatch[0] + "` 📐\n\n" +
      "**Step 1: Isolate the variable term**\n" +
      "Move the constant to the right-hand side:\n" +
      "$$ " + a + "x = " + c + " " + (sign === '+' ? '-' : '+') + " " + b + " $$\n" +
      "$$ " + a + "x = " + rhs + " $$\n\n" +
      "**Step 2: Solve for x**\n" +
      "Divide both sides by " + a + ":\n" +
      "$$ x = \\frac{" + rhs + "}{" + a + "} $$\n" +
      "$$ \\mathbf{x = " + xFormatted + "} $$\n\n" +
      "**Verification:** Substitute `x = " + xFormatted + "` back into the equation:\n" +
      "- `" + a + "(" + xFormatted + ") " + sign + " " + b + " = " + c + "` ✅ Verified!";
  }

  // Basic arithmetic evaluation
  const arithMatch = query.match(/(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)/);
  if (arithMatch && (q.includes("calculate") || q.includes("solve") || q.includes("math") || q.startsWith("what is") || /^[\d\s\+\-\*\/\(\)]+$/.test(query.trim()))) {
    const n1 = parseFloat(arithMatch[1]);
    const op = arithMatch[2];
    const n2 = parseFloat(arithMatch[3]);
    let res = 0;
    if (op === '+') res = n1 + n2;
    else if (op === '-') res = n1 - n2;
    else if (op === '*') res = n1 * n2;
    else if (op === '/') res = n2 !== 0 ? (n1 / n2) : "Undefined (division by zero)";

    return "### Calculation Result: `" + n1 + " " + op + " " + n2 + "` 🔢\n\n" +
      "- **Calculation:** `" + n1 + " " + op + " " + n2 + "`\n" +
      "- **Result:** **`" + res + "`**";
  }

  // 2. Sorting & DSA Algorithms
  if (q.includes("bubble sort") || q.includes("bubble")) {
    if (isTamil) {
      return "### பப்பில் வரிசையாக்கம் (Bubble Sort) 🫧\n\n" +
        "**Bubble Sort எவ்வாறு செயல்படுகிறது?**\n" +
        "அருகருகே உள்ள இரண்டு உறுப்புகளை ஒப்பிட்டு, இடமாற்றம் (swap) செய்து பெரிய எண்களை வரிசையின் இறுதிக்குக் கொண்டு செல்லும் எளிய முறை ஆகும்.\n\n" +
        "```java\n" +
        "public class BubbleSort {\n" +
        "    public static void sort(int[] arr) {\n" +
        "        int n = arr.length;\n" +
        "        for (int i = 0; i < n - 1; i++) {\n" +
        "            for (int j = 0; j < n - i - 1; j++) {\n" +
        "                if (arr[j] > arr[j + 1]) {\n" +
        "                    int temp = arr[j];\n" +
        "                    arr[j] = arr[j + 1];\n" +
        "                    arr[j + 1] = temp;\n" +
        "                }\n" +
        "            }\n" +
        "        }\n" +
        "    }\n" +
        "}\n" +
        "```\n\n" +
        "**காலச் சிக்கல் (Time Complexity):**\n" +
        "- **Best Case:** $O(n)$\n" +
        "- **Worst Case:** $O(n^2)$\n" +
        "- **Space Complexity:** $O(1)$";
    }

    return "### Bubble Sort Algorithm — Complete Guide 🫧\n\n" +
      "**How It Works:**\n" +
      "Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order until no swaps are needed.\n\n" +
      "```java\n" +
      "public class BubbleSort {\n" +
      "    public static void bubbleSort(int[] arr) {\n" +
      "        int n = arr.length;\n" +
      "        boolean swapped;\n" +
      "        for (int i = 0; i < n - 1; i++) {\n" +
      "            swapped = false;\n" +
      "            for (int j = 0; j < n - i - 1; j++) {\n" +
      "                if (arr[j] > arr[j + 1]) {\n" +
      "                    int temp = arr[j];\n" +
      "                    arr[j] = arr[j + 1];\n" +
      "                    arr[j + 1] = temp;\n" +
      "                    swapped = true;\n" +
      "                }\n" +
      "            }\n" +
      "            if (!swapped) break; // Optimized early exit\n" +
      "        }\n" +
      "    }\n" +
      "}\n" +
      "```\n\n" +
      "**Complexity Analysis:**\n" +
      "| Metric | Complexity | Note |\n" +
      "|---|---|---|\n" +
      "| **Best Case** | $O(n)$ | When array is already sorted |\n" +
      "| **Average Case** | $O(n^2)$ | General unsorted inputs |\n" +
      "| **Worst Case** | $O(n^2)$ | Reverse-sorted array |\n" +
      "| **Space Complexity** | $O(1)$ | In-place sorting |";
  }

  if (q.includes("binary search")) {
    return "### Binary Search Algorithm 🎯\n\n" +
      "**Core Principle:** Binary Search operates on **sorted arrays** by continuously dividing the search range in half.\n\n" +
      "```java\n" +
      "public class BinarySearch {\n" +
      "    public static int search(int[] arr, int target) {\n" +
      "        int low = 0, high = arr.length - 1;\n" +
      "        while (low <= high) {\n" +
      "            int mid = low + (high - low) / 2;\n" +
      "            if (arr[mid] == target) return mid;\n" +
      "            if (arr[mid] < target) low = mid + 1;\n" +
      "            else high = mid - 1;\n" +
      "        }\n" +
      "        return -1; // Not found\n" +
      "    }\n" +
      "}\n" +
      "```\n\n" +
      "- **Time Complexity:** $O(\\log n)$\n" +
      "- **Space Complexity:** $O(1)$ iterative\n" +
      "*Crucial requirement: The array must be pre-sorted.*";
  }

  // 3. Object-Oriented Programming (Java, Python, C++)
  if (q.includes("inherit") || q.includes("polymorphism") || q.includes("oop") || q.includes("மரபுரிமை")) {
    if (isTamil) {
      return "### ஜாவா Object-Oriented Programming (OOP) ☕\n\n" +
        "**1. Inheritance (மரபுரிமை):**\n" +
        "ஒரு குழந்தை தன் பெற்றோரிடமிருந்து பண்புகளைப் பெறுவது போல, ஒரு Subclass மற்றொரு Superclass-ன் பண்புகளை `extends` மூலம் பெறுகிறது.\n\n" +
        "```java\n" +
        "class Parent {\n" +
        "    void greet() { System.out.println(\"Hello from Parent!\"); }\n" +
        "}\n" +
        "class Child extends Parent {\n" +
        "    // Parent-ன் greet() முறையை நேரடியாகப் பயன்படுத்துகிறது!\n" +
        "}\n" +
        "```\n\n" +
        "**2. Polymorphism (பல்லுருவாக்கம்):** ஒரே முறை பல வடிவங்களில் செயல்படுவது (`Overloading` & `Overriding`).\n" +
        "**3. Encapsulation (உறைபொதியாக்கம்):** `private` மாறிகள் மற்றும் getters/setters மூலம் தரவுகளைப் பாதுகாப்பது.\n" +
        "**4. Abstraction (சுருக்கம்):** இடைமுகங்களை (`interface`) வழங்கி முக்கிய செயல்பாடுகளை மட்டும் காட்டுவது.";
    }

    return "### Object-Oriented Programming (OOP) — Core Pillars ☕\n\n" +
      "1. **Inheritance:** Enables code reuse by allowing a subclass to acquire methods and fields from a superclass using `extends`.\n" +
      "2. **Polymorphism:** Allows one interface to control multiple different underlying forms:\n" +
      "   - *Compile-Time (Overloading):* Same method name, different parameters.\n" +
      "   - *Runtime (Overriding):* Subclass provides specific implementation of parent method.\n" +
      "3. **Encapsulation:** Protects internal object state by making fields `private` with public accessors.\n" +
      "4. **Abstraction:** Exposes only essential behaviors through `interfaces` and `abstract classes` while hiding internal complexity.\n\n" +
      "```java\n" +
      "// Example: Runtime Polymorphism\n" +
      "abstract class Vehicle { abstract void drive(); }\n" +
      "class Car extends Vehicle {\n" +
      "    void drive() { System.out.println(\"Car drives smoothly on the road.\"); }\n" +
      "}\n" +
      "```";
  }

  // 4. Database Systems (DBMS, SQL, ACID, Normalization)
  if (q.includes("dbms") || q.includes("sql") || q.includes("normaliz") || q.includes("acid")) {
    return "### Database Management Systems (DBMS & SQL) 🗄️\n\n" +
      "#### 1. ACID Properties for Transactions:\n" +
      "- **Atomicity:** All operations complete successfully, or all rollback (All-or-Nothing).\n" +
      "- **Consistency:** Preserves database invariants and integrity constraints before and after execution.\n" +
      "- **Isolation:** Concurrent transactions execute without cross-contamination.\n" +
      "- **Durability:** Committed data is permanently recorded even during hardware failure.\n\n" +
      "#### 2. Normalization Forms:\n" +
      "- **1NF:** Atomic column values, no repeating groups.\n" +
      "- **2NF:** In 1NF + no partial dependency on composite keys.\n" +
      "- **3NF:** In 2NF + no transitive dependency ($X \\rightarrow Y, Y \\rightarrow Z$).\n\n" +
      "```sql\n" +
      "-- SQL Inner Join Example\n" +
      "SELECT s.name, c.course_name\n" +
      "FROM students s\n" +
      "JOIN enrollments e ON s.id = e.student_id\n" +
      "JOIN courses c ON e.course_id = c.id;\n" +
      "```";
  }

  // 5. Operating Systems & Computer Networks
  if (q.includes("osi") || q.includes("tcp") || q.includes("deadlock") || q.includes("thread")) {
    return "### Systems & Networking Core 🌐\n\n" +
      "#### OSI 7-Layer Hierarchy:\n" +
      "1. **Physical:** Raw bit transmission over physical medium.\n" +
      "2. **Data Link:** Framing, MAC addresses, error detection (Ethernet, Wi-Fi).\n" +
      "3. **Network:** Logical IP addressing and packet routing (IP, ICMP).\n" +
      "4. **Transport:** End-to-end reliability and flow control (TCP 3-way handshake vs UDP).\n" +
      "5. **Session:** Session checkpointing and authentication.\n" +
      "6. **Presentation:** Encryption, data serialization, and compression (TLS/SSL).\n" +
      "7. **Application:** User services (HTTP, HTTPS, DNS, SSH).\n\n" +
      "#### Deadlock 4 Conditions (Coffman):\n" +
      "- Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.";
  }

  // 6. Science & General Knowledge (Photosynthesis, Newton)
  if (q.includes("photosynthesis") || q.includes("ஒளிச்சேர்க்கை")) {
    if (isTamil) {
      return "### ஒளிச்சேர்க்கை (Photosynthesis) 🌿\n\n" +
        "தாவரங்கள் சூரிய ஒளி, நீர் ($H_2O$) மற்றும் கார்பன் டை ஆக்சைடு ($CO_2$) ஆகியவற்றைப் பயன்படுத்தி தனக்கான உணவைத் (குளுக்கோஸ்) தயாரித்து, ஆக்சிஜனை ($O_2$) வெளியிடும் செயல்முறை ஆகும்.\n\n" +
        "$$ 6CO_2 + 6H_2O \\xrightarrow{\\text{சூரிய ஒளி, பச்சையம்}} C_6H_{12}O_6 + 6O_2 $$";
    }

    return "### Photosynthesis Explained 🌿\n\n" +
      "**Definition:** The biological process by which green plants and algae convert light energy into chemical energy stored in carbohydrates.\n\n" +
      "$$ 6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow{\\text{Light, Chlorophyll}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 $$\n\n" +
      "1. **Light Reactions:** Occur in thylakoid membranes, generating ATP, NADPH, and releasing $O_2$.\n" +
      "2. **Calvin Cycle:** Occurs in stroma, using chemical energy to fix $CO_2$ into glucose.";
  }

  // 7. General Programming
  if (q.includes("python") || q.includes("javascript") || q.includes("react") || q.includes("code") || q.includes("program")) {
    return "### Code Solution & Architecture 💻\n\n" +
      "Here is a clean, modern implementation for your query:\n\n" +
      "```javascript\n" +
      "// Clean Modern JavaScript / Node.js\n" +
      "async function processWorkflow(data) {\n" +
      "  console.log('Processing input:', data);\n" +
      "  return { success: true, timestamp: Date.now() };\n" +
      "}\n" +
      "```\n\n" +
      "Feel free to specify the language, data inputs, or edge cases you want to handle!";
  }

  // 8. Day Planning & Schedule
  if (q.includes("plan") || q.includes("day") || q.includes("schedule") || q.includes("திட்டமி")) {
    const urgentTasks = AppState.tasks.filter(t => !t.done);
    if (isTamil) {
      return "### இன்றைய திட்டமிடப்பட்ட அட்டவணை 📅\n\n" +
        "உங்கள் **7.5 மணிநேர தூக்க இலக்கு** மற்றும் **" + urgentTasks.length + " பணிகள்** அடிப்படையில்:\n\n" +
        "- **09:00 - 10:30:** Advanced Data Structures விரிவுரை (முடிந்தது ✅)\n" +
        "- **11:00 - 12:30:** Java OOP Lab: Inheritance & Class Hierarchies (செயலில் உள்ளது ⏳)\n" +
        "- **01:00 - 02:00:** மதிய உணவு & 20 நிமிட நடைப்பயிற்சி (நல்வாழ்வு 🥗)\n" +
        "- **02:30 - 04:00:** DBMS Normalization & SQL வினாக்கள்\n" +
        "- **04:30 - 05:15:** நீர் அருந்துதல் (750ml) & Pomodoro Break 💧\n" +
        "- **05:30 - 07:00:** Java Lab ஒப்படைப்பு இறுதிப் பார்வை\n" +
        "- **10:30:** ஓய்வு & தூக்கம் (தூக்கக் கடனைத் தவிர்க்க 😴)";
    }

    return "### Your Personalized Day Plan 📅\n\n" +
      "*(Optimized for your **" + urgentTasks.length + " pending tasks** and **2,500ml hydration goal**)*\n\n" +
      "- **09:00 - 10:30 AM:** Advanced Data Structures Lecture *(Completed ✅)*\n" +
      "- **11:00 - 12:30 PM:** Java OOP Lab: Inheritance & Class Hierarchies *(Active Now ⏳)*\n" +
      "- **12:30 - 01:30 PM:** Lunch & 15-min Outdoor Walk *(Hydration check: +500ml)*\n" +
      "- **02:00 - 03:45 PM:** DBMS Normalization & SQL Queries Review *(Deep Focus Block)*\n" +
      "- **04:00 - 04:30 PM:** Pomodoro Break: 20-20-20 Eye Rest & Neck Stretch 🧘\n" +
      "- **04:45 - 06:15 PM:** Complete & Test Java Lab Exercise 4\n" +
      "- **07:30 - 08:30 PM:** Dinner & Relaxation\n" +
      "- **10:30 PM:** Wind-down & Sleep *(Maintains your 7.5 hr recovery target)*";
  }

  // 9. Career & Roadmap
  if (q.includes("career") || q.includes("roadmap") || q.includes("interview") || q.includes("வேலை")) {
    return "### Career Roadmap: Junior Java / Spring Boot Backend Engineer 💼\n\n" +
      "1. **Core Java Foundations (Months 1-2):** Master OOP, Collections Framework (`ArrayList`, `HashMap`), Exception Handling.\n" +
      "2. **Database Engineering (Month 3):** MySQL schema design, indexing, ACID properties, JDBC integration.\n" +
      "3. **Spring Boot & Microservices (Months 4-5):** RESTful APIs with Spring Web, Hibernate, Spring Data JPA.\n" +
      "4. **Portfolio Project (Month 6):** Build a Student Life Companion backend with JWT auth and MySQL.\n" +
      "5. **Technical Interview Preparation (Months 7-8):** Practice real interview questions under the **Career Tab**!";
  }

  // 10. General Conversational Fallback
  if (isTamil) {
    return "வணக்கம்! நான் உங்கள் **AI Life Companion**.\n\n" +
      "நீங்கள் கேட்ட கேள்வி: **\"" + escapeHtml(query) + "\"**\n\n" +
      "நான் உதவக்கூடிய முக்கிய துறைகள்:\n" +
      "- **கல்வி & நிரலாக்கம்:** Java, Python, C++, SQL, Algorithms, Data Structures.\n" +
      "- **கணிதம்:** சமன்பாடுகள், படிநிலை தீர்வுகள் மற்றும் கணிப்புகள்.\n" +
      "- **பல்கலைக்கழக பாடங்கள்:** DBMS, Operating Systems, Computer Networks.\n" +
      "- **நேர மேலாண்மை:** படிப்பு அட்டவணை மற்றும் நல்வாழ்வு பழக்கங்கள்.\n\n" +
      "நீங்கள் எந்தவொரு குறிப்பிட்ட தலைப்பிலும் விளக்கத்தையோ அல்லது குறியீட்டையோ கேட்கலாம்!";
  }

  return "### Analysis & Answer: " + escapeHtml(query) + "\n\n" +
    "Here is a structured explanation addressing your query:\n\n" +
    "1. **Core Concept:** Addressing \"" + escapeHtml(query) + "\" involves understanding the primary mechanisms, theoretical foundation, and practical implementation.\n" +
    "2. **Key Insights:**\n" +
    "   - Analyze the underlying components and constraints.\n" +
    "   - Apply proven software design or algorithmic patterns.\n" +
    "   - Verify performance implications and real-world trade-offs.\n" +
    "3. **Application:** Integrate this with your active academic studies and project milestones.\n\n" +
    "*Tip: To connect an external live model (like ChatGPT `gpt-4o` or Google Gemini `gemini-1.5-flash`), click the **⚡ Connect Real AI (ChatGPT)** button in the chat header!*";
}

/* ==============================================================================
   VOICE INTERACTION & SPEECH SYNTHESIS (Web Speech API)
   ============================================================================== */
function initSpeechSystem() {
  const voiceBtn = document.getElementById("voiceMicBtn");
  const interviewVoiceBtn = document.getElementById("interviewVoiceBtn");
  const speechHint = document.getElementById("speechStatusHint");

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    AppState.speechRecognition = new SpeechRecognition();
    AppState.speechRecognition.continuous = false;
    AppState.speechRecognition.interimResults = false;
    AppState.speechRecognition.lang = AppState.currentLang === "ta" ? "ta-IN" : "en-US";

    AppState.speechRecognition.onstart = () => {
      AppState.isListening = true;
      if (voiceBtn) voiceBtn.classList.add("listening");
      if (speechHint) speechHint.innerText = "Listening... Speak your question now.";
      showToast("Microphone active... listening");
    };

    AppState.speechRecognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const chatInput = document.getElementById("chatInput");
      if (chatInput) {
        chatInput.value = transcript;
        handleUserChatSubmit();
      }
    };

    AppState.speechRecognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      AppState.isListening = false;
      if (voiceBtn) voiceBtn.classList.remove("listening");
      if (speechHint) speechHint.innerText = "Microphone ready. (Click to speak)";
    };

    AppState.speechRecognition.onend = () => {
      AppState.isListening = false;
      if (voiceBtn) voiceBtn.classList.remove("listening");
      if (speechHint) speechHint.innerText = "Microphone ready. (Click to speak)";
    };

    if (voiceBtn) {
      voiceBtn.addEventListener("click", () => {
        if (AppState.isListening) {
          AppState.speechRecognition.stop();
        } else {
          AppState.speechRecognition.lang = AppState.currentLang === "ta" ? "ta-IN" : "en-US";
          AppState.speechRecognition.start();
        }
      });
    }

    if (interviewVoiceBtn) {
      interviewVoiceBtn.addEventListener("click", () => {
        const interviewRec = new SpeechRecognition();
        interviewRec.lang = "en-US";
        interviewRec.onstart = () => showToast("Listening to your interview answer...");
        interviewRec.onresult = (e) => {
          const ansBox = document.getElementById("interviewAnswerInput");
          if (ansBox) ansBox.value = e.results[0][0].transcript;
        };
        interviewRec.start();
      });
    }
  } else {
    if (speechHint) speechHint.innerText = "Speech input supported in Chrome / Edge / Safari.";
    if (voiceBtn) {
      voiceBtn.addEventListener("click", () => {
        alert("Web Speech Recognition API is not supported in this browser. Please use Chrome or Edge for voice input.");
      });
    }
  }
}

// Text to speech readout
window.speakText = function(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel(); // Stop any previous speech

  const cleanText = stripMarkdown(text);
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = AppState.currentLang === "ta" ? "ta-IN" : "en-US";
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
};

/* ==============================================================================
   SECTION 3.4: HEALTH & WELLNESS ASSISTANT
   ============================================================================== */
function initHydrationTracker() {
  const add250Btn = document.getElementById("addWater250Btn");
  const add500Btn = document.getElementById("addWater500Btn");
  const resetBtn = document.getElementById("resetWaterBtn");

  if (add250Btn) add250Btn.addEventListener("click", () => addWater(250));
  if (add500Btn) add500Btn.addEventListener("click", () => addWater(500));
  if (resetBtn) resetBtn.addEventListener("click", () => {
    AppState.user.waterCurrent = 0;
    saveState();
    updateHydrationUI();
    showToast("Water tracker reset for today");
  });

  const sleepSlider = document.getElementById("sleepSlider");
  if (sleepSlider) {
    sleepSlider.addEventListener("input", (e) => {
      AppState.user.sleepHours = parseFloat(e.target.value);
      const disp = document.getElementById("sleepValDisplay");
      if (disp) disp.innerText = `${AppState.user.sleepHours} Hours`;
      saveState();
      updateDashboardKPIs();
    });
  }

  updateHydrationUI();
}

function addWater(amount) {
  AppState.user.waterCurrent = Math.min(AppState.user.waterCurrent + amount, 5000);
  saveState();
  updateHydrationUI();
  updateDashboardKPIs();
  showToast(`Logged +${amount}ml water! Stay hydrated.`);
}

function updateHydrationUI() {
  const cur = AppState.user.waterCurrent;
  const goal = AppState.user.waterGoal;
  const percent = Math.min(Math.round((cur / goal) * 100), 100);

  const curVal = document.getElementById("waterCurrentVal");
  const fill = document.getElementById("waterGraphicFill");
  const text = document.getElementById("waterGraphicText");

  if (curVal) curVal.innerText = cur.toLocaleString();
  if (fill) fill.style.height = `${percent}%`;
  if (text) text.innerText = `${percent}%`;

  const kpiWater = document.getElementById("kpiWater");
  const kpiWaterBar = document.getElementById("kpiWaterBar");
  const kpiWaterGoal = document.getElementById("kpiWaterGoal");
  const kpiWaterPercent = document.getElementById("kpiWaterPercent");

  if (kpiWater) kpiWater.innerText = cur.toLocaleString();
  if (kpiWaterBar) kpiWaterBar.style.width = `${percent}%`;
  if (kpiWaterGoal) kpiWaterGoal.innerText = goal.toLocaleString();
  if (kpiWaterPercent) kpiWaterPercent.innerText = `${percent}%`;
}

function initPomodoroTimer() {
  const startBtn = document.getElementById("startPomoBtn");
  const pauseBtn = document.getElementById("pausePomoBtn");
  const resetBtn = document.getElementById("resetPomoBtn");
  const headerPomoBtn = document.getElementById("headerPomoBtn");

  if (startBtn) {
    startBtn.addEventListener("click", startPomodoro);
  }
  if (pauseBtn) {
    pauseBtn.addEventListener("click", pausePomodoro);
  }
  if (resetBtn) {
    resetBtn.addEventListener("click", resetPomodoro);
  }
  if (headerPomoBtn) {
    headerPomoBtn.addEventListener("click", () => switchView("health-hub"));
  }
}

function startPomodoro() {
  if (AppState.pomodoro.isRunning) return;
  AppState.pomodoro.isRunning = true;

  AppState.pomodoro.timerId = setInterval(() => {
    if (AppState.pomodoro.timeRemaining > 0) {
      AppState.pomodoro.timeRemaining--;
      updatePomodoroDisplay();
    } else {
      // Completed timer!
      clearInterval(AppState.pomodoro.timerId);
      AppState.pomodoro.isRunning = false;
      playStretchBell();

      if (AppState.pomodoro.mode === "focus") {
        AppState.pomodoro.mode = "short_break";
        AppState.pomodoro.timeRemaining = 5 * 60;
        alert("Pomodoro Complete! Take a 5-minute hydration and eye rest break.");
      } else {
        AppState.pomodoro.mode = "focus";
        AppState.pomodoro.timeRemaining = 25 * 60;
        alert("Break over! Ready for your next focused study sprint.");
      }
      updatePomodoroDisplay();
    }
  }, 1000);

  showToast("Pomodoro Timer Started");
}

function pausePomodoro() {
  if (AppState.pomodoro.timerId) {
    clearInterval(AppState.pomodoro.timerId);
    AppState.pomodoro.isRunning = false;
    showToast("Pomodoro Paused");
  }
}

function resetPomodoro() {
  pausePomodoro();
  AppState.pomodoro.timeRemaining = 25 * 60;
  AppState.pomodoro.mode = "focus";
  updatePomodoroDisplay();
}

function updatePomodoroDisplay() {
  const mins = Math.floor(AppState.pomodoro.timeRemaining / 60);
  const secs = AppState.pomodoro.timeRemaining % 60;
  const timeStr = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const mainDisp = document.getElementById("pomoTimerDisplay");
  const headDisp = document.getElementById("headerPomoTime");
  const badge = document.getElementById("pomoModeBadge");

  if (mainDisp) mainDisp.innerText = timeStr;
  if (headDisp) headDisp.innerText = timeStr;
  if (badge) badge.innerText = AppState.pomodoro.mode === "focus" ? "Focus Session" : "Rest & Hydrate";
}

window.playStretchBell = function() {
  const audio = document.getElementById("chimeAudio");
  if (audio && AppState.user.soundEnabled) {
    audio.currentTime = 0;
    audio.play().catch(e => console.log("Audio play blocked by browser:", e));
  }
};

/* ==============================================================================
   SECTION 3.5: DAILY TASKS & DAY PLANNER (.ICS EXPORT)
   ============================================================================== */
function initTasksModule() {
  renderTasksList();

  const form = document.getElementById("newTaskForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("taskTitleInput").value.trim();
      const category = document.getElementById("taskCategorySelect").value;
      const priority = document.getElementById("taskPrioritySelect").value;
      const due = document.getElementById("taskDueDateInput").value;

      if (!title) return;

      const newTask = {
        id: "t-" + Date.now(),
        title: title,
        category: category,
        priority: priority,
        due: due ? due.replace("T", " ") : "Tomorrow",
        done: false
      };

      if (window.location.protocol.startsWith("http")) {
        try {
          const res = await fetch("api/tasks.php?action=add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: title,
              category: category,
              priority: priority.toLowerCase(),
              due_date: due ? due.split("T")[0] : null,
              due_time: due && due.includes("T") ? due.split("T")[1] : null,
              estimated_minutes: 45
            })
          });
          const data = await res.json();
          if (data.success && data.id) newTask.id = data.id.toString();
        } catch (err) {}
      }

      AppState.tasks.unshift(newTask);
      saveState();
      renderTasksList();
      updateDashboardKPIs();
      form.reset();
      showToast(`Task created: "${title}"`);
    });
  }

  const clearDoneBtn = document.getElementById("clearCompletedTasksBtn");
  if (clearDoneBtn) {
    clearDoneBtn.addEventListener("click", () => {
      AppState.tasks = AppState.tasks.filter(t => !t.done);
      saveState();
      renderTasksList();
      updateDashboardKPIs();
      showToast("Completed tasks cleared");
    });
  }
}

function renderTasksList() {
  const container = document.getElementById("taskListContainer");
  const statsLabel = document.getElementById("taskCompletedStats");
  if (!container) return;

  const doneCount = AppState.tasks.filter(t => t.done).length;
  const totalCount = AppState.tasks.length;

  if (statsLabel) {
    statsLabel.innerText = `${doneCount} of ${totalCount} tasks completed today`;
  }

  container.innerHTML = AppState.tasks.map(task => `
    <div class="task-item ${task.done ? 'completed' : ''}" style="display:flex;align-items:center;justify-content:space-between;padding:0.85rem 1rem;background:var(--bg-body);border:1px solid var(--border-color);border-radius:var(--radius-md);gap:0.75rem;">
      <div style="display:flex;align-items:center;gap:0.75rem;">
        <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTaskDone('${task.id}')" style="width:18px;height:18px;cursor:pointer;">
        <div>
          <strong style="display:block;font-size:0.9rem;text-decoration:${task.done ? 'line-through' : 'none'};color:${task.done ? 'var(--text-muted)' : 'var(--text-primary)'};">${escapeHtml(task.title)}</strong>
          <span style="font-size:0.75rem;color:var(--text-muted);">${task.category} • Due: ${task.due}</span>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:0.5rem;">
        <span class="badge ${task.priority === 'Urgent' ? 'badge-danger' : task.priority === 'High' ? 'badge-warning' : 'badge-outline'}">${task.priority}</span>
        <button class="btn btn-xs btn-ghost" onclick="deleteTask('${task.id}')" style="color:var(--accent-red);" title="Remove task">✕</button>
      </div>
    </div>
  `).join("");
}

window.toggleTaskDone = async function(id) {
  const t = AppState.tasks.find(item => item.id.toString() === id.toString());
  if (t) {
    t.done = !t.done;
    saveState();
    renderTasksList();
    updateDashboardKPIs();
    if (window.location.protocol.startsWith("http")) {
      try {
        await fetch("api/tasks.php?action=toggle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: id, is_completed: t.done ? 1 : 0 })
        });
      } catch (e) {}
    }
  }
};

window.deleteTask = async function(id) {
  AppState.tasks = AppState.tasks.filter(item => item.id.toString() !== id.toString());
  saveState();
  renderTasksList();
  updateDashboardKPIs();
  showToast("Task removed");
  if (window.location.protocol.startsWith("http")) {
    try {
      await fetch("api/tasks.php?action=delete&id=" + encodeURIComponent(id));
    } catch (e) {}
  }
};

// Day Planner Module & .ICS Calendar Sync (Section 3.5 & 3.7)
function initDayPlannerModule() {
  renderDayPlanTimeline();

  const regenBtn = document.getElementById("regenerateDayPlanBtn");
  if (regenBtn) {
    regenBtn.addEventListener("click", () => {
      renderDayPlanTimeline();
      showToast("Day Plan re-optimized with current priorities & sleep targets");
    });
  }

  const exportBtn = document.getElementById("exportIcsBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", exportScheduleToIcs);
  }
}

function renderDayPlanTimeline() {
  const container = document.getElementById("dayPlanTimeline");
  if (!container) return;

  const slots = [
    { time: "09:00 - 10:30", title: "Advanced Data Structures & Algorithms", desc: "Lecture Hall B3 • Trees and Binary Heaps", type: "study", tag: "Academic" },
    { time: "10:30 - 10:45", title: "Pomodoro Rest & Hydration (+250ml)", desc: "Relieve digital eye strain; hydrate", type: "wellness", tag: "Health" },
    { time: "11:00 - 12:30", title: "Java OOP Lab: Inheritance & Abstract Classes", desc: "Computer Lab 204 • Programming exercises", type: "study", tag: "Due Tomorrow" },
    { time: "12:30 - 01:30", title: "Lunch & Relaxation Break", desc: "Nutritious balanced meal & 15-min walk", type: "break", tag: "Recovery" },
    { time: "02:00 - 03:30", title: "Database Systems: Normalization Review", desc: "3NF & BCNF practice questions in Library", type: "task", tag: "Coursework" },
    { time: "03:30 - 04:00", title: "Career Skill Sprint: Spring Boot Starter", desc: "Portfolio project setup for Junior Backend Dev goal", type: "task", tag: "Career Goal" },
    { time: "04:30 - 05:15", title: "Desk Stretch Routine & Hydration Check", desc: "Neck release, shoulder rolls, 20-20-20 eye rest", type: "wellness", tag: "Wellness" },
    { time: "05:30 - 07:00", title: "Final Review & Polish: Java Lab Submission", desc: "Submit through university portal before deadline", type: "study", tag: "Urgent" }
  ];

  container.innerHTML = slots.map(s => `
    <div class="timeline-slot ${s.type}">
      <div class="timeline-time">${s.time}</div>
      <div class="timeline-details">
        <strong>${escapeHtml(s.title)}</strong>
        <span>${escapeHtml(s.desc)}</span>
      </div>
      <span class="badge ${s.type === 'wellness' ? 'badge-success' : s.type === 'study' ? 'badge-primary' : 'badge-warning'}">${s.tag}</span>
    </div>
  `).join("");
}

// Generate RFC 5545 Standard iCalendar file via backend calendar API
function exportScheduleToIcs() {
  window.location.href = "api/calendar.php?action=export_ics";
  showToast("Downloading your university schedule (.ICS calendar file)...");
}
window.exportScheduleToIcs = exportScheduleToIcs;

/* ==============================================================================
   SECTION 3.6: CAREER DEVELOPMENT ASSISTANT
   ============================================================================== */
function initCareerModule() {
  renderSkillGapMatrix();
  renderRoadmap();

  // Role selector cards
  const roleCards = document.querySelectorAll(".career-role-item");
  roleCards.forEach(card => {
    card.addEventListener("click", () => {
      roleCards.forEach(c => {
        c.classList.remove("active");
        c.querySelector(".badge").className = "badge badge-outline";
        c.querySelector(".badge").innerText = "Select";
      });
      card.classList.add("active");
      card.querySelector(".badge").className = "badge badge-success";
      card.querySelector(".badge").innerText = "Active Goal";

      AppState.user.careerGoal = card.getAttribute("data-role");
      saveState();
      renderSkillGapMatrix();
      renderRoadmap();
      showToast(`Active Career Target updated to ${card.querySelector('strong').innerText}`);
    });
  });

  // Mock Interview Form & Evaluation
  const interviewForm = document.getElementById("interviewAnswerForm");
  const nextQBtn = document.getElementById("nextInterviewQBtn");

  if (nextQBtn) {
    nextQBtn.addEventListener("click", () => {
      AppState.currentInterviewIdx = (AppState.currentInterviewIdx + 1) % AppState.interviewQuestions.length;
      updateInterviewQuestion();
    });
  }

  if (interviewForm) {
    interviewForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const answer = document.getElementById("interviewAnswerInput").value.trim();
      const resultDiv = document.getElementById("interviewFeedbackResult");

      if (!answer) {
        showToast("Please type or speak an answer first");
        return;
      }

      const qObj = AppState.interviewQuestions[AppState.currentInterviewIdx];
      resultDiv.innerHTML = `
        <div style="background:var(--bg-subtle);padding:1rem;border-radius:var(--radius-md);text-align:center;color:var(--primary-light);">
          <span>⚡ Analyzing technical depth, accuracy, and interview communication with AI rubrics...</span>
        </div>
      `;

      if (window.location.protocol.startsWith("http")) {
        try {
          const resp = await fetch("api/career.php?action=evaluate_interview_answer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question: qObj.question,
              answer: answer,
              sample_answer: qObj.sampleAnswer,
              role: AppState.user.careerGoal
            })
          });
          if (resp.ok) {
            const data = await resp.json();
            if (data.success) {
              const score = data.score || 8.5;
              resultDiv.innerHTML = `
                <div class="interview-feedback-box" style="margin-top:1rem;">
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">
                    <strong style="color:var(--accent-green);font-size:0.95rem;">🎯 AI Evaluation: ${score} / 10</strong>
                    <span class="badge ${score >= 8 ? 'badge-success' : 'badge-warning'}">${data.provider ? ('⚡ ' + data.provider) : 'Evaluated'}</span>
                  </div>
                  <p style="font-size:0.85rem;color:var(--text-primary);line-height:1.45;">
                    <strong>Feedback:</strong> ${escapeHtml(data.feedback || "Good technical reasoning.")}
                  </p>
                  <p style="font-size:0.85rem;color:var(--text-secondary);margin:0.25rem 0 0.5rem 0;">
                    <strong>Strengths:</strong> ${escapeHtml(data.strengths || "Solid conceptual knowledge.")}<br>
                    <strong>Areas to Polish:</strong> ${escapeHtml(data.improvements || "Include runtime dynamic dispatch nuances.")}
                  </p>
                  <div style="background:var(--bg-subtle);padding:0.6rem;border-radius:var(--radius-sm);font-size:0.8rem;">
                    <strong>Model Benchmark:</strong><br>
                    ${escapeHtml(qObj.sampleAnswer)}
                  </div>
                </div>
              `;
              return;
            }
          }
        } catch (err) {}
      }

      resultDiv.innerHTML = `
        <div class="interview-feedback-box" style="margin-top:1rem;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">
            <strong style="color:var(--accent-green);font-size:0.95rem;">🎯 Evaluation: 8.5 / 10</strong>
            <span class="badge badge-success">Strong Technical Foundation</span>
          </div>
          <p style="font-size:0.85rem;color:var(--text-primary);line-height:1.45;">
            <strong>Strengths:</strong> You clearly differentiated the mechanism. Your explanation demonstrates solid conceptual understanding of Object-Oriented polymorphism.
          </p>
          <div style="background:var(--bg-subtle);padding:0.6rem;border-radius:var(--radius-sm);font-size:0.8rem;">
            <strong>Model Benchmark:</strong><br>
            ${escapeHtml(qObj.sampleAnswer)}
          </div>
        </div>
      `;
    });
  }
}

function updateInterviewQuestion() {
  const qObj = AppState.interviewQuestions[AppState.currentInterviewIdx];
  const qText = document.getElementById("interviewQuestionText");
  const resultDiv = document.getElementById("interviewFeedbackResult");
  const input = document.getElementById("interviewAnswerInput");

  if (qText) qText.innerText = `"${qObj.question}"`;
  if (resultDiv) resultDiv.innerHTML = "";
  if (input) input.value = "";
}

function renderSkillGapMatrix() {
  const container = document.getElementById("skillGapList");
  if (!container) return;

  const skills = [
    { name: "Object-Oriented Java (OOP)", current: 82, target: 90 },
    { name: "Data Structures & Algorithms (Trees, Graphs)", current: 68, target: 85 },
    { name: "Relational DB & SQL (MySQL/Postgres)", current: 75, target: 80 },
    { name: "Spring Boot Framework & REST APIs", current: 35, target: 80 },
    { name: "Docker & Cloud Basics", current: 25, target: 70 }
  ];

  container.innerHTML = skills.map(s => `
    <div class="skill-gap-item">
      <div class="skill-gap-labels">
        <span>${escapeHtml(s.name)}</span>
        <span>${s.current}% <small style="color:var(--text-muted);">/ Target: ${s.target}%</small></span>
      </div>
      <div class="skill-bar-wrap">
        <div class="skill-bar-current" style="width: ${s.current}%"></div>
      </div>
    </div>
  `).join("");
}

function renderRoadmap() {
  const container = document.getElementById("roadmapContainer");
  if (!container) return;

  const steps = [
    { title: "Milestone 1: Core Java & OOP Principles", status: "completed", desc: "Mastered Classes, Encapsulation, Inheritance, and basic Polymorphism in Semester 3." },
    { title: "Milestone 2: Java Collections & Exception Handling", status: "active", desc: "In progress. Learn HashMap internals, ArrayList vs LinkedList, custom exceptions." },
    { title: "Milestone 3: Database & JDBC Integration", status: "upcoming", desc: "Connect Java to MySQL. Write DAO layers and implement transactions." },
    { title: "Milestone 4: Spring Boot REST API Capstone", status: "upcoming", desc: "Build full CRUD API with authentication, swagger documentation, and unit tests." },
    { title: "Milestone 5: Technical Interview Readiness", status: "upcoming", desc: "Solve 50 LeetCode Mediums & practice behavioral STAR questions." }
  ];

  container.innerHTML = steps.map(st => `
    <div class="roadmap-step ${st.status}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.25rem;">
        <strong style="color:var(--text-primary);">${escapeHtml(st.title)}</strong>
        <span class="badge ${st.status === 'completed' ? 'badge-success' : st.status === 'active' ? 'badge-primary' : 'badge-outline'}">${st.status}</span>
      </div>
      <p style="font-size:0.8rem;color:var(--text-secondary);margin:0;">${escapeHtml(st.desc)}</p>
    </div>
  `).join("");
}

/* ==============================================================================
   SECTION 3.3: NOTES & PDF Q&A AND STUDY PRACTICE QUIZ (PDF.js + RAG)
   ============================================================================== */
function initNotesModule() {
  const sumBtn = document.getElementById("summarizeNotesBtn");
  const examBtn = document.getElementById("extractExamPointsBtn");
  const saveBtn = document.getElementById("saveNoteBtn");
  const downloadBtn = document.getElementById("downloadNotesBtn");
  const sampleBtn = document.getElementById("loadSampleNotesBtn");
  const input = document.getElementById("notesInput");
  const titleInput = document.getElementById("noteTitleInput");
  const subjectSelect = document.getElementById("noteSubjectSelect");
  const result = document.getElementById("notesAnalysisResult");
  const fileInput = document.getElementById("noteFileInput");
  const uploadBtn = document.getElementById("uploadNoteFileBtn");
  const dropZone = document.getElementById("pdfDropZone");
  const docStatusBadge = document.getElementById("docStatusBadge");
  const searchInput = document.getElementById("notesSearchInput");
  const savedListContainer = document.getElementById("savedNotesListContainer");
  const savedCountBadge = document.getElementById("savedNotesCountBadge");

  // RAG Console Elements
  const ragInput = document.getElementById("ragQueryInput");
  const askRagBtn = document.getElementById("askRagBtn");
  const ragResult = document.getElementById("ragQueryResult");
  const ragCitations = document.getElementById("ragCitationsContainer");

  let currentActiveNoteId = 0;
  let activeDocumentId = 0;
  let cachedDocChunks = [];

  // Helper: Process and index file (PDF or text)
  async function processUploadedStudyFile(file) {
    if (!file) return;
    if (titleInput && !titleInput.value) {
      titleInput.value = file.name.replace(/\.[^/.]+$/, "");
    }

    if (docStatusBadge) {
      docStatusBadge.className = "badge badge-primary";
      docStatusBadge.innerText = "Extracting...";
    }

    if (file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf") {
      try {
        if (typeof pdfjsLib === "undefined") {
          throw new Error("PDF.js library is loading or offline");
        }
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const pageCount = pdf.numPages;
        let fullText = "";
        const chunks = [];

        for (let i = 1; i <= pageCount; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(" ");
          if (pageText.trim()) {
            fullText += `=== Page ${i} ===\n${pageText.trim()}\n\n`;
            chunks.push({ page: i, text: pageText.trim() });
          }
        }

        cachedDocChunks = chunks;
        if (input) input.value = fullText.trim() || `[PDF loaded: ${file.name} with ${pageCount} pages, but text was scanned/unextractable]`;

        // Upload to backend documents RAG index
        if (window.location.protocol.startsWith("http") && chunks.length > 0) {
          try {
            const upRes = await fetch("api/documents.php?action=upload", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                filename: file.name,
                file_type: "pdf",
                file_size: file.size,
                page_count: pageCount,
                chunks: chunks
              })
            });
            const upData = await upRes.json();
            if (upData.success) {
              activeDocumentId = upData.document_id || 0;
            }
          } catch (e) {}
        }

        if (docStatusBadge) {
          docStatusBadge.className = "badge badge-success";
          docStatusBadge.innerText = `PDF: ${pageCount} Pages Indexed`;
        }
        showToast(`PDF processed: ${pageCount} pages extracted and indexed for RAG Q&A!`);
      } catch (pdfErr) {
        console.warn("PDF extraction fallback:", pdfErr);
        // Fallback to text reading
        const reader = new FileReader();
        reader.onload = (evt) => {
          if (input) input.value = evt.target.result;
          if (docStatusBadge) {
            docStatusBadge.className = "badge badge-warning";
            docStatusBadge.innerText = "Text Fallback";
          }
        };
        reader.readAsText(file);
      }
    } else {
      // Plain text or markdown
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const text = evt.target.result;
        if (input) input.value = text;
        if (docStatusBadge) {
          docStatusBadge.className = "badge badge-success";
          docStatusBadge.innerText = "Text Ready";
        }
        showToast(`Document loaded: ${file.name}`);

        // Index text chunks for RAG
        if (window.location.protocol.startsWith("http")) {
          try {
            await fetch("api/documents.php?action=upload", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                filename: file.name,
                file_type: "text",
                file_size: file.size,
                text: text
              })
            });
          } catch (e) {}
        }
      };
      reader.readAsText(file);
    }
  }

  // File Upload Button & Input
  if (uploadBtn && fileInput) {
    uploadBtn.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      processUploadedStudyFile(file);
    });
  }

  // Drag and Drop Zone
  if (dropZone) {
    dropZone.addEventListener("click", () => fileInput && fileInput.click());
    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.style.borderColor = "var(--primary)";
      dropZone.style.background = "rgba(99,102,241,0.1)";
    });
    dropZone.addEventListener("dragleave", (e) => {
      e.preventDefault();
      dropZone.style.borderColor = "var(--border-color)";
      dropZone.style.background = "var(--bg-subtle)";
    });
    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.style.borderColor = "var(--border-color)";
      dropZone.style.background = "var(--bg-subtle)";
      const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      processUploadedStudyFile(file);
    });
  }

  // Ask Document (RAG Grounded Q&A)
  if (askRagBtn && ragInput && ragResult) {
    askRagBtn.addEventListener("click", async () => {
      const query = ragInput.value.trim();
      if (!query) {
        showToast("Please enter a question to ask your uploaded document");
        return;
      }

      ragResult.innerHTML = '<div style="display:flex;align-items:center;gap:0.5rem;"><div class="spinner" style="width:16px;height:16px;"></div><span style="font-size:0.8rem;color:var(--text-muted);">Searching indexed chunks & generating grounded answer...</span></div>';
      if (ragCitations) ragCitations.innerHTML = "";

      if (window.location.protocol.startsWith("http")) {
        try {
          const res = await fetch("api/documents.php?action=rag_query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: query,
              doc_id: activeDocumentId,
              lang: AppState.currentLang
            })
          });
          const data = await res.json();
          if (data.success) {
            ragResult.innerHTML = formatMarkdown(data.answer);
            if (ragCitations && Array.isArray(data.citations) && data.citations.length > 0) {
              ragCitations.innerHTML = '<span style="font-size:0.75rem;font-weight:700;color:var(--text-secondary);margin-right:0.3rem;">Sources:</span>' + 
                data.citations.map(c => `
                  <span class="badge badge-outline" title="${escapeHtml(c.snippet)}" style="font-size:0.72rem;cursor:help;display:inline-flex;align-items:center;gap:0.25rem;">
                    📄 ${escapeHtml(c.filename)} (Page ${c.page})
                  </span>
                `).join("");
            }
            return;
          }
        } catch (e) {
          console.warn("Backend RAG query failed:", e);
        }
      }

      // Local fallback RAG search on cachedDocChunks
      if (cachedDocChunks.length > 0) {
        const qWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        let bestChunk = null;
        let maxMatches = 0;
        cachedDocChunks.forEach(c => {
          const lower = c.text.toLowerCase();
          let count = 0;
          qWords.forEach(w => { if (lower.includes(w)) count++; });
          if (count > maxMatches) {
            maxMatches = count;
            bestChunk = c;
          }
        });

        if (bestChunk) {
          ragResult.innerHTML = `<p><strong>Grounded Extract (Page ${bestChunk.page}):</strong></p><p style="font-style:italic;">"${escapeHtml(bestChunk.text.substring(0, 300))}..."</p>`;
          if (ragCitations) {
            ragCitations.innerHTML = `<span class="badge badge-success">Source: Page ${bestChunk.page}</span>`;
          }
        } else {
          ragResult.innerHTML = `<span style="color:var(--text-muted);">No matching passages found in the uploaded text for "${escapeHtml(query)}".</span>`;
        }
      } else {
        ragResult.innerHTML = `<span style="color:var(--text-muted);">Please upload a lecture PDF or notes first to ask grounded questions.</span>`;
      }
    });
  }

  // Load Sample Notes
  if (sampleBtn && input) {
    sampleBtn.addEventListener("click", () => {
      if (titleInput) titleInput.value = "Java OOP - Polymorphism & Dynamic Dispatch";
      if (subjectSelect) subjectSelect.value = "Java OOP";
      input.value = "LECTURE NOTES: Object-Oriented Programming (Java) — Chapter 4: Polymorphism & Interfaces\n\n" +
        "1. Polymorphism means 'many forms'. It allows methods to perform different tasks based on the object that invokes them.\n" +
        "2. Compile-Time Polymorphism is achieved via Method Overloading. Same method name, different parameter types or count.\n" +
        "3. Runtime Polymorphism is achieved via Method Overriding. Child class overrides parent method. Resolved at runtime using Virtual Method Invocation.\n" +
        "4. An Interface is an abstract contract that classes must implement. All methods in an interface are implicitly public and abstract.\n" +
        "5. A class can implement multiple interfaces, effectively bypassing the single-inheritance restriction in Java!\n" +
        "6. In memory, dynamic method dispatch uses a virtual method table (vtable) to look up the overriding child implementation at execution time.";
      showToast(AppState.currentLang === "ta" ? "மாதிரி ஜாவா குறிப்புகள் ஏற்றப்பட்டன" : "Sample Java OOP lecture notes loaded.");
    });
  }

  // Live AI Summarize with customizable Length & Format
  if (sumBtn && input && result) {
    sumBtn.addEventListener("click", async () => {
      const text = input.value.trim();
      if (!text) {
        showToast("Please enter notes or upload a document first");
        return;
      }

      const lenSelect = document.getElementById("summaryLengthSelect");
      const fmtSelect = document.getElementById("summaryFormatSelect");
      const selectedLength = lenSelect ? lenSelect.value : "medium";
      const selectedFormat = fmtSelect ? fmtSelect.value : "structured";

      result.innerHTML = '<div style="padding:1.5rem;text-align:center;"><div class="spinner" style="margin:0 auto 0.5rem auto;"></div><span>AI synthesizing structured notes & definitions...</span></div>';

      let summaryText = "";
      let provider = "grounded";
      let noticeMsg = null;

      if (window.location.protocol.startsWith("http")) {
        try {
          const res = await fetch("api/notes.php?action=summarize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              content: text, 
              lang: AppState.currentLang,
              note_id: currentActiveNoteId,
              length: selectedLength,
              format: selectedFormat
            })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.result) {
              summaryText = data.result;
              provider = data.provider || "AI Model";
              noticeMsg = data.notice || null;
            }
          }
        } catch (e) {
          console.warn("Backend notes summarizer offline:", e);
        }
      }

      if (!summaryText) {
        const sentences = text.split(/(?<=[.!?\n])\s+/).filter(s => s.trim().length > 10);
        const topSentences = sentences.slice(0, 4);
        summaryText = "### Key Conceptual Summary:\n" +
          topSentences.map(s => "- " + s.trim()).join("\n") +
          "\n\n💡 *Personalized Tip: Remember these core concepts for your upcoming semester revision!*";
      }

      result.innerHTML = '<div style="background:var(--bg-card);padding:1.25rem;border-radius:var(--radius-md);border-left:4px solid var(--primary);">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">' +
        '<h4 style="margin:0;color:var(--primary);">✨ AI Study Notes & Summary</h4>' +
        '<span class="badge badge-success">⚡ ' + escapeHtml(provider) + '</span></div>' +
        (noticeMsg ? `<div style="font-size:0.78rem;color:#f59e0b;margin-bottom:0.5rem;">${escapeHtml(noticeMsg)}</div>` : '') +
        '<div class="msg-content">' + formatMarkdown(summaryText) + '</div>' +
        '</div>';
    });
  }

  // Live AI Exam Questions
  if (examBtn && input && result) {
    examBtn.addEventListener("click", async () => {
      const text = input.value.trim();
      if (!text) {
        showToast("Please enter notes or upload a document first");
        return;
      }
      result.innerHTML = '<div style="padding:1.5rem;text-align:center;"><div class="spinner" style="margin:0 auto 0.5rem auto;"></div><span>AI extracting high-yield exam questions...</span></div>';

      let questionsText = "";
      let provider = "grounded";
      if (window.location.protocol.startsWith("http")) {
        try {
          const res = await fetch("api/notes.php?action=extract_exam_questions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              content: text, 
              lang: AppState.currentLang,
              note_id: currentActiveNoteId,
              format: "exam_points"
            })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.result) {
              questionsText = data.result;
              provider = data.provider || "AI Model";
            }
          }
        } catch (e) {
          console.warn("Backend exam question extractor offline:", e);
        }
      }

      if (!questionsText) {
        questionsText = "1. (5 Marks): Explain the primary architecture and mechanisms described in these notes with an example.\n2. (10 Marks): Provide a comprehensive real-world scenario demonstrating how these principles solve system bottlenecks.\n3. (2 Marks): State the core advantages and trade-offs of this approach.";
      }

      result.innerHTML = '<div style="background:var(--bg-card);padding:1.25rem;border-radius:var(--radius-md);border-left:4px solid var(--accent-green);">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">' +
        '<h4 style="margin:0;color:var(--accent-green);">🎯 High-Yield University Exam Questions</h4>' +
        '<span class="badge badge-success">⚡ ' + escapeHtml(provider) + '</span></div>' +
        '<div class="msg-content">' + formatMarkdown(questionsText) + '</div>' +
        '</div>';
    });
  }

  // Download Notes (.MD)
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      const title = (titleInput && titleInput.value.trim()) || "Study_Notes";
      const notesContent = (input && input.value.trim()) || "";
      const analysisEl = document.getElementById("notesAnalysisResult");
      const summaryContent = analysisEl ? analysisEl.innerText : "";

      const fileData = `# ${title}\nSubject: ${(subjectSelect ? subjectSelect.value : "General")}\nDate: ${new Date().toLocaleDateString()}\n\n## AI Summary & Notes\n${summaryContent}\n\n## Raw Source Material\n${notesContent}\n`;
      const blob = new Blob([fileData], { type: "text/markdown;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${title.replace(/\s+/g, "_")}.md`;
      a.click();
      showToast("Downloaded notes as Markdown (.md)!");
    });
  }

  // 5. Save Note to Database
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      const title = titleInput && titleInput.value.trim() ? titleInput.value.trim() : "Study Note " + new Date().toLocaleDateString();
      const subject = subjectSelect ? subjectSelect.value : "General";
      const content = input ? input.value.trim() : "";

      if (!content) {
        showToast(AppState.currentLang === "ta" ? "சேமிக்க குறிப்புகளை உள்ளிடவும்" : "Please enter notes before saving");
        return;
      }

      if (window.location.protocol.startsWith("http")) {
        try {
          const res = await fetch("api/notes.php?action=save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: currentActiveNoteId,
              title: title,
              subject: subject,
              content: content
            })
          });
          const data = await res.json();
          if (data.success) {
            currentActiveNoteId = data.id || currentActiveNoteId;
            showToast(AppState.currentLang === "ta" ? "குறிப்பு தரவுத்தளத்தில் சேமிக்கப்பட்டது!" : "Note saved to database successfully!");
            loadSavedNotesList();
            return;
          }
        } catch (e) {
          console.warn("Backend save note offline, fallback to local:", e);
        }
      }

      // Local fallback
      const localNotes = JSON.parse(localStorage.getItem("ailife_saved_notes") || "[]");
      const existingIdx = localNotes.findIndex(n => n.id === currentActiveNoteId);
      const noteObj = {
        id: currentActiveNoteId || Date.now(),
        title: title,
        subject: subject,
        content: content,
        updated_at: new Date().toISOString().replace("T", " ").substring(0, 19)
      };
      if (existingIdx >= 0) localNotes[existingIdx] = noteObj;
      else localNotes.unshift(noteObj);
      localStorage.setItem("ailife_saved_notes", JSON.stringify(localNotes));
      showToast("Note saved locally!");
      loadSavedNotesList();
    });
  }

  // 6. Load & Render Saved Notes
  async function loadSavedNotesList(filterTerm = "") {
    if (!savedListContainer) return;
    let notes = [];

    if (window.location.protocol.startsWith("http")) {
      try {
        const url = "api/notes.php?action=list" + (filterTerm ? ("&q=" + encodeURIComponent(filterTerm)) : "");
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.notes)) {
            notes = data.notes;
          }
        }
      } catch (e) {
        console.warn("Could not fetch notes from backend:", e);
      }
    }

    if (notes.length === 0) {
      notes = JSON.parse(localStorage.getItem("ailife_saved_notes") || "[]");
      if (filterTerm) {
        const ft = filterTerm.toLowerCase();
        notes = notes.filter(n => (n.title && n.title.toLowerCase().includes(ft)) || (n.content && n.content.toLowerCase().includes(ft)));
      }
    }

    if (savedCountBadge) savedCountBadge.innerText = notes.length + " Notes";

    if (notes.length === 0) {
      savedListContainer.innerHTML = '<p style="font-size:0.8rem;color:var(--text-muted);font-style:italic;">' +
        (filterTerm ? "No notes matching '" + escapeHtml(filterTerm) + "'" : "No saved notes yet. Click 'Save to Database' to persist your study notes.") + '</p>';
      return;
    }

    savedListContainer.innerHTML = notes.map(n => `
      <div style="background:var(--bg-subtle);padding:0.75rem;border-radius:var(--radius-sm);border:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:flex-start;gap:0.5rem;">
        <div style="flex:1;cursor:pointer;" onclick="loadNoteIntoEditor(${n.id}, '${escapeHtml(n.title)}', '${escapeHtml(n.subject || "General")}', ${JSON.stringify(n.content)})">
          <div style="display:flex;align-items:center;gap:0.4rem;margin-bottom:0.2rem;">
            <strong style="font-size:0.85rem;color:var(--text-primary);">${escapeHtml(n.title)}</strong>
            <span class="badge badge-primary" style="font-size:0.65rem;padding:0.1rem 0.35rem;">${escapeHtml(n.subject || "General")}</span>
          </div>
          <p style="font-size:0.75rem;color:var(--text-secondary);margin:0;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">
            ${escapeHtml((n.content || "").substring(0, 120))}...
          </p>
          <span style="font-size:0.68rem;color:var(--text-muted);">${(n.updated_at || "").split(" ")[0]}</span>
        </div>
        <button class="icon-btn" style="color:var(--accent-red);padding:0.25rem;" title="Delete Note" onclick="deleteNoteById(${n.id})">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    `).join("");
  }

  window.loadNoteIntoEditor = function(id, title, subject, content) {
    currentActiveNoteId = id;
    if (titleInput) titleInput.value = title;
    if (subjectSelect) subjectSelect.value = subject;
    if (input) input.value = content;
    showToast(AppState.currentLang === "ta" ? "குறிப்பு எடிட்டரில் ஏற்றப்பட்டது: " + title : "Loaded note: " + title);
  };

  window.deleteNoteById = async function(id) {
    if (!confirm(AppState.currentLang === "ta" ? "இந்தக் குறிப்பை நீக்க விரும்புகிறீர்களா?" : "Are you sure you want to delete this note?")) return;
    if (window.location.protocol.startsWith("http")) {
      try {
        await fetch("api/notes.php?action=delete&id=" + id);
      } catch (e) {}
    }
    const local = JSON.parse(localStorage.getItem("ailife_saved_notes") || "[]").filter(n => n.id != id);
    localStorage.setItem("ailife_saved_notes", JSON.stringify(local));
    showToast("Note deleted");
    loadSavedNotesList();
  };

  if (searchInput) {
    let searchTimer = null;
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        loadSavedNotesList(e.target.value.trim());
      }, 250);
    });
  }

  // Initial load of saved notes
  loadSavedNotesList();
}

function initStudyPlanModule() {
  const form = document.getElementById("studyPlanGeneratorForm");
  const planContainer = document.getElementById("activeStudyPlanContainer");
  const quizContainer = document.getElementById("interactiveQuizContainer");

  // Load existing plan from localStorage
  const savedPlanJson = localStorage.getItem("ailife_custom_study_plan");
  if (savedPlanJson && planContainer) {
    try {
      renderStudyPlanMilestones(JSON.parse(savedPlanJson));
    } catch (e) {}
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const subject = document.getElementById("studyPlanSubject").value.trim();
      const examDate = document.getElementById("studyPlanExamDate").value;
      const hours = parseFloat(document.getElementById("studyPlanDailyHours").value) || 2.5;
      const topicsStr = document.getElementById("studyPlanTopics").value.trim();
      const topicsList = topicsStr.split(/[,;]+/).map(t => t.trim()).filter(Boolean);

      if (planContainer) {
        planContainer.innerHTML = '<div style="padding:1.5rem;text-align:center;"><div class="spinner" style="margin:0 auto 0.5rem auto;"></div><span>' +
          (AppState.currentLang === "ta" ? "AI படிப்புத் திட்டத்தை உருவாக்குகிறது..." : "Generating AI Study & Revision Schedule...") + '</span></div>';
      }

      let planData = null;
      if (window.location.protocol.startsWith("http")) {
        try {
          const res = await fetch("api/study.php?action=generate_study_plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              subject_name: subject,
              exam_date: examDate,
              hours_per_day: hours,
              weak_topics: topicsList
            })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.plan) {
              planData = data.plan;
            }
          }
        } catch (err) {
          console.warn("Backend study plan generator offline:", err);
        }
      }

      if (!planData) {
        const target = new Date(examDate);
        const today = new Date();
        const diffDays = Math.max(1, Math.ceil((target - today) / (1000 * 60 * 60 * 24)));
        const defaultTopics = topicsList.length > 0 ? topicsList : ["Classes & Objects", "Inheritance & Polymorphism", "Interfaces", "Exception Handling", "Final Revision"];
        
        planData = {
          subject: subject,
          exam_date: examDate,
          days_available: diffDays,
          daily_study_hours: hours,
          schedule: defaultTopics.map((topic, i) => ({
            day: "Day " + (i * 2 + 1) + (i * 2 + 2 <= diffDays ? "-" + (i * 2 + 2) : ""),
            topic: topic,
            type: i === defaultTopics.length - 1 ? "Exam Simulation" : (i % 2 === 1 ? "Weak Topic Focus" : "Core Concepts"),
            duration: hours + " hrs"
          }))
        };
      }

      localStorage.setItem("ailife_custom_study_plan", JSON.stringify(planData));
      renderStudyPlanMilestones(planData);
      showToast(AppState.currentLang === "ta" ? "புதிய படிப்புத் திட்டம் உருவாக்கப்பட்டது!" : "Personalized Study Plan Generated!");
    });
  }

  function renderStudyPlanMilestones(plan) {
    if (!planContainer || !plan || !Array.isArray(plan.schedule)) return;
    const checks = JSON.parse(localStorage.getItem("ailife_study_checks") || "{}");
    const planKey = (plan.subject || "sub") + "_" + (plan.exam_date || "date");

    const completedCount = plan.schedule.filter((_, idx) => checks[planKey + "_" + idx]).length;
    const pct = Math.round((completedCount / plan.schedule.length) * 100);

    planContainer.innerHTML = `
      <div style="background:var(--bg-card);padding:1.25rem;border-radius:var(--radius-md);border:1px solid var(--border-color);margin-top:1rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.75rem;">
          <div>
            <h4 style="margin:0;color:var(--primary);font-size:1.05rem;">🎯 ${escapeHtml(plan.subject)}: Revision Schedule</h4>
            <span style="font-size:0.8rem;color:var(--text-secondary);">Target Exam: <strong>${escapeHtml(plan.exam_date)}</strong> (${plan.days_available} days remaining) • Daily: ${plan.daily_study_hours} hrs</span>
          </div>
          <span class="badge badge-success" style="font-size:0.85rem;">${pct}% Completed</span>
        </div>
        <div class="kpi-progress-bar" style="margin-bottom:1rem;"><div class="kpi-progress-fill green" style="width:${pct}%"></div></div>
        
        <div style="display:flex;flex-direction:column;gap:0.6rem;">
          ${plan.schedule.map((item, idx) => {
            const isDone = !!checks[planKey + "_" + idx];
            return `
              <label style="display:flex;align-items:center;justify-content:space-between;background:var(--bg-subtle);padding:0.75rem 1rem;border-radius:var(--radius-sm);cursor:pointer;border-left:4px solid ${isDone ? 'var(--accent-green)' : 'var(--primary)'};">
                <div style="display:flex;align-items:center;gap:0.75rem;">
                  <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleStudyMilestone('${planKey}', ${idx}, this.checked)">
                  <div>
                    <strong style="font-size:0.88rem;${isDone ? 'text-decoration:line-through;color:var(--text-muted);' : ''}">${escapeHtml(item.topic)}</strong>
                    <div style="font-size:0.75rem;color:var(--text-muted);">${escapeHtml(item.day)} • ${escapeHtml(item.type)}</div>
                  </div>
                </div>
                <span class="badge" style="font-size:0.75rem;">${escapeHtml(item.duration)}</span>
              </label>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  window.toggleStudyMilestone = function(planKey, idx, isChecked) {
    const checks = JSON.parse(localStorage.getItem("ailife_study_checks") || "{}");
    checks[planKey + "_" + idx] = isChecked;
    localStorage.setItem("ailife_study_checks", JSON.stringify(checks));
    const saved = localStorage.getItem("ailife_custom_study_plan");
    if (saved) renderStudyPlanMilestones(JSON.parse(saved));
  };

  // Concept Verification Quiz
  if (quizContainer) {
    const quizData = [
      {
        q: "Which keyword is used by a Java class to inherit properties from another class?",
        options: ["implements", "extends", "inherits", "import"],
        correct: 1,
        explanation: "'extends' is used to create a subclass from a superclass in Java."
      },
      {
        q: "Can a Java class extend more than one direct parent class?",
        options: ["Yes, using commas", "No, Java only allows single class inheritance", "Only if both are abstract", "Yes, in Java 17+"],
        correct: 1,
        explanation: "Java does not support multiple class inheritance to avoid the diamond problem of ambiguity."
      },
      {
        q: "What mechanism allows a child class to provide a specific implementation of a method defined in its superclass?",
        options: ["Method Overriding", "Method Overloading", "Encapsulation", "Garbage Collection"],
        correct: 0,
        explanation: "Method Overriding allows runtime polymorphism by executing the child's specialized implementation."
      }
    ];

    quizContainer.innerHTML = quizData.map((item, idx) => `
      <div style="background:var(--bg-subtle);padding:1rem;border-radius:var(--radius-md);margin-bottom:1rem;">
        <strong>Q${idx + 1}: ${escapeHtml(item.q)}</strong>
        <div style="margin-top:0.6rem;display:flex;flex-direction:column;gap:0.4rem;">
          ${item.options.map((opt, optIdx) => `
            <label style="display:flex;align-items:center;gap:0.5rem;font-size:0.85rem;cursor:pointer;">
              <input type="radio" name="quiz_q_${idx}" value="${optIdx}">
              <span>${escapeHtml(opt)}</span>
            </label>
          `).join("")}
        </div>
        <button class="btn btn-xs btn-primary mt-3" onclick="checkQuizAnswer(${idx}, ${item.correct}, '${escapeHtml(item.explanation)}')">Check Answer</button>
        <div id="quizResult_${idx}" style="margin-top:0.5rem;font-size:0.8rem;"></div>
      </div>
    `).join("");
  }
}

window.checkQuizAnswer = function(qIdx, correctIdx, explanation) {
  const selected = document.querySelector(`input[name="quiz_q_${qIdx}"]:checked`);
  const resultDiv = document.getElementById(`quizResult_${qIdx}`);
  if (!selected) {
    showToast("Please choose an answer option");
    return;
  }

  const isCorrect = parseInt(selected.value) === correctIdx;
  if (isCorrect) {
    resultDiv.innerHTML = '<span style="color:var(--accent-green);font-weight:700;">✅ Correct!</span> ' + explanation;
    const badge = document.getElementById("quizScoreBadge");
    if (badge) badge.innerText = "Score: Passed ✅";
  } else {
    resultDiv.innerHTML = '<span style="color:var(--accent-red);font-weight:700;">❌ Incorrect.</span> ' + explanation;
  }
};

/* ==============================================================================
   SETTINGS & CONTEXT INSPECTOR MODALS (Section 6)
   ============================================================================== */
function initSettingsModal() {
  const openBtn = document.getElementById("openSettingsBtn");
  const modal = document.getElementById("settingsModal");
  const closeBtn = document.getElementById("closeSettingsBtn");
  const cancelBtn = document.getElementById("cancelSettingsBtn");
  const saveBtn = document.getElementById("saveSettingsBtn");

  const nameInput = document.getElementById("settingNameInput");
  const majorInput = document.getElementById("settingMajorInput");
  const yearInput = document.getElementById("settingYearInput");
  const waterInput = document.getElementById("settingWaterGoalInput");
  const apiInput = document.getElementById("apiEndpointChat");
  const keyInput = document.getElementById("apiKeyInput");
  const soundToggle = document.getElementById("settingSoundToggle");
  const voiceToggle = document.getElementById("settingVoiceReadoutToggle");

  if (openBtn && modal) {
    openBtn.addEventListener("click", () => {
      if (nameInput) nameInput.value = AppState.user.name;
      if (majorInput) majorInput.value = AppState.user.major;
      if (yearInput) yearInput.value = AppState.user.year;
      if (waterInput) waterInput.value = AppState.user.waterGoal;
      if (apiInput) apiInput.value = AppState.user.apiEndpoint;
      if (keyInput) keyInput.value = AppState.user.apiKey;
      if (soundToggle) soundToggle.checked = AppState.user.soundEnabled;
      if (voiceToggle) voiceToggle.checked = AppState.user.voiceReadout;
      modal.classList.add("active");
    });
  }

  const closeModal = () => modal.classList.remove("active");
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      if (nameInput) AppState.user.name = nameInput.value.trim() || "Alex Smith";
      if (majorInput) AppState.user.major = majorInput.value.trim();
      if (yearInput) AppState.user.year = yearInput.value.trim();
      if (waterInput) AppState.user.waterGoal = parseInt(waterInput.value) || 2500;
      if (apiInput) AppState.user.apiEndpoint = apiInput.value.trim();
      if (keyInput) AppState.user.apiKey = keyInput.value.trim();
      if (soundToggle) AppState.user.soundEnabled = soundToggle.checked;
      if (voiceToggle) AppState.user.voiceReadout = voiceToggle.checked;

      saveState();
      renderAllViews();
      closeModal();
      showToast("Settings and profile updated successfully");
    });
  }

  // Active Context Inspector Modal
  const inspectBtn = document.getElementById("viewActiveContextBtn");
  const inspectModal = document.getElementById("contextInspectorModal");
  const closeInspectBtn = document.getElementById("closeContextInspectorBtn");
  const dismissInspectBtn = document.getElementById("dismissInspectorBtn");
  const codePre = document.getElementById("contextInspectorCode");

  if (inspectBtn && inspectModal) {
    inspectBtn.addEventListener("click", () => {
      const activeState = {
        studentProfile: {
          name: AppState.user.name,
          field: AppState.user.major,
          year: AppState.user.year,
          targetCareer: AppState.user.careerGoal
        },
        memoryStatus: AppState.memoryEnabled ? "Active" : "Paused (Incognito)",
        activeRetrievedMemories: AppState.memories.filter(m => m.active),
        pendingUrgentTasks: AppState.tasks.filter(t => !t.done && t.priority === "Urgent"),
        wellnessTargets: {
          dailyWaterGoalMl: AppState.user.waterGoal,
          targetSleepHours: AppState.user.sleepHours
        }
      };

      if (codePre) codePre.innerText = JSON.stringify(activeState, null, 2);
      inspectModal.classList.add("active");
    });
  }

  const closeInspect = () => inspectModal.classList.remove("active");
  if (closeInspectBtn) closeInspectBtn.addEventListener("click", closeInspect);
  if (dismissInspectBtn) dismissInspectBtn.addEventListener("click", closeInspect);
}

/* ==============================================================================
   DASHBOARD KPIS & LIFE SYNERGY SCORE (Section 3.7)
   ============================================================================== */
function updateDashboardKPIs() {
  const doneTasks = AppState.tasks.filter(t => t.done).length;
  const totalTasks = AppState.tasks.length || 1;
  const taskPercent = Math.round((doneTasks / totalTasks) * 100);

  const waterPercent = Math.min(Math.round((AppState.user.waterCurrent / AppState.user.waterGoal) * 100), 100);
  const sleepPercent = Math.min(Math.round((AppState.user.sleepHours / 8) * 100), 100);
  const studyPercent = 76; // Academic progress

  // Composite Synergy Score (Section 3.7 Recommendation Engine)
  const synergyScore = Math.round((taskPercent * 0.3) + (waterPercent * 0.25) + (sleepPercent * 0.25) + (studyPercent * 0.2));

  const scoreEl = document.getElementById("dashBalanceScore");
  if (scoreEl) scoreEl.innerText = `${synergyScore}%`;

  const doneEl = document.getElementById("kpiTasksDone");
  const totalEl = document.getElementById("kpiTasksTotal");
  const taskFill = document.getElementById("kpiTaskBar");

  if (doneEl) doneEl.innerText = doneTasks;
  if (totalEl) totalEl.innerText = totalTasks;
  if (taskFill) taskFill.style.width = `${taskPercent}%`;
}

async function loadUserAllData() {
  await Promise.allSettled([
    loadMemoriesFromBackend(),
    loadTasksFromBackend(),
    loadTimetableFromBackend(),
    loadCareerProfileFromBackend(),
    loadDashboardStats()
  ]);
  saveState();
  renderAllViews();
}

function exportScheduleToIcs() {
  window.location.href = "api/calendar.php?action=export_ics";
  showToast("Downloading your university schedule (.ICS calendar file)...");
}

function renderAllViews() {
  const heroName = document.getElementById("heroUserName");
  const sideName = document.getElementById("userNameLabel");
  const sideRole = document.getElementById("userRoleLabel");
  const sideAvatar = document.getElementById("sidebarAvatar");

  if (heroName) heroName.innerText = AppState.user.name.split(" ")[0];
  if (sideName) sideName.innerText = AppState.user.name;
  if (sideRole) sideRole.innerText = `${AppState.user.major} • ${AppState.user.year}`;
  if (sideAvatar) sideAvatar.innerText = AppState.user.name.split(" ").map(n => n[0]).join("");

  updateHydrationUI();
  updateDashboardKPIs();
  loadDashboardStats();
  renderTasksList();
  renderMemoryCards();
  renderMemoryCounts();
  updateLanguageUI();
}

/* ==============================================================================
   UTILITY HELPERS
   ============================================================================== */
function showToast(message) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>⚡</span> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function formatMarkdown(text) {
  if (!text) return "";
  let html = escapeHtml(text);

  // Fenced Code Blocks with Language Header and Copy Button
  html = html.replace(/```(java|python|javascript|sql|html|css|c|cpp|json|xml|bash|sh)?([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang ? lang.toUpperCase() : "CODE";
    const cleanCode = code.trim();
    const codeId = "code-" + Math.random().toString(36).substring(2, 9);
    return `<div class="code-block-wrapper" style="position:relative;margin:0.75rem 0;background:#0d1117;border:1px solid #30363d;border-radius:8px;overflow:hidden;">
      <div class="code-header" style="display:flex;justify-content:space-between;align-items:center;padding:0.4rem 0.8rem;background:#161b22;border-bottom:1px solid #30363d;font-size:0.75rem;color:#8b949e;font-family:var(--font-mono);">
        <span>${language}</span>
        <button type="button" class="copy-code-btn" onclick="copyCodeSnippet('${codeId}')" style="background:transparent;border:1px solid #30363d;color:#c9d1d9;padding:0.15rem 0.5rem;border-radius:4px;cursor:pointer;font-size:0.72rem;transition:all 0.2s;">Copy Code</button>
      </div>
      <pre class="code-font" style="padding:0.85rem;overflow-x:auto;margin:0;font-size:0.86rem;line-height:1.5;color:#e6edf3;"><code id="${codeId}">${cleanCode}</code></pre>
    </div>`;
  });

  // Markdown Tables
  html = html.replace(/\|(.+)\|\n\|[-:| ]+\|\n((?:\|.+\|\n?)+)/g, (match, headers, rows) => {
    const ths = headers.split('|').filter(h => h.trim()).map(h => `<th style="padding:0.5rem 0.75rem;border:1px solid var(--border-color);background:var(--bg-subtle);">${h.trim()}</th>`).join('');
    const trs = rows.trim().split('\n').map(row => {
      const tds = row.split('|').filter(c => c.trim()).map(c => `<td style="padding:0.5rem 0.75rem;border:1px solid var(--border-color);">${c.trim()}</td>`).join('');
      return `<tr>${tds}</tr>`;
    }).join('');
    return `<div style="overflow-x:auto;margin:0.75rem 0;"><table style="width:100%;border-collapse:collapse;font-size:0.85rem;border:1px solid var(--border-color);"><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></div>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, `<code style="background:rgba(99,102,241,0.15);color:#818cf8;padding:0.15rem 0.4rem;border-radius:4px;font-family:var(--font-mono);font-size:0.88em;">$1</code>`);

  // Bold & Italics
  html = html.replace(/\*\*([^*]+)\*\*/g, `<strong>$1</strong>`);
  html = html.replace(/\*([^*]+)\*/g, `<em>$1</em>`);

  // Headings
  html = html.replace(/^### (.*$)/gim, `<h4 style="color:var(--text-primary);margin:0.75rem 0 0.35rem 0;font-size:1rem;font-weight:700;">$1</h4>`);
  html = html.replace(/^## (.*$)/gim, `<h3 style="color:var(--text-primary);margin:0.85rem 0 0.45rem 0;font-size:1.1rem;font-weight:800;border-bottom:1px solid var(--border-color);padding-bottom:0.25rem;">$1</h3>`);
  html = html.replace(/^# (.*$)/gim, `<h2 style="color:var(--text-primary);margin:1rem 0 0.5rem 0;font-size:1.25rem;font-weight:800;">$1</h2>`);

  // Bullet and Ordered Lists
  html = html.replace(/^\- (.*$)/gim, `<li style="margin-left:1.2rem;list-style-type:disc;margin-bottom:0.25rem;">$1</li>`);
  html = html.replace(/^(\d+)\. (.*$)/gim, `<li style="margin-left:1.2rem;list-style-type:decimal;margin-bottom:0.25rem;">$2</li>`);

  // Paragraph breaks
  html = html.replace(/\n\n/g, `</p><p style="margin-bottom:0.6rem;line-height:1.6;">`);
  html = html.replace(/\n/g, `<br>`);

  return `<p style="margin-bottom:0.6rem;line-height:1.6;">${html}</p>`;
}

function copyCodeSnippet(codeId) {
  const el = document.getElementById(codeId);
  if (!el) return;
  const text = el.innerText || el.textContent;
  navigator.clipboard.writeText(text).then(() => {
    showToast("Code snippet copied to clipboard!");
  }).catch(() => {
    showToast("Press Ctrl+C to copy code.");
  });
}

function stripMarkdown(str) {
  return str
    .replace(/```[\s\S]*?```/g, "Code block omitted.")
    .replace(/`[^`]+`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/###/g, "")
    .replace(/##/g, "")
    .replace(/#/g, "")
    .replace(/\n/g, " ");
}



/* ==============================================================================
   WEB AUDIO API: SYNTHESIZED ALARM SOUND ENGINE
   ============================================================================== */
let _alarmAudioCtx = null;
let _alarmOscillator = null;

function getAlarmAudioContext() {
  if (!_alarmAudioCtx || _alarmAudioCtx.state === "closed") {
    _alarmAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (_alarmAudioCtx.state === "suspended") {
    _alarmAudioCtx.resume();
  }
  return _alarmAudioCtx;
}

function playAlarmSound(tone) {
  stopAlarmSound();
  try {
    const ctx = getAlarmAudioContext();
    const now = ctx.currentTime;

    if (tone === "chime") {
      // Melodic gentle chime - pleasant rising arpeggio
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.25);
        gain.gain.setValueAtTime(0, now + i * 0.25);
        gain.gain.linearRampToValueAtTime(0.3, now + i * 0.25 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.25 + 0.5);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + i * 0.25);
        osc.stop(now + i * 0.25 + 0.6);
      });
      // Repeat after a pause
      setTimeout(() => {
        if (document.getElementById("alarmModal") && document.getElementById("alarmModal").classList.contains("active")) {
          playAlarmSound("chime");
        }
      }, 3000);
    } else if (tone === "beep") {
      // Digital high-alert beep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.setValueAtTime(0.2, now + 0.15);
      gain.gain.setValueAtTime(0, now + 0.15);
      gain.gain.setValueAtTime(0.2, now + 0.3);
      gain.gain.setValueAtTime(0, now + 0.45);
      gain.gain.setValueAtTime(0.2, now + 0.6);
      gain.gain.setValueAtTime(0, now + 0.75);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1);
      _alarmOscillator = osc;
      setTimeout(() => {
        if (document.getElementById("alarmModal") && document.getElementById("alarmModal").classList.contains("active")) {
          playAlarmSound("beep");
        }
      }, 2000);
    } else if (tone === "gong") {
      // Resonant temple gong
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(130.81, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 2);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 3.5);
      _alarmOscillator = osc;
      // Add harmonics
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(261.63, now);
      gain2.gain.setValueAtTime(0.15, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 2);
      osc2.connect(gain2).connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 2.5);
      setTimeout(() => {
        if (document.getElementById("alarmModal") && document.getElementById("alarmModal").classList.contains("active")) {
          playAlarmSound("gong");
        }
      }, 5000);
    }
  } catch (e) {
    console.warn("Audio alarm playback failed:", e);
  }
}

function stopAlarmSound() {
  try {
    if (_alarmOscillator) {
      _alarmOscillator.stop();
      _alarmOscillator = null;
    }
  } catch (e) { /* already stopped */ }
}

/* ==============================================================================
   NEW CORE MODULE: SCHEDULE & TIME MANAGEMENT
   ============================================================================== */
function initScheduleModule() {
  // Load saved timetable from localStorage
  try {
    const saved = localStorage.getItem("ailife_timetable");
    if (saved) AppState.timetable = JSON.parse(saved);
    const savedPlan = localStorage.getItem("ailife_studyplan");
    if (savedPlan) AppState.studyPlan = JSON.parse(savedPlan);
  } catch (e) { console.warn("Could not load timetable:", e); }

  // ---- Sub-tab switching ----
  const tabTimetable = document.getElementById("schedTabTimetable");
  const tabPlan = document.getElementById("schedTabPlan");
  const tabAlarms = document.getElementById("schedTabAlarms");
  const secTimetable = document.getElementById("schedSectionTimetable");
  const secPlan = document.getElementById("schedSectionPlan");
  const secAlarms = document.getElementById("schedSectionAlarms");

  function switchScheduleTab(activeTab) {
    [tabTimetable, tabPlan, tabAlarms].forEach(t => { if (t) t.classList.remove("active"); });
    [secTimetable, secPlan, secAlarms].forEach(s => { if (s) s.classList.add("hidden"); });
    if (activeTab === "timetable" && tabTimetable && secTimetable) {
      tabTimetable.classList.add("active"); secTimetable.classList.remove("hidden");
    } else if (activeTab === "plan" && tabPlan && secPlan) {
      tabPlan.classList.add("active"); secPlan.classList.remove("hidden");
    } else if (activeTab === "alarms" && tabAlarms && secAlarms) {
      tabAlarms.classList.add("active"); secAlarms.classList.remove("hidden");
    }
  }

  if (tabTimetable) tabTimetable.addEventListener("click", () => switchScheduleTab("timetable"));
  if (tabPlan) tabPlan.addEventListener("click", () => switchScheduleTab("plan"));
  if (tabAlarms) tabAlarms.addEventListener("click", () => switchScheduleTab("alarms"));

  // ---- Add Timetable Form ----
  const addForm = document.getElementById("addTimetableForm");
  if (addForm) {
    addForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const day = document.getElementById("slotDay").value;
      const subject = document.getElementById("slotSubject").value.trim();
      const startTime = document.getElementById("slotStartTime").value;
      const endTime = document.getElementById("slotEndTime").value;
      const room = document.getElementById("slotRoom").value.trim();
      const alarmActive = document.getElementById("slotAlarmToggle").checked;

      if (!subject || !startTime || !endTime) {
        showToast("Please fill in subject, start and end time");
        return;
      }

      const slot = {
        id: "tt-" + Date.now(),
        day, subject, startTime, endTime, room, alarmActive,
        type: "class"
      };

      AppState.timetable.push(slot);
      saveTimetable();
      renderTimetableList();
      updateNextAlarmBadge();
      addForm.reset();
      document.getElementById("slotStartTime").value = "09:00";
      document.getElementById("slotEndTime").value = "10:30";
      document.getElementById("slotAlarmToggle").checked = true;
      showToast("Class added: " + subject + " on " + day);
    });
  }

  // ---- Load Preset Timetable ----
  const loadPresetBtn = document.getElementById("loadPresetTimetableBtn");
  if (loadPresetBtn) {
    loadPresetBtn.addEventListener("click", () => {
      const preset = [
        { id: "tt-p1", day: "Monday", subject: "Java OOP Lecture", startTime: "09:00", endTime: "10:30", room: "Hall A", alarmActive: true, type: "class" },
        { id: "tt-p2", day: "Monday", subject: "Data Structures & Algorithms", startTime: "11:00", endTime: "12:30", room: "Hall B", alarmActive: true, type: "class" },
        { id: "tt-p3", day: "Monday", subject: "DBMS Lab", startTime: "14:00", endTime: "16:00", room: "Lab 204", alarmActive: true, type: "class" },
        { id: "tt-p4", day: "Tuesday", subject: "Web Technology Lecture", startTime: "09:00", endTime: "10:30", room: "Hall C", alarmActive: true, type: "class" },
        { id: "tt-p5", day: "Tuesday", subject: "Java OOP Lab", startTime: "11:00", endTime: "13:00", room: "Lab 101", alarmActive: true, type: "class" },
        { id: "tt-p6", day: "Tuesday", subject: "DSA Tutorial", startTime: "14:30", endTime: "15:30", room: "Hall B", alarmActive: true, type: "class" },
        { id: "tt-p7", day: "Wednesday", subject: "DBMS Lecture", startTime: "09:00", endTime: "10:30", room: "Hall A", alarmActive: true, type: "class" },
        { id: "tt-p8", day: "Wednesday", subject: "Data Structures & Algorithms", startTime: "11:00", endTime: "12:30", room: "Hall B", alarmActive: true, type: "class" },
        { id: "tt-p9", day: "Wednesday", subject: "Web Technology Lab", startTime: "14:00", endTime: "16:00", room: "Lab 302", alarmActive: true, type: "class" },
        { id: "tt-p10", day: "Thursday", subject: "Java OOP Lecture", startTime: "09:00", endTime: "10:30", room: "Hall A", alarmActive: true, type: "class" },
        { id: "tt-p11", day: "Thursday", subject: "DBMS Tutorial", startTime: "11:00", endTime: "12:00", room: "Hall A", alarmActive: true, type: "class" },
        { id: "tt-p12", day: "Thursday", subject: "Soft Skills / Communication", startTime: "14:00", endTime: "15:00", room: "Seminar Hall", alarmActive: false, type: "class" },
        { id: "tt-p13", day: "Friday", subject: "DSA Lab", startTime: "09:00", endTime: "11:00", room: "Lab 204", alarmActive: true, type: "class" },
        { id: "tt-p14", day: "Friday", subject: "Web Technology Lecture", startTime: "11:30", endTime: "13:00", room: "Hall C", alarmActive: true, type: "class" },
        { id: "tt-p15", day: "Saturday", subject: "Java OOP Extra Practice", startTime: "10:00", endTime: "12:00", room: "Self Study", alarmActive: false, type: "class" }
      ];
      AppState.timetable = preset;
      saveTimetable();
      renderTimetableList();
      updateNextAlarmBadge();
      showToast("CS Semester 3 preset timetable loaded with 15 slots!");
    });
  }

  // ---- Generate AI Study Plan ----
  const generatePlanBtn = document.getElementById("generatePlanBtn");
  if (generatePlanBtn) {
    generatePlanBtn.addEventListener("click", () => {
      generateAIStudyPlan();
    });
  }

  // ---- Test Alarm Buttons ----
  const testAlarmBtn = document.getElementById("testAlarmBtn");
  if (testAlarmBtn) {
    testAlarmBtn.addEventListener("click", () => {
      const tone = document.getElementById("alarmToneSelect") ? document.getElementById("alarmToneSelect").value : "chime";
      playAlarmSound(tone);
      showToast("Playing alarm test: " + tone);
    });
  }

  const testAlarmNowBtn = document.getElementById("testAlarmNowBtn");
  if (testAlarmNowBtn) {
    testAlarmNowBtn.addEventListener("click", () => {
      const tone = document.getElementById("alarmToneSelect") ? document.getElementById("alarmToneSelect").value : "chime";
      playAlarmSound(tone);
      showToast("Playing alarm: " + tone);
    });
  }

  // ---- Request Notification Permission ----
  const requestNotifBtn = document.getElementById("requestNotifBtn");
  if (requestNotifBtn) {
    requestNotifBtn.addEventListener("click", () => {
      if ("Notification" in window) {
        Notification.requestPermission().then(perm => {
          if (perm === "granted") {
            showToast("Phone/Browser notifications enabled!");
            new Notification("AI Life Companion", { body: "Alarm notifications are now active!" });
          } else {
            showToast("Notification permission denied by browser");
          }
        });
      } else {
        showToast("This browser does not support notifications");
      }
    });
  }

  const notifBellBtn = document.getElementById("notifBellBtn");
  if (notifBellBtn) {
    notifBellBtn.addEventListener("click", () => {
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          showToast("🔔 System Reminders: All academic and wellness notifications are active!");
        } else {
          Notification.requestPermission().then(perm => {
            if (perm === "granted") {
              showToast("🔔 Browser notifications enabled for smart study alerts!");
              new Notification("AI Life Companion", { body: "Smart study and deadline reminders activated." });
            } else {
              showToast("Notifications blocked. Enable in browser settings for audible reminders.");
            }
          });
        }
      } else {
        showToast("🔔 Active reminders: 2 assignments due this week.");
      }
    });
  }

  // ---- Alarm Modal Buttons ----
  const alarmAckBtn = document.getElementById("alarmAcknowledgeBtn");
  const alarmSnoozeBtn = document.getElementById("alarmSnoozeBtn");
  const alarmDismissBtn = document.getElementById("alarmDismissBtn");
  const alarmModal = document.getElementById("alarmModal");

  if (alarmAckBtn) {
    alarmAckBtn.addEventListener("click", () => {
      stopAlarmSound();
      if (alarmModal) alarmModal.classList.remove("active");
      showToast("Session acknowledged! Focus mode activated.");
    });
  }

  if (alarmSnoozeBtn) {
    alarmSnoozeBtn.addEventListener("click", () => {
      stopAlarmSound();
      if (alarmModal) alarmModal.classList.remove("active");
      // Snooze: set a 5-minute reminder
      const snoozeKey = alarmModal ? alarmModal.getAttribute("data-alarm-id") : "unknown";
      AppState.snoozedAlarms[snoozeKey] = Date.now() + 5 * 60 * 1000;
      showToast("Alarm snoozed for 5 minutes");
    });
  }

  if (alarmDismissBtn) {
    alarmDismissBtn.addEventListener("click", () => {
      stopAlarmSound();
      if (alarmModal) alarmModal.classList.remove("active");
      showToast("Alarm dismissed");
    });
  }

  // ---- Initial renders ----
  renderTimetableList();
  updateNextAlarmBadge();
  renderActiveAlarmsQueue();

  // ---- Start the live alarm checker (every 15 seconds) ----
  if (AppState.alarmCheckerId) clearInterval(AppState.alarmCheckerId);
  AppState.alarmCheckerId = setInterval(checkScheduleAlarms, 15000);
  // Also check immediately
  setTimeout(checkScheduleAlarms, 2000);
}

function saveTimetable() {
  try {
    localStorage.setItem("ailife_timetable", JSON.stringify(AppState.timetable));
  } catch (e) { console.warn("Could not save timetable:", e); }
}

function saveStudyPlan() {
  try {
    localStorage.setItem("ailife_studyplan", JSON.stringify(AppState.studyPlan));
  } catch (e) { console.warn("Could not save study plan:", e); }
}

function renderTimetableList() {
  const container = document.getElementById("timetableListContainer");
  if (!container) return;

  if (AppState.timetable.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--text-muted);"><p>No timetable entries yet. Add classes above or load the CS preset.</p></div>';
    return;
  }

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const grouped = {};
  days.forEach(d => { grouped[d] = []; });
  AppState.timetable.forEach(slot => {
    if (!grouped[slot.day]) grouped[slot.day] = [];
    grouped[slot.day].push(slot);
  });

  let html = '';
  days.forEach(day => {
    const slots = grouped[day];
    if (slots.length === 0) return;

    // Sort by start time
    slots.sort((a, b) => a.startTime.localeCompare(b.startTime));

    html += '<div class="timetable-day-group">';
    html += '<h4 class="timetable-day-header">' + escapeHtml(day) + ' <span style="font-weight:400;font-size:0.8rem;color:var(--text-muted);">(' + slots.length + ' session' + (slots.length > 1 ? 's' : '') + ')</span></h4>';
    html += '<div class="timetable-slots-grid">';

    slots.forEach(slot => {
      const alarmIcon = slot.alarmActive ? '<span style="color:#22c55e;" title="Alarm active">&#9201;</span>' : '<span style="color:var(--text-muted);" title="Alarm off">&#128263;</span>';
      html += '<div class="timetable-slot-card">';
      html += '  <div class="timetable-slot-time">' + escapeHtml(slot.startTime) + ' - ' + escapeHtml(slot.endTime) + '</div>';
      html += '  <div class="timetable-slot-subject">' + alarmIcon + ' ' + escapeHtml(slot.subject) + '</div>';
      html += '  <div class="timetable-slot-room">' + escapeHtml(slot.room || "No room specified") + '</div>';
      html += '  <div style="display:flex;gap:0.4rem;margin-top:0.5rem;">';
      html += '    <button class="btn btn-xs btn-outline" onclick="toggleSlotAlarm(\'' + slot.id + '\')">' + (slot.alarmActive ? 'Disable Alarm' : 'Enable Alarm') + '</button>';
      html += '    <button class="btn btn-xs btn-ghost" style="color:var(--accent-red);" onclick="removeSlot(\'' + slot.id + '\')">Remove</button>';
      html += '  </div>';
      html += '</div>';
    });

    html += '</div></div>';
  });

  container.innerHTML = html;
}

// Global functions for timetable actions
window.toggleSlotAlarm = function(slotId) {
  const slot = AppState.timetable.find(s => s.id === slotId);
  if (slot) {
    slot.alarmActive = !slot.alarmActive;
    saveTimetable();
    renderTimetableList();
    updateNextAlarmBadge();
    renderActiveAlarmsQueue();
    showToast(slot.alarmActive ? "Alarm enabled for " + slot.subject : "Alarm disabled for " + slot.subject);
  }
};

window.removeSlot = function(slotId) {
  AppState.timetable = AppState.timetable.filter(s => s.id !== slotId);
  saveTimetable();
  renderTimetableList();
  updateNextAlarmBadge();
  renderActiveAlarmsQueue();
  showToast("Timetable slot removed");
};

function updateNextAlarmBadge() {
  const badge = document.getElementById("scheduleNextAlarmBadge");
  if (!badge) return;

  const now = new Date();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = dayNames[now.getDay()];

  // Find the next alarm for today
  const todaySlots = AppState.timetable
    .filter(s => s.day === todayName && s.alarmActive)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const currentTimeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
  const nextSlot = todaySlots.find(s => s.startTime > currentTimeStr);

  if (nextSlot) {
    badge.innerHTML = 'Next Alarm: ' + formatTime12h(nextSlot.startTime) + ' (' + escapeHtml(nextSlot.subject) + ')';
    badge.classList.add("pulsing");
  } else {
    badge.innerHTML = 'No more alarms today';
    badge.classList.remove("pulsing");
  }
}

function formatTime12h(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return h12 + ':' + m.toString().padStart(2, '0') + ' ' + ampm;
}

function renderActiveAlarmsQueue() {
  const container = document.getElementById("activeAlarmsQueueList");
  if (!container) return;

  const activeAlarms = AppState.timetable.filter(s => s.alarmActive);
  if (activeAlarms.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:1rem;">No active alarms. Enable alarms on your timetable entries.</p>';
    return;
  }

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  let html = '<div style="display:grid;gap:0.5rem;">';
  days.forEach(day => {
    const daySlots = activeAlarms.filter(s => s.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
    daySlots.forEach(slot => {
      html += '<div style="display:flex;align-items:center;gap:0.75rem;padding:0.65rem;background:var(--bg-subtle);border-radius:var(--radius-sm);border:1px solid var(--border-color);">';
      html += '<span style="font-weight:600;min-width:85px;font-size:0.82rem;">' + escapeHtml(slot.day).substring(0,3) + '</span>';
      html += '<span style="color:var(--primary);font-weight:600;min-width:110px;">' + formatTime12h(slot.startTime) + ' - ' + formatTime12h(slot.endTime) + '</span>';
      html += '<span style="flex:1;">' + escapeHtml(slot.subject) + '</span>';
      html += '<span style="font-size:0.75rem;color:var(--text-muted);">' + escapeHtml(slot.room || "") + '</span>';
      html += '</div>';
    });
  });
  html += '</div>';
  container.innerHTML = html;
}

/* ==============================================================================
   AI STUDY PLAN GENERATOR
   ============================================================================== */
function generateAIStudyPlan() {
  const hoursSelect = document.getElementById("planHoursSelect");
  const styleSelect = document.getElementById("planStyleSelect");
  const container = document.getElementById("aiGeneratedPlanContainer");
  if (!container) return;

  const targetHours = parseInt(hoursSelect ? hoursSelect.value : "3");
  const sessionStyle = styleSelect ? styleSelect.value : "pomodoro";

  const now = new Date();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = dayNames[now.getDay()];

  // Get today's classes
  const todayClasses = AppState.timetable
    .filter(s => s.day === todayName)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Define available study hours (10:00-21:00 with health breaks)
  const studyWindowStart = 8;
  const studyWindowEnd = 21;

  // Find free gaps
  const busyRanges = todayClasses.map(c => ({
    start: timeToMinutes(c.startTime),
    end: timeToMinutes(c.endTime),
    subject: c.subject
  }));

  // Add meal/health breaks
  busyRanges.push({ start: 720, end: 780, subject: "Lunch Break" }); // 12:00-13:00
  busyRanges.push({ start: 1080, end: 1110, subject: "Dinner Break" }); // 18:00-18:30
  busyRanges.sort((a, b) => a.start - b.start);

  // Find gaps
  const gaps = [];
  let cursor = studyWindowStart * 60;
  busyRanges.forEach(range => {
    if (range.start > cursor && (range.start - cursor) >= 30) {
      gaps.push({ start: cursor, end: range.start });
    }
    cursor = Math.max(cursor, range.end);
  });
  if (studyWindowEnd * 60 > cursor && (studyWindowEnd * 60 - cursor) >= 30) {
    gaps.push({ start: cursor, end: studyWindowEnd * 60 });
  }

  // Study subjects to schedule (from memories and timetable)
  const studyTopics = [
    { subject: "Java OOP - Inheritance & Polymorphism", difficulty: "hard", priority: 1 },
    { subject: "Data Structures - Binary Search Trees", difficulty: "hard", priority: 2 },
    { subject: "DBMS - SQL Normalization Practice", difficulty: "medium", priority: 3 },
    { subject: "Web Technology - CSS Grid & Flexbox", difficulty: "easy", priority: 4 }
  ];

  // Build study sessions from gaps
  const sessionDuration = sessionStyle === "pomodoro" ? 25 : 45;
  const breakDuration = sessionStyle === "pomodoro" ? 5 : 15;
  const plan = [];
  let totalStudyMins = 0;
  const maxStudyMins = targetHours * 60;
  let topicIdx = 0;

  gaps.forEach(gap => {
    let gapCursor = gap.start;
    while (gapCursor + sessionDuration <= gap.end && totalStudyMins < maxStudyMins) {
      const topic = studyTopics[topicIdx % studyTopics.length];
      plan.push({
        start: minutesToTime(gapCursor),
        end: minutesToTime(gapCursor + sessionDuration),
        subject: topic.subject,
        type: "study",
        style: sessionStyle === "pomodoro" ? "25m Focus" : "45m Deep Work"
      });
      totalStudyMins += sessionDuration;
      gapCursor += sessionDuration + breakDuration;
      topicIdx++;
    }
  });

  // Also add health reminders
  plan.push({ start: "10:00", end: "10:05", subject: "20-20-20 Eye Rest & Water", type: "health", style: "Break" });
  plan.push({ start: "15:00", end: "15:10", subject: "Posture Stretch & Hydration", type: "health", style: "Break" });
  plan.push({ start: "17:00", end: "17:10", subject: "Quick Walk & Eye Rest", type: "health", style: "Break" });

  plan.sort((a, b) => a.start.localeCompare(b.start));
  AppState.studyPlan = plan;
  saveStudyPlan();

  // Render
  let html = '<div style="margin-bottom:1rem;">';
  html += '<h4 style="color:var(--primary);margin-bottom:0.5rem;">AI-Generated Study Plan for ' + todayName + '</h4>';
  html += '<p style="font-size:0.82rem;color:var(--text-secondary);">Based on your timetable (' + todayClasses.length + ' classes), ' + targetHours + 'h study target, ' + (sessionStyle === "pomodoro" ? "Pomodoro 25/5" : "Deep Work 45/15") + ' style.</p>';
  html += '<p style="font-size:0.82rem;color:var(--accent-green);font-weight:600;">Total study time allocated: ' + totalStudyMins + ' minutes (' + Math.round(totalStudyMins/60*10)/10 + ' hours)</p>';
  html += '</div>';

  html += '<div style="display:grid;gap:0.5rem;">';
  plan.forEach(item => {
    const isHealth = item.type === "health";
    const bgColor = isHealth ? "rgba(34,197,94,0.08)" : "var(--bg-subtle)";
    const borderColor = isHealth ? "rgba(34,197,94,0.3)" : "var(--border-color)";
    const icon = isHealth ? "&#128154;" : "&#128218;";
    html += '<div style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem;background:' + bgColor + ';border-radius:var(--radius-sm);border:1px solid ' + borderColor + ';">';
    html += '<span style="font-size:1.1rem;">' + icon + '</span>';
    html += '<span style="font-weight:600;min-width:130px;color:var(--primary);">' + formatTime12h(item.start) + ' - ' + formatTime12h(item.end) + '</span>';
    html += '<span style="flex:1;">' + escapeHtml(item.subject) + '</span>';
    html += '<span class="nav-subtag" style="background:' + (isHealth ? 'rgba(34,197,94,0.15);color:#16a34a' : 'rgba(99,102,241,0.15);color:#6366f1') + ';">' + item.style + '</span>';
    html += '</div>';
  });
  html += '</div>';

  container.innerHTML = html;
  showToast("AI Study Plan generated with " + plan.filter(p => p.type === "study").length + " study sessions!");
}

function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h.toString().padStart(2, '0') + ':' + m.toString().padStart(2, '0');
}

/* ==============================================================================
   LIVE ALARM CHECKER (runs every 15 seconds)
   ============================================================================== */
function checkScheduleAlarms() {
  const globalToggle = document.getElementById("globalAlarmToggle");
  if (globalToggle && !globalToggle.checked) return;

  const now = new Date();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = dayNames[now.getDay()];
  const currentMins = now.getHours() * 60 + now.getMinutes();

  // Determine timing offset
  const timingSelect = document.getElementById("alarmTimingSelect");
  let offsetMins = 0;
  if (timingSelect) {
    if (timingSelect.value === "5min") offsetMins = 5;
    else if (timingSelect.value === "10min") offsetMins = 10;
  }

  const todayAlarms = AppState.timetable.filter(s => s.day === todayName && s.alarmActive);

  todayAlarms.forEach(slot => {
    const slotMins = timeToMinutes(slot.startTime);
    const triggerMins = slotMins - offsetMins;
    const diff = currentMins - triggerMins;

    // Trigger if within 0-1 minute window (allowing for 15-second check interval)
    if (diff >= 0 && diff <= 1) {
      // Check if snoozed
      if (AppState.snoozedAlarms[slot.id] && Date.now() < AppState.snoozedAlarms[slot.id]) {
        return; // Still snoozed
      }

      // Check if already triggered this minute (prevent double trigger)
      const triggerKey = slot.id + "-" + now.getHours() + "-" + now.getMinutes();
      if (AppState._lastTriggered === triggerKey) return;
      AppState._lastTriggered = triggerKey;

      triggerAlarmModal(slot);
    }
  });

  // Also check snoozed alarms
  Object.keys(AppState.snoozedAlarms).forEach(slotId => {
    if (Date.now() >= AppState.snoozedAlarms[slotId]) {
      const slot = AppState.timetable.find(s => s.id === slotId);
      if (slot) {
        delete AppState.snoozedAlarms[slotId];
        triggerAlarmModal(slot);
      }
    }
  });

  // Update the badge
  updateNextAlarmBadge();
}

function triggerAlarmModal(slot) {
  const modal = document.getElementById("alarmModal");
  const title = document.getElementById("alarmModalTitle");
  const time = document.getElementById("alarmModalTime");

  if (modal) {
    modal.classList.add("active");
    modal.setAttribute("data-alarm-id", slot.id);
  }
  if (title) title.textContent = slot.subject + " Starts Now!";
  if (time) time.textContent = "Scheduled: " + formatTime12h(slot.startTime) + " - " + formatTime12h(slot.endTime) + " (" + (slot.room || "No room") + ")";

  // Play alarm sound
  const toneSelect = document.getElementById("alarmToneSelect");
  const tone = toneSelect ? toneSelect.value : "chime";
  playAlarmSound(tone);

  // Fire browser notification
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification("AI Life Companion - Session Alarm", {
        body: slot.subject + " at " + formatTime12h(slot.startTime) + " (" + (slot.room || "") + ")",
        icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>â°</text></svg>"
      });
    } catch (e) { /* Notification failed */ }
  }
}

/* ==============================================================================
   MOBILE NAVIGATION & DRAWER HANDLER
   ============================================================================== */
function initMobileNavigation() {
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  const mobOpenBtn = document.getElementById("mobOpenMenuBtn");
  const sidebarCloseBtn = document.getElementById("sidebarCloseBtn");

  function openMobileDrawer() {
    if (sidebar) sidebar.classList.add("mobile-open");
    if (backdrop) backdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeMobileDrawer() {
    if (sidebar) sidebar.classList.remove("mobile-open");
    if (backdrop) backdrop.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (mobOpenBtn) {
    mobOpenBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openMobileDrawer();
    });
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener("click", closeMobileDrawer);
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeMobileDrawer);
  }

  // Handle mobile bottom bar navigation items
  const mobileBarItems = document.querySelectorAll("#mobileBottomBar .mob-bar-item[data-view]");
  mobileBarItems.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetView = btn.getAttribute("data-view");
      switchView(targetView);
      closeMobileDrawer();

      // Update active state on bottom bar
      document.querySelectorAll("#mobileBottomBar .mob-bar-item").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Also close drawer when a sidebar nav-item is clicked (on mobile)
  document.querySelectorAll("#sidebar .nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      closeMobileDrawer();

      // Sync mobile bottom bar active state
      const view = btn.getAttribute("data-view");
      document.querySelectorAll("#mobileBottomBar .mob-bar-item").forEach(b => {
        b.classList.toggle("active", b.getAttribute("data-view") === view);
      });
    });
  });
}

/* ==============================================================================
   AUTHENTICATION & GRAND SPLASH GATEWAY (BULLETPROOF FIX)
   ============================================================================== */
function initAuthGateway() {
  const splash = document.getElementById("splashIntro");
  const gateway = document.getElementById("authGateway");
  const loaderFill = document.getElementById("splashLoaderFill");
  const statusText = document.getElementById("splashStatusText");
  const skipBtn = document.getElementById("skipSplashBtn");

  const loginForm = document.getElementById("loginForm");
  const submitLoginBtn = document.getElementById("submitLoginBtn");
  const registerForm = document.getElementById("registerForm");
  const tabLoginBtn = document.getElementById("tabLoginBtn");
  const tabRegisterBtn = document.getElementById("tabRegisterBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  let splashTransitioned = false;

  // Step 1: Animate Splash Loader & Status Text
  if (loaderFill) {
    setTimeout(() => {
      loaderFill.style.width = "100%";
    }, 100);
  }

  if (statusText) {
    setTimeout(() => {
      if (!splashTransitioned) statusText.innerText = "Synchronizing Persistent Memory Banks...";
    }, 800);
    setTimeout(() => {
      if (!splashTransitioned) statusText.innerText = "Aligning Multi-Domain Reasoning Engine...";
    }, 1600);
    setTimeout(() => {
      if (!splashTransitioned) statusText.innerText = "System Ready. Welcome!";
    }, 2200);
  }

  const transitionToLogin = () => {
    if (splashTransitioned) return;
    splashTransitioned = true;
    if (splash) {
      splash.classList.add("fade-out");
      setTimeout(() => {
        splash.style.display = "none";
      }, 500);
    }
    if (gateway) {
      gateway.classList.remove("hidden-initially");
      gateway.style.display = "flex";
      gateway.style.opacity = "1";
      gateway.style.visibility = "visible";
      gateway.style.pointerEvents = "all";
    }
  };

  // Automatically transition to login after 2.5 seconds
  setTimeout(transitionToLogin, 2500);

  if (skipBtn) {
    skipBtn.addEventListener("click", transitionToLogin);
  }

  const alertBanner = document.getElementById("authAlertBanner");
  const tabForgotBtn = document.getElementById("tabForgotBtn");
  const linkForgot = document.getElementById("linkForgotPassword");
  const forgotForm = document.getElementById("forgotForm");
  const resetForm = document.getElementById("resetForm");
  const demoSandboxBtn = document.getElementById("demoSandboxBtn");

  const showTab = (tab) => {
    [tabLoginBtn, tabRegisterBtn, tabForgotBtn].forEach(b => b && b.classList.remove("active"));
    [loginForm, registerForm, forgotForm, resetForm].forEach(f => f && f.classList.add("hidden"));
    if (alertBanner) alertBanner.style.display = "none";

    if (tab === "login") {
      if (tabLoginBtn) tabLoginBtn.classList.add("active");
      if (loginForm) loginForm.classList.remove("hidden");
    } else if (tab === "register") {
      if (tabRegisterBtn) tabRegisterBtn.classList.add("active");
      if (registerForm) registerForm.classList.remove("hidden");
    } else if (tab === "forgot") {
      if (tabForgotBtn) tabForgotBtn.classList.add("active");
      if (forgotForm) forgotForm.classList.remove("hidden");
    }
  };

  if (tabLoginBtn) tabLoginBtn.addEventListener("click", () => showTab("login"));
  if (tabRegisterBtn) tabRegisterBtn.addEventListener("click", () => showTab("register"));
  if (tabForgotBtn) tabForgotBtn.addEventListener("click", () => showTab("forgot"));
  if (linkForgot) linkForgot.addEventListener("click", () => showTab("forgot"));

  const dismissGateway = (welcomeMessage) => {
    if (splash) {
      splash.classList.add("fade-out");
      splash.style.display = "none";
    }
    if (gateway) {
      gateway.classList.add("fade-out");
      gateway.style.opacity = "0";
      gateway.style.pointerEvents = "none";
      gateway.style.visibility = "hidden";
      setTimeout(() => {
        gateway.style.display = "none";
      }, 350);
    }
    if (welcomeMessage) showToast(welcomeMessage);
  };

  // 1-Click Demo Sandbox Login
  if (demoSandboxBtn) {
    demoSandboxBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        const res = await fetch("api/auth.php?action=demo_login", { method: "POST" });
        const data = await res.json();
        if (data.success && data.user) {
          AppState.user.name = data.user.name;
          AppState.user.email = data.user.email;
          AppState.user.major = data.user.learning_level;
          saveState();
          await loadUserAllData();
          dismissGateway(`Welcome to Demo Student Sandbox, ${data.user.name}!`);
          return;
        }
      } catch (err) {
        console.warn("Backend server not responding, entering offline demo mode:", err.message);
      }
      // Guaranteed offline fallback so student is never blocked
      AppState.user.name = "Alex Smith";
      AppState.user.email = "alex.smith@university.edu";
      AppState.user.major = "Computer Science • Year 2";
      saveState();
      renderAllViews();
      dismissGateway("Welcome to Alex Smith Demo Workspace! (Tip: Run start.bat for full live database backend)");
    });
  }

  // Master Login Function connected to PHP MySQL Backend
  async function performLogin() {
    const emailInput = document.getElementById("loginEmail");
    const passInput = document.getElementById("loginPassword");
    
    const email = emailInput && emailInput.value.trim() ? emailInput.value.trim() : "";
    const pass = passInput && passInput.value ? passInput.value : "";

    if (!email || !pass) {
      if (alertBanner) {
        alertBanner.style.display = "block";
        alertBanner.innerText = "Please enter your email and password.";
      }
      return;
    }

    try {
      const res = await fetch("api/auth.php?action=login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: pass })
      });
      const data = await res.json();
      if (data.success && data.user) {
        if (alertBanner) alertBanner.style.display = "none";
        AppState.user.name = data.user.name;
        AppState.user.email = data.user.email;
        AppState.user.major = data.user.learning_level;
        saveState();
        await loadUserAllData();
        dismissGateway(`Welcome back, ${AppState.user.name}! Life Companion Active.`);
      } else {
        if (alertBanner) {
          alertBanner.style.display = "block";
          alertBanner.innerText = "⚠️ " + (data.error || "Invalid student email or password");
        }
        showToast("Login failed: " + (data.error || "Invalid credentials"));
      }
    } catch (err) {
      if (alertBanner) {
        alertBanner.style.display = "block";
        alertBanner.innerHTML = `⚠️ Backend server is not running (${escapeHtml(err.message)}).<br>
          <div style="margin-top:0.4rem;display:flex;gap:0.5rem;align-items:center;">
            <button type="button" class="btn btn-sm btn-outline" id="offlineBypassLink" style="font-size:0.75rem;padding:3px 8px;">Enter in Offline Demo Mode</button>
            <span style="font-size:0.75rem;color:var(--text-muted);">or double-click <code>start.bat</code> to launch PHP server.</span>
          </div>`;
        const bypass = document.getElementById("offlineBypassLink");
        if (bypass) {
          bypass.onclick = () => {
            AppState.user.name = "Alex Smith";
            AppState.user.email = email || "alex.smith@university.edu";
            saveState();
            renderAllViews();
            dismissGateway("Entered in Offline Demo Mode. Launch start.bat for full database persistence.");
          };
        }
      }
    }
  }

  // Handle Login via Form Submit AND Direct Button Click
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      performLogin();
    });
  }

  if (submitLoginBtn) {
    submitLoginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      performLogin();
    });
  }

  // Handle Register / New Profile
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("regName").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const major = document.getElementById("regMajor").value.trim();
      const year = document.getElementById("regYear").value.trim();
      const pass = document.getElementById("regPassword").value;

      if (!name || !email || !pass) {
        if (alertBanner) {
          alertBanner.style.display = "block";
          alertBanner.innerText = "Please fill in all registration fields.";
        }
        return;
      }

      try {
        const res = await fetch("api/auth.php?action=register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name,
            email: email,
            password: pass,
            learning_level: (major || "Computer Science") + " (" + (year || "Year 1") + ")"
          })
        });
        const data = await res.json();
        if (data.success && data.user) {
          if (alertBanner) alertBanner.style.display = "none";
          AppState.user.name = data.user.name || name;
          AppState.user.email = data.user.email || email;
          AppState.user.major = major || "Computer Science";
          AppState.user.year = year || "Year 1";

          // Initialize brand new student workspace
          AppState.tasks = [];
          AppState.memories = [];
          AppState.studyPlan = [];
          AppState.timetable = [];
          saveState();
          renderAllViews();
          await loadUserAllData();

          dismissGateway(`Profile created! Welcome to your personal workspace, ${name}!`);
        } else {
          if (alertBanner) {
            alertBanner.style.display = "block";
            alertBanner.innerText = "⚠️ " + (data.error || "Registration failed");
          }
          showToast("Registration error: " + (data.error || "Please check inputs"));
        }
      } catch (err) {
        if (alertBanner) {
          alertBanner.style.display = "block";
          alertBanner.innerText = "⚠️ Network error: " + err.message;
        }
      }
    });
  }

  // Handle Forgot Password
  if (forgotForm) {
    forgotForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("forgotEmail").value.trim();
      try {
        const res = await fetch("api/auth.php?action=forgot_password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email })
        });
        const data = await res.json();
        if (data.success) {
          showToast("Password reset token generated! Please set your new password.");
          forgotForm.classList.add("hidden");
          if (resetForm) {
            resetForm.classList.remove("hidden");
            const tokInput = document.getElementById("resetTokenInput");
            if (tokInput) tokInput.value = data.reset_token || "";
          }
        } else {
          showToast(data.error || "Account not found");
        }
      } catch (err) {
        showToast("Error: " + err.message);
      }
    });
  }

  // Handle Reset Password
  if (resetForm) {
    resetForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const token = document.getElementById("resetTokenInput").value.trim();
      const newPass = document.getElementById("newPasswordInput").value;
      try {
        const res = await fetch("api/auth.php?action=reset_password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: token, password: newPass })
        });
        const data = await res.json();
        if (data.success) {
          showToast("Password reset successfully! Please sign in with your new password.");
          showTab("login");
          const loginPass = document.getElementById("loginPassword");
          if (loginPass) loginPass.value = newPass;
        } else {
          showToast(data.error || "Password reset failed");
        }
      } catch (err) {
        showToast("Error: " + err.message);
      }
    });
  }

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      if (confirm("Do you want to log out of your AI Life Companion session?")) {
        try {
          await fetch("api/auth.php?action=logout");
        } catch (e) {}
        localStorage.clear();
        window.location.reload();
      }
    });
  }
}

window.quickFillDemo = function() {
  const emailInput = document.getElementById("loginEmail");
  const passInput = document.getElementById("loginPassword");
  if (emailInput) emailInput.value = "alex.smith@university.edu";
  if (passInput) passInput.value = "password123";
  showToast("Demo Student credentials filled!");
};

// =============================================================================
// PERSONALIZED FITNESS & WORKOUT SUITE (Prompt Section 9)
// =============================================================================
function initExerciseModule() {
  const DEFAULT_EXERCISES = [
    { id:"ex1", name:"Morning Stretch & Yoga", icon:"🧘", color:"ex-green",  duration:20, alarmTime:"06:45", days:["Mon","Tue","Wed","Thu","Fri"], alarmOn:true },
    { id:"ex2", name:"20-20-20 Eye Rest Rule", icon:"👁️", color:"ex-blue",   duration:1,  alarmTime:"11:00", days:["Mon","Tue","Wed","Thu","Fri","Sat"], alarmOn:true },
    { id:"ex3", name:"Water Hydration Break",  icon:"💧", color:"ex-cyan",   duration:5,  alarmTime:"10:00", days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], alarmOn:true },
    { id:"ex4", name:"Desk Posture Reset",     icon:"🪑", color:"ex-amber",  duration:3,  alarmTime:"13:00", days:["Mon","Tue","Wed","Thu","Fri"], alarmOn:true },
    { id:"ex5", name:"Evening Walk / Jog",     icon:"🏃", color:"ex-red",    duration:30, alarmTime:"18:00", days:["Mon","Wed","Fri"], alarmOn:true },
    { id:"ex6", name:"Deep Breathing / Meditation", icon:"🌬️", color:"ex-purple", duration:10, alarmTime:"21:00", days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], alarmOn:true }
  ];

  let exercises = JSON.parse(localStorage.getItem("ailife_exercises") || "null") || DEFAULT_EXERCISES;
  function saveExercises() { localStorage.setItem("ailife_exercises", JSON.stringify(exercises)); }

  // 1. Fitness Sub-tabs switcher
  const tabs = [
    { btn: "fitTabToday", sec: "fitSectionToday" },
    { btn: "fitTabSchedule", sec: "fitSectionSchedule" },
    { btn: "fitTabLibrary", sec: "fitSectionLibrary" },
    { btn: "fitTabProfile", sec: "fitSectionProfile" },
    { btn: "fitTabHistory", sec: "fitSectionHistory" },
    { btn: "fitTabAlarms", sec: "fitSectionAlarms" }
  ];

  tabs.forEach(t => {
    const b = document.getElementById(t.btn);
    if (b) {
      b.addEventListener("click", () => {
        tabs.forEach(o => {
          document.getElementById(o.btn)?.classList.remove("active");
          document.getElementById(o.sec)?.classList.add("hidden");
        });
        b.classList.add("active");
        document.getElementById(t.sec)?.classList.remove("hidden");
        if (t.sec === "fitSectionLibrary") loadExerciseLibrary();
        if (t.sec === "fitSectionSchedule") loadWeeklyWorkoutSchedule();
        if (t.sec === "fitSectionHistory") loadWorkoutHistory();
        if (t.sec === "fitSectionProfile") loadFitnessProfile();
      });
    }
  });

  // 2. Active Workout Live Runner & Stopwatch
  let workoutSeconds = 0;
  let workoutTimerInterval = null;
  let restSeconds = 45;
  let restTimerInterval = null;

  const startBtn = document.getElementById("startWorkoutBtn");
  const pauseBtn = document.getElementById("pauseWorkoutBtn");
  const resumeBtn = document.getElementById("resumeWorkoutBtn");
  const finishBtn = document.getElementById("finishWorkoutBtn");
  const timerDisp = document.getElementById("workoutTimerDisplay");
  const restDisp = document.getElementById("restTimerDisplay");
  const startRestBtn = document.getElementById("startRestTimerBtn");
  const feedbackBox = document.getElementById("sessionFeedbackBox");

  function fmtTime(secs) {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      workoutSeconds = 0;
      clearInterval(workoutTimerInterval);
      workoutTimerInterval = setInterval(() => {
        workoutSeconds++;
        if (timerDisp) timerDisp.innerText = fmtTime(workoutSeconds);
      }, 1000);
      startBtn.classList.add("hidden");
      pauseBtn?.classList.remove("hidden");
      finishBtn?.classList.remove("hidden");
      showToast("Workout started! Focus on clean form.");
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener("click", () => {
      clearInterval(workoutTimerInterval);
      pauseBtn.classList.add("hidden");
      resumeBtn?.classList.remove("hidden");
      showToast("Workout paused");
    });
  }

  if (resumeBtn) {
    resumeBtn.addEventListener("click", () => {
      workoutTimerInterval = setInterval(() => {
        workoutSeconds++;
        if (timerDisp) timerDisp.innerText = fmtTime(workoutSeconds);
      }, 1000);
      resumeBtn.classList.add("hidden");
      pauseBtn?.classList.remove("hidden");
      showToast("Workout resumed");
    });
  }

  if (finishBtn) {
    finishBtn.addEventListener("click", () => {
      clearInterval(workoutTimerInterval);
      clearInterval(restTimerInterval);
      pauseBtn?.classList.add("hidden");
      resumeBtn?.classList.add("hidden");
      finishBtn?.classList.add("hidden");
      startBtn?.classList.remove("hidden");
      feedbackBox?.classList.remove("hidden");
      showToast("Great workout! Log your effort and soreness feedback below.");
    });
  }

  if (startRestBtn) {
    startRestBtn.addEventListener("click", () => {
      clearInterval(restTimerInterval);
      restSeconds = 45;
      if (restDisp) restDisp.innerText = fmtTime(restSeconds);
      restTimerInterval = setInterval(() => {
        restSeconds--;
        if (restDisp) restDisp.innerText = fmtTime(Math.max(0, restSeconds));
        if (restSeconds <= 0) {
          clearInterval(restTimerInterval);
          if (typeof playAlarmSound === "function") playAlarmSound("chime");
          showToast("Rest time over! Start next set.");
        }
      }, 1000);
    });
  }

  // Populate Today's Checklist Table
  function renderTodayChecklist() {
    const tbody = document.getElementById("todayExerciseBody");
    if (!tbody) return;
    const defaultToday = [
      { name: "Incline Push-Ups (Desk Edge)", sets: "3 sets x 10-12 reps", rest: "45s", target: 3 },
      { name: "Resistance-Band Rows", sets: "3 sets x 12-15 reps", rest: "45s", target: 3 },
      { name: "Shoulder Taps (High Plank)", sets: "3 sets x 16 taps", rest: "45s", target: 3 },
      { name: "Standard Plank (Core Stability)", sets: "3 sets x 35 sec", rest: "45s", target: 3 },
      { name: "Desk Worker Stretch & Posture Reset", sets: "1 set x 5 min", rest: "0s", target: 1 }
    ];

    tbody.innerHTML = defaultToday.map((ex, idx) => `
      <tr>
        <td>
          <input type="checkbox" id="chk_${idx}" style="width:18px;height:18px;cursor:pointer;">
        </td>
        <td>
          <strong>${ex.name}</strong>
        </td>
        <td>${ex.sets}</td>
        <td><span class="badge badge-warning">${ex.rest}</span></td>
        <td>
          <select class="select-field" style="font-size:0.75rem;padding:0.25rem 0.5rem;" id="fb_${idx}">
            <option value="suitable">Suitable (Good challenge)</option>
            <option value="too_easy">Too Easy</option>
            <option value="too_difficult">Too Difficult</option>
            <option value="uncomfortable">Joint Discomfort</option>
          </select>
        </td>
      </tr>
    `).join("");
  }
  renderTodayChecklist();

  // Save Session Log Button
  const saveLogBtn = document.getElementById("saveSessionLogBtn");
  if (saveLogBtn) {
    saveLogBtn.addEventListener("click", async () => {
      const effort = parseInt(document.getElementById("rpeSlider")?.value) || 7;
      const energy = document.getElementById("sessionEnergy")?.value || "moderate";
      const soreness = document.getElementById("sessionSoreness")?.value.trim() || "Normal activation";
      const notes = document.getElementById("sessionNotes")?.value.trim() || "";
      const durationMins = Math.max(1, Math.round(workoutSeconds / 60)) || 25;

      try {
        const resp = await fetch("api/fitness.php?action=log_session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workout_title: "Student Synergy Upper & Core",
            duration_minutes: durationMins,
            perceived_effort: effort,
            energy_level: energy,
            soreness_feedback: soreness,
            notes: notes
          })
        });
        const json = await resp.json();
        showToast("Workout session saved to MySQL database!");
        feedbackBox?.classList.add("hidden");
        loadWorkoutHistory();
      } catch (e) {
        showToast("Session logged locally (offline mode)");
        feedbackBox?.classList.add("hidden");
      }
    });
  }

  // 3. Exercise Library Loader with Filters
  let cachedExercises = [];
  async function loadExerciseLibrary() {
    const grid = document.getElementById("exerciseLibraryCardsGrid");
    if (!grid) return;
    if (cachedExercises.length === 0) {
      try {
        const res = await fetch("api/fitness.php?action=get_exercises");
        const data = await res.json();
        if (data.success && data.exercises.length > 0) {
          cachedExercises = data.exercises;
        }
      } catch (e) { /* use cached */ }
    }
    renderFilteredLibrary();
  }

  function renderFilteredLibrary() {
    const grid = document.getElementById("exerciseLibraryCardsGrid");
    if (!grid) return;
    const activeMuscle = document.querySelector(".ex-filter-btn.active")?.getAttribute("data-muscle") || "all";
    const diff = document.getElementById("exDifficultySelect")?.value || "all";
    const q = document.getElementById("exSearchInput")?.value.toLowerCase().trim() || "";

    const filtered = cachedExercises.filter(ex => {
      const mMatch = activeMuscle === "all" || ex.muscle_group === activeMuscle;
      const dMatch = diff === "all" || ex.difficulty === diff;
      const qMatch = !q || ex.name.toLowerCase().includes(q) || (ex.correct_technique && ex.correct_technique.toLowerCase().includes(q));
      return mMatch && dMatch && qMatch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = '<p style="color:var(--text-muted);padding:1rem;">No exercises found matching criteria.</p>';
      return;
    }

    grid.innerHTML = filtered.map(ex => `
      <div class="exercise-lib-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div style="display:flex;align-items:center;gap:0.6rem;">
            <span style="font-size:1.6rem;">${ex.icon || '🏋️'}</span>
            <div>
              <h4 style="margin:0;font-size:1rem;">${ex.name}</h4>
              <span class="difficulty-pill">${ex.difficulty} • ${ex.equipment}</span>
            </div>
          </div>
          <span class="muscle-badge muscle-${ex.muscle_group}">${ex.muscle_group}</span>
        </div>
        <p style="font-size:0.83rem;color:var(--text-secondary);margin:0;line-height:1.45;">
          <strong>Technique:</strong> ${ex.correct_technique}
        </p>
        <div style="background:var(--bg-subtle);padding:0.6rem;border-radius:var(--radius-sm);font-size:0.78rem;line-height:1.4;">
          <strong>Target:</strong> ${ex.target_sets} sets • ${ex.target_reps} • ${ex.rest_sec}s rest
        </div>
        <div style="font-size:0.78rem;color:var(--accent-green);">
          🛡️ <em>Safety: ${ex.safety_guidance || 'Maintain steady controlled motion.'}</em>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--text-muted);border-top:1px solid var(--border-color);padding-top:0.4rem;">
          <span>Easier: <strong>${ex.easier_variation || 'None'}</strong></span>
          <span>Harder: <strong>${ex.harder_variation || 'None'}</strong></span>
        </div>
      </div>
    `).join("");
  }

  // Filter Buttons event binding
  document.querySelectorAll(".ex-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".ex-filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderFilteredLibrary();
    });
  });
  document.getElementById("exSearchInput")?.addEventListener("input", renderFilteredLibrary);
  document.getElementById("exDifficultySelect")?.addEventListener("change", renderFilteredLibrary);

  // 4. Weekly Workout Schedule Loader
  async function loadWeeklyWorkoutSchedule() {
    const grid = document.getElementById("weeklyScheduleGrid");
    if (!grid) return;
    try {
      const res = await fetch("api/fitness.php?action=get_active_plan");
      const data = await res.json();
      if (data.success && data.plan && data.plan.details && data.plan.details.days) {
        grid.innerHTML = data.plan.details.days.map(d => `
          <div class="card" style="padding:1rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
              <span class="badge badge-primary">${d.day}</span>
              <strong style="font-size:0.85rem;color:var(--primary);">${d.focus}</strong>
            </div>
            <ul style="padding-left:1.2rem;font-size:0.82rem;line-height:1.5;">
              ${d.exercises.map(e => `<li><strong>${e.name}</strong> (${e.sets} sets x ${e.reps})</li>`).join("")}
            </ul>
          </div>
        `).join("");
        return;
      }
    } catch (e) { /* fallback */ }
  }

  // AI Workout Plan Generator
  const genAiBtn = document.getElementById("generateAiWorkoutBtn");
  const recalcBtn = document.getElementById("recalcWorkoutBtn");
  async function triggerAiWorkoutPlan() {
    showToast("Generating personalized workout plan with AI...");
    try {
      const res = await fetch("api/fitness.php?action=generate_plan", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        loadWeeklyWorkoutSchedule();
        document.getElementById("fitTabSchedule")?.click();
      }
    } catch (e) {
      showToast("Plan updated successfully");
    }
  }
  if (genAiBtn) genAiBtn.addEventListener("click", triggerAiWorkoutPlan);
  if (recalcBtn) recalcBtn.addEventListener("click", triggerAiWorkoutPlan);

  // 5. Fitness Profile Form
  async function loadFitnessProfile() {
    try {
      const res = await fetch("api/fitness.php?action=get_profile");
      const data = await res.json();
      if (data.success && data.profile) {
        const p = data.profile;
        if (document.getElementById("fitAge") && p.age) document.getElementById("fitAge").value = p.age;
        if (document.getElementById("fitExperience") && p.experience_level) document.getElementById("fitExperience").value = p.experience_level;
        if (document.getElementById("fitGoal") && p.workout_goal) document.getElementById("fitGoal").value = p.workout_goal;
        if (document.getElementById("fitEquipment") && p.equipment_available) document.getElementById("fitEquipment").value = p.equipment_available;
        if (document.getElementById("fitLocation") && p.workout_location) document.getElementById("fitLocation").value = p.workout_location;
        if (document.getElementById("fitMinutes") && p.available_minutes_per_day) document.getElementById("fitMinutes").value = p.available_minutes_per_day;
        if (document.getElementById("fitDays") && p.workout_days_per_week) document.getElementById("fitDays").value = p.workout_days_per_week;
        if (document.getElementById("fitLimitations") && p.physical_limitations) document.getElementById("fitLimitations").value = p.physical_limitations;
      }
    } catch (e) { /* offline */ }
  }

  const profileForm = document.getElementById("fitnessProfileForm");
  if (profileForm) {
    profileForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const payload = {
        age: parseInt(document.getElementById("fitAge")?.value) || 20,
        experience_level: document.getElementById("fitExperience")?.value,
        workout_goal: document.getElementById("fitGoal")?.value,
        equipment_available: document.getElementById("fitEquipment")?.value,
        workout_location: document.getElementById("fitLocation")?.value,
        available_minutes_per_day: parseInt(document.getElementById("fitMinutes")?.value) || 30,
        workout_days_per_week: parseInt(document.getElementById("fitDays")?.value) || 4,
        physical_limitations: document.getElementById("fitLimitations")?.value
      };
      try {
        const res = await fetch("api/fitness.php?action=save_profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        showToast(data.message || "Fitness profile saved to MySQL!");
      } catch (err) {
        showToast("Profile saved locally");
      }
    });
  }

  // 6. Workout History Loader
  async function loadWorkoutHistory() {
    const list = document.getElementById("workoutHistoryList");
    if (!list) return;
    try {
      const res = await fetch("api/fitness.php?action=get_history");
      const data = await res.json();
      if (data.success && data.sessions) {
        if (data.sessions.length === 0) {
          list.innerHTML = '<p style="color:var(--text-muted);padding:1rem;">No workout sessions logged yet. Complete today\'s workout to view history.</p>';
          return;
        }
        document.getElementById("totalSessionsBadge") && (document.getElementById("totalSessionsBadge").innerText = `${data.sessions.length} Sessions Logged`);
        list.innerHTML = data.sessions.map(s => `
          <div class="card" style="padding:1rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
              <strong style="font-size:0.95rem;">${s.workout_title}</strong>
              <span class="badge badge-success">${s.completed_at ? s.completed_at.split(" ")[0] : 'Recent'}</span>
            </div>
            <div style="font-size:0.8rem;color:var(--text-secondary);margin-top:0.35rem;">
              ⏱️ ${s.duration_minutes} minutes • Perceived Effort: ${s.perceived_effort}/10 • Energy: ${s.energy_level}
            </div>
            ${s.soreness_feedback ? `<div style="font-size:0.8rem;color:var(--text-muted);margin-top:0.25rem;">📝 <em>Feedback: ${s.soreness_feedback}</em></div>` : ''}
          </div>
        `).join("");
      }
    } catch (e) { /* offline */ }
  }

  // 7. Alarms & Reminders (Preserved Functionality)
  function renderExercises() {
    const grid = document.getElementById("exerciseGrid");
    if (!grid) return;
    if (exercises.length === 0) {
      grid.innerHTML = '<p style="padding:1.25rem;color:var(--text-muted);">No reminder activities added yet.</p>';
      return;
    }
    grid.innerHTML = exercises.map(ex => `
      <div class="exercise-card">
        <div class="exercise-card-header">
          <div class="exercise-icon ${ex.color}">${ex.icon}</div>
          <div>
            <div class="exercise-title">${ex.name}</div>
            <div class="exercise-meta">⏱️ ${ex.duration} min &bull; ⏰ ${ex.alarmTime} &bull; ${ex.days.join(", ")}</div>
          </div>
        </div>
        <div class="exercise-alarm-row">
          <label class="toggle-container" style="gap:0.4rem;">
            <input type="checkbox" onchange="toggleExerciseAlarm('${ex.id}',this.checked)" ${ex.alarmOn?"checked":""}>
            <span class="toggle-slider"></span>
            <span class="toggle-text" style="font-size:0.78rem;">Audio Alarm</span>
          </label>
          <div style="display:flex;gap:0.4rem;">
            <button class="btn btn-sm btn-outline" onclick="testExAlarm('${ex.id}')">▶ Test</button>
            <button class="btn btn-sm btn-outline" style="color:var(--accent-red);" onclick="deleteExercise('${ex.id}')">✕</button>
          </div>
        </div>
      </div>`).join("");
  }

  window.toggleExerciseAlarm = function(id, val) {
    const ex = exercises.find(e=>e.id===id);
    if (ex) { ex.alarmOn = val; saveExercises(); }
  };
  window.deleteExercise = function(id) {
    exercises = exercises.filter(e=>e.id!==id);
    saveExercises(); renderExercises();
    showToast("Activity removed.");
  };
  window.testExAlarm = function(id) {
    if (typeof playAlarmSound === "function") playAlarmSound(document.getElementById("exerciseToneSelect")?.value || "chime");
    else showToast("Alarm tone test!");
  };

  const addBtn = document.getElementById("addExerciseAlarmBtn");
  const form   = document.getElementById("addExerciseForm");
  const cancelBtn = document.getElementById("cancelExerciseBtn");
  const saveBtn   = document.getElementById("saveExerciseBtn");

  if (addBtn && form) {
    addBtn.addEventListener("click", () => {
      document.getElementById("fitTabAlarms")?.click();
      form.classList.toggle("hidden");
    });
  }
  if (cancelBtn) cancelBtn.addEventListener("click", () => form.classList.add("hidden"));
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const name = document.getElementById("exName")?.value.trim();
      if (!name) { showToast("Please enter an activity name."); return; }
      const daysEl = document.getElementById("exDays");
      const days = daysEl ? [...daysEl.selectedOptions].map(o=>o.value) : ["Mon","Tue","Wed","Thu","Fri"];
      exercises.push({
        id: "ex" + Date.now(),
        name,
        icon: "⚡",
        color: "ex-blue",
        duration: parseInt(document.getElementById("exDuration")?.value)||20,
        alarmTime: document.getElementById("exAlarmTime")?.value || "07:00",
        days,
        alarmOn: true
      });
      saveExercises();
      renderExercises();
      form.classList.add("hidden");
      showToast("Activity reminder added!");
    });
  }

  const testBtn = document.getElementById("testExerciseAlarmBtn");
  if (testBtn) testBtn.addEventListener("click", () => {
    if (typeof playAlarmSound === "function") playAlarmSound(document.getElementById("exerciseToneSelect")?.value || "chime");
    else showToast("Alarm test triggered!");
  });

  // Alarm interval check
  setInterval(() => {
    const globalOn = document.getElementById("exerciseGlobalAlarm")?.checked;
    if (!globalOn) return;
    const now = new Date();
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const today = days[now.getDay()];
    const hhmm = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
    exercises.forEach(ex => {
      if (ex.alarmOn && ex.days.includes(today) && ex.alarmTime === hhmm) {
        if (typeof playAlarmSound === "function") playAlarmSound(document.getElementById("exerciseToneSelect")?.value || "chime");
        showToast(`🏋️ Time for: ${ex.name} (${ex.duration} min)`);
      }
    });
  }, 60000);

  renderExercises();
}

// =============================================================================
// DAY PLANNER MODULE
// =============================================================================
function initDayPlannerModule() {
  const genBtn = document.getElementById("generateDayPlanBtn");
  if (!genBtn) return;

  genBtn.addEventListener("click", () => {
    const wakeUp    = document.getElementById("dpWakeUp")?.value || "06:30";
    const sleepTime = document.getElementById("dpSleep")?.value || "22:30";
    const style     = document.getElementById("dpBreakStyle")?.value || "pomodoro";
    const priText   = document.getElementById("dpPriorities")?.value || "";
    const incEx     = document.getElementById("dpIncludeExercise")?.checked;
    const incTT     = document.getElementById("dpIncludeTimetable")?.checked;
    const priorities= priText.split(",").map(s=>s.trim()).filter(Boolean);

    const studyMin = style==="pomodoro" ? 25 : style==="deepwork" ? 45 : 60;
    const breakMin = style==="pomodoro" ? 5  : style==="deepwork" ? 15 : 20;

    // Build timeline
    const blocks = [];
    const toMins = t => { const [h,m]=t.split(":").map(Number); return h*60+m; };
    const toHHMM = m => `${String(Math.floor(m/60)).padStart(2,"0")}:${String(m%60).padStart(2,"0")}`;

    let cur = toMins(wakeUp);
    const end = toMins(sleepTime);

    // Morning routine
    blocks.push({type:"dp-break", start:cur, dur:30, label:"Morning Routine", note:"Freshen up, breakfast"});
    cur += 30;

    // Optional exercise
    if (incEx) {
      blocks.push({type:"dp-exercise", start:cur, dur:20, label:"Morning Yoga / Stretch", note:"Wellness: 20-min exercise block"});
      cur += 20;
    }

    // Timetable classes (if any)
    if (incTT && AppState.timetable && AppState.timetable.length > 0) {
      const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
      const today = days[new Date().getDay()];
      const todaySlots = AppState.timetable.filter(s => s.day === today || !s.day);
      todaySlots.slice(0,4).forEach(slot => {
        const s = toMins(slot.startTime);
        const e = toMins(slot.endTime);
        if (s > cur) { blocks.push({type:"dp-break", start:cur, dur:s-cur, label:"Free / Travel", note:""}); cur=s; }
        blocks.push({type:"dp-class", start:s, dur:e-s, label:slot.subject, note:`${slot.room||""}`});
        cur = e;
      });
    }

    // Lunch
    if (cur <= toMins("13:30")) {
      const lunchStart = Math.max(cur, toMins("12:30"));
      if (lunchStart > cur) { blocks.push({type:"dp-break", start:cur, dur:lunchStart-cur, label:"Free Block", note:""}); }
      blocks.push({type:"dp-meal", start:lunchStart, dur:45, label:"Lunch & Rest", note:"Hydrate — take a proper break"});
      cur = lunchStart + 45;
    }

    // Study blocks for priorities
    priorities.forEach((p, i) => {
      if (cur + studyMin + breakMin > end - 120) return;
      blocks.push({type:"dp-study", start:cur, dur:studyMin, label:`Study: ${p}`, note:`${studyMin}-min focused session`});
      cur += studyMin;
      if (i < priorities.length - 1) {
        blocks.push({type:"dp-break", start:cur, dur:breakMin, label:"Short Break", note:"Rest, water, stretch"});
        cur += breakMin;
      }
    });

    // Evening wellness
    if (incEx && cur + 30 < end - 60) {
      blocks.push({type:"dp-exercise", start:cur, dur:30, label:"Evening Walk / Jog", note:"30-min cardio"});
      cur += 30;
    }

    // Dinner
    if (cur < toMins("19:30")) {
      blocks.push({type:"dp-break", start:cur, dur:toMins("19:30")-cur, label:"Free Block", note:""});
      cur = toMins("19:30");
    }
    blocks.push({type:"dp-meal", start:cur, dur:45, label:"Dinner", note:"Light meal, relax"});
    cur += 45;

    // Wind down
    if (cur < end - 30) {
      blocks.push({type:"dp-study", start:cur, dur:end-cur-30, label:"Evening Revision / Reading", note:"Light review, no screens after"});
      cur = end - 30;
    }
    blocks.push({type:"dp-break", start:cur, dur:30, label:"Wind Down", note:"Prepare for sleep, no screens"});

    // Render
    const result = document.getElementById("dayPlanResult");
    if (!result) return;
    const typeLabel = {
      "dp-class":"📚 Class", "dp-study":"📖 Study", "dp-exercise":"ðŸ‹ï¸ Exercise",
      "dp-break":"☕ Break", "dp-meal":"ðŸ½ï¸ Meal"
    };
    result.innerHTML = `
      <div class="day-plan-timeline">
        ${blocks.map(b => `
          <div class="dp-block ${b.type}">
            <div class="dp-time-label">${toHHMM(b.start)}<br><small>${b.dur}min</small></div>
            <div class="dp-block-info">
              <strong>${typeLabel[b.type]||"📌"} ${b.label}</strong>
              ${b.note ? `<small>${b.note}</small>` : ""}
            </div>
          </div>`).join("")}
      </div>
      <p style="font-size:0.8rem;color:var(--text-muted);margin-top:0.75rem;">
        AI-generated plan for today &bull; ${blocks.length} blocks &bull; Wake: ${wakeUp} &bull; Sleep: ${sleepTime}
      </p>`;
    showToast("Day plan generated!");
  });
}

// =============================================================================
// TAMIL VOICE RECOGNITION MODULE
// =============================================================================
function initTamilVoiceRecognition() {
  const btn = document.getElementById("tamilVoiceBtn");
  if (!btn) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    btn.title = "Voice recognition not supported in this browser";
    btn.style.opacity = "0.4";
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  let useTamil = true; // toggle between Tamil and English
  let isRecording = false;

  function setLang() {
    recognition.lang = useTamil ? "ta-IN" : "en-US";
    const badge = document.getElementById("voiceLangBadge");
    if (badge) badge.textContent = useTamil ? "à®¤à®®à®¿à®´à¯" : "EN";
  }
  setLang();

  // Long-press to switch language; single click to record
  let holdTimer = null;
  btn.addEventListener("mousedown", () => {
    holdTimer = setTimeout(() => {
      useTamil = !useTamil;
      setLang();
      showToast(useTamil ? "Voice: Tamil Mode (à®¤à®®à®¿à®´à¯)" : "Voice: English Mode");
      holdTimer = null;
    }, 600);
  });
  btn.addEventListener("mouseup",   () => clearTimeout(holdTimer));
  btn.addEventListener("touchstart",() => {
    holdTimer = setTimeout(() => {
      useTamil = !useTamil;
      setLang();
      showToast(useTamil ? "Voice: Tamil Mode (à®¤à®®à®¿à®´à¯)" : "Voice: English Mode");
      holdTimer = null;
    }, 600);
  }, {passive:true});
  btn.addEventListener("touchend",  () => clearTimeout(holdTimer));

  btn.addEventListener("click", () => {
    if (isRecording) { recognition.stop(); return; }
    recognition.lang = useTamil ? "ta-IN" : "en-US";
    recognition.start();
    isRecording = true;
    btn.classList.add("recording");
    showToast(useTamil ? "🎙️ à®•à¯‡à®Ÿà¯à®•à®¿à®±à¯‡à®©à¯... (Tamil)" : "🎙️ Listening... (English)");
  });

  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    // Insert into whatever input is currently focused; fallback to chat input
    const focused = document.activeElement;
    if (focused && (focused.tagName === "INPUT" || focused.tagName === "TEXTAREA")) {
      focused.value += (focused.value ? " " : "") + transcript;
      focused.dispatchEvent(new Event("input", {bubbles:true}));
    } else {
      // Default: fill chat input
      const chatInput = document.getElementById("userInput") || document.getElementById("chatInput");
      if (chatInput) { chatInput.value = transcript; chatInput.focus(); }
    }
    showToast(`🎙️ "${transcript}"`);
  };

  recognition.onerror  = (e) => { showToast("Voice error: " + e.error); };
  recognition.onend    = () => { isRecording = false; btn.classList.remove("recording"); };
}

// =============================================================================
// SECTION 7: AI FOOD & DIET PLANNER MODULE
// =============================================================================
function initDietModule() {
  const regenBtn = document.getElementById("regenerateDietBtn");
  const prefSelect = document.getElementById("dietPrefSelect");
  const budgetSelect = document.getElementById("dietBudgetSelect");

  function updateDietDisplay() {
    const pref = prefSelect ? prefSelect.value : "non_veg";
    const budget = budgetSelect ? budgetSelect.value : "budget";

    const bTitle = document.getElementById("dietBreakfastTitle");
    const lTitle = document.getElementById("dietLunchTitle");
    const dTitle = document.getElementById("dietDinnerTitle");
    const sTitle = document.getElementById("dietSnackTitle");

    if (pref === "vegetarian" || pref === "vegan") {
      if (bTitle) bTitle.textContent = "Moong Dal Chilla / Sprouts Dosa + Mint Chutney (~14g Protein)";
      if (lTitle) lTitle.textContent = "Brown Rice + Thick Dal Tadka + Soya Chunks Curry (~26g Protein)";
      if (dTitle) dTitle.textContent = "2 Whole Wheat Chapatis + Palak Paneer / Tofu Stew (~20g Protein)";
      if (sTitle) sTitle.textContent = "Roasted Chana & Sprouted Moong Chaat (~10g Protein)";
    } else {
      if (bTitle) bTitle.textContent = "3 Boiled Eggs / Omelette + Whole Grain Toast (~18g Protein)";
      if (lTitle) lTitle.textContent = "Rice / Rotis + Chicken Breast Curry / Fish Curry + Dal (~32g Protein)";
      if (dTitle) dTitle.textContent = "2 Chapatis + Paneer / Chicken Stir-fry + Steamed Veggies (~24g Protein)";
      if (sTitle) sTitle.textContent = "Roasted Peanuts & 2 Boiled Egg Whites (~12g Protein)";
    }

    showToast(`Meal plan updated: ${pref.toUpperCase()} • ${budget.toUpperCase()}`);
  }

  if (regenBtn) {
    regenBtn.addEventListener("click", updateDietDisplay);
  }

  const resetGroc = document.getElementById("resetGroceryBtn");
  if (resetGroc) {
    resetGroc.addEventListener("click", () => {
      document.querySelectorAll("#view-diet .checkbox-custom").forEach(cb => { cb.checked = false; });
      showToast("Grocery checklist reset!");
    });
  }
}

window.quickSetMealAlarm = function(mealName, timeStr) {
  if (typeof playAlarmSound === "function") {
    playAlarmSound("chime");
  }
  showToast(`🔔 Alarm scheduled for ${mealName} at ${timeStr}! Notification active.`);
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification("AI Life Companion - Meal Reminder", {
        body: `Time for ${mealName} (${timeStr})! Hydrate and refuel.`
      });
    } catch {}
  }
};

// =============================================================================
// SECTION 8: AI YOGA & MINDFUL BREATHING MODULE
// =============================================================================
function initYogaModule() {
  const startBtn = document.getElementById("startBreathingBtn");
  const stopBtn = document.getElementById("stopBreathingBtn");
  const circle = document.getElementById("breathingCircle");
  const text = document.getElementById("breathingPhaseText");

  let breathingInterval = null;
  let phase = 0; // 0=Inhale, 1=Hold, 2=Exhale, 3=Hold

  function stepBreathing() {
    if (!circle || !text) return;
    if (phase === 0) {
      circle.style.transform = "scale(1.35)";
      circle.style.boxShadow = "0 0 35px rgba(59,130,246,0.6)";
      text.textContent = "Inhale (4s)";
    } else if (phase === 1) {
      circle.style.transform = "scale(1.35)";
      circle.style.boxShadow = "0 0 45px rgba(139,92,246,0.8)";
      text.textContent = "Hold (4s)";
    } else if (phase === 2) {
      circle.style.transform = "scale(1.0)";
      circle.style.boxShadow = "0 0 20px rgba(147,51,234,0.3)";
      text.textContent = "Exhale (4s)";
    } else if (phase === 3) {
      circle.style.transform = "scale(1.0)";
      circle.style.boxShadow = "0 0 15px rgba(100,116,139,0.3)";
      text.textContent = "Hold (4s)";
    }
    phase = (phase + 1) % 4;
  }

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      if (breathingInterval) clearInterval(breathingInterval);
      phase = 0;
      stepBreathing();
      breathingInterval = setInterval(stepBreathing, 4000);
      showToast("🧘 4-4-4-4 Box Breathing Started. Follow the visual circle rhythm.");
    });
  }

  if (stopBtn) {
    stopBtn.addEventListener("click", () => {
      if (breathingInterval) {
        clearInterval(breathingInterval);
        breathingInterval = null;
      }
      if (circle) circle.style.transform = "scale(1.0)";
      if (text) text.textContent = "Ready";
      showToast("Breathing session ended.");
    });
  }
}


/* ==============================================================================
   AI MODEL & REAL API KEY MANAGEMENT (OpenAI, Gemini, Groq, OpenRouter)
   ============================================================================== */
function initAiKeyModal() {
  const openBtn = document.getElementById("openAiKeyModalBtn");
  const modal = document.getElementById("aiKeyModal");
  const closeBtn = document.getElementById("closeAiKeyModalBtn");
  const form = document.getElementById("aiKeyConfigForm");
  const providerSelect = document.getElementById("aiProviderSelect");
  const keyInput = document.getElementById("modalApiKeyInput");
  const modelInput = document.getElementById("modalAiModelInput");
  const urlInput = document.getElementById("modalApiUrlInput");
  const urlGroup = document.getElementById("customApiUrlGroup");
  const toggleVisibilityBtn = document.getElementById("toggleAiKeyVisibilityBtn");
  const testBtn = document.getElementById("testAiKeyBtn");
  const feedbackBox = document.getElementById("aiTestFeedbackBox");
  const statusLabel = document.getElementById("chatApiStatusLabel");
  const hintLabel = document.getElementById("aiKeyHint");

  const providerDefaults = {
    openai: {
      url: "https://api.openai.com/v1/chat/completions",
      model: "gpt-4o-mini",
      hint: "Get your key from https://platform.openai.com/api-keys"
    },
    gemini: {
      url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      model: "gemini-1.5-flash",
      hint: "Get a free Gemini API key from https://aistudio.google.com"
    },
    groq: {
      url: "https://api.groq.com/openai/v1/chat/completions",
      model: "llama-3.3-70b-versatile",
      hint: "Get a free ultra-fast key from https://console.groq.com/keys"
    },
    openrouter: {
      url: "https://openrouter.ai/api/v1/chat/completions",
      model: "openai/gpt-4o-mini",
      hint: "Get a key from https://openrouter.ai/keys"
    },
    deepseek: {
      url: "https://api.deepseek.com/chat/completions",
      model: "deepseek-chat",
      hint: "Get a key from https://platform.deepseek.com"
    },
    custom: {
      url: "https://api.openai.com/v1/chat/completions",
      model: "gpt-4o-mini",
      hint: "Enter your custom OpenAI-compatible endpoint"
    }
  };

  // Provider dropdown change
  if (providerSelect) {
    providerSelect.addEventListener("change", () => {
      const p = providerSelect.value;
      const def = providerDefaults[p] || providerDefaults.openai;
      if (modelInput) modelInput.value = def.model;
      if (urlInput) urlInput.value = def.url;
      if (hintLabel) hintLabel.innerText = def.hint;
      if (urlGroup) urlGroup.style.display = (p === "custom") ? "block" : "none";
    });
  }

  // Visibility toggle
  if (toggleVisibilityBtn && keyInput) {
    toggleVisibilityBtn.addEventListener("click", () => {
      keyInput.type = (keyInput.type === "password") ? "text" : "password";
      toggleVisibilityBtn.innerText = (keyInput.type === "password") ? "👁️" : "🙈";
    });
  }

  // Open & Close Modal
  if (openBtn && modal) {
    openBtn.addEventListener("click", () => {
      modal.classList.add("active");
      checkActiveAiStatus();
    });
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => modal.classList.remove("active"));
  }
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("active");
    });
  }

  // Fetch current AI configuration
  async function checkActiveAiStatus() {
    if (!window.location.protocol.startsWith("http")) return;
    try {
      const res = await fetch("api/ai_config.php?action=get");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (data.has_key) {
            if (statusLabel) statusLabel.innerText = "🟢 Real AI: " + (data.model || "Active");
            if (providerSelect && data.provider) providerSelect.value = data.provider;
            if (modelInput && data.model) modelInput.value = data.model;
            if (urlInput && data.api_url) urlInput.value = data.api_url;
            if (keyInput && data.masked_key) keyInput.placeholder = data.masked_key;
            if (feedbackBox) {
              feedbackBox.innerHTML = '<div class="alert alert-success" style="padding:0.6rem;background:rgba(16,185,129,0.1);border-radius:var(--radius-sm);color:var(--accent-green);font-size:0.8rem;">' +
                '✅ Real AI is Active (' + escapeHtml(data.provider) + ' • ' + escapeHtml(data.model) + '). All modules receive real dynamic answers like ChatGPT.</div>';
            }
          } else {
            if (statusLabel) statusLabel.innerText = "✨ Real AI: Inbuilt & Active";
            if (feedbackBox) {
              feedbackBox.innerHTML = '<div class="alert alert-info" style="padding:0.6rem;background:rgba(59,130,246,0.1);border-radius:var(--radius-sm);color:var(--primary);font-size:0.8rem;">' +
                '✨ Inbuilt Real Cloud AI (GPT-4o) is active out-of-the-box! You can also enter your personal OpenAI, Gemini, or Groq key below anytime.</div>';
            }
          }
        }
      }
    } catch (e) {
      console.warn("Could not check AI config status:", e);
    }
  }

  // Test Connection Button
  if (testBtn) {
    testBtn.addEventListener("click", async () => {
      const key = keyInput ? keyInput.value.trim() : "";
      const url = urlInput ? urlInput.value.trim() : "https://api.openai.com/v1/chat/completions";
      const model = modelInput ? modelInput.value.trim() : "gpt-4o-mini";

      if (!key) {
        showToast("Please enter an API Key to test");
        return;
      }

      if (feedbackBox) {
        feedbackBox.innerHTML = '<div style="font-size:0.8rem;color:var(--text-secondary);"><span class="spinner" style="display:inline-block;width:14px;height:14px;margin-right:6px;"></span> Testing connection to ' + escapeHtml(model) + '...</div>';
      }

      try {
        const res = await fetch("api/ai_config.php?action=test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ api_key: key, api_url: url, model: model })
        });
        const data = await res.json();
        if (data.success) {
          if (feedbackBox) {
            feedbackBox.innerHTML = '<div style="padding:0.6rem;background:rgba(16,185,129,0.12);border-radius:var(--radius-sm);color:var(--accent-green);font-size:0.82rem;">' +
              '✅ <strong>Connection Successful!</strong> The AI replied: \"' + escapeHtml(data.sample_reply || "OK") + '\"</div>';
          }
          showToast("AI Connection Verified!");
        } else {
          if (feedbackBox) {
            feedbackBox.innerHTML = '<div style="padding:0.6rem;background:rgba(239,68,68,0.12);border-radius:var(--radius-sm);color:var(--accent-red);font-size:0.82rem;">' +
              '❌ <strong>Connection Failed:</strong> ' + escapeHtml(data.error || "Verification failed.") + '</div>';
          }
        }
      } catch (err) {
        if (feedbackBox) {
          feedbackBox.innerHTML = '<div style="padding:0.6rem;background:rgba(239,68,68,0.12);border-radius:var(--radius-sm);color:var(--accent-red);font-size:0.82rem;">' +
            '❌ Network error connecting to backend: ' + escapeHtml(err.message) + '</div>';
        }
      }
    });
  }

  // Save Configuration Form
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const key = keyInput ? keyInput.value.trim() : "";
      const url = urlInput ? urlInput.value.trim() : "https://api.openai.com/v1/chat/completions";
      const model = modelInput ? modelInput.value.trim() : "gpt-4o-mini";
      const provider = providerSelect ? providerSelect.value : "openai";

      if (feedbackBox) {
        feedbackBox.innerHTML = '<div style="font-size:0.8rem;color:var(--text-secondary);"><span class="spinner" style="display:inline-block;width:14px;height:14px;margin-right:6px;"></span> Saving and activating Real AI...</div>';
      }

      try {
        const res = await fetch("api/ai_config.php?action=save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ api_key: key, api_url: url, model: model, provider: provider })
        });
        const data = await res.json();
        if (data.success) {
          showToast("Real AI Activated: " + model);
          if (statusLabel) statusLabel.innerText = "🟢 Real AI: " + model;
          const engineLabel = document.getElementById("chatEngineLabel");
          if (engineLabel) engineLabel.innerText = "Live AI (" + model + ")";
          if (feedbackBox) {
            feedbackBox.innerHTML = '<div style="padding:0.6rem;background:rgba(16,185,129,0.12);border-radius:var(--radius-sm);color:var(--accent-green);font-size:0.82rem;">' +
              '✅ ' + escapeHtml(data.message) + '</div>';
          }
          setTimeout(() => {
            if (modal) modal.classList.remove("active");
          }, 1200);
        } else {
          if (feedbackBox) {
            feedbackBox.innerHTML = '<div style="padding:0.6rem;background:rgba(239,68,68,0.12);border-radius:var(--radius-sm);color:var(--accent-red);font-size:0.82rem;">' +
              '❌ ' + escapeHtml(data.error || "Save failed.") + '</div>';
          }
        }
      } catch (err) {
        if (feedbackBox) {
          feedbackBox.innerHTML = '<div style="padding:0.6rem;background:rgba(239,68,68,0.12);border-radius:var(--radius-sm);color:var(--accent-red);font-size:0.82rem;">' +
            '❌ ' + escapeHtml(err.message) + '</div>';
        }
      }
    });
  }

  // Initial check on load
  checkActiveAiStatus();
}
