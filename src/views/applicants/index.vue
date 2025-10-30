<template>
  <div class="flex flex-col min-h-scree">
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
        <h2 class="mb-2 text-2xl font-extrabold tracking-tight text-green-700">
          List of Applyer
        </h2>
        <div class="flex gap-4">
          <button @click="exportToExcel" :disabled="loading || applicants?.length === 0"
            class="px-6 py-2 font-medium text-white transition duration-200 bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
            <i class="mr-2 fas fa-file-excel"></i>Export as Report
          </button>
        </div>
      </div>

      <div class="p-6 mb-8 bg-white rounded-lg shadow-sm">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div class="flex flex-col">
            <label class="mb-2 text-sm font-medium text-gray-700">Date Range</label>
            <div class="flex gap-4">
              <flat-pickr v-model="appliedFrom"
                class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="From" :config="flatpickrConfig"></flat-pickr>
              <flat-pickr v-model="appliedTo"
                class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="To" :config="flatpickrConfig"></flat-pickr>
            </div>
          </div>

          <div class="flex flex-col">
            <label class="mb-2 text-sm font-medium text-gray-700">Position</label>
            <select v-model="jobTitleFilter"
              class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">All Positions</option>
              <option v-for="job in jobTitles" :key="job._id" :value="job._id">
                {{ job.des_en }}
              </option>
            </select>
          </div>

          <div class="flex flex-col">
            <label class="mb-2 text-sm font-medium text-gray-700">Status</label>
            <select v-model="statusFilter"
              class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">All Statuses</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="SHORTLISTED">SHORTLISTED</option>
              <option value="INTERVIEWING">INTERVIEWING</option>
              <option value="HIRED">HIRED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
          <div class="flex items-end gap-4">
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

      <div v-if="isLoading" class="py-12 text-center">
        <i class="text-6xl text-green-700 fas fa-spinner fa-spin"></i>
        <p class="mt-4 text-gray-600">Loading applicants...</p>
      </div>

      <div v-else class="flex-1 overflow-hidden bg-white rounded-lg shadow-sm">
        <div class="h-full overflow-x-auto">
          <table class="min-w-full text-sm table-auto">
            <thead class="text-xs font-semibold text-green-700 uppercase bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left">No</th>
                <th class="px-4 py-2 text-left">Applied Date</th>
                <th class="px-4 py-2 text-left">Name</th>
                <th class="px-4 py-2 text-left">Position</th>
                <th class="px-4 py-2 text-left">Department</th>
                <th class="px-4 py-2 text-left">Gender</th>
                <th class="px-4 py-2 text-left">Phone</th>
                <th class="px-4 py-2 text-left">Status</th>
                <th class="px-4 py-2 text-left">Action</th>
                <th class="px-4 py-2 text-left">Download</th>
              </tr>
            </thead>
            <tbody class="text-gray-700">
              <tr v-for="(applicant, index) in applicants" :key="applicant._id"
                class="transition border-b border-gray-200 hover:bg-gray-50">
                <td class="px-4 py-2">
                  {{ index + 1 + (currentPage - 1) * limit }}
                </td>
                <td class="px-4 py-2">{{ formatDate(applicant.createdAt) }}</td>
                <td class="px-4 py-2">
                  {{ applicant.applicant.first_name }}
                  {{ applicant.applicant.last_name }}
                </td>
                <td class="px-4 py-2">{{ applicant.jobId.title.des_en || 'N/A' }}</td>
                <td class="px-4 py-2">
                  {{ applicant.job.department || 'N/A' }}
                </td>
                <td class="px-4 py-2">
                  {{ applicant.applicant.sex || 'N/A' }}
                </td>
                <td class="px-4 py-2">
                  {{ formatPhone(applicant.applicant.phone) }}
                </td>
                <td class="px-4 py-2">
                  <span :class="getStatusClass(applicant?.status)"
                    class="px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full">
                    {{ applicant?.status }}
                  </span>
                </td>
                <td class="px-4 py-2">
                  <button @click="openViewModal(applicant)"
                    class="p-2 text-green-600 transition rounded-full hover:text-green-800 hover:bg-green-100"
                    title="View Job">
                    <i class="fas fa-eye"></i>
                  </button>
                </td>
                <td class="px-4 py-2">
                  <button @click="
                    downloadResume(applicant._id, applicant.resume?.fileName)
                    "
                    class="relative p-2 text-indigo-600 transition rounded-full hover:text-indigo-800 hover:bg-indigo-100"
                    title="Download File" :disabled="loading[applicant._id]">
                    <i v-if="!loading[applicant._id]" class="fas fa-cloud-download-alt"></i>
                    <i v-else class="fas fa-spinner fa-spin"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="applicants.length === 0">
                <td colspan="9" class="px-5 py-4 text-center text-gray-500">
                  No applicants found matching your criteria.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="!isLoading && totalApplicants > 0" class="flex items-center justify-between mt-6">
        <div class="text-sm text-gray-600">
          Showing {{ (currentPage - 1) * limit + 1 }} to
          {{ lastIndex }}
          of {{ totalApplicants }} applicants
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
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40"
          style="background-color: rgb(0 0 0 / 0.5)" @click.self="closeModal">
          <div class="w-full max-w-2xl p-4 mx-4 transition-all transform bg-white rounded-lg shadow-md">
            <div class="flex items-center justify-between pb-2 mb-3 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">
                Applicant Details
              </h3>
              <button @click="closeModal"
                class="p-1 text-gray-500 transition rounded-full hover:text-gray-700 hover:bg-gray-100" title="Close">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="grid gap-4 py-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Name</label>
                  <p class="px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded">
                    {{ selectedApplicant?.applicant.first_name }}
                    {{ selectedApplicant?.applicant.last_name || 'N/A' }}
                  </p>
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Position</label>
                  <p class="px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded">
                    {{ selectedApplicant?.job.title || 'N/A' }}
                  </p>
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Department</label>
                  <p class="px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded">
                    {{ selectedApplicant?.job.department || 'N/A' }}
                  </p>
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Gender</label>
                  <p class="px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded">
                    {{ selectedApplicant?.applicant?.sex || 'N/A' }}
                  </p>
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Phone</label>
                  <p class="px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded">
                    {{
                      formatPhone(selectedApplicant?.applicant.phone) || 'N/A'
                    }}
                  </p>
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Applied Date</label>
                  <p class="px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded">
                    {{ formatDate(selectedApplicant?.createdAt) || 'N/A' }}
                  </p>
                </div>
                <div class="col-span-2 space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Resume</label>
                  <p class="px-3 py-2 mt-1 text-gray-900 truncate bg-white border border-gray-300 rounded">
                    <button v-if="selectedApplicant?.resume?.fileName" @click="
                      downloadResume(
                        selectedApplicant._id,
                        selectedApplicant.resume.fileName
                      )
                      " class="inline-flex items-center gap-1 text-indigo-600 underline hover:text-indigo-800"
                      :disabled="loading[selectedApplicant._id]">
                      <i v-if="!loading[selectedApplicant._id]" class="fas fa-cloud-download-alt"></i>
                      <i v-else class="fas fa-spinner fa-spin"></i>
                      {{ selectedApplicant.resume.fileName }}
                    </button>
                    <span v-else>N/A</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="flex justify-end gap-2">
              <button @click="closeModal"
                class="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-100 transition">
                <i class="fas fa-times"></i> Cancel
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import FlatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { getAllApplicant, getOneResume } from '@/apis/applicant';
import { reactive } from 'vue';
import { getAllJobTitle } from '@/apis/jobs';
import * as XLSX from 'xlsx';

