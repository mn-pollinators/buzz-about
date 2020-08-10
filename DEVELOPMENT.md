# How to work on Buzz About

This is a fairly comprehensive guide to setting up a development environment, aimed at new students. You may already have some of the necessary programs installed&mdash;if so, you can just skip those steps!

This document is draws from prior writeups by [Paul Friederichsen][] and [Prof. Nic McPhee][].

**Table of Contents**

1. Creating a GitHub Account
2. Installing Visual Studio Code
3. Installing `git`
   1. On Windows
   2. On a Mac
4. Installing GitKraken

## Creating a GitHub Account

The code for BuzzAbout&mdash;along with its revision history&mdash;is stored on [GitHub][], a website for hosting software projects. To work on Buzz About, you're going to need to sign up for a GitHub account [here][Sign up for GitHub].

You'll want to join the [Minnesota Pollinators][] organization ([Prof. KK Lamberty][] can invite you).

Be sure to sign up for the [student developer pack][], as well!

## Installing Visual Studio Code

Next, in order to read and write the code, you're going to need a text editor. There are a lot of good options, but the one that we've been using is [Visual Studio Code][], particularly because of its [live share][] feature.

## Installing `git`

`git` is a version-control system: it keeps track of all of the changes made to the project, and lets several people work on the same code in parallel.

### On Windows

If you're on windows, you can go [here][install git for Windows] to download `git`.

When the installer asks you to choose the default editor, you may want to select Visual Studio Code. Other than that, the default options should be just fine.

### On a Mac

If you're on a Mac, you can get `git` as part of the XCode command-line developer tools. Open up Terminal.app and type `git --version`:

You'll get a pop-up asking you to install the developer tools:

If you don't get a pop-up, but instead get a version number like this, that means `git` is already installed.

## Installing GitKraken

`git` by itself is very spare, so we've been using it through a program called [GitKraken][]. (This program has a nice chart showing all of the changes over time.) You can use GitKraken for free, but you actually have access to the Pro version through GitHub's student developer pack.

Once you've installed GitKraken, you're going to want to download the Buzz About code onto your computer. To do this, click the "Clone a repo" button on the left, and type in the url `https://github.com/mn-pollinators/buzz-about.git`. Now, you should be able to see the whole history of the project!


[Paul Friederichsen]: https://github.com/floogulinc
[Prof. Nic McPhee]: https://github.com/nicmcphee
[Prof. KK Lamberty]: https://github.com/kklamberty
[GitHub]: https://github.com
[Minnesota Pollinators]: https://github.com/mn-pollinators
[student developer pack]: https://education.github.com/pack
[Sign up for GitHub]: https://github.com/join
[Visual Studio Code]: https://code.visualstudio.com/
[live share]: https://docs.microsoft.com/en-us/visualstudio/liveshare/
[install git for Windows]: https://git-scm.com/download
[GitKraken]: https://www.gitkraken.com/
