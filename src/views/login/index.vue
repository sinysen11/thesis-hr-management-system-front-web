<template>
  <div
    class="flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-md p-6 bg-white shadow-2xl rounded-xl">
      <!-- Logo Section -->
      <div class="mb-6 text-center">
        <h1 class="text-2xl font-semibold text-[#2e6d56]">SunFlex</h1>
        <p class="text-[#2e6d56] font-medium tracking-wide text-sm">
          INFORMATION SYSTEM
        </p>
        <p class="mt-1 text-xs text-gray-600">SunFlex(Cambodia) Co., Ltd.</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Email <span class="text-red-500">*</span>
          </label>
          <input
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2e6d56] transition text-sm"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Password <span class="text-red-500">*</span>
          </label>
          <div class="relative mt-1">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2e6d56] transition text-sm"
              placeholder="Enter your password"
            />
            <button
              type="button"
              class="absolute right-3 top-2.5 text-gray-500 focus:outline-none"
              @click="togglePassword"
            >
              <i v-if="showPassword" class="fas fa-eye-slash"></i>
              <i v-else class="fas fa-eye"></i>
            </button>
          </div>
          <div class="mt-1 text-right">
            <RouterLink
              to="/forgot-password"
              class="text-sm text-[#2e6d56] hover:underline"
              >Forget password?</RouterLink
            >
          </div>
        </div>

        <!-- Button with loading state -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex items-center justify-center gap-2 cursor-pointer bg-[#2e6d56] text-white py-2 rounded-md hover:bg-[#245c48] transition text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span v-if="!loading">Login</span>
          <span v-else class="flex items-center gap-2">
            <svg
              class="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Logging in...
          </span>
        </button>
      </form>

      <!-- Footer -->
      <div class="mt-6 text-xs text-center text-gray-500">
        ©2025 by SunFlex (Cambodia) Co., Ltd<br />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { signin } from '@/apis/auth';
import {
  setToken,
  setUserInfoCookie,
  getToken
} from '@/services/authentication';

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const router = useRouter();

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  if (!email.value || !password.value) {
    alert('Please fill in all required fields.');
    return;
  }

  loading.value = true; // start loading
  try {
    const response = await signin({
      email: email.value,
      password: password.value
    });

    if (response.status === 1 && response.token && response.user) {
      await setToken('token', response.token);
      await setUserInfoCookie(response.user);

      localStorage.setItem(
        'permissions',
        JSON.stringify(response.user.role.permissions || [])
      );

      router.push('/');
    } else {
      alert('Login failed: ' + (response.message || 'Invalid login response'));
    }
  } catch (error) {
    console.error('Login error:', error.response || error);
    alert(
      'Login failed: ' +
        (error.response?.data?.message || error.message || 'An error occurred')
    );
  } finally {
    loading.value = false; // stop loading
  }
};

onMounted(async () => {
  const token = await getToken();
  if (token) {
    router.push('/');
  }
});
</script>
