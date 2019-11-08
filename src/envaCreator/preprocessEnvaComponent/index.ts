import preprocessStandAlone from './preprocessStandAlone';

export default function preprocessEnvaComponent(envaComponentPath, type){
  if(type === 'standAlone') {
    return preprocessStandAlone(envaComponentPath);
  }
}