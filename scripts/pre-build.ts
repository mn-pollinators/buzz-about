/**
 * This is a Node script that runs before Angular builds the application. Its
 * job is to grab some build-time data (for example, the current git hash) and
 * write it into some static files to be included in the Angular application.
 */

import * as project from '../package.json';
import * as path from 'path';
import * as fs from 'fs';
import * as rimraf from 'rimraf';

const GENERATED_FILES_PATH = 'statically-generated';
const BUILD_DATA_FILENAME = 'build-data.json';

/**
 * A simple promise wrapper for the rimraf package (for deleting a directory
 * recursively).
 */
function rimrafPromise(dirPath: string, options: object): Promise<void> {
  return new Promise((resolve, reject) => {
    rimraf(dirPath, options, (err: any) => {
      if (err) {
        reject();
      } else {
        resolve();
      }
    });
  });
}

async function main() {
  // Check if the output directory exists; if not, make it.
  try {
    await fs.promises.access(GENERATED_FILES_PATH);
  } catch {
    console.log(`Creating ${GENERATED_FILES_PATH}...`);
    await fs.promises.mkdir(GENERATED_FILES_PATH, { recursive: true });
  }

  // Check if we have read/write permissions for the output directory;
  // if not, write an error message and exit.
  try {
    // tslint:disable-next-line: no-bitwise
    const readWritePermissions = fs.constants.R_OK | fs.constants.W_OK;
    await fs.promises.access(GENERATED_FILES_PATH, readWritePermissions);
  } catch {
    console.error(`Error: can't read and write to ${GENERATED_FILES_PATH}`);
    process.exit(1);
  }

  // Check if the output directory is a directory; if not, write an error
  // message and exit.
  if (!(await fs.promises.stat(GENERATED_FILES_PATH)).isDirectory()) {
    console.error(`Error: ${GENERATED_FILES_PATH} is not a directory`);
    process.exit(1);
  }

  // OK, now we should be all good!

  // Clean the output directory
  for (const entryName of await fs.promises.readdir(GENERATED_FILES_PATH)) {
    const pathToEntry = path.join(GENERATED_FILES_PATH, entryName);
    console.log(`Removing ${pathToEntry}...`);
    if ((await fs.promises.stat(pathToEntry)).isFile()) {
      await fs.promises.unlink(pathToEntry);
    } else if ((await fs.promises.stat(pathToEntry)).isDirectory()) {
      // In the future, we might be able to use...
      // `await fs.promises.rmdir(pathToEntry, { recursive: true });`
      // But that's not available in Node 10.x LTS, and even in more recent
      // versions the API isn't stable yet.
      await rimrafPromise(pathToEntry, {});
    } else {
      console.error(`Error: don't know how to delete ${pathToEntry}`);
      process.exit(1);
    }
  }

  const buildData = {
    version: project.version,
    // TODO: add the current commit hash, get the members of the organization
    // from GitHub somehow.
  };

  const buildDataFilePath =
    path.join(GENERATED_FILES_PATH, BUILD_DATA_FILENAME);

  console.log(`Writing to ${buildDataFilePath}...`);
  await fs.promises.writeFile(buildDataFilePath, JSON.stringify(buildData));
}

main();
