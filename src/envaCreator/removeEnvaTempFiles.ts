import fs from 'fs';

export default function removeEnvaTempFiles(path){
  fs.unlinkSync(path);
}