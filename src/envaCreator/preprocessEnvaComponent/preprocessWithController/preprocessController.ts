import fs from 'fs'
import path from 'path'

import putInTemp from '../shared/putInTemp'
import preprocessEnvaSyntax from '../shared/preprocessEnvaSyntax';

function appendDefaultsToController(content, controllerPath){
  return `
  (async ()=>{
    const fs = require('fs')
    const path = require('path')
    const { prompt } = require('enquirer');
    const {
      execSync
    } = require('child_process');
    $_HERE = '${controllerPath}'
    var allRaws = [];
    function __raw(a){
      allRaws.push(a)
    }
    function ask(message, props){
      return prompt({
        type: 'input',
        ...props,
        name: 'value',
        message,
      });
    }
    function exec(fileName, vars = {}){
      const pth = path.resolve($_HERE, '.temp.' + fileName);
      execSync('node ' + pth, {
        env: {
          ...process.env,
          ...vars
        }
      });
    }
    ${content}
  })()`;
}

export default function preprocessController(controllerPath){
  const content = fs.readFileSync(controllerPath, 'utf-8');
  let finalContent = preprocessEnvaSyntax(content);
  finalContent = appendDefaultsToController(finalContent, path.resolve(controllerPath, '..'));
  return putInTemp(finalContent, controllerPath);
}