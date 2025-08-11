<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-extrabold text-gray-900">Leave Requests</h2>
      <button @click="openCreateModal"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200">
        Create New
      </button>
    </div>

    <!-- Tab Navigation for Admins -->
    <div v-if="isAdmin" class="mb-6">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button v-for="tab in tabs" :key="tab.name" @click="selectTab(tab.name)" :class="[
            selectedTab === tab.name
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
          ]">
            {{ tab.label }}
          </button>
        </nav>
      </div>
    </div>

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

    <div v-if="isLoading" class="text-center py-4">
      <i class="fas fa-spinner fa-spin text-indigo-600 text-2xl"></i>
    </div>

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
                <button
                  v-if="isAdmin && selectedTab === 'owner' && request.status === 'PENDING' && request.employeeId !== myId"
                  @click="approveRequest(request.id)"
                  class="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-100 transition"
                  title="Approve Request" aria-label="Approve Request"
                  :disabled="!isAdmin || selectedTab !== 'owner' || request.employeeId === myId">
                  <i class="fas fa-check"></i>
                </button>
                <button
                  v-if="isAdmin && selectedTab === 'owner' && request.status === 'PENDING' && request.employeeId !== myId"
                  @click="rejectRequest(request.id)"
                  class="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition"
                  title="Reject Request" aria-label="Reject Request"
                  :disabled="!isAdmin || selectedTab !== 'owner' || request.employeeId === myId">
                  <i class="fas fa-times"></i>
                </button>
                <button v-if="isAdmin || selectedTab === 'staff'" @click="openEditModal(request)"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                  title="Edit Request" aria-label="Edit Request">
                  <i class="fas fa-edit"></i>
                </button>
                <button v-if="isAdmin || selectedTab === 'staff'" @click="openDeleteModal(request.id)"
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

    <!-- View Modal -->
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
            <button
              v-if="isAdmin && selectedTab === 'owner' && selectedRequest.status === 'PENDING' && selectedRequest.employeeId !== myId"
              @click="approveRequest(selectedRequest.id)"
              class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
              aria-label="Approve Request"
              :disabled="!isAdmin || selectedTab !== 'owner' || selectedRequest.employeeId === myId">
              Approve
            </button>
            <button
              v-if="isAdmin && selectedTab === 'owner' && selectedRequest.status === 'PENDING' && selectedRequest.employeeId !== myId"
              @click="rejectRequest(selectedRequest.id)"
              class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
              aria-label="Reject Request"
              :disabled="!isAdmin || selectedTab !== 'owner' || selectedRequest.employeeId === myId">
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

    <!-- Create/Edit Modal -->
    <!-- Create/Edit Modal -->
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
              <label class="text-sm font-semibold text-gray-600">Start Date</label>
              <flat-pickr v-model="form.fromDate"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Select start date" :config="flatpickrConfig"></flat-pickr>
              <p v-if="form.fromDate && form.toDate && new Date(form.fromDate) > new Date(form.toDate)"
                class="text-red-600 text-xs mt-1">End date must be after start date.</p>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">End Date</label>
              <flat-pickr v-model="form.toDate"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Select end date" :config="flatpickrConfig"></flat-pickr>
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

    <!-- Delete Modal -->
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
            <p class="text-gray-700">Are you sure you want to delete this leave request? This action cannot be undone.
            </p>
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
import { getAllLeaveRequestForAdmin, getOneLeaveRequestForAdmin, createLeaveRequestForAdmin, updateLeaveRequestForAdmin, deleteLeaveRequestForAdmin } from '@/apis/request-leave';
import { getAllLeaveRequestForStaff, getOneLeaveRequestForStaff, createLeaveRequestForStaff, updateLeaveRequestForStaff, deleteLeaveRequestForStaff } from '@/apis/request-leave';
import { getAllRole } from '@/apis/role';
import { getUserInfoCookie } from '@/services/authentication';

