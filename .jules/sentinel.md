## 2024-05-24 - HTML Injection in Email Templates
**Vulnerability:** User-controlled input (e.g. organization name, notification title) was directly interpolated into HTML email templates, allowing for HTML injection and potential XSS.
**Learning:** `EmailService` uses template literals for HTML content without any automatic escaping mechanism.
**Prevention:** Always use a helper method like `escapeHtml` to sanitize any dynamic content before embedding it into HTML templates.
