#!/usr/bin/env node

const program = require('commander');
const inqurer = require('inquirer');
const ora = require('ora');
const download = require('download-git-repo');
const spinner = ora('Loading...');
const readJson = require('read-metadata');
const path = require('path');
const fs = require('fs');

const templates = ['vue-admin-simple-tamplate'];

const rewriterPackageJson = function (projectName, version = '0.0.1') {
  const jsonPath = path.resolve(process.cwd(), `${projectName}/package.json`);
  console.log(jsonPath);
  let opts = readJson.sync(jsonPath);
  opts.name = projectName;
  opts.version = version;
  fs.writeFileSync(jsonPath, JSON.stringify(opts, '', '\t'));
};

const pullProjectAndRewritePackage = (template, dir) => {
  spinner.start();
  download(`Afu0402/${template}`, dir, function (error) {
    if (error) {
      spinner.fail(error.message);
    } else {
      rewriterPackageJson(dir);
      spinner.succeed(
        `success and into ${dir} and run npm install or yarn install`
      );
      process.exit(1);
    }
  });
};

const list = [
  {
    type: 'list',
    name: 'template',
    message: 'please select project template',
    choices: templates
  }
];

program
  .version(require('../package.json').version)
  .command('create <name>')
  .option("-t, --template <template>", "the name of development")
  // .description('select project template and generate project')
  .action((name,option) => {
    if (!option.template) {
      console.log('请输入开发模板的名称')
      return
    }
    pullProjectAndRewritePackage(option.template, name);

  });
program.parse(process.argv);
