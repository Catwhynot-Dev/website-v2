# Physiology Practice Site

This repository hosts the Physiology quiz experience and supporting pages deployed on Vercel. It includes:

- A home page, article templates, and supporting layouts themed with the Special Elite typeface.
- A physiology quiz with drag, click, and type modes plus celebratory feedback on completion.
- Shared CSS and JavaScript modules (`css/theme.css`, `css/quiz.css`, `js/quiz.js`, `js/quiz-data.js`) for consistent styling and interactivity.

To explore locally, open `index.html` for the main site or `quiz/index.html` for the quiz interface.

## Deployment

The production deployment is driven by Vercel. Push the latest updates to the `main` branch and Vercel will automatically build
and release the site. A typical publish flow looks like:

1. Finish commits on your working branch and merge them into `main` (`git checkout main && git merge <feature-branch>`).
2. Push `main` to GitHub (`git push origin main`).
3. Monitor the Vercel dashboard (or the GitHub commit status) until the deployment completes, then refresh the live site.
