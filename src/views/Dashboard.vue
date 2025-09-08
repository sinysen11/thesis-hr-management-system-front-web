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
        <div v-if="isLoading" class="py-4 text-center">
          <i class="text-6xl text-green-700 fas fa-spinner fa-spin"></i>
        </div>
        <table
          v-else
          class="min-w-full table-auto text-sm bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200"
        >
          <thead
            class="bg-indigo-50 text-indigo-800 uppercase text-xs font-semibold tracking-wider"
          >
            <tr>
              <th class="px-6 py-4 text-left">Name</th>
              <th class="px-6 py-4 text-left">Reason</th>
              <th class="px-6 py-4 text-left">Date</th>
              <th class="px-6 py-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody class="text-gray-800 divide-y divide-gray-200">
            <tr v-if="leaveRequests.length === 0">
              <td
                colspan="4"
                class="px-6 py-4 text-center text-gray-500 italic"
              >
                No leave requests found.
              </td>
            </tr>
            <tr
              v-for="(request, index) in leaveRequests.slice(0, 5)"
              :key="index"
              class="transition-colors duration-200 hover:bg-gray-100 cursor-pointer"
            >
              <td class="px-6 py-4 font-medium whitespace-nowrap">
                {{ request.employeeName }}
              </td>
              <td class="px-6 py-4">{{ request.reason }}</td>
              <td class="px-6 py-4">{{ request.startDate }}</td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'px-3 py-1.5 rounded-full text-xs font-semibold',
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
import { getUserInfoCookie } from '@/services/authentication';
import Chart from 'chart.js/auto';
import moment from 'moment';
import { getStaffRequestForApprover } from '@/apis/request-leave';

export default {
  name: 'Dashboard',
  data() {
    return {
      leaveRequests: [],
      upcomingBirthdays: [
        { name: 'Chan Danaroth', date: 'Feb 14, 2025' },
        { name: 'Sok Rithy', date: 'Mar 03, 2025' },
        { name: 'Phan Dara', date: 'Apr 21, 2025' },
        { name: 'Kim Sreyna', date: 'May 10, 2025' },
        { name: 'Long Vannak', date: 'Jun 18, 2025' },
        { name: 'Mao Sokha', date: 'Jul 29, 2025' },
        { name: 'Neang Bopha', date: 'Aug 07, 2025' }
      ],
      userInfo: null,
      isLoading: false
    };
  },
  methods: {
    async fetchLeaveRequests(user_id) {
      this.isLoading = true;
      try {
        const response = await getStaffRequestForApprover(user_id, {
          limit: 5 // Fetch only the 5 most recent requests
        });
        if (response && response.data) {
          this.leaveRequests = response.data.map((request) => {
            let departmentName = 'N/A';
            if (request.user?.department) {
              departmentName = request.user.department.name_en || 'N/A';
            }
            return {
              id: request._id || '',
              employeeId: request.user?._id || '',
              employeeName: request.user
                ? `${request.user.first_name_en || ''} ${
                    request.user.last_name_en || ''
                  }`.trim() || 'Unknown Employee'
                : 'Unknown Employee',
              department: departmentName,
              leaveTypeId: request.type?._id || '',
              leaveTypeName: request.type?.name || 'Unknown Type',
              startDate: this.formatDate(request.fromDate),
              endDate: this.formatDate(request.toDate),
              approverId: request.approver?._id || '',
              approverName: request.approver
                ? `${request.approver.first_name_en || ''} ${
                    request.approver.last_name_en || ''
                  }`.trim() || 'N/A'
                : 'N/A',
              status: request.status || 'PENDING',
              reason: request.reason || 'No reason provided'
            };
          });
        } else {
          this.leaveRequests = [];
        }
      } catch (error) {
        console.error('Error fetching leave requests:', error);
        this.leaveRequests = [];
      } finally {
        this.isLoading = false;
      }
    },
    statusClass(status) {
      switch (status) {
        case 'APPROVED':
          return 'bg-green-100 text-green-700';
        case 'REJECTED':
          return 'bg-red-100 text-red-700';
        case 'CANCELLED':
        case 'DRAFT':
          return 'bg-yellow-200 text-yellow-800';
        case 'PENDING':
          return 'bg-yellow-100 text-yellow-700';
        default:
          return 'bg-gray-100 text-gray-700';
      }
    },
    formatDate(date) {
      return date ? moment(date).format('DD-MMM-YYYY') : 'N/A';
    }
  },
  created() {
    const userInfoCookie = getUserInfoCookie();
    if (userInfoCookie) {
      try {
        this.userInfo = JSON.parse(userInfoCookie);
      } catch {
        this.userInfo = null;
      }
    }
    if (this.userInfo && this.userInfo._id) {
      this.fetchLeaveRequests(this.userInfo._id);
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
