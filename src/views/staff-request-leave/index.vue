<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-extrabold tracking-tight text-green-700">
        Staff Request Leave
      </h2>
    </div>
    <div class="p-6 mb-8 bg-white rounded-lg shadow-sm">
      <div class="flex flex-col w-full gap-4 sm:flex-row sm:items-end">
        <div class="flex-1">
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >Search</label
          >
          <input
            type="text"
            v-model="filters.name"
            class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Employee name"
          />
        </div>

        <div class="flex-1">
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >Leave Type</label
          >
          <select
            v-model="filters.type"
            class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All</option>
            <option
              v-for="type in leaveTypes"
              :key="type.code"
              :value="type.code"
            >
              {{ type.name }}
            </option>
          </select>
        </div>

        <div class="flex-1">
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >Status</label
          >
          <select
            v-model="filters.status"
            class="w-full px-4 py-2 transition border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div class="flex gap-4">
          <button
            @click="resetFilters"
            class="px-6 py-2 font-medium text-gray-800 transition duration-200 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300"
          >
            Reset
          </button>
          <button
            @click="applyFilters"
            class="px-6 py-2 font-medium text-white transition duration-200 bg-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-700"
          >
            Search
          </button>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="py-4 text-center">
      <i class="text-6xl text-green-700 fas fa-spinner fa-spin"></i>
    </div>

    <div v-else class="overflow-hidden bg-white rounded-lg shadow-sm">
      <div class="overflow-x-auto">
        <table
          class="min-w-full overflow-hidden text-sm rounded-lg shadow-md table-auto"
        >
          <thead
            class="text-xs font-semibold text-gray-700 uppercase bg-gray-200"
          >
            <tr>
              <th class="px-5 py-4 text-left text-green-700">No</th>
              <th class="px-5 py-4 text-left text-green-700">Employee Name</th>
              <th class="px-5 py-4 text-left text-green-700">Department</th>
              <th class="px-5 py-4 text-left text-green-700">Leave Type</th>
              <th class="px-5 py-4 text-left text-green-700">Start Date</th>
              <th class="px-5 py-4 text-left text-green-700">End Date</th>
              <th class="px-5 py-4 text-left text-green-700">Reason</th>
              <th class="px-5 py-4 text-left text-green-700">Status</th>
              <th class="px-5 py-4 text-left text-green-700">Actions</th>
            </tr>
          </thead>

          <tbody class="text-gray-700">
            <tr v-if="leaveRequests.length === 0">
              <td colspan="10" class="px-5 py-4 text-center text-gray-500">
                No leave requests found.
              </td>
            </tr>

            <tr
              v-for="(request, index) in leaveRequests"
              :key="request.id"
              class="transition border-b border-gray-200 hover:bg-gray-50"
            >
              <td class="px-5 py-4 font-medium">
                {{ index + 1 + (pagination.page - 1) * pagination.limit }}
              </td>
              <td class="px-5 py-4">{{ request.employeeName }}</td>
              <td class="px-5 py-4">{{ request.department }}</td>
              <td class="px-5 py-4">{{ request.leaveTypeName }}</td>
              <td class="px-5 py-4">{{ request.startDate }}</td>
              <td class="px-5 py-4">{{ request.endDate }}</td>
              <td class="px-5 py-4">
                {{ request.reason || 'No reason provided' }}
              </td>

              <td class="px-5 py-4">
                <span
                  :class="[
                    'px-5 py-2 rounded-full text-xs font-medium',
                    request.status === 'APPROVED'
                      ? 'bg-green-200 text-green-800'
                      : request.status === 'PENDING'
                      ? 'bg-blue-200 text-blue-800'
                      : request.status === 'CANCELLED' ||
                        request.status === 'DRAFT'
                      ? 'bg-yellow-200 text-yellow-800'
                      : 'bg-red-200 text-red-800'
                  ]"
                >
                  {{ request.status }}
                </span>
              </td>

              <td class="flex gap-1 px-3 py-4">
                <button
                  v-if="request.status === 'PENDING'"
                  @click="openActionModal(request)"
                  class="p-1 text-indigo-600 transition rounded-full cursor-pointer hover:bg-indigo-100 hover:text-indigo-800"
                  title="Review & Act"
                >
                  <i class="text-xl fas fa-gavel"></i>
                </button>
                <button
                  v-else
                  @click="openActionModal(request)"
                  class="p-1 text-green-600 transition rounded-full cursor-pointer hover:bg-green-100 hover:text-green-800"
                  title="View Details"
                >
                  <i class="text-xl fas fa-eye"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="flex items-center justify-between mt-6" v-if="!isLoading">
      <div class="text-sm text-gray-600">
        Showing {{ startIndex + 1 }} to {{ endIndex }} of
        {{ pagination.total }} requests
      </div>
      <div class="flex gap-2">
        <button
          @click="prevPage"
          :disabled="pagination.page === 1"
          class="px-4 py-2 text-gray-800 transition duration-200 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
        >
          Previous
        </button>
        <button
          v-for="page in displayedPages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'px-4 py-2 rounded-lg transition duration-200',
            pagination.page === page
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          ]"
        >
          {{ page }}
        </button>
        <button
          @click="nextPage"
          :disabled="pagination.page === totalPages"
          class="px-4 py-2 text-gray-800 transition duration-200 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>

    <transition name="modal">
      <div v-if="showActionModal">
        <div
          style="background-color: rgb(0 0 0 / 0.5)"
          class="fixed inset-0 z-50 flex items-center justify-center"
          @click.self="closeActionModal"
        >
          <div
            class="w-full max-w-lg p-8 mx-4 transition-all transform bg-white shadow-2xl rounded-xl"
          >
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-2xl font-bold text-gray-900">
                Staff Leave Request Review
              </h3>
              <button
                @click="closeActionModal"
                class="p-2 text-gray-500 transition rounded-full cursor-pointer hover:text-gray-700 hover:bg-gray-100"
                title="Close"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>

            <div
              v-if="selectedRequest"
              class="pt-5 space-y-5 border-t border-gray-200"
            >
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label class="text-sm font-semibold text-gray-600"
                    >Employee Name</label
                  >
                  <p class="font-medium text-gray-900">
                    {{ selectedRequest.employeeName }}
                  </p>
                </div>
                <div>
                  <label class="text-sm font-semibold text-gray-600"
                    >Department</label
                  >
                  <p class="font-medium text-gray-900">
                    {{ selectedRequest.department }}
                  </p>
                </div>
                <div>
                  <label class="text-sm font-semibold text-gray-600"
                    >Leave Type</label
                  >
                  <p class="font-medium text-gray-900">
                    {{ selectedRequest.leaveTypeName }}
                  </p>
                </div>
                <div>
                  <label class="text-sm font-semibold text-gray-600"
                    >Dates</label
                  >
                  <p class="font-medium text-gray-900">
                    {{ selectedRequest.startDate }} -
                    {{ selectedRequest.endDate }}
                  </p>
                </div>
                <div class="sm:col-span-2">
                  <label class="text-sm font-semibold text-gray-600"
                    >Reason (Staff)</label
                  >
                  <div
                    class="w-full p-3 mt-1 font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-lg whitespace-pre-wrap min-h-[50px]"
                  >
                    {{ selectedRequest.reason || 'No reason provided' }}
                  </div>
                </div>
              </div>

              <template v-if="selectedRequest.status === 'PENDING'">
                <div class="pt-4 border-t border-gray-200">
                  <label class="block mb-2 text-sm font-semibold text-gray-700"
                    >Your Action</label
                  >
                  <div class="flex items-center gap-6">
                    <label
                      :class="[
                        'flex items-center p-3 transition duration-150 ease-in-out border rounded-lg cursor-pointer',
                        approvalAction === 'APPROVED'
                          ? 'border-green-600 bg-green-50 shadow-md'
                          : 'border-gray-300 hover:bg-gray-50'
                      ]"
                    >
                      <input
                        type="radio"
                        name="action"
                        value="APPROVED"
                        v-model="approvalAction"
                        @change="prepareAction('APPROVED')"
                        class="text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <span
                        :class="[
                          'ml-3 font-medium',
                          approvalAction === 'APPROVED'
                            ? 'text-green-700'
                            : 'text-gray-700'
                        ]"
                      >
                      Approve
                      </span>
                    </label>

                    <label
                      :class="[
                        'flex items-center p-3 transition duration-150 ease-in-out border rounded-lg cursor-pointer',
                        approvalAction === 'REJECTED'
                          ? 'border-red-600 bg-red-50 shadow-md'
                          : 'border-gray-300 hover:bg-gray-50'
                      ]"
                    >
                      <input
                        type="radio"
                        name="action"
                        value="REJECTED"
                        v-model="approvalAction"
                        @change="prepareAction('REJECTED')"
                        class="text-red-600 border-gray-300 focus:ring-red-500"
                      />
                      <span
                        :class="[
                          'ml-3 font-medium',
                          approvalAction === 'REJECTED'
                            ? 'text-red-700'
                            : 'text-gray-700'
                        ]"
                      >
                      Reject
                      </span>
                    </label>
                  </div>
                </div>

                <div v-if="approvalAction" class="pt-2">
                  <label
                    :class="[
                      'block mb-2 text-sm font-medium',
                      approvalAction === 'REJECTED'
                        ? 'font-bold text-red-700'
                        : 'text-gray-700'
                    ]"
                  >
                    Approver Comment
                    <span
                      v-if="approvalAction === 'REJECTED'"
                      class="font-bold text-red-600"
                      >(Required for Rejection)</span
                    >
                    <span v-else class="text-gray-500 font-normal"
                      >(Optional for Approval)</span
                    >
                  </label>
                  <textarea
                    v-model="approverComment"
                    rows="3"
                    class="w-full p-3 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your comment/reason here..."
                  ></textarea>
                </div>
              </template>

              <div
                v-if="selectedRequest.status !== 'PENDING'"
                class="sm:col-span-2 pt-4 border-t border-gray-200"
              >
                <label class="text-sm font-semibold text-gray-600"
                  >Final Status & Approver Comment</label
                >
                <p
                  :class="[
                    'text-lg font-bold mb-2',
                    selectedRequest.status === 'APPROVED' ? 'text-green-600' : 'text-red-600'
                  ]"
                >
                    Status: {{ selectedRequest.status }}
                </p>
                <div
                  class="w-full p-3 mt-1 font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-lg whitespace-pre-wrap min-h-[50px]"
                >
                  {{ selectedRequest.approverComment || 'N/A' }}
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
              <button
                @click="closeActionModal"
                class="px-6 py-2 font-medium text-gray-700 transition bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300"
              >
                Close
              </button>
              <button
                v-if="selectedRequest && selectedRequest.status === 'PENDING' && approvalAction"
                @click="confirmAction"
                :disabled="approvalAction === 'REJECTED' && !approverComment.trim()"
                :class="[
                  'px-6 py-2 font-medium text-white transition rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
                  approvalAction === 'APPROVED'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                ]"
              >
                Confirm {{ approvalAction === 'APPROVED' ? 'Approve' : 'Reject' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div
      v-if="notification.visible"
      :class="[
        'fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg text-white font-semibold',
        notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
      ]"
      style="min-width: 250px; z-index: 9999"
    >
      {{ notification.message }}
    </div>
  </div>
</template>

<script>
import { getUserInfoCookie } from '@/services/authentication';
import {
  getStaffRequestForApprover,
  allowStaffRequestLeave,
  getLeaveType
} from '@/apis/request-leave';
import moment from 'moment';

export default {
  data() {
    return {
      isLoading: false,
      leaveRequests: [],
      // Consolidated modal flag
      showActionModal: false, 
      selectedRequest: null,
      userInfo: null,
      filters: {
        name: '',
        type: '',
        status: ''
      },
      pagination: {
        total: 0,
        page: 1,
        limit: 10
      },
      leaveTypes: [],
      approverComment: '',
      approvalAction: '',
      notification: {
        message: '',
        type: '',
        visible: false
      }
    };
  },
  computed: {
    totalPages() {
      if (this.pagination.total === 0) return 1;
      return Math.ceil(this.pagination.total / this.pagination.limit);
    },
    startIndex() {
      return (this.pagination.page - 1) * this.pagination.limit;
    },
    endIndex() {
      return Math.min(
        this.pagination.page * this.pagination.limit,
        this.pagination.total
      );
    },
    displayedPages() {
      const maxPagesToShow = 5;
      const pages = [];
      const total = this.totalPages;
      const current = this.pagination.page;

      if (total <= maxPagesToShow) {
        for (let i = 1; i <= total; i++) {
          pages.push(i);
        }
      } else {
        let start = Math.max(1, current - Math.floor(maxPagesToShow / 2));
        const end = Math.min(total, start + maxPagesToShow - 1);

        if (end - start + 1 < maxPagesToShow) {
          start = Math.max(1, end - maxPagesToShow + 1);
        }

        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
      }
      return pages;
    }
  },
  methods: {
    async fetchLeaveRequests(user_id) {
      this.isLoading = true;
      const params = {
        name: this.filters.name || undefined,
        type: this.filters.type || undefined,
        status: this.filters.status || undefined,
        page: this.pagination.page,
        limit: this.pagination.limit
      };
      try {
        const response = await getStaffRequestForApprover(user_id, params);

        if (response && response.data) {
          const requests = response.data;
          const apiPagination = response.pagination || {};

          this.leaveRequests = requests.map((request) => {
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
              reason: request.reason || 'No reason provided',
              approverComment: request.approverComment || ''
            };
          });

          this.pagination.total = apiPagination.total || requests.length;
          this.pagination.page = apiPagination.page || this.pagination.page;
          this.pagination.limit = apiPagination.limit || this.pagination.limit;
        } else {
          this.leaveRequests = [];
          this.pagination.total = 0;
        }
      } catch (error) {
        console.error('Error fetching leave requests:', error);
        this.leaveRequests = [];
        this.pagination.total = 0;
      } finally {
        this.isLoading = false;
      }
    },

    openActionModal(request) {
      this.selectedRequest = request;
      if (request.status === 'PENDING') {
        this.approvalAction = ''; 
        this.approverComment = '';
      } else {
        this.approvalAction = request.status; 
        this.approverComment = request.approverComment;
      }
      this.showActionModal = true;
    },

    closeActionModal() {
      this.showActionModal = false;
      this.selectedRequest = null;
      this.approvalAction = '';
      this.approverComment = '';
    },
    prepareAction(status) {
        this.approvalAction = status; 
    },

    confirmAction() {
      if (this.approvalAction === 'REJECTED' && !this.approverComment.trim()) {
        this.showNotification('Reason is required for rejection.', 'error');
        return;
      }
      
      const request_id = this.selectedRequest.id;
      const status = this.approvalAction;
      const comment = this.approverComment.trim(); 
      const payload = {
        status: status,
        comment: comment
      }
      this.closeActionModal();
      
      this.onAllowLeaveRequest(request_id, payload);
    },
    async onAllowLeaveRequest(request_id, payload) {
      this.isLoading = true;
      try {
        const response = await allowStaffRequestLeave(request_id, payload);
        if (response.status === 1) {
          await this.fetchLeaveRequests(this.userInfo._id);
          this.showNotification(
            `Leave request ${payload.status} successfully`
          );
        }
      } catch (error) {
        console.error('Error allowing leave request:', error);
        this.showNotification('Failed to update leave request.', 'error');
      } finally {
        this.isLoading = false;
      }
    },

    async getLeaveType() {
      try {
        const response = await getLeaveType();
        if (response.status === 1) {
          this.leaveTypes = response.leaveTypes;
        }
      } catch (error) {
        console.error('Error fetching leave types:', error);
      }
    },

    applyFilters() {
      this.pagination.page = 1;
      this.fetchLeaveRequests(this.userInfo._id);
    },

    resetFilters() {
      this.filters = { name: '', type: '', status: '' };
      this.pagination.page = 1;
      this.fetchLeaveRequests(this.userInfo._id);
    },

    showNotification(message, type = 'success') {
      this.notification.message = message;
      this.notification.type = type;
      this.notification.visible = true;

      setTimeout(() => {
        this.notification.visible = false;
      }, 3000);
    },

    // Pagination Methods
    prevPage() {
      if (this.pagination.page > 1) {
        this.pagination.page--;
        this.fetchLeaveRequests(this.userInfo._id);
      }
    },
    nextPage() {
      if (this.pagination.page < this.totalPages) {
        this.pagination.page++;
        this.fetchLeaveRequests(this.userInfo._id);
      }
    },
    goToPage(page) {
      if (page !== this.pagination.page) {
        this.pagination.page = page;
        this.fetchLeaveRequests(this.userInfo._id);
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
    this.getLeaveType();
  }
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>