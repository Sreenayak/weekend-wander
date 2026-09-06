# Weekend Wander

Weekend Wander is a frontend-only destination discovery experience for finding a short, memorable weekend trip. It uses mock destination data, a calm editorial visual language, and a lightweight interaction layer to help users browse by mood, search destinations, save favorites, and start a simple trip shortlist.

## Project structure

```text
weekend-wander/
├── index.html   # Semantic page structure, content, and Tailwind CDN setup
├── styles.css   # Custom visual system, responsive layout, animations, and modal styling
├── script.js    # Destination data and all client-side interactions
├── logo.svg     # Local Weekend Wander brand mark and favicon
└── README.md    # Project overview and usage notes
```

## Run locally

No build step or package installation is required.

1. Open `index.html` directly in a browser, or use VS Code Live Server.
2. Make sure the browser has an internet connection so the Google Fonts, Tailwind CDN, and Unsplash imagery can load.

## Included functionality

- Responsive editorial landing page with hero, destination discovery, mood collections, and process sections.
- Search destinations by name, country, category, or descriptive feeling.
- Filter destinations by all escapes, coastal, city breaks, or nature.
- Save and remove destinations using browser `localStorage`.
- “Surprise me” random destination picker.
- Mood collection shortcuts that map directly to destination filters.
- Trip-builder modal that sends a selected preference to the discovery grid.
- Sort destinations by featured order, budget, trip length, or name.
- Open a mini destination guide with travel length, spend level, best season, and highlights.
- Dedicated saved-trip shortlist with remove controls and clipboard copy.
- Saved-only discovery mode from the header Saved control.
- Realistic estimated prices per person for each destination, shown in cards, guides, and saved plans.
- Animated sign-in and account creation gate before the travel experience.
- Frontend-only session persistence with sign-out using browser `localStorage`.
- Authenticated profile avatar in the header with the user name, email, and red logout action.
- Slide-up app entrance and staggered scroll-reveal animations for discovery content.
- Reduced-motion support through `prefers-reduced-motion`.
- Responsive layouts for desktop, tablet, and mobile widths.

## Technical notes

- The project intentionally uses plain HTML, Tailwind CSS via CDN, custom CSS, and vanilla JavaScript.
- Destination data lives in the `destinations` array in `script.js`, making it easy to replace the mock content with an API later.
- Images are remote Unsplash URLs and are used as static presentation assets.
- The local `logo.svg` is used for the favicon, header, and footer brand identity.
- Saved destination IDs are stored under `weekend-wander-saved` in `localStorage`.
- Auth sessions are stored under `weekend-wander-session` in `localStorage`; this is a mock frontend flow and does not provide production security or a backend account system.