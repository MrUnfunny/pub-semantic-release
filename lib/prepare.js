import {Config, Context} from 'semantic-release';
import * as path from 'path';
import {writeFileSync, existsSync, readFileSync} from 'fs';
import {cwd} from 'process';

export async function prepare(pluginConfig, context) {
  const workingDir = pluginConfig.cwd ?? cwd();
  const pubSpecPath = path.resolve(workingDir, 'pubspec.yaml');
  const changeLogPath = path.resolve(workingDir, 'CHANGELOG.md');

  if (!existsSync(pubSpecPath)) {
    throw Error(`pubspec.yaml not found in ${workingDir}`);
  }


  if (!existsSync(changeLogPath)) {
    throw Error(`CHANGELOG.md not found in ${workingDir}`);
  }

  const pubSpec = readFileSync(pubSpecPath).toString();

  context.logger.log(
    'Write version %s to pubspec.yaml in %s',
    context.nextRelease?.version,
    workingDir
  );

  const regex = /^version: [0-9.+-]+(.*)/m;
  const updatedPubSpec = pubSpec.replace(
    regex,
    `version: ${context.nextRelease?.version}$1`
  );

  writeFileSync(pubSpecPath, updatedPubSpec);

  const changeLog = readFileSync(changeLogPath).toString();

  context.logger.log(
    'Write version %s to CHANGELOG.md in %s',
    context.nextRelease?.version,
    workingDir
  );
  
  const updatedChangeLog = changeLog + `\n${context.nextRelease?.version}`;

  writeFileSync(changeLogPath,updatedChangeLog);
}
