<template>
  <div class="w-full">
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
      <h2 class="text-3xl font-extrabold text-gray-900">Roles</h2>
      <button @click="openCreateModal" :disabled="loading"
        class="px-6 py-2 font-medium text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
        Create Role
      </button>
    </div>

    <div class="p-6 mb-8 bg-white rounded-lg shadow-sm">
      <div class="flex flex-col items-end gap-4 sm:flex-row">
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700">
            Search Roles
          </label>
          <input type="text" v-model="searchQuery"
            class="border border-gray-300 rounded-lg px-4 py-2 w-[300px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Search by name" />
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

    <div class="overflow-hidden bg-white rounded-lg shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm table-auto">
          <thead class="text-xs font-semibold text-gray-600 uppercase bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-left">No</th>
              <th class="px-4 py-3 text-left">Name</th>
              <th class="px-4 py-3 text-left">Permissions</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr v-for="(role, index) in paginatedRoles" :key="role.id"
              class="transition border-b border-gray-200 hover:bg-gray-50">
              <td class="px-4 py-3">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-4 py-3">{{ role.name }}</td>
              <td class="px-4 py-3">
                {{ role.permissions.map(p => permissionLabels[p] || p).join(', ') }}
              </td>
              <td class="flex gap-2 px-4 py-3">
                <button @click="openViewModal(role)"
                  class="p-2 text-indigo-600 transition rounded-full hover:text-indigo-800 hover:bg-indigo-100"
                  title="View Role">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="openEditModal(role)" :disabled="loading"
                  class="p-2 text-indigo-600 transition rounded-full hover:text-indigo-800 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Edit Role">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="confirmDelete(role.id)" :disabled="loading"
                  class="p-2 text-red-600 transition rounded-full hover:text-red-800 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete Role">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="flex items-center justify-between mt-6">
      <div class="text-sm text-gray-600">
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
        {{ Math.min(currentPage * itemsPerPage, filteredRoles.length) }}
        of {{ filteredRoles.length }} roles
      </div>
      <div class="flex gap-2">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="px-4 py-2 text-gray-800 transition duration-200 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300">
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
          class="px-4 py-2 text-gray-800 transition duration-200 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300">
          Next
        </button>
      </div>
    </div>

    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showViewModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60" @click.self="closeViewModal">
        <div class="w-full max-w-lg p-8 mx-4 transition-all transform bg-white shadow-2xl rounded-xl">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900">Role Details</h3>
            <button @click="closeViewModal"
              class="p-2 text-gray-500 transition rounded-full hover:text-gray-700 hover:bg-gray-100" title="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div v-if="selectedRole" class="pt-5 space-y-5 border-t border-gray-200">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="text-sm font-semibold text-gray-600">Name</label>
                <p class="font-medium text-gray-900">{{ selectedRole.name }}</p>
              </div>
              <div class="sm:col-span-2">
                <label class="text-sm font-semibold text-gray-600">Permissions</label>
                <p class="font-medium text-gray-900">
                  {{ selectedRole.permissions.map(p => permissionLabels[p] || p).join(', ') }}
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

    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showCreateModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60" @click.self="closeCreateModal">
        <div class="w-full max-w-lg p-8 mx-4 transition-all transform bg-white shadow-2xl rounded-xl">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900">
              {{ isEditing ? 'Edit Role' : 'Create Role' }}
            </h3>
            <button @click="closeCreateModal"
              class="p-2 text-gray-500 transition rounded-full hover:text-gray-700 hover:bg-gray-100" title="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="pt-5 space-y-5 border-t border-gray-200">
            <div>
              <label class="text-sm font-semibold text-gray-600">Name</label>
              <input v-model="form.name" type="text"
                class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter name" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Permissions</label>
              <div class="grid grid-cols-2 gap-4 mt-2">
                <div v-for="perm in availablePermissions" :key="perm" class="flex items-center">
                  <input type="checkbox" :id="`perm-${perm}`" :value="perm" v-model="form.permissions"
                    class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                  <label :for="`perm-${perm}`" class="ml-2 text-sm text-gray-700">{{ permissionLabels[perm] }}</label>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-4 mt-8">
            <button @click="closeCreateModal"
              class="px-6 py-2 font-medium text-gray-800 transition duration-200 bg-gray-200 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
            <button @click="saveRole" :disabled="loading"
              class="px-6 py-2 font-medium text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isEditing ? 'Update' : 'Create' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showDeleteModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60" @click.self="closeDeleteModal">
        <div class="w-full max-w-md p-8 mx-4 transition-all transform bg-white shadow-2xl rounded-xl">
          <div class="text-center">
            <i class="mb-4 text-5xl text-red-500 fas fa-exclamation-triangle"></i>
            <h3 class="mb-2 text-2xl font-bold text-gray-900">Confirm Deletion</h3>
            <p class="text-gray-600">Are you sure you want to delete this role? This action cannot be undone.</p>
          </div>
          <div class="flex justify-center gap-4 mt-8">
            <button @click="closeDeleteModal"
              class="px-6 py-2 font-medium text-gray-800 transition duration-200 bg-gray-200 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
            <button @click="deleteRole" :disabled="loading"
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
import { getAllRole, createRole, updateRole, deleteRole } from '@/apis/role';

