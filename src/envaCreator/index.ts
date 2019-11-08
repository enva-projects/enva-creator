//

import findEnvaFile from './findEnvaFile';
import preprocessEnvaComponent from './preprocessEnvaComponent/index';
import executeEnvaComponent from './executeEnvaComponent';
import removeEnvaTempFiles from './removeEnvaTempFiles';

export default function envaCreator(envaComponentName){
  const envaComponent = findEnvaFile(envaComponentName);
  if(envaComponent) {
    const preProcessedPath = preprocessEnvaComponent(envaComponent.envaComponentPath, envaComponent.type);
    executeEnvaComponent(preProcessedPath);
    removeEnvaTempFiles(preProcessedPath);
  }
}