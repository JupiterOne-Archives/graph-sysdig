export function getWebLink(region: string, urlPath: string) {
  return `https://${region}.app.sysdig.com/secure${urlPath}`;
}
