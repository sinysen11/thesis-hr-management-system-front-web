<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Employees</h2>
    <div class="bg-white rounded-lg shadow overflow-x-auto">
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left">Name</th>
            <th class="px-6 py-3 text-left">Department</th>
            <th class="px-6 py-3 text-left">Position</th>
            <th class="px-6 py-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in employees" :key="employee.id" class="border-t">
            <td class="px-6 py-4">{{ employee.name }}</td>
            <td class="px-6 py-4">{{ employee.department }}</td>
            <td class="px-6 py-4">{{ employee.position }}</td>
            <td class="px-6 py-4">
              <span
                :class="
                  employee.status === 'Active'
                    ? 'text-green-600'
                    : 'text-red-600'
                "
              >
                {{ employee.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Employees',
  data() {
    return {
      employees: [
        {
          id: 1,
          name: 'John Doe',
          department: 'IT',
          position: 'Developer',
          status: 'Active'
        },
        {
          id: 2,
          name: 'Jane Smith',
          department: 'HR',
          position: 'Manager',
          status: 'Active'
        },
        {
          id: 3,
          name: 'Mike Johnson',
          department: 'Finance',
          position: 'Analyst',
          status: 'Inactive'
        }
      ]
    };
  }
};
</script>
