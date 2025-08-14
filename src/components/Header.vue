<template>
  <div
    class="relative flex items-center justify-between p-4 bg-green-700 shadow-lg"
  >
    <label
      for="menu-toggle"
      class="text-gray-100 cursor-pointer hover:text-white"
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
          class="object-cover w-10 h-10 rounded-full"
          @error="handleImageError"
        />
        <span class="hidden font-medium text-white sm:inline">
          {{ fullName || 'User' }}
        </span>
        <font-awesome-icon
          :icon="spanVisible ? 'chevron-up' : 'chevron-down'"
          class="text-white cursor-pointer"
        />
      </button>

      <div
        v-if="spanVisible"
        class="absolute right-0 z-50 w-48 p-4 bg-white border border-gray-200 rounded-lg shadow-lg top-12"
      >
        <div class="mb-2 font-medium text-gray-700">
          <strong>{{ fullName || 'Unknown User' }}</strong>
        </div>
        <button
          class="flex items-center w-full gap-2 px-3 py-2 text-left text-blue-600 transition-colors rounded cursor-pointer hover:bg-blue-100"
          @click="handleLogOut"
        >
          <font-awesome-icon icon="arrow-right-from-bracket" />
          <span>My Informaion</span>
        </button>
        <button
          class="flex items-center w-full gap-2 px-3 py-2 text-left text-red-600 transition-colors rounded cursor-pointer hover:bg-red-100"
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