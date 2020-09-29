const fs = require('fs');
const { gitDescribe } = require('git-describe');
const buzzAboutPackage = require('./package.json');
const assetsPackage = require('@mn-pollinators/assets/package.json');
const { Octokit } = require("@octokit/rest");

function formatContributor(contributor) {
  return {
    username: contributor.login,
    name: contributor.name,
    avatarUrl: contributor.avatar_url,
    url: contributor.html_url,
    type: contributor.type
  };
}

(async () => {

  const octokit = new Octokit({
    // If GITHUB_TOKEN isn't set, you'll just get an unauthenticated version of
    // of the API (which is fine, although the rate limiting is pretty strict).
    auth: process.env.GITHUB_TOKEN
  });


  const gitInfo = await gitDescribe({
    customArguments: ['--abbrev=40'],
    dirtyMark: false,
    dirtySemver: false
  });

  const buzzAboutContributorsListing = await octokit.repos.listContributors({
    owner: 'mn-pollinators',
    repo: 'buzz-about'
  });

  // listContributors only gives us usernames, so we have to make separate API
  // calls to get people's full names.
  const buzzAboutContributors = await Promise.all(buzzAboutContributorsListing.data.map(u =>
    octokit.users.getByUsername({username: u.login})
  ));

  const assetsContributorsListing = await octokit.repos.listContributors({
    owner: 'mn-pollinators',
    repo: 'assets'
  });

  const assetsContributors = await Promise.all(assetsContributorsListing.data.map(u =>
    octokit.users.getByUsername({username: u.login})
  ));

  const projectInfo = {
    buzzAbout: {
      version: buzzAboutPackage.version,
      git: {
        hash: gitInfo.hash,
        tag: gitInfo.tag
      },
      contributors: buzzAboutContributors.map(c => formatContributor(c.data))
    },
    assets: {
      version: assetsPackage.version,
      contributors: assetsContributors.map(c => formatContributor(c.data))
    }
  }

  await fs.promises.writeFile('project-info.json', JSON.stringify(projectInfo, null, 2));

  console.log(`Wrote project-info.json for Buzz About v${buzzAboutPackage.version} at commit ${gitInfo.hash}.`)

})();
