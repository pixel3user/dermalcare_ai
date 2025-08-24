# DermalCare AI

## Setting up Secrets

Before deploying the functions, configure the required secrets:

```sh
firebase functions:secrets:set SPACE_BASE_URL
firebase functions:secrets:set API_NAME
firebase functions:secrets:set HF_TOKEN
```

These commands will prompt for the corresponding values and make them available to your deployed Cloud Functions.
