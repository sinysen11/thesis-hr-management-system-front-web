<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-extrabold text-gray-900">Leave Balance</h2>
      <button @click="openCreateModal"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200 cursor-pointer">
        Apply Leave
      </button>
    </div>

    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showCreateModal"
        class="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50" @click.self="cancelConfirm">
        <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all">
          <h3 class="text-xl font-bold mb-4">Apply Leave</h3>

          <label class="block mb-2 font-medium">Leave Type</label>
          <select v-model="leaveForm.type" class="w-full border rounded-lg p-2 mb-4">
            <option value="">Select Leave Type</option>
            <option v-for="type in leaveTypes" :key="type._id" :value="type._id">
              {{ type.name }}
            </option>
          </select>

          <label class="block mb-2 font-medium">Approver</label>
          <select v-model="leaveForm.approver" class="w-full border rounded-lg p-2 mb-4">
            <option value="">Select Approver</option>
            <option v-for="approver in approvers" :key="approver._id" :value="approver._id">
              {{ approver.first_name_en }} {{ approver.last_name_en }}
            </option>
          </select>

          <label class="block mb-2 font-medium">From Date</label>
          <input type="date" v-model="leaveForm.fromDate" class="w-full border rounded-lg p-2 mb-4" />

          <label class="block mb-2 font-medium">To Date</label>
          <input type="date" v-model="leaveForm.toDate" class="w-full border rounded-lg p-2 mb-4" />

          <label class="block mb-2 font-medium">Reason</label>
          <textarea v-model="leaveForm.reason" class="w-full border rounded-lg p-2 mb-4"></textarea>

          <div class="flex justify-end gap-3">
            <button @click="openCloseModal" class="px-4 py-2 bg-gray-300 rounded-lg cursor-pointer">Cancel</button>
            <button @click="submitLeaveRequest"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer">Submit</button>
          </div>
        </div>
      </div>
    </transition>

    <div v-if="leaveBalances.length" class="max-w-full flex gap-6">
      <div v-for="leave in leaveBalances" :key="leave._id" class="bg-white shadow rounded-lg p-6 flex-1 min-w-[200px]">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold text-gray-800">{{ leave.type.name }}</h3>
          <span class="text-xl font-bold text-indigo-600">{{ leave.total + "/" + leave.type.total }} days</span>
        </div>
        <p class="text-gray-600 mb-4">Total leave days for {{ leave.year }}</p>
        <div class="bg-indigo-100 rounded-full h-4">
          <div class="bg-indigo-600 h-4 rounded-full" :style="{ width: getLeaveBarWidth(leave) + '%' }"></div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>No leave balance data available.</p>
    </div>

    <div class="flex justify-between items-center mt-12 mb-6">
      <h2 class="text-3xl font-extrabold text-gray-900">Leave Request History</h2>
    </div>

    <div v-if="isLoading" class="text-center py-4">
      <i class="fas fa-spinner fa-spin text-indigo-600 text-2xl"></i>
    </div>

    <div v-else class="bg-white shadow-sm rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto text-sm">
          <thead class="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th class="px-4 py-3 text-left">No</th>
              <!-- <th class="px-4 py-3 text-left">Employee Name</th> -->
              <!-- <th class="px-4 py-3 text-left">Department</th> -->
              <th class="px-4 py-3 text-left">Leave Type</th>
              <th class="px-4 py-3 text-left">Start Date</th>
              <th class="px-4 py-3 text-left">End Date</th>
              <th class="px-4 py-3 text-left">Reason</th>
              <th class="px-4 py-3 text-left">Status</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr v-if="paginatedRequests.length === 0">
              <td colspan="9" class="px-4 py-3 text-center">No leave requests found.</td>
            </tr>
            <tr v-for="(request, index) in paginatedRequests" :key="request.id"
              class="hover:bg-gray-50 transition border-b border-gray-200">
              <td class="px-4 py-3">{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
              <!-- <td class="px-4 py-3">{{ request.employeeName }}</td> -->
              <!-- <td class="px-4 py-3">{{ request.department }}</td> -->
              <td class="px-4 py-3">{{ request.leaveTypeName }}</td>
              <td class="px-4 py-3">{{ request.startDate }}</td>
              <td class="px-4 py-3">{{ request.endDate }}</td>
              <td class="px-4 py-3">{{ request.reason || 'No reason provided' }}</td>
              <td class="px-4 py-3">
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  request.status === 'APPROVED' ? 'bg-green-400 text-white' :
                    request.status === 'PENDING' ? 'bg-blue-400 text-white' : 'bg-red-400 text-white'
                ]">
                  {{ request.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <button @click="openViewModal(request)"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition cursor-pointer"
                  title="View Request" aria-label="View Request">
                  <i class="fas fa-eye"></i>
                </button>
                <button v-if="request.status === 'PENDING'" @click="openEditModal(user)" :disabled="loading"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  title="Edit User">
                  <i class="fas fa-edit"></i>
                </button>
                <button v-if="request.status === 'PENDING'" @click="confirmCancel(request)"
                  class="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition cursor-pointer"
                  title="Delete User">
                  <i class="fas fa-cancel"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showConfirmCancel"
        class="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50" @click.self="cancelConfirm">
        <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all">
          <h3 class="text-lg font-semibold mb-4">Confirm Cancellation</h3>
          <p class="mb-6">Are you sure you want to cancel this leave request?</p>
          <div class="flex justify-end gap-4">
            <button @click="cancelConfirm"
              class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition cursor-pointer">
              No
            </button>
            <button @click="onCancelledRequest()"
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition transition cursor-pointer">
              Yes
            </button>
          </div>
        </div>
      </div>
    </transition>

    <div v-if="notification.visible" :class="[
      'fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg text-white font-semibold',
      notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
    ]" style="min-width: 250px; z-index: 9999;">
      {{ notification.message }}
    </div>

    <div class="mt-6 flex justify-between items-center" v-if="!isLoading && totalPages > 1">
      <div class="text-sm text-gray-600">
        Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ leaveRequests.length }} requests
      </div>
      <div class="flex gap-2">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition duration-200">
          Previous
        </button>
        <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="[
          'px-4 py-2 rounded-lg transition duration-200',
          currentPage === page ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        ]">
          {{ page }}
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition duration-200">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getLeavebalanceForUser,
  getOwnerLeaveRequest,
  getAllApprover,
  getLeaveType,
  createLeaveRequest,
  allowStaffRequestLeave
} from '@/apis/request-leave';
import { getUserInfoCookie } from '@/services/authentication';
import moment from 'moment';

