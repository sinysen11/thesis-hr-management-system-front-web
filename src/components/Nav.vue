<template>
  <aside v-if="!isLoginPage" class="flex flex-col w-64 py-6 overflow-y-auto bg-white border-r border-gray-200 shadow-sm"
    style="min-height: 100vh">
    <div class="mb-10 text-center">
      <img src="../assets/logo.png" alt="Logo" class="mx-auto h-14" />
    </div>

    <nav class="flex-1 px-5 space-y-3">
      <template v-for="item in filteredMenu" :key="item.name">
        <router-link v-if="!item.children" :to="item.path"
          class="flex items-center px-4 py-3 text-sm font-semibold transition-colors duration-200 rounded-md"
          :class="currentPath === item.path ? 'bg-green-700 text-white shadow-md' : 'text-gray-600 hover:bg-green-100 hover:text-green-700'">
          <i :class="`mr-4 text-lg ${item.icon}`"></i>
          {{ item.name }}
        </router-link>

        <div v-else class="w-full">
          <button @click="toggleOpen(item)"
            class="flex items-center w-full px-4 py-3 text-sm font-semibold text-gray-600 transition-colors duration-200 rounded-md hover:text-green-700 hover:bg-green-50 focus:outline-none">
            <i :class="`mr-4 text-lg ${item.icon}`"></i>
            {{ item.name }}
            <i :class="['ml-auto transition-transform duration-300', item.open ? 'rotate-180' : '']"
              class="text-base fas fa-chevron-down"></i>
          </button>
          <transition name="slide">
            <div v-if="item.open" class="pl-6 mt-2 space-y-1 text-sm text-gray-700 rounded-md">
              <router-link v-for="child in item.children" :key="child.name" :to="child.path"
                class="flex items-center px-4 py-2 transition-colors duration-200 rounded-md"
                :class="currentPath === child.path ? 'bg-green-700 text-white' : 'hover:bg-green-100 hover:text-green-700'">
                <i :class="`mr-4 text-base ${child.icon}`"></i>
                {{ child.name }}
              </router-link>
            </div>
          </transition>
        </div>
      </template>
    </nav>
  </aside>
</template>

<script>
export default {
  data() {
    return {
      settingOpen: false,
      jobsOpen: false,
      employeesOpen: false,
      menuItems: [
        { 
          name: 'Dashboard', 
          path: '/', 
          icon: 'fas fa-th-large',
          permission: 'DASHBOARD'
        },
        {
          name: 'Applicants', 
          path: '/applicant', 
          icon: 'fas fa-user-friends', 
          permission: 'APPLICANTS' 
        },
        {
          name: 'Jobs', 
          icon: 'fas fa-briefcase', 
          permission: 'JOBS', 
          open: false, 
          children: [
            { 
              name: 'Job Posts', 
              path: '/jobs/job_posting', 
              icon: 'fas fa-file-alt' 
            },
            { 
              name: 'Job Titles', 
              path: '/jobs/job_title', 
              icon: 'fas fa-tag' 
            },
            { 
              name: 'Job Categories', 
              path: '/jobs/job_category', 
              icon: 'fas fa-list' 
            }
          ]
        },
        { 
          name: 'Request Leave', 
          path: '/request-leave', 
          icon: 'fas fa-calendar-alt', 
          permission: 'REQUEST_LEAVE' 
        },
        { 
          name: 'Staff Request Leave', 
          path: '/staff-request-leave', 
          icon: 'fas fa-calendar-alt', 
          permission: 'STAFF_REQUEST_LEAVE' 
        },
        { 
          name: 'Report Request Leave', 
          path: '/report-request-leave', 
          icon: 'fa-solid fa-file-circle-check', 
          permission: 'LEAVE_REPORT' 
        },
        { 
          name: 'Holiday Date',
          path: '/holiday', 
          icon: 'fas fa-calendar', 
          permission: 'HOLIDAY' 
        },
        {
          name: 'Settings', 
          icon: 'fas fa-cog', 
          permission: 'SETTING', 
          open: false, 
          children: [
            { 
              name: 'Roles', 
              path: '/users/roles', 
              icon: 'fas fa-user-shield' 
            },
            { 
              name: 'Department', 
              path: '/users/department', 
              icon: 'fas fa-building' 
            },
            { 
              name: 'Users', 
              path: '/users/user-management', 
              icon: 'fas fa-user' 
            },
            { 
              name: 'Tracking Log', 
              path: '/users/user-tracking', 
              icon: 'fas fa-clipboard-list' 
            }
          ]
        }
      ]
    };
  },
  computed: {
    currentPath() {
      return this.$route?.path || '';
    },
    isLoginPage() {
      const hiddenRoutes = ['/login', '/sign-up', '/forgot-password'];
      return hiddenRoutes.includes(this.$route.path);
    },
    userPermissions() {
      return JSON.parse(localStorage.getItem('permissions') || '[]');
    },
    filteredMenu() {
      return this.menuItems.filter(item => this.userPermissions.includes(item.permission));
    }
  },
  methods: {
    toggleOpen(item) {
      item.open = !item.open;
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
