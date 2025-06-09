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
            <label class="text-sm font-medium text-gray-700 mb-2"
              >Date Range</label
            >
            <div class="flex gap-4">
              <flat-pickr
                v-model="appliedFrom"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="From"
                :config="flatpickrConfig"
              ></flat-pickr>
              <flat-pickr
                v-model="appliedTo"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="To"
                :config="flatpickrConfig"
              ></flat-pickr>
            </div>
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2"
              >Search Applicants</label
            >
            <input
              type="text"
              v-model="searchQuery"
              class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="Search by name or file"
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
      <div class="bg-white shadow-sm rounded-lg overflow-hidden flex-1">
        <div class="overflow-x-auto h-full">
          <table class="min-w-full table-auto text-sm">
            <thead
              class="bg-gray-100 text-gray-600 uppercase text-xs font-semibold"
            >
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
              <tr
                v-for="(applicant, index) in paginatedApplicants"
                :key="index"
                class="hover:bg-gray-50 transition border-b border-gray-200"
              >
                <td class="px-4 py-2">
                  {{ index + 1 + (currentPage - 1) * itemsPerPage }}
                </td>
                <td class="px-4 py-2">{{ applicant.date }}</td>
                <td class="px-4 py-2">{{ applicant.name }}</td>
                <td class="px-4 py-2">{{ applicant.position }}</td>
                <td class="px-4 py-2">{{ applicant.department }}</td>
                <td class="px-4 py-2">{{ applicant.gender }}</td>
                <td class="px-4 py-2">{{ formatPhone(applicant.phone) }}</td>
                <td class="px-4 py-2">
                  <button
                    @click="viewApplicant(applicant)"
                    class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                    title="View Applicant"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                </td>
                <td class="px-4 py-2">
                  <a
                    :href="applicant.download"
                    target="_blank"
                    download
                    class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                    title="Download File"
                  >
                    <i class="fas fa-cloud-download-alt"></i>
                  </a>
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
          of {{ filteredApplicants.length }} applicants
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

      <!-- Modal for Applicant Details -->
      <transition name="modal">
        <div
          v-if="showModal"
          class="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50"
          @click.self="closeModal"
        >
          <div
            class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all"
          >
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-bold text-gray-900">
                Applicant Details
              </h3>
              <button
                @click="closeModal"
                class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
                title="Close"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div
              v-if="selectedApplicant"
              class="space-y-5 border-t border-gray-200 pt-5"
            >
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label class="text-sm font-semibold text-gray-600"
                    >Name</label
                  >
                  <p class="text-gray-900 font-medium">
                    {{ selectedApplicant.name }}
                  </p>
                </div>
                <div>
                  <label class="text-sm font-semibold text-gray-600"
                    >Position</label
                  >
                  <p class="text-gray-900 font-medium">
                    {{ selectedApplicant.position }}
                  </p>
                </div>
                <div>
                  <label class="text-sm font-semibold text-gray-600"
                    >Department</label
                  >
                  <p class="text-gray-900 font-medium">
                    {{ selectedApplicant.department }}
                  </p>
                </div>
                <div>
                  <label class="text-sm font-semibold text-gray-600"
                    >Gender</label
                  >
                  <p class="text-gray-900 font-medium">
                    {{ selectedApplicant.gender }}
                  </p>
                </div>
                <div>
                  <label class="text-sm font-semibold text-gray-600"
                    >Phone</label
                  >
                  <p class="text-gray-900 font-medium">
                    {{ formatPhone(selectedApplicant.phone) }}
                  </p>
                </div>
                <div>
                  <label class="text-sm font-semibold text-gray-600"
                    >Applied Date</label
                  >
                  <p class="text-gray-900 font-medium">
                    {{ selectedApplicant.date }}
                  </p>
                </div>
                <div class="sm:col-span-2">
                  <label class="text-sm font-semibold text-gray-600"
                    >Resume</label
                  >
                  <p class="text-gray-900 font-medium truncate">
                    <a
                      :href="selectedApplicant.download"
                      target="_blank"
                      download
                      class="text-indigo-600 hover:text-indigo-800 underline inline-flex items-center gap-1"
                    >
                      <i class="fas fa-cloud-download-alt"></i>
                      {{ selectedApplicant.download }}
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-8 flex justify-end">
              <button
                @click="closeModal"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
              >
                Close
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

