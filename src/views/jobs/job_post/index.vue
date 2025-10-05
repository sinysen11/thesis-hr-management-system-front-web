<template>
  <div class="w-full">
    <div v-if="successMessage"
      class="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-[100] bg-green-500 text-white p-3 rounded-lg shadow-xl transition-all duration-300">
      <i class="mr-2 fas fa-check-circle"></i>{{ successMessage }}
    </div>
    <div v-if="errorMessage"
      class="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-[100] bg-red-500 text-white p-3 rounded-lg shadow-xl transition-all duration-300">
      <i class="mr-2 fas fa-times-circle"></i>{{ errorMessage }}
    </div>

    <div class="flex items-center justify-between mb-6">
      <h2 class="text-3xl font-extrabold text-gray-900">Job Postings</h2>
      <div class="flex gap-4">
        <button @click="exportToExcel" :disabled="loading || jobs.length === 0"
          class="px-6 py-2 font-medium text-white transition duration-200 bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
          <i class="mr-2 fas fa-file-excel"></i>Export as Report
        </button>
        <button @click="navigateToCreate" :disabled="loading"
          class="px-6 py-2 font-medium text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
          Create
        </button>
      </div>
    </div>

    <div class="p-6 mb-8 bg-white rounded-lg shadow-sm">
      <div class="flex flex-wrap items-end justify-start gap-4">
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Search</label>
          <input type="text" v-model="searchQuery"
            class="border border-gray-300 w-[300px] rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Search by title" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Publish Date (From)</label>
          <input type="date" v-model="filterPublishDate"
            class="border border-gray-300 w-[180px] rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Close Date (To)</label>
          <input type="date" v-model="filterCloseDate"
            class="border border-gray-300 w-[180px] rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
        </div>

        <div class="flex gap-4">
          <button @click="handleGetAllJobs(1)" :disabled="loading"
            class="px-6 py-2 font-medium text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
            Search
          </button>
          <button @click="resetFilters" :disabled="loading"
            class="px-6 py-2 font-medium text-gray-800 transition duration-200 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
            Reset
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="py-4 text-center">
      <i class="text-6xl text-green-700 fas fa-spinner fa-spin"></i>
    </div>

    <div class="overflow-hidden bg-white shadow-sm rounded-xl" v-else>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm table-auto">
          <thead class="text-xs font-bold tracking-wider text-green-700 uppercase bg-gray-200">
            <tr>
              <th class="w-10 px-4 py-3 text-left">No</th>
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
            <tr v-for="(job, index) in jobs" :key="job._id"
              :class="[isExpired(job.close_date) ? 'bg-red-50/50 hover:bg-red-100/70' : 'hover:bg-indigo-50/50', 'transition duration-150']">
              <td class="px-4 py-3 font-medium">{{ index + 1 + (currentPage - 1) * limit }}</td>
              <td class="px-4 py-3 font-semibold text-gray-800">{{ job.title }}</td>
              <td class="px-4 py-3">{{ job.department_name }}</td>
              <td class="px-4 py-3">{{ job.branch }}</td>
              <td class="px-4 py-3 font-semibold text-indigo-700">{{ job.salary }}</td>

              <td class="px-4 py-3">
                <span v-if="isExpired(job.close_date)" class="text-red-600 font-semibold">
                  {{ job.close_date }}
                  <span class="ml-2 bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">
                    Expired
                  </span>
                </span>
                <span v-else>{{ job.close_date }}</span>
              </td>
              <td class="px-4 py-3 text-center">{{ job.number_staff }}</td>

              <td class="flex justify-center gap-1 px-4 py-3">
                <button @click="openViewModal(job)"
                  class="p-2 text-green-600 transition rounded-full hover:text-green-800 hover:bg-green-100"
                  title="View Job">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="openEditModal(job)" :disabled="loading"
                  class="p-2 text-indigo-600 transition rounded-full hover:text-indigo-800 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Edit Job">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="confirmDelete(job._id)" :disabled="loading"
                  class="p-2 text-red-600 transition rounded-full hover:text-red-800 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete Job">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>

            <tr v-if="jobs.length === 0">
              <td colspan="8" class="px-4 py-6 font-medium text-center text-gray-500">
                <i class="mr-2 fas fa-info-circle"></i>No job postings found matching your criteria.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="!loading && totalJobs > 0" class="flex items-center justify-between mt-6">
      <div class="text-sm text-gray-600">
        Showing {{ (currentPage - 1) * limit + 1 }} to
        {{ lastIndex }}
        of {{ totalJobs }} job postings
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
      <div style="background-color: rgb(0 0 0 / 0.5)" v-if="showDeleteModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60" @click.self="closeDeleteModal">
        <div class="w-full max-w-md p-8 mx-4 transition-all transform bg-white shadow-2xl rounded-xl">
          <div class="text-center">
            <i class="mb-4 text-5xl text-red-500 fas fa-exclamation-triangle"></i>
            <h3 class="mb-2 text-2xl font-bold text-gray-900">
              Confirm Deletion
            </h3>
            <p class="text-gray-600">
              Are you sure you want to delete this job posting? This action cannot be undone.
            </p>
          </div>
          <div class="flex justify-center gap-4 mt-8">
            <button @click="closeDeleteModal"
              class="px-6 py-2 font-medium text-gray-800 transition duration-200 bg-gray-200 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
            <button @click="deleteJob" :disabled="loading"
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
import { getAllJob, deleteJob } from '@/apis/jobs';
import { getAllJobTitle } from '@/apis/jobs';
import { getAllDepartment } from '@/apis/department';
import * as XLSX from 'xlsx';

