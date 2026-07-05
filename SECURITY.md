# 🔒 Security Architecture & Data Handling Report

This document outlines the security architecture, threat modeling, and data protection policies implemented in **PawPal AI** to guarantee secure coding practices and responsible user data handling.

---

## 🛡️ Key Security Features

### 1. Zero Client-Side Secret Leakage (Backend RPC Triage)
* **Vulnerability Mitigated**: Exposing generative AI API keys (like Google Gemini) in client-side bundles allows malicious users to extract the key from javascript assets or network logs, leading to API quota theft and financial loss.
* **Implementation**: We refactored all chat communication to use **TanStack Start Server Functions** (`src/utils/chat.ts`). 
* **Mechanism**: The browser client makes a request to the serverless backend via a secure RPC bridge. The serverless function privately queries the Gemini API using the server-side environment variable `GEMINI_API_KEY`, returning only the formatted text candidates to the client. The key itself is never exposed to the public.

### 2. Path Traversal Sanitation & Validation
* **Vulnerability Mitigated**: Dynamic components inside file paths (like `user.id` or user uploads) reaching Supabase storage upload functions can introduce path traversal vulnerabilities if directory traversal tokens (like `..`) are injected.
* **Implementation**: Sanitized all uploaded file extensions using regex replacement to strictly isolate alphanumeric characters, and validated constructed upload paths to guarantee zero directory traversal:
  ```typescript
  // Extension sanitization
  const rawExt = file.name.split(".").pop() || "";
  const cleanExt = rawExt.replace(/[^a-zA-Z0-9]/g, "");
  const ext = cleanExt || "pdf";

  // Path validation
  if (path.includes("..") || path.includes("../")) {
    throw new Error("Security check failed: Path traversal detected");
  }
  ```
  This ensures any attempt to write or read outside the authorized user directory is blocked before invoking the Supabase storage SDK.

### 3. HTTP Strict Transport Security (HSTS) & Headers
* **Vulnerability Mitigated**: Missing security headers (like HSTS and Clickjacking blocks) can leave users vulnerable to downgrade attacks (SSL stripping) or clickjacking.
* **Implementation**: Added a `vercel.json` deployment configuration to enforce the following HTTP headers on all routes:
  * `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (enforces secure HTTPS execution).
  * `X-Frame-Options: DENY` (neutralizes frame-injection clickjacking).
  * `X-Content-Type-Options: nosniff` (forces correct mime-types).

### 4. Dependency CVE Mitigation
* **`undici` CVEs (CVE-2026-12151 & CVE-2026-9679)**: Mitigated by overriding the version mapping to **`7.28.0`** in `package.json` resolutions/overrides and updating `bun.lock`.
* **`enhanced-resolve` CVE (CVE-2026-11084)**: Mitigated by overriding the version mapping to **`5.22.1`** in `package.json` resolutions/overrides and updating `bun.lock` / `package-lock.json`.
* **`@tanstack/start-server-core` CVE (GHSA-9m65-766c-r333)**: Mitigated by overriding the transitive dependency to the secure **`1.169.15`** release version in `package.json` and updating `bun.lock`.

---

## 📂 Data Isolation & Access Controls

### 5. Supabase Row-Level Security (RLS)
Every database table (including `pets`, `vaccinations`, `medical_records`, and `chat_messages`) is protected by strict Postgres RLS policies:
* **Authentication**: Users must authenticate via Supabase Auth (using secure JWT tokens) before reading or writing data.
* **Isolation Rule**: Row-level policies restrict access based on the authenticated user's ID:
  ```sql
  -- Example policy for the pets table
  CREATE POLICY "Users can only access their own pets"
  ON pets
  FOR ALL
  USING (auth.uid() = user_id);
  ```
  This ensures that under no circumstances can a user read, modify, or delete another user's pet data, timeline, or chat logs.

---

## 🧪 Input Validation & Safety

### 6. Zod Schema Verification
* All forms (e.g., Add Pet, Add Vaccination, Upload Record) use typed **Zod schemas** to validate and sanitize inputs on both the frontend and backend layers.
* Prevents common injection vectors, buffer overflows, or unexpected schema corruption by validating:
  * Name lengths and alphanumeric spacing.
  * Integer bounds (e.g., restricting pet ages to realistic ranges of 0–30 years).
  * File size limits on image attachments.

---

## 🧹 Deployment & Environment Hygiene

### 7. Git & Asset Protection
* **`.gitignore` Rules**: Clean hygiene rules prevent local configuration assets (such as `.env` and `.env.local` containing secrets) from ever being tracked or pushed to remote repositories.
* **Build Targets**: Build compilers ignore temporary server files and cache folders (`.output/`, `.vinxi/`, `.vercel/`), preventing compiled API key assets from leaking to public spaces.
