<template>
  <aside
    v-if="!isLoginPage"
    class="w-64 bg-white shadow-md border-r border-gray-200 flex flex-col py-6 overflow-y-auto"
    style="min-height: 100vh"
  >
    <!-- Logo -->
    <div class="mb-10 text-center">
      <img src="../assets/logo.png" alt="Logo" class="h-12 mx-auto" />
    </div>

    <!-- Menu -->
    <nav class="flex-1 px-4 space-y-2">
      <router-link
        to="/"
        class="flex items-center px-4 py-2 rounded-md text-sm font-medium"
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
        class="flex items-center px-4 py-2 rounded-md text-sm font-medium"
        :class="{
          'bg-green-700 text-white': currentPath === '/applicant',
          'text-gray-500 hover:bg-gray-100': currentPath !== '/applicant'
        }"
      >
        <i class="fas fa-user-friends mr-3"></i>
        Applicants
      </router-link>

      <!-- Jobs Dropdown -->
      <div class="w-full">
        <button
          @click="jobsOpen = !jobsOpen"
          class="flex items-center w-full px-4 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-green-700 focus:outline-none transition"
        >
          <i class="fas fa-briefcase mr-3"></i>
          Jobs
          <i
            :class="[
              'ml-auto transition-transform',
              jobsOpen ? 'rotate-180' : ''
            ]"
            class="fas fa-chevron-down"
          ></i>
        </button>
        <transition name="slide">
          <div
            v-if="jobsOpen"
            class="pl-6 mt-1 space-y-1 text-sm text-gray-600"
          >
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
        </transition>
      </div>

      <router-link
        to="/request-leave"
        class="flex items-center px-4 py-2 rounded-md text-sm font-medium"
        :class="{
          'bg-green-700 text-white': currentPath === '/request-leave',
          'text-gray-500 hover:bg-gray-100': currentPath !== '/request-leave'
        }"
      >
        <i class="fas fa-calendar-alt mr-3"></i>
        Request Leave
      </router-link>

      <!-- Employees Dropdown -->
      <div class="w-full">
        <button
          @click="employeesOpen = !employeesOpen"
          class="flex items-center w-full px-4 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-green-700 focus:outline-none transition"
        >
          <i class="fas fa-users mr-3"></i>
          Employees
          <i
            :class="[
              'ml-auto transition-transform',
              employeesOpen ? 'rotate-180' : ''
            ]"
            class="fas fa-chevron-down"
          ></i>
        </button>
        <transition name="slide">
          <div
            v-if="employeesOpen"
            class="pl-6 mt-1 space-y-1 text-sm text-gray-600"
          >
            <router-link
              to="/employee/leave-report"
              class="flex items-center px-4 py-2 rounded-md"
              :class="{
                'bg-green-700 text-white':
                  currentPath === '/employee/leave-report',
                'text-gray-500 hover:bg-gray-100':
                  currentPath !== '/employee/leave-report'
              }"
            >
              <i class="fas fa-id-card mr-3"></i>
              Leave Report
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
              Position
            </router-link>
          </div>
        </transition>
      </div>

      <!-- Setting Dropdown -->
      <div class="w-full">
        <button
          @click="settingOpen = !settingOpen"
          class="flex items-center w-full px-4 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-green-700 focus:outline-none transition"
        >
          <i class="fas fa-cog mr-3"></i>
          Setting
          <i
            :class="[
              'ml-auto transition-transform',
              settingOpen ? 'rotate-180' : ''
            ]"
            class="fas fa-chevron-down"
          ></i>
        </button>
        <transition name="slide">
          <div
            v-if="settingOpen"
            class="pl-6 mt-1 space-y-1 text-sm text-gray-600"
          >
            <router-link
              to="/users/roles"
              class="flex items-center px-4 py-2 rounded-md"
              :class="{
                'bg-green-700 text-white': currentPath === '/users/roles',
                'text-gray-500 hover:bg-gray-100':
                  currentPath !== '/users/roles'
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

            <router-link
              to="/users/user-tracking"
              class="flex items-center px-4 py-2 rounded-md"
              :class="{
                'bg-green-700 text-white':
                  currentPath === '/users/user-tracking',
                'text-gray-500 hover:bg-gray-100':
                  currentPath !== '/users/user-user-tracking'
              }"
            >
              <i class="fas fa-clipboard-list mr-3"></i>
              Tracking Log
            </router-link>
          </div>
        </transition>
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
/* Slide transition for dropdowns */
.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.3s ease-in-out, opacity 0.2s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
  max-height: 200px;
  /* Adjust based on content height */
  opacity: 1;
}

/* Ensure sidebar content doesn't overflow */
aside {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}

aside::-webkit-scrollbar {
  width: 6px;
}

aside::-webkit-scrollbar-track {
  background: #f1f1f1;
}

aside::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
