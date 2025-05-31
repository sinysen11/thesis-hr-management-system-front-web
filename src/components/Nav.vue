<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo and Brand -->
          <div class="flex items-center space-x-3">
            <img src="../assets/logo.png" alt="Logo" class="h-8 w-8" />
            <h1 class="text-xl font-semibold text-gray-800">HR Management</h1>
          </div>

          <!-- Desktop Menu -->
          <div class="hidden md:flex space-x-8 text-sm font-medium">
            <router-link
              to="/"
              class="nav-link"
              :class="{ 'text-blue-600 font-semibold': $route.path === '/' }"
              >Dashboard</router-link
            >
            <router-link
              to="/employees"
              class="nav-link"
              :class="{
                'text-blue-600 font-semibold': $route.path === '/employees'
              }"
              >Employees</router-link
            >
            <router-link
              to="/departments"
              class="nav-link"
              :class="{
                'text-blue-600 font-semibold': $route.path === '/departments'
              }"
              >Departments</router-link
            >
            <router-link
              to="/profile"
              class="nav-link"
              :class="{
                'text-blue-600 font-semibold': $route.path === '/profile'
              }"
              >Profile</router-link
            >
          </div>

          <!-- Mobile Menu Button -->
          <div class="md:hidden">
            <button
              @click="menuOpen = !menuOpen"
              class="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path v-if="!menuOpen" d="M4 6h16M4 12h16M4 18h16" />
                <path v-else d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div
        v-if="menuOpen"
        class="md:hidden bg-white shadow-md border-t border-gray-200"
      >
        <div class="px-4 py-3 space-y-2">
          <router-link to="/" class="block nav-link-mobile"
            >Dashboard</router-link
          >
          <router-link to="/employees" class="block nav-link-mobile"
            >Employees</router-link
          >
          <router-link to="/departments" class="block nav-link-mobile"
            >Departments</router-link
          >
          <router-link to="/profile" class="block nav-link-mobile"
            >Profile</router-link
          >
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 py-6">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuOpen: false
    };
  }
};
</script>
\
