# DermalCare AI

## Prerequisites

- [Node.js 22](https://nodejs.org/en/download)
- [Firebase CLI](https://firebase.google.com/docs/cli)
- [Genkit](https://firebase.google.com/products/genkit)

## Installation

### Root project

```sh
npm install
```

### Functions

```sh
cd functions
npm install
```

## Linting

### Root project

```sh
npm run lint
```

### Functions

```sh
npm run lint --prefix functions
```

## Build

### Root project

```sh
npm run build
```

### Functions

```sh
npm run build --prefix functions
```

## Deployment

### Root project

```sh
firebase deploy
```

### Functions

```sh
npm run deploy --prefix functions
```

## Setting up Secrets

Before deploying the functions, configure the required secrets:

```sh
firebase functions:secrets:set SPACE_BASE_URL
firebase functions:secrets:set API_NAME
firebase functions:secrets:set HF_TOKEN
```

These commands will prompt for the corresponding values and make them available to your deployed Cloud Functions. The functions now read configuration exclusively from Firebase Secrets, so a `.env` file or `dotenv` is not required in production.

## Troubleshooting

- **Windows line endings:** If scripts fail with `^M` characters on Windows, ensure Git uses LF endings by running `git config core.autocrlf false` and reinstalling dependencies or convert files using `dos2unix`.
- **TypeScript/ESLint compatibility:** Linting errors may occur if `typescript` and `@typescript-eslint/*` versions mismatch. Align the versions or upgrade both packages to compatible releases.
