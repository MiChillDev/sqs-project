export function requireAdminEnv() {
  const username = process.env.SEED_ADMIN_USERNAME;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!username || !password) {
    throw new Error(
      'SEED_ADMIN_USERNAME and SEED_ADMIN_PASSWORD environment variables must be set'
    );
  }
  return { username, password };
}
