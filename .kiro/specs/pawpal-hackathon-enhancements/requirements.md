# Requirements Document: Hackathon Enhancements & Visual Polish

## Introduction

This document outlines the visual and behavioral requirements implemented to polish PawPal AI for hackathon judging. These enhancements improve error resilience, user onboarding, layout compliance, color consistency, and data security.

## Glossary

- **Error_Boundary**: A React component wrapping pages to catch JavaScript exceptions and render a clean fallback UI instead of crashing the browser
- **Active_Nav**: Highlight states indicating current page selections in the sidebar navigation
- **Theme_Banner**: A promotional banner displayed only to hackathon judges via query parameters
- **Paw_Illustration**: A custom breathing SVG element replacing generic emojis in the empty chat state
- **Rate_Limiter**: A mechanism throttling messages to a maximum of one request per 2 seconds
- **Life_Phase**: Dynamic stage definitions (e.g., Puppy, Adult, Kitten, Senior) calculated from age and species
- **AlertDialog**: Radix UI overlay component rendering a modal screen requesting double confirmation before destructive operations

## Requirements

### Requirement 1: Global Error Boundary
- **AC 1.1**: The application SHALL display a dark themed error page when a JavaScript error occurs
- **AC 1.2**: The error page SHALL contain a "Reload Page" button to quickly refresh the app state

### Requirement 2: Sidebar Navigation Polish
- **AC 2.1**: Selected navigation links in the sidebar SHALL render with active color highlights and indicators
- **AC 2.2**: The footer of the sidebar SHALL feature an "Info" button triggering version metadata popup modals

### Requirement 3: Judge View Theme Banner
- **AC 3.1**: The main dashboard page SHALL conditionally render the "Hack the Kitty" hackathon theme banner if the URL contains `judgeview=true`
- **AC 3.2**: Skeletons SHALL display on dashboard tables while data is loading

### Requirement 4: Refactored AI Chat Experience
- **AC 4.1**: The empty chat panel SHALL show a pulsing SVG paw print icon (using Framer Motion springs)
- **AC 4.2**: The empty chat panel SHALL display helper feature pills and a veterinary disclaimer subtitle
- **AC 4.3**: Messages sent within 2 seconds of each other SHALL trigger a toast error message
- **AC 4.4**: Security information (local encryption details) SHALL display at the bottom of the chat view

### Requirement 5: Companion Life Phase Badges
- **AC 5.1**: Every pet profile card SHALL compute and show its growth stage based on species and age
- **AC 5.2**: Text select highlights SHALL be disabled on pet cards

### Requirement 6: Color Coding System & Grouping
- **AC 6.1**: Category tags SHALL map uniformly (Wellness/Checkup → Plum, Surgery → Red, Treatment → Amber, Consultation → Blue)
- **AC 6.2**: The Health Timeline page SHALL group entries dynamically by calendar year

### Requirement 7: Horizontal Vaccinations Summary
- **AC 7.1**: The vaccination overview cards SHALL be horizontal with padding reduced to 16px 24px
- **AC 7.2**: Action items SHALL show green ghost outline buttons for active items, hiding them once completed

### Requirement 8: Account Deletion Confirmations
- **AC 8.1**: Clicking "Delete Account" SHALL trigger a Radix UI `AlertDialog` popup modal instead of basic browser confirms
- **AC 8.2**: The delete option SHALL display warning text in red highlighting the destructive scope of operations
