# PerfectExpress V2 (Frontend)

This directory contains the modernized "Noir/Cinematic" frontend interface for PerfectExpress.

## Tech Stack
*   **React 19**: Latest React features.
*   **Tailwind CSS**: Utility-first styling with a custom "Cinematic Luxury" design system.
*   **Framer Motion**: Advanced animations and transitions.
*   **Google GenAI SDK**: Powered by Gemini 3 Flash for intelligent tracking insights and customer support.

## Setup
This project uses ES Modules via CDN (esm.sh) for a build-free development experience, compatible with the legacy backend structure.

1.  **Environment Variables**:
    Ensure you have a valid `API_KEY` for Google Gemini available in your environment or injected via your build pipeline.

2.  **Running Locally**:
    Run a static server in this directory:
    ```bash
    npx serve .
    # or
    python3 -m http.server 8000
    ```

## Design System
The UI follows a strict "Industrial Luxury" aesthetic:
*   **Fonts**: Manrope (Headings), Inter (Body/UI).
*   **Colors**: Slate/Black backgrounds with Red-600 accents.
*   **Interaction**: Hover effects, glassmorphism, and smooth page transitions.
