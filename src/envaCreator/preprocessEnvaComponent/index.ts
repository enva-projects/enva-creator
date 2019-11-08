import preprocessEnvaFile from './shared/preprocessEnvaFile';
import preprocessWithController from './preprocessWithController/index';

export default function preprocessEnvaComponent(envaComponentPath: string, type: string): string{
  if(type === 'standAlone') {
    return preprocessEnvaFile(envaComponentPath);
  }else {
    return preprocessWithController(envaComponentPath);
  }
}