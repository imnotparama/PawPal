# Requirements Document

## Introduction

PawPal AI is a smart pet health companion application. This specification covers the landing/marketing page and application shell UI — a visually stunning dark cosmic design that uses particle constellations forming pet silhouettes, following the Dala design system adapted for pet healthcare. The focus is on visual impact for hackathon judging, with no backend logic at this stage.

## Glossary

- **Landing_Page**: The public-facing scroll-based marketing page with full-bleed dark canvas sections showcasing PawPal AI features
- **App_Shell**: The authenticated application layout containing navigation and placeholder route pages for future feature development
- **Particle_Constellation**: An animated visual element composed of thousands of tiny geometric shapes (triangles, circles, diamonds, 2-6px) that cluster into organic pet silhouettes
- **Dala_Design_System**: The dark cosmic design system defining colors, typography, spacing, and visual rules for the application
- **Hero_Section**: The first visible section of the Landing_Page featuring a cat particle constellation and primary call-to-action
- **Dog_Section**: The second Landing_Page section featuring a dog particle constellation and AI symptom detection messaging
- **Bot_Cat_Section**: The third Landing_Page section featuring an AI bot and cat particle constellation with login/signup CTA
- **Fixed_Nav**: The persistent top navigation bar visible across all Landing_Page sections
- **CTA_Button**: A pill-shaped interactive button with 24px border radius using plum voltage (#8052ff) as fill color
- **Design_Token**: A named value from the Dala_Design_System used consistently across components (colors, spacing, typography)
- **Void_Black**: The #000000 background color used as the single surface layer throughout the application
- **Plum_Voltage**: The #8052ff accent color used exclusively for primary CTAs and filled interactive elements
- **Amber_Spark**: The #ffb829 secondary accent used only for outlines, never as a primary CTA fill
- **Lichen**: The #15846e decorative color used for icon accents and particle nodes

## Requirements

### Requirement 1: Landing Page Fixed Navigation

**User Story:** As a visitor, I want a persistent navigation bar at the top of the landing page, so that I can access key sections and the app entry point from anywhere on the page.

#### Acceptance Criteria

1. THE Fixed_Nav SHALL display the PawPal AI logo aligned to the left
2. THE Fixed_Nav SHALL display navigation links (FEATURES, ABOUT, CONTACT) center-right with weight 600-700, 12-14px, uppercase, letter-spacing +0.05em
3. THE Fixed_Nav SHALL display a pill-shaped "GET STARTED" CTA_Button aligned to the far right with Plum_Voltage fill and 24px border radius
4. WHILE the user scrolls the Landing_Page, THE Fixed_Nav SHALL remain fixed at the top of the viewport
5. THE Fixed_Nav SHALL use Void_Black as background with a hairline bottom border of 1px solid white at low opacity

### Requirement 2: Hero Cat Section

**User Story:** As a visitor, I want to see an impressive hero section with an animated cat constellation, so that I am immediately captivated by the product's visual identity and understand its purpose.

#### Acceptance Criteria

1. THE Hero_Section SHALL display a Particle_Constellation forming a cat silhouette on the right half of the viewport
2. THE Hero_Section SHALL display an eyebrow kicker text above the headline on the left half using secondary text color (#bdbdbd)
3. THE Hero_Section SHALL display a display headline with weight 200, size 78-113px, letter-spacing -0.04em, and #ffffff color on the left half
4. THE Hero_Section SHALL display body text below the headline with weight 400, size 15-18px, letter-spacing +0.025em, and secondary text color
5. THE Hero_Section SHALL display a primary CTA_Button below the body text with Plum_Voltage fill and 24px border radius
6. THE Particle_Constellation SHALL animate using Framer Motion with subtle floating movement to create a living, breathing effect
7. THE Particle_Constellation SHALL consist of geometric shapes (triangles, circles, diamonds) sized 2-6px using palette colors including Lichen for particle nodes

### Requirement 3: Dog Section

**User Story:** As a visitor, I want to see a dedicated dog section with particle art, so that I understand PawPal AI serves dog owners with AI-powered health features.

#### Acceptance Criteria

1. THE Dog_Section SHALL display a Particle_Constellation forming a dog silhouette
2. THE Dog_Section SHALL display a slogan about dog health and AI care with display headline typography (weight 200, 78-113px, letter-spacing -0.04em)
3. THE Dog_Section SHALL display body text explaining AI symptom detection for dogs with weight 400, 15-18px, letter-spacing +0.025em
4. THE Dog_Section SHALL maintain 60px vertical gap from adjacent sections
5. THE Dog_Section SHALL use centered or left-aligned text layout

### Requirement 4: Bot and Cat Section with Authentication CTA

**User Story:** As a visitor, I want to see an AI-themed section with a clear path to sign up or log in, so that I can transition from browsing to using the application.

#### Acceptance Criteria

1. THE Bot_Cat_Section SHALL display a Particle_Constellation depicting an AI bot alongside a cat
2. THE Bot_Cat_Section SHALL display a slogan about AI-powered pet care with display headline typography
3. THE Bot_Cat_Section SHALL display a login/signup CTA or form directing users toward authentication
4. THE Bot_Cat_Section SHALL maintain 60px vertical gap from adjacent sections
5. THE Bot_Cat_Section SHALL use the same Dala_Design_System tokens as all other sections

### Requirement 5: Particle Constellation System

**User Story:** As a visitor, I want to see stunning animated particle effects that form recognizable pet shapes, so that the application feels premium and visually memorable.

#### Acceptance Criteria

1. THE Particle_Constellation SHALL render thousands of geometric shapes (triangles, circles, diamonds) sized between 2px and 6px
2. THE Particle_Constellation SHALL use Dala_Design_System palette colors with Lichen (#15846e) as primary particle node color
3. THE Particle_Constellation SHALL animate with Framer Motion producing smooth floating, pulsing, or drifting motion
4. THE Particle_Constellation SHALL cluster shapes into recognizable organic pet forms (cat, dog, bot silhouettes)
5. WHEN the Landing_Page section containing a Particle_Constellation scrolls into the viewport, THE Particle_Constellation SHALL trigger an entrance animation
6. THE Particle_Constellation SHALL maintain performance with no visible frame drops during animation

### Requirement 6: Dala Design System Implementation

**User Story:** As a developer, I want a consistent design token system applied throughout the application, so that all components follow the dark cosmic aesthetic without deviation.

#### Acceptance Criteria

1. THE Dala_Design_System SHALL define Void_Black (#000000) as the single background color with no nested surface layers
2. THE Dala_Design_System SHALL define primary text as #ffffff, secondary text as #bdbdbd, and tertiary text as #9a9a9a
3. THE Dala_Design_System SHALL define Plum_Voltage (#8052ff) as the only filled chromatic color for CTAs
4. THE Dala_Design_System SHALL define Amber_Spark (#ffb829) for outlines only, never as a primary CTA fill
5. THE Dala_Design_System SHALL define Lichen (#15846e) for icon accents and particle nodes only
6. THE Dala_Design_System SHALL enforce 24px border radius on all interactive elements (buttons, cards, navigation items)
7. THE Dala_Design_System SHALL use Inter or Space Grotesk font family throughout the application
8. THE Dala_Design_System SHALL enforce no shadows, no gradients, and no elevation — depth comes from color contrast and void only
9. THE Dala_Design_System SHALL define hairline borders as 1px solid white at low opacity
10. THE Dala_Design_System SHALL define page max-width as 1200px, section gaps as 60px, card padding as 24px, and element gap as 15px

### Requirement 7: App Shell Navigation and Layout

**User Story:** As an authenticated user, I want a clear navigation structure in the app shell, so that I can access all pet health features from a consistent layout.

#### Acceptance Criteria

1. THE App_Shell SHALL display a sidebar or top navigation containing links to: Dashboard, My Pets, AI Chat, Vaccinations, Medical Records, Health Timeline
2. THE App_Shell SHALL maintain the dark theme consistent with the Landing_Page using Dala_Design_System tokens
3. THE App_Shell SHALL use React Router v6 to render placeholder pages for each navigation route
4. WHEN a navigation link is clicked, THE App_Shell SHALL navigate to the corresponding route without full page reload
5. THE App_Shell SHALL display the active route with visual distinction using Plum_Voltage color

### Requirement 8: App Shell Placeholder Pages

**User Story:** As a developer, I want placeholder pages for each app route, so that the navigation structure is demonstrable and ready for future feature implementation.

#### Acceptance Criteria

1. THE App_Shell SHALL render a placeholder page for Dashboard route displaying a page title and descriptive placeholder content
2. THE App_Shell SHALL render a placeholder page for My Pets route displaying a page title and descriptive placeholder content
3. THE App_Shell SHALL render a placeholder page for AI Chat route displaying a page title and descriptive placeholder content
4. THE App_Shell SHALL render a placeholder page for Vaccinations route displaying a page title and descriptive placeholder content
5. THE App_Shell SHALL render a placeholder page for Medical Records route displaying a page title and descriptive placeholder content
6. THE App_Shell SHALL render a placeholder page for Health Timeline route displaying a page title and descriptive placeholder content
7. WHEN a placeholder page is rendered, THE App_Shell SHALL style the page title with display headline typography and the placeholder content with body text typography

### Requirement 9: Responsive Layout and Scroll Behavior

**User Story:** As a visitor on any device, I want the landing page to display correctly and scroll smoothly, so that the experience is polished regardless of screen size.

#### Acceptance Criteria

1. THE Landing_Page SHALL use full-bleed sections spanning the entire viewport width on Void_Black background
2. THE Landing_Page SHALL constrain text content to a maximum width of 1200px centered horizontally
3. WHEN the viewport width is below 768px, THE Landing_Page SHALL stack the particle constellation below the text content in each section
4. THE Landing_Page SHALL implement smooth scroll behavior with Framer Motion scroll-triggered transitions between sections
5. THE Landing_Page SHALL maintain 60px gaps between all sections

### Requirement 10: Project Structure and Tech Stack

**User Story:** As a developer, I want a well-organized project using modern tooling, so that the codebase is maintainable and performant for rapid hackathon development.

#### Acceptance Criteria

1. THE project SHALL use Vite as the build tool with React 18 and TypeScript
2. THE project SHALL use Tailwind CSS v4 configured with Dala_Design_System design tokens
3. THE project SHALL use React Router v6 for client-side routing
4. THE project SHALL use Framer Motion for all animations including particle effects and scroll transitions
5. THE project SHALL organize source code under /client/src with directories for components, pages, styles, assets, and lib
6. THE project SHALL use shadcn/ui as base component library styled to match the dark cosmic theme
