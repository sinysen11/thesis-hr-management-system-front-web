<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Dashboard</h2>

    <!-- Top Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <i class="fas fa-users text-blue-600"></i> Total Employees
        </h3>
        <p class="text-3xl font-bold text-blue-600">150</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <i class="fas fa-building text-green-600"></i> Departments
        </h3>
        <p class="text-3xl font-bold text-green-600">8</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <i class="fas fa-tasks text-yellow-600"></i> Active Projects
        </h3>
        <p class="text-3xl font-bold text-yellow-600">12</p>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">Attendance Summary</h3>
        <canvas id="attendanceChart"></canvas>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">Leave Request Trends</h3>
        <canvas id="leaveRequestChart"></canvas>
      </div>
    </div>

    <!-- Table + Birthday Panel -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-2 bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">Recent Leave Requests</h3>
        <table class="w-full text-left border-t">
          <thead>
            <tr class="border-b">
              <th class="py-2">Name</th>
              <th class="py-2">Date</th>
              <th class="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(request, index) in leaveRequests"
              :key="index"
              class="border-b"
            >
              <td class="py-2">{{ request.name }}</td>
              <td class="py-2">{{ request.date }}</td>
              <td class="py-2">
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-sm font-medium',
                    statusClass(request.status)
                  ]"
                >
                  {{ request.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-2">🎂 Upcoming Birthdays</h3>
        <ul>
          <li
            v-for="(b, i) in upcomingBirthdays"
            :key="i"
            class="mb-2 last:mb-0 bg-gray-50 px-3 py-2 rounded-md hover:bg-pink-50 transition"
          >
            <div class="flex justify-between items-center">
              <span class="font-medium text-gray-800">{{ b.name }}</span>
              <span class="text-gray-500 text-sm">{{ b.date }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'Dashboard',
  data() {
    return {
      leaveRequests: [
        { name: 'Chan Danaroth', date: 'Feb 14, 2025', status: 'Approved' },
        { name: 'Chan Mony', date: 'Feb 14, 2025', status: 'Rejected' },
        { name: 'Thin Chrang', date: 'Feb 14, 2025', status: 'Rejected' },
        { name: 'Sen Siny', date: 'Feb 14, 2025', status: 'Declined' },
        { name: 'Yoeum Sovanet', date: 'Feb 14, 2025', status: 'Canceled' },
        { name: 'Sim Sreymean', date: 'Feb 14, 2025', status: 'Pending' }
      ],
      upcomingBirthdays: [
        { name: 'Chan Danaroth', date: 'Feb 14, 2025' },
        { name: 'Sok Rithy', date: 'Mar 03, 2025' },
        { name: 'Phan Dara', date: 'Apr 21, 2025' },
        { name: 'Kim Sreyna', date: 'May 10, 2025' },
        { name: 'Long Vannak', date: 'Jun 18, 2025' },
        { name: 'Mao Sokha', date: 'Jul 29, 2025' },
        { name: 'Neang Bopha', date: 'Aug 07, 2025' }
      ]
    };
  },
  methods: {
    statusClass(status) {
      switch (status) {
        case 'Approved':
          return 'bg-green-100 text-green-700';
        case 'Rejected':
          return 'bg-red-100 text-red-700';
        case 'Declined':
          return 'bg-yellow-200 text-yellow-800';
        case 'Canceled':
          return 'bg-pink-100 text-pink-700';
        case 'Pending':
          return 'bg-yellow-100 text-yellow-700';
        default:
          return 'bg-gray-100 text-gray-700';
      }
    }
  },
  mounted() {
    // Attendance Chart
    new Chart(document.getElementById('attendanceChart'), {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Attendance',
            data: [5, 10, 8, 15, 7, 3, 2],
            borderColor: '#8B5CF6',
            fill: false,
            tension: 0.4
          }
        ]
      }
    });

    // Leave Request Chart
    new Chart(document.getElementById('leaveRequestChart'), {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Leave Requests',
            data: [2, 4, 6, 3, 5, 1, 3],
            borderColor: '#3B82F6',
            fill: false,
            tension: 0.4
          }
        ]
      }
    });
  }
};
</script>

<style scoped>
table th,
table td {
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
