<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Dashboard</h2>

    <!-- Top Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <i class="fas fa-users text-blue-600"></i> Total Employees
        </h3>
        <p class="text-3xl font-bold text-blue-600">{{ totalEmployees }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <i class="fas fa-building text-green-600"></i> Departments
        </h3>
        <p class="text-3xl font-bold text-green-600">{{ totalDepartments }}</p>
      </div>
      <!-- <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <i class="fas fa-tasks text-yellow-600"></i> Active Projects
        </h3>
        <p class="text-3xl font-bold text-yellow-600">12</p>
      </div> -->
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
        <div v-if="isLoading" class="py-4 text-center">
          <i class="text-4xl text-green-700 fas fa-spinner fa-spin"></i>
        </div>
        <ul v-else-if="upcomingBirthdays.length > 0">
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
        <p v-else class="text-gray-500 text-sm italic">
          No upcoming birthdays found.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserInfoCookie } from '@/services/authentication';
import Chart from 'chart.js/auto';
import moment from 'moment';
import { getStaffRequestForApprover } from '@/apis/request-leave';
import { getAllDepartment } from '@/apis/department';
import { getAllUser } from '@/apis/user';
export default {
  name: 'Dashboard',
  data() {
    return {
      leaveRequests: [],
      upcomingBirthdays: [],
      userInfo: null,
      isLoading: false,
      totalEmployees: 0,
      totalDepartments: 0 // Initialize total departments
    };
  },
  methods: {
    // Fetch all users to count total employees and populate upcoming birthdays
    async fetchTotalEmployees() {
      try {
        const response = await getAllUser();
        console.log('getAllUser response:', response); // Debug log
        if (response && response.data && Array.isArray(response.data)) {
          this.totalEmployees = response.data.length; // Count total users
          // Map user data to upcomingBirthdays, showing only upcoming or recent birthdays
          this.upcomingBirthdays = response.data
            .filter(user => user.dob && moment(user.dob).isValid())
            .map(user => ({
              name: `${user.first_name_en} ${user.last_name_en}`.trim(),
              date: moment(user.dob).format('MMM DD, YYYY')
            }))
            .sort((a, b) => {
              const today = moment();
              const aDate = moment(a.date, 'MMM DD, YYYY').year(today.year());
              const bDate = moment(b.date, 'MMM DD, YYYY').year(today.year());
              // Adjust for birthdays that have passed this year
              if (aDate.isBefore(today)) aDate.add(1, 'year');
              if (bDate.isBefore(today)) bDate.add(1, 'year');
              return aDate.diff(bDate);
            })
            .slice(0, 7); // Limit to 7 birthdays
          console.log('Processed upcomingBirthdays:', this.upcomingBirthdays); // Debug log
        } else {
          console.warn('No valid user data received:', response);
          this.totalEmployees = 0;
          this.upcomingBirthdays = [];
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        this.totalEmployees = 0;
        this.upcomingBirthdays = [];
      }
    },
    // Fetch all departments to count total departments
    async fetchTotalDepartments() {
      try {
        const response = await getAllDepartment();
        if (response && response.departments) {
          this.totalDepartments = response.departments.length; // Count total departments
        } else {
          console.warn('No valid department data received:', response);
          this.totalDepartments = 0;
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        this.totalDepartments = 0;
      }
    },
    async fetchLeaveRequests(user_id) {
      this.isLoading = true;
      try {
        const response = await getStaffRequestForApprover(user_id, {
          limit: 5 // Fetch only the 5 most recent requests
        });
        console.log('getStaffRequestForApprover response:', response); // Debug log
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
          console.warn('No leave requests data received:', response);
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
  async created() {
    const userInfoCookie = getUserInfoCookie();
    if (userInfoCookie) {
      try {
        this.userInfo = JSON.parse(userInfoCookie);
      } catch {
        this.userInfo = null;
      }
    }
    if (this.userInfo && this.userInfo._id) {
      await Promise.all([
        this.fetchLeaveRequests(this.userInfo._id),
        this.fetchTotalEmployees(),
        this.fetchTotalDepartments()
      ]);
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