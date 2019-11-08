import fs from 'fs';
import path from 'path';

function preprocessValuePrinting(lines){
  const sepratedLines = lines.trim().split('\n')
  return sepratedLines.map(line => {
    if (/^(.*)<=.*(\$.*)>(.*)$/igm.test(line)) {
      return line.replace(/^(.*)<=.*(\$.*)>(.*)$/igm, '__raw("$1" + $2 + "$3")')
    }
    return '__raw("' + line + '")'
  }).join('\n')
}

function preprocessRaw(content){
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
  return finalContent;
}

function appendDefaults(content){
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

function preprocessEnvaSyntaxSections(content){
  const regexp = /<%(.*?)%>/gms;
  return content.replace(regexp, '$1').replace(/ask\((.*)\)/igm, '(await ask($1)).value').replace(/ {2,}/g, ' ').trim();
}

function putInFile(content, componentPath){
  const componentFileName = componentPath.split('/').pop()
  const tempPath = path.resolve(componentPath, '..', `.temp.${componentFileName}`);
  fs.writeFileSync(tempPath, content);
  return tempPath;
}

export default function preprocessStandAlone(envaComponentPath){
  const envaFileContent = fs.readFileSync(envaComponentPath, 'utf-8');
  const withRaw = preprocessRaw(envaFileContent);
  const withSyntax = preprocessEnvaSyntaxSections(withRaw);
  const withDefaults = appendDefaults(withSyntax);
  return putInFile(withDefaults, envaComponentPath);
}