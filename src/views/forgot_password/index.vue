<template>
  <div class="min-h-screen flex">
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
      <div class="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl border-t-4 border-[#2e6d56]">
        <div class="mb-8 text-center">
          <h1
            class="text-3xl font-extrabold text-[#2e6d56] tracking-tight border-b border-gray-200 inline-block px-4 pb-1">
            SunFlex
          </h1>
          <p class="text-[#2e6d56] font-semibold tracking-wider text-sm uppercase mt-1">
            Information System
          </p>
          <p class="mt-2 text-xs text-gray-500">SunFlex(Cambodia) Co., Ltd.</p>
        </div>

        <div class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 text-center">
              Forgot Password
            </h2>
            <p class="text-sm text-gray-600 text-center mt-2">
              Enter your email to receive a password reset link.
            </p>
          </div>
          <form @submit.prevent="requestPasswordReset" class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div class="relative">
                <input id="email" v-model="email" type="email" required
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e6d56] focus:border-[#2e6d56] transition text-sm shadow-sm"
                  placeholder="Enter your email" />
                <span class="absolute left-3 top-2.5 text-gray-400">
                  <i class="fas fa-envelope"></i>
                </span>
              </div>
            </div>

            <button type="submit" :disabled="isLoading"
              class="w-full flex items-center justify-center gap-2 cursor-pointer bg-[#2e6d56] text-white py-2.5 rounded-lg hover:bg-[#245c48] transition-all duration-300 text-base font-semibold shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed">
              <span v-if="!isLoading">Send Reset Link</span>
              <span v-else class="flex items-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Sending...
              </span>
            </button>
          </form>

          <p v-if="error" class="text-red-600 text-center text-sm mt-3">
            {{ error }}
          </p>
          <p v-if="successMessage" class="text-green-600 text-center text-sm mt-3">
            <i class="fas fa-check-circle mr-1"></i>
            {{ successMessage }}
          </p>

          <div class="text-center mt-4 text-sm">
            <RouterLink to="/login"
              class="text-[#2e6d56] font-semibold hover:text-[#1e4d3d] hover:underline transition"><i
                class="fas fa-arrow-left mr-1"></i> Back to Login</RouterLink>
          </div>
        </div>

        <hr class="mt-8 mb-4 border-gray-100" />
        <div class="text-xs text-center text-gray-400">
          ©2025 by SunFlex (Cambodia) Co., Ltd
        </div>
      </div>
    </div>

    <div
      class="hidden lg:flex w-1/2 items-center justify-center p-8 bg-gradient-to-br from-[#2e6d56] to-[#6dae98] relative overflow-hidden">
      <div class="absolute inset-0 z-0 opacity-10">
        <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle cx="20" cy="20" r="15" fill="currentColor" class="text-white opacity-20" />
          <circle cx="80" cy="50" r="20" fill="currentColor" class="text-white opacity-10" />
          <rect x="10" y="70" width="30" height="10" fill="currentColor" class="text-white opacity-15" />
          <polygon points="60,10 70,30 50,30" fill="currentColor" class="text-white opacity-25" />
        </svg>
      </div>
      <div class="relative z-10 text-center text-white p-6 rounded-lg">
        <h2 class="text-5xl font-extrabold mb-3 leading-tight drop-shadow-lg">
          <span class="text-green-500">SunFlex(Cambodia) Co., Ltd.</span>
        </h2>
        <p class="text-xl font-light mb-6">
          Your partner in innovative information systems.
        </p>
        <div class="space-y-2 text-lg">
          <p>
            <i class="fas fa-map-marker-alt mr-2"></i>Phnom Penh, Cambodia
          </p>
          <p>
            <i class="fas fa-phone mr-2"></i>+855 23 886 289 / +855 92 301 113
          </p>
          <p><i class="fas fa-globe mr-2"></i>sunflexcambodia.com</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { forgotPassword } from '@/apis/auth';

export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      isLoading: false,
      error: '', // Added error state to match modern Vue practices
      successMessage: ''
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    async requestPasswordReset() {
      if (!this.email) {
        this.error = 'Please enter your email.';
        return;
      }
      this.error = ''; // Clear previous errors
      this.successMessage = ''; // Clear previous success messages

      this.isLoading = true;

      try {
        const res = await forgotPassword({ email: this.email });
        if (res.status === 1) {
          this.successMessage =
            'Password reset link sent to your email. Please check your inbox.';
          // Optional: wait a bit before redirecting (2 seconds)
          setTimeout(() => {
            // this.router.push('/login');
            // Keeping the user on the page with a success message is often better UX
          }, 2000);
        } else {
          this.error =
            res.message || 'Failed to send reset link. Please try again.';
        }
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          'An error occurred. Check your network and try again.';
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>