<template>
  <div class="min-h-screen bg-[#2e6d56] flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-2xl px-10 py-12 w-[380px]">
      <!-- Logo and company info -->
      <div class="text-center mb-6">
        <h1 class="text-4xl font-bold text-[#2e6d56]">SunFlex</h1>
        <p
          class="text-sm font-semibold tracking-wide bg-[#2e6d56] text-white inline-block px-2 mt-1"
        >
          INFORMATION SYSTEM
        </p>
        <p class="text-gray-600 text-sm mt-1">SunFlex(Cambodia) Co., Ltd.</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="text-sm font-medium text-gray-700"
            >Email <span class="text-red-500">*</span></label
          >
          <input
            type="email"
            v-model="email"
            required
            class="mt-1 w-full px-4 py-2 rounded-md bg-gray-100 focus:outline-none"
          />
        </div>

        <div class="mb-4 relative">
          <label class="text-sm font-medium text-gray-700"
            >Password <span class="text-red-500">*</span></label
          >
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            required
            class="mt-1 w-full px-4 py-2 rounded-md bg-gray-100 focus:outline-none"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 bottom-3 text-gray-500 focus:outline-none"
          >
            <svg
              v-if="!showPassword"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a10.05 10.05 0 012.247-3.592m3.838-2.482A9.99 9.99 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-2.284 3.59M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3l18 18"
              />
            </svg>
          </button>
        </div>

        <div class="mb-6 relative">
          <label class="text-sm font-medium text-gray-700"
            >Confirm Password <span class="text-red-500">*</span></label
          >
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="confirmPassword"
            required
            class="mt-1 w-full px-4 py-2 rounded-md bg-gray-100 focus:outline-none"
          />
          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute right-3 bottom-3 text-gray-500 focus:outline-none"
          >
            <svg
              v-if="!showConfirmPassword"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a10.05 10.05 0 012.247-3.592m3.838-2.482A9.99 9.99 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-2.284 3.59M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3l18 18"
              />
            </svg>
          </button>
        </div>

        <button
          type="submit"
          class="bg-[#2e6d56] text-white w-full py-2 rounded-md hover:bg-[#245c48] transition"
        >
          Register
        </button>

        <p class="text-xs text-center mt-4">
          Already have account?
          <router-link to="/" class="text-[#2e6d56] underline"
            >Sign In</router-link
          >
        </p>
      </form>

      <!-- Footer -->
      <p class="text-[10px] text-center text-gray-500 mt-6 leading-tight">
        ©2025 by SunFlex (Cambodia) Co.,Ltd <br />
        Best viewed with IE 9+, Firefox 16+, Safari 5.1, Chrome 23+.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const handleRegister = () => {
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match!');
    return;
  }
  // Submit logic here (e.g., API call)
  console.log({ email: email.value, password: password.value });
};
</script>
