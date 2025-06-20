<template>
  <aside
    v-if="!isLoginPage"
    class="w-64 bg-white shadow-md border-r border-gray-200 flex flex-col items-center py-6"
  >
    <!-- Logo -->
    <div class="mb-10 text-center">
      <img src="../assets/logo.png" alt="Logo" class="h-12 mx-auto" />
      <p class="text-green-800 font-bold leading-tight">SunFlex</p>
      <p class="text-xs text-gray-600">INFORMATION SYSTEM</p>
      <p class="text-xs text-gray-600">SunFlex (Cambodia) Co., Ltd.</p>
    </div>

    <!-- Menu -->
    <nav class="flex flex-col space-y-4 w-full px-4">
      <router-link
        to="/"
        class="flex items-center px-4 py-2 rounded-md"
        :class="{
          'bg-green-700 text-white': currentPath === '/',
          'text-gray-500 hover:bg-gray-100': currentPath !== '/'
        }"
      >
        <i class="fas fa-th-large mr-3"></i>
        Dashboard
      </router-link>

      <router-link
        to="/applicant"
        class="flex items-center px-4 py-2 rounded-md"
        :class="{
          'bg-green-700 text-white': currentPath === '/applicant',
          'text-gray-500 hover:bg-gray-100': currentPath !== '/applicant'
        }"
      >
        <i class="fas fa-user-friends mr-3"></i>
        Applicants
      </router-link>

      <!-- Jobs Dropdown -->
      <div class="w-11/12">
        <button
          @click="jobsOpen = !jobsOpen"
          class="flex items-center w-full px-4 py-2 text-gray-500 hover:text-green-700 focus:outline-none"
        >
          <i class="fas fa-briefcase mr-3"></i>
          Jobs
          <i
            :class="
              jobsOpen
                ? 'fas fa-chevron-up ml-auto'
                : 'fas fa-chevron-down ml-auto'
            "
          ></i>
        </button>
        <div v-if="jobsOpen" class="pl-10 mt-1 space-y-1 text-sm text-gray-600">
          <router-link
            to="/jobs/job_posting"
            class="flex items-center px-4 py-2 rounded-md"
            :class="{
              'bg-green-700 text-white': currentPath === '/jobs/job_posting',
              'text-gray-500 hover:bg-gray-100':
                currentPath !== '/jobs/job_posting'
            }"
          >
            <i class="fas fa-file-alt mr-3"></i>
            Job Posts
          </router-link>
          <router-link
            to="/jobs/job_title"
            class="flex items-center px-4 py-2 rounded-md"
            :class="{
              'bg-green-700 text-white': currentPath === '/jobs/job_title',
              'text-gray-500 hover:bg-gray-100':
                currentPath !== '/jobs/job_title'
            }"
          >
            <i class="fas fa-tag mr-3"></i>
            Job Titles
          </router-link>
          <router-link
            to="/jobs/job_category"
            class="flex items-center px-4 py-2 rounded-md"
            :class="{
              'bg-green-700 text-white': currentPath === '/jobs/job_category',
              'text-gray-500 hover:bg-gray-100':
                currentPath !== '/jobs/job_category'
            }"
          >
            <i class="fas fa-list mr-3"></i>
            Job Categories
          </router-link>
        </div>
      </div>

      <router-link
        to="/request-leave"
        class="flex items-center px-4 py-2 rounded-md"
        :class="{
          'bg-green-700 text-white': currentPath === '/request-leave',
          'text-gray-500 hover:bg-gray-100': currentPath !== '/request-leave'
        }"
      >
        <i class="fas fa-calendar-alt mr-3"></i>
        Request Leave
      </router-link>

      <!-- Employees Dropdown -->
      <div class="w-11/12">
        <button
          @click="employeesOpen = !employeesOpen"
          class="flex items-center w-full px-4 py-2 text-gray-500 hover:text-green-700 focus:outline-none"
        >
          <i class="fas fa-users mr-3"></i>
          Employees
          <i
            :class="
              employeesOpen
                ? 'fas fa-chevron-up ml-auto'
                : 'fas fa-chevron-down ml-auto'
            "
          ></i>
        </button>
        <div
          v-if="employeesOpen"
          class="pl-10 mt-1 space-y-1 text-sm text-gray-600"
        >
          <router-link
            to="/employee/employees-list"
            class="flex items-center px-4 py-2 rounded-md"
            :class="{
              'bg-green-700 text-white':
                currentPath === '/employee/employees-list',
              'text-gray-500 hover:bg-gray-100':
                currentPath !== '/employee/employees-list'
            }"
          >
            <i class="fas fa-id-card mr-3"></i>
            Employees List
          </router-link>
          <router-link
            to="/employee/position-categories"
            class="flex items-center px-4 py-2 rounded-md"
            :class="{
              'bg-green-700 text-white':
                currentPath === '/employee/position-categories',
              'text-gray-500 hover:bg-gray-100':
                currentPath !== '/employee/position-categories'
            }"
          >
            <i class="fas fa-sitemap mr-3"></i>
            Position Categories
          </router-link>
        </div>
      </div>

      <!-- Setting Dropdown -->
      <div class="w-11/12">
        <button
          @click="settingOpen = !settingOpen"
          class="flex items-center w-full px-4 py-2 text-gray-500 hover:text-green-700 focus:outline-none"
        >
          <i class="fas fa-cog mr-3"></i>
          Setting
          <i
            :class="
              settingOpen
                ? 'fas fa-chevron-up ml-auto'
                : 'fas fa-chevron-down ml-auto'
            "
          ></i>
        </button>

        <div
          v-if="settingOpen"
          class="pl-10 mt-1 space-y-1 text-sm text-gray-600"
        >
          <router-link
            to="/users/roles"
            class="flex items-center px-4 py-2 rounded-md"
            :class="{
              'bg-green-700 text-white': currentPath === '/users/roles',
              'text-gray-500 hover:bg-gray-100': currentPath !== '/users/roles'
            }"
          >
            <i class="fas fa-user-shield mr-3"></i>
            Roles
          </router-link>

          <router-link
            to="/users/department"
            class="flex items-center px-4 py-2 rounded-md"
            :class="{
              'bg-green-700 text-white': currentPath === '/users/department',
              'text-gray-500 hover:bg-gray-100':
                currentPath !== '/users/department'
            }"
          >
            <i class="fas fa-building mr-3"></i>
            Department
          </router-link>
          
          <router-link
            to="/users/user-management"
            class="flex items-center px-4 py-2 rounded-md"
            :class="{
              'bg-green-700 text-white':
                currentPath === '/users/user-management',
              'text-gray-500 hover:bg-gray-100':
                currentPath !== '/users/user-management'
            }"
          >
            <i class="fas fa-user mr-3"></i>
            Users
          </router-link>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script>
export default {
  data() {
    return {
      settingOpen: false,
      jobsOpen: false,
      employeesOpen: false
    };
  },
  computed: {
    currentPath() {
      return this.$route?.path || '';
    },
    isLoginPage() {
      const hiddenRoutes = ['/login', '/sign-up', '/forgot-password'];
      return hiddenRoutes.includes(this.$route.path);
    }
  }
};
</script>

<style scoped>
/* @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'); */
</style>
