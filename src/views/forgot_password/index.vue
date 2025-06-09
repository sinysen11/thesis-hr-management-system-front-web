<template>
  <div
    class="min-h-screen bg-[#2e6d56] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
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

      <!-- Forgot Password Form -->
      <div class="space-y-6">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 text-center">
            Forgot Password
          </h2>
          <p class="text-sm text-gray-600 text-center mt-2">
            Enter your email to reset your password.
          </p>
        </div>
        <form @submit.prevent="requestPasswordReset" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Email <span class="text-red-500">*</span></label
            >
            <input
              v-model="email"
              type="email"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700 transition text-sm"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            class="w-full bg-[#2e6d56] text-white py-2 rounded-md hover:bg-green-800 transition text-sm font-medium"
          >
            Send Reset Link
          </button>
        </form>

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

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const router = useRouter();

const requestPasswordReset = () => {
  if (!email.value) {
    alert('Please enter your email.');
    return;
  }
  // Simulate password reset request (replace with actual API call)
  console.log('Password reset requested for:', email.value);
  alert(
    `A password reset link has been sent to ${email.value}. Check your inbox.`
  );
  // Redirect back to login after success (for demo)
  router.push('/login');
};
</script>
