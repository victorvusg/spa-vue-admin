import { getToken, validToken } from '@/api/api';

export default async function loggedInGuard(to, from, next) {
  // this is just an example. You will have to find a better or
  const token = getToken();
  if (token) {
    const tokenValidation = await validToken();
    if (tokenValidation === true && to.path !== '/login') {
      // next();
      next();
    } else {
      next({ name: 'Login' });
    }
  } else {
    next({ name: 'Login' });
  }
}
