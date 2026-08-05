export const DEFAULT_API_PORT = 8000;

export function getApiBaseUrl(port = DEFAULT_API_PORT): string {
  const codespaceName = process.env.CODESPACE_NAME?.trim();

  if (codespaceName) {
    return `https://${codespaceName}-${port}.app.github.dev`;
  }

  return `http://localhost:${port}`;
}
