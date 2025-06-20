import router from './router';
import { getToken, setToken, removeAllToken } from '@/services/authentication'; // get token from cookie
import store from './store';
import {
  verifyToken,
  verifyWebpage,
  getMenuByRole
} from '@/apis/authentication';
// import { transformMenuUrl } from '@/services/util';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style

router.beforeEach(async (to, from, next) => {
  try {
    // start progress bar
    NProgress.start();
    /**
     * Verify token first when RELOAD PAGE
     */
    const token = (await getToken()) || '';

    let isValidToken = store.getters.isValidToken;
    if (!isValidToken && token) {
      const tokenResult = await verifyToken({ token });
      isValidToken = tokenResult.data || false;
      if (!isValidToken) {
        await removeAllToken(true);
      }
      if (isValidToken && tokenResult.token) {
        // Set new token for expire one when sign in/refresh page
        await setToken('token', tokenResult.token);
      }
      store.dispatch('authentication/verifyToken', isValidToken);
    }
    /**
     * Redirect to sign in when invalid token or havent signed in
     */
    NProgress.done();
    if ((!isValidToken || isValidToken === undefined) && to.name !== 'login') {
      return next({ name: 'login' });
    } else if (!token) {
      if (to.name === 'login') {
        return next();
      } else {
        return next({ name: 'login' });
      }
    } else if (isValidToken && to.name === 'login') {
      return next({ path: from.path });
    }

    // check page with authorized meta
    if (to.meta.is_need_authorization) {
      const result_authorized = await checkAuthorization(
        to.meta.backend_name || ''
      );
      if (!result_authorized.is_authorized) {
        if (!result_authorized.is_valid_user) {
          // User is not valid
          await removeAllToken();
          return next({ name: 'login' });
        } else {
          if (isValidToken) {
            // only valid token can get access to other page
            // since different role has different root page, need to get from backend
            const result = await getMenuByRole();
            if (result && result.status === 200 && result.data) {
              // const menu_items = await transformMenuUrl(result.data);
              // return next({ name: menu_items[0].url_name });
            }
          } else {
            // User is not authorized
            return next({ path: from.fullPath });
          }
        }
      }
    }
    next();
  } catch (error) {
    NProgress.done();
    console.log(error.message);
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