export default {
  components: {
    FlatPickr
  },
  data() {
    return {
      roleItem: [],
      userInfo: null,
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
      isAdmin: false,
      currentUserId: null,
      myId: null,
      selectedRequest: null,
      selectedTab: 'owner', // Default to 'owner' for admins, 'staff' for non-admins
      tabs: [
        { name: 'owner', label: 'Owner' },
        { name: 'staff', label: 'Staff' }
      ],
      form: {
        id: null,
        fromDate: '',
        toDate: '',
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
    userIdOnly() {
      if (this.userInfo) {
        return this.userInfo._id || null;
      }
      return null;
    },
    filteredRequests() {
      return this.leaveRequests.filter((request) => {
        const matchSearch =
          this.searchQuery === '' ||
          request.employeeName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          request.leaveTypeName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (request.reason && request.reason.toLowerCase().includes(this.searchQuery.toLowerCase()));
        const matchStatus = this.filterStatus === '' || request.status === this.filterStatus;
        let matchUser = true;
        if (this.isAdmin) {
          if (this.selectedTab === 'owner') {
            // Show requests where the current user is the approver
            matchUser = request.approverId === this.myId;
          } else if (this.selectedTab === 'staff') {
            // Show requests where the current user is the employee
            matchUser = request.employeeId === this.myId;
          }
        } else {
          // Non-admins only see their own requests
          matchUser = request.employeeId === this.myId;
        }
        return matchSearch && matchStatus && matchUser;
      });
    },
    paginatedRequests() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      const paginated = this.filteredRequests.slice(start, end);
      return paginated;
    },
    totalPages() {
      const pages = Math.ceil(this.filteredRequests.length / this.itemsPerPage) || 1;
      return pages;
    }
  },
  methods: {
    async handleGetAllRole() {
      try {
        // Check if userInfo and userInfo.role exist
        if (this.userInfo && this.userInfo.role) {
          // If userInfo.role is an object with name and permissions
          if (typeof this.userInfo.role === 'object' && this.userInfo.role.name) {
            // Option 1: Check role name
            const roleName = this.userInfo.role.name;
            this.isAdmin = roleName === 'admin' || roleName === 'Super Admin';

            // Option 2: Enhance with permission-based check (recommended)
            const permissions = this.userInfo.role.permissions || [];
            this.isAdmin = this.isAdmin || permissions.includes('SETTING') || permissions.includes('LEAVE_REPORT');

            console.log('isAdmin (from cookie):', this.isAdmin);
            return; // Exit early since we have the role data
          }
        }
        // Fallback: Fetch roles from API if userInfo.role is an ID or missing
        const result = await getAllRole();
        if (result && result.status === 1 && Array.isArray(result.roles)) {
          this.roleItem = result.roles;

          // If userInfo.role is a string ID
          if (this.userInfo && typeof this.userInfo.role === 'string') {
            const userRoleObject = this.roleItem.find(role => role._id === this.userInfo.role);
            if (userRoleObject) {
              // Check role name
              this.isAdmin = userRoleObject.name === 'admin' || userRoleObject.name === 'Super Admin';
              // Enhance with permission-based check
              this.isAdmin = this.isAdmin || userRoleObject.permissions.includes('SETTING') || userRoleObject.permissions.includes('LEAVE_REPORT');
            } else {
              this.isAdmin = false;
              this.showNotification('User role not found in role list.');
            }
          } else {
            this.isAdmin = false;
            this.showNotification('Invalid or missing user role information.');
          }
        } else {
          console.error('Failed to fetch roles:', result);
          this.isAdmin = false;
          this.showNotification('Failed to load roles.');
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        this.isAdmin = false;
        this.showNotification('Error fetching roles: ' + (error.message || 'Unknown error'));
      }
    },
    async selectTab(tabName) {
      this.selectedTab = tabName;
      this.currentPage = 1;
      await this.fetchLeaveRequests();
    },
    async fetchLeaveRequests() {
      this.isLoading = true;
      try {
        let result;
        if (this.isAdmin) {
          result = await getAllLeaveRequestForAdmin(this.userIdOnly);
        } else {
          result = await getAllLeaveRequestForStaff(this.userIdOnly);
        }
        if (result && result.status === 1) {
          this.leaveRequests = await Promise.all(
            result.data.map(async request => {
              let departmentName = 'N/A';
              if (request.user?.department) {
                departmentName = request.user.department;
              }
              return {
                id: request._id || '',
                employeeId: request.user?._id || '',
                employeeName: request.user
                  ? `${request.user.first_name_en || ''} ${request.user.last_name_en || ''}`.trim() || 'Unknown Employee'
                  : 'Unknown Employee',
                departmentId: departmentName,
                leaveTypeId: request.type?._id || '',
                leaveTypeName: request.type?.name || 'Unknown Type',
                startDate: this.formatDate(request.fromDate) || 'N/A',
                endDate: this.formatDate(request.toDate) || 'N/A',
                approverId: request.approver?._id || '', // Add approverId
                approverName: request.approver
                  ? `${request.approver.first_name_en || ''} ${request.approver.last_name_en || ''}`.trim() || 'N/A'
                  : 'N/A',
                status: request.status || 'PENDING',
                reason: request.reason || 'No reason provided'
              };
            })
          );
        } else {
          this.showNotification('Failed to load leave requests. Invalid response format.');
          this.leaveRequests = [];
        }
      } catch (error) {
        this.showNotification('Error fetching leave requests: ' + (error.message || 'Unknown error'));
        this.leaveRequests = [];
      } finally {
        this.isLoading = false;
      }
    },
    handleEscape(e) {
      if (e.key === 'Escape') {
        if (this.showCreateModal) this.closeCreateModal();
        if (this.showViewModal) this.closeViewModal();
        if (this.showDeleteModal) this.closeDeleteModal();
      }
    },
    showNotification(message, type = 'error') {
      const displayMessage = typeof message === 'string' ? message : 'An unexpected error occurred';
      if (this.$toast) {
        if (type === 'success') {
          this.$toast.success(displayMessage, { timeout: 3000 });
        } else {
          this.$toast.error(displayMessage, { timeout: 3000 });
        }
      } else {
        alert(`${type.toUpperCase()}: ${displayMessage}`);
      }
    },
    formatDate(date) {
      try {
        return date ? moment(date).format('DD-MMM-YYYY') : 'N/A';
      } catch (error) {
        return 'N/A';
      }
    },
    async getOneRequestLeave(id) {
      this.isLoading = true;
      try {
        const result = await (this.isAdmin ? getOneLeaveRequestForAdmin(id) : getOneLeaveRequestForStaff(id));
        if (result && result.status === 1) {
          let departmentName = 'N/A';
          if (result.data.user?.department) {
            departmentName = result.data.user.department;
          }
          return {
            id: result.data._id || '',
            employeeId: result.data.user?._id || '',
            employeeName: result.data.user
              ? `${result.data.user.first_name_en || ''} ${result.data.user.last_name_en || ''}`.trim() || 'Unknown Employee'
              : 'Unknown Employee',
            departmentId: departmentName,
            leaveTypeId: result.data.type?._id || '',
            leaveTypeName: result.data.type?.name || 'Unknown Type',
            startDate: this.formatDate(result.data.fromDate) || 'N/A',
            endDate: this.formatDate(result.data.toDate) || 'N/A',
            approverName: result.data.approver
              ? `${result.data.approver.first_name_en || ''} ${result.data.approver.last_name_en || ''}`.trim() || 'N/A'
              : 'N/A',
            status: result.data.status || 'PENDING',
            reason: result.data.reason || 'No reason provided'
          };
        } else {
          this.showNotification('Failed to fetch leave request. Invalid response format.');
          return null;
        }
      } catch (error) {
        this.showNotification('Error fetching leave request: ' + (error.message || 'Unknown error'));
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    async saveRequest() {
      if (!this.form.fromDate || !this.form.toDate) {
        this.showNotification('Please fill in all required fields (Start Date, End Date).');
        return;
      }
      const startDate = new Date(this.form.fromDate);
      const endDate = new Date(this.form.toDate);
      if (startDate > endDate) {
        this.showNotification('End date must be after start date.');
        return;
      }
      try {
        this.isLoading = true;
        // Construct payload according to provided data structure
        const payload = {
          user: this.isAdmin ? this.form.employeeId || this.myId : this.myId,
          type: this.form.leaveTypeId || '6891aa6cbf540455de6440cf', // Default or context-based leave type ID
          approver: this.myId, // Set to current user ID
          fromDate: moment(this.form.fromDate, 'DD-MMM-YYYY').toISOString(),
          toDate: moment(this.form.toDate, 'DD-MMM-YYYY').toISOString(),
          reason: this.form.reason || undefined
        };
        if (payload.approver === null || payload.approver === 'null') {
          payload.approver = null;
        }
        let result;
        if (this.isEditing) {
          result = await (this.isAdmin ? updateLeaveRequestForAdmin(this.form.id, payload) : updateLeaveRequestForStaff(this.form.id, payload));
        } else {
          result = await (this.isAdmin ? createLeaveRequestForAdmin(payload) : createLeaveRequestForStaff(payload));
        }
        if (result && result.status === 1) {
          await this.fetchLeaveRequests();
          this.showNotification(`Leave request ${this.isEditing ? 'updated' : 'created'} successfully`, 'success');
        } else {
          this.showNotification(`Failed to ${this.isEditing ? 'update' : 'create'} leave request: ` + (result?.message || 'Unknown error'));
        }
        this.closeCreateModal();
      } catch (error) {
        this.showNotification('Error saving leave request: ' + (error.message || 'Unknown error'));
      } finally {
        this.isLoading = false;
      }
    },
    openEditModal(request) {
      this.isEditing = true;
      this.form = {
        id: request.id,
        fromDate: request.startDate,
        toDate: request.endDate,
        reason: request.reason,
        employeeId: request.employeeId, // Preserve for payload
        leaveTypeId: request.leaveTypeId // Preserve for payload
      };
      this.showCreateModal = true;
    },
    resetForm() {
      this.form = {
        id: null,
        fromDate: '',
        toDate: '',
        reason: '',
        employeeId: this.isAdmin ? null : this.myId, // Set for non-admins
        leaveTypeId: null // Will be set in saveRequest if needed
      };
    },
    async approveRequest(id) {
      if (!this.isAdmin || this.selectedTab !== 'owner') {
        this.showNotification('Unauthorized action.');
        return;
      }
      const request = this.leaveRequests.find(r => r.id === id);
      if (request && request.employeeId === this.myId) {
        this.showNotification('You cannot approve your own leave request.');
        return;
      }
      if (!confirm('Are you sure you want to approve this leave request?')) {
        return;
      }
      try {
        this.isLoading = true;
        const payload = { status: 'APPROVED' };
        const result = await updateLeaveRequestForAdmin(id, payload);
        if (result && result.status === 1) {
          await this.fetchLeaveRequests();
          this.showNotification('Leave request approved successfully', 'success');
        } else {
          this.showNotification('Failed to approve leave request: ' + (result?.message || 'Unknown error'));
        }
      } catch (error) {
        this.showNotification('Error approving leave request: ' + (error.message || 'Unknown error'));
      } finally {
        this.isLoading = false;
      }
    },
    async rejectRequest(id) {
      if (!this.isAdmin || this.selectedTab !== 'owner') {
        this.showNotification('Unauthorized action.');
        return;
      }
      const request = this.leaveRequests.find(r => r.id === id);
      if (request && request.employeeId === this.myId) {
        this.showNotification('You cannot reject your own leave request.');
        return;
      }
      if (!confirm('Are you sure you want to reject this leave request?')) {
        return;
      }
      try {
        this.isLoading = true;
        const payload = { status: 'REJECTED' };
        const result = await updateLeaveRequestForAdmin(id, payload);
        if (result && result.status === 1) {
          await this.fetchLeaveRequests();
          this.showNotification('Leave request rejected successfully', 'success');
        } else {
          this.showNotification('Failed to reject leave request: ' + (result?.message || 'Unknown error'));
        }
      } catch (error) {
        this.showNotification('Error rejecting leave request: ' + (error.message || 'Unknown error'));
      } finally {
        this.isLoading = false;
      }
    },
    async deleteRequest(id) {
      if (!this.isAdmin && this.selectedTab !== 'staff') {
        this.showNotification('Unauthorized action.');
        return;
      }
      try {
        this.isLoading = true;
        const result = await (this.isAdmin ? deleteLeaveRequestForAdmin(id) : deleteLeaveRequestForStaff(id));
        if (result && result.status === 1) {
          await this.fetchLeaveRequests();
          this.showNotification('Leave request deleted successfully', 'success');
          this.closeDeleteModal();
        } else {
          this.showNotification('Failed to delete leave request: ' + (result?.message || 'Unknown error'));
        }
      } catch (error) {
        this.showNotification('Error deleting leave request: ' + (error.message || 'Unknown error'));
      } finally {
        this.isLoading = false;
      }
    },
    confirmDeleteRequest() {
      if (this.deleteRequestId) {
        this.deleteRequest(this.deleteRequestId);
      }
    },
    openCreateModal() {
      this.isEditing = false;
      this.resetForm();
      this.form.employeeId = this.selectedTab === 'staff' ? this.myId : null;
      this.showCreateModal = true;
    },
    closeCreateModal() {
      this.showCreateModal = false;
    },
    openViewModal(request) {
      this.selectedRequest = request;
      this.showViewModal = true;
    },
    closeViewModal() {
      this.showViewModal = false;
      this.selectedRequest = null;
    },
    openDeleteModal(id) {
      this.deleteRequestId = id;
      this.showDeleteModal = true;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.deleteRequestId = null;
    },
    filterData() {
      this.currentPage = 1;
    },
    resetFilters() {
      this.searchQuery = '';
      this.filterStatus = '';
      this.currentPage = 1;
    },
    goToPage(page) {
      this.currentPage = page;
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
    }
  },
  created() {
    const userInfoCookie = getUserInfoCookie();
    if (userInfoCookie) {
      try {
        this.userInfo = JSON.parse(userInfoCookie);
        this.myId = this.userInfo._id;
        this.currentUserId = this.userInfo._id;
        this.selectedTab = this.isAdmin ? 'owner' : 'staff';
      } catch (error) {
        this.showNotification('Failed to parse user info.');
      }
    }
  },
  mounted() {
    this.handleGetAllRole();
    this.fetchLeaveRequests();
    document.addEventListener('keydown', this.handleEscape);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleEscape);
  }
};
</script>