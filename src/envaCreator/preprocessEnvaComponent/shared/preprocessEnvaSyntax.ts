export default function preprocessEnvaSyntax(content){
  const regexp = /<%(.*?)%>/gms;
  return content.replace(regexp, '$1').replace(/ask\((.*)\)/igm, '(await ask($1)).value').replace(/ {2,}/g, ' ').trim();
}