<template>
  <div
    class="flex items-center justify-between p-4 border-b bg-gray-100 relative"
  >
    <!-- Left (Menu Toggle) -->
    <label
      for="menu-toggle"
      class="cursor-pointer text-gray-600 hover:text-gray-800"
    >
      <font-awesome-icon icon="bars" class="text-xl" />
    </label>

    <!-- Right (User Avatar and Dropdown Trigger) -->
    <div class="relative">
      <button
        @click="toggleDropdown"
        class="flex items-center gap-2 focus:outline-none"
        aria-label="User menu"
      >
        <img
          :src="userAvatar"
          alt="User Avatar"
          class="h-10 w-10 rounded-full object-cover"
          @error="handleImageError"
        />
        <span class="text-gray-700 font-medium hidden sm:inline">
          {{ fullName || 'User' }}
        </span>
        <font-awesome-icon
          :icon="spanVisible ? 'chevron-up' : 'chevron-down'"
          class="text-gray-600"
        />
      </button>

      <!-- User Dropdown -->
      <div
        v-if="spanVisible"
        class="absolute top-12 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50"
      >
        <div class="text-gray-700 font-medium mb-2">
          <strong>{{ fullName || 'Unknown User' }}</strong>
        </div>
        <button
          class="w-full text-left text-red-600 hover:bg-red-100 px-3 py-2 rounded flex items-center gap-2 transition-colors"
          @click="handleLogOut"
        >
          <font-awesome-icon icon="arrow-right-from-bracket" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { getUserInfoCookie, removeAllToken } from '@/services/authentication';

// State
const spanVisible = ref(false);
const router = useRouter();
const userInfo = ref(null);
// const defaultAvatar = './assets/images/logo.png'; // Replace with actual path

// Computed properties
const fullName = computed(() => {
  if (userInfo.value) {
    const { first_name_en, last_name_en } = userInfo.value;
    return `${first_name_en || ''} ${last_name_en || ''}`.trim() || 'User';
  }
  return null;
});

// const userAvatar = computed(() => {
//   // Replace with actual logic if user has an avatar URL
//   return defaultAvatar;
// });

// Methods
const toggleDropdown = () => {
  spanVisible.value = !spanVisible.value;
};

const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    spanVisible.value = false;
  }
};

const handleLogOut = async () => {
  try {
    await removeAllToken(); // Clear all cookies
    router.push('/login'); // Redirect to login
  } catch (error) {
    console.error('Logout error:', error);
    router.push('/login'); // Redirect even if cookie clearing fails
  }
};

// const handleImageError = (event) => {
//   event.target.src = defaultAvatar; // Fallback to default avatar on error
// };

// Lifecycle hooks
onMounted(() => {
  // Load user info from cookie
  const userInfoCookie = getUserInfoCookie();
  if (userInfoCookie) {
    try {
      userInfo.value = JSON.parse(userInfoCookie);
    } catch (error) {
      console.error('Failed to parse user info:', error);
    }
  }
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Optional: Add smooth transitions for dropdown */
.relative:hover .text-gray-600 {
  color: #1f2937;
}

.transition-colors {
  transition: background-color 0.2s ease;
}
</style>
