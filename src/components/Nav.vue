<template>
  <aside v-if="!isLoginPage" class="flex flex-col w-64 py-6 overflow-y-auto bg-white border-r border-gray-200 shadow-sm"
    style="min-height: 100vh">
    <div class="mb-10 text-center">
      <img src="../assets/logo.png" alt="Logo" class="mx-auto h-14" />
    </div>

    <nav class="flex-1 px-5 space-y-3">
      <router-link to="/"
        class="flex items-center px-4 py-3 text-sm font-semibold transition-colors duration-200 rounded-md" :class="{
          'bg-green-700 text-white shadow-md': currentPath === '/',
          'text-gray-600 hover:bg-green-100 hover:text-green-700': currentPath !== '/'
        }">
        <i class="mr-4 text-lg fas fa-th-large"></i>
        Dashboard
      </router-link>

      <router-link to="/applicant"
        class="flex items-center px-4 py-3 text-sm font-semibold transition-colors duration-200 rounded-md" :class="{
          'bg-green-700 text-white shadow-md': currentPath === '/applicant',
          'text-gray-600 hover:bg-green-100 hover:text-green-700': currentPath !== '/applicant'
        }">
        <i class="mr-4 text-lg fas fa-user-friends"></i>
        Applicants
      </router-link>

      <div class="w-full">
        <button @click="jobsOpen = !jobsOpen"
          class="flex items-center w-full px-4 py-3 text-sm font-semibold text-gray-600 transition-colors duration-200 rounded-md hover:text-green-700 hover:bg-green-50 focus:outline-none">
          <i class="mr-4 text-lg fas fa-briefcase"></i>
          Jobs
          <i :class="[
            'ml-auto transition-transform duration-300',
            jobsOpen ? 'rotate-180' : ''
          ]" class="text-base fas fa-chevron-down"></i>
        </button>
        <transition name="slide">
          <div v-if="jobsOpen" class="pl-6 mt-2 space-y-1 text-sm text-gray-700 rounded-md">
            <router-link to="/jobs/job_posting"
              class="flex items-center px-4 py-2 transition-colors duration-200 rounded-md" :class="{
                'bg-green-700 text-white': currentPath === '/jobs/job_posting',
                'hover:bg-green-100 hover:text-green-700': currentPath !== '/jobs/job_posting'
              }">
              <i class="mr-4 text-base fas fa-file-alt"></i>
              Job Posts
            </router-link>
            <router-link to="/jobs/job_title"
              class="flex items-center px-4 py-2 transition-colors duration-200 rounded-md" :class="{
                'bg-green-700 text-white': currentPath === '/jobs/job_title',
                'hover:bg-green-100 hover:text-green-700': currentPath !== '/jobs/job_title'
              }">
              <i class="mr-4 text-base fas fa-tag"></i>
              Job Titles
            </router-link>
            <router-link to="/jobs/job_category"
              class="flex items-center px-4 py-2 transition-colors duration-200 rounded-md" :class="{
                'bg-green-700 text-white': currentPath === '/jobs/job_category',
                'hover:bg-green-100 hover:text-green-700': currentPath !== '/jobs/job_category'
              }">
              <i class="mr-4 text-base fas fa-list"></i>
              Job Categories
            </router-link>
          </div>
        </transition>
      </div>

      <router-link to="/request-leave"
        class="flex items-center px-4 py-3 text-sm font-semibold transition-colors duration-200 rounded-md" :class="{
          'bg-green-700 text-white shadow-md': currentPath === '/request-leave',
          'text-gray-600 hover:bg-green-100 hover:text-green-700': currentPath !== '/request-leave'
        }">
        <i class="mr-4 text-lg fas fa-calendar-alt"></i>
        Request Leave
      </router-link>

      <router-link to="/staff-request-leave"
        class="flex items-center px-4 py-3 text-sm font-semibold transition-colors duration-200 rounded-md" :class="{
          'bg-green-700 text-white shadow-md': currentPath === '/staff-request-leave',
          'text-gray-600 hover:bg-green-100 hover:text-green-700': currentPath !== '/staff-request-leave'
        }">
        <i class="mr-4 text-lg fas fa-calendar-alt"></i>
        Staff Request Leave
      </router-link>

      <router-link to="/report-request-leave"
        class="flex items-center px-4 py-3 text-sm font-semibold transition-colors duration-200 rounded-md" :class="{
          'bg-green-700 text-white shadow-md': currentPath === '/report-request-leave',
          'text-gray-600 hover:bg-green-100 hover:text-green-700': currentPath !== '/report-request-leave'
        }">
        <i class="mr-4 text-lg fa-solid fa-file-circle-check"></i>
        Report Request Leave
      </router-link>

      <router-link to="/holiday"
        class="flex items-center px-4 py-3 text-sm font-semibold transition-colors duration-200 rounded-md" :class="{
          'bg-green-700 text-white shadow-md': currentPath === '/holiday',
          'text-gray-600 hover:bg-green-100 hover:text-green-700': currentPath !== '/holiday'
        }">
        <i class="mr-4 text-lg fa-solid fa-calendar"></i>
        Holiday Date
      </router-link>

      <div class="w-full">
        <button @click="settingOpen = !settingOpen"
          class="flex items-center w-full px-4 py-3 text-sm font-semibold text-gray-600 transition-colors duration-200 rounded-md hover:text-green-700 hover:bg-green-50 focus:outline-none">
          <i class="mr-4 text-lg fas fa-cog"></i>
          Setting
          <i :class="[
            'ml-auto transition-transform duration-300',
            settingOpen ? 'rotate-180' : ''
          ]" class="text-base fas fa-chevron-down"></i>
        </button>
        <transition name="slide">
          <div v-if="settingOpen" class="pl-6 mt-2 space-y-1 text-sm text-gray-700 rounded-md">
            <router-link to="/users/roles" class="flex items-center px-4 py-2 transition-colors duration-200 rounded-md"
              :class="{
                'bg-green-700 text-white': currentPath === '/users/roles',
                'hover:bg-green-100 hover:text-green-700': currentPath !== '/users/roles'
              }">
              <i class="mr-4 text-base fas fa-user-shield"></i>
              Roles
            </router-link>
            <router-link to="/users/department"
              class="flex items-center px-4 py-2 transition-colors duration-200 rounded-md" :class="{
                'bg-green-700 text-white': currentPath === '/users/department',
                'hover:bg-green-100 hover:text-green-700': currentPath !== '/users/department'
              }">
              <i class="mr-4 text-base fas fa-building"></i>
              Department
            </router-link>
            <router-link to="/users/user-management"
              class="flex items-center px-4 py-2 transition-colors duration-200 rounded-md" :class="{
                'bg-green-700 text-white': currentPath === '/users/user-management',
                'hover:bg-green-100 hover:text-green-700': currentPath !== '/users/user-management'
              }">
              <i class="mr-4 text-base fas fa-user"></i>
              Users
            </router-link>

            <router-link to="/users/user-tracking"
              class="flex items-center px-4 py-2 transition-colors duration-200 rounded-md" :class="{
                'bg-green-700 text-white': currentPath === '/users/user-tracking',
                'hover:bg-green-100 hover:text-green-700': currentPath !== '/users/user-tracking'
              }">
              <i class="mr-4 text-base fas fa-clipboard-list"></i>
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
  max-height: 300px;
  opacity: 1;
}

aside {
  scrollbar-width: thin;
  scrollbar-color: #94a3b8 #f1f5f9;
}

aside::-webkit-scrollbar {
  width: 8px;
}

aside::-webkit-scrollbar-track {
  background: #f1f5f9;
}

aside::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 4px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>
