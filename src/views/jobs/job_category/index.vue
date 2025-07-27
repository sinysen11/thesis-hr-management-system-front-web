<template>
  <!-- <div class="min-h-screen bg-gray-50 flex flex-col"> -->
  <div class="w-full">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-extrabold text-gray-900">Job Categories</h2>
      <button @click="openCreateModal"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200">
        Create Job Category
      </button>
    </div>
    <!-- Filter Section -->
    <div class="bg-white shadow-sm rounded-lg p-6 mb-8">
      <div class="flex flex-col sm:flex-row items-end gap-4">
        <!-- Search Input (not full width) -->
        <div>
          <label class="text-sm font-medium text-gray-700 mb-2 block">
            Search Job Categories
          </label>
          <input type="text" v-model="searchQuery"
            class="border border-gray-300 rounded-lg px-4 py-2 w-[300px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Search by category name" />
        </div>

        <!-- Buttons -->
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

    <!-- Table Section -->
    <div class="bg-white shadow-sm rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto text-sm">
          <thead class="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th class="px-4 py-3 text-left">No</th>
              <th class="px-4 py-3 text-left">Category Name</th>
              <th class="px-4 py-3 text-left">Description</th>
              <th class="px-4 py-3 text-left">Status</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr v-for="(category, index) in paginatedCategories" :key="category.id"
              class="hover:bg-gray-50 transition border-b border-gray-200">
              <td class="px-4 py-3">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-4 py-3">{{ category.name }}</td>
              <td class="px-4 py-3">{{ category.description }}</td>
              <td class="px-4 py-3">
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  category.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                ]">
                  {{ category.status }}
                </span>
              </td>
              <td class="px-4 py-3 flex gap-2">
                <button @click="openViewModal(category)"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                  title="View Category">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="openEditModal(category)"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                  title="Edit Category">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="deleteCategory(category.id)"
                  class="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition"
                  title="Delete Category">
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
        {{ Math.min(currentPage * itemsPerPage, filteredCategories.length) }}
        of {{ filteredCategories.length }} categories
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
    <!-- Modal for View Job Category -->
    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showViewModal"
        class="fixed inset-0 bg-gray-50 bg-opacity-60 flex items-center justify-center z-50"
        @click.self="closeViewModal">
        <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900">
              Job Category Details
            </h3>
            <button @click="closeViewModal"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition" title="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div v-if="selectedCategory" class="space-y-5 border-t border-gray-200 pt-5">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="text-sm font-semibold text-gray-600">Category Name</label>
                <p class="text-gray-900 font-medium">
                  {{ selectedCategory.name }}
                </p>
              </div>
              <div class="sm:col-span-2">
                <label class="text-sm font-semibold text-gray-600">Description</label>
                <p class="text-gray-900 font-medium">
                  {{ selectedCategory.description }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Status</label>
                <p :class="[
                  'text-sm font-medium',
                  selectedCategory.status === 'Active'
                    ? 'text-green-800'
                    : 'text-red-800'
                ]">
                  {{ selectedCategory.status }}
                </p>
              </div>
            </div>
          </div>
          <div class="mt-8 flex justify-end">
            <button @click="closeViewModal"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200">
              Close
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal for Create/Update Job Category -->
    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showCreateModal"
        class="fixed inset-0 bg-gray-50 bg-opacity-60 flex items-center justify-center z-50"
        @click.self="closeCreateModal">
        <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900">
              {{ isEditing ? 'Edit Job Category' : 'Create Job Category' }}
            </h3>
            <button @click="closeCreateModal"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition" title="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="space-y-5 border-t border-gray-200 pt-5">
            <div>
              <label class="text-sm font-semibold text-gray-600">Category Name</label>
              <input v-model="form.name" type="text"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter category name" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Description</label>
              <textarea v-model="form.description"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter description" rows="4"></textarea>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Status</label>
              <select v-model="form.status"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div class="mt-8 flex justify-end gap-4">
            <button @click="closeCreateModal"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition duration-200">
              Cancel
            </button>
            <button @click="saveCategory"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200">
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
      selectedCategory: null,
      form: {
        id: null,
        name: '',
        description: '',
        status: 'Active'
      },
      categories: [
        {
          id: uuidv4(),
          name: 'Technology',
          description:
            'Roles related to software, hardware, and IT infrastructure.',
          status: 'Active'
        },
        {
          id: uuidv4(),
          name: 'Finance',
          description: 'Roles in accounting, financial planning, and analysis.',
          status: 'Active'
        },
        {
          id: uuidv4(),
          name: 'Human Resources',
          description:
            'Roles in recruitment, employee relations, and HR management.',
          status: 'Inactive'
        },
        {
          id: uuidv4(),
          name: 'Marketing',
          description: 'Roles in advertising, branding, and market research.',
          status: 'Active'
        }
      ]
    };
  },
  computed: {
    filteredCategories() {
      return this.categories.filter((category) => {
        const matchSearch =
          this.searchQuery === '' ||
          category.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        return matchSearch;
      });
    },
    paginatedCategories() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredCategories.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredCategories.length / this.itemsPerPage);
    }
  },
  methods: {
    filterData() {
      this.currentPage = 1; // Reset to first page on filter
    },
    resetFilters() {
      this.searchQuery = '';
      this.currentPage = 1; // Reset to first page on reset
    },
    openCreateModal() {
      this.isEditing = false;
      this.form = {
        id: null,
        name: '',
        description: '',
        status: 'Active'
      };
      this.showCreateModal = true;
    },
    openEditModal(category) {
      this.isEditing = true;
      this.form = { ...category };
      this.showCreateModal = true;
    },
    openViewModal(category) {
      this.selectedCategory = { ...category };
      this.showViewModal = true;
    },
    closeCreateModal() {
      this.showCreateModal = false;
      this.isEditing = false;
      this.form = {
        id: null,
        name: '',
        description: '',
        status: 'Active'
      };
    },
    closeViewModal() {
      this.showViewModal = false;
      this.selectedCategory = null;
    },
    saveCategory() {
      if (!this.form.name) {
        alert('Please fill in the required field (Category Name).');
        return;
      }
      if (this.isEditing) {
        const index = this.categories.findIndex(
          (category) => category.id === this.form.id
        );
        if (index !== -1) {
          this.categories[index] = { ...this.form };
        }
      } else {
        this.categories.push({
          ...this.form,
          id: uuidv4()
        });
      }
      this.closeCreateModal();
    },
    deleteCategory(id) {
      if (confirm('Are you sure you want to delete this job category?')) {
        this.categories = this.categories.filter(
          (category) => category.id !== id
        );
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
    }
  },
  mounted() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.showCreateModal) {
          this.closeCreateModal();
        }
        if (this.showViewModal) {
          this.closeViewModal();
        }
      }
    });
  }
};
</script>

<style scoped>
/* Ensure table headers and cells align properly */
th,
td {
  text-align: left;
  white-space: nowrap;
}

/* Modal transition */
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
