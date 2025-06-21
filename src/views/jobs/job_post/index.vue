<template>
  <!-- <div class="min-h-screen bg-gray-50 flex flex-col"> -->
  <div class="w-full">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-extrabold text-gray-900">Job Postings</h2>
      <button
        @click="openCreateModal"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
      >
        Create Job Posting
      </button>
    </div>

    <!-- Filter Section -->
    <div class="bg-white shadow-sm rounded-lg p-6 mb-8">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <label class="text-sm font-medium text-gray-700 mb-2"
            >Search Jobs</label
          >
          <input
            type="text"
            v-model="searchQuery"
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Search by title or type"
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
              <th class="px-4 py-3 text-left">Location</th>
              <th class="px-4 py-3 text-left">Posted Date</th>
              <th class="px-4 py-3 text-left">Status</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr
              v-for="(job, index) in paginatedJobs"
              :key="job.id"
              class="hover:bg-gray-50 transition border-b border-gray-200"
            >
              <td class="px-4 py-3">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-4 py-3">{{ job.title }}</td>
              <td class="px-4 py-3">{{ job.type }}</td>
              <td class="px-4 py-3">{{ job.salary }}</td>
              <td class="px-4 py-3">{{ job.description }}</td>
              <td class="px-4 py-3">
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    job.responsible === 'Open'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ job.responsible }}
                </span>
              </td>
              <td class="px-4 py-3 flex gap-2">
                <button
                  @click="openViewModal(job)"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                  title="View Job"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button
                  @click="openEditModal(job)"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                  title="Edit Job"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="deleteJob(job.id)"
                  class="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition"
                  title="Delete Job"
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
        {{ Math.min(currentPage * itemsPerPage, filteredJobs.length) }}
        of {{ filteredJobs.length }} jobs
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

    <!-- Modal for View Job Posting -->
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
            <h3 class="text-2xl font-bold text-gray-900">
              Job Posting Details
            </h3>
            <button
              @click="closeViewModal"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
              title="Close"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div
            v-if="selectedJob"
            class="space-y-5 border-t border-gray-200 pt-5"
          >
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="text-sm font-semibold text-gray-600"
                  >Job Title</label
                >
                <p class="text-gray-900 font-medium">
                  {{ selectedJob.title }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600"
                  >Department</label
                >
                <p class="text-gray-900 font-medium">
                  {{ selectedJob.type }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600"
                  >Location</label
                >
                <p class="text-gray-900 font-medium">
                  {{ selectedJob.salary }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600"
                  >Posted Date</label
                >
                <p class="text-gray-900 font-medium">
                  {{ selectedJob.description }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600"
                  >Status</label
                >
                <p
                  :class="[
                    'text-sm font-medium',
                    selectedJob.responsible === 'Open'
                      ? 'text-green-800'
                      : 'text-red-800'
                  ]"
                >
                  {{ selectedJob.responsible }}
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

    <!-- Modal for Create/Update Job Posting -->
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
              {{ isEditing ? 'Edit Job Posting' : 'Create Job Posting' }}
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
              <label class="text-sm font-semibold text-gray-600"
                >Job Title</label
              >
              <input
                v-model="form.title"
                type="text"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter job title"
              />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600"
                >Department</label
              >
              <input
                v-model="form.type"
                type="text"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter type"
              />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600"
                >Location</label
              >
              <input
                v-model="form.salary"
                type="text"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter salary"
              />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600"
                >Posted Date</label
              >
              <flat-pickr
                v-model="form.description"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Select date"
                :config="flatpickrConfig"
              ></flat-pickr>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Status</label>
              <select
                v-model="form.responsible"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
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
              @click="saveJob"
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
import FlatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { v4 as uuidv4 } from 'uuid';
import { getAllJob } from '@/apis/jobs';

export default {
  components: {
    FlatPickr
  },
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,
      showCreateModal: false,
      showViewModal: false,
      isEditing: false,
      selectedJob: null,
      form: {
        id: null,
        title: '',
        type: '',
        salary: '',
        description: '',
        responsible: 'Open'
      },
      flatpickrConfig: {
        dateFormat: 'd-M-Y',
        altInput: true,
        altFormat: 'd-M-Y',
        allowInput: true
      },
      jobs: []
    };
  },
  computed: {
    filteredJobs() {
      return this.jobs.filter((job) => {
        const matchSearch =
          this.searchQuery === '' ||
          job.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          job.type.toLowerCase().includes(this.searchQuery.toLowerCase());
        return matchSearch;
      });
    },
    paginatedJobs() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredJobs.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredJobs.length / this.itemsPerPage);
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
  },
  methods: {
    getAllJobs() {
      const result = getAllJob();
      if (result && result.status === 200) {
        this.jobs = result && result.data ? result.data : [];
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
        title: '',
        type: '',
        salary: '',
        description: '',
        responsible: 'Open'
      };
      this.showCreateModal = true;
    },
    openEditModal(job) {
      this.isEditing = true;
      this.form = { ...job };
      this.showCreateModal = true;
    },
    openViewModal(job) {
      this.selectedJob = { ...job };
      this.showViewModal = true;
    },
    closeCreateModal() {
      this.showCreateModal = false;
      this.isEditing = false;
      this.form = {
        id: null,
        title: '',
        type: '',
        salary: '',
        description: '',
        responsible: 'Open'
      };
    },
    closeViewModal() {
      this.showViewModal = false;
      this.selectedJob = null;
    },
    saveJob() {
      if (
        !this.form.title ||
        !this.form.type ||
        !this.form.salary ||
        !this.form.description
      ) {
        alert('Please fill in all required fields.');
        return;
      }
      if (this.isEditing) {
        const index = this.jobs.findIndex((job) => job.id === this.form.id);
        if (index !== -1) {
          this.jobs[index] = { ...this.form };
        }
      } else {
        this.jobs.push({
          ...this.form,
          id: uuidv4()
        });
      }
      this.closeCreateModal();
    },
    deleteJob(id) {
      if (confirm('Are you sure you want to delete this job posting?')) {
        this.jobs = this.jobs.filter((job) => job.id !== id);
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

/* Flatpickr styles */
.flatpickr-input {
  background-color: white;
}
</style>