export default {
  components: { FlatPickr },
  setup() {
    const loading = reactive({});
    return { loading };
  },
  data() {
    return {
      appliedFrom: '',
      jobTitleFilter: '',
      appliedTo: '',
      searchQuery: '',
      statusFilter: '',
      currentPage: 1,
      limit: 10,

      apiTotalItems: 0,

      flatpickrConfig: {
        dateFormat: 'd-M-Y',
        altInput: true,
        altFormat: 'd-M-Y',
        allowInput: true
      },
      isLoading: false,
      showModal: false,
      selectedApplicant: null,
      applicants: [],
      error: null,
      jobTitles: [],
      successMessage: '',
      errorMessage: ''
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.apiTotalItems / this.limit);
    },
    totalApplicants() {
      return this.apiTotalItems;
    },
    lastIndex() {
      return Math.min(this.currentPage * this.limit, this.totalApplicants);
    }
  },
  methods: {
    showAlert(message, type = 'success') {
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

    async handleGetAllJob() {
      try {
        const result = await getAllJobTitle();
        if (result.status === 1) {
          this.jobTitles = result.jobs;
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

    async fetchApplicants() {
      this.isLoading = true
      try {
        this.error = null;
        const payload = {
          page: this.currentPage,
          limit: this.limit,
          search: this.searchQuery,
          from: this.appliedFrom,
          position: this.jobTitleFilter,
          to: this.appliedTo,
          status: this.statusFilter
        }
        const response = await getAllApplicant(payload);

        if (response.status === 1) {
          this.applicants = response.data.map((applicant) => {
            return {
              ...applicant,
              job: {
                title:
                  applicant.jobId?.title?.des_en ||
                  applicant.apply_position ||
                  'N/A',
                department: applicant.jobId?.department?.name_en || 'N/A'
              }
            };
          });
          const test = JSON.stringify(this.applicants)
          console.log(JSON.parse(test))
          if (response.pagination) {
            this.apiTotalItems = response.pagination.total || 0;
            this.currentPage = response.pagination.page || 1;
          } else {
            this.apiTotalItems = this.applicants.length;
          }
        } else {
          this.error = 'Failed to fetch applicants: Invalid response status';
          this.showAlert(
            'Failed to fetch applicants: Invalid response status',
            'error'
          );
        }
      } catch (error) {
        this.error = 'Error fetching applicants: ' + error.message;
        this.showAlert('Error fetching applicants: ' + error.message, 'error');
        console.error('Error fetching applicants:', error);
      } finally {
        this.isLoading = false
      }
    },

    exportToExcel() {
      if (this.applicants.length === 0) {
        this.showAlert('No applicants to export for the report.', 'error');
        return;
      }

      try {
        const data = this.applicants.map((applicant, index) => ({
          'No': index + 1 + (this.currentPage - 1) * this.limit,
          'Applied Date': this.formatDate(applicant.createdAt),
          'Name': `${applicant.applicant.first_name || ''} ${applicant.applicant.last_name || ''}`,
          'Position': applicant.job.title || 'N/A',
          'Department': applicant.job.department || 'N/A',
          'Gender': applicant.applicant.sex || 'N/A',
          'Phone': this.formatPhone(applicant.applicant.phone) || 'N/A',
          'Status': applicant.status || 'N/A'
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'ApplicantsReport');

        XLSX.writeFile(
          workbook,
          `Applicants_Report_${new Date().toISOString().split('T')[0]}.xlsx`
        );
        this.alert('Applicants report exported successfully to Excel!');
      } catch (error) {
        console.error('Error during Excel export:', error);
        this.alert('Failed to generate applicants report.', 'error');
      }
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

    async downloadResume(applicantId, fileName) {
      try {
        if (typeof this.loading !== 'object') this.loading = {};
        this.loading[applicantId] = true;

        const response = await getOneResume(applicantId);
        this.downLoadFile(
          response,
          'application/pdf',
          true,
          'resum.pdf'
        );
        console.log('Test Download Resum')
        this.showAlert(`Successfully downloaded ${fileName}`);
      } catch (error) {
        this.showAlert('Failed to download resume: ' + error.message, 'error');
        console.error('Download failed:', error);
      } finally {
        this.loading[applicantId] = false;
      }
    },

    downLoadFile(data, type, is_download, name) {
      const blob = new Blob([data], { type: type });
      const url = window.URL.createObjectURL(blob);

      if (is_download) {
        this.forceDownload(url, type, name);
      } else {
        this.loadingService.setLoading(false);
        this.onViewPDF(url);
      }
    },

    forceDownload(href, type, name) {
      var anchor = document.createElement('a');
      anchor.href = href;
      anchor.download = name;
      document.body.appendChild(anchor);
      anchor.click();
    },

    openViewModal(applicant) {
      this.$router.push({ name: 'applicant_detail', params: { id: applicant._id }});
    },

    getStatusClass(status) {
      if (!status) return 'bg-gray-100 text-gray-800';

      const normalizedStatus = status.toLowerCase();

      switch (normalizedStatus) {
        case 'shortlisted':
          return 'bg-blue-100 text-blue-800';
        case 'interviewing':
          return 'bg-yellow-100 text-yellow-800';
        case 'hired':
          return 'bg-green-100 text-green-800';
        case 'rejected':
        case 'withdrawn':
          return 'bg-red-100 text-red-800';
        case 'new':
        case 'applied':
        default:
          return 'bg-indigo-100 text-indigo-800';
      }
    },

    filterData() {
      this.currentPage = 1;
      this.fetchApplicants();
    },

    resetFilters() {
      this.appliedFrom = '';
      this.jobTitleFilter = '';
      this.appliedTo = '';
      this.searchQuery = '';
      this.statusFilter = '';
      this.currentPage = 1;
      this.fetchApplicants();
    },
    viewApplicant(applicant) {
      this.selectedApplicant = applicant;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedApplicant = null;
    },
    formatPhone(phone) {
      return phone?.startsWith('0') ? phone : '0' + phone;
    },
    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchApplicants();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchApplicants();
      }
    },
    goToPage(page) {
      this.currentPage = page;
      this.fetchApplicants();
    }
  },
  mounted() {
    this.fetchApplicants();
    this.handleGetAllJob();
    if (this.$route.query.alert) {
      this.alert(this.$route.query.alert, this.$route.query.type || 'success');
      this.$router.replace({ query: {}}); 
    }
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.showModal) {
        this.closeModal();
      }
    });
  }
};
</script>

<style scoped>
.flatpickr-input {
  background-color: white;
}

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