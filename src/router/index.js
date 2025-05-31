import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/views/Dashboard.vue';
import Employees from '@/views/Employees.vue';
import Departments from '@/views/Department.vue';
import Profile from '@/views/Profile.vue';

const routes = [
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
