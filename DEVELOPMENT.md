# Developing Buzz About

This is a guide to developing Buzz About. If you are new to the project, take a look at the [setup guide](./SETUP.md) for information on setting up the development environment.

**Table of Contents**
- [Running Buzz About](#running-buzz-about)
  - [Firebase Emulators](#firebase-emulators)
  - [Development Server](#development-server)
- [Testing](#testing)
  - [Running unit tests](#running-unit-tests)
  - [Running Cypress](#running-cypress)
  - [Running Firebase tests](#running-firebase-tests)
- [Additional Angular CLI commands](#additional-angular-cli-commands)
  - [Linting](#linting)
  - [Code scaffolding](#code-scaffolding)
  - [Further help](#further-help)

## Running Buzz About

### Firebase Emulators

To run the Firebase emulators:
```
npm run firebase:emulator
```

You should be able to access the Firebase Emulator Suite page at http://localhost:4000/

### Development Server

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

To open Cypress (so you can run the tests interactively), start both the Firebase emulators and the development server and run:
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
