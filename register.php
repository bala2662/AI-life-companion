<?php
/**
 * Registration Page
 * Platform: PHP 8+, MySQL PDO
 */

declare(strict_types=1);

require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/csrf.php';

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $level = $_POST['learning_level'] ?? 'Beginner (Java)';
    $token = $_POST['csrf_token'] ?? '';

    if (!CSRF::validate($token)) {
        $error = 'Security session expired. Please refresh and try again.';
    } else {
        $res = Auth::register($name, $email, $password, $level);
        if ($res['success']) {
            header('Location: index.php');
            exit;
        } else {
            $error = $res['error'];
        }
    }
}

$csrfToken = CSRF::getToken();
?>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Create Account — AI Unified Life Companion</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body {
      background: radial-gradient(circle at 50% 20%, #1e1b4b 0%, #0b0f19 75%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .auth-container {
      width: 100%;
      max-width: 480px;
      background: rgba(23, 32, 51, 0.85);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(99, 102, 241, 0.25);
      border-radius: var(--radius-lg);
      padding: 2.25rem;
      box-shadow: 0 20px 35px -5px rgba(0, 0, 0, 0.5), 0 0 40px rgba(79, 70, 229, 0.15);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .auth-logo {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, #4f46e5, #8b5cf6);
      color: white;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.75rem;
      box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4);
    }
    .form-group {
      margin-bottom: 1.1rem;
    }
    .form-label {
      display: block;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text-secondary);
      margin-bottom: 0.35rem;
    }
    .input-field, .select-field {
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
      background: var(--bg-input);
      color: var(--text-primary);
      font-size: 0.92rem;
      outline: none;
      transition: var(--transition);
      box-sizing: border-box;
    }
    .input-field:focus, .select-field:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
    }
    .error-banner {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #f87171;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      margin-bottom: 1.25rem;
      font-size: 0.85rem;
    }
  </style>
</head>
<body>
  <div class="auth-container">
    <div class="auth-header">
      <div class="auth-logo">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7.5" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
      </div>
      <h2 style="font-size:1.35rem;font-weight:800;letter-spacing:-0.02em;">Create Your Life Companion Account</h2>
      <p style="font-size:0.82rem;color:var(--text-secondary);margin-top:0.25rem;">Personalized memory across education, fitness & career</p>
    </div>

    <?php if (!empty($error)): ?>
      <div class="error-banner">⚠️ <?= htmlspecialchars($error) ?></div>
    <?php endif; ?>

    <form method="POST" action="register.php">
      <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">

      <div class="form-group">
        <label class="form-label" for="name">Full Name</label>
        <input type="text" id="name" name="name" class="input-field" required placeholder="e.g. Alex Smith">
      </div>

      <div class="form-group">
        <label class="form-label" for="email">Email Address</label>
        <input type="email" id="email" name="email" class="input-field" required placeholder="student@university.edu">
      </div>

      <div class="form-group">
        <label class="form-label" for="password">Create Password</label>
        <input type="password" id="password" name="password" class="input-field" required placeholder="Minimum 6 characters">
      </div>

      <div class="form-group">
        <label class="form-label" for="learning_level">Primary Learning Goal / Programming Level</label>
        <select id="learning_level" name="learning_level" class="select-field">
          <option value="Beginner (Java)">Beginner (Java & OOP Foundations)</option>
          <option value="Intermediate (Java & DSA)">Intermediate (Data Structures & Algorithms)</option>
          <option value="Advanced (Spring Boot & Backend)">Advanced (Spring Boot, APIs & Microservices)</option>
          <option value="General Student">General College Student</option>
        </select>
      </div>

      <button type="submit" class="btn btn-primary" style="width:100%;padding:0.75rem;font-weight:700;margin-top:0.5rem;">
        Start Personalized Companion
      </button>
    </form>

    <div style="text-align:center;margin-top:1.5rem;font-size:0.85rem;color:var(--text-secondary);">
      Already have an account? <a href="login.php" style="color:var(--primary);font-weight:700;text-decoration:none;">Log In</a>
    </div>
  </div>
</body>
</html>
