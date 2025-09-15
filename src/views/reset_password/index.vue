<template>
  <div
    class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
      <!-- Logo Section -->
      <div class="text-center mb-6">
        <h1 class="text-2xl font-semibold text-green-800">SunFlex</h1>
        <p class="text-green-700 font-medium tracking-wide text-sm">
          INFORMATION SYSTEM
        </p>
        <p class="text-gray-600 text-xs mt-1">SunFlex(Cambodia) Co., Ltd.</p>
      </div>

      <!-- Reset Password Form -->
      <div class="space-y-6">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 text-center">
            Reset Password
          </h2>
          <p class="text-sm text-gray-600 text-center mt-2">
            Enter your new password below.
          </p>
        </div>
        <form @submit.prevent="resetPasswordHandler" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >New Password <span class="text-red-500">*</span></label
            >
            <input
              v-model="password"
              type="password"
              required
              minlength="6"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700 transition text-sm"
              placeholder="Enter new password"
            />
          </div>

          <button
            type="submit"
            class="w-full bg-[#2e6d56] text-white py-2 rounded-md hover:bg-green-800 transition text-sm font-medium"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Resetting...' : 'Reset Password' }}
          </button>
        </form>

        <!-- Success Message -->
        <p v-if="successMessage" class="text-green-600 text-center text-sm mt-3">
          {{ successMessage }}
        </p>

        <!-- Back to Login Link -->
        <div class="text-center mt-4 text-sm text-gray-700">
          <RouterLink
            to="/login"
            class="text-green-700 font-medium hover:underline"
            >Back to Login</RouterLink
          >
        </div>
      </div>

      <!-- Footer -->
      <div class="text-xs text-center text-gray-500 mt-6">
        ©2025 by SunFlex (Cambodia) Co., Ltd<br />
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router';
import { resetPassword } from '@/apis/auth';

export default {
  name: 'ResetPassword',
  data() {
    return {
      password: '',
      isLoading: false,
      error: '',
      successMessage: ''
    };
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    return { router, route };
  },
  methods: {
    async resetPasswordHandler() {
      if (!this.password) {
        alert('Please fill in both fields.');
        return;
      }
      this.isLoading = true;
      this.error = null;

      try {
        // ✅ get token from query string
        const token = this.route.query.token;

        if (!token) {
          alert('Invalid or missing token');
          this.isLoading = false;
          return;
        }

        // call API with raw JSON (token + new_password)
        const res = await resetPassword({
          token,
          new_password: this.password
        });

        if (res.status === 1) {
          this.successMessage = 'Password has been reset successfully';
          setTimeout(() => {
            this.router.push('/login');
          }, 2000);
        } else {
          this.error = res.message || 'Failed to reset password. Please try again.';
          alert(this.error);
        }
      } catch (err) {
        this.error = err.message || 'Failed to reset password. Please try again.';
        alert(this.error);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
