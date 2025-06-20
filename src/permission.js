import router from './router';
import { getToken, removeAllToken } from '@/services/authentication'; // token from cookie
// import store from './store';
import { verifyWebpage, getMenuByRole } from '@/apis/authentication';
// import { transformMenuUrl } from '@/services/util';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

router.beforeEach(async (to, from, next) => {
  try {
    NProgress.start();

    const token = (await getToken()) || '';
    const isValidToken = !!token;

    if (!isValidToken && to.name !== 'login') {
      await removeAllToken(true);
      return next({ name: 'login' });
    }

    if (isValidToken && to.name === 'login') {
      return next({ path: from.path });
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
          if (isValidToken) {
            const result = await getMenuByRole();
            if (result && result.status === 200 && result.data) {
              // const menu_items = await transformMenuUrl(result.data);
              // return next({ name: menu_items[0].url_name });
            }
          } else {
            return next({ path: from.fullPath });
          }
        }
      }
    }

    NProgress.done();
    next();
  } catch (error) {
    NProgress.done();
    console.error(error.message);
    next(false);
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
    throw new Error(error.message);
  }
}
