import fs from 'fs';

import putInTemp from './putInTemp';
import preprocessEnvaSyntax from './preprocessEnvaSyntax';

function preprocessValuePrinting(lines: string): string{
  const sepratedLines = lines.trim().split('\n')
  return sepratedLines.map(line => {
    if (/^(.*)<=.*>(.*)$/igm.test(line)) {
      return line.replace(/^(.*)<=(.*)>(.*)$/igm, '__raw("$1" + $2 + "$3");')
    }
    return '__raw("' + line + '");'
  }).join('\n')
}

function preprocessRaw(content: string): string{
  let finalContent = content;
  finalContent = finalContent.replace(/(%>)(.*?)(<%)/gsm, (match, p1, p2, p3)=>{
    return p1 + preprocessValuePrinting(p2) + p3
  })
  finalContent = finalContent.replace(/(.*?)(<%)/sm, (match, p1, p2)=>{
    return preprocessValuePrinting(p1) + p2;
  })
  finalContent = finalContent.replace(/(.*%>)(.*)/sm, (match, p1, p2)=>{
    return p1 + preprocessValuePrinting(p2);
  })
  if(!finalContent.includes('<%') && !finalContent.includes('%>')) {
    finalContent = finalContent.replace(/.*/igms, (match)=>{
      return preprocessValuePrinting(match)
    })
  }
  return finalContent;
}

function appendDefaults(content: string): string{
  return `
  (async ()=>{
    const fs = require('fs')
    const { prompt } = require('enquirer');
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
    function output(name){
      fs.writeFileSync(name, allRaws.join('\\n').trim());
    }
    ${content}
  })()`;
}

function preprocessEnvVars(content: string): string{
  return content.replace(/\$\$/g, 'process.env.');
}

export default function preprocessStandAlone(envaComponentPath: string): string{
  const envaFileContent = fs.readFileSync(envaComponentPath, 'utf-8');
  const withEnvs = preprocessEnvVars(envaFileContent);
  const withRaw = preprocessRaw(withEnvs);
  const withSyntax = preprocessEnvaSyntax(withRaw);
  const withDefaults = appendDefaults(withSyntax);
  return putInTemp(withDefaults, envaComponentPath);
}