import {
  execSync
} from 'child_process';

export default function executeEnvaComponent(path){
  execSync(`node ${path}`, {
    env: process.env,
    stdio: 'inherit'
  });
}