<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <div class="w-full">
      <h2 class="text-3xl font-extrabold text-gray-900 mb-2">
        Applicant Dashboard
      </h2>
      <!-- Filter Section -->
      <div class="bg-white shadow-sm rounded-lg p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div class="flex gap-4">
              <flat-pickr v-model="appliedFrom"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="From" :config="flatpickrConfig"></flat-pickr>
              <flat-pickr v-model="appliedTo"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="To" :config="flatpickrConfig"></flat-pickr>
            </div>
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2">Search Applicants</label>
            <input type="text" v-model="searchQuery"
              class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="Search by name or file" />
          </div>
          <div class="flex items-end gap-4">
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
      <div class="bg-white shadow-sm rounded-lg overflow-hidden flex-1">
        <div class="overflow-x-auto h-full">
          <table class="min-w-full table-auto text-sm">
            <thead class="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th class="px-4 py-2 text-left">No</th>
                <th class="px-4 py-2 text-left">Applied Date</th>
                <th class="px-4 py-2 text-left">Name</th>
                <th class="px-4 py-2 text-left">Position</th>
                <th class="px-4 py-2 text-left">Department</th>
                <th class="px-4 py-2 text-left">Gender</th>
                <th class="px-4 py-2 text-left">Phone</th>
                <th class="px-4 py-2 text-left">Action</th>
                <th class="px-4 py-2 text-left">Download</th>
              </tr>
            </thead>
            <tbody class="text-gray-700">
              <tr v-for="(applicant, index) in paginatedApplicants" :key="applicant._id"
                class="hover:bg-gray-50 transition border-b border-gray-200">
                <td class="px-4 py-2">
                  {{ index + 1 + (currentPage - 1) * itemsPerPage }}
                </td>
                <td class="px-4 py-2">{{ formatDate(applicant.createdAt) }}</td>
                <td class="px-4 py-2">{{ applicant.applicant.first_name }} {{ applicant.applicant.last_name }}</td>
                <td class="px-4 py-2">{{ applicant.job.title }}</td>
                <td class="px-4 py-2">{{ applicant.job.type }}</td>
                <td class="px-4 py-2">{{ applicant.applicant.gender || 'N/A' }}</td>
                <td class="px-4 py-2">{{ formatPhone(applicant.applicant.phone) }}</td>
                <td class="px-4 py-2">
                  <button @click="viewApplicant(applicant)"
                    class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                    title="View Applicant">
                    <i class="fas fa-eye"></i>
                  </button>
                </td>
                <td class="px-4 py-2">
                  <button @click="downloadResume(applicant._id, applicant.resume?.fileName)"
                    class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition relative"
                    title="Download File" :disabled="loading[applicant._id]">
                    <i v-if="!loading[applicant._id]" class="fas fa-cloud-download-alt"></i>
                    <i v-else class="fas fa-spinner fa-spin"></i>
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
          {{ Math.min(currentPage * itemsPerPage, filteredApplicants.length) }}
          of {{ totalApplicants }} applicants
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

      <!-- Modal -->
      <transition name="modal">
        <div v-if="showModal" class="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50"
          style="background-color: rgb(0 0 0 / 0.5);" @click.self="closeModal">
          <div class="bg-white rounded-lg shadow-md p-4 w-full max-w-2xl mx-4 transform transition-all">
            <div class="flex justify-between items-center mb-3 border-b border-gray-200 pb-2">
              <h3 class="text-lg font-semibold text-gray-900">Applicant Details</h3>
              <button @click="closeModal"
                class="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition" title="Close">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="grid gap-4 py-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Name</label>
                  <p class="mt-1 text-gray-900 bg-white border border-gray-300 rounded px-3 py-2">
                    {{ selectedApplicant?.applicant.first_name }} {{ selectedApplicant?.applicant.last_name || 'N/A' }}
                  </p>
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Position</label>
                  <p class="mt-1 text-gray-900 bg-white border border-gray-300 rounded px-3 py-2">
                    {{ selectedApplicant?.job.title || 'N/A' }}
                  </p>
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Department</label>
                  <p class="mt-1 text-gray-900 bg-white border border-gray-300 rounded px-3 py-2">
                    {{ selectedApplicant?.job.type || 'N/A' }}
                  </p>
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Gender</label>
                  <p class="mt-1 text-gray-900 bg-white border border-gray-300 rounded px-3 py-2">
                    {{ selectedApplicant?.applicant.gender || 'N/A' }}
                  </p>
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Phone</label>
                  <p class="mt-1 text-gray-900 bg-white border border-gray-300 rounded px-3 py-2">
                    {{ formatPhone(selectedApplicant?.applicant.phone) || 'N/A' }}
                  </p>
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Applied Date</label>
                  <p class="mt-1 text-gray-900 bg-white border border-gray-300 rounded px-3 py-2">
                    {{ formatDate(selectedApplicant?.createdAt) || 'N/A' }}
                  </p>
                </div>
                <div class="space-y-2 col-span-2">
                  <label class="block text-sm font-medium text-gray-700">Resume</label>
                  <p class="mt-1 text-gray-900 bg-white border border-gray-300 rounded px-3 py-2 truncate">
                    <button v-if="selectedApplicant?.resume?.fileName"
                      @click="downloadResume(selectedApplicant._id, selectedApplicant.resume.fileName)"
                      class="text-indigo-600 hover:text-indigo-800 underline inline-flex items-center gap-1"
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

export default {
  components: { FlatPickr },
  data() {
    return {
      appliedFrom: '',
      appliedTo: '',
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,
      totalApplicants: 0,
      flatpickrConfig: {
        dateFormat: 'd-M-Y',
        altInput: true,
        altFormat: 'd-M-Y',
        allowInput: true
      },
      showModal: false,
      selectedApplicant: null,
      applicants: [],
      loading: {} // Track loading state for each applicant
    };
  },
  computed: {
    filteredApplicants() {
      return this.applicants.filter((applicant) => {
        const fullName = `${applicant.applicant.first_name} ${applicant.applicant.last_name}`.toLowerCase();
        const matchSearch =
          this.searchQuery === '' ||
          fullName.includes(this.searchQuery.toLowerCase()) ||
          applicant.resume.fileName.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchDate =
          (!this.appliedFrom ||
            new Date(applicant.createdAt) >= new Date(this.appliedFrom)) &&
          (!this.appliedTo ||
            new Date(applicant.createdAt) <= new Date(this.appliedTo));
        return matchSearch && matchDate;
      });
    },
    paginatedApplicants() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredApplicants.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredApplicants.length / this.itemsPerPage);
    }
  },
  methods: {
    async fetchApplicants() {
      try {
        const response = await getAllApplicant({
          page: this.currentPage,
          limit: this.itemsPerPage
        });
        if (response.status === 1) {
          this.applicants = response.data;
          this.totalApplicants = response.pagination.total;
        }
      } catch (error) {
        console.error('Error fetching applicants:', error);
      }
    },
    async downloadResume(applicantId, fileName = 'resume.pdf') {
      try {
        this.loading[applicantId] = true; // Set loading state for this applicant
        const response = await getOneResume(applicantId);
        const blob = new Blob([response], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error('Download failed:', error);
      } finally {
        this.loading[applicantId] = false; // Reset loading state
      }
    },
    filterData() {
      this.currentPage = 1;
      this.fetchApplicants();
    },
    resetFilters() {
      this.appliedFrom = '';
      this.appliedTo = '';
      this.searchQuery = '';
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
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.showModal) {
        this.closeModal();
      }
    });
  }
};
</script>

<style scoped>
/* Custom styles for date picker */
.flatpickr-input {
  background-color: white;
}

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