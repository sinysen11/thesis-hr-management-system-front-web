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
      <h2 class="text-3xl font-extrabold text-gray-900">Departments</h2>
      <button @click="openCreateModal" :disabled="loading"
        class="px-6 py-2 font-medium text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
        Create Department
      </button>
    </div>

    <!-- Filter Section -->
    <div class="p-6 mb-8 bg-white rounded-lg shadow-sm">
      <div class="flex flex-col items-end gap-4 sm:flex-row">
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700">
            Search Departments
          </label>
          <input type="text" v-model="searchQuery"
            class="border border-gray-300 rounded-lg px-4 py-2 w-[300px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Search by name or description" />
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
              <th class="px-4 py-3 text-left">Description</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr v-for="(department, index) in paginatedDepartments" :key="department.id"
              class="transition border-b border-gray-200 hover:bg-gray-50">
              <td class="px-4 py-3">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-4 py-3">{{ department.name_kh }}</td>
              <td class="px-4 py-3">{{ department.name_en }}</td>
              <td class="px-4 py-3">{{ department.description }}</td>
              <td class="flex gap-2 px-4 py-3">
                <button @click="openViewModal(department)"
                  class="p-2 text-indigo-600 transition rounded-full hover:text-indigo-800 hover:bg-indigo-100"
                  title="View Department">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="openEditModal(department)" :disabled="loading"
                  class="p-2 text-indigo-600 transition rounded-full hover:text-indigo-800 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Edit Department">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="confirmDelete(department.id)" :disabled="loading"
                  class="p-2 text-red-600 transition rounded-full hover:text-red-800 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete Department">
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
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
        {{ Math.min(currentPage * itemsPerPage, filteredDepartments.length) }}
        of {{ filteredDepartments.length }} departments
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

    <!-- Modal for View Department -->
    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showViewModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60" @click.self="closeViewModal">
        <div
          class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all max-h-[80vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900">Department Details</h3>
            <button @click="closeViewModal"
              class="p-2 text-gray-500 transition rounded-full hover:text-gray-700 hover:bg-gray-100" title="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div v-if="selectedDepartment" class="pt-5 space-y-5 border-t border-gray-200">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="text-sm font-semibold text-gray-600">Name (KH)</label>
                <p class="font-medium text-gray-900">{{ selectedDepartment.name_kh }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Name (EN)</label>
                <p class="font-medium text-gray-900">{{ selectedDepartment.name_en || 'N/A' }}</p>
              </div>
              <div class="sm:col-span-2">
                <label class="text-sm font-semibold text-gray-600">Description</label>
                <p class="font-medium text-gray-900">{{ selectedDepartment.description }}</p>
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

    <!-- Modal for Create/Update Department -->
    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showCreateModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60" @click.self="closeCreateModal">
        <div
          class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all max-h-[80vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900">
              {{ isEditing ? 'Edit Department' : 'Create Department' }}
            </h3>
            <button @click="closeCreateModal"
              class="p-2 text-gray-500 transition rounded-full hover:text-gray-700 hover:bg-gray-100" title="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="pt-5 space-y-5 border-t border-gray-200">
            <div>
              <label class="text-sm font-semibold text-gray-600">Name (KH)</label>
              <input v-model="form.name_kh" type="text"
                class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter department name in Khmer" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Name (EN)</label>
              <input v-model="form.name_en" type="text"
                class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter department name in English (optional)" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Description</label>
              <textarea v-model="form.description"
                class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter department description" rows="3"></textarea>
            </div>
          </div>
          <div class="flex justify-end gap-4 mt-8">
            <button @click="closeCreateModal"
              class="px-6 py-2 font-medium text-gray-800 transition duration-200 bg-gray-200 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
            <button @click="saveDepartment" :disabled="loading"
              class="px-6 py-2 font-medium text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isEditing ? 'Update' : 'Create' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal for Delete Confirmation -->
    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showDeleteModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60" @click.self="closeDeleteModal">
        <div class="w-full max-w-md p-8 mx-4 transition-all transform bg-white shadow-2xl rounded-xl">
          <div class="text-center">
            <i class="mb-4 text-5xl text-red-500 fas fa-exclamation-triangle"></i>
            <h3 class="mb-2 text-2xl font-bold text-gray-900">Confirm Deletion</h3>
            <p class="text-gray-600">Are you sure you want to delete this department? This action cannot be undone.</p>
          </div>
          <div class="flex justify-center gap-4 mt-8">
            <button @click="closeDeleteModal"
              class="px-6 py-2 font-medium text-gray-800 transition duration-200 bg-gray-200 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
            <button @click="deleteDepartmentConfirmed" :disabled="loading"
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
import { getAllDepartment, getOneDepartment, createDepartment, updateDepartment, deleteDepartment } from '@/apis/department';

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
      selectedDepartment: null,
      departmentToDeleteId: null,
      form: {
        id: null,
        name_kh: '',
        name_en: '',
        description: ''
      },
      departments: [],
      loading: true,
      successMessage: '',
      errorMessage: ''
    };
  },
  computed: {
    filteredDepartments() {
      if (!Array.isArray(this.departments)) {
        return [];
      }
      const query = this.searchQuery.toLowerCase();
      return this.departments.filter((department) => {
        return (
          this.searchQuery === '' ||
          (department.name_kh && department.name_kh.toLowerCase().includes(query)) ||
          (department.name_en && department.name_en.toLowerCase().includes(query)) ||
          (department.description && department.description.toLowerCase().includes(query))
        );
      });
    },
    paginatedDepartments() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredDepartments.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredDepartments.length / this.itemsPerPage) || 1;
    }
  },
  methods: {
    // Unified alert system
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

    // Fetch all departments
    async fetchDepartments() {
      this.loading = true;
      try {
        const response = await getAllDepartment();
        console.log('getAllDepartment response:', response);
        // Check if response has status: 1 and departments array
        if (response && response.status === 1 && Array.isArray(response.departments)) {
          this.departments = response.departments.map(dept => ({
            id: dept._id,
            name_kh: dept.name_kh,
            name_en: dept.name_en,
            description: dept.description
          }));
        } else {
          console.error('Invalid response format:', {
            status: response?.status,
            departments: response?.departments
          });
          this.alert('Failed to load departments. Invalid response format.', 'error');
          this.departments = [];
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        this.alert('Error fetching departments: ' + error.message, 'error');
        this.departments = [];
      } finally {
        this.loading = false;
      }
    },

    // Save (Create/Update) Department
    async saveDepartment() {
      if (!this.form.name_kh || !this.form.description) {
        this.alert('Please fill in all required fields (Name (KH) and Description).', 'error');
        return;
      }
      this.loading = true;
      try {
        if (this.isEditing) {
          const { id, ...formData } = this.form;
          const updatedDept = await updateDepartment(this.form.id, formData);
          if (updatedDept && updatedDept.status === 200) {
            await this.fetchDepartments();
            this.alert('Department updated successfully!');
          } else {
            this.alert('Failed to update department. Please try again.', 'error');
          }
        } else {
          const { id, ...formData } = this.form;
          const newDept = await createDepartment(formData);
          if (newDept && newDept.status === 201) {
            await this.fetchDepartments();
            this.alert('Department created successfully!');
          } else {
            this.alert('Failed to create department. Please try again.', 'error');
          }
        }
        this.closeCreateModal();
      } catch (error) {
        console.error('Error saving department:', error);
        this.alert('Error saving department: ' + error.message, 'error');
      } finally {
        this.loading = false;
      }
    },

    // Open delete confirmation modal
    confirmDelete(id) {
      if (!id) {
        this.alert('Invalid department ID.', 'error');
        return;
      }
      this.departmentToDeleteId = id;
      this.showDeleteModal = true;
    },

    // Execute delete after confirmation
    async deleteDepartmentConfirmed() {
      if (!this.departmentToDeleteId) {
        this.alert('No department selected for deletion.', 'error');
        return;
      }
      this.loading = true;
      try {
        const result = await deleteDepartment(this.departmentToDeleteId);
        if (result && [200, 204].includes(result.status)) {
          await this.fetchDepartments();
          this.alert('Department deleted successfully!');
        } else {
          this.alert(`Failed to delete department. Status: ${result?.status || 'unknown'}`, 'error');
        }
      } catch (error) {
        console.error('Error deleting department:', error);
        this.alert('Error deleting department: ' + error.message, 'error');
      } finally {
        this.loading = false;
        this.closeDeleteModal();
      }
    },

    // Filter and Reset
    filterData() {
      this.currentPage = 1;
    },
    resetFilters() {
      this.searchQuery = '';
      this.currentPage = 1;
    },

    // Modal Handlers
    openCreateModal() {
      this.isEditing = false;
      this.form = {
        id: null,
        name_kh: '',
        name_en: '',
        description: ''
      };
      this.showCreateModal = true;
    },
    async openEditModal(department) {
      if (!department.id) {
        this.alert('Invalid department ID.', 'error');
        return;
      }
      this.loading = true;
      try {
        const result = await getOneDepartment(department.id);
        // Check for HTTP 200 + API success + department object
        if (
          result.status === 1
        ) {
          const dept = result.department;
          this.isEditing = true;
          this.form = {
            id: dept._id,
            name_kh: dept.name_kh || '',
            name_en: dept.name_en || '',
            description: dept.description || ''
          };
          this.showCreateModal = true;
        } else {
          this.alert('Failed to fetch department for editing. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Error fetching department for edit:', error);
        this.alert('Error fetching department for editing: ' + error.message, 'error');
      } finally {
        this.loading = false;
      }
    },
    async openViewModal(department) {
      if (!department.id) {
        this.alert('Invalid department ID.', 'error');
        return;
      }
      this.loading = true;
      try {
        const result = await getOneDepartment(department.id);
        if (
          result.status === 1
        ) {
          const dept = result.department;
          this.selectedDepartment = {
            id: dept._id,
            name_kh: dept.name_kh || '',
            name_en: dept.name_en || '',
            description: dept.description || ''
          };
          this.showViewModal = true;
        } else {
          this.alert('Failed to fetch department for viewing. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Error fetching department for view:', error);
        this.alert('Error fetching department for viewing: ' + error.message, 'error');
      } finally {
        this.loading = false;
      }
    },
    closeCreateModal() {
      this.showCreateModal = false;
      this.isEditing = false;
      this.form = {
        id: null,
        name_kh: '',
        name_en: '',
        description: ''
      };
    },
    closeViewModal() {
      this.showViewModal = false;
      this.selectedDepartment = null;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.departmentToDeleteId = null;
    },

    // Pagination Handlers
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
    this.fetchDepartments();
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

/* Custom scrollbar for modals */
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