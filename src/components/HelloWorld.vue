<template>
  <div class="p-6">
    <div class="overflow-x-auto rounded-lg shadow-md">
      <table class="min-w-full divide-y divide-gray-200 bg-white">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Name
            </th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Email
            </th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Role
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              Alice
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              alice@example.com
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              Admin
            </td>
          </tr>
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              Bob
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              bob@example.com
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              Editor
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style></style>
