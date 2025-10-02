<template>
  <div class="relative flex items-center justify-between p-4 bg-green-700 shadow-lg">

    <label for="menu-toggle" class="text-gray-100 cursor-pointer hover:text-white">
      <font-awesome-icon icon="bars" class="text-xl" />
    </label>

    <div class="relative">
      <button @click="toggleDropdown" class="flex items-center gap-2 focus:outline-none" aria-label="User menu">
        <img
          :src="defaultAvatar"
          alt="User Avatar"
          class="object-cover w-8 h-8 border-4 border-white rounded-full shadow-md ring-4 ring-teal-400/50"
          @error="handleImageError"
        />
        <span class="hidden font-medium text-white sm:inline">
          {{ fullName || 'User' }}
        </span>
        <font-awesome-icon :icon="spanVisible ? 'chevron-up' : 'chevron-down'" class="text-white cursor-pointer" />
      </button>

      <div v-if="spanVisible"
        class="absolute right-0 z-50 w-56 mt-2 origin-top-right bg-white border border-gray-200 rounded-lg shadow-xl top-full animate-fade-in">
        <div class="px-4 py-3 border-b border-gray-100">
          <p class="text-sm font-semibold text-gray-800 truncate">
            {{ fullName || 'Unknown User' }}
          </p>
          <p v-if="userInfo && userInfo.email" class="text-xs text-gray-500 truncate">
            {{ userInfo.email || '' }}
          </p>
        </div>

        <div class="py-1">
          <button
            class="flex items-center w-full gap-3 px-4 py-2 text-left text-gray-700 transition-colors duration-150 cursor-pointer hover:bg-indigo-50 hover:text-green-600"
            @click="goToMyInfo">
            <i class="fa-regular fa-circle-user"></i>
            <span> My Information</span>
          </button>

          <button
            class="flex items-center w-full gap-3 px-4 py-2 text-left text-gray-700 transition-colors duration-150 cursor-pointer hover:bg-indigo-50 hover:text-green-600"
            @click="openChangePasswordDialog">
            <i class="fa-solid fa-unlock"></i>
            <span>Change Password</span>
          </button>

          <button
            class="flex items-center w-full gap-3 px-4 py-2 text-left text-red-600 transition-colors duration-150 border-t border-gray-100 cursor-pointer hover:bg-red-50"
            @click="handleLogOut">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="isChangePasswordDialogOpen" style="background-color: rgb(0 0 0 / 0.5);"
      class="fixed inset-0 z-[100] flex items-center justify-center" @click.self="closeChangePasswordDialog">
      <div class="w-full max-w-md p-6 transition-all duration-300 transform scale-100 bg-white rounded-lg shadow-2xl"
        @click.stop>
        <div class="flex items-center justify-between pb-3 border-b">
          <h3 class="text-xl font-semibold text-gray-800">Change Password</h3>
          <button @click="closeChangePasswordDialog" class="text-gray-500 hover:text-gray-800">
            <font-awesome-icon icon="times" class="text-xl" />
          </button>
        </div>

        <form @submit.prevent="submitChangePassword" class="mt-4 space-y-4">
          <div>
            <label for="old-password" class="block text-sm font-medium text-gray-700">Old Password</label>
            <div class="relative">
              <input id="old-password" v-model="passwordForm.oldPassword" :type="showPassword.old ? 'text' : 'password'"
                required
                class="block w-full px-3 py-2 pr-10 mt-1 border rounded-md shadow-sm focus:outline-none sm:text-sm"
                :class="passwordErrors.oldPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'" />
              <button type="button" @click="showPassword.old = !showPassword.old"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer hover:text-gray-700">
                <i :class="showPassword.old ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
            <p v-if="passwordErrors.oldPassword" class="mt-1 text-xs text-red-600">{{ passwordErrors.oldPassword }}</p>
          </div>

          <div>
            <label for="new-password" class="block text-sm font-medium text-gray-700">New Password</label>
            <div class="relative">
              <input id="new-password" v-model="passwordForm.newPassword" :type="showPassword.new ? 'text' : 'password'"
                required
                class="block w-full px-3 py-2 pr-10 mt-1 border rounded-md shadow-sm focus:outline-none sm:text-sm"
                :class="passwordErrors.newPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'" />
              <button type="button" @click="showPassword.new = !showPassword.new"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer hover:text-gray-700">
                <i :class="showPassword.new ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
            <p v-if="passwordErrors.newPassword" class="mt-1 text-xs text-red-600">{{ passwordErrors.newPassword }}</p>
          </div>

          <div>
            <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <div class="relative">
              <input id="confirm-password" v-model="passwordForm.confirmPassword"
                :type="showPassword.confirm ? 'text' : 'password'" required
                class="block w-full px-3 py-2 pr-10 mt-1 border rounded-md shadow-sm cursor-pointer focus:outline-none sm:text-sm"
                :class="passwordErrors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'" />
              <button type="button" @click="showPassword.confirm = !showPassword.confirm"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700">
                <i :class="showPassword.confirm ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
            <p v-if="passwordErrors.confirmPassword" class="mt-1 text-xs text-red-600">{{ passwordErrors.confirmPassword }}</p>
          </div>

          <div class="flex justify-end pt-4 space-x-3 border-t">
            <button type="button" @click="closeChangePasswordDialog"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-transparent rounded-md cursor-pointer hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              Cancel
            </button>
            <button type="submit" :disabled="!isFormValid"
              class="px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :class="isFormValid ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'">
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="isSuccessDialogOpen" style="background-color: rgb(0 0 0 / 0.5);"
      class="fixed inset-0 z-[101] flex items-center justify-center">
      <div class="w-full max-w-sm p-6 transition-all duration-300 transform scale-100 bg-white rounded-lg shadow-2xl">
        <div class="flex flex-col items-center justify-center space-y-4">
          <div class="p-3 text-green-600 bg-green-100 rounded-full">
            <i class="text-3xl fa-solid fa-check"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-800">Success</h3>
          <p class="text-center text-gray-600">{{ successMessage }}</p>
        </div>

        <div class="flex justify-center pt-5 mt-4 border-t">
          <button @click="confirmSuccessDialog"
            class="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { getUserInfoCookie, removeAllToken } from '@/services/authentication';
