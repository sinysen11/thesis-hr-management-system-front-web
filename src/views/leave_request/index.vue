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
            placeholder="Search by employee ID or reason" />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 mb-2 block">Status</label>
          <select v-model="filterStatus"
            class="border border-gray-300 rounded-lg px-4 py-2 w-[200px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
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

    <!-- Loading State (Optional, kept for future API use) -->
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
              <th class="px-4 py-3 text-left">Employee ID</th>
              <th class="px-4 py-3 text-left">Leave Type ID</th>
              <th class="px-4 py-3 text-left">Start Date</th>
              <th class="px-4 py-3 text-left">End Date</th>
              <th class="px-4 py-3 text-left">Status</th>
              <th class="px-4 py-3 text-left">Reason</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr v-for="(request, index) in paginatedRequests" :key="request.id"
              class="hover:bg-gray-50 transition border-b border-gray-200">
              <td class="px-4 py-3">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-4 py-3">{{ request.employeeId }}</td>
              <td class="px-4 py-3">{{ request.leaveTypeId }}</td>
              <td class="px-4 py-3">{{ request.startDate }}</td>
              <td class="px-4 py-3">{{ request.endDate }}</td>
              <td class="px-4 py-3">
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  request.status === 'Approved'
                    ? 'bg-green-100 text-green-800'
                    : request.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                ]">
                  {{ request.status }}
                </span>
              </td>
              <td class="px-4 py-3">{{ request.reason }}</td>
              <td class="px-4 py-3 flex gap-2">
                <button @click="openViewModal(request)"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                  title="View Request" aria-label="View Request">
                  <i class="fas fa-eye"></i>
                </button>
                <button v-if="isAdmin && request.status === 'Pending'" @click="approveRequest(request.id)"
                  class="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-100 transition"
                  title="Approve Request" aria-label="Approve Request">
                  <i class="fas fa-check"></i>
                </button>
                <button v-if="isAdmin && request.status === 'Pending'" @click="rejectRequest(request.id)"
                  class="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition"
                  title="Reject Request" aria-label="Reject Request">
                  <i class="fas fa-times"></i>
                </button>
                <button v-if="isAdmin" @click="openEditModal(request)"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                  title="Edit Request" aria-label="Edit Request">
                  <i class="fas fa-edit"></i>
                </button>
                <button v-if="isAdmin" @click="deleteRequest(request.id)"
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
                <label class="text-sm font-semibold text-gray-600">Employee ID</label>
                <p class="text-gray-900 font-medium">{{ selectedRequest.employeeId }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Leave Type ID</label>
                <p class="text-gray-900 font-medium">{{ selectedRequest.leaveTypeId }}</p>
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
                  selectedRequest.status === 'Approved' ? 'text-green-800' :
                    selectedRequest.status === 'Pending' ? 'text-yellow-800' : 'text-red-800'
                ]">
                  {{ selectedRequest.status }}
                </p>
              </div>
              <div class="sm:col-span-2">
                <label class="text-sm font-semibold text-gray-600">Reason</label>
                <p class="text-gray-900 font-medium">{{ selectedRequest.reason }}</p>
              </div>
            </div>
          </div>
          <div class="mt-8 flex justify-end gap-4">
            <button v-if="isAdmin && selectedRequest.status === 'Pending'" @click="approveRequest(selectedRequest.id)"
              class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
              aria-label="Approve Request">
              Approve
            </button>
            <button v-if="isAdmin && selectedRequest.status === 'Pending'" @click="rejectRequest(selectedRequest.id)"
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
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Reason</label>
              <textarea v-model="form.reason"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter reason" rows="4"></textarea>
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
  </div>
</template>

