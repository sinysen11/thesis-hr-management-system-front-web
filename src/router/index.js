import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/login';
import SignUp from '@/views/signUp';
import Dashboard from '@/views/Dashboard.vue';
import Employees from '@/views/Employees.vue';
import Departments from '@/views/Department.vue';
import Profile from '@/views/Profile.vue';

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/sign-up',
    component: SignUp
  },
  { path: '/', component: Dashboard },
  { path: '/employees', component: Employees },
  { path: '/departments', component: Departments },
  { path: '/profile', component: Profile }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
