<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-extrabold tracking-tight text-green-700">
        Leave balance
      </h2>

      <button @click="openCreateModal"
        class="py-3 font-semibold text-white transition duration-300 ease-in-out transform shadow-md cursor-pointer px-7 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:scale-105 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300">
        Apply Leave
      </button>
    </div>

    <transition name="modal">
      <div v-if="showCreateModal" @click.self="cancelConfirm" style="background-color: rgb(0 0 0 / 0.5);"
        class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60">
        <div class="w-full max-w-3xl p-8 mx-4 transition-all transform bg-white rounded-xl">
          <h3 class="mb-6 text-2xl font-extrabold text-gray-800">Apply Leave</h3>

          <div class="flex flex-col gap-4 mb-5 sm:flex-row sm:gap-6">
            <div class="flex-1">
              <label class="block mb-2 font-semibold text-gray-700">
                Leave Type <span class="text-red-600">*</span>
              </label>
              <select v-model="leaveForm.type" required @change="clearError('type')"
                class="w-full p-3 mb-1 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700">
                <option value="" disabled>Select</option>
                <option v-for="type in leaveTypes" :key="type._id" :value="type._id">
                  {{ type.name }}
                </option>
              </select>
              <p v-if="errors.type" class="mb-4 text-sm text-red-600">{{ errors.type }}</p>
            </div>

            <div class="flex-1">
              <label class="block mb-2 font-semibold text-gray-700">
                Approve By <span class="text-red-600">*</span>
              </label>
              <select v-model="leaveForm.approver" required @change="clearError('approver')"
                class="w-full p-3 mb-1 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700">
                <option value="" disabled>Select</option>
                <option v-for="approver in approvers" :key="approver._id" :value="approver._id">
                  {{ approver.first_name_en }} {{ approver.last_name_en }}
                </option>
              </select>
              <p v-if="errors.approver" class="mb-4 text-sm text-red-600">{{ errors.approver }}</p>
            </div>
          </div>

          <div class="flex flex-col gap-4 mb-5 sm:flex-row sm:gap-6">
            <div class="flex-1">
              <label class="block mb-2 font-semibold text-gray-700">
                From Date <span class="text-red-600">*</span>
              </label>
              <Datepicker v-model="leaveForm.fromDate" :disabled-dates="isDisabled" :day-class="dayClass"
                placeholder="Select From Date" :enable-time-picker="false"
                :input-class="['w-full p-3 mb-1 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-700 focus:border-green-700']"
                @update:model-value="clearError('fromDate')" />

              <p v-if="errors.fromDate" class="mb-4 text-sm text-red-600">{{ errors.fromDate }}</p>
            </div>

            <div class="flex-1">
              <label class="block mb-2 font-semibold text-gray-700">
                To Date <span class="text-red-600">*</span>
              </label>
              <Datepicker v-model="leaveForm.toDate" :disabled-dates="isDisabled" :day-class="dayClass"
                placeholder="Select To Date" :enable-time-picker="false"
                :input-class="['w-full p-3 mb-1 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-700 focus:border-green-700']"
                @update:model-value="clearError('toDate')" />

              <p v-if="errors.toDate" class="mb-4 text-sm text-red-600">{{ errors.toDate }}</p>
            </div>
          </div>

          <div class="mb-5">
            <label class="block mb-2 font-semibold text-gray-700">
              Day Type <span class="text-red-600">*</span>
            </label>
            <select v-model="leaveForm.dayType" required @change="clearError('dayType')"
              :disabled="!isSameDay"
              :class="{'bg-gray-100': !isSameDay}"
              class="w-full p-3 mb-1 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700">
              <option value="" disabled>Select</option>
              <option value="full">Full Day</option>
              <option value="morning" :disabled="!isSameDay" :hidden="!isSameDay">Half Day (Morning)</option>
              <option value="afternoon" :disabled="!isSameDay" :hidden="!isSameDay">Half Day (Afternoon)</option>
            </select>
            <p v-if="errors.dayType" class="mb-4 text-sm text-red-600">{{ errors.dayType }}</p>
          </div>
          <label class="block mb-2 font-semibold text-gray-700">
            Reason <span class="text-red-600">*</span>
          </label>
          <textarea v-model="leaveForm.reason" required @change="clearError('reason')"
            class="w-full p-3 mb-1 transition border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700"
            rows="4">
          </textarea>
          <p v-if="errors.reason" class="mb-4 text-sm text-red-600">{{ errors.reason }}</p>

          <div class="flex justify-end gap-4">
            <button @click="openCloseModal" :disabled="isSubmitting"
              class="px-5 py-2 font-semibold text-gray-700 transition bg-gray-300 rounded-lg cursor-pointer hover:bg-gray-400 disabled:opacity-70 disabled:cursor-not-allowed">
              Cancel
            </button>
            <button @click="submitLeaveRequest" :disabled="isSubmitting" class="px-6 py-2 font-semibold text-white transition rounded-lg cursor-pointer focus:outline-none 
                 " :class="isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'">
              <i v-if="isSubmitting" class="mr-2 fas fa-spinner fa-spin"></i>
              {{ isSubmitting ? 'Submitting...' : 'Submit' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <div v-if="leaveBalances.length" class="flex max-w-full gap-6">
      <div v-for="leave in leaveBalances" :key="leave._id" class="bg-white shadow rounded-lg p-6 flex-1 min-w-[200px]">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold text-gray-800">{{ leave.type.name }}</h3>
          <span class="text-xl font-bold text-green-700">{{ leave.total + "/" + leave.type.total }} days</span>
        </div>
        <p class="mb-4 text-gray-600">Total leave days for {{ leave.year }}</p>
        <div class="h-2 bg-indigo-100 rounded-full">
          <div class="h-2 bg-green-700 rounded-full" :style="{ width: getLeaveBarWidth(leave) + '%' }"></div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>No leave balance data available.</p>
    </div>

    <div class="flex items-center justify-between mt-12 mb-6">
      <h2 class="text-2xl font-extrabold tracking-tight text-green-700">
        Leave Request History
      </h2>
    </div>

    <div v-if="isLoading" class="py-4 text-center">
      <i class="text-6xl text-green-700 fas fa-spinner fa-spin"></i>
    </div>

    <div v-else class="overflow-hidden bg-white rounded-lg shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full overflow-hidden text-sm rounded-lg shadow-md table-auto">
          <thead class="text-xs font-semibold text-gray-700 uppercase bg-gray-200">
            <tr>
              <th class="px-5 py-4 text-left text-green-700">No</th>
              <th class="px-5 py-4 text-left text-green-700">Leave Type</th>
              <th class="px-5 py-4 text-left text-green-700">Start Date</th>
              <th class="px-5 py-4 text-left text-green-700">End Date</th>
              <th class="px-5 py-4 text-left text-green-700">Reason</th>
              <th class="px-5 py-4 text-left text-green-700">Comment</th>
              <th class="px-5 py-4 text-left text-green-700">Status</th>
              <th class="px-5 py-4 text-left text-green-700">Actions</th>
            </tr>
          </thead>

          <tbody class="text-gray-700">
            <tr v-if="paginatedRequests.length === 0">
              <td colspan="9" class="px-5 py-4 text-center text-gray-500">
                No leave requests found.
              </td>
            </tr>

            <tr v-for="(request, index) in paginatedRequests" :key="request.id"
              class="transition border-b border-gray-200 hover:bg-gray-50">
              <td class="px-5 py-4 font-medium">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-5 py-4">{{ request.leaveTypeName }}</td>
              <td class="px-5 py-4">{{ request.startDate }}</td>
              <td class="px-5 py-4">{{ request.endDate }}</td>
              <td class="px-5 py-4">{{ request.reason || '-' }}</td>
              <td class="px-5 py-4">{{ request.comment || '-' }}</td>

              <td class="px-5 py-4">
                <span :class="[
                  'px-5 py-2 rounded-full text-xs font-medium',
                  request.status === 'APPROVED'
                    ? 'bg-green-200 text-green-800'
                    : request.status === 'PENDING'
                      ? 'bg-blue-200 text-blue-800'
                      : (request.status === 'CANCELLED' || request.status === 'DRAFT')
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-red-200 text-red-800'
                ]">
                  {{ request.status }}
                </span>
              </td>

              <td class="flex gap-1 px-3 py-4">
                <button @click="openViewModal(request)"
                  class="p-1 text-green-600 transition rounded-full cursor-pointer hover:bg-green-100 hover:text-green-800"
                  title="View Request">
                  <i class="text-xl fas fa-eye"></i>
                </button>

                <button v-if="request.status === 'PENDING'" @click="confirmCancel(request)"
                  class="p-1 text-red-600 transition rounded-full cursor-pointer hover:bg-red-100 hover:text-red-800"
                  title="Delete User">
                  <i class="text-xl fa-solid fa-xmark"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <transition name="modal">
      <div v-if="showViewModal" style="background-color: rgb(0 0 0 / 0.5);"
        class="fixed inset-0 z-50 flex items-center justify-center" @click.self="closeViewModal">
        <div class="w-full max-w-lg p-8 mx-4 transition-all transform bg-white shadow-2xl rounded-xl">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900">
              Staff Leave Request Details
            </h3>
            <button @click="closeViewModal"
              class="p-2 text-gray-500 transition rounded-full cursor-pointer hover:text-gray-700 hover:bg-gray-100"
              title="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div v-if="selectedRequest" class="pt-5 space-y-5 border-t border-gray-200">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="text-sm font-semibold text-gray-600">Employee Name</label>
                <p class="font-medium text-gray-900">{{ selectedRequest.employeeName }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Department</label>
                <p class="font-medium text-gray-900">{{ selectedRequest.department }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Leave Type</label>
                <p class="font-medium text-gray-900">{{ selectedRequest.leaveTypeName }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Start Date</label>
                <p class="font-medium text-gray-900">{{ selectedRequest.startDate }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">End Date</label>
                <p class="font-medium text-gray-900">{{ selectedRequest.endDate }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Status</label>
                <span :class="[
                  'inline-block ml-2 px-3 py-1 mt-1 rounded-full text-xs font-medium',
                  selectedRequest.status === 'APPROVED'
                    ? 'bg-green-200 text-green-800'
                    : selectedRequest.status === 'PENDING'
                      ? 'bg-blue-200 text-blue-800'
                      : (selectedRequest.status === 'CANCELLED' || selectedRequest.status === 'DRAFT')
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-red-200 text-red-800'
                ]">
                  {{ selectedRequest.status }}
                </span>
              </div>
              <div class="sm:col-span-2">
                <label class="text-sm font-semibold text-gray-600">Reason</label>
                <p class="font-medium text-gray-900">
                  {{ selectedRequest.reason || 'No reason provided' }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-8">
            <button @click="closeViewModal" :disabled="isSubmitting"
              class="px-6 py-2 font-medium text-indigo-700 transition bg-indigo-100 rounded-lg cursor-pointer hover:bg-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed">
              <i class="mr-1 fas fa-arrow-left"></i> Close
            </button>

            <button v-if="selectedRequest.status === 'PENDING'" @click="confirmCancel(selectedRequest)"
              :disabled="isSubmitting"
              class="px-6 py-2 font-medium text-red-700 transition bg-red-100 rounded-lg cursor-pointer hover:bg-red-200 disabled:opacity-70 disabled:cursor-not-allowed"
              title="Cancel Request">
              <i class="text-xl fa-solid fa-xmark"></i> Cancel Request
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showConfirmCancel"
        class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60" @click.self="cancelConfirm">
        <div class="w-full max-w-lg p-8 mx-4 transition-all transform bg-white shadow-2xl rounded-xl">
          <h3 class="mb-4 text-lg font-semibold">Confirm Cancellation</h3>
          <p class="mb-6">Are you sure you want to cancel this leave request?</p>
          <div class="flex justify-end gap-4">
            <button @click="cancelConfirm" :disabled="isSubmitting"
              class="px-4 py-2 transition bg-gray-300 rounded cursor-pointer hover:bg-gray-400 disabled:opacity-70 disabled:cursor-not-allowed">
              No
            </button>
            <button @click="onCancelledRequest()" :disabled="isSubmitting" class="px-4 py-2 text-white transition rounded cursor-pointer focus:outline-none 
                 " :class="isSubmitting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'">
              <i v-if="isSubmitting" class="mr-2 fas fa-spinner fa-spin"></i>
              {{ isSubmitting ? 'Cancelling...' : 'Yes' }}
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

    <div class="flex items-center justify-between mt-6" v-if="!isLoading && totalPages">
      <div class="text-sm text-gray-600">
        Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ leaveRequests.length }} requests
      </div>
      <div class="flex gap-2">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="px-4 py-2 text-gray-800 transition duration-200 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300">
          Previous
        </button>
        <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="[
          'px-4 py-2 rounded-lg transition duration-200',
          currentPage === page ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        ]">
          {{ page }}
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="px-4 py-2 text-gray-800 transition duration-200 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300">
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
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { getUserInfoCookie } from '@/services/authentication';
import moment from 'moment';
import { getHolidayDate } from '@/apis/publicHoliday';
export default {
  components: { Datepicker },
  data() {
    return {
      userInfo: null,
      holidays: [],
      disabledDates: [],
      holidayDateStrings: new Set(),
      leaveBalances: [],
      leaveRequests: [],
      isLoading: false,
      isSubmitting: false,
      currentPage: 1,
      itemsPerPage: 10,
      showViewModal: false,
      showCreateModal: false,
      selectedRequest: null,
      leaveForm: {
        type: '',
        approver: '',
        fromDate: '',
        toDate: '',
        reason: '',
        dayType: ''
      },
      errors: {},
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
    },
    isSameDay() {
      const { fromDate, toDate } = this.leaveForm;
      if (!fromDate || !toDate) return true; 

      const from = moment(fromDate).startOf('day');
      const to = moment(toDate).startOf('day');

      return from.isSame(to);
    }
  },

  watch: {
    isSameDay(newIsSameDay) {
      if (newIsSameDay === false) {
        if (this.leaveForm.dayType !== 'full') {
          this.leaveForm.dayType = 'full';
          this.clearError('dayType');
        }
      }
    }
  },

  methods: {

    validateForm() {
      this.errors = {};
      const { type, approver, fromDate, toDate, reason, dayType } = this.leaveForm;
      let isValid = true;

      if (!type) {
        this.errors.type = 'Leave Type is required.';
        isValid = false;
      }
      if (!approver) {
        this.errors.approver = 'Approver is required.';
        isValid = false;
      }
      if (!fromDate) {
        this.errors.fromDate = 'From Date is required.';
        isValid = false;
      }
      if (!toDate) {
        this.errors.toDate = 'To Date is required.';
        isValid = false;
      }
      if (!reason) {
        this.errors.reason = 'Reason is required.';
        isValid = false;
      }
      if (!dayType) {
        this.errors.dayType = 'Day Type is required.';
        isValid = false;
      }

      // Date Range Check: To Date cannot be before From Date.
      if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
        this.errors.toDate = 'To Date cannot be before From Date.';
        isValid = false;
      }

      if (!this.isSameDay && dayType !== 'full') {
        this.errors.dayType = 'Day Type must be Full Day for a multi-day leave request.';
        isValid = false;
      }

      return isValid && Object.keys(this.errors).length === 0;
    },

    clearError(field) {
      if (this.leaveForm[field]) {
        this.errors[field] = null;
      }
    },

    openCreateModal() {
      if (this.userInfo && this.userInfo._id) {
        this.leaveForm.user = this.userInfo._id;
      }
      this.showCreateModal = true;
    },

    openCloseModal() {
      this.showCreateModal = false;
      this.errors = {};
      this.leaveForm = {
        type: '',
        approver: '',
        fromDate: '',
        toDate: '',
        reason: '',
        dayType: ''
      };
    },

    async submitLeaveRequest() {
      if (!this.validateForm()) {
        return;
      }

      this.isSubmitting = true;

      try {
        let time = {};
        if (this.leaveForm.dayType === 'morning') time = { isMorning: true, isNoon: false, isFull: false };
        else if (this.leaveForm.dayType === 'afternoon') time = { isMorning: false, isNoon: true, isFull: false };
        else if (this.leaveForm.dayType === 'full') time = { isMorning: false, isNoon: false, isFull: true };
        const payload = { ...this.leaveForm, ...time };

        const res = await createLeaveRequest(payload);

        if (res.status === 1) {
          this.openCloseModal();

          this.isLoading = true;
          await this.getOwnLeaveRequests(this.userInfo._id);
          await this.getLeaveBalanceForUser(this.userInfo._id);

          this.showNotification('Leave request submitted successfully!', 'success');
        } else {
          this.showNotification('Failed to submit leave request.', 'error');
        }
      } catch (error) {
        console.error('Error submitting leave request:', error);
        this.showNotification('An error occurred during submission.', 'error');
      } finally {
        this.isSubmitting = false;
        this.isLoading = false;
      }
    },

    async onCancelledRequest() {
      if (!this.cancelRequestId) return;

      this.isSubmitting = true;
      try {
        const status = 'CANCELLED';
        const response = await allowStaffRequestLeave(this.cancelRequestId, status);

        if (response.status === 1) {
          this.isLoading = true;
          this.closeViewModal();
          this.cancelConfirm();

          await this.getOwnLeaveRequests(this.userInfo._id);
          await this.getLeaveBalanceForUser(this.userInfo._id);

          this.showNotification(`Leave request ${status.toLowerCase()} successfully`);
        } else {
          this.showNotification('Failed to update leave request.', 'error');
        }
      } catch (error) {
        console.error('Error allowing leave request:', error);
        this.showNotification('An error occurred during cancellation.', 'error');
      } finally {
        this.isSubmitting = false;
        this.isLoading = false;
      }
    },

    confirmCancel(request) {
      this.showViewModal = false;
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
              reason: request.reason || '-',
              comment: request.comment || '-'
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
        console.error('Error fetching approvers:', error);
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

    async fetchHolidayDates() {
      try {
        const res = await getHolidayDate();
        if (res.status === 1 && res.dates) {
          // 1. Store Date objects
          this.disabledDates = res.dates.map(d => new Date(d));

          // 2. CRITICAL OPTIMIZATION: Convert all holiday Date objects to 
          //    formatted string keys in a Set for super-fast lookup.
          this.holidayDateStrings = new Set(
            res.dates.map(d => moment(d).format('YYYY-MM-DD'))
          );
        }
      } catch (error) {
        console.error('Failed to fetch holidays:', error);
      }
    },
    isDisabled(date) {
      if (date.getDay() === 0 || date.getDay() === 6) {
        return true; 
      }

      const formattedDateString = moment(date).format('YYYY-MM-DD');
      return this.holidayDateStrings.has(formattedDateString); // Returns true for holidays
    },
    dayClass(date) {
      const formattedDateString = moment(date).format('YYYY-MM-DD');

      const isSpecialDay =
        date.getDay() === 0 ||
        date.getDay() === 6 ||
        this.holidayDateStrings.has(formattedDateString);

      if (isSpecialDay) {
        return 'dp__cell_inner bg-red-100 text-red-600';
      }

      return '';
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
      this.selectedRequest = request;
      this.showViewModal = true;
    },

    closeViewModal() {
      this.showViewModal = false;
      this.selectedRequest = null;
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
    this.fetchHolidayDates();
    this.getAllApprover();
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

:deep(.dp__cell_inner.bg-red-100) {
  background-color: #fee2e2 !important;
  color: #dc2626 !important;
}

:deep(.dp__calendar_item .dp--disabled) {
  color: #dc2626 !important;
}
</style>