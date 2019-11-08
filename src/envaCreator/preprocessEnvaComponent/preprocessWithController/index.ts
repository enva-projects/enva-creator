import path from 'path';
import fs from 'fs';

import preprocess from '../shared/preprocessEnvaFile';
import preprocessController from './preprocessController';

export default function preprocessWithController(envaComponentPath){
  const root = path.resolve(envaComponentPath, '..');
  const files = fs.readdirSync(root)
  files.forEach((file)=>{
    if(file.endsWith('.enva') && !file.startsWith('.temp') && file !== 'controller.enva') {
      preprocess(path.resolve(root, file));
    }
  })
  const controllerTemp = preprocessController(envaComponentPath);
  return controllerTemp;
}