# Setting Up the Development Environment

Before you can start working on Buzz About, there are a few things you'll have to set up on your computer.

If you're new to Minnesota Pollinators, you may also want to read the [getting started][Getting started] document, which gives an overview of how to set up your development environment.

**Table of Contents**

- [Tell `npm` how to talk to GitHub Packages](#tell-npm-how-to-talk-to-github-packages)
  - [Generating the personal access token](#generating-the-personal-access-token)
  - [Giving that personal access token to `npm`](#giving-that-personal-access-token-to-npm)
- [Installing the Angular command-line interface](#installing-the-angular-command-line-interface)
- [Setting up Firebase](#setting-up-firebase)
  - [Installing the command-line interface](#installing-the-command-line-interface)
  - [Running the emulator](#running-the-emulator)
  - [Setting up Firebase for Cypress](#setting-up-firebase-for-cypress)

## Tell `npm` how to talk to GitHub Packages

GitHub Packages is where we keep all of the images for the website, along with some data about flowers and bees. 

For `npm` read from GitHub Packages, you'll need to provide it with a personal access token.

### Generating the personal access token

You can create a personal access token by going to <https://github.com/settings/tokens> and clicking "Generate new token". Under "Scopes", you'll want to check `repo`, `read:packages`, `write:packages`, and `delete:packages`:

![The "New personal access token" page on GitHub, with those four scopes checked.][i:New personal access token]

Then, you can click "Generate token" at the bottom of the page. You'll get a token that looks like `745b0dcc742dedf87c67ff075f65eb87295e205f`. Keep that around.

### Giving that personal access token to `npm`

Next, open the command-line and run

```sh
npm login --registry=https://npm.pkg.github.com
```

 * When it asks for a username, enter your GitHub username.
 * When it asks for a password, paste in the personal access token (***not*** your GitHub password).
 * When it asks for your email, enter your GitHub email. 

Some sticking-points:

1. To paste text into PowerShell, right-click once.
2. On github.com/settings/tokens, the personal access token has a space after it&mdash;be careful that you don't copy that! :upside_down_face:

![github.com/settings/tokens with the extra space character highlighted][i:The gosh-darn whitespace]

If you run into trouble, you can always fall back to typing the personal access code by hand.

## Installing the Angular command-line interface

Angular provides a CLI with commands for some common operations, like `ng build`, `ng serve`, `ng lint`, and `ng test`. (There's also `ng generate`, which lets you quickly make a new component or service without having to write out the boilerplate every time.)

In order to use the Angular CLI, you'll need to install the `@angular/cli` package globally:

```sh
npm install -g @angular/cli
```

(If you're on a Unix system, you may need `sudo`.)

## Setting up Firebase

[Firebase][] is a set of cloud services provided by Google. We use a few of these services in Buzz About. Notably, we're using [Cloud Firestore][], a database that syncs between multiple clients in real time.

When working on Buzz About, you'll want to make sure your school Google account gets added to our Firebase project. (Professor KK should be able to add you.)

### Installing the command-line interface

Like Angular, Firebase provides a set of command-line tools. You can get these by running

```sh
npm install -g firebase-tools
```

The first command that you want to run is probably `firebase login`. This will open a web browser prompting you to log in with your Google account.

![PowerShell after running "firebase login". The program asks if it's okay to collect usage and error reporting, and then waits for authentication from the web browser.][i:Running firebase login]

![The browser window that "firebase login" spawns. It says that the Firebase CLI wants to view and manage your data across Google Cloud Platform services, view and administer all your Firebase data and settings, and view your cloud platform projects. At the bottom, there's an "Allow" button and a "Cancel" button.][i:Authenticating the Firebase CLI in the browser]

### Running the emulator

When you're developing Buzz About locally, it isn't able to talk to the production database, so you'll need to run a local emulator.

To run the the Firestore emulator locally, type

```sh
npm run firebase:emulator
```

Now, if you start up a local copy of Buzz About, it should be able to talk to the emulator. Also, if you go to localhost:4000 in a browser, you'll find a nifty little database console!

![The local Firebase console at localhost:4000][i:Local Firebase console]


### Setting up Firebase for Cypress

We use [Cypress](https://www.cypress.io/) for our end-to-end testing and use the [cypress-firebase](https://github.com/prescottprue/cypress-firebase) plugin to be able to communicate with Firebase for authentication and the Firebase emulator for Firebase. In addition to having installed `firebase-tools` and used `firebase login`, you will need a Firebase service account for end-to-end testing in Cypress. You can skip this part of the guide if you will not be using Cypress locally.

1. Go to the [service accounts section](https://console.firebase.google.com/project/buzz-about/settings/serviceaccounts/adminsdk) of the Firebase project settings.
2. In the "Firebase Admin SDK" section, click the "Generate new private key" button. Then click "Generate key" on the dialog.
3. It will download a JSON file. Copy this into the root of your local copy of the repo and rename it to `serviceAccount.json`. It should be ignored by git. NEVER commit this file to the repo or share it.

<!-- Links: -->
[Getting started]: https://github.com/mn-pollinators/getting-started/blob/master/README.md
[Firebase]: https://firebase.google.com/
[Cloud Firestore]: https://firebase.google.com/products/firestore

<!-- Images: -->
[i:New personal access token]: https://user-images.githubusercontent.com/56209343/89853567-569d2b80-db57-11ea-82d6-22bfd027b3a4.PNG
[i:The gosh-darn whitespace]: https://user-images.githubusercontent.com/56209343/89954475-c4e4fb00-dbf6-11ea-950f-2ce572e19a7e.png
[i:Running firebase login]: https://user-images.githubusercontent.com/56209343/89972375-52d6db00-dc23-11ea-83ca-411f89a6aac7.PNG
[i:Authenticating the Firebase CLI in the browser]: https://user-images.githubusercontent.com/56209343/89972377-536f7180-dc23-11ea-977e-48a254e8604c.PNG
[i:Local Firebase console]: https://user-images.githubusercontent.com/56209343/89973180-58352500-dc25-11ea-800d-2eeac828063b.PNG
