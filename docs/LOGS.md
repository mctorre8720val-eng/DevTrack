Update and store the timeline and the problems we encountered

### Timeline

- 2026-06-26: Reset Firebase init and inlined config into `src/services/firebaseConfig.js`.
- 2026-06-26: Updated `src/services/firebase.js` to use explicit `.js` imports for Node and to call `initializeApp(firebaseConfig)`.
- 2026-06-26: Ran `scripts/smokeTest.mjs` — write OK: EbcuN4alAzuxt6DcmZ8o
- 2026-06-26: Ran `scripts/e2eAuthProject.mjs` — AUTH_OK HOqDvZ1YY6ffXmu1NxOuit9f7dE2, PROJECT_OK gI9Ck8G8nA39OCEnc5N3

## How we fixed it

- Ensured the inlined Firebase config matches the Console project and used it directly from `src/services/firebaseConfig.js`.
- Fixed local module imports by adding `.js` extensions for Node ESM compatibility.
- Validated Firestore connectivity by running a standalone smoke test and an end-to-end Auth+Project script which performed a user sign-up and a Firestore write.
