<template>
  <div
    class="flex items-center justify-between p-4 border-b bg-gray-100 relative"
  >
    <label
      for="menu-toggle"
      class="cursor-pointer text-gray-600 hover:text-gray-800"
    >
      <font-awesome-icon icon="bars" class="text-xl" />
    </label>

    <div class="relative">
      <button
        @click="toggleDropdown"
        class="flex items-center gap-2 focus:outline-none"
        aria-label="User menu"
      >
        <img
          src="https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg"
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

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useRouter } from 'vue-router';
import { getUserInfoCookie, removeAllToken } from '@/services/authentication';

export default {
  name: 'NavbarComponent',
  components: {
    FontAwesomeIcon
  },
  data() {
    return {
      spanVisible: false,
      userInfo: null
      // defaultAvatar: './assets/images/logo.png', // Replace with your actual path
    };
  },
  computed: {
    fullName() {
      if (this.userInfo) {
        const { first_name_en, last_name_en } = this.userInfo;
        return `${first_name_en || ''} ${last_name_en || ''}`.trim() || 'User';
      }
      return null;
    }
    // userAvatar() {
    //   // Replace with actual logic if user has an avatar URL
    //   return this.defaultAvatar;
    // },
  },
  methods: {
    toggleDropdown() {
      this.spanVisible = !this.spanVisible;
    },
    handleClickOutside(event) {
      if (!event.target.closest('.relative')) {
        this.spanVisible = false;
      }
    },
    async handleLogOut() {
      try {
        await removeAllToken(); // Clear all cookies
        this.$router.push('/login'); // Redirect to login
      } catch (error) {
        console.error('Logout error:', error);
        this.$router.push('/login'); // Redirect even if cookie clearing fails
      }
    },
    handleImageError(event) {
      // event.target.src = this.defaultAvatar; // Fallback to default avatar on error
    }
  },
  mounted() {
    const userInfoCookie = getUserInfoCookie();
    if (userInfoCookie) {
      try {
        this.userInfo = JSON.parse(userInfoCookie);
      } catch (error) {
        console.error('Failed to parse user info:', error);
      }
    }
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }
};
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