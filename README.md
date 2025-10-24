# Physiology Practice Site

This repository hosts a physiology-themed quiz and supporting static pages deployed to Vercel. It includes the main landing
experience, reusable article templates, and the fully interactive quiz at `/quiz/`.

## Key files

- `index.html` – Entry point for the public site.
- `quiz/index.html` – Loads the physiology quiz interface.
- `css/theme.css` – Shared typography, layout, header, and footer rules.
- `css/quiz.css` – Quiz layout, controls, dot styling, and celebration overlay.
- `js/quiz-data.js` – Image sources, word banks, and coordinate maps used by the quiz.
- `js/quiz.js` – Quiz logic for click, type, and drag modes plus review and celebration flows.

To preview locally, open `index.html` (homepage) or `quiz/index.html` (quiz) in a browser.