<script>
import FlatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { v4 as uuidv4 } from 'uuid';

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
      isEditing: false,
      isLoading: false,
      isAdmin: true, // Toggle to false for user role testing
      currentUserId: 1001, // Dummy user ID for testing
      selectedRequest: null,
      form: {
        id: null,
        employeeId: null,
        leaveTypeId: null,
        startDate: '',
        endDate: '',
        status: 'Pending',
        reason: ''
      },
      flatpickrConfig: {
        dateFormat: 'd-M-Y',
        altInput: true,
        altFormat: 'd-M-Y',
        allowInput: true
      },
      leaveRequests: [
        {
          id: uuidv4(),
          employeeId: 1001,
          leaveTypeId: 1,
          startDate: '10-Jun-2025',
          endDate: '12-Jun-2025',
          status: 'Pending',
          reason: 'Personal vacation'
        },
        {
          id: uuidv4(),
          employeeId: 1001,
          leaveTypeId: 2,
          startDate: '15-Jun-2025',
          endDate: '16-Jun-2025',
          status: 'Approved',
          reason: 'Medical leave'
        },
        {
          id: uuidv4(),
          employeeId: 1002,
          leaveTypeId: 1,
          startDate: '20-Jun-2025',
          endDate: '22-Jun-2025',
          status: 'Rejected',
          reason: 'Insufficient notice'
        },
        {
          id: uuidv4(),
          employeeId: 1002,
          leaveTypeId: 3,
          startDate: '25-Jun-2025',
          endDate: '27-Jun-2025',
          status: 'Pending',
          reason: 'Family emergency'
        },
        {
          id: uuidv4(),
          employeeId: 1003,
          leaveTypeId: 1,
          startDate: '01-Jul-2025',
          endDate: '03-Jul-2025',
          status: 'Pending',
          reason: 'Annual leave'
        }
      ]
    };
  },
  computed: {
    filteredRequests() {
      return this.leaveRequests.filter((request) => {
        const matchSearch =
          this.searchQuery === '' ||
          request.employeeId.toString().includes(this.searchQuery) ||
          request.reason.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchStatus = this.filterStatus === '' || request.status === this.filterStatus;
        const matchUser = this.isAdmin ? true : request.employeeId === this.currentUserId;
        return matchSearch && matchStatus && matchUser;
      });
    },
    paginatedRequests() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredRequests.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredRequests.length / this.itemsPerPage);
    }
  },
  methods: {
    filterData() {
      this.currentPage = 1;
    },
    resetFilters() {
      this.searchQuery = '';
      this.filterStatus = '';
      this.currentPage = 1;
    },
    openCreateModal() {
      this.isEditing = false;
      this.form = {
        id: null,
        employeeId: this.isAdmin ? null : this.currentUserId,
        leaveTypeId: null,
        startDate: '',
        endDate: '',
        status: 'Pending',
        reason: ''
      };
      this.showCreateModal = true;
    },
    openEditModal(request) {
      if (this.isAdmin || request.employeeId === this.currentUserId) {
        this.isEditing = true;
        this.form = { ...request };
        this.showCreateModal = true;
      } else {
        this.showNotification('Unauthorized to edit this request.', 'error');
      }
    },
    openViewModal(request) {
      this.selectedRequest = { ...request };
      this.showViewModal = true;
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
        status: 'Pending',
        reason: ''
      };
    },
    closeViewModal() {
      this.showViewModal = false;
      this.selectedRequest = null;
    },
    saveRequest() {
      if (
        !this.form.employeeId ||
        !this.form.leaveTypeId ||
        !this.form.startDate ||
        !this.form.endDate ||
        !this.form.reason
      ) {
        this.showNotification('Please fill in all required fields.', 'error');
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
      if (this.isEditing) {
        const index = this.leaveRequests.findIndex(
          (request) => request.id === this.form.id
        );
        if (index !== -1 && (this.isAdmin || this.leaveRequests[index].employeeId === this.currentUserId)) {
          this.leaveRequests[index] = { ...this.form };
          this.showNotification('Leave request updated successfully', 'success');
        } else {
          this.showNotification('Unauthorized to edit this request', 'error');
          return;
        }
      } else {
        this.leaveRequests.push({
          ...this.form,
          id: uuidv4()
        });
        this.showNotification('Leave request created successfully', 'success');
      }
      this.closeCreateModal();
    },
    approveRequest(id) {
      if (!this.isAdmin) {
        this.showNotification('Unauthorized action.', 'error');
        return;
      }
      const request = this.leaveRequests.find(r => r.id === id);
      if (request) {
        request.status = 'Approved';
        this.showNotification('Leave request approved successfully', 'success');
        this.$forceUpdate();
        if (this.showViewModal) this.closeViewModal();
      }
    },
    rejectRequest(id) {
      if (!this.isAdmin) {
        this.showNotification('Unauthorized action.', 'error');
        return;
      }
      const request = this.leaveRequests.find(r => r.id === id);
      if (request) {
        request.status = 'Rejected';
        this.showNotification('Leave request rejected successfully', 'success');
        this.$forceUpdate();
        if (this.showViewModal) this.closeViewModal();
      }
    },
    deleteRequest(id) {
      if (!this.isAdmin) {
        this.showNotification('Unauthorized action.', 'error');
        return;
      }
      if (confirm('Are you sure you want to delete this leave request?')) {
        this.leaveRequests = this.leaveRequests.filter(
          (request) => request.id !== id
        );
        this.showNotification('Leave request deleted successfully', 'success');
      }
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
    },
    showNotification(message, type) {
      // Replace with Vue Toastification or similar in production
      alert(`${type.toUpperCase()}: ${message}`);
    }
  },
  mounted() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.showCreateModal) this.closeCreateModal();
        if (this.showViewModal) this.closeViewModal();
      }
    });
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