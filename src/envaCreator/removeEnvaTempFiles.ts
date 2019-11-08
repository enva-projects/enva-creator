import fs from 'fs';
import path from 'path'

export default function removeEnvaTempFiles(root){
  const files = fs.readdirSync(root);
  files.forEach(file => {
    if(file.startsWith('.temp.')) {
      fs.unlinkSync(path.resolve(root, file));
    }
  })
}