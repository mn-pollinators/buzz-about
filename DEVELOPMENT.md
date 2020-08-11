# How to work on Buzz About

This is a fairly comprehensive guide to setting up a development environment, aimed at new students. You may already have some of the necessary programs installed&mdash;if so, you can just skip those steps!

This document is draws from prior writeups by [Paul Friederichsen][] and [Prof. Nic McPhee][].

**Table of Contents**

- [Creating a GitHub Account](#creating-a-github-account)
- [Installing Visual Studio Code](#installing-visual-studio-code)
- [Installing `git`](#installing-git)
  - [On Windows](#on-windows)
  - [On a Mac](#on-a-mac)
- [Installing GitKraken](#installing-gitkraken)
- [Installing `npm`](#installing-npm)
- [Telling `npm` how to talk to GitHub Packages](#telling-npm-how-to-talk-to-github-packages)
  - [Generating the personal access token](#generating-the-personal-access-token)
  - [Giving that personal access token to `npm`](#giving-that-personal-access-token-to-npm)
- [Installing all of the third-party libraries](#installing-all-of-the-third-party-libraries)

## Creating a GitHub Account

The code for BuzzAbout&mdash;along with its revision history&mdash;is stored on [GitHub][], a website for hosting software projects. To work on Buzz About, you're going to need to sign up for a GitHub account [here][Sign up for GitHub].

![GitHub's "sign up" page][i:Signing up for GitHub]

You'll want to join the [Minnesota Pollinators][] organization ([Prof. KK Lamberty][] can invite you).

Be sure to sign up for the [student developer pack][Student developer pack], as well!

![The student developer pack's webpage][i:Student developer pack]

## Installing Visual Studio Code

Next, in order to read and write the code, you're going to need a text editor. There are a lot of good options, but the one that we've been using is [Visual Studio Code][], particularly because of its [live share][Live share] feature.

![Visual Studio Code][i:VS Code]

## Installing `git`

`git` is a version-control system: it keeps track of all of the changes made to the project, and lets several people work on the same code in parallel.

### On Windows

If you're on Windows, you can go [here][Install git for Windows] to download `git`.

When the installer asks you to choose the default editor, you may want to select Visual Studio Code. Other than that, the default options should be just fine.

![The git installer program on Windows, asking what the default editor should be, with "Visual Studio Code" selected][i:Windows, installing git]

### On a Mac

If you're on a Mac, you can get `git` as part of the XCode command-line developer tools. Open up Terminal and type `git --version`:

<img width="638" alt="Terminal with the command &quot;git --version&quot; typed" src="https://user-images.githubusercontent.com/56209343/89746736-f0de7000-da80-11ea-9ab5-cf48acd6b5f7.png">

You'll get a pop-up asking you to install the developer tools:

<img width="573" alt="The pop-up window asking if you'd like to install the tools" src="https://user-images.githubusercontent.com/56209343/89746735-f0de7000-da80-11ea-9075-abcefdc23124.png">

If you don't get a pop-up, but instead get a version number like this, that means `git` is already installed.

<img width="682" alt="Terminal showing the command &quot;git --version&quot; and the output &quot;git version 2.24.3 (Apple Git-128)&quot;" src="https://user-images.githubusercontent.com/56209343/89746734-f045d980-da80-11ea-8944-f2b0de3b2ecb.png">

## Installing GitKraken

`git` by itself is very spare, so we've been using it through a program called [GitKraken][]. (This program has a nice chart showing all of the changes over time.) You can use GitKraken for free, but you actually have access to the Pro version through GitHub's student developer pack.

![The screen GitKraken shows when it first launches][i:GitKraken splash page]

Once you've installed GitKraken, you're going to want to download the Buzz About code onto your computer. To do this, click the "Clone a repo" button on the left, and type in the `git` URL for the project. (You can find this URL on Buzz About's GitHub page under the "Code" dropdown:)

![The GitHub page for Buzz About, with the "Code" dropdown menu open, showing the title "Clone with HTTPS" and the start of the URL][i:Cloning from GitHUb]

Now, you should be able to see the whole history of the project!

![The screen that GitKraken shows when you've opened a repo][i:GitKraken graph view]

## Installing `npm`

At this point, you should have all of the code for Buzz About on your computer, but you still don't have a way to run it. For that, you'll need to install `npm`, the one-stop shop for everything JavaScript.

`npm` comes as part of the Node project, which you can download [here][Node.js]. The LTS (long-term support) version should be fine.

On Windows, you'll be asked if you want to install tools for native modules. We don't have any native modules in this project, but you'll probably want to check that box anyway, in case you want to install any in the future. (Installing tools for native modules may take a while.)

![The npm installer asking whether you'd like tools for native modules, with the checkbox checked][i:Windows, installing npm]

## Telling `npm` how to talk to GitHub Packages

GitHub Packages is where we keep all of the images for the website, along with some data about flowers and bees. 

For `npm` read from GitHub Packages, you'll need to provide it with a personal access token.

### Generating the personal access token

You can create a personal access token by going to <https://github.com/settings/tokens> and clicking "Generate new token". Under "Scopes", you'll want to check `repo`, `read:packages`, `write:packages`, and `delete:packages`:

![The "New personal access token" page on GitHub, with those four scopes checked.][i:New personal access token]

Then, you can click "Generate token" at the bottom of the page. You'll get a token that looks like `745b0dcc742dedf87c67ff075f65eb87295e205f`. Keep that around.

### Giving that personal access token to `npm`

Next, open the command-line (Terminal on the Mac; PowerShell on Windows) and run

```sh
npm login --registry=https://npm.pkg.github.com
```

 * When it asks for a username, enter your GitHub username.
 * When it asks for a password, paste in the personal access token (***not*** your GitHub password).
 * When it asks for your email, enter your GitHub email. 

![Powershell after running "npm login --registry=https://npm.pkg.github.com". The output "Logged in as helloworld12321demo on https://npm.pkg.github.com/" is shown.][i:Logging in to npm]

Some sticking-points:

1. For security reasons, what you type into the "password" field is invisible.
2. To paste text into PowerShell, right-click once.
3. On github.com/settings/tokens, the personal access token has a space after it&mdash;be careful that you don't copy that! :upside_down_face:

![github.com/settings/tokens with the extra space character highlighted][i:The gosh-darn whitespace]

If you run into trouble, you can always fall back to typing the personal access code by hand.

## Installing all of the third-party libraries

Buzz About uses code from several third-party packages. You can install all of these packages at once using `npm`.

Open up the command-line. First, you'll want to navigate to the folder where you downloaded Buzz About. You can do this by running

```PowerShell
cd C:\wherever\you\downloaded\buzz-about
```

on Windows, or

```sh
cd /wherever/you/downloaded/buzz-about
```

on a Mac. (The `cd` here stands for "change directory".)

Then, run

```sh
npm install
```

to download all of the third-party libraries.

![PowerShell after running "Set-Location D:\joe\Documents\buzz-about" and "npm install". The command is halfway through running.][i:Running npm install]

Note that the third-party libraries are installed within this project&mdash; they're downloaded into a folder named `buzz-about/node_modules`. If you have another project on your computer, it will have its own set of libraries.

<!-- Links: -->
[Paul Friederichsen]: https://github.com/floogulinc
[Prof. Nic McPhee]: https://github.com/nicmcphee
[Prof. KK Lamberty]: https://github.com/kklamberty
[GitHub]: https://github.com
[Minnesota Pollinators]: https://github.com/mn-pollinators
[Student developer pack]: https://education.github.com/pack
[Sign up for GitHub]: https://github.com/join
[Visual Studio Code]: https://code.visualstudio.com/
[Live share]: https://docs.microsoft.com/en-us/visualstudio/liveshare/
[Install git for Windows]: https://git-scm.com/download
[GitKraken]: https://www.gitkraken.com/git-client
[Node.js]: https://nodejs.org/

<!-- Images: -->
[i:Signing up for GitHub]:https://user-images.githubusercontent.com/56209343/89746895-bb865200-da81-11ea-9dbc-1779b40768d6.PNG
[i:Student developer pack]: https://user-images.githubusercontent.com/56209343/89746740-f1770680-da80-11ea-86dc-c0aa7ef0e0b4.PNG
[i:VS Code]: https://user-images.githubusercontent.com/56209343/89746720-e15f2700-da80-11ea-920e-7219d47b4a83.PNG
[i:Windows, installing git]: https://user-images.githubusercontent.com/56209343/89847231-1040d000-db49-11ea-898b-4ae52f19326c.PNG
[i:GitKraken splash page]: https://user-images.githubusercontent.com/56209343/89746747-ff2c8c00-da80-11ea-9065-4c7b3dbb9f6a.PNG
[i:Cloning from GitHub]: https://user-images.githubusercontent.com/56209343/89918462-aadbf600-dbbf-11ea-9e3a-7abe5fbd3d37.PNG
[i:GitKraken graph view]: https://user-images.githubusercontent.com/56209343/89746748-00f64f80-da81-11ea-85dc-6a7334f18252.PNG
[i:Windows, installing npm]: https://user-images.githubusercontent.com/56209343/89849965-4bde9880-db4f-11ea-8208-d64811844f57.PNG
[i:New personal access token]: https://user-images.githubusercontent.com/56209343/89853567-569d2b80-db57-11ea-82d6-22bfd027b3a4.PNG
[i:Logging in to npm]: https://user-images.githubusercontent.com/56209343/89855121-42f3c400-db5b-11ea-9d29-faaa20e5d90a.PNG
[i:The gosh-darn whitespace]: https://user-images.githubusercontent.com/56209343/89855344-e218bb80-db5b-11ea-9e2a-21881e0fe457.PNG
[i:Running npm install]: https://user-images.githubusercontent.com/56209343/89921641-9699f800-dbc3-11ea-86e8-d1179d552fd6.PNG
