<template>
  <div class="w-full">
    <!-- Fixed-Position Alerts -->
    <div class="fixed z-50 w-full max-w-xs space-y-4 top-4 right-4">
      <div v-if="successMessage"
        class="p-4 text-white transition-opacity duration-500 ease-in-out bg-green-500 rounded-lg shadow-md"
        :class="{ 'opacity-0': !successMessage }">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage"
        class="p-4 text-white transition-opacity duration-500 ease-in-out bg-red-500 rounded-lg shadow-md"
        :class="{ 'opacity-0': !errorMessage }">
        {{ errorMessage }}
      </div>
    </div>

    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-extrabold tracking-tight text-green-700">
        User Management
      </h2>
      <button @click="openCreateModal"
        class="px-6 cursor-pointer py-2 font-medium text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
        Create
      </button>
    </div>

    <!-- Filter Section -->
    <div class="p-6 mb-8 bg-white rounded-lg shadow-sm">
      <div class="flex flex-col items-end gap-4 sm:flex-row">
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700">
            Search Users
          </label>
          <input type="text" v-model="searchQuery"
            class="border border-gray-300 rounded-lg px-4 py-2 w-[300px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Search by username, email, or name" />
        </div>
        <div class="flex gap-4">
          <button @click="filterData"
            class="px-6 py-2 font-medium text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700">
            Search
          </button>
          <button @click="resetFilters"
            class="px-6 py-2 font-medium text-gray-800 transition duration-200 bg-gray-200 rounded-lg hover:bg-gray-300">
            Reset
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="py-4 text-center">
      <i class="text-6xl text-green-700 fas fa-spinner fa-spin"></i>
    </div>

    <!-- Table Section -->
    <div class="overflow-hidden bg-white rounded-lg shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm table-auto">
          <thead class="text-xs font-semibold text-gray-600 uppercase bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-left">No</th>
              <th class="px-4 py-3 text-left">Name (KH)</th>
              <th class="px-4 py-3 text-left">Name (EN)</th>
              <th class="px-4 py-3 text-left">Username</th>
              <th class="px-4 py-3 text-left">Email</th>
              <th class="px-4 py-3 text-left">Role</th>
              <th class="px-4 py-3 text-left">Department</th>
              <th class="px-4 py-3 text-left">Status</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr v-for="(user, index) in paginatedUsers" :key="user.id"
              class="transition border-b border-gray-200 hover:bg-gray-50">
              <td class="px-4 py-3">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-4 py-3">
                {{ user.first_name_kh }} {{ user.last_name_kh }}
              </td>
              <td class="px-4 py-3">
                {{ user.first_name_en }} {{ user.last_name_en }}
              </td>
              <td class="px-4 py-3">{{ user.username }}</td>
              <td class="px-4 py-3">{{ user.email }}</td>
              <td class="px-4 py-3">{{ user.role?.name || 'N/A' }}</td>
              <td class="px-4 py-3">{{ user.department?.name_en || 'N/A' }}</td>
              <td class="px-4 py-3">
                <button @click="toggleStatus(user)"
                  class="relative cursor-pointer flex items-center w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none"
                  :class="user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'" title="Toggle User Status">
                  <span
                    class="absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300"
                    :class="user.status === 'Active' ? 'translate-x-6' : 'translate-x-1'"></span>
                </button>
              </td>
              <td class="flex gap-2 px-4 py-3">
                <button @click="openViewModal(user)"
                  class="p-2 text-indigo-600 transition rounded-full hover:text-indigo-800 hover:bg-indigo-100"
                  title="View User">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="openEditModal(user)" :disabled="loading"
                  class="p-2 text-indigo-600 transition rounded-full hover:text-indigo-800 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Edit User">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="confirmDelete(user.id)" :disabled="loading"
                  class="p-2 text-red-600 transition rounded-full hover:text-red-800 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete User">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="flex items-center justify-between mt-6">
      <div class="text-sm text-gray-600">
        Showing {{ totalUsers === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1 }} to
        {{ (currentPage - 1) * itemsPerPage + paginatedUsers.length }}
        of {{ totalUsers }} users
      </div>
      <div class="flex gap-2">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="px-4 py-2 text-gray-800 transition duration-200 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300">
          Previous
        </button>

        <template v-for="(page, index) in visiblePages" :key="index">
          <span v-if="page === '...'" class="px-4 py-2 text-gray-500">...</span>
          <button v-else @click="goToPage(page)" :class="[
            'px-4 py-2 rounded-lg transition duration-200',
            currentPage === page
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          ]">
            {{ page }}
          </button>
        </template>

        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="px-4 py-2 text-gray-800 transition duration-200 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300">
          Next
        </button>
      </div>
    </div>

    <!-- Modal for View User -->
    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5)" v-if="showViewModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60" @click.self="closeViewModal">
        <div
          class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all max-h-[80vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900">User Details</h3>
            <button @click="closeViewModal"
              class="p-2 text-gray-500 transition rounded-full hover:text-gray-700 hover:bg-gray-100" title="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div v-if="selectedUser" class="pt-5 space-y-5 border-t border-gray-200">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="text-sm font-semibold text-gray-600">Name (KH)</label>
                <p class="font-medium text-gray-900">
                  {{ selectedUser.first_name_kh }}
                  {{ selectedUser.last_name_kh }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Name (EN)</label>
                <p class="font-medium text-gray-900">
                  {{ selectedUser.first_name_en }}
                  {{ selectedUser.last_name_en }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Username</label>
                <p class="font-medium text-gray-900">
                  {{ selectedUser.username }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Email</label>
                <p class="font-medium text-gray-900">
                  {{ selectedUser.email }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Role</label>
                <p class="font-medium text-gray-900">
                  {{ selectedUser.role?.name || 'N/A' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Department</label>
                <p class="font-medium text-gray-900">
                  {{ selectedUser.department?.name_en || 'N/A' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Phone Number</label>
                <p class="font-medium text-gray-900">
                  {{ selectedUser.phone_number || 'N/A' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Gender</label>
                <p class="font-medium text-gray-900">
                  {{ selectedUser.gender || 'N/A' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Date of Birth</label>
                <p class="font-medium text-gray-900">
                  {{
                    selectedUser.dob
                      ? new Date(selectedUser.dob).toLocaleDateString()
                      : 'N/A'
                  }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Status</label>
                <p :class="[
                  'font-medium',
                  selectedUser.status === 'Active'
                    ? 'text-green-800'
                    : 'text-red-800'
                ]">
                  {{ selectedUser.status || 'N/A' }}
                </p>
              </div>
            </div>
          </div>
          <div class="flex justify-end mt-8">
            <button @click="closeViewModal"
              class="px-6 py-2 font-medium text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700">
              Close
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal for Create/Update User -->
    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5)" v-if="showCreateModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60" @click.self="closeCreateModal">
        <div
          class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-4 transform transition-all max-h-[90vh] overflow-y-auto border-t-4 border-indigo-600">
          <div class="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
            <h3 class="text-2xl font-extrabold text-gray-900">
              <i :class="isEditing ? 'fas fa-user-edit' : 'fas fa-user-plus'" class="mr-2 text-indigo-600"></i>
              {{ isEditing ? 'Edit User' : 'Create New User' }}
            </h3>
            <button @click="closeCreateModal"
              class="p-2 text-gray-500 transition rounded-full hover:text-indigo-700 hover:bg-indigo-50" title="Close">
              <i class="fas fa-times text-lg"></i>
            </button>
          </div>

          <div class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">First Name (KH) *</label>
                <input v-model="form.first_name_kh" type="text" required
                  class="w-full px-4 py-2.5 transition border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm"
                  placeholder="Enter first name (KH)" />
              </div>
              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">Last Name (KH) *</label>
                <input v-model="form.last_name_kh" type="text" required
                  class="w-full px-4 py-2.5 transition border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm"
                  placeholder="Enter last name (KH)" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">First Name (EN) *</label>
                <input v-model="form.first_name_en" type="text" required
                  class="w-full px-4 py-2.5 transition border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm"
                  placeholder="Enter first name (EN)" />
              </div>
              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">Last Name (EN) *</label>
                <input v-model="form.last_name_en" type="text" required
                  class="w-full px-4 py-2.5 transition border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm"
                  placeholder="Enter last name (EN)" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">Username *</label>
                <input v-model="form.username" type="text" required
                  class="w-full px-4 py-2.5 transition border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm"
                  placeholder="Enter username" />
              </div>
              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">Email *</label>
                <input v-model="form.email" type="email" required
                  class="w-full px-4 py-2.5 transition border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm"
                  placeholder="Enter email" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div v-if="!isEditing" class="w-full">
                <label class="block mb-1 text-sm font-medium text-gray-700">Password *</label>
                <input v-model="form.password" type="password" required
                  class="w-full px-4 py-2.5 transition border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm"
                  placeholder="Enter password" />
              </div>
              <div :class="{ 'w-full': isEditing }">
                <label class="block mb-1 text-sm font-medium text-gray-700">Role *</label>
                <select v-model="form.role" required
                  class="w-full px-4 py-2.5 transition border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm appearance-none bg-white">
                  <option value="" disabled>Select a role</option>
                  <option v-for="role in roles" :key="role._id" :value="role._id">
                    {{ role.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">Department *</label>
                <select v-model="form.department" required
                  class="w-full px-4 py-2.5 transition border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm appearance-none bg-white">
                  <option value="" disabled>Select a department</option>
                  <option v-for="department in departments" :key="department._id" :value="department._id">
                    {{ department.name_en }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
                <input v-model="form.phone_number" type="text"
                  class="w-full px-4 py-2.5 transition border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm"
                  placeholder="Enter phone number" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">Gender</label>
                <select v-model="form.gender"
                  class="w-full px-4 py-2.5 transition border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm appearance-none bg-white">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">Date of Birth</label>
                <input v-model="form.dob" type="date"
                  class="w-full px-4 py-2.5 transition border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm"
                  placeholder="Enter date of birth" />
              </div>
            </div>

            <div class="w-full">
              <label class="block mb-1 text-sm font-medium text-gray-700">Status</label>
              <select v-model="form.status"
                class="w-full px-4 py-2.5 transition border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm appearance-none bg-white">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-4 pt-6 mt-8 border-t border-gray-100">
            <button @click="closeCreateModal"
              class="px-6 py-2.5 font-semibold text-gray-600 transition duration-200 bg-gray-100 rounded-xl hover:bg-gray-200">
              Cancel
            </button>
            <button @click="saveUser" :disabled="loading"
              class="px-6 py-2.5 font-semibold text-white transition duration-200 bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <i v-if="loading" class="fas fa-spinner fa-spin"></i>
              {{ isEditing ? 'Update User' : 'Create User' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal for Delete Confirmation -->
    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5)" v-if="showDeleteModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60" @click.self="closeDeleteModal">
        <div class="w-full max-w-md p-8 mx-4 transition-all transform bg-white shadow-2xl rounded-xl">
          <div class="text-center">
            <i class="mb-4 text-5xl text-red-500 fas fa-exclamation-triangle"></i>
            <h3 class="mb-2 text-2xl font-bold text-gray-900">
              Confirm Deletion
            </h3>
            <p class="text-gray-600">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
          </div>
          <div class="flex justify-center gap-4 mt-8">
            <button @click="closeDeleteModal"
              class="px-6 py-2 font-medium text-gray-800 transition duration-200 bg-gray-200 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
            <button @click="deleteUser" :disabled="loading"
              class="px-6 py-2 font-medium text-white transition duration-200 bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
              Delete
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getAllUser, createUser, updateUser, deleteUser, updateStatus } from '@/apis/user';
import { getAllRole } from '@/apis/role';
import { getAllDepartment } from '@/apis/department';

export default {
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,
      totalUsers: 0, // Now correctly updated from result.pagination.total
      showCreateModal: false,
      showViewModal: false,
      showDeleteModal: false,
      isEditing: false,
      selectedUser: null,
      userToDeleteId: null,
      form: {
        id: null,
        first_name_kh: '',
        last_name_kh: '',
        first_name_en: '',
        last_name_en: '',
        username: '',
        email: '',
        password: '',
        role: '',
        department: '',
        phone_number: '',
        gender: 'Male',
        dob: '',
        status: 'Active'
      },
      users: [], // Holds only the users for the CURRENT page
      roles: [],
      departments: [],
      errorMessage: '',
      successMessage: '',
      loading: false
    };
  },
  computed: {
    // Kept to avoid breaking any table structure that might rely on this name.
    filteredUsers() {
      return this.users;
    },
    // The data array loaded from the server is already paginated.
    paginatedUsers() {
      return this.users;
    },

    // Calculates total pages based on the total count from the server.
    totalPages() {
      return Math.ceil(this.totalUsers / this.itemsPerPage) || 1;
    },

    /**
     * ✅ FIXED Logic: Displays a maximum of 5 page buttons (including ellipsis).
     * This correctly ensures [1, 2] is shown for 11 total users.
     */
    visiblePages() {
      const total = this.totalPages;
      const current = this.currentPage;
      const maxButtons = 5;
      const pages = [];

      // Case 1: Total pages is 5 or less (e.g., 11 users -> total is 2)
      if (total <= maxButtons) {
        for (let i = 1; i <= total; i++) {
          pages.push(i);
        }
        return pages;
      }

      // Case 2: Total pages is greater than 5 (Ellipsis logic)
      const pageDelta = 1;

      let start = Math.max(2, current - pageDelta);
      let end = Math.min(total - 1, current + pageDelta);

      // Adjust window to display 3 pages around the current page if near boundaries
      if (current <= 3) {
        end = Math.min(total - 1, 4);
        start = 2;
      } else if (current >= total - 2) {
        start = Math.max(2, total - 3);
        end = total - 1;
      }

      // Add page 1
      pages.push(1);

      // Add first ellipsis if needed
      if (start > 2) {
        pages.push('...');
      }

      // Add central pages
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== total) {
          pages.push(i);
        }
      }

      // Add second ellipsis if needed
      if (end < total - 1) {
        pages.push('...');
      }

      // Add last page
      if (pages[pages.length - 1] !== total) {
        pages.push(total);
      }

      // Remove duplicates and double ellipses
      return [...new Set(pages.filter(p => p))].filter((page, index, self) => {
        if (page === '...' && self[index - 1] === '...') return false;
        return true;
      });
    }
  },
  methods: {
    alert(message, type = 'success') {
      if (type === 'success') {
        this.successMessage = message;
        this.errorMessage = '';
      } else {
        this.errorMessage = message;
        this.successMessage = '';
      }
      setTimeout(() => {
        this.successMessage = '';
        this.errorMessage = '';
      }, 3000);
    },

    async getAllUsers(page = this.currentPage, query = this.searchQuery) {
      this.loading = true;
      try {
        const result = await getAllUser({
          page,
          limit: this.itemsPerPage,
          search: query || undefined
        });

        if (result && result.status === 1) {
          this.users = result.data.map((user) => ({
            id: user._id || null,
            first_name_kh: user.first_name_kh || '',
            last_name_kh: user.last_name_kh || '',
            first_name_en: user.first_name_en || '',
            last_name_en: user.last_name_en || '',
            username: user.username || '',
            email: user.email || '',
            role: user.role || { _id: null, name: 'N/A' },
            department: user.department || { _id: null, name_en: 'N/A' },
            phone_number: user.phone_number || '',
            gender: user.gender || 'N/A',
            dob: user.dob || null,
            status: user.status
          }));

          this.currentPage = result.pagination?.page || page;
          this.itemsPerPage = result.pagination?.limit || this.itemsPerPage;
          this.totalUsers = result.pagination?.total || this.users.length;
        } else {
          this.alert('Failed to load users. Invalid response format.', 'error');
          this.users = [];
          this.totalUsers = 0;
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        this.alert('Error fetching users: ' + error.message, 'error');
        this.users = [];
        this.totalUsers = 0;
      } finally {
        this.loading = false;
      }
    },

    // --- Other Methods (Roles, Departments, Modals, CRUD) ---

    async getAllRoles() {
      this.loading = true;
      try {
        const result = await getAllRole();
        let rolesData = [];
        if (result && result.status === 1 && Array.isArray(result.roles)) {
          rolesData = result.roles;
        } else if (
          result &&
          result.status === 1 &&
          Array.isArray(result.data)
        ) {
          rolesData = result.data;
        } else if (Array.isArray(result)) {
          rolesData = result;
        } else {
          throw new Error('Invalid roles data format');
        }
        this.roles = rolesData;
        if (this.roles.length === 0) {
          this.alert('No roles available.', 'error');
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        this.alert('Error fetching roles: ' + error.message, 'error');
      } finally {
        this.loading = false;
      }
    },
    async getAllDepartments() {
      this.loading = true;
      try {
        const result = await getAllDepartment();
        let departmentsData = [];
        if (
          result &&
          result.status === 1 &&
          Array.isArray(result.departments)
        ) {
          departmentsData = result.departments;
        } else if (
          result &&
          result.status === 1 &&
          Array.isArray(result.data)
        ) {
          departmentsData = result.data;
        } else if (Array.isArray(result)) {
          departmentsData = result;
        } else {
          throw new Error('Invalid department data format');
        }
        this.departments = departmentsData.map((dept) => ({
          _id: dept._id || null,
          name_en: dept.name_en || 'N/A',
          name_kh: dept.name_kh || '',
          description: dept.description || ''
        }));
        if (this.departments.length === 0) {
          this.alert('No departments available.', 'error');
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        this.alert(`Error fetching departments: ${error.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },
    async saveUser() {
      if (
        !this.form.first_name_kh ||
        !this.form.last_name_kh ||
        !this.form.first_name_en ||
        !this.form.last_name_en ||
        !this.form.username ||
        !this.form.email ||
        (!this.isEditing && !this.form.password) ||
        !this.form.role ||
        !this.form.department ||
        !this.form.phone_number ||
        !this.form.gender ||
        !this.form.dob
      ) {
        this.alert('Please fill in all required fields.', 'error');
        return;
      }
      this.loading = true;
      try {
        if (this.isEditing) {
          const { id, password, ...formData } = this.form;
          const updatePayload = password ? this.form : formData;

          const updatedUser = await updateUser(this.form.id, updatePayload);
          if (updatedUser && updatedUser.status === 1) {
            await this.getAllUsers(this.currentPage, this.searchQuery);
            this.alert('User updated successfully!');
          } else {
            this.alert('Failed to update user. Please try again.', 'error');
          }
        } else {
          const { id, ...formData } = this.form;
          const newUser = await createUser(formData);
          if (newUser && newUser.status === 1) {
            await this.getAllUsers(1, this.searchQuery);
            this.alert('User created successfully!');
          } else {
            this.alert('Failed to create user. Please try again.', 'error');
          }
        }
        this.closeCreateModal();
      } catch (error) {
        console.error('Error saving user:', error);
        this.alert('Error saving user: ' + error.message, 'error');
      } finally {
        this.loading = false;
      }
    },
    confirmDelete(id) {
      if (!id) {
        this.alert('Invalid user ID.', 'error');
        return;
      }
      this.userToDeleteId = id;
      this.showDeleteModal = true;
    },
    async deleteUser() {
      if (!this.userToDeleteId) {
        this.alert('No user selected for deletion.', 'error');
        return;
      }
      this.loading = true;
      try {
        const result = await deleteUser(this.userToDeleteId);
        if (result && [1, 204].includes(result.status)) {
          await this.getAllUsers(this.currentPage, this.searchQuery);
          this.alert('User deleted successfully!');
        } else {
          this.alert(
            `Failed to delete user. Status: ${result?.status || 'unknown'}`,
            'error'
          );
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        this.alert('Error deleting user: ' + error.message, 'error');
      } finally {
        this.loading = false;
        this.closeDeleteModal();
      }
    },

    // Server-side filter/search trigger
    filterData() {
      this.goToPage(1);
    },
    // Server-side filter/search reset
    resetFilters() {
      this.searchQuery = '';
      this.goToPage(1);
    },

    openCreateModal() {
      if (this.roles.length === 0 || this.departments.length === 0) {
        this.alert('Please wait for roles and departments to load.', 'error');
        return;
      }
      this.isEditing = false;
      this.form = {
        id: null,
        first_name_kh: '',
        last_name_kh: '',
        first_name_en: '',
        last_name_en: '',
        username: '',
        email: '',
        password: '',
        role: '',
        department: '',
        phone_number: '',
        gender: 'Male',
        dob: '',
        status: 'Active'
      };
      this.showCreateModal = true;
    },
    openEditModal(user) {
      if (!user.id) {
        this.alert('Invalid user ID.', 'error');
        return;
      }
      if (this.roles.length === 0 || this.departments.length === 0) {
        this.alert('Please wait for roles and departments to load.', 'error');
        return;
      }
      this.isEditing = true;
      this.form = {
        id: user.id,
        first_name_kh: user.first_name_kh || '',
        last_name_kh: user.last_name_kh || '',
        first_name_en: user.first_name_en || '',
        last_name_en: user.last_name_en || '',
        username: user.username || '',
        email: user.email || '',
        password: '',
        role: user.role?._id || '',
        department: user.department?._id || '',
        phone_number: user.phone_number || '',
        gender: user.gender || 'Male',
        dob: user.dob ? user.dob.split('T')[0] : '',
        status: user.status || 'Active'
      };
      this.showCreateModal = true;
    },
    openViewModal(user) {
      if (!user.id) {
        this.alert('Invalid user ID.', 'error');
        return;
      }
      this.selectedUser = { ...user };
      this.showViewModal = true;
    },
    closeCreateModal() {
      this.showCreateModal = false;
      this.isEditing = false;
      this.form = {
        id: null,
        first_name_kh: '',
        last_name_kh: '',
        first_name_en: '',
        last_name_en: '',
        username: '',
        email: '',
        password: '',
        role: '',
        department: '',
        phone_number: '',
        gender: 'Male',
        dob: '',
        status: 'Active'
      };
    },

    async toggleStatus(user) {
      const user_info = user;
      console.log(user_info)
      const newStatus = user_info.status === 'Active' ? 'Inactive' : 'Active';
      const payload = {
        user_id: user_info.id,
        status: newStatus
      }
      try {
        const res = await updateStatus(payload);
        if (res.status === 1) {
          this.getAllUsers(this.currentPage, this.searchQuery);
          this.alert(`Status updated to ${newStatus}`);
        }
      } catch (err) {
        console.error(err);
        this.alert('Failed to update status', 'error');
      }
    },

    closeViewModal() {
      this.showViewModal = false;
      this.selectedUser = null;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.userToDeleteId = null;
    },
    // Server-side navigation method
    prevPage() {
      this.goToPage(this.currentPage - 1);
    },
    // Server-side navigation method
    nextPage() {
  if (this.currentPage < this.totalPages) {
    this.goToPage(this.currentPage + 1);
  }
},
    // ⚠️ Central navigation method to fetch new data, passing the current search query
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.getAllUsers(page, this.searchQuery);
      }
    }
  },
  async mounted() {
    this.loading = true;
    try {
      await Promise.all([
        this.getAllRoles(),
        this.getAllDepartments(),
        this.getAllUsers(1, this.searchQuery)
      ]);
    } catch (error) {
      console.error('Error during initial data fetch:', error);
      this.alert('Failed to load initial data: ' + error.message, 'error');
    } finally {
      this.loading = false;
    }
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.showCreateModal) this.closeCreateModal();
        if (this.showViewModal) this.closeViewModal();
        if (this.showDeleteModal) this.closeDeleteModal();
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

.max-h-\[80vh\] {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}

.max-h-\[80vh\]::-webkit-scrollbar {
  width: 8px;
}

.max-h-\[80vh\]::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.max-h-\[80vh\]::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.max-h-\[80vh\]::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
