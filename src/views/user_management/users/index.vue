<template>
  <!-- <div class="min-h-screen bg-gray-900 flex flex-col"> -->
  <div class="w-full">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-extrabold text-gray-900">User Management</h2>
      <button
        @click="openCreateModal"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
      >
        Create User
      </button>
    </div>

    <!-- Filter Section -->
    <div class="bg-white shadow-sm rounded-lg p-6 mb-8">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <label class="text-sm font-medium text-gray-700 mb-2"
            >Search Users</label
          >
          <input
            type="text"
            v-model="searchQuery"
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Search by username, email, or ID"
          />
        </div>
        <div class="flex items-end gap-4">
          <button
            @click="filterData"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
          >
            Search
          </button>
          <button
            @click="resetFilters"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition duration-200"
          >
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white shadow-sm rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto text-sm">
          <thead
            class="bg-gray-100 text-gray-600 uppercase text-xs font-semibold"
          >
            <tr>
              <th class="px-4 py-3 text-left">No</th>
              <th class="px-4 py-3 text-left">User ID</th>
              <th class="px-4 py-3 text-left">Username</th>
              <th class="px-4 py-3 text-left">Email</th>
              <th class="px-4 py-3 text-left">Role ID</th>
              <th class="px-4 py-3 text-left">Employee ID</th>
              <th class="px-4 py-3 text-left">Status</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr
              v-for="(user, index) in paginatedUsers"
              :key="user.id"
              class="hover:bg-gray-900 transition border-b border-gray-200"
            >
              <td class="px-4 py-3">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-4 py-3">{{ user.userId }}</td>
              <td class="px-4 py-3">{{ user.username }}</td>
              <td class="px-4 py-3">{{ user.email }}</td>
              <td class="px-4 py-3">{{ user.roleId }}</td>
              <td class="px-4 py-3">{{ user.employeeId }}</td>
              <td class="px-4 py-3">
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    user.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ user.status }}
                </span>
              </td>
              <td class="px-4 py-3 flex gap-2">
                <button
                  @click="openViewModal(user)"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                  title="View User"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button
                  @click="openEditModal(user)"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                  title="Edit User"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="deleteUser(user.id)"
                  class="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition"
                  title="Delete User"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="mt-6 flex justify-between items-center">
      <div class="text-sm text-gray-600">
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
        {{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }}
        of {{ filteredUsers.length }} users
      </div>
      <div class="flex gap-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition duration-200"
        >
          Previous
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'px-4 py-2 rounded-lg transition duration-200',
            currentPage === page
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          ]"
        >
          {{ page }}
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition duration-200"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Modal for View User -->
    <transition name="modal">
      <div
        v-if="showViewModal"
        class="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50"
        @click.self="closeViewModal"
      >
        <div
          class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all"
        >
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900">User Details</h3>
            <button
              @click="closeViewModal"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
              title="Close"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div
            v-if="selectedUser"
            class="space-y-5 border-t border-gray-200 pt-5"
          >
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="text-sm font-semibold text-gray-600"
                  >User ID</label
                >
                <p class="text-gray-900 font-medium">
                  {{ selectedUser.userId }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600"
                  >Username</label
                >
                <p class="text-gray-900 font-medium">
                  {{ selectedUser.username }}
                </p>
              </div>
              <div class="sm:col-span-2">
                <label class="text-sm font-semibold text-gray-600">Email</label>
                <p class="text-gray-900 font-medium">
                  {{ selectedUser.email }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600"
                  >Role ID</label
                >
                <p class="text-gray-900 font-medium">
                  {{ selectedUser.roleId }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600"
                  >Employee ID</label
                >
                <p class="text-gray-900 font-medium">
                  {{ selectedUser.employeeId }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600"
                  >Status</label
                >
                <p
                  :class="[
                    'text-sm font-medium',
                    selectedUser.status === 'Active'
                      ? 'text-green-800'
                      : 'text-red-800'
                  ]"
                >
                  {{ selectedUser.status }}
                </p>
              </div>
            </div>
          </div>
          <div class="mt-8 flex justify-end">
            <button
              @click="closeViewModal"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal for Create/Update User -->
    <transition name="modal">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50"
        @click.self="closeCreateModal"
      >
        <div
          class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all"
        >
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900">
              {{ isEditing ? 'Edit User' : 'Create User' }}
            </h3>
            <button
              @click="closeCreateModal"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
              title="Close"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="space-y-5 border-t border-gray-200 pt-5">
            <div>
              <label class="text-sm font-semibold text-gray-600">User ID</label>
              <input
                v-model.number="form.userId"
                type="number"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter user ID"
              />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600"
                >Username</label
              >
              <input
                v-model="form.username"
                type="text"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Role ID</label>
              <input
                v-model.number="form.roleId"
                type="number"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter role ID"
              />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600"
                >Employee ID</label
              >
              <input
                v-model.number="form.employeeId"
                type="number"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter employee ID"
              />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Status</label>
              <select
                v-model="form.status"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div class="mt-8 flex justify-end gap-4">
            <button
              @click="closeCreateModal"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition duration-200"
            >
              Cancel
            </button>
            <button
              @click="saveUser"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
            >
              {{ isEditing ? 'Update' : 'Create' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
  <!-- </div> -->
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

export default {
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,
      showCreateModal: false,
      showViewModal: false,
      isEditing: false,
      selectedUser: null,
      form: {
        id: null,
        userId: null,
        username: '',
        email: '',
        roleId: null,
        employeeId: null,
        status: 'Active'
      },
      users: [
        {
          id: uuidv4(),
          userId: 2001,
          username: 'jdoe',
          email: 'john.doe@example.com',
          roleId: 1,
          employeeId: 1001,
          status: 'Active'
        },
        {
          id: uuidv4(),
          userId: 2002,
          username: 'jsmith',
          email: 'jane.smith@example.com',
          roleId: 2,
          employeeId: 1002,
          status: 'Active'
        },
        {
          id: uuidv4(),
          userId: 2003,
          username: 'ajohnson',
          email: 'alex.j@example.com',
          roleId: 3,
          employeeId: 1003,
          status: 'Inactive'
        },
        {
          id: uuidv4(),
          userId: 2004,
          username: 'ebrown',
          email: 'emily.b@example.com',
          roleId: 4,
          employeeId: 1004,
          status: 'Active'
        }
      ]
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter((user) => {
        const matchSearch =
          this.searchQuery === '' ||
          user.userId.toString().includes(this.searchQuery) ||
          user.username
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchQuery.toLowerCase());
        return matchSearch;
      });
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredUsers.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    }
  },
  methods: {
    filterData() {
      this.currentPage = 1;
    },
    resetFilters() {
      this.searchQuery = '';
      this.currentPage = 1;
    },
    openCreateModal() {
      this.isEditing = false;
      this.form = {
        id: null,
        userId: null,
        username: '',
        email: '',
        roleId: null,
        employeeId: null,
        status: 'Active'
      };
      this.showCreateModal = true;
    },
    openEditModal(user) {
      this.isEditing = true;
      this.form = { ...user };
      this.showCreateModal = true;
    },
    openViewModal(user) {
      this.selectedUser = { ...user };
      this.showViewModal = true;
    },
    closeCreateModal() {
      this.showCreateModal = false;
      this.isEditing = false;
      this.form = {
        id: null,
        userId: null,
        username: '',
        email: '',
        roleId: null,
        employeeId: null,
        status: 'Active'
      };
    },
    closeViewModal() {
      this.showViewModal = false;
      this.selectedUser = null;
    },
    saveUser() {
      if (
        !this.form.userId ||
        !this.form.username ||
        !this.form.email ||
        !this.form.roleId ||
        !this.form.employeeId
      ) {
        alert(
          'Please fill in all required fields (User ID, Username, Email, Role ID, Employee ID).'
        );
        return;
      }
      if (this.isEditing) {
        const index = this.users.findIndex((user) => user.id === this.form.id);
        if (index !== -1) {
          this.users[index] = { ...this.form };
        }
      } else {
        this.users.push({
          ...this.form,
          id: uuidv4()
        });
      }
      this.closeCreateModal();
    },
    deleteUser(id) {
      if (confirm('Are you sure you want to delete this user?')) {
        this.users = this.users.filter((user) => user.id !== id);
      }
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    goToPage(page) {
      this.currentPage = page;
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
</style>
