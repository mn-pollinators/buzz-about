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

![GitHub's "sign up" page][i:Signing up for GitHub]

You'll want to join the [Minnesota Pollinators][] organization ([Prof. KK Lamberty][] can invite you).

Be sure to sign up for the [student developer pack][], as well!

![The student developer pack's webpage][i:Student developer pack]

## Installing Visual Studio Code

Next, in order to read and write the code, you're going to need a text editor. There are a lot of good options, but the one that we've been using is [Visual Studio Code][], particularly because of its [live share][] feature.

![Visual Studio Code][i:VS Code]

## Installing `git`

`git` is a version-control system: it keeps track of all of the changes made to the project, and lets several people work on the same code in parallel.

### On Windows

If you're on windows, you can go [here][install git for Windows] to download `git`.

When the installer asks you to choose the default editor, you may want to select Visual Studio Code. Other than that, the default options should be just fine.

![The git installer program on Windows][i:Windows, installing git]

### On a Mac

If you're on a Mac, you can get `git` as part of the XCode command-line developer tools. Open up Terminal.app and type `git --version`:

![Terminal.app with the command "git --version" typed][i:Mac, before installing git]

You'll get a pop-up asking you to install the developer tools:

![The pop-up window asking if you'd like to install the tools][i:Mac, installing git]

If you don't get a pop-up, but instead get a version number like this, that means `git` is already installed.

![Terminal.app showing the command "git --version" and the output "git version 2.24.3 (Apple Git-128)"][i:Mac, after installing git]

## Installing GitKraken

`git` by itself is very spare, so we've been using it through a program called [GitKraken][]. (This program has a nice chart showing all of the changes over time.) You can use GitKraken for free, but you actually have access to the Pro version through GitHub's student developer pack.

![The screen GitKraken shows when it first launches][i:GitKraken splash page]

Once you've installed GitKraken, you're going to want to download the Buzz About code onto your computer. To do this, click the "Clone a repo" button on the left, and type in the url `https://github.com/mn-pollinators/buzz-about.git`. Now, you should be able to see the whole history of the project!

![The screen GitKraken shows when you've opened a repo][i:GitKraken graph view]

<!-- Links: -->
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

<!-- Images: -->
[i:Signing up for GitHub]:https://user-images.githubusercontent.com/56209343/89746895-bb865200-da81-11ea-9dbc-1779b40768d6.PNG
[i:Student developer pack]: https://user-images.githubusercontent.com/56209343/89746740-f1770680-da80-11ea-86dc-c0aa7ef0e0b4.PNG
[i:VS Code]: https://user-images.githubusercontent.com/56209343/89746720-e15f2700-da80-11ea-920e-7219d47b4a83.PNG
[i:Windows, installing git]: https://user-images.githubusercontent.com/56209343/89746832-69ddc780-da81-11ea-94fd-04cd0290fb96.PNG
[i:Mac, before installing git]: https://user-images.githubusercontent.com/56209343/89746736-f0de7000-da80-11ea-9ab5-cf48acd6b5f7.png
[i:Mac, installing git]: https://user-images.githubusercontent.com/56209343/89746735-f0de7000-da80-11ea-9075-abcefdc23124.png
[i:Mac, after installing git]: https://user-images.githubusercontent.com/56209343/89746734-f045d980-da80-11ea-8944-f2b0de3b2ecb.png
[i:GitKraken splash page]: https://user-images.githubusercontent.com/56209343/89746747-ff2c8c00-da80-11ea-9065-4c7b3dbb9f6a.PNG
[i:GitKraken graph view]: https://user-images.githubusercontent.com/56209343/89746748-00f64f80-da81-11ea-85dc-6a7334f18252.PNG
