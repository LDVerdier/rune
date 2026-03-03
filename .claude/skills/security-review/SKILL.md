---
name: security-review
description: Review code for security vulnerabilities before completing an implementation. Use this skill after finishing a feature and before running the verification suite. Covers OWASP top 10 risks relevant to this SSR React application.
tools: Read, Glob, Grep
---

# Security Review Skill

Systematic security checklist for a React Router v7 SSR application. Run this review after every feature implementation.

## Checklist

### 1. XSS Prevention
- [ ] No use of `dangerouslySetInnerHTML` unless input is sanitized
- [ ] User-provided strings never interpolated into raw HTML
- [ ] URL parameters and query strings are validated before rendering
- [ ] React's built-in JSX escaping is relied upon (no bypasses)

### 2. Injection
- [ ] No dynamic string construction for SQL, shell commands, or eval
- [ ] User input never passed directly to `new Function()`, `eval()`, or template literals executed as code
- [ ] File paths derived from user input are validated/sanitized

### 3. Sensitive Data Exposure
- [ ] No secrets, API keys, or tokens in source code
- [ ] No sensitive data in client-side bundles (check loader vs client code boundary)
- [ ] `.env` files are in `.gitignore`
- [ ] SSR loaders don't leak server-only data to the client

### 4. SSR-Specific Risks
- [ ] Data returned from loaders is safe to serialize (no functions, circular refs)
- [ ] Server-only imports don't leak into client bundles
- [ ] Hydration mismatches don't expose server-side data

### 5. Dependencies
- [ ] Run `npm audit` — no high/critical vulnerabilities
- [ ] No outdated packages with known CVEs
- [ ] Third-party scripts loaded from trusted sources only

### 6. Authentication & Authorization
- [ ] Protected routes check auth state before rendering
- [ ] Sensitive actions require server-side validation (not just client checks)
- [ ] Session tokens handled securely (HttpOnly, Secure, SameSite)

### 7. Content Security
- [ ] External resources loaded over HTTPS
- [ ] No inline scripts that could be hijacked
- [ ] Image/asset URLs validated

## How to Run

1. Search for dangerous patterns:
   - `dangerouslySetInnerHTML`
   - `eval(`, `new Function(`
   - Hardcoded tokens/keys (patterns: `sk_`, `api_key`, `secret`, `password`)
2. Check `.env` is gitignored
3. Run `npm audit`
4. Review any new loader/action for data leakage

## When to Use

- After completing any feature implementation
- Before the `/verify` step
- When touching loaders, actions, or any server/client boundary code