export default {
  data() {
    return {
      searchQuery: '',
      filterPublishDate: '',
      filterCloseDate: '',
      showDeleteModal: false,
      jobToDeleteId: null,
      jobTitles: [],
      departments: [],
      jobs: [],
      errorMessage: '',
      successMessage: '',
      loading: false,

      // --- Pagination State (Added) ---
      currentPage: 1,
      limit: 10, // Assuming a default limit of 10 items per page
      apiTotalItems: 0 // Total number of jobs from the API
      // --------------------------------
    };
  },
  computed: {
    // --- Pagination Computeds (Added) ---
    totalPages() {
      return Math.ceil(this.apiTotalItems / this.limit);
    },
    totalJobs() {
      return this.apiTotalItems;
    },
    lastIndex() {
      return Math.min(this.currentPage * this.limit, this.totalJobs);
    }
    // --------------------------------
  },
  mounted() {
    // === FIX IMPLEMENTED HERE: Check for alert query parameter ===
    if (this.$route.query.alert) {
      this.alert(this.$route.query.alert, this.$route.query.type || 'success');
      // Clear the query parameter immediately after displaying the message
      this.$router.replace({ query: {}});
    }
    // ==============================================================

    this.fetchInitialData();
    this.handleGetAllJobs(1); // Start on page 1
  },
  methods: {
    /**
     * Checks if the close date has passed (job is expired).
     * @param {string} closeDate - The job's close date in 'YYYY-MM-DD' format.
     * @returns {boolean}
     */
    isExpired(closeDate) {
      if (!closeDate || closeDate === 'N/A') return false;
      // Get today's date in 'YYYY-MM-DD' format for string comparison
      const today = new Date().toISOString().split('T')[0];
      // A job is expired if its close date is strictly before today.
      return closeDate < today;
    },

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

    async fetchInitialData() {
      await this.fetchDepartments();
      await this.handleGetAllJobTitles();
    },

    async fetchDepartments() {
      try {
        const response = await getAllDepartment();
        if (response.status === 1 && Array.isArray(response.departments)) {
          this.departments = response.departments;
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    },

    async handleGetAllJobTitles() {
      try {
        const result = await getAllJobTitle();
        if (result.status === 1 && Array.isArray(result.jobs)) {
          this.jobTitles = result.jobs.map(item => ({
            _id: item._id,
            des_en: item.des_en
          }));
        }
      } catch (error) {
        console.error('Error fetching job titles:', error);
      }
    },

    /**
     * Fetches job postings with optional filters and pagination.
     * @param {number} [page=this.currentPage] - The page number to fetch.
     */
    async handleGetAllJobs(page = this.currentPage) {
      this.loading = true;
      try {
        const query = {
          search: this.searchQuery || undefined,
          publish_date_from: this.filterPublishDate || undefined,
          close_date_to: this.filterCloseDate || undefined,
          page: page, // Add page for pagination
          limit: this.limit // Add limit for pagination
        };

        const result = await getAllJob(query);
        if (result.status === 1 && Array.isArray(result.data)) {
          this.jobs = result.data.map(job => ({
            _id: job._id,
            title: job.title?.des_en || 'Untitled',
            department_name: job.department?.name_en || 'N/A',
            branch: job.branch || 'N/A',
            salary: job.salary || 'N/A',
            // Ensure dates are in YYYY-MM-DD format for comparison
            close_date: job.close_date ? job.close_date.split('T')[0] : 'N/A',
            publish_date: job.publish_date ? job.publish_date.split('T')[0] : 'N/A',
            number_staff: job.number_staff || 0,
            status: job.status || 'Active'
          }));

          // --- Update Pagination State ---
          if (result.pagination) {
            this.apiTotalItems = result.pagination.total || 0;
            this.currentPage = result.pagination.page || 1;
          } else {
            // Fallback for API without pagination info, treat as a single page
            this.apiTotalItems = this.jobs.length;
            this.currentPage = 1;
          }
          // -------------------------------
        } else {
          this.jobs = [];
          this.apiTotalItems = 0;
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        this.jobs = [];
        this.apiTotalItems = 0;
      } finally {
        this.loading = false;
      }
    },

    // --- Pagination Methods (Added) ---
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        this.currentPage = page;
        this.handleGetAllJobs(page);
      }
    },
    prevPage() {
      this.goToPage(this.currentPage - 1);
    },
    nextPage() {
      this.goToPage(this.currentPage + 1);
    },
    // --------------------------------

    exportToExcel() {
      if (this.jobs.length === 0) {
        this.alert('No data to export for the report.', 'error');
        return;
      }

      const data = this.jobs.map(job => ({
        'Job Title': job.title,
        'Department': job.department_name,
        'Branch': job.branch,
        'Salary ($)': job.salary,
        'Close Date': job.close_date,
        'Staff Required': job.number_staff,
        'Publish Date': job.publish_date,
        'Status': this.isExpired(job.close_date) ? 'Expired' : 'Active'
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'JobPostingsReport');
      XLSX.writeFile(workbook, `Job_Postings_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
      this.alert('Report exported successfully to Excel!');
    },

    confirmDelete(id) {
      this.jobToDeleteId = id;
      this.showDeleteModal = true;
    },
    async deleteJob() {
      if (!this.jobToDeleteId) return;
      this.loading = true;
      try {
        const result = await deleteJob(this.jobToDeleteId);
        if (result.status === 1) {
          // Re-fetch jobs after deletion, staying on the same page
          await this.handleGetAllJobs(this.currentPage);
          this.alert('Job deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting job:', error);
      } finally {
        this.loading = false;
        this.showDeleteModal = false;
      }
    },

    navigateToCreate() {
      this.$router.push({ name: 'create_job_posting' });
    },

    openEditModal(job) {
      this.$router.push({
        name: 'job_edit',
        params: { jobId: job._id }
      });
    },

    openViewModal(job) {
      this.$router.push({
        name: 'job_posting_detail',
        params: { id: job._id }
      });
    },

    resetFilters() {
      this.searchQuery = '';
      this.filterPublishDate = '';
      this.filterCloseDate = '';
      this.handleGetAllJobs(1); // Reset filters and go to page 1
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

/* Modal styles from previous version (removed for brevity but assumed present) */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
/* ... etc. for the modal transitions */
</style>