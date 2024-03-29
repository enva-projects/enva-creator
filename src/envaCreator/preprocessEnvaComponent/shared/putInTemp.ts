import fs from 'fs';
import path from 'path';

export default function putInTemp(content: string, componentPath: string): string{
  const componentFileName = componentPath.split('/').pop()
  const tempPath = path.resolve(componentPath, '..', `.temp.${componentFileName}`);
  fs.writeFileSync(tempPath, content);
  return tempPath;
}