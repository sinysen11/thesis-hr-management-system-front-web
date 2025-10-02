<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-extrabold text-gray-900">Job Postings</h2>
      <button @click="openCreateModal" :disabled="loading"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
        Create
      </button>
    </div>

    <div class="bg-white shadow-sm rounded-lg p-6 mb-8">
      <div class="flex flex-wrap sm:flex-row justify-start items-end gap-4">
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">Search</label>
          <input type="text" v-model="searchQuery"
            class="border border-gray-300 w-[300px] rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Search by title" />
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

    <div v-if="loading" class="py-4 text-center">
      <i class="text-6xl text-green-700 fas fa-spinner fa-spin"></i>
    </div>

    <div class="bg-white shadow-sm rounded-xl overflow-hidden" v-else>
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto text-sm">
          <thead class="bg-gray-200 text-green-700 uppercase text-xs font-bold tracking-wider">
            <tr>
              <th class="px-4 py-3 text-left w-10">No</th>
              <th class="px-4 py-3 text-left">Job Title</th>
              <th class="px-4 py-3 text-left">Department</th>
              <th class="px-4 py-3 text-left">Branch</th>
              <th class="px-4 py-3 text-left">Salary ($)</th>
              <th class="px-4 py-3 text-left">Close Date</th>
              <th class="px-4 py-3 text-center">Staff</th>
              <th class="px-4 py-3 text-center w-36">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 divide-y divide-gray-100">
            <tr v-for="(job, index) in paginatedJobs" :key="job._id"
              class="hover:bg-indigo-50/50 transition duration-150">
              <td class="px-4 py-3 font-medium">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-4 py-3 font-semibold text-gray-800">{{ job.title }}</td>
              <td class="px-4 py-3">{{ job.department_name }}</td>
              <td class="px-4 py-3">{{ job.branch }}</td>
              <td class="px-4 py-3 text-indigo-700 font-semibold">{{ job.salary }}</td>
              <td class="px-4 py-3">{{ job.close_date }}</td>
              <td class="px-4 py-3 text-center">{{ job.number_staff }}</td>

              <td class="px-4 py-3 flex gap-1 justify-center">
                <button @click="openViewModal(job)"
                  class="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-100 transition"
                  title="View Job">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="openEditModal(job)" :disabled="loading"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Edit Job">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="confirmDelete(job._id)" :disabled="loading"
                  class="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete Job">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="paginatedJobs.length === 0">
              <td colspan="8" class="px-4 py-6 text-center text-gray-500 font-medium">
                <i class="fas fa-info-circle mr-2"></i>No job postings found matching your criteria.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5)" v-if="showViewModal"
        class="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50" @click.self="closeViewModal">
        <div
          class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all max-h-[80vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900">
              Job Posting Details
            </h3>
            <button @click="closeViewModal"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition" title="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div v-if="selectedJob" class="space-y-5 border-t border-gray-200 pt-5">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="text-sm font-semibold text-gray-600">Job Title</label>
                <p class="text-gray-900 font-medium">{{ selectedJob.title.des_en }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Salary</label>
                <p class="text-gray-900 font-medium">
                  {{ selectedJob.salary }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Description</label>
                <p class="text-gray-900 font-medium">
                  {{ selectedJob.description }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Responsible</label>
                <p :class="[
                  'text-sm font-medium',
                  selectedJob.responsible === 'Open'
                    ? 'text-green-800'
                    : 'text-red-800'
                ]">
                  {{ selectedJob.responsible }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Requirement</label>
                <p class="text-gray-900 font-medium">
                  {{ selectedJob.requirement }}
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

    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.6)" v-if="showCreateModal"
        class="fixed inset-0 flex items-center justify-center z-50 p-4" @click.self="closeCreateModal">
        <div
          class="bg-white rounded-2xl shadow-3xl p-6 sm:p-8 w-full max-w-2xl mx-auto transform transition-all max-h-[90vh] overflow-y-auto border border-gray-100">
          <div class="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
            <h3 class="text-2xl font-extrabold text-gray-900">
              {{ isEditing ? 'Edit Job Posting' : 'Create New Job Posting' }}
            </h3>
            <button @click="closeCreateModal"
              class="text-gray-400 hover:text-gray-700 p-2 rounded-full transition duration-150 hover:bg-gray-50"
              title="Close">
              <i class="fas fa-times text-lg"></i>
            </button>
          </div>

          <div class="space-y-6">

            <div class="grid sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="job-title">Job Title</label>
                <div class="relative">
                  <select v-model="form.title" id="job-title"
                    class="appearance-none border border-gray-300 rounded-lg w-full py-2.5 px-3 bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm pr-10">
                    <option disabled value="">Select job title</option>
                    <option v-for="item in jobTitles" :key="item._id" :value="item._id">
                      {{ item.des_en }}
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                    <i class="fas fa-chevron-down text-xs"></i>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="department">Department</label>
                <div class="relative">
                  <select v-model="form.department" id="department"
                    class="appearance-none border border-gray-300 rounded-lg w-full py-2.5 px-3 bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm pr-10">
                    <option disabled value="">Select department</option>
                    <option v-for="dept in departments" :key="dept._id" :value="dept._id">
                      {{ dept.name_en }}
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                    <i class="fas fa-chevron-down text-xs"></i>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid sm:grid-cols-3 gap-5">

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                <input v-model="form.salary" type="text"
                  class="border border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
                  placeholder="e.g., $5000-12000" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Branch/Location</label>
                <input v-model="form.branch" type="text"
                  class="border border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
                  placeholder="e.g., Phnom Penh" />
              </div>
            </div>

            <div class="grid sm:grid-cols-3 gap-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                <input v-model="form.publish_date" type="date"
                  class="border border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Close Date</label>
                <input v-model="form.close_date" type="date"
                  class="border border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Staff Needed</label>
                <input v-model.number="form.number_staff" type="number" min="1"
                  class="border border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
                  placeholder="e.g., 4" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea v-model="form.description" rows="3"
                class="border border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
                placeholder="Enter the job description..."></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
              <textarea v-model="form.responsible" rows="3"
                class="border border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
                placeholder="List key responsibilities..."></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
              <textarea v-model="form.requirement" rows="3"
                class="border border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
                placeholder="List required skills and qualifications..."></textarea>
            </div>

          </div>

          <div class="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
            <button @click="closeCreateModal"
              class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-lg font-semibold transition duration-200 shadow-sm">
              Cancel
            </button>
            <button @click="saveJob" :disabled="loading"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-semibold transition duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isEditing ? 'Update Job' : 'Create Job' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5)" v-if="showDeleteModal"
        class="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50" @click.self="closeDeleteModal">
        <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4 transform transition-all">
          <div class="text-center">
            <i class="fas fa-exclamation-triangle text-red-500 text-5xl mb-4"></i>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">
              Confirm Deletion
            </h3>
            <p class="text-gray-600">
              Are you sure you want to delete this job posting? This action
              cannot be undone.
            </p>
          </div>
          <div class="mt-8 flex justify-center gap-4">
            <button @click="closeDeleteModal"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition duration-200">
              Cancel
            </button>
            <button @click="deleteJob" :disabled="loading"
              class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              Delete
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getAllJob, createJob, updateJob, deleteJob } from '@/apis/jobs';
import { getAllJobTitle } from '@/apis/jobs';
import { getAllDepartment } from '@/apis/department';

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
      jobTitles: [],

      form: {
        _id: null,
        title: '',
        salary: '',
        description: '',
        responsible: '',
        requirement: '',
        department: '',
        branch: '', // Branch/Location
        close_date: '', // Date: YYYY-MM-DD
        publish_date: new Date().toISOString().split('T')[0], // Date: Default to today
        number_staff: 1, // Number
        status: 'Active' // Assuming a status field exists
      },

      jobs: [], // The full list of jobs fetched from the server (for local pagination)
      departments: [], // List of departments for the select dropdown
      errorMessage: '',
      successMessage: '',
      loading: false
    };
  },
  computed: {
    filteredJobs() {
      return this.jobs.filter((job) => {
        const matchSearch =
          this.searchQuery === '' ||
          job.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          job.branch.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          job.department_name.toLowerCase().includes(this.searchQuery.toLowerCase());
        return matchSearch;
      });
    },
    paginatedJobs() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredJobs.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredJobs.length / this.itemsPerPage) || 1;
    },
    // Logic for displaying pagination buttons
    visiblePages() {
      const total = this.totalPages;
      const current = this.currentPage;
      const maxButtons = 5;
      const pages = [];

      if (total <= maxButtons) {
        for (let i = 1; i <= total; i++) {
          pages.push(i);
        }
        return pages;
      }

      let start = Math.max(2, current - 1);
      let end = Math.min(total - 1, current + 1);

      if (current <= 3) {
        end = Math.min(total - 1, 4);
        start = 2;
      } else if (current >= total - 2) {
        start = Math.max(2, total - 3);
        end = total - 1;
      }

      pages.push(1);
      if (start > 2) pages.push('...');

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== total) pages.push(i);
      }

      if (end < total - 1) pages.push('...');
      if (pages[pages.length - 1] !== total) pages.push(total);

      return [...new Set(pages.filter(p => p))].filter((page, index, self) => {
        if (page === '...' && self[index - 1] === '...') return false;
        return true;
      });
    }
  },
  mounted() {
    // Fetch dependencies first
    this.fetchDepartments().then(() => {
      this.handleGetAllJob(); // Fetch job titles (which might need departments for context)
      this.getAllJobs(); // Fetch main job data
    });

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

    // --- API Fetching Methods ---

    async fetchDepartments() {
      this.loading = true;
      try {
        const response = await getAllDepartment();
        if (response.status === 1 && Array.isArray(response.departments)) {
          this.departments = response.departments;
        } else {
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

    async handleGetAllJob() {
      this.loading = true;
      try {
        const result = await getAllJobTitle();
        if (result && result.status === 1 && Array.isArray(result.jobs)) {
          this.jobTitles = result.jobs.map((item) => ({
            _id: item._id,
            des_en: item.des_en
          }));
        } else {
          this.alert('Failed to load job titles. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Error fetching job titles:', error);
        this.alert('Error fetching job titles: ' + error.message, 'error');
      } finally {
        this.loading = false;
      }
    },

    async getAllJobs() {
      this.loading = true;
      try {
        const result = await getAllJob();
        if (result && result.status === 1 && Array.isArray(result.data)) {
          this.jobs = result.data.map((job) => {
            return {
              _id: job._id,
              title: job.title?.des_en || 'Untitled',
              title_id: job.title || null,
              department_id: job.department || null,
              department_name: job?.department.name_en || 'N/A',

              salary: job.salary || 'N/A',
              description: job.description || 'No description',
              responsible: job.responsible || 'N/A',
              requirement: job.requirement || 'No requirements',
              branch: job.branch || 'N/A',
              close_date: job.close_date ? job.close_date.split('T')[0] : null,
              publish_date: job.publish_date ? job.publish_date.split('T')[0] : null,
              number_staff: job.number_staff || 0,
              status: job.status || 'Active'
            };
          });
        } else {
          this.alert('Failed to load jobs. Invalid response format.', 'error');
          this.jobs = [];
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        this.alert('Error fetching jobs: ' + error.message, 'error');
        this.jobs = [];
      } finally {
        this.loading = false;
      }
    },

    async saveJob() {
      if (
        !this.form.title ||
        !this.form.salary ||
        !this.form.description ||
        !this.form.responsible ||
        !this.form.requirement ||
        !this.form.department ||
        !this.form.branch ||
        !this.form.close_date
      ) {
        this.alert('Please fill in all required fields (Title, Department, Branch, Close Date, and all content fields).', 'error');
        return;
      }
      this.loading = true;
      try {
        // Prepare payload, excluding fields not required by the API
        const { _id, status, ...formData } = this.form;

        if (this.isEditing) {
          const updatedJob = await updateJob(this.form._id, formData);
          if (updatedJob && updatedJob.status === 1) {
            await this.getAllJobs();
            this.alert('Job updated successfully!');
          } else {
            this.alert('Failed to update job. Please try again.', 'error');
          }
        } else {
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
      } finally {
        this.loading = false;
      }
    },

    confirmDelete(id) {
      this.jobToDeleteId = id;
      this.showDeleteModal = true;
    },
    async deleteJob() {
      if (!this.jobToDeleteId) {
        this.alert('No job selected for deletion.', 'error');
        return;
      }
      this.loading = true;
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
        this.loading = false;
        this.closeDeleteModal();
      }
    },

    // --- Modal/Form Methods ---
    resetForm() {
      this.form = {
        _id: null,
        title: '', // ✅ Reset to empty string
        salary: '',
        description: '',
        responsible: '',
        requirement: '',
        department: '', // ✅ Reset to empty string for dropdown default
        branch: '',
        close_date: '',
        publish_date: new Date().toISOString().split('T')[0],
        number_staff: 1,
        status: 'Active'
      };
    },
    openCreateModal() {
      this.isEditing = false;
      this.resetForm(); // Use the resetForm method
      this.showCreateModal = true;
    },
    openEditModal(job) {
      this.isEditing = true;

      // ✅ Map the fetched job data back to the form structure for editing
      this.form = {
        _id: job._id,
        title: job.title_id || '', // Use the ID for the select dropdown
        salary: job.salary || '',
        description: job.description || '',
        responsible: job.responsible || '',
        requirement: job.requirement || '',
        department: job.department_id || '', // Use the department ID
        branch: job.branch || '',
        close_date: job.close_date || '', // Date fields are already formatted YYYY-MM-DD
        publish_date: job.publish_date || '',
        number_staff: job.number_staff || 1,
        status: job.status || 'Active'
      };
      this.showCreateModal = true;
    },
    openViewModal(job) {
      this.$router.push({ name: 'job_posting_detail', params: { id: job._id }});
    },
    closeCreateModal() {
      this.showCreateModal = false;
      this.isEditing = false;
      this.resetForm();
    },
    closeViewModal() {
      this.showViewModal = false;
      this.selectedJob = null;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.jobToDeleteId = null;
    },

    // --- Pagination Methods ---
    filterData() {
      this.currentPage = 1;
    },
    resetFilters() {
      this.searchQuery = '';
      this.currentPage = 1;
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
      if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
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
