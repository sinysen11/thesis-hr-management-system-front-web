import router from './router';
import { getToken, removeAllToken } from '@/services/authentication';
import { verifyWebpage, getMenuByRole } from '@/apis/auth';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

router.beforeEach(async (to, from, next) => {
  try {
    NProgress.start();
    const token = await getToken();
    const isValidToken = !!token;
    const isAuthenticated = !!token;
    if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    removeAllToken();
    return next({ name: 'login' });
    }

    if (
      isValidToken &&
      (to.name === 'login' ||
        to.name === 'signup' ||
        to.name === 'forgot-password')
    ) {
      return next({ path: '/' });
    }

    if (to.meta.is_need_authorization) {
      const result_authorized = await checkAuthorization(
        to.meta.backend_name || ''
      );
      if (!result_authorized.is_authorized) {
        if (!result_authorized.is_valid_user) {
          await removeAllToken();
          return next({ name: 'login' });
        } else {
          const result = await getMenuByRole();
          if (result && result.status === 200 && result.data) {
            return next();
          } else {
            console.error('Failed to fetch menu by role:', result);
            return next({ path: '/' });
          }
        }
      }
    }

    NProgress.done();
    next();
  } catch (error) {
    NProgress.done();
    console.error('Navigation guard error:', error.message);
    next({ name: 'login' });
  }
});
async function checkAuthorization(page_name) {
  try {
    const result = await verifyWebpage(page_name);
    return {
      is_authorized: !!(result && result.data),
      is_valid_user: !!(
        result &&
        result.ext_info &&
        result.ext_info.is_valid_user
      )
    };
  } catch (error) {
    console.error('Authorization check failed:', error.message);
    throw new Error('Authorization check failed');
  }
}
