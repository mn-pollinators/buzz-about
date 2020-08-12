# Developing Buzz About

Before you can start working on Buzz About, there are a few things you'll have to set up on your computer.

**Table of Contents**

- [Tell `npm` how to talk to GitHub Packages](#tell-npm-how-to-talk-to-github-packages)
  - [Generating the personal access token](#generating-the-personal-access-token)
  - [Giving that personal access token to `npm`](#giving-that-personal-access-token-to-npm)

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

![Powershell after running "npm login --registry=https://npm.pkg.github.com". The output "Logged in as helloworld12321demo on https://npm.pkg.github.com/" is shown.][i:Logging in to npm]

Some sticking-points:

1. To paste text into PowerShell, right-click once.
2. On github.com/settings/tokens, the personal access token has a space after it&mdash;be careful that you don't copy that! :upside_down_face:

![github.com/settings/tokens with the extra space character highlighted][i:The gosh-darn whitespace]

If you run into trouble, you can always fall back to typing the personal access code by hand.


<!-- Links: -->


<!-- Images: -->
[i:New personal access token]: https://user-images.githubusercontent.com/56209343/89853567-569d2b80-db57-11ea-82d6-22bfd027b3a4.PNG
[i:Logging in to npm]: https://user-images.githubusercontent.com/56209343/89855121-42f3c400-db5b-11ea-9d29-faaa20e5d90a.PNG
[i:The gosh-darn whitespace]: https://user-images.githubusercontent.com/56209343/89954475-c4e4fb00-dbf6-11ea-950f-2ce572e19a7e.png
