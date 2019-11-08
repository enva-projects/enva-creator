import {
  execSync
} from 'child_process';
import path from 'path';
import fs from 'fs';

const ROOT = '/'

const globalPath = execSync('npm root').toString().trim();

const ENVA_CREATOR_PATH = '.enva/creator'

function getEnvaFile(componentName, currentPath): null | { envaComponentPath: string, type: string }{
  const componentPath = path.resolve(currentPath, ENVA_CREATOR_PATH, `${componentName}.enva`);
  const componentWithControllerPath = path.resolve(currentPath, ENVA_CREATOR_PATH, componentName, `controller.enva`);
  if(fs.existsSync(componentPath)) {
    return {
      envaComponentPath: componentPath,
      type: 'standAlone'
    };
  } else if(
      fs.existsSync(path.resolve(currentPath, ENVA_CREATOR_PATH, componentName)) &&
      fs.existsSync(componentWithControllerPath)
    ){
    return {
      envaComponentPath: componentWithControllerPath,
      type: 'withController'
    };
  }
  return null;
}

export default function findEnvaFile(componentName, current = process.env.PWD || '.'){
  const envaComponent = getEnvaFile(componentName, current)
  if(envaComponent) {
    return envaComponent;
  }
  if(current === globalPath) return null;
  else if(current === ROOT) return findEnvaFile(componentName, globalPath);
  else return findEnvaFile(componentName, path.resolve(current, '..'))
}