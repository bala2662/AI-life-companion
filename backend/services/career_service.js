/**
 * ==============================================================================
 * AI SKILL DEVELOPMENT & CAREER ROADMAP SERVICE (Section 9)
 * Skill gap analysis, structured roadmaps, quizzes, and mini-project recommendations
 * ==============================================================================
 */

const { db } = require('../db/database');

const CAREER_ROADMAPS = {
  java_backend: {
    roleTitle: 'Junior Java / Spring Boot Backend Engineer',
    targetSkills: ['Java Core (OOP)', 'Collections & Generics', 'Relational DB & SQL', 'Spring Boot REST APIs', 'Git & CI/CD', 'Unit Testing (JUnit)'],
    milestones: [
      {
        id: 'jb-1',
        title: 'Milestone 1: Java OOP Mastery',
        status: 'in_progress',
        progressPct: 65,
        topics: ['Classes & Objects', 'Inheritance & Overriding', 'Interfaces & Polymorphism', 'Exception Handling', 'Generics & Collections (ArrayList, HashMap)'],
        practiceTask: 'Build a Console-based Bank Account Management System with inheritance and custom exceptions.'
      },
      {
        id: 'jb-2',
        title: 'Milestone 2: Relational Databases & SQL',
        status: 'pending',
        progressPct: 20,
        topics: ['Database Normalization (1NF, 2NF, 3NF)', 'Complex Joins (INNER, LEFT, FULL)', 'Indexing & Query Optimization', 'JDBC & Connection Pooling'],
        practiceTask: 'Design a normalized University Course Registration schema with foreign key constraints.'
      },
      {
        id: 'jb-3',
        title: 'Milestone 3: Spring Boot & Microservices',
        status: 'pending',
        progressPct: 0,
        topics: ['Dependency Injection & Inversion of Control', 'Spring MVC & REST Controllers', 'Spring Data JPA / Hibernate', 'Spring Security with JWT'],
        practiceTask: 'Create a secured RESTful API for an E-commerce Cart with Swagger documentation.'
      }
    ]
  },
  fullstack_web: {
    roleTitle: 'Full-Stack Web Developer',
    targetSkills: ['HTML5 & Modern CSS', 'Modern JavaScript (ES6+)', 'React with TypeScript', 'Node.js & Express', 'PostgreSQL / MongoDB', 'Git & Deployment'],
    milestones: [
      {
        id: 'fs-1',
        title: 'Milestone 1: Modern Frontend Core',
        status: 'completed',
        progressPct: 100,
        topics: ['Semantic HTML & Accessibility', 'CSS Grid & Flexbox Layouts', 'Vanilla JS DOM & Fetch API', 'Async/Await & Promises'],
        practiceTask: 'Build a responsive personal portfolio with interactive theme switcher.'
      },
      {
        id: 'fs-2',
        title: 'Milestone 2: React & TypeScript',
        status: 'in_progress',
        progressPct: 50,
        topics: ['Components & Props', 'Hooks (useState, useEffect, useMemo)', 'State Management', 'TypeScript Interfaces & Generics'],
        practiceTask: 'Develop an interactive Task & Kanban Board with LocalStorage synchronization.'
      },
      {
        id: 'fs-3',
        title: 'Milestone 3: Backend APIs & Databases',
        status: 'pending',
        progressPct: 0,
        topics: ['Node.js HTTP & Express', 'RESTful API Design', 'Authentication & Cookies/JWT', 'Database CRUD Operations'],
        practiceTask: 'Build a full-stack Note-taking app with authentication.'
      }
    ]
  }
};

/**
 * Get career roadmap and skill gap analysis (Scenario E)
 */
function getCareerRoadmap(userId, requestedRole = null) {
  const profile = db.prepare('SELECT career_goal FROM user_profiles WHERE user_id = ?').get(userId);
  const roleKey = requestedRole || (profile ? profile.career_goal : 'java_backend');
  const roadmap = CAREER_ROADMAPS[roleKey] || CAREER_ROADMAPS.java_backend;

  // Fetch verified user skills from DB
  const userSkills = db.prepare('SELECT * FROM skills WHERE user_id = ?').all(userId);

  // Skill gap analysis
  const skillGapAnalysis = roadmap.targetSkills.map(skillName => {
    const found = userSkills.find(s => s.name.toLowerCase().includes(skillName.toLowerCase()) || skillName.toLowerCase().includes(s.name.toLowerCase()));
    return {
      skill: skillName,
      status: found ? found.proficiency_level : 'needs_learning',
      verified: found ? found.verified_by_quiz === 1 : false
    };
  });

  return {
    targetRole: roadmap.roleTitle,
    roleKey,
    milestones: roadmap.milestones,
    targetSkills: roadmap.targetSkills,
    skillGap: skillGapAnalysis
  };
}

module.exports = {
  getCareerRoadmap
};
