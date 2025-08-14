import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/login';
import SignUp from '@/views/signUp';
import ForgotPassword from '@/views/forgot_password';
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
import StaffRequestLeave from '@/views/staff-request-leave';
import ReportRequestLeave from '@/views/report_request_leave';
import Holiday from '@/views/hodiday_date';
import LeaveReport from '@/views/employees/leave_report';
import PositionCategory from '@/views/employees/position_category';
import Department from '@/views/user_management/department';
import Roles from '@/views/user_management/roles';
import UserManagement from '@/views/user_management/users';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false } // Explicitly mark as public
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUp,
    meta: { requiresAuth: false } // Explicitly mark as public
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPassword,
    meta: { requiresAuth: false } // Explicitly mark as public
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          requiresAuth: true,
          permission: 'DASHBOARD'
        }
      },
      {
        path: '/applicant',
        name: 'Applicant',
        component: Applicant,
        meta: {
          requiresAuth: true,
          permission: 'APPLICANTS'
        }
      },
      { 
        path: '/jobs/job_posting', 
        name: 'job_posting', 
        component: JobPosting, 
        meta: { 
          requiresAuth: true,
          permission: 'JOBS'
        } 
      }, 
      { 
        path: '/jobs/job_title', 
        name: 'job_title', component: 
        JobTitle, meta: { requiresAuth: true } 
      }, 
      { 
        path: '/jobs/job_category', 
        name: 'job_category', 
        component: JobCategory, 
        meta: { requiresAuth: true } 
      },
      {
        path: '/request-leave',
        name: 'request-leave',
        component: LeaveRequest,
        meta: {
          requiresAuth: true,
          permission: 'REQUEST_LEAVE'
        }
      },
      {
        path: '/staff-request-leave',
        name: 'staff-request-leave',
        component: StaffRequestLeave,
        meta: {
          requiresAuth: true,
          permission: 'STAFF_REQUEST_LEAVE'
        }
      },
      {
        path: '/report-request-leave',
        name: 'report-request-leave',
        component: ReportRequestLeave,
        meta: {
          requiresAuth: true,
          permission: 'LEAVE_REPORT'
        }
      },
      {
        path: '/holiday',
        name: 'holiday',
        component: Holiday,
        meta: {
          requiresAuth: true,
          permission: 'HOLIDAY'
        }
      },
      {
        path: '/users/department',
        name: 'department',
        component: Department,
        meta: { requiresAuth: true }
      },
      {
        path: '/users/roles',
        name: 'roles',
        component: Roles,
        meta: { 
          requiresAuth: true,
          permission: 'SETTING'
        }
      },
      {
        path: '/users/user-management',
        name: 'user-management',
        component: UserManagement,
        meta: { requiresAuth: true }
      },
      {
        path: '/profile',
        component: Profile,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
    component: Login
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
  console.log(permissions)
  if (to.meta.requiresAuth) {
    if (to.path === '/' && !permissions.includes('DASHBOARD')) {
      const allRoutes = router.getRoutes().filter(data => data.meta?.permission);
      const firstPermitted = allRoutes.find(data => permissions.includes(data.meta.permission));
      console.log(router.getRoutes())
      if (firstPermitted) {
        return next(firstPermitted.path);
      } else {
        return next('/login');
      }
    }
  }

  next();
});

export default router;
