# Homework Hub

A small, focused homework planner built with React, TypeScript and Vite.

## Run locally

```bash
npm install
npm start
```

The app is Expo + React Native. It runs on iOS, Android and web, and stores groups and notes locally with AsyncStorage.

For the browser/PWA:

```bash
npm run web
```

The web export includes a manifest and service worker.

## Deploy to GitHub Pages

1. Create a GitHub repository named `homework-hub`.
2. Push this folder to the `main` branch:

```bash
git init
git add .
git commit -m "Build homework hub"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/homework-hub.git
git push -u origin main
```

3. Build the static web export and publish the `dist` folder with GitHub Pages.

```bash
npm run build:web
```

4. Open the repository's **Settings > Pages**.
4. Under **Build and deployment**, choose **GitHub Actions**.
5. The workflow in `.github/workflows/deploy.yml` will publish the app automatically.

The app will be available at `https://YOUR_USERNAME.github.io/homework-hub/`.

If the repository has another name, update `base` in `vite.config.ts` to `/<repository-name>/` before pushing.
