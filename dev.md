# 📘 Developer Guide & Architecture

This document provides a deep dive into the internal architecture, design patterns, and utility classes used in the **Express Auth Playground** backend. It is intended for developers contributing to or maintaining the codebase.

## 🏗️ Architecture Overview

The backend follows a **Modular Monolith** structure. Code is organized by domain features (Modules) rather than technical layers.

```
backend/
├── modules/
│   └── auth/           # Auth domain (Controller + Router)
├── models/             # Data Layer (Mongoose Schemas)
├── shared/             # Shared Kernel (Utilities, Error Handling)
└── index.js            # Composition Root
```

---

## 🛡️ Error Handling Strategy

We use a centralized error handling mechanism to ensure consistent API responses and logging.

### The `ErrorHandler` Class
Located in `shared/ErrorHandler.class.js`.

**Key Features:**
- Extends the native `Error` class.
- Captures the **Origin** (context) of the error.
- Logs the full error stack to the console (for debugging).
- Throws a structured exception that can be caught by the global handler or controller try/catch blocks.

### Usage Pattern
**DO NOT** throw raw Javascript errors. Use `ErrorHandler.throw()`:

```javascript
const ErrorHandler = require("../../shared/ErrorHandler.class");

try {
    // ... logic ...
    if (!user) {
        // signature: message, statusCode, origin, originalError
        ErrorHandler.throw("User not found", 404, "Login", null);
    }
} catch (error) {
    // Pass the error up the stack with context
    // This allows the unified error handler to log exactly where it failed
    ErrorHandler.throw("Internal Server Error", 500, "Login", error);
}
```

---

## 🔐 Security & Encryption

### The `Encrypter` Class
Located in `shared/Encrypter.class.js`.

This static utility class wraps `bcrypt` to enforce consistent hashing params (e.g., salt rounds) across the application.

**API:**
- `Encrypter.hash(password)`: Returns a hashed string (Sync).
- `Encrypter.compare(password, hash)`: Returns `true` if matching (Sync).

**Example:**
```javascript
const hashedPassword = Encrypter.hash(req.body.password);
const isValid = Encrypter.compare(req.body.password, user.password);
```

---

## 🔑 Two-Factor Authentication Service

### The `TwoFactorAuthHandler` Class
Located in `shared/TwoFactorAuthHandler.class.js`.

**Design Pattern**: Stateful Service.
Unlike utility classes, this handler is designed to be **instantiated**. It maintains an in-memory `Map` to store temporary 2FA codes.

**Why In-Memory?**
For this playground, we use an in-memory `Map` for simplicity. **In a production environment**, this should be replaced by a distributed cache like **Redis** to support horizontal scaling (sharing state across multiple server instances).

### Usage in Controllers
An instance should be created at the module level (Singleton scope for the module):

```javascript
// modules/auth/auth.controller.js
const twoFactorService = new TwoFactorAuthHandler();

// 1. Generate & Store Code
const code = twoFactorService.generate2FACode();
twoFactorService.setObject(id, { email, code, ... });

// 2. Verify Presence
if (!twoFactorService.exists(id)) { ... }

// 3. Clean up
twoFactorService.delete(id);
```

---

## 📡 API Response Standards

All API responses must return rigid JSON structures for frontend predictability.

**Success (200/201):**
```json
{
  "message": "Operation successful",
  "data": { ... } // Optional payload
}
```

**Error (4xx/5xx):**
```json
{
  "message": "User friendly error message",
  "error": { ... } // Detailed error object (useful for debugging)
}
```

## 🛠️ Best Practices

1.  **Async/Await**: Always use `async/await` in controllers to avoid callback hell.
2.  **Environment Variables**: Never hardcode secrets. Use `process.env`.
3.  **Strict Mode**: The `TwoFactorAuthHandler` methods often rely on `this`, so ensure they are called on the instance (`service.method()`).
