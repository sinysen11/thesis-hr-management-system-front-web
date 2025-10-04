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
          <button @click="handleGetAllJobs(true)" :disabled="loading"
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
              class="transition duration-150 hover:bg-indigo-50/50">
              <td class="px-4 py-3 font-medium">
                {{ index + 1 }}
              </td>
              <td class="px-4 py-3 font-semibold text-gray-800">{{ job.title }}</td>
              <td class="px-4 py-3">{{ job.department_name }}</td>
              <td class="px-4 py-3">{{ job.branch }}</td>
              <td class="px-4 py-3 font-semibold text-indigo-700">{{ job.salary }}</td>
              <td class="px-4 py-3">{{ job.close_date }}</td>
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

    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5)" v-if="showViewModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60" @click.self="closeViewModal">
        <div
          class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all max-h-[80vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900">
              Job Posting Details
            </h3>
            <button @click="closeViewModal"
              class="p-2 text-gray-500 transition rounded-full hover:text-gray-700 hover:bg-gray-100" title="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div v-if="selectedJob" class="pt-5 space-y-5 border-t border-gray-200">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="text-sm font-semibold text-gray-600">Job Title</label>
                <p class="font-medium text-gray-900">{{ selectedJob.title }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Salary</label>
                <p class="font-medium text-gray-900">
                  {{ selectedJob.salary }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Description</label>
                <p class="font-medium text-gray-900">
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
                <p class="font-medium text-gray-900">
                  {{ selectedJob.requirement }}
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
      <div style="background-color: rgb(0 0 0 / 0.5)" v-if="showDeleteModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60" @click.self="closeDeleteModal">
        <div class="w-full max-w-md p-8 mx-4 transition-all transform bg-white shadow-2xl rounded-xl">
          <div class="text-center">
            <i class="mb-4 text-5xl text-red-500 fas fa-exclamation-triangle"></i>
            <h3 class="mb-2 text-2xl font-bold text-gray-900">
              Confirm Deletion
            </h3>
            <p class="text-gray-600">
              Are you sure you want to delete this job posting? This action
              cannot be undone.
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

      showViewModal: false,
      showDeleteModal: false,
      selectedJob: null,
      jobToDeleteId: null,
      jobTitles: [],
      departments: [],

      jobs: [],
      errorMessage: '',
      successMessage: '',
      loading: false
    };
  },

  mounted() {
    this.fetchInitialData(); 
    this.handleGetAllJobs(); 

    if (this.$route.query.alert) {
      this.alert(this.$route.query.alert, this.$route.query.type || 'success');
      this.$router.replace({ query: {}}); 
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
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

    async fetchInitialData() {
        await this.fetchDepartments();
        await this.handleGetAllJobTitles();
    },

    async fetchDepartments() {
      try {
        const response = await getAllDepartment();
        if (response.status === 1 && Array.isArray(response.departments)) {
          this.departments = response.departments;
        } else {
          this.departments = [];
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        this.alert('Error fetching departments.', 'error');
        this.departments = [];
      }
    },

    async handleGetAllJobTitles() {
      try {
        const result = await getAllJobTitle();
        if (result && result.status === 1 && Array.isArray(result.jobs)) {
          this.jobTitles = result.jobs.map((item) => ({
            _id: item._id,
            des_en: item.des_en
          }));
        }
      } catch (error) {
        console.error('Error fetching job titles:', error);
        this.alert('Error fetching job titles.', 'error');
      }
    },

    async handleGetAllJobs() {
      this.loading = true;
      try {
        const query = {
          search: this.searchQuery || undefined,
          publish_date_from: this.filterPublishDate || undefined, 
          close_date_to: this.filterCloseDate || undefined 
        };
        
        const result = await getAllJob(query);

        if (result && result.status === 1 && Array.isArray(result.data)) {
          this.jobs = result.data.map((job) => {
            const department_name = typeof job.department === 'object' && job.department !== null
              ? job.department.name_en
              : 'N/A';
            const department_id = typeof job.department === 'object' && job.department !== null
              ? job.department._id
              : job.department;

            const closeDateFormatted = job.close_date ? job.close_date.split('T')[0] : 'N/A';
            const publishDateFormatted = job.publish_date ? job.publish_date.split('T')[0] : 'N/A';
            
            return {
              _id: job._id,
              title: job.title?.des_en || 'Untitled',
              title_id: job.title?._id || job.title || null,
              department_id: department_id || null,
              department_name: department_name,

              salary: job.salary || 'N/A',
              description: job.description || 'No description',
              responsible: job.responsible || 'N/A',
              requirement: job.requirement || 'No requirements',
              branch: job.branch || 'N/A',
              close_date: closeDateFormatted,
              publish_date: publishDateFormatted,
              number_staff: job.number_staff || 0,
              status: job.status || 'Active'
            };
          });
        } else {
          this.alert('Failed to load jobs. Invalid response from API.', 'error');
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

    // --- Excel Report Export Method ---
    exportToExcel() {
      if (this.jobs.length === 0) {
        this.alert('No data to export for the report.', 'error');
        return;
      }

      try {
        const data = this.jobs.map(job => ({
          'Job Title': job.title,
          'Department': job.department_name,
          'Branch': job.branch,
          'Salary ($)': job.salary,
          'Close Date': job.close_date,
          'Staff Required': job.number_staff,
          'Publish Date': job.publish_date,
          'Status': job.status,
          'Description': job.description,
          'Requirement': job.requirement
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'JobPostingsReport');
        
        XLSX.writeFile(workbook, `Job_Postings_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
        this.alert('Report exported successfully to Excel!');
      } catch (error) {
        console.error('Error during Excel export:', error);
        this.alert('Failed to generate report.', 'error');
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
          // Refresh list after successful deletion
          await this.handleGetAllJobs(); 
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
    
    closeViewModal() {
      this.showViewModal = false;
      this.selectedJob = null;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.jobToDeleteId = null;
    },

    // When filters are applied or reset, re-fetch data from the API
    resetFilters() {
      this.searchQuery = '';
      this.filterPublishDate = '';
      this.filterCloseDate = '';
      this.handleGetAllJobs(true); 
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

.modal-enter-active>div:first-child,
.modal-leave-active>div:first-child {
  transition: transform 0.3s ease;
}

.modal-enter-from>div:first-child,
.modal-leave-to>div:first-child {
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