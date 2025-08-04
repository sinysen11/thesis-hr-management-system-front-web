<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-extrabold text-gray-900">Job Postings</h2>
      <button @click="openCreateModal"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200">
        Create Job Posting
      </button>
    </div>

    <div class="fixed top-4 right-4 z-50 space-y-4 w-full max-w-xs">
      <div v-if="successMessage"
        class="p-4 rounded-lg shadow-md bg-green-500 text-white transition-opacity duration-500 ease-in-out"
        :class="{ 'opacity-0': !successMessage }">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage"
        class="p-4 rounded-lg shadow-md bg-red-500 text-white transition-opacity duration-500 ease-in-out"
        :class="{ 'opacity-0': !errorMessage }">
        {{ errorMessage }}
      </div>
    </div>

    <div class="bg-white shadow-sm rounded-lg p-6 mb-8">
      <div class="flex flex-wrap sm:flex-row justify-start items-end gap-4">
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">Search</label>
          <input type="text" v-model="searchQuery"
            class="border border-gray-300 w-[300px] rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Search by title or type" />
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

    <div class="bg-white shadow-sm rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto text-sm">
          <thead class="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th class="px-4 py-3 text-left">No</th>
              <th class="px-4 py-3 text-left">Job Title</th>
              <th class="px-4 py-3 text-left">Type</th>
              <th class="px-4 py-3 text-left">Salary</th>
              <th class="px-4 py-3 text-left">Description</th>
              <th class="px-4 py-3 text-left">Responsible</th>
              <th class="px-4 py-3 text-left">Requirement</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr v-for="(job, index) in paginatedJobs" :key="job._id"
              class="hover:bg-gray-50 transition border-b border-gray-200">
              <td class="px-4 py-3">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-4 py-3">{{ job.title }}</td>
              <td class="px-4 py-3">{{ job.type }}</td>
              <td class="px-4 py-3">{{ job.salary }}</td>
              <td class="px-4 py-3">{{ job.description }}</td>
              <td class="px-4 py-3">{{ job.responsible }}</td>
              <td class="px-4 py-3">{{ job.requirement }}</td>
              <td class="px-4 py-3 flex gap-2">
                <button @click="openViewModal(job)"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                  title="View Job">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="openEditModal(job)"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                  title="Edit Job">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="confirmDelete(job._id)"
                  class="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition"
                  title="Delete Job">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mt-6 flex justify-between items-center">
      <div class="text-sm text-gray-600">
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
        {{ Math.min(currentPage * itemsPerPage, filteredJobs.length) }}
        of {{ filteredJobs.length }} jobs
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

    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showViewModal"
        class="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50" @click.self="closeViewModal">
        <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900">Job Posting Details</h3>
            <button @click="closeViewModal"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition" title="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div v-if="selectedJob" class="space-y-5 border-t border-gray-200 pt-5">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="text-sm font-semibold text-gray-600">Job Title</label>
                <p class="text-gray-900 font-medium">{{ selectedJob.title }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Type</label>
                <p class="text-gray-900 font-medium">{{ selectedJob.type }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Salary</label>
                <p class="text-gray-900 font-medium">{{ selectedJob.salary }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Description</label>
                <p class="text-gray-900 font-medium">{{ selectedJob.description }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Responsible</label>
                <p :class="[
                  'text-sm font-medium',
                  selectedJob.responsible === 'Open'
                    ? 'text-green-800'
                    : 'text-red-800'
                ]">{{ selectedJob.responsible }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Requirement</label>
                <p class="text-gray-900 font-medium">{{ selectedJob.requirement }}</p>
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

    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showCreateModal"
        class="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50" @click.self="closeCreateModal">
        <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900">
              {{ isEditing ? 'Edit Job Posting' : 'Create Job Posting' }}
            </h3>
            <button @click="closeCreateModal"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition" title="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="space-y-5 border-t border-gray-200 pt-5">
            <div>
              <label class="text-sm font-semibold text-gray-600">Job Title</label>
              <input v-model="form.title" type="text"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter job title" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Type</label>
              <input v-model="form.type" type="text"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter type" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Salary</label>
              <input v-model="form.salary" type="text"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter salary" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Description</label>
              <textarea v-model="form.description"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter description"></textarea>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Responsible</label>
              <input v-model="form.responsible" type="text"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter responsibilities" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Requirement</label>
              <textarea v-model="form.requirement"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter requirements"></textarea>
            </div>
          </div>
          <div class="mt-8 flex justify-end gap-4">
            <button @click="closeCreateModal"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition duration-200">
              Cancel
            </button>
            <button @click="saveJob"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200">
              {{ isEditing ? 'Update' : 'Create' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showDeleteModal"
        class="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50" @click.self="closeDeleteModal">
        <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4 transform transition-all">
          <div class="text-center">
            <i class="fas fa-exclamation-triangle text-red-500 text-5xl mb-4"></i>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Confirm Deletion</h3>
            <p class="text-gray-600">Are you sure you want to delete this job posting? This action cannot be undone.</p>
          </div>
          <div class="mt-8 flex justify-center gap-4">
            <button @click="closeDeleteModal"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition duration-200">
              Cancel
            </button>
            <button @click="deleteJob"
              class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200">
              Delete
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import { getAllJob, createJob, updateJob, deleteJob } from '@/apis/jobs';

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
      selectedJob: null,
      jobToDeleteId: null,
      form: {
        _id: null,
        title: '',
        type: '',
        salary: '',
        description: '',
        responsible: '',
        requirement: ''
      },
      jobs: [],
      errorMessage: '',
      successMessage: ''
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
        if (this.showCreateModal) this.closeCreateModal();
        if (this.showViewModal) this.closeViewModal();
        if (this.showDeleteModal) this.closeDeleteModal();
      }
    });
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

    async getAllJobs() {
      try {
        const result = await getAllJob();
        console.log('getAllJob response:', result);
        if (result && result.status === 1 && Array.isArray(result.jobs)) {
          this.jobs = result.jobs.map(job => ({
            _id: job._id,
            title: job.title,
            type: job.type,
            salary: job.salary,
            description: job.description,
            responsible: job.responsible,
            requirement: job.requirement
          }));
        } else {
          console.error('Invalid response format:', {
            status: result?.status,
            jobs: result?.jobs
          });
          this.alert('Failed to load jobs. Invalid response format.', 'error');
          this.jobs = [];
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        this.alert('Error fetching jobs: ' + error.message, 'error');
        this.jobs = [];
      }
    },

    async saveJob() {
      if (
        !this.form.title ||
        !this.form.type ||
        !this.form.salary ||
        !this.form.description ||
        !this.form.responsible ||
        !this.form.requirement
      ) {
        this.alert('Please fill in all required fields.', 'error');
        return;
      }

      try {
        if (this.isEditing) {
          const { _id, ...formData } = this.form;
          const updatedJob = await updateJob(this.form._id, formData);
          if (updatedJob && updatedJob.status === 1) {
            await this.getAllJobs();
            this.alert('Job updated successfully!');
          } else {
            this.alert('Failed to update job. Please try again.', 'error');
          }
        } else {
          const { _id, ...formData } = this.form;
          const newJob = await createJob(formData);
          if (newJob && newJob.status === 1) {
            await this.getAllJobs();
            this.alert('Job created successfully!');
          } else {
            this.alert('Failed to create job. Please try again.', 'error');
          }
        }
        this.closeCreateModal();
      } catch (error) {
        console.error('Error saving job:', error);
        this.alert('Error saving job: ' + error.message, 'error');
      }
    },

    confirmDelete(id) {
      this.jobToDeleteId = id;
      this.showDeleteModal = true;
    },

    async deleteJob() {
      if (!this.jobToDeleteId) return;

      try {
        const result = await deleteJob(this.jobToDeleteId);
        if (result && result.status === 1) {
          await this.getAllJobs();
          this.alert('Job deleted successfully!');
        } else {
          this.alert('Failed to delete job. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Error deleting job:', error);
        this.alert('Error deleting job: ' + error.message, 'error');
      } finally {
        this.closeDeleteModal();
      }
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
        _id: null,
        title: '',
        type: '',
        salary: '',
        description: '',
        responsible: '',
        requirement: ''
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
        _id: null,
        title: '',
        type: '',
        salary: '',
        description: '',
        responsible: '',
        requirement: ''
      };
    },

    closeViewModal() {
      this.showViewModal = false;
      this.selectedJob = null;
    },

    closeDeleteModal() {
      this.showDeleteModal = false;
      this.jobToDeleteId = null;
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