<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Profile</h2>
    <div class="bg-white p-6 rounded-lg shadow max-w-2xl">
      <div class="flex items-center space-x-4 mb-6">
        <div
          class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center"
        >
          <span class="text-2xl font-semibold text-gray-600">JD</span>
        </div>
        <div>
          <h3 class="text-xl font-semibold">John Doe</h3>
          <p class="text-gray-600">Senior Developer</p>
        </div>
      </div>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <p class="text-gray-900">john.doe@example.com</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Department</label
          >
          <p class="text-gray-900">IT</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Phone</label>
          <p class="text-gray-900">+1 (555) 123-4567</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile'
};
</script>
