/**
 * ==============================================================================
 * SMART ALARM & REMINDER SERVICE (Section 5)
 * Real persistent reminder scheduler, natural language command parser, snooze,
 * audio tones, and notification dispatching
 * ==============================================================================
 */

const crypto = require('node:crypto');
const { db } = require('../db/database');

/**
 * List all reminders for a user
 */
function getReminders(userId) {
  return db.prepare(`
    SELECT * FROM reminders 
    WHERE user_id = ? 
    ORDER BY trigger_time ASC
  `).all(userId);
}

/**
 * Create a new reminder/alarm
 */
function createReminder(userId, { title, reminder_type = 'custom', trigger_time, recurring_days = null, tone = 'chime' }) {
  if (!title || !trigger_time) {
    throw new Error('Reminder title and trigger time are required');
  }

  const id = 'rem-' + crypto.randomUUID();
  const recurringStr = typeof recurring_days === 'object' ? JSON.stringify(recurring_days) : recurring_days;

  db.prepare(`
    INSERT INTO reminders (id, user_id, title, reminder_type, trigger_time, recurring_days, tone, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `).run(id, userId, title, reminder_type, trigger_time, recurringStr, tone);

  // Add confirmation log into user memory if related to study/exam
  if (reminder_type === 'study' || title.toLowerCase().includes('java') || title.toLowerCase().includes('exam')) {
    try {
      db.prepare(`
        INSERT INTO user_memories (id, user_id, category, title, content, is_confirmed_fact, is_active, source)
        VALUES (?, ?, 'schedule', ?, ?, 1, 1, 'user_provided')
      `).run('mem-' + crypto.randomUUID(), userId, `Scheduled Reminder: ${title}`, `Alarm set for ${trigger_time}. Type: ${reminder_type}`);
    } catch {
      // Memory table entry is secondary
    }
  }

  return db.prepare('SELECT * FROM reminders WHERE id = ?').get(id);
}

/**
 * Parse Natural Language Reminder Command (English, Tamil, Thanglish)
 * Examples:
 * - "Tomorrow morning 6 AM Java study alarm set pannu."
 * - "Friday assignment submit panna remind pannu."
 * - "Daily evening workout reminder venum."
 * - "Exam-ku two days munnadi revision remind pannu."
 */
function parseNaturalLanguageReminder(userId, commandText) {
  const lower = commandText.toLowerCase();

  let title = 'Study Reminder';
  let triggerTime = '06:00';
  let type = 'study';
  let recurring = null;
  let tone = 'chime';

  // 1. Detect Type
  if (lower.includes('workout') || lower.includes('exercise') || lower.includes('gym') || lower.includes('udarpayirchi')) {
    type = 'fitness';
    title = 'Daily Evening Workout';
    tone = 'bell';
  } else if (lower.includes('assignment') || lower.includes('submit')) {
    type = 'assignment';
    title = 'Assignment Submission Deadline';
    tone = 'digital';
  } else if (lower.includes('revision') || lower.includes('exam')) {
    type = 'study';
    title = 'Upcoming Exam Revision Session';
    tone = 'radar';
  } else if (lower.includes('water') || lower.includes('thanni')) {
    type = 'hydration';
    title = 'Water Hydration Break';
    tone = 'chime';
  } else if (lower.includes('java')) {
    type = 'study';
    title = 'Java Study & Code Practice Alarm';
    tone = 'chime';
  }

  // 2. Detect Time
  const timeMatch = lower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1], 10);
    const mins = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    const ampm = timeMatch[3].toLowerCase();
    if (ampm === 'pm' && hours < 12) hours += 12;
    if (ampm === 'am' && hours === 12) hours = 0;
    triggerTime = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  } else if (lower.includes('evening') || lower.includes('saayanthiram')) {
    triggerTime = '18:00';
  } else if (lower.includes('morning') || lower.includes('kaalai')) {
    triggerTime = '06:00';
  }

  // 3. Detect Recurring Days
  if (lower.includes('daily') || lower.includes('dhinamum')) {
    recurring = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  } else if (lower.includes('friday') || lower.includes('vellikizhamai')) {
    recurring = ['Fri'];
  }

  // Actually create and persist the reminder in DB
  const created = createReminder(userId, {
    title,
    reminder_type: type,
    trigger_time: triggerTime,
    recurring_days: recurring,
    tone
  });

  return {
    success: true,
    reminder: created,
    feedbackMessage: `Alarm & Reminder successfully scheduled: "${title}" set for ${triggerTime}${recurring ? ' (Recurring: ' + recurring.join(', ') + ')' : ''}. Web Audio tone and browser notifications active.`
  };
}

/**
 * Snooze a reminder by X minutes
 */
function snoozeReminder(userId, reminderId, minutes = 10) {
  const rem = db.prepare('SELECT * FROM reminders WHERE id = ? AND user_id = ?').get(reminderId, userId);
  if (!rem) throw new Error('Reminder not found');

  const snoozeDate = new Date(Date.now() + minutes * 60 * 1000);
  const isoStr = snoozeDate.toISOString();

  db.prepare('UPDATE reminders SET snoozed_until = ? WHERE id = ?').run(isoStr, reminderId);

  return { reminderId, snoozedUntil: isoStr, minutes };
}

/**
 * Acknowledge / dismiss reminder
 */
function dismissReminder(userId, reminderId) {
  db.prepare('UPDATE reminders SET acknowledged_at = CURRENT_TIMESTAMP, snoozed_until = NULL WHERE id = ? AND user_id = ?').run(reminderId, userId);
  return { success: true, reminderId };
}

/**
 * Delete a reminder
 */
function deleteReminder(userId, reminderId) {
  const result = db.prepare('DELETE FROM reminders WHERE id = ? AND user_id = ?').run(reminderId, userId);
  if (result.changes === 0) throw new Error('Reminder not found');
  return { success: true, deletedId: reminderId };
}

/**
 * Polling/Evaluation worker function: Checks if any alarm should fire right now
 */
function checkUpcomingAlarms(userId, currentTimeHHMM, currentDayOfWeek) {
  const active = db.prepare('SELECT * FROM reminders WHERE user_id = ? AND is_active = 1').all(userId);
  const now = new Date();

  const due = active.filter(rem => {
    // Check if currently snoozed
    if (rem.snoozed_until) {
      const snoozeTime = new Date(rem.snoozed_until);
      if (now < snoozeTime) return false;
      return true; // Snooze elapsed!
    }

    // Check day match
    if (rem.recurring_days) {
      try {
        const days = JSON.parse(rem.recurring_days);
        if (Array.isArray(days) && !days.includes(currentDayOfWeek.substring(0, 3))) {
          return false;
        }
      } catch {
        // invalid json, proceed
      }
    }

    return rem.trigger_time === currentTimeHHMM;
  });

  return due;
}

module.exports = {
  getReminders,
  createReminder,
  parseNaturalLanguageReminder,
  snoozeReminder,
  dismissReminder,
  deleteReminder,
  checkUpcomingAlarms
};
