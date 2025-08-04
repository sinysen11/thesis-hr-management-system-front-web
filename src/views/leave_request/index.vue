```vue
<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-extrabold text-gray-900">Leave Requests</h2>
      <button @click="openCreateModal"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200">
        Create Leave Request
      </button>
    </div>

    <!-- Filter Section -->
    <div class="bg-white shadow-sm rounded-lg p-6 mb-8">
      <div class="flex flex-col sm:flex-row items-end gap-4">
        <div>
          <label class="text-sm font-medium text-gray-700 mb-2 block">Search</label>
          <input type="text" v-model="searchQuery"
            class="border border-gray-300 rounded-lg px-4 py-2 w-[300px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Search by employee name, leave type, or reason" />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 mb-2 block">Status</label>
          <select v-model="filterStatus"
            class="border border-gray-300 rounded-lg px-4 py-2 w-[200px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        <div class="flex gap-4">
          <button @click="filterData"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200">
            Search
          </button>
          <button @click="resetFilters"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition duration-200">
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-4">
      <i class="fas fa-spinner fa-spin text-indigo-600 text-2xl"></i>
    </div>

    <!-- Table Section -->
    <div v-else class="bg-white shadow-sm rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto text-sm">
          <thead class="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th class="px-4 py-3 text-left">No</th>
              <th class="px-4 py-3 text-left">Employee Name</th>
              <th class="px-4 py-3 text-left">Department</th>
              <th class="px-4 py-3 text-left">Leave Type</th>
              <th class="px-4 py-3 text-left">Start Date</th>
              <th class="px-4 py-3 text-left">End Date</th>
              <th class="px-4 py-3 text-left">Approver</th>
              <th class="px-4 py-3 text-left">Status</th>
              <th class="px-4 py-3 text-left">Reason</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr v-if="paginatedRequests.length === 0">
              <td colspan="10" class="px-4 py-3 text-center">No leave requests found.</td>
            </tr>
            <tr v-for="(request, index) in paginatedRequests" :key="request.id"
              class="hover:bg-gray-50 transition border-b border-gray-200">
              <td class="px-4 py-3">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-4 py-3">{{ request.employeeName }}</td>
              <td class="px-4 py-3">{{ request.departmentId }}</td>
              <td class="px-4 py-3">{{ request.leaveTypeName }}</td>
              <td class="px-4 py-3">{{ request.startDate }}</td>
              <td class="px-4 py-3">{{ request.endDate }}</td>
              <td class="px-4 py-3">{{ request.approverName }}</td>
              <td class="px-4 py-3">
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                ]">
                  {{ request.status }}
                </span>
              </td>
              <td class="px-4 py-3">{{ request.reason || 'No reason provided' }}</td>
              <td class="px-4 py-3 flex gap-2">
                <button @click="openViewModal(request)"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                  title="View Request" aria-label="View Request">
                  <i class="fas fa-eye"></i>
                </button>
                <button v-if="isAdmin && request.status === 'PENDING'" @click="approveRequest(request.id)"
                  class="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-100 transition"
                  title="Approve Request" aria-label="Approve Request">
                  <i class="fas fa-check"></i>
                </button>
                <button v-if="isAdmin && request.status === 'PENDING'" @click="rejectRequest(request.id)"
                  class="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition"
                  title="Reject Request" aria-label="Reject Request">
                  <i class="fas fa-times"></i>
                </button>
                <button v-if="isAdmin" @click="openEditModal(request)"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                  title="Edit Request" aria-label="Edit Request">
                  <i class="fas fa-edit"></i>
                </button>
                <button v-if="isAdmin" @click="openDeleteModal(request.id)"
                  class="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition"
                  title="Delete Request" aria-label="Delete Request">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="mt-6 flex justify-between items-center" v-if="!isLoading">
      <div class="text-sm text-gray-600">
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
        {{ Math.min(currentPage * itemsPerPage, filteredRequests.length) }}
        of {{ filteredRequests.length }} requests
      </div>
      <div class="flex gap-2">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition duration-200">
          Previous
        </button>
        <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="[
          'px-4 py-2 rounded-lg transition duration-200',
          currentPage === page
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        ]">
          {{ page }}
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition duration-200">
          Next
        </button>
      </div>
    </div>

    <!-- Modal for View Leave Request -->
    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showViewModal"
        class="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50" @click.self="closeViewModal">
        <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900">Leave Request Details</h3>
            <button @click="closeViewModal"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition" title="Close"
              aria-label="Close Modal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div v-if="selectedRequest" class="space-y-5 border-t border-gray-200 pt-5">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="text-sm font-semibold text-gray-600">Employee Name</label>
                <p class="text-gray-900 font-medium">{{ selectedRequest.employeeName }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Department</label>
                <p class="text-gray-900 font-medium">{{ selectedRequest.departmentId }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Leave Type</label>
                <p class="text-gray-900 font-medium">{{ selectedRequest.leaveTypeName }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Approver</label>
                <p class="text-gray-900 font-medium">{{ selectedRequest.approverName }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Start Date</label>
                <p class="text-gray-900 font-medium">{{ selectedRequest.startDate }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">End Date</label>
                <p class="text-gray-900 font-medium">{{ selectedRequest.endDate }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Status</label>
                <p :class="[
                  'text-sm font-medium',
                  selectedRequest.status === 'APPROVED' ? 'text-green-800' :
                    selectedRequest.status === 'PENDING' ? 'text-yellow-800' : 'text-red-800'
                ]">
                  {{ selectedRequest.status }}
                </p>
              </div>
              <div class="sm:col-span-2">
                <label class="text-sm font-semibold text-gray-600">Reason</label>
                <p class="text-gray-900 font-medium">{{ selectedRequest.reason || 'No reason provided' }}</p>
              </div>
            </div>
          </div>
          <div class="mt-8 flex justify-end gap-4">
            <button v-if="isAdmin && selectedRequest.status === 'PENDING'" @click="approveRequest(selectedRequest.id)"
              class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
              aria-label="Approve Request">
              Approve
            </button>
            <button v-if="isAdmin && selectedRequest.status === 'PENDING'" @click="rejectRequest(selectedRequest.id)"
              class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
              aria-label="Reject Request">
              Reject
            </button>
            <button @click="closeViewModal"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
              aria-label="Close Modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal for Create/Update Leave Request -->
    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showCreateModal"
        class="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50" @click.self="closeCreateModal">
        <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900">
              {{ isEditing ? 'Edit Leave Request' : 'Create Leave Request' }}
            </h3>
            <button @click="closeCreateModal"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition" title="Close"
              aria-label="Close Modal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="space-y-5 border-t border-gray-200 pt-5">
            <div>
              <label class="text-sm font-semibold text-gray-600">Employee ID</label>
              <input v-model.number="form.employeeId" type="number" :disabled="!isAdmin"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:bg-gray-100"
                placeholder="Enter employee ID" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Leave Type ID</label>
              <input v-model.number="form.leaveTypeId" type="number"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter leave type ID" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Start Date</label>
              <flat-pickr v-model="form.startDate"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Select start date" :config="flatpickrConfig"></flat-pickr>
              <p v-if="form.startDate && form.endDate && new Date(form.startDate) > new Date(form.endDate)"
                class="text-red-600 text-xs mt-1">End date must be after start date.</p>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">End Date</label>
              <flat-pickr v-model="form.endDate"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Select end date" :config="flatpickrConfig"></flat-pickr>
            </div>
            <div v-if="isAdmin">
              <label class="text-sm font-semibold text-gray-600">Status</label>
              <select v-model="form.status"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Reason (Optional)</label>
              <textarea v-model="form.reason"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter reason (optional)" rows="4"></textarea>
            </div>
          </div>
          <div class="mt-8 flex justify-end gap-4">
            <button @click="closeCreateModal"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition duration-200"
              aria-label="Cancel">
              Cancel
            </button>
            <button @click="saveRequest"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
              aria-label="Save Request">
              {{ isEditing ? 'Update' : 'Create' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal for Delete Confirmation -->
    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showDeleteModal"
        class="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50" @click.self="closeDeleteModal">
        <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4 transform transition-all">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900">Confirm Delete</h3>
            <button @click="closeDeleteModal"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition" title="Close"
              aria-label="Close Modal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="space-y-5 border-t border-gray-200 pt-5">
            <p class="text-gray-700">Are you sure you want to delete this leave request? This action cannot be undone.</p>
          </div>
          <div class="mt-8 flex justify-end gap-4">
            <button @click="closeDeleteModal"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition duration-200"
              aria-label="Cancel">
              Cancel
            </button>
            <button @click="confirmDeleteRequest"
              class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
              aria-label="Confirm Delete">
              Delete
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import FlatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment';
import { getAllLeaveRequest, getOneLeaveRequest, createLeaveRequest, updateLeaveRequest, deleteLeaveRequest, approveLeaveRequest, rejectLeaveRequest } from '@/apis/leave-request';

export default {
  components: {
    FlatPickr
  },
  data() {
    return {
      searchQuery: '',
      filterStatus: '',
      currentPage: 1,
      itemsPerPage: 10,
      showCreateModal: false,
      showViewModal: false,
      showDeleteModal: false,
      deleteRequestId: null,
      isEditing: false,
      isLoading: false,
      isAdmin: true, // Temporary: Set to true for debugging to bypass user filtering
      currentUserId: null, // Temporary: Set to null for debugging to bypass user filtering
      selectedRequest: null,
      form: {
        id: null,
        employeeId: null,
        leaveTypeId: null,
        startDate: '',
        endDate: '',
        status: 'PENDING',
        reason: ''
      },
      flatpickrConfig: {
        dateFormat: 'd-M-Y',
        altInput: true,
        altFormat: 'd-M-Y',
        allowInput: true
      },
      leaveRequests: []
    };
  },
  computed: {
    filteredRequests() {
      const filtered = this.leaveRequests.filter((request) => {
        const matchSearch =
          this.searchQuery === '' ||
          request.employeeName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          request.leaveTypeName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (request.reason && request.reason.toLowerCase().includes(this.searchQuery.toLowerCase()));
        const matchStatus = this.filterStatus === '' || request.status === this.filterStatus;
        const matchUser = this.isAdmin ? true : request.employeeId === this.currentUserId;
        console.log('Filtering request:', { request, matchSearch, matchStatus, matchUser });
        return matchSearch && matchStatus && matchUser;
      });
      console.log('filteredRequests:', filtered);
      return filtered;
    },
    paginatedRequests() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      const paginated = this.filteredRequests.slice(start, end);
      console.log('paginatedRequests:', paginated);
      return paginated;
    },
    totalPages() {
      const pages = Math.ceil(this.filteredRequests.length / this.itemsPerPage) || 1;
      console.log('totalPages:', pages);
      return pages;
    }
  },
  methods: {
    handleEscape(e) {
      if (e.key === 'Escape') {
        if (this.showCreateModal) this.closeCreateModal();
        if (this.showViewModal) this.closeViewModal();
        if (this.showDeleteModal) this.closeDeleteModal();
      }
    },

    showNotification(message, type) {
      if (type === 'success') {
        this.$toast.success(message, { timeout: 3000 });
      } else {
        this.$toast.error(message, { timeout: 3000 });
      }
    },

    formatDate(date) {
      console.log('Formatting date:', date);
      return date ? moment(date).format('DD-MMM-YYYY') : '';
    },

    async getAllLeaveRequests() {
      this.isLoading = true;
      try {
        const result = await getAllLeaveRequest();
        console.log('getAllLeaveRequest response:', result);
        if (result && result.status === 1 && Array.isArray(result.leaveRequests)) {
          this.leaveRequests = result.leaveRequests.map(request => ({
            id: request._id,
            employeeId: request.user?._id || '',
            employeeName: `${request.user?.first_name_en || ''} ${request.user?.last_name_en || ''}`.trim(),
            departmentId: request.user?.department || '',
            leaveTypeId: request.type?._id || '',
            leaveTypeName: request.type?.name || '',
            startDate: this.formatDate(request.fromDate),
            endDate: this.formatDate(request.toDate),
            approverName: `${request.approver?.first_name_en || ''} ${request.approver?.last_name_en || ''}`.trim(),
            status: request.status || 'PENDING',
            reason: request.reason || 'No reason provided'
          }));
          console.log('Mapped leaveRequests:', this.leaveRequests);
        } else {
          console.error('Invalid response format:', result);
          this.showNotification('Failed to load leave requests. Invalid response format.', 'error');
          this.leaveRequests = [];
        }
      } catch (error) {
        console.error('Error fetching leave requests:', error);
        this.showNotification('Error fetching leave requests: ' + error.message, 'error');
        this.leaveRequests = [];
      } finally {
        this.isLoading = false;
      }
    },

    async getOneLeaveRequest(id) {
      this.isLoading = true;
      try {
        const result = await getOneLeaveRequest(id);
        console.log('getOneLeaveRequest response:', result);
        if (result && result.status === 1 && result.leaveRequest) {
          return {
            id: result.leaveRequest._id,
            employeeId: result.leaveRequest.user?._id || '',
            employeeName: `${result.leaveRequest.user?.first_name_en || ''} ${result.leaveRequest.user?.last_name_en || ''}`.trim(),
            departmentId: result.leaveRequest.user?.department || '',
            leaveTypeId: result.leaveRequest.type?._id || '',
            leaveTypeName: result.leaveRequest.type?.name || '',
            startDate: this.formatDate(result.leaveRequest.fromDate),
            endDate: this.formatDate(result.leaveRequest.toDate),
            approverName: `${result.leaveRequest.approver?.first_name_en || ''} ${result.leaveRequest.approver?.last_name_en || ''}`.trim(),
            status: result.leaveRequest.status || 'PENDING',
            reason: result.leaveRequest.reason || 'No reason provided'
          };
        } else {
          this.showNotification('Failed to fetch leave request. Invalid response format.', 'error');
          return null;
        }
      } catch (error) {
        console.error('Error fetching leave request:', error);
        this.showNotification('Error fetching leave request: ' + error.message, 'error');
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    async saveRequest() {
      if (
        !this.form.employeeId ||
        !this.form.leaveTypeId ||
        !this.form.startDate ||
        !this.form.endDate
      ) {
        this.showNotification('Please fill in all required fields (Employee ID, Leave Type ID, Start Date, End Date).', 'error');
        return;
      }
      const startDate = new Date(this.form.startDate);
      const endDate = new Date(this.form.endDate);
      if (startDate > endDate) {
        this.showNotification('End date must be after start date.', 'error');
        return;
      }
      if (!this.isAdmin && this.form.employeeId !== this.currentUserId) {
        this.showNotification('You can only create requests for yourself.', 'error');
        return;
      }
      try {
        this.isLoading = true;
        const payload = {
          user: this.form.employeeId,
          type: this.form.leaveTypeId,
          fromDate: moment(this.form.startDate, 'DD-MMM-YYYY').toISOString(),
          toDate: moment(this.form.endDate, 'DD-MMM-YYYY').toISOString(),
          status: this.isAdmin ? this.form.status : 'PENDING',
          reason: this.form.reason || undefined
        };
        if (this.isEditing) {
          const result = await updateLeaveRequest(this.form.id, payload);
          console.log('updateLeaveRequest response:', result);
          if (result && result.status === 1) {
            await this.getAllLeaveRequests();
            this.showNotification('Leave request updated successfully', 'success');
          } else {
            this.showNotification('Failed to update leave request. Please try again.', 'error');
          }
        } else {
          const result = await createLeaveRequest(payload);
          console.log('createLeaveRequest response:', result);
          if (result && result.status === 1) {
            await this.getAllLeaveRequests();
            this.showNotification('Leave request created successfully', 'success');
          } else {
            this.showNotification('Failed to create leave request. Please try again.', 'error');
          }
        }
        this.closeCreateModal();
      } catch (error) {
        console.error('Error saving leave request:', error);
        this.showNotification('Error saving leave request: ' + error.message, 'error');
      } finally {
        this.isLoading = false;
      }
    },

    async approveRequest(id) {
      if (!this.isAdmin) {
        this.showNotification('Unauthorized action.', 'error');
        return;
      }
      try {
        this.isLoading = true;
        const result = await approveLeaveRequest(id);
        console.log('approveLeaveRequest response:', result);
        if (result && result.status === 1) {
          await this.getAllLeaveRequests();
          this.showNotification('Leave request approved successfully', 'success');
          if (this.showViewModal) this.closeViewModal();
        } else {
          this.showNotification('Failed to approve leave request. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Error approving leave request:', error);
        this.showNotification('Error approving leave request: ' + error.message, 'error');
      } finally {
        this.isLoading = false;
      }
    },

    async rejectRequest(id) {
      if (!this.isAdmin) {
        this.showNotification('Unauthorized action.', 'error');
        return;
      }
      try {
        this.isLoading = true;
        const result = await rejectLeaveRequest(id);
        console.log('rejectLeaveRequest response:', result);
        if (result && result.status === 1) {
          await this.getAllLeaveRequests();
          this.showNotification('Leave request rejected successfully', 'success');
          if (this.showViewModal) this.closeViewModal();
        } else {
          this.showNotification('Failed to reject leave request. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Error rejecting leave request:', error);
        this.showNotification('Error rejecting leave request: ' + error.message, 'error');
      } finally {
        this.isLoading = false;
      }
    },

    async deleteRequest(id) {
      if (!this.isAdmin) {
        this.showNotification('Unauthorized action.', 'error');
        return;
      }
      try {
        this.isLoading = true;
        const result = await deleteLeaveRequest(id);
        console.log('deleteLeaveRequest response:', result);
        if (result && result.status === 1) {
          await this.getAllLeaveRequests();
          this.showNotification('Leave request deleted successfully', 'success');
        } else {
          this.showNotification('Failed to delete leave request. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Error deleting leave request:', error);
        this.showNotification('Error deleting leave request: ' + error.message, 'error');
      } finally {
        this.isLoading = false;
      }
    },

    openDeleteModal(id) {
      this.deleteRequestId = id;
      this.showDeleteModal = true;
    },

    async confirmDeleteRequest() {
      await this.deleteRequest(this.deleteRequestId);
      this.closeDeleteModal();
    },

    closeDeleteModal() {
      this.showDeleteModal = false;
      this.deleteRequestId = null;
    },

    async openEditModal(request) {
      if (!this.isAdmin && request.employeeId !== this.currentUserId) {
        this.showNotification('Unauthorized to edit this request.', 'error');
        return;
      }
      try {
        this.isLoading = true;
        const leaveRequest = await this.getOneLeaveRequest(request.id);
        if (leaveRequest) {
          this.isEditing = true;
          this.form = {
            id: leaveRequest.id,
            employeeId: leaveRequest.employeeId,
            leaveTypeId: leaveRequest.leaveTypeId,
            startDate: leaveRequest.startDate,
            endDate: leaveRequest.endDate,
            status: leaveRequest.status,
            reason: leaveRequest.reason
          };
          this.showCreateModal = true;
        }
      } catch (error) {
        console.error('Error opening edit modal:', error);
        this.showNotification('Error opening edit modal: ' + error.message, 'error');
      } finally {
        this.isLoading = false;
      }
    },

    async openViewModal(request) {
      try {
        this.isLoading = true;
        const leaveRequest = await this.getOneLeaveRequest(request.id);
        if (leaveRequest) {
          this.selectedRequest = { ...leaveRequest };
          this.showViewModal = true;
        }
      } catch (error) {
        console.error('Error opening view modal:', error);
        this.showNotification('Error opening view modal: ' + error.message, 'error');
      } finally {
        this.isLoading = false;
      }
    },

    filterData() {
      console.log('Applying filters:', {
        searchQuery: this.searchQuery,
        filterStatus: this.filterStatus,
        currentUserId: this.currentUserId
      });
      this.currentPage = 1;
    },

    resetFilters() {
      this.searchQuery = '';
      this.filterStatus = '';
      this.currentPage = 1;
      console.log('Filters reset:', {
        searchQuery: this.searchQuery,
        filterStatus: this.filterStatus,
        currentUserId: this.currentUserId
      });
    },

    openCreateModal() {
      this.isEditing = false;
      this.form = {
        id: null,
        employeeId: this.isAdmin ? null : this.currentUserId,
        leaveTypeId: null,
        startDate: '',
        endDate: '',
        status: 'PENDING',
        reason: ''
      };
      this.showCreateModal = true;
    },

    closeCreateModal() {
      this.showCreateModal = false;
      this.isEditing = false;
      this.form = {
        id: null,
        employeeId: this.isAdmin ? null : this.currentUserId,
        leaveTypeId: null,
        startDate: '',
        endDate: '',
        status: 'PENDING',
        reason: ''
      };
    },

    closeViewModal() {
      this.showViewModal = false;
      this.selectedRequest = null;
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
      this.currentPage = page;
      console.log('Navigated to page:', page);
    }
  },
  mounted() {
    this.isAdmin = true; // Temporary: For debugging
    this.currentUserId = null; // Temporary: For debugging
    // this.isAdmin = this.$store?.state?.user?.role === 'admin' || false;
    // this.currentUserId = this.$store?.state?.user?._id || null;
    console.log('Mounted - isAdmin:', this.isAdmin, 'currentUserId:', this.currentUserId);
    this.resetFilters();
    this.getAllLeaveRequests();
    window.addEventListener('keydown', this.handleEscape);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleEscape);
  }
};
</script>

<style scoped>
th,
td {
  text-align: left;
  white-space: nowrap;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: translateY(-20px);
}

.flatpickr-input {
  background-color: white;
}
</style>
```