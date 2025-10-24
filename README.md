# Physiology Practice Site

This repository hosts the Physiology quiz experience and supporting pages deployed on Vercel. It includes:

- A home page, article templates, and supporting layouts themed with the Special Elite typeface.
- A physiology quiz with drag, click, and type modes plus celebratory feedback on completion.
- Shared CSS and JavaScript modules (`css/theme.css`, `css/quiz.css`, `js/quiz.js`, `js/quiz-data.js`) for consistent styling and interactivity.

To explore locally, open `index.html` for the main site or `quiz/index.html` for the quiz interface.

## File overview

- `css/theme.css` – Site-wide typography, layout, header/footer, and component styling.
- `css/quiz.css` – Quiz-specific layout, controls, dot styling, and celebration overlay rules.
- `js/quiz-data.js` – Image sources, label banks, and coordinate maps shared by all quiz modes.
- `js/quiz.js` – Quiz logic covering click/type/drag modes, review flows, and confetti celebration.
- `quiz/index.html` – Physiology quiz entry point that wires the shared assets together.

## Deployment

The production deployment is driven by Vercel. Push the latest updates to the `main` branch and Vercel will automatically build
and release the site. A typical publish flow looks like:

1. Finish commits on your working branch and merge them into `main` (`git checkout main && git merge <feature-branch>`).
2. Push `main` to GitHub (`git push origin main`).
3. Monitor the Vercel dashboard (or the GitHub commit status) until the deployment completes, then refresh the live site.

## Resolving merge conflicts

If GitHub reports conflicts while merging a pull request, check out the branch locally and run:

```bash
git checkout work               # switch to the pull request branch
git pull                        # ensure it is up to date
git checkout main
git pull origin main            # update your main branch
git checkout work
git merge main                  # bring the latest main into the branch
```

When merge markers appear in the physiology files (such as `css/quiz.css`, `js/quiz.js`, or `quiz/index.html`), prefer the versions from the pull request by keeping the code under the `<<<<<<< work` section and removing the conflicting `main` lines. After fixing the files, finish with:

```bash
git add css/quiz.css js/quiz.js quiz/index.html index.html
git commit
git push origin work
```

The pull request will update automatically, and you can merge it once the conflicts are cleared.
