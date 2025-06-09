import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/login';
import SignUp from '@/views/signUp';
import Dashboard from '@/views/Dashboard.vue';
import Employees from '@/views/Employees.vue';
// import Departments from '@/views/Department.vue';
import Profile from '@/views/Profile.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import Applicant from '@/views/applicants/index.vue';
import JobPosting from '@/views/jobs/job_post';
import JobTitle from '@/views/jobs/job_title';
import JobCategory from '@/views/jobs/job_category';
import LeaveRequest from '@/views/leave_request';
import EmployeesList from '@/views/employees/employee_list';
import PositionCategory from '@/views/employees/position_category';
import Department from '@/views/user_management/department';
import Roles from '@/views/user_management/roles';
import UserManagement from '@/views/user_management/users';

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/sign-up',
    component: SignUp
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: '/applicant',
        name: 'Applicant',
        component: Applicant
      },
      {
        path: '/jobs/job_posting',
        name: 'job_posting',
        component: JobPosting
      },
      {
        path: '/jobs/job_title',
        name: 'job_title',
        component: JobTitle
      },
      {
        path: '/jobs/job_category',
        name: 'job_category',
        component: JobCategory
      },
      {
        path: '/request-leave',
        name: 'request-leave',
        component: LeaveRequest
      },
      {
        path: '/employee/employees-list',
        name: 'employees-list',
        component: EmployeesList
      },
      {
        path: '/employee/position-categories',
        name: 'position-categories',
        component: PositionCategory
      },
      {
        path: '/users/department',
        name: 'department',
        component: Department
      },
      {
        path: '/users/roles',
        name: 'roles',
        component: Roles
      },
      {
        path: '/users/user-management',
        name: 'user-management',
        component: UserManagement
      },
      { path: '/employees', component: Employees },
      // { path: '/departments', component: Departments },
      { path: '/profile', component: Profile }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
