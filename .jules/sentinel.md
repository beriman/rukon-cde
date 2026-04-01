## 2025-02-18 - HTML Injection in Email Templates
**Vulnerability:** `EmailService` constructed HTML emails using unescaped template literals with user input (Organization Name, Title, Message).
**Learning:** Manual HTML construction is error-prone. The codebase lacks a global HTML sanitization utility.
**Prevention:** Use a templating engine or ensure all user input is passed through an `escapeHtml` utility before interpolation. Fixed by adding `escapeHtml` method to `EmailService`.