export default {
  data() {
    return {
      userInfo: null,
      leaveBalances: [],
      leaveRequests: [],
      isLoading: false,
      currentPage: 1,
      itemsPerPage: 10,

      showCreateModal: false,
      leaveForm: {
        user: '',
        type: '',
        approver: '',
        fromDate: '',
        toDate: '',
        reason: ''
      },
      approvers: [],
      leaveTypes: [],

      showConfirmCancel: false,
      cancelRequestId: null,

      notification: {
        message: '',
        type: '',
        visible: false
      }
    };
  },

  computed: {
    totalPages() {
      return Math.ceil(this.leaveRequests.length / this.itemsPerPage) || 1;
    },
    paginatedRequests() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.leaveRequests.slice(start, start + this.itemsPerPage);
    },
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage;
    },
    endIndex() {
      return Math.min(this.startIndex + this.itemsPerPage, this.leaveRequests.length);
    }
  },

  methods: {
    openCreateModal() {
      if (this.userInfo && this.userInfo._id) {
        this.leaveForm.user = this.userInfo._id;
      }
      this.showCreateModal = true;
    },

    openCloseModal() {
      this.showCreateModal = false;
    },

    async submitLeaveRequest() {
      try {
        const payload = { ...this.leaveForm };
        const res = await createLeaveRequest(payload);

        if (res.status === 1) {
          this.showCreateModal = false;
          await this.getOwnLeaveRequests(this.userInfo._id);
          await this.getLeaveBalanceForUser(this.userInfo._id);
        }
      } catch (error) {
        console.log(error)
      }
    },

    async onCancelledRequest() {
      if (!this.cancelRequestId) return;
      this.showConfirmCancel = false;

      try {
        const status = 'CANCELLED';
        const response = await allowStaffRequestLeave(this.cancelRequestId, status);
        console.log(response)
        if (response.status === 1) {
                  console.log(response.status)

          this.isLoading = true;
          this.cancelConfirm()
          this.getOwnLeaveRequests(this.userInfo._id);
          this.getLeaveBalanceForUser(this.userInfo._id);
          this.showNotification(`Leave request ${status.toLowerCase()} successfully`);
        }
      } catch (error) {
        console.error('Error allowing leave request:', error);
        this.cancelConfirm()
        this.showNotification('Failed to update leave request.', 'error');
      } finally {
        this.isLoading = false;
        this.cancelRequestId = null;
      }
    },

    confirmCancel(request) {
      this.cancelRequestId = request.id;
      this.showConfirmCancel = true;
    },

    cancelConfirm() {
      this.showConfirmCancel = false;
      this.cancelRequestId = null;
    },

    async getLeaveBalanceForUser(user_id) {
      this.isLoading = true;
      try {
        const response = await getLeavebalanceForUser(user_id);
        if (response.status === 1 && response.leaveBalances) {
          this.leaveBalances = response.leaveBalances;
        } else {
          this.leaveBalances = [];
          console.warn('No leave balances found or failed response');
        }
      } catch (error) {
        console.error('Error getting leave balance:', error);
      } finally {
        this.isLoading = false;
      }
    },

    showNotification(message, type = 'success') {
      this.notification.message = message;
      this.notification.type = type;
      this.notification.visible = true;

      setTimeout(() => {
        this.notification.visible = false;
      }, 3000);
    },

    async getOwnLeaveRequests(user_id) {
      this.isLoading = true;
      try {
        const response = await getOwnerLeaveRequest(user_id);
        if (response && response.data) {
          this.leaveRequests = response.data.map((request) => {
            let departmentName = 'N/A';
            if (request.user?.department) {
              departmentName = request.user.department.name_en || 'N/A';
            }
            return {
              id: request._id || '',
              employeeId: request.user?._id || '',
              employeeName: request.user ? `${request.user.first_name_en || ''} ${request.user.last_name_en || ''}`.trim() : 'Unknown Employee',
              department: departmentName,
              leaveTypeId: request.type?._id || '',
              leaveTypeName: request.type?.name || 'Unknown Type',
              startDate: this.formatDate(request.fromDate),
              endDate: this.formatDate(request.toDate),
              approverId: request.approver?._id || '',
              approverName: request.approver ? `${request.approver.first_name_en || ''} ${request.approver.last_name_en || ''}`.trim() || 'N/A' : 'N/A',
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
        this.adjustCurrentPage();
      }
    },

    async getAllApprover() {
      try {
        const response = await getAllApprover();
        if (response.status === 1) {
          this.approvers = response.data;
        }
      } catch (error) {
        console.error('Error fetching leave requests:', error);
      }
    },

    async getLeaveType() {
      try {
        const response = await getLeaveType();
        if (response.status === 1) {
          this.leaveTypes = response.leaveTypes;
        }
      } catch (error) {
        console.error('Error fetching leave requests:', error);
      }
    },

    adjustCurrentPage() {
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }
      if (this.currentPage < 1) {
        this.currentPage = 1;
      }
    },

    openViewModal(request) {
      console.log('View request', request);
    },

    getLeaveBarWidth(leave) {
      const maxDays = leave.type.code === 'AL' ? 18 : 7;
      if (!leave.total || maxDays === 0) return 0;
      return ((leave.total / maxDays) * 100).toFixed(0);
    },

    formatDate(date) {
      return date ? moment(date).format('DD-MMM-YYYY') : 'N/A';
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
  },

  created() {
    const user = getUserInfoCookie();
    if (user) {
      try {
        this.userInfo = JSON.parse(user);
      } catch (e) {
        this.userInfo = null;
      }
    }
    if (this.userInfo && this.userInfo._id) {
      this.getLeaveBalanceForUser(this.userInfo._id);
      this.getOwnLeaveRequests(this.userInfo._id);
    }

    this.getAllApprover();
    this.getLeaveType();
  }
};
</script>