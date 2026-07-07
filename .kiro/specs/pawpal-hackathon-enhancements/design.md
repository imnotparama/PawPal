# Design Document: Hackathon Enhancements & Visual Polish

## Technical Specifications

This document outlines the implementation details and styles used to build the visual enhancements for the application.

### 1. Global Error Boundary fallbacks
We built a stateful class component `src/components/ErrorBoundary.tsx` that catches any runtime render errors in sub-routes, displaying a clean dark interface with active reload methods:
```tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  // ...
}
```

### 2. URLSearchParams Judge Banner Trigger
On `src/routes/dashboard/index.tsx`, we retrieve query values on render:
```typescript
const searchParams = new URLSearchParams(window.location.search);
const isJudgeView = searchParams.get("judgeview") === "true";
```
If `isJudgeView` is true, the "Hack the Kitty" hero banner renders.

### 3. SVG Paw Print with Motion Springs
The empty state of the chat component displays a pulsing badge containing `PawPrint` from `lucide-react`:
```tsx
<motion.div
  animate={{ scale: [1, 1.06, 1] }}
  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
>
  <PawPrint size={36} color="#8052ff" />
</motion.div>
```

### 4. Dynamic Life Phase Calculation
Age calculation mapping inside `src/routes/dashboard/pets/index.tsx`:
```typescript
const getPetLifePhase = (age: number, species: string) => {
  const isCat = species?.toLowerCase() === "cat";
  if (isCat) {
    if (age <= 1) return "Kitten";
    if (age <= 6) return "Junior";
    if (age <= 10) return "Mature";
    if (age <= 15) return "Senior";
    return "Geriatric";
  } else {
    if (age <= 1) return "Puppy";
    if (age <= 3) return "Junior";
    if (age <= 7) return "Adult";
    if (age <= 10) return "Senior";
    return "Geriatric";
  }
};
```

### 5. Radix UI AlertDialog
To secure dangerous account triggers, we styled standard Radix elements with custom dark panels:
- Content panel: `#111111` background, border `1px solid rgba(255,255,255,0.08)`.
- Action buttons: `#ff4444` red button for confirmation, transparent outline for cancellation.

### 6. Secure Server Actions and Account Data Isolation
- Gemini endpoints verify user JWT authentication sessions before forwarding content to Google API.
- All browser cache elements (`localStorage` and `sessionStorage`) are explicitly wiped on account logout in `auth.tsx` to isolate user profiles completely.

### 7. Client-Side iCalendar Exporter
- Vaccination dates map to raw iCalendar text blocks on the client, which are compiled into calendar `.ics` attachments and downloaded on click.

### 8. HTML5 Native System Notifications
- Mount effect queries for upcoming immunization warnings and triggers native operating system warnings if scheduled within 7 days.

### 9. Interactive Pet Passport Weight SVG Graphs
- Passport details toggle between general checklists and historical growth metrics.
- Historical check-ins log to `medical_records` as custom entities and are drawn in clean SVG polylines with linear gradient backgrounds.
