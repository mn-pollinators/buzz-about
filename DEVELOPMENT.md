# Developing Buzz About

This is a guide to developing Buzz About. If you are new to the project, take a look at the [setup guide](./SETUP.md) for information on setting up the development environment.

**Table of Contents**
- [Running Buzz About](#running-buzz-about)
  - [Firebase Emulators](#firebase-emulators)
  - [Development server](#development-server)
- [Testing](#testing)
  - [Running unit tests](#running-unit-tests)
  - [Running Cypress](#running-cypress)
  - [Running Firebase tests](#running-firebase-tests)
- [Additional Angular CLI commands](#additional-angular-cli-commands)
  - [Linting](#linting)
  - [Code scaffolding](#code-scaffolding)
  - [Further help](#further-help)
- [Useful links](#useful-links)
  - [Deployment locations](#deployment-locations)

## Running Buzz About

### Firebase Emulators

To run the Firebase emulators:
```
npm run firebase:emulator
```

You should be able to access the Firebase Emulator Suite console at http://localhost:4000/

### Development server

To run the development server:
```
ng serve
```

Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.


## Testing

### Running unit tests

To run the unit tests:
```
ng test
```

### Running Cypress

To build the app and run the Cypress end-to-end tests, start the Firebase emulators and run:
```
npm run e2e
```

To open Cypress (so you can run the tests interactively), start both the development server and the Firebase emulators and run:
```
npm run cy:open
```

### Running Firebase tests

With the Firebase emulators already running, run:
```
npm run firestore-specs
```

To start the Firebase emulators and run through the Firebase tests:
```
npm run test-firestore
```

## Additional Angular CLI commands

### Linting

To run the Angular linting tools:
```
ng lint
```

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Further help

To get more help on the Angular CLI use `ng help`.

## Useful links

- [Firebase console](https://console.firebase.google.com/project/buzz-about/overview)
- [Vercel project](https://vercel.com/mn-pollinators/buzz-about)
- [Cypress dashboard](https://dashboard.cypress.io/projects/zrfvs1)
- [GitHub Actions](https://github.com/mn-pollinators/buzz-about/actions)

### Deployment locations

- Primary deployment on Firebase: [buzzabout.app](https://buzzabout.app/)
  - Deploys the latest commit from `master` using [this](https://github.com/mn-pollinators/buzz-about/actions?query=workflow%3A%22Firebase+Deploy%22) GitHub Actions workflow.
  - Alternate URLs: [buzz-about.web.app](https://buzz-about.web.app/) and [buzz-about.firebaseapp.com](https://buzz-about.firebaseapp.com/)
- Vercel `master` deployment: [buzz-about.now.sh](https://buzz-about.now.sh/)
  - Vercel also deploys every commit from every branch automatically.
  - Alternate URLs: [buzz-about.mn-pollinators.vercel.app](https://buzz-about.mn-pollinators.vercel.app/) and [buzz-about.mn-pollinators.now.sh](https://buzz-about.mn-pollinators.now.sh/)
