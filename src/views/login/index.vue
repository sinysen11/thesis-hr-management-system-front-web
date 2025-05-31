<template>
  <div class="min-h-screen bg-green-800 flex items-center justify-center">
    <div class="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
      <!-- Logo Section -->
      <div class="text-center mb-6">
        <h1 class="text-4xl font-bold text-green-800">SunFlex</h1>
        <p class="text-green-700 font-semibold tracking-wide">
          INFORMATION SYSTEM
        </p>
        <p class="text-gray-600 text-sm mt-1">SunFlex(Cambodia) Co., Ltd.</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700"
            >Email <span class="text-red-500">*</span></label
          >
          <input
            type="email"
            v-model="email"
            class="w-full mt-1 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700"
            placeholder="Enter your email"
            required
          />
        </div>

        <div class="mb-2">
          <label class="block text-sm font-medium text-gray-700"
            >Password <span class="text-red-500">*</span></label
          >
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              class="w-full mt-1 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              class="absolute right-3 top-4 text-gray-500"
              @click="togglePassword"
            >
              <svg
                v-if="showPassword"
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
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-.534.04-1.06.118-1.575M4.222 4.222L19.778 19.778M15 12a3 3 0 11-6 0 3 3 0 016 0z"
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6 0a6 6 0 1112 0 6 6 0 01-12 0z"
                />
              </svg>
            </button>
          </div>
          <div class="text-right mt-1">
            <a href="#" class="text-sm text-green-700 hover:underline"
              >Forget password?</a
            >
          </div>
        </div>

        <button
          type="submit"
          class="w-full bg-green-700 text-white py-2 mt-4 rounded-md hover:bg-green-800 transition"
        >
          Login
        </button>
      </form>

      <!-- Sign Up Link -->
      <div class="text-center mt-4 text-sm text-gray-700">
        don't have an account?
        <a href="#" class="text-green-700 font-medium hover:underline"
          >Sign Up</a
        >
      </div>

      <!-- Footer -->
      <div class="text-xs text-center text-gray-500 mt-6">
        ©2025 by SunFlex (Cambodia) Co., Ltd<br />
        Best viewed with IE 9+, Firefox 16+, Safari 5.1, Chrome 23+
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const login = () => {
  alert(`Email: ${email.value}\nPassword: ${password.value}`);
};
</script>
