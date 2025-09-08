<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-extrabold text-gray-900">Job Titles</h2>
      <button
        @click="openCreateModal"
        :disabled="loading"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Create Job Title
      </button>
    </div>

    <div class="fixed top-4 right-4 z-50 space-y-4 w-full max-w-xs">
      <div
        v-if="successMessage"
        class="p-4 rounded-lg shadow-md bg-green-500 text-white transition-opacity duration-500 ease-in-out"
        :class="{ 'opacity-0': !successMessage }"
      >
        {{ successMessage }}
      </div>
      <div
        v-if="errorMessage"
        class="p-4 rounded-lg shadow-md bg-red-500 text-white transition-opacity duration-500 ease-in-out"
        :class="{ 'opacity-0': !errorMessage }"
      >
        {{ errorMessage }}
      </div>
    </div>

    <div class="bg-white shadow-sm rounded-lg p-6 mb-8">
      <div class="flex flex-col sm:flex-row items-end gap-4">
        <div>
          <label class="text-sm font-medium text-gray-700 mb-2 block">
            Search Job Titles
          </label>
          <input
            type="text"
            v-model="searchQuery"
            class="border border-gray-300 rounded-lg px-4 py-2 w-[300px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Search by title (KH or EN)"
          />
        </div>
        <div class="flex gap-4">
          <button
            @click="filterData"
            :disabled="loading"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Search
          </button>
          <button
            @click="resetFilters"
            :disabled="loading"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="py-4 text-center">
      <i class="text-6xl text-green-700 fas fa-spinner fa-spin"></i>
    </div>

    <div class="bg-white shadow-sm rounded-lg overflow-hidden" v-else>
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto text-sm">
          <thead
            class="bg-gray-100 text-gray-600 uppercase text-xs font-semibold"
          >
            <tr>
              <th class="px-4 py-3 text-left">No</th>
              <th class="px-4 py-3 text-left">Job Title (KH)</th>
              <th class="px-4 py-3 text-left">Job Title (EN)</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr
              v-for="(jobTitle, index) in paginatedJobTitles"
              :key="jobTitle.id"
              class="transition border-b border-gray-200 hover:bg-gray-50"
            >
              <td class="px-4 py-3">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-4 py-3">{{ jobTitle.des_kh }}</td>
              <td class="px-4 py-3">{{ jobTitle.des_en }}</td>
              <td class="px-4 py-3 flex gap-2">
                <button
                  @click="openViewModal(jobTitle)"
                  :disabled="loading"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="View Job Title"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button
                  @click="openEditModal(jobTitle)"
                  :disabled="loading"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Edit Job Title"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="confirmDelete(jobTitle.id)"
                  :disabled="loading"
                  class="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete Job Title"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="paginatedJobTitles.length === 0">
              <td colspan="4" class="px-4 py-3 text-center text-gray-500">
                No job titles found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mt-6 flex justify-between items-center">
      <div class="text-sm text-gray-600">
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
        {{ Math.min(currentPage * itemsPerPage, filteredJobTitles.length) }}
        of {{ filteredJobTitles.length }} job titles
      </div>
      <div class="flex gap-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1 || loading"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition duration-200"
        >
          Previous
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :disabled="loading"
          :class="[
            'px-4 py-2 rounded-lg transition duration-200',
            currentPage === page
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300',
            loading ? 'opacity-50 cursor-not-allowed' : ''
          ]"
        >
          {{ page }}
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages || loading"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition duration-200"
        >
          Next
        </button>
      </div>
    </div>

    <transition name="modal">
      <div
        style="background-color: rgb(0 0 0 / 0.5)"
        v-if="showViewModal"
        class="fixed inset-0 bg-gray-500 bg-opacity-60 flex items-center justify-center z-50"
        @click.self="closeViewModal"
      >
        <div
          class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all max-h-[80vh] overflow-y-auto"
        >
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900">Job Title Details</h3>
            <button
              @click="closeViewModal"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
              title="Close"
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
                  >Job Title (KH)</label
                >
                <p class="text-gray-900 font-medium">
                  {{ selectedJobTitle.des_kh }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600"
                  >Job Title (EN)</label
                >
                <p class="text-gray-900 font-medium">
                  {{ selectedJobTitle.des_en }}
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

    <transition name="modal">
      <div
        style="background-color: rgb(0 0 0 / 0.5)"
        v-if="showCreateModal"
        class="fixed inset-0 bg-gray-500 bg-opacity-60 flex items-center justify-center z-50"
        @click.self="closeCreateModal"
      >
        <div
          class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all max-h-[80vh] overflow-y-auto"
        >
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900">
              {{ isEditing ? 'Edit Job Title' : 'Create Job Title' }}
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
                >Job Title (KH)</label
              >
              <input
                v-model="form.des_kh"
                type="text"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter job title in Khmer"
              />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600"
                >Job Title (EN)</label
              >
              <input
                v-model="form.des_en"
                type="text"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter job title in English"
              />
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
              :disabled="loading"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isEditing ? 'Update' : 'Create' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="modal">
      <div
        style="background-color: rgb(0 0 0 / 0.5)"
        v-if="showDeleteModal"
        class="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50"
        @click.self="closeDeleteModal"
      >
        <div
          class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4 transform transition-all"
        >
          <div class="text-center">
            <i
              class="fas fa-exclamation-triangle text-red-500 text-5xl mb-4"
            ></i>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">
              Confirm Deletion
            </h3>
            <p class="text-gray-600">
              Are you sure you want to delete this job title? This action cannot
              be undone.
            </p>
          </div>
          <div class="mt-8 flex justify-center gap-4">
            <button
              @click="closeDeleteModal"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition duration-200"
            >
              Cancel
            </button>
            <button
              @click="deleteJobTitle"
              :disabled="loading"
              class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import {
  getAllJobTitle,
  getOneJobTitle,
  createJobTitle,
  updateJobTitle,
  deleteJobTitle
} from '@/apis/jobs';

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
      selectedJobTitle: null,
      jobTitleToDeleteId: null,
      form: {
        id: null,
        des_kh: '',
        des_en: ''
      },
      jobTitles: [],
      errorMessage: '',
      successMessage: '',
      loading: false
    };
  },
  computed: {
    filteredJobTitles() {
      return this.jobTitles.filter((jobTitle) => {
        const matchSearch =
          this.searchQuery === '' ||
          (jobTitle.des_kh &&
            jobTitle.des_kh
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase())) ||
          (jobTitle.des_en &&
            jobTitle.des_en
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase()));
        return matchSearch;
      });
    },
    paginatedJobTitles() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredJobTitles.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredJobTitles.length / this.itemsPerPage) || 1;
    }
  },
  methods: {
    alert(message, type = 'success') {
      console.log('Alert:', { message, type });
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
    async getAllJobTitles() {
      this.loading = true;
      try {
        const result = await getAllJobTitle();
        console.log('getAllJobTitle response:', result);
        if (result && result.status === 1 && Array.isArray(result.jobs)) {
          this.jobTitles = result.jobs.map((job) => ({
            id: job._id,
            des_kh: job.des_kh,
            des_en: job.des_en
          }));
        } else {
          console.error('Invalid response format:', {
            status: result?.status,
            jobs: result?.jobs
          });
          this.alert(
            'Failed to load job titles. Invalid response format.',
            'error'
          );
          this.jobTitles = [];
        }
      } catch (error) {
        console.error('Error fetching job titles:', error);
        this.alert('Error fetching job titles: ' + error.message, 'error');
      } finally {
        this.loading = false;
      }
    },
    async saveJobTitle() {
      if (!this.form.des_kh || !this.form.des_en) {
        this.alert(
          'Please fill in all required fields (Job Title (KH) and Job Title (EN)).',
          'error'
        );
        return;
      }
      this.loading = true;
      try {
        if (this.isEditing) {
          const { id, ...formData } = this.form;
          const updatedJobTitle = await updateJobTitle(this.form.id, formData);
          console.log('updateJobTitle response:', updatedJobTitle);
          if (updatedJobTitle && updatedJobTitle.status === 1) {
            await this.getAllJobTitles();
            this.alert('Job title updated successfully!', 'success');
          } else {
            this.alert(
              'Failed to update job title. Please try again.',
              'error'
            );
          }
        } else {
          const { id, ...formData } = this.form;
          const newJobTitle = await createJobTitle(formData);
          console.log('createJobTitle response:', newJobTitle);
          if (newJobTitle && newJobTitle.status === 1) {
            await this.getAllJobTitles();
            this.alert('Job title created successfully!', 'success');
          } else {
            this.alert(
              'Failed to create job title. Please try again.',
              'error'
            );
          }
        }
        this.closeCreateModal();
      } catch (error) {
        console.error('Error saving job title:', error);
        this.alert('Error saving job title: ' + error.message, 'error');
      } finally {
        this.loading = false;
      }
    },
    async openEditModal(jobTitle) {
      console.log('Job Title for editing:', jobTitle);
      if (!jobTitle.id) {
        this.alert('Invalid job title ID.', 'error');
        return;
      }
      this.loading = true;
      try {
        const response = await getOneJobTitle(jobTitle.id);
        console.log('getOneJobTitle response:', response);
        if (response && response.status === 1) {
          const jobData = response.job || response.data;
          if (jobData) {
            this.isEditing = true;
            this.form = {
              id: jobData._id,
              des_kh: jobData.des_kh || '',
              des_en: jobData.des_en || ''
            };
            this.showCreateModal = true;
            this.alert(
              'Job title fetched successfully for editing.',
              'success'
            );
          } else {
            this.alert(
              'Failed to fetch job title for editing. No data returned.',
              'error'
            );
          }
        } else {
          this.alert(
            'Failed to fetch job title for editing. Please try again.',
            'error'
          );
        }
      } catch (error) {
        console.error('Error fetching job title for edit:', error);
        this.alert(
          'Error fetching job title for editing: ' + error.message,
          'error'
        );
      } finally {
        this.loading = false;
      }
    },
    async openViewModal(jobTitle) {
      console.log('Job Title for viewing:', jobTitle);
      if (!jobTitle.id) {
        this.alert('Invalid job title ID.', 'error');
        return;
      }
      this.loading = true;
      try {
        const response = await getOneJobTitle(jobTitle.id);
        console.log('getOneJobTitle response:', response);
        if (response && response.status === 1) {
          const jobData = response.job || response.data;
          if (jobData) {
            this.selectedJobTitle = {
              id: jobData._id,
              des_kh: jobData.des_kh || '',
              des_en: jobData.des_en || ''
            };
            this.showViewModal = true;
            this.alert(
              'Job title fetched successfully for viewing.',
              'success'
            );
          } else {
            this.alert(
              'Failed to fetch job title for viewing. No data returned.',
              'error'
            );
          }
        } else {
          this.alert(
            'Failed to fetch job title for viewing. Please try again.',
            'error'
          );
        }
      } catch (error) {
        console.error('Error fetching job title for view:', error);
        this.alert(
          'Error fetching job title for viewing: ' + error.message,
          'error'
        );
      } finally {
        this.loading = false;
      }
    },
    confirmDelete(id) {
      console.log('Confirm Delete ID:', id);
      this.jobTitleToDeleteId = id;
      this.showDeleteModal = true;
    },
    async deleteJobTitle() {
      if (!this.jobTitleToDeleteId) {
        this.alert('No job title selected for deletion.', 'error');
        return;
      }
      this.loading = true;
      try {
        console.log('Deleting job title with ID:', this.jobTitleToDeleteId);
        const result = await deleteJobTitle(this.jobTitleToDeleteId);
        console.log('deleteJobTitle response:', result);
        if (result && result.status === 1) {
          await this.getAllJobTitles();
          this.alert('Job title deleted successfully!', 'success');
        } else {
          this.alert('Failed to delete job title. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Error deleting job title:', error);
        this.alert('Error deleting job title: ' + error.message, 'error');
      } finally {
        this.loading = false;
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
        id: null,
        des_kh: '',
        des_en: ''
      };
      this.showCreateModal = true;
    },
    closeCreateModal() {
      this.showCreateModal = false;
      this.isEditing = false;
      this.form = {
        id: null,
        des_kh: '',
        des_en: ''
      };
    },
    closeViewModal() {
      this.showViewModal = false;
      this.selectedJobTitle = null;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.jobTitleToDeleteId = null;
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
    this.getAllJobTitles();
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.showCreateModal) {
          this.closeCreateModal();
        }
        if (this.showViewModal) {
          this.closeViewModal();
        }
        if (this.showDeleteModal) {
          this.closeDeleteModal();
        }
      }
    });
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
