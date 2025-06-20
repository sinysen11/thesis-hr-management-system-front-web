// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import '@fortawesome/fontawesome-free/css/all.min.css';
// import './permission'; // permission control`
import {
  faUser,
  faCog,
  faUsers,
  faChevronDown,
  faChevronUp,
  faThLarge,
  faBriefcase,
  faCalendarAlt,
  faBuilding,
  faUserShield,
  faFileAlt,
  faTag,
  faList,
  faIdCard,
  faSitemap
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faUser,
  faCog,
  faUsers,
  faChevronDown,
  faChevronUp,
  faThLarge,
  faBriefcase,
  faCalendarAlt,
  faBuilding,
  faUserShield,
  faFileAlt,
  faTag,
  faList,
  faIdCard,
  faSitemap
);
const app = createApp(App);
app.use(router);

app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
