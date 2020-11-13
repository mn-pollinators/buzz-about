// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

// Cypress-firebase has a bad index.d.ts file, so we can't import
// 'cypress-firebase' directly; we have to skip the index.d.ts and import
// 'cypress-firebase/lib' from within the package.
//
// See: https://github.com/prescottprue/cypress-firebase/issues/173
import { attachCustomCommands } from 'cypress-firebase/lib';

import { environment } from '../../src/environments/environment';

const fbConfig = environment.firebase;


firebase.initializeApp(fbConfig);

// Use the emulated Firestore
firebase.firestore().settings(environment.firestoreSettings);

attachCustomCommands({ Cypress, cy, firebase });
