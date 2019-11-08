import {
  execSync
} from 'child_process';

export default function executeEnvaComponent(path: string): void{
  execSync(`node ${path}`, {
    env: process.env,
    stdio: 'inherit'
  });
}