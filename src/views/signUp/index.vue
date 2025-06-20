<template>
  <div
    class="min-h-screen bg-[#2e6d56] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
      <!-- Logo and company info -->
      <div class="text-center mb-6">
        <h1 class="text-2xl font-semibold text-[#2e6d56]">SunFlex</h1>
        <p class="text-[#2e6d56] font-medium tracking-wide text-sm">
          INFORMATION SYSTEM
        </p>
        <p class="text-gray-600 text-xs mt-1">SunFlex(Cambodia) Co., Ltd.</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="space-y-4">
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

        <!-- Password Field -->
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700">
            Password <span class="text-red-500">*</span>
          </label>
          <div class="mt-1 relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full pr-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2e6d56] transition text-sm"
              placeholder="Enter your password"
            />
            <button
              type="button"
              @click="togglePassword"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 focus:outline-none"
            >
              <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
            </button>
          </div>
        </div>

        <!-- Confirm Password Field -->
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700">
            Confirm Password <span class="text-red-500">*</span>
          </label>
          <div class="mt-1 relative">
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              class="w-full pr-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2e6d56] transition text-sm"
              placeholder="Confirm your password"
            />
            <button
              type="button"
              @click="toggleConfirmPassword"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 focus:outline-none"
            >
              <i
                :class="showConfirmPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"
              ></i>
            </button>
          </div>
        </div>

        <button
          type="submit"
          class="w-full bg-[#2e6d56] text-white py-2 rounded-md hover:bg-[#245c48] transition text-sm font-medium"
        >
          Register
        </button>

        <p class="text-xs text-center mt-4">
          Already have an account?
          <RouterLink
            to="/login"
            class="text-[#2e6d56] font-medium hover:underline"
            >Sign In</RouterLink
          >
        </p>
      </form>

      <!-- Footer -->
      <div class="text-xs text-center text-gray-500 mt-6">
        ©2025 by SunFlex (Cambodia) Co., Ltd<br />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false
    };
  },
  methods: {
    handleRegister() {
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      console.log({
        email: this.email,
        password: this.password
      });
      // Add real submit logic here
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
};
</script>
