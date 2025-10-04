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
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <i class="fas fa-tasks text-yellow-600"></i> Applicants Applied
        </h3>
        <p class="text-3xl font-bold text-yellow-600">{{ totalApplicants }}</p>
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
        <div class="flex gap-4 mb-4">
          <div>
            <label for="leaveTypeFilter" class="mr-2">Filter by Leave Type:</label>
            <select v-model="selectedLeaveType" @change="updateLeaveRequestChart" id="leaveTypeFilter" class="border rounded p-1">
              <option value="">All</option>
              <option v-for="type in leaveTypes" :key="type._id" :value="type._id">{{ type.name }}</option>
            </select>
          </div>
          <div>
            <label for="statusFilter" class="mr-2">Filter by Status:</label>
            <select v-model="selectedStatus" @change="updateLeaveRequestChart" id="statusFilter" class="border rounded p-1">
              <option value="">All</option>
              <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
            </select>
          </div>
        </div>
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
import { getAllApplicant } from '@/apis/applicant';
import { getOwnerLeaveRequest } from '@/apis/request-leave';

export default {
  name: 'Dashboard',
  data() {
    return {
      leaveRequests: [],
      upcomingBirthdays: [],
      userInfo: null,
      isLoading: false,
      totalEmployees: 0,
      totalDepartments: 0,
      totalApplicants: 0,
      leaveTypes: [],
      selectedLeaveType: '',
      selectedStatus: '',
      leaveRequestChartInstance: null,
      statuses: ['APPROVED', 'REJECTED', 'CANCELLED', 'PENDING', 'DRAFT']
    };
  },
  methods: {
    async getOwnLeaveRequests(user_id) {
      this.isLoading = true;
      try {
        const response = await getOwnerLeaveRequest(user_id);
        if (response && response.data) {
          // Map to consistent structure
          const ownRequests = response.data.map((request) => ({
            _id: request._id || '',
            user: request.user || {},
            type: request.type || {},
            fromDate: request.fromDate,
            toDate: request.toDate,
            approver: request.approver || {},
            reason: request.reason || 'No reason provided',
            status: request.status || 'PENDING'
          }));
          // Merge with existing leaveRequests, avoiding duplicates
          this.leaveRequests = [
            ...this.leaveRequests,
            ...ownRequests.filter(
              (req) => !this.leaveRequests.some((existing) => existing._id === req._id)
            )
          ];
          this.updateLeaveTypes();
        }
      } catch (error) {
        console.error('Error fetching own leave requests:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchTotalEmployees() {
      try {
        const response = await getAllUser();
        if (response && response.data && Array.isArray(response.data)) {
          this.totalEmployees = response.data.length;
          this.upcomingBirthdays = response.data
            .filter((user) => user.dob && moment(user.dob).isValid())
            .map((user) => ({
              name: `${user.first_name_en} ${user.last_name_en}`.trim(),
              date: moment(user.dob).format('MMM DD, YYYY')
            }))
            .sort((a, b) => {
              const today = moment();
              const aDate = moment(a.date, 'MMM DD, YYYY').year(today.year());
              const bDate = moment(b.date, 'MMM DD, YYYY').year(today.year());
              if (aDate.isBefore(today)) aDate.add(1, 'year');
              if (bDate.isBefore(today)) bDate.add(1, 'year');
              return aDate.diff(bDate);
            })
            .slice(0, 7);
        } else {
          this.totalEmployees = 0;
          this.upcomingBirthdays = [];
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        this.totalEmployees = 0;
        this.upcomingBirthdays = [];
      }
    },
    async fetchTotalDepartments() {
      try {
        const response = await getAllDepartment();
        if (response && response.departments) {
          this.totalDepartments = response.departments.length;
        } else {
          this.totalDepartments = 0;
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        this.totalDepartments = 0;
      }
    },
    async fetchTotalApplicant() {
      try {
        const response = await getAllApplicant();
        if (response && response.data) {
          this.totalApplicants = response.data.length;
        } else {
          this.totalApplicants = 0;
        }
      } catch (error) {
        console.error('Error fetching applicants:', error);
        this.totalApplicants = 0;
      }
    },
    async fetchLeaveRequests(user_id) {
      this.isLoading = true;
      try {
        const response = await getStaffRequestForApprover(user_id, { limit: 5 });
        if (response && response.data) {
          this.leaveRequests = response.data.map((request) => {
            let departmentName = 'N/A';
            if (request.user?.department) {
              departmentName = request.user.department.name_en || 'N/A';
            }
            return {
              _id: request._id || '',
              employeeId: request.user?._id || '',
              employeeName: request.user
                ? `${request.user.first_name_en || ''} ${request.user.last_name_en || ''}`.trim() || 'Unknown Employee'
                : 'Unknown Employee',
              department: departmentName,
              leaveTypeId: request.type?._id || '',
              leaveTypeName: request.type?.name || 'Unknown Type',
              startDate: this.formatDate(request.fromDate),
              endDate: this.formatDate(request.toDate),
              approverId: request.approver?._id || '',
              approverName: request.approver
                ? `${request.approver.first_name_en || ''} ${request.approver.last_name_en || ''}`.trim() || 'N/A'
                : 'N/A',
              status: request.status || 'PENDING',
              reason: request.reason || 'No reason provided',
              type: request.type || {}, // Keep raw type for filtering
              fromDate: request.fromDate,
              toDate: request.toDate
            };
          });
          this.updateLeaveTypes();
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
    updateLeaveTypes() {
      // Derive leave types from leaveRequests
      const types = [...new Set(this.leaveRequests.map((r) => r.type))]
        .filter((type) => type && type._id && type.name)
        .map((type) => ({
          _id: type._id,
          name: type.name
        }));
      this.leaveTypes = types;
    },
    aggregateLeaveRequestsByDay(requests, filter = {}) {
      const daysOfWeek = Array(7).fill(0); // Mon=0, Tue=1, ..., Sun=6
      requests.forEach((request) => {
        if (filter.type && request.type?._id !== filter.type) return;
        if (filter.status && request.status !== filter.status) return;
        if (moment(request.fromDate).isValid()) {
          const day = moment(request.fromDate).day();
          daysOfWeek[day === 0 ? 6 : day - 1]++;
        }
      });
      return daysOfWeek;
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
    },
    updateLeaveRequestChart() {
      const filter = {
        type: this.selectedLeaveType || undefined,
        status: this.selectedStatus || undefined
      };
      const leaveRequestData = this.aggregateLeaveRequestsByDay(this.leaveRequests, filter);

      if (this.leaveRequestChartInstance) {
        this.leaveRequestChartInstance.destroy();
      }

      this.leaveRequestChartInstance = new Chart(document.getElementById('leaveRequestChart'), {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'Leave Requests',
              data: leaveRequestData,
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: false,
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Leave Requests'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Day of Week'
              }
            }
          }
        }
      });
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
        this.fetchTotalDepartments(),
        this.fetchTotalApplicant(),
        this.getOwnLeaveRequests(this.userInfo._id)
      ]);
    }
  },
  mounted() {
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

    this.updateLeaveRequestChart();
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