export default {
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,
      showCreateModal: false,
      showViewModal: false,
      showDeleteModal: false,
      isEditing: false,
      selectedRole: null,
      roleToDeleteId: null,
      form: {
        name: '',
        permissions: []
      },
      roles: [],
      availablePermissions: [
        'APPLICANTS',
        'JOBS',
        'REQUEST_LEAVE',
        'LEAVE_REPORT',
        'SETTING'
      ],
      // New object to map permission codes to human-readable names
      permissionLabels: {
        'APPLICANTS': 'Applicants',
        'JOBS': 'Jobs',
        'REQUEST_LEAVE': 'Request Leave',
        'LEAVE_REPORT': 'Leave Report',
        'SETTING': 'Setting'
      },
      loading: true,
      successMessage: '',
      errorMessage: ''
    };
  },
  computed: {
    filteredRoles() {
      if (!Array.isArray(this.roles)) {
        return [];
      }
      return this.roles.filter((role) => {
        const matchSearch =
          this.searchQuery === '' ||
          (role.name && role.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
        return matchSearch;
      });
    },
    paginatedRoles() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredRoles.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredRoles.length / this.itemsPerPage) || 1;
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
    async fetchRoles() {
      this.loading = true;
      try {
        const response = await getAllRole();
        if (response && response.status === 1 && Array.isArray(response.roles)) {
          this.roles = response.roles.map(role => ({
            ...role,
            id: role._id
          }));
        } else {
          this.alert('Failed to fetch roles. Invalid response format.', 'error');
          this.roles = [];
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        this.alert('Error fetching roles: ' + error.message, 'error');
        this.roles = [];
      } finally {
        this.loading = false;
      }
    },
    async saveRole() {
      if (!this.form.name || this.form.permissions.length === 0) {
        this.alert('Please fill in all required fields (Name and Permissions).', 'error');
        return;
      }
      this.loading = true;
      try {
        if (this.isEditing) {
          const updatedRole = await updateRole(this.form.id, {
            name: this.form.name,
            permissions: this.form.permissions
          });
          if (updatedRole && updatedRole.status === 200) {
            await this.fetchRoles();
            this.alert('Role updated successfully!');
          } else {
            this.alert('Failed to update role. Please try again.', 'error');
          }
        } else {
          const newRole = await createRole({
            name: this.form.name,
            permissions: this.form.permissions
          });
          if (newRole && newRole.status === 201) {
            await this.fetchRoles();
            this.alert('Role created successfully!');
          } else {
            this.alert('Failed to create role. Please try again.', 'error');
          }
        }
        this.closeCreateModal();
      } catch (error) {
        console.error('Error saving role:', error);
        this.alert('Error saving role: ' + error.message, 'error');
      } finally {
        this.loading = false;
      }
    },
    async deleteRole() {
      if (!this.roleToDeleteId) {
        this.alert('No role selected for deletion.', 'error');
        return;
      }
      this.loading = true;
      try {
        const result = await deleteRole(this.roleToDeleteId);
        if (result && [200, 204].includes(result.status)) {
          await this.fetchRoles();
          this.alert('Role deleted successfully!');
        } else {
          this.alert(`Failed to delete role. Status: ${result?.status || 'unknown'}`, 'error');
        }
      } catch (error) {
        console.error('Error deleting role:', error);
        this.alert('Error deleting role: ' + error.message, 'error');
      } finally {
        this.loading = false;
        this.closeDeleteModal();
      }
    },
    confirmDelete(id) {
      if (!id) {
        this.alert('Invalid role ID.', 'error');
        return;
      }
      this.roleToDeleteId = id;
      this.showDeleteModal = true;
    },
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
        name: '',
        permissions: []
      };
      this.showCreateModal = true;
    },
    openEditModal(role) {
      if (!role.id) {
        this.alert('Invalid role ID.', 'error');
        return;
      }
      this.isEditing = true;
      this.form = {
        ...role,
        permissions: [...role.permissions]
      };
      this.showCreateModal = true;
    },
    openViewModal(role) {
      if (!role.id) {
        this.alert('Invalid role ID.', 'error');
        return;
      }
      this.selectedRole = { ...role };
      this.showViewModal = true;
    },
    closeCreateModal() {
      this.showCreateModal = false;
      this.isEditing = false;
      this.form = {
        name: '',
        permissions: []
      };
    },
    closeViewModal() {
      this.showViewModal = false;
      this.selectedRole = null;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.roleToDeleteId = null;
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
    this.fetchRoles();
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
</style>