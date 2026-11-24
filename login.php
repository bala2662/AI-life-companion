<?php
/**
 * Login Page
 * Platform: PHP 8+, MySQL PDO
 */

declare(strict_types=1);

require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/csrf.php';

$error = '';
$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $token = $_POST['csrf_token'] ?? '';

    if (!CSRF::validate($token)) {
        $error = 'Security session expired. Please refresh and try again.';
    } else {
        $res = Auth::attempt($email, $password);
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
  <title>Login — AI Unified Life Companion</title>
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
      max-width: 440px;
      background: rgba(23, 32, 51, 0.85);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(99, 102, 241, 0.25);
      border-radius: var(--radius-lg);
      padding: 2.25rem;
      box-shadow: 0 20px 35px -5px rgba(0, 0, 0, 0.5), 0 0 40px rgba(79, 70, 229, 0.15);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .auth-logo {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, #4f46e5, #8b5cf6);
      color: white;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4);
    }
    .form-group {
      margin-bottom: 1.25rem;
    }
    .form-label {
      display: block;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text-secondary);
      margin-bottom: 0.4rem;
    }
    .input-field {
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
    .input-field:focus {
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
    .demo-credentials {
      margin-top: 1.5rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px dashed var(--border-color);
      border-radius: var(--radius-md);
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .demo-credentials code {
      color: var(--primary);
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="auth-container">
    <div class="auth-header">
      <div class="auth-logo">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
      </div>
      <h2 style="font-size:1.4rem;font-weight:800;letter-spacing:-0.02em;">Welcome Back</h2>
      <p style="font-size:0.85rem;color:var(--text-secondary);margin-top:0.25rem;">Sign in to your AI Unified Life Companion</p>
    </div>

    <?php if (!empty($error)): ?>
      <div class="error-banner">⚠️ <?= htmlspecialchars($error) ?></div>
    <?php endif; ?>

    <form method="POST" action="login.php">
      <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">

      <div class="form-group">
        <label class="form-label" for="email">Student / User Email</label>
        <input type="email" id="email" name="email" class="input-field" required placeholder="alex@alife.local" value="alex@alife.local">
      </div>

      <div class="form-group">
        <label class="form-label" for="password">Password</label>
        <input type="password" id="password" name="password" class="input-field" required placeholder="••••••••" value="Alex@12345">
      </div>

      <button type="submit" class="btn btn-primary" style="width:100%;padding:0.75rem;font-weight:700;margin-top:0.5rem;">
        Sign In to Companion
      </button>
    </form>

    <div class="demo-credentials">
      <strong>🔑 Pre-Seeded Demo Account:</strong><br>
      Email: <code>alex@alife.local</code><br>
      Password: <code>Alex@12345</code>
    </div>

    <div style="text-align:center;margin-top:1.5rem;font-size:0.85rem;color:var(--text-secondary);">
      New to ALlifeCompanion? <a href="register.php" style="color:var(--primary);font-weight:700;text-decoration:none;">Create Account</a> | <a href="index.php" style="color:var(--text-muted);text-decoration:none;">Open App Directly</a>
    </div>
  </div>
</body>
</html>
