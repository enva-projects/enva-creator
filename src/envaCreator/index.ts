//

import path from 'path';

import findEnvaFile from './findEnvaFile';
import preprocessEnvaComponent from './preprocessEnvaComponent/index';
import executeEnvaComponent from './executeEnvaComponent';
import removeEnvaTempFiles from './removeEnvaTempFiles';

export default function envaCreator(envaComponentName: string): StatusWithMessage{
  const envaComponent = findEnvaFile(envaComponentName);
  if(envaComponent) {
    const entryFile = preprocessEnvaComponent(envaComponent.envaComponentPath, envaComponent.type);
    executeEnvaComponent(entryFile);
    removeEnvaTempFiles(path.resolve(entryFile, '..'));
    return {
      status: true,
      message: 'SUCCESS',
    }
  }
  return {
    status: false,
    message: 'COMPONENT_NOT_FOUND',
  }
}