import { changePassword } from '../apis/user';

export default {
  name: 'NavbarComponent',
  components: { FontAwesomeIcon },
  data() {
    return {
      spanVisible: false,
      userInfo: null,
      defaultAvatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      // Change password dialog
      isChangePasswordDialogOpen: false,
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordErrors: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      showPassword: {
        old: false,
        new: false,
        confirm: false
      },

      // Success dialog after password change
      isSuccessDialogOpen: false,
      successMessage: ''
    };
  },
  computed: {
    fullName() {
      if (this.userInfo) {
        const { first_name_en, last_name_en } = this.userInfo;
        return `${first_name_en || ''} ${last_name_en || ''}`.trim() || 'User';
      }
      return null;
    },
    isFormValid() {
      // Re-run validation logic here to ensure all fields are valid
      // before allowing submission, as computed runs whenever dependencies change.
      const oldPassValid = !!this.passwordForm.oldPassword;
      const newPassValid = this.passwordForm.newPassword.length >= 6;
      const confirmPassMatch = this.passwordForm.newPassword === this.passwordForm.confirmPassword;

      // The button's disabled state is purely based on the form data's validity,
      // not the API response errors, which are handled in the `submitChangePassword` method.
      return oldPassValid && newPassValid && confirmPassMatch;
    }
  },
  methods: {
    toggleDropdown() {
      this.spanVisible = !this.spanVisible;
    },
    handleClickOutside(event) {
      const userMenuContainer = this.$el.querySelector('.relative:last-child');
      if (userMenuContainer && !userMenuContainer.contains(event.target)) {
        this.spanVisible = false;
      }
    },
    async handleLogOut() {
      try {
        await removeAllToken();
        this.$router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
        // Fallback to push to login even on error to clear the session visually
        this.$router.push('/login');
      }
    },
    goToMyInfo() {
      this.$router.push('/personal-info');
      this.spanVisible = false;
    },
    openChangePasswordDialog() {
      this.spanVisible = false;
      this.isChangePasswordDialogOpen = true;
    },
    closeChangePasswordDialog() {
      this.isChangePasswordDialogOpen = false;
      this.passwordForm = { oldPassword: '', newPassword: '', confirmPassword: '' };
      this.passwordErrors = { oldPassword: '', newPassword: '', confirmPassword: '' };
      this.showPassword = { old: false, new: false, confirm: false };
    },
    validateForm() {
      // This is for displaying error messages when the user interacts with the form
      this.passwordErrors.oldPassword = this.passwordForm.oldPassword ? '' : 'Old password is required.';
      this.passwordErrors.newPassword =
        this.passwordForm.newPassword.length < 6 ? 'New password must be at least 6 characters.' : '';
      this.passwordErrors.confirmPassword =
        this.passwordForm.newPassword !== this.passwordForm.confirmPassword
          ? 'Passwords do not match.'
          : '';
          
      // Ensure all fields pass client-side validation before continuing
      return !this.passwordErrors.oldPassword && !this.passwordErrors.newPassword && !this.passwordErrors.confirmPassword;
    },
    async submitChangePassword() {
      // Clear previous API errors first
      this.passwordErrors.oldPassword = ''; 
      
      // Re-validate and check if client-side validation passed
      if (!this.validateForm() || !this.isFormValid) return;

      try {
        const payload = {
          user_id: this.userInfo?._id,
          oldPassword: this.passwordForm.oldPassword,
          newPassword: this.passwordForm.newPassword
        };

        const response = await changePassword(payload);

        if (response?.status === 1) {
          this.closeChangePasswordDialog();
          // Set the message and open the new success dialog
          this.successMessage = 'Password changed successfully. Please log in again with your new password.';
          this.isSuccessDialogOpen = true;
        } else {
          // Handle API error message for old password failure
          this.passwordErrors.oldPassword = response?.message || 'Failed to change password.';
        }
      } catch (error) {
        console.error('Error changing password:', error);
        // Handle network/server error
        this.passwordErrors.oldPassword =
          error.response?.data?.message || 'An error occurred while changing password. Please try again.';
      }
    },
    async confirmSuccessDialog() {
      // This is the "OK" button action for the new success dialog
      this.isSuccessDialogOpen = false;
      await this.handleLogOut(); // This will log the user out and redirect to /login
    },
    handleImageError(event) {
      event.target.src = 'https://via.placeholder.com/150?text=User';
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
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}

.transition-colors {
  transition: background-color 0.2s ease;
}
</style>