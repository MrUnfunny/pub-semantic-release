const path  = require('path');
const {writeFileSync, existsSync, readFileSync} = require('fs');
const {cwd} =  require('process');

async function prepare(pluginConfig, context) {
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
  
  const updatedChangeLog = (changeLog.includes(context.nextRelease?.version)) ? changeLog : changeLog + `\n## ${context.nextRelease?.version}`;

  writeFileSync(changeLogPath,updatedChangeLog);
}

module.exports = {
  prepare
}