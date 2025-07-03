<template>
  <!-- <div class="min-h-screen bg-gray-50 flex flex-col"> -->
  <div class="w-full">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-extrabold text-gray-900">Job Titles</h2>
      <button
        @click="openCreateModal"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
      >
        Create Job Title
      </button>
    </div>

    <!-- Filter Section -->
    <div class="bg-white shadow-sm rounded-lg p-6 mb-8">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <label class="text-sm font-medium text-gray-700 mb-2"
            >Search Job Titles</label
          >
          <input
            type="text"
            v-model="searchQuery"
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Search by des_kh or des_en"
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
              <th class="px-4 py-3 text-left">Job Title</th>
              <th class="px-4 py-3 text-left">Department</th>
              <th class="px-4 py-3 text-left">Description</th>
              <th class="px-4 py-3 text-left">Status</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr
              v-for="(jobTitle, index) in paginatedJobTitles"
              :key="jobTitle.id"
              class="hover:bg-gray-50 transition border-b border-gray-200"
            >
              <td class="px-4 py-3">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-4 py-3">{{ jobTitle.des_kh }}</td>
              <td class="px-4 py-3">{{ jobTitle.des_en }}</td>
              <td class="px-4 py-3">{{ jobTitle.department }}</td>
              <td class="px-4 py-3">
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    jobTitle.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ jobTitle.status }}
                </span>
              </td>
              <td class="px-4 py-3 flex gap-2">
                <button
                  @click="openViewModal(jobTitle)"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                  des_kh="View Job Title"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button
                  @click="openEditModal(jobTitle)"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                  des_kh="Edit Job Title"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="deleteJobTitle(jobTitle.id)"
                  class="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition"
                  des_kh="Delete Job Title"
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
        {{ Math.min(currentPage * itemsPerPage, filteredJobTitles.length) }}
        of {{ filteredJobTitles.length }} job titles
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

    <!-- Modal for View Job Title -->
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
            <h3 class="text-2xl font-bold text-gray-900">Job Title Details</h3>
            <button
              @click="closeViewModal"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
              des_kh="Close"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div
            v-if="selectedJobTitle"
            class="space-y-5 border-t border-gray-200 pt-5"
          >
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="text-sm font-semibold text-gray-600"
                  >Job Title</label
                >
                <p class="text-gray-900 font-medium">
                  {{ selectedJobTitle.des_kh }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600"
                  >Department</label
                >
                <p class="text-gray-900 font-medium">
                  {{ selectedJobTitle.des_en }}
                </p>
              </div>
              <div class="sm:col-span-2">
                <label class="text-sm font-semibold text-gray-600"
                  >Description</label
                >
                <p class="text-gray-900 font-medium">
                  {{ selectedJobTitle.department }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600"
                  >Status</label
                >
                <p
                  :class="[
                    'text-sm font-medium',
                    selectedJobTitle.status === 'Active'
                      ? 'text-green-800'
                      : 'text-red-800'
                  ]"
                >
                  {{ selectedJobTitle.status }}
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

    <!-- Modal for Create/Update Job Title -->
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
              {{ isEditing ? 'Edit Job Title' : 'Create Job Title' }}
            </h3>
            <button
              @click="closeCreateModal"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
              des_kh="Close"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="space-y-5 border-t border-gray-200 pt-5">
            <div>
              <label class="text-sm font-semibold text-gray-600"
                >Job Title</label
              >
              <input
                v-model="form.des_kh"
                type="text"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter job des_kh"
              />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600"
                >Department</label
              >
              <input
                v-model="form.des_en"
                type="text"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter des_en"
              />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600"
                >Description</label
              >
              <textarea
                v-model="form.department"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter department"
                rows="4"
              ></textarea>
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
              @click="saveJobTitle"
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

import { getAllJobTitle } from '@/apis/jobs';
export default {
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,
      showCreateModal: false,
      showViewModal: false,
      isEditing: false,
      selectedJobTitle: null,
      form: {
        id: null,
        des_kh: '',
        des_en: '',
        department: '',
        status: 'Active'
      },
      jobTitles: []
    };
  },
  computed: {
    filteredJobTitles() {
      return this.jobTitles.filter((jobTitle) => {
        const matchSearch =
          this.searchQuery === '' ||
          jobTitle.des_kh
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          jobTitle.des_en
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());
        return matchSearch;
      });
    },
    paginatedJobTitles() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredJobTitles.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredJobTitles.length / this.itemsPerPage);
    }
  },
  methods: {
    async getAllJobs() {
      try {
        debugger;

        const result = await getAllJobTitle(); // Await the async API call
        if (result && result.status === 200 && result.jobs) {
          this.jobTitles = result.jobs;
        } else {
          console.warn('Unexpected response:', result);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      }
    },
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
        des_kh: '',
        des_en: '',
        department: '',
        status: 'Active'
      };
      this.showCreateModal = true;
    },
    openEditModal(jobTitle) {
      this.isEditing = true;
      this.form = { ...jobTitle };
      this.showCreateModal = true;
    },
    openViewModal(jobTitle) {
      this.selectedJobTitle = { ...jobTitle };
      this.showViewModal = true;
    },
    closeCreateModal() {
      this.showCreateModal = false;
      this.isEditing = false;
      this.form = {
        id: null,
        des_kh: '',
        des_en: '',
        department: '',
        status: 'Active'
      };
    },
    closeViewModal() {
      this.showViewModal = false;
      this.selectedJobTitle = null;
    },
    saveJobTitle() {
      if (!this.form.des_kh || !this.form.des_en) {
        alert('Please fill in all required fields (Job Title and Department).');
        return;
      }
      if (this.isEditing) {
        const index = this.jobTitles.findIndex(
          (jobTitle) => jobTitle.id === this.form.id
        );
        if (index !== -1) {
          this.jobTitles[index] = { ...this.form };
        }
      } else {
        this.jobTitles.push({
          ...this.form,
          id: uuidv4()
        });
      }
      this.closeCreateModal();
    },
    deleteJobTitle(id) {
      if (confirm('Are you sure you want to delete this job des_kh?')) {
        this.jobTitles = this.jobTitles.filter(
          (jobTitle) => jobTitle.id !== id
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
    this.getAllJobs();
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
