<template>
  <!-- <div class="min-h-screen bg-gray-900 flex flex-col"> -->
  <div class="w-full">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-extrabold text-gray-900">Roles</h2>
      <button
        @click="openCreateModal"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
      >
        Create Role
      </button>
    </div>

    <!-- Filter Section -->
    <div class="bg-white shadow-sm rounded-lg p-6 mb-8">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <label class="text-sm font-medium text-gray-700 mb-2"
            >Search Roles</label
          >
          <input
            type="text"
            v-model="searchQuery"
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Search by name or ID"
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
              <th class="px-4 py-3 text-left">ID</th>
              <th class="px-4 py-3 text-left">Name</th>
              <th class="px-4 py-3 text-left">Description</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr
              v-for="(role, index) in paginatedRoles"
              :key="role.id"
              class="hover:bg-gray-900 transition border-b border-gray-200"
            >
              <td class="px-4 py-3">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-4 py-3">{{ role.id }}</td>
              <td class="px-4 py-3">{{ role.name }}</td>
              <td class="px-4 py-3">{{ role.description }}</td>
              <td class="px-4 py-3 flex gap-2">
                <button
                  @click="openViewModal(role)"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                  title="View Role"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button
                  @click="openEditModal(role)"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                  title="Edit Role"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="deleteRole(role.id)"
                  class="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition"
                  title="Delete Role"
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
        {{ Math.min(currentPage * itemsPerPage, filteredRoles.length) }}
        of {{ filteredRoles.length }} roles
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

    <!-- Modal for View Role -->
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
            <h3 class="text-2xl font-bold text-gray-900">Role Details</h3>
            <button
              @click="closeViewModal"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
              title="Close"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div
            v-if="selectedRole"
            class="space-y-5 border-t border-gray-200 pt-5"
          >
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="text-sm font-semibold text-gray-600">ID</label>
                <p class="text-gray-900 font-medium">{{ selectedRole.id }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Name</label>
                <p class="text-gray-900 font-medium">
                  {{ selectedRole.name }}
                </p>
              </div>
              <div class="sm:col-span-2">
                <label class="text-sm font-semibold text-gray-600"
                  >Description</label
                >
                <p class="text-gray-900 font-medium">
                  {{ selectedRole.description }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600"
                  >Employee ID</label
                >
                <p class="text-gray-900 font-medium">
                  {{ selectedRole.employeeId }}
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

    <!-- Modal for Create/Update Role -->
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
              {{ isEditing ? 'Edit Role' : 'Create Role' }}
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
              <label class="text-sm font-semibold text-gray-600">ID</label>
              <input
                v-model.number="form.id"
                type="number"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter ID"
              />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Name</label>
              <input
                v-model="form.name"
                type="text"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600"
                >Description</label
              >
              <input
                v-model="form.description"
                type="text"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter description"
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
          </div>
          <div class="mt-8 flex justify-end gap-4">
            <button
              @click="closeCreateModal"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition duration-200"
            >
              Cancel
            </button>
            <button
              @click="saveRole"
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
      selectedRole: null,
      form: {
        id: null,
        name: '',
        description: '',
        employeeId: null
      },
      roles: [
        {
          id: uuidv4(),
          name: 'Admin',
          description: 'Manages system settings',
          employeeId: 1001
        },
        {
          id: uuidv4(),
          name: 'Manager',
          description: 'Oversees department operations',
          employeeId: 1002
        },
        {
          id: uuidv4(),
          name: 'Employee',
          description: 'Performs regular tasks',
          employeeId: 1003
        },
        {
          id: uuidv4(),
          name: 'HR',
          description: 'Handles human resources',
          employeeId: 1004
        }
      ]
    };
  },
  computed: {
    filteredRoles() {
      return this.roles.filter((role) => {
        const matchSearch =
          this.searchQuery === '' ||
          role.id.toString().includes(this.searchQuery) ||
          role.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        return matchSearch;
      });
    },
    paginatedRoles() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredRoles.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredRoles.length / this.itemsPerPage);
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
        name: '',
        description: '',
        employeeId: null
      };
      this.showCreateModal = true;
    },
    openEditModal(role) {
      this.isEditing = true;
      this.form = { ...role };
      this.showCreateModal = true;
    },
    openViewModal(role) {
      this.selectedRole = { ...role };
      this.showViewModal = true;
    },
    closeCreateModal() {
      this.showCreateModal = false;
      this.isEditing = false;
      this.form = {
        id: null,
        name: '',
        description: '',
        employeeId: null
      };
    },
    closeViewModal() {
      this.showViewModal = false;
      this.selectedRole = null;
    },
    saveRole() {
      if (!this.form.id || !this.form.name || !this.form.employeeId) {
        alert('Please fill in all required fields (ID, Name, Employee ID).');
        return;
      }
      if (this.isEditing) {
        const index = this.roles.findIndex((role) => role.id === this.form.id);
        if (index !== -1) {
          this.roles[index] = { ...this.form };
        }
      } else {
        this.roles.push({
          ...this.form,
          id: uuidv4()
        });
      }
      this.closeCreateModal();
    },
    deleteRole(id) {
      if (confirm('Are you sure you want to delete this role?')) {
        this.roles = this.roles.filter((role) => role.id !== id);
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
