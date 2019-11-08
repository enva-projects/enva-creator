// Types

type EnvaFileDescriptor = null | { envaComponentPath: string, type: string }

// -----------------------------------

import {
  execSync
} from 'child_process';
import path from 'path';
import fs from 'fs';

const ROOT = '/'

const globalPath = execSync('npm root').toString().trim();

const ENVA_CREATOR_PATH = '.enva/creator';

function getEnvaFile(componentName: string, currentPath: string): EnvaFileDescriptor {
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

export default function findEnvaFile(componentName: string, current: string = process.env.PWD || '.'): EnvaFileDescriptor {
  const envaComponent = getEnvaFile(componentName, current)
  if(envaComponent) return envaComponent;
  else if(current === globalPath) return null;
  else if(current === ROOT) return findEnvaFile(componentName, globalPath);
  else return findEnvaFile(componentName, path.resolve(current, '..'))
}