export default {
  components: {
    FlatPickr
  },
  data() {
    return {
      appliedFrom: '',
      appliedTo: '',
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,
      flatpickrConfig: {
        dateFormat: 'd-M-Y',
        altInput: true,
        altFormat: 'd-M-Y',
        allowInput: true
      },
      showModal: false,
      selectedApplicant: null,
      applicants: [
        {
          download:
            'Supervisor Database Administration -IT_Rath SamOeurn and CV.pdf',
          date: '06-Jun-2025',
          name: 'Rath SamOeurn',
          position: 'Supervisor (Database Administrator)',
          department: 'Information Technology',
          gender: 'Male',
          phone: '85569604'
        },
        {
          download: 'Phanpheanuma Run Resume.pdf',
          date: '04-Jun-2025',
          name: 'Run Phanpheanuma',
          position: 'Assistant Manager',
          department: 'Accounting and Finance',
          gender: 'Female',
          phone: '09791242'
        },
        {
          download: 'uch-danet_senior staff_infrastructure_CV_CL.pdf',
          date: '03-Jun-2025',
          name: 'UCH DANET',
          position: 'Senior Staff (Infrastructure)',
          department: 'Information Technology',
          gender: 'Male',
          phone: '07056998'
        },
        {
          download: 'att.eEDjRvSn0bMl-...jpeg',
          date: '03-Jun-2025',
          name: 'Yem Sorphorn',
          position: 'Intern',
          department: 'Credit Control',
          gender: 'Female',
          phone: '09667308'
        },
        {
          download: 'Cheng Seakgech CV.pdf',
          date: '03-Jun-2025',
          name: 'Cheng Seakgech',
          position: 'Intern',
          department: 'Credit Control',
          gender: 'Female',
          phone: '01694828'
        },
        {
          download: 'JulrichCV.pdf',
          date: '03-Jun-2025',
          name: 'Julrich',
          position: 'Senior Staff (Infrastructure)',
          department: 'Information Technology',
          gender: 'Male',
          phone: '01648641'
        },
        {
          download: 'CV-Professional Resume - UY SREYNICH.pdf',
          date: '30-May-2025',
          name: 'Uy Sreynich',
          position: 'Assistant Manager',
          department: 'Accounting and Finance',
          gender: 'Female',
          phone: '07055959'
        },
        {
          download: 'Mrs. Bros Mouykeang CV Resume.pdf',
          date: '30-May-2025',
          name: 'Bros Mouykeang',
          position: 'Assistant Manager',
          department: 'Accounting and Finance',
          gender: 'Female',
          phone: '08676756'
        },
        {
          download: 'Mrs. Bros Mouykeang CV Resume.pdf',
          date: '30-May-2025',
          name: 'Bros Mouykeang',
          position: 'Assistant Manager',
          department: 'Accounting and Finance',
          gender: 'Female',
          phone: '08676756'
        },
        {
          download: 'Mrs. Bros Mouykeang CV Resume.pdf',
          date: '30-May-2025',
          name: 'Bros Mouykeang',
          position: 'Assistant Manager',
          department: 'Accounting and Finance',
          gender: 'Female',
          phone: '08676756'
        },
        {
          download: 'Mrs. Bros Mouykeang CV Resume.pdf',
          date: '30-May-2025',
          name: 'Bros Mouykeang',
          position: 'Assistant Manager',
          department: 'Accounting and Finance',
          gender: 'Female',
          phone: '08676756'
        },
        {
          download: 'Mrs. Bros Mouykeang CV Resume.pdf',
          date: '30-May-2025',
          name: 'Bros Mouykeang',
          position: 'Assistant Manager',
          department: 'Accounting and Finance',
          gender: 'Female',
          phone: '08676756'
        },
        {
          download: 'Mrs. Bros Mouykeang CV Resume.pdf',
          date: '30-May-2025',
          name: 'Bros Mouykeang',
          position: 'Assistant Manager',
          department: 'Accounting and Finance',
          gender: 'Female',
          phone: '08676756'
        },
        {
          download: 'Mrs. Bros Mouykeang CV Resume.pdf',
          date: '30-May-2025',
          name: 'Bros Mouykeang',
          position: 'Assistant Manager',
          department: 'Accounting and Finance',
          gender: 'Female',
          phone: '08676756'
        },
        {
          download: 'Mrs. Bros Mouykeang CV Resume.pdf',
          date: '30-May-2025',
          name: 'Bros Mouykeang',
          position: 'Assistant Manager',
          department: 'Accounting and Finance',
          gender: 'Female',
          phone: '08676756'
        },
        {
          download: 'Mrs. Bros Mouykeang CV Resume.pdf',
          date: '30-May-2025',
          name: 'Bros Mouykeang',
          position: 'Assistant Manager',
          department: 'Accounting and Finance',
          gender: 'Female',
          phone: '08676756'
        },
        {
          download: 'Mrs. Bros Mouykeang CV Resume.pdf',
          date: '30-May-2025',
          name: 'Bros Mouykeang',
          position: 'Assistant Manager',
          department: 'Accounting and Finance',
          gender: 'Female',
          phone: '08676756'
        },
        {
          download: 'Mrs. Bros Mouykeang CV Resume.pdf',
          date: '30-May-2025',
          name: 'Bros Mouykeang',
          position: 'Assistant Manager',
          department: 'Accounting and Finance',
          gender: 'Female',
          phone: '08676756'
        },
        {
          download: 'Mrs. Bros Mouykeang CV Resume.pdf',
          date: '30-May-2025',
          name: 'Bros Mouykeang',
          position: 'Assistant Manager',
          department: 'Accounting and Finance',
          gender: 'Female',
          phone: '08676756'
        }
      ]
    };
  },
  computed: {
    filteredApplicants() {
      return this.applicants.filter((applicant) => {
        const matchSearch =
          this.searchQuery === '' ||
          applicant.name
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          applicant.download
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());
        const matchDate =
          (!this.appliedFrom ||
            new Date(applicant.date) >= new Date(this.appliedFrom)) &&
          (!this.appliedTo ||
            new Date(applicant.date) <= new Date(this.appliedTo));
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
    filterData() {
      this.currentPage = 1; // Reset to first page on filter
    },
    resetFilters() {
      this.appliedFrom = '';
      this.appliedTo = '';
      this.searchQuery = '';
      this.currentPage = 1; // Reset to first page on reset
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
      return phone.startsWith('0') ? phone : '0' + phone;
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
    // Add keyboard event listener for closing modal with Escape key
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
