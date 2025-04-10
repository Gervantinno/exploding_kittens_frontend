export function parseJWT(token: string): unknown {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e: unknown) {
    return null;
  }
}
