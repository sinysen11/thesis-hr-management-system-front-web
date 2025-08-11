<template>
  <div
    class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
      <!-- Logo Section -->
      <div class="text-center mb-6">
        <h1 class="text-2xl font-semibold text-[#2e6d56]">SunFlex</h1>
        <p class="text-[#2e6d56] font-medium tracking-wide text-sm">
          INFORMATION SYSTEM
        </p>
        <p class="text-gray-600 text-xs mt-1">SunFlex(Cambodia) Co., Ltd.</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Email <span class="text-red-500">*</span></label
          >
          <input
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2e6d56] transition text-sm"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Password <span class="text-red-500">*</span></label
          >
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
          <div class="text-right mt-1">
            <RouterLink
              to="/forgot-password"
              class="text-sm text-[#2e6d56] hover:underline"
              >Forget password?</RouterLink
            >
          </div>
        </div>

        <button
          type="submit"
          class="w-full bg-[#2e6d56] text-white py-2 rounded-md hover:bg-[#245c48] transition text-sm font-medium"
        >
          Login
        </button>
      </form>

      <!-- Sign Up Link -->
      <div class="text-center mt-4 text-sm text-gray-700">
        Don’t have an account?
        <RouterLink
          to="/signup"
          class="text-[#2e6d56] font-medium hover:underline"
          >Sign Up</RouterLink
        >
      </div>

      <!-- Footer -->
      <div class="text-xs text-center text-gray-500 mt-6">
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
const router = useRouter();

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  if (!email.value || !password.value) {
    alert('Please fill in all required fields.');
    return;
  }

  try {
    const response = await signin({
      email: email.value,
      password: password.value
    });
    console.log('Login response:', response);
    // Check if status is 1 (number) and token/user exist
    if (response.status === 1 && response.token && response.user) {
      await setToken('token', response.token);
      await setUserInfoCookie(response.user);
      router.push('/');
    } else {
      console.log('Login failed condition:', {
        status: response.status,
        token: !!response.token,
        user: !!response.user
      });
      alert('Login failed: ' + (response.message || 'Invalid login response'));
    }
  } catch (error) {
    console.error('Login error:', error.response || error);
    alert(
      'Login failed: ' +
        (error.response?.data?.message || error.message || 'An error occurred')
    );
  }
};

onMounted(async () => {
  const token = await getToken();
  console.log('onMounted token:', token);
  if (token) {
    router.push('/');
  }
});
</script>