<!-- Header.vue -->
<template>
  <div
    class="flex items-center justify-between p-4 border-b bg-gray-100 relative"
  >
    <!-- Left (Menu Toggle) -->
    <label for="menu-toggle" class="cursor-pointer">
      <font-awesome-icon icon="bars" />
    </label>

    <!-- Right (User Avatar) -->
    <div @click="toggle" class="cursor-pointer relative">
      <img
        src="../assets/logo.png"
        alt="Avatar"
        class="h-10 w-10 rounded-full"
      />
    </div>

    <!-- User Dropdown -->
    <div
      v-if="spanVisible"
      class="absolute top-16 right-6 bg-white border rounded shadow p-4 space-y-2 z-50"
    >
      <div><strong>Name:</strong> {{ user_name }}</div>
      <div
        class="text-red-600 hover:bg-red-100 px-3 py-1 rounded cursor-pointer flex items-center gap-2"
        @click="handleLogOut"
      >
        <font-awesome-icon icon="arrow-right-from-bracket" />
        <span>Sign Out</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      spanVisible: false,
      user_name: 'John Doe' // Replace with actual user data
    };
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    toggle() {
      this.spanVisible = !this.spanVisible;
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.spanVisible = false;
      }
    },
    handleLogOut() {
      // Add logout logic
    }
  }
};
</script>
