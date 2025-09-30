<template>
  <div class="w-full">
    <!-- Fixed-Position Alerts -->
    <div class="fixed z-50 w-full max-w-xs space-y-4 top-4 right-4">
      <div v-if="successMessage"
        class="p-4 text-white transition-opacity duration-500 ease-in-out bg-green-500 rounded-lg shadow-md"
        :class="{ 'opacity-0': !successMessage }">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage"
        class="p-4 text-white transition-opacity duration-500 ease-in-out bg-red-500 rounded-lg shadow-md"
        :class="{ 'opacity-0': !errorMessage }">
        {{ errorMessage }}
      </div>
    </div>

    <div class="flex items-center justify-between mb-6">
      <h2 class="text-3xl font-extrabold text-gray-900">Tab Content</h2>
      <button @click="openCreateModal" :disabled="loading"
        class="px-6 py-2 font-medium text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
        Create Tab Content
      </button>
    </div>

    <!-- Filter Section -->
    <div class="p-6 mb-8 bg-white rounded-lg shadow-sm">
      <div class="flex flex-col items-end gap-4 sm:flex-row">
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700">
            Search Tab Content
          </label>
          <input type="text" v-model="searchQuery"
            class="border border-gray-300 rounded-lg px-4 py-2 w-[300px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Search by title or points" />
        </div>
        <div class="flex gap-4">
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

    <div v-if="loading" class="py-4 text-center">
      <i class="text-6xl text-green-700 fas fa-spinner fa-spin"></i>
    </div>

    <!-- Table Section -->
    <div class="overflow-hidden bg-white rounded-lg shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm table-auto">
          <thead class="text-xs font-semibold text-gray-600 uppercase bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-left">No</th>
              <th class="px-4 py-3 text-left">Main Content</th>
              <th class="px-4 py-3 text-left">Title</th>
              <th class="px-4 py-3 text-left">Points</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr v-for="(content, index) in paginatedTabContents" :key="content.id"
              class="transition border-b border-gray-200 hover:bg-gray-50">
              <td class="px-4 py-3">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-4 py-3">{{ getMainContentTitle(content.mainContentId) }}</td>
              <td class="px-4 py-3">{{ content.title }}</td>
              <td class="px-4 py-3">{{ content.points }}</td>
              <td class="flex gap-2 px-4 py-3">
                <button @click="openViewModal(content)"
                  class="p-2 text-indigo-600 transition rounded-full hover:text-indigo-800 hover:bg-indigo-100"
                  title="View Tab Content">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="openEditModal(content)" :disabled="loading"
                  class="p-2 text-indigo-600 transition rounded-full hover:text-indigo-800 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Edit Tab Content">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="confirmDelete(content.id)" :disabled="loading"
                  class="p-2 text-red-600 transition rounded-full hover:text-red-800 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete Tab Content">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="flex items-center justify-between mt-6">
      <div class="text-sm text-gray-600">
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
        {{ Math.min(currentPage * itemsPerPage, filteredTabContents.length) }}
        of {{ filteredTabContents.length }} tab contents
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

    <!-- Modal for View Tab Content -->
    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showViewModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60" @click.self="closeViewModal">
        <div
          class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all max-h-[80vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900">Tab Content Details</h3>
            <button @click="closeViewModal"
              class="p-2 text-gray-500 transition rounded-full hover:text-gray-700 hover:bg-gray-100" title="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div v-if="selectedTabContent" class="pt-5 space-y-5 border-t border-gray-200">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="text-sm font-semibold text-gray-600">Main Content</label>
                <p class="font-medium text-gray-900">{{ getMainContentTitle(selectedTabContent.mainContentId) }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Title</label>
                <p class="font-medium text-gray-900">{{ selectedTabContent.title }}</p>
              </div>
              <div class="sm:col-span-2">
                <label class="text-sm font-semibold text-gray-600">Points</label>
                <p class="font-medium text-gray-900">{{ selectedTabContent.points }}</p>
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

    <!-- Modal for Create/Update Tab Content -->
    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showCreateModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60" @click.self="closeCreateModal">
        <div
          class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all max-h-[80vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900">
              {{ isEditing ? 'Edit Tab Content' : 'Create Tab Content' }}
            </h3>
            <button @click="closeCreateModal"
              class="p-2 text-gray-500 transition rounded-full hover:text-gray-700 hover:bg-gray-100" title="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="pt-5 space-y-5 border-t border-gray-200">
            <div>
              <label class="text-sm font-semibold text-gray-600">Main Content</label>
              <select v-model="form.mainContentId"
                class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="" disabled>Select Main Content</option>
                <option v-for="content in mainContents" :key="content.id" :value="content.id">
                  {{ content.title }}
                </option>
              </select>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Title</label>
              <input v-model="form.title" type="text"
                class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter content title" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Points</label>
              <textarea v-model="form.points"
                class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter content points" rows="3"></textarea>
            </div>
          </div>
          <div class="flex justify-end gap-4 mt-8">
            <button @click="closeCreateModal"
              class="px-6 py-2 font-medium text-gray-800 transition duration-200 bg-gray-200 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
            <button @click="saveTabContent" :disabled="loading"
              class="px-6 py-2 font-medium text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isEditing ? 'Update' : 'Create' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal for Delete Confirmation -->
    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showDeleteModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60" @click.self="closeDeleteModal">
        <div class="w-full max-w-md p-8 mx-4 transition-all transform bg-white shadow-2xl rounded-xl">
          <div class="text-center">
            <i class="mb-4 text-5xl text-red-500 fas fa-exclamation-triangle"></i>
            <h3 class="mb-2 text-2xl font-bold text-gray-900">Confirm Deletion</h3>
            <p class="text-gray-600">Are you sure you want to delete this tab content? This action cannot be undone.</p>
          </div>
          <div class="flex justify-center gap-4 mt-8">
            <button @click="closeDeleteModal"
              class="px-6 py-2 font-medium text-gray-800 transition duration-200 bg-gray-200 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
            <button @click="deleteTabContentConfirmed" :disabled="loading"
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
import { getAllMainContent } from '@/apis/main-content';
import {
  createTabContent,
  getAllTabContent,
  getOneTabContent,
  updateTabContent,
  deleteTabContent
} from '@/apis/tab-content';

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
      selectedTabContent: null,
      tabContentToDeleteId: null,
      form: {
        id: null,
        mainContentId: '',
        title: '',
        points: ''
      },
      mainContents: [],
      tabContents: [],
      loading: false,
      successMessage: '',
      errorMessage: ''
    };
  },
  computed: {
    filteredTabContents() {
      if (!Array.isArray(this.tabContents)) {
        return [];
      }
      const query = this.searchQuery.toLowerCase();
      return this.tabContents.filter((content) => {
const mainContent = this.mainContents.find(mc => mc.id === content.mainContentId);
        const mainContentTitle = mainContent ? mainContent.title.toLowerCase() : '';
        return (
          this.searchQuery === '' ||
          (content.title && content.title.toLowerCase().includes(query)) ||
          (content.points && content.points.toLowerCase().includes(query)) ||
          mainContentTitle.includes(query)
        );
      });
    },
    paginatedTabContents() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredTabContents.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredTabContents.length / this.itemsPerPage) || 1;
    }
  },
  methods: {
    // Unified alert system
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

    // Fetch all main contents for dropdown
    async fetchMainContents() {
      try {
        const response = await getAllMainContent();
        if (response && response.status === 1) {
          this.mainContents = response.data.map(content => ({
            id: content._id,
            title: content.title
          }));
        } else {
          console.error('Invalid response format:', {
            status: response?.status,
            data: response?.data
          });
          this.alert('Failed to load main contents. Invalid response format.', 'error');
          this.mainContents = [];
        }
      } catch (error) {
        console.error('Error fetching main contents:', error);
        this.alert('Error fetching main contents: ' + error.message, 'error');
        this.mainContents = [];
      }
    },

    // Fetch all tab contents
    async fetchTabContents() {
      this.loading = true;
      try {
        const response = await getAllTabContent();
        if (response && response.status === 1) {
          this.tabContents = response.data.map(content => ({
            id: content._id,
            mainContentId: content.mainContentId,
            title: content.title,
            points: content.points
          }));
        } else {
          console.error('Invalid response format:', {
            status: response?.status,
            data: response?.data
          });
          this.alert('Failed to load tab contents. Invalid response format.', 'error');
          this.tabContents = [];
        }
      } catch (error) {
        console.error('Error fetching tab contents:', error);
        this.alert('Error fetching tab contents: ' + error.message, 'error');
        this.tabContents = [];
      } finally {
        this.loading = false;
      }
    },

    // Get main content title by ID
    getMainContentTitle(mainContentId) {
      const mainContent = this.mainContents.find(mc => mc.id === mainContentId);
      return mainContent ? mainContent.title : 'Unknown';
    },

    // Save (Create/Update) Tab Content
    async saveTabContent() {
      if (!this.form.mainContentId || !this.form.title || !this.form.points) {
        this.alert('Please fill in all required fields (Main Content, Title, Points).', 'error');
        return;
      }
      this.loading = true;
      try {
        const formData = {
          mainContentId: this.form.mainContentId,
          title: this.form.title,
          points: this.form.points
        };
        if (this.isEditing) {
          const updatedContent = await updateTabContent(this.form.id, formData);
          if (updatedContent && updatedContent.status === 1) {
            await this.fetchTabContents();
            this.alert('Tab content updated successfully!');
          } else {
            this.alert('Failed to update tab content. Please try again.', 'error');
          }
        } else {
          const newContent = await createTabContent(formData);
          if (newContent && newContent.status === 1) {
            await this.fetchTabContents();
            this.alert('Tab content created successfully!');
          } else {
            this.alert('Failed to create tab content. Please try again.', 'error');
          }
        }
        this.closeCreateModal();
      } catch (error) {
        console.error('Error saving tab content:', error);
        this.alert('Error saving tab content: ' + error.message, 'error');
      } finally {
        this.loading = false;
      }
    },

    // Open delete confirmation modal
    confirmDelete(id) {
      if (!id) {
        this.alert('Invalid tab content ID.', 'error');
        return;
      }
      this.tabContentToDeleteId = id;
      this.showDeleteModal = true;
    },

    // Execute delete after confirmation
    async deleteTabContentConfirmed() {
      if (!this.tabContentToDeleteId) {
        this.alert('No tab content selected for deletion.', 'error');
        return;
      }
      this.loading = true;
      try {
        const result = await deleteTabContent(this.tabContentToDeleteId);
        if (result && [1].includes(result.status)) {
          await this.fetchTabContents();
          this.alert('Tab content deleted successfully!');
        } else {
          this.alert(`Failed to delete tab content. Status: ${result?.status || 'unknown'}`, 'error');
        }
      } catch (error) {
        console.error('Error deleting tab content:', error);
        this.alert('Error deleting tab content: ' + error.message, 'error');
      } finally {
        this.loading = false;
        this.closeDeleteModal();
      }
    },

    // Filter and Reset
    filterData() {
      this.currentPage = 1;
    },
    resetFilters() {
      this.searchQuery = '';
      this.currentPage = 1;
    },

    // Modal Handlers
    openCreateModal() {
      this.isEditing = false;
      this.form = {
        id: null,
        mainContentId: '',
        title: '',
        points: ''
      };
      this.showCreateModal = true;
    },
    async openEditModal(content) {
      if (!content.id) {
        this.alert('Invalid tab content ID.', 'error');
        return;
      }
      this.loading = true;
      try {
        const result = await getOneTabContent(content.id);
        if (result && result.status === 1 && result.data) {
          const contentData = result.data;
          this.isEditing = true;
          this.form = {
            id: contentData._id,
            mainContentId: contentData.mainContentId || '',
            title: contentData.title || '',
            points: contentData.points || ''
          };
          this.showCreateModal = true;
        } else {
          this.alert('Failed to fetch tab content for editing. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Error fetching tab content for edit:', error);
        this.alert('Error fetching tab content for editing: ' + error.message, 'error');
      } finally {
        this.loading = false;
      }
    },
    async openViewModal(content) {
      if (!content.id) {
        this.alert('Invalid tab content ID.', 'error');
        return;
      }
      this.loading = true;
      try {
        const result = await getOneTabContent(content.id);
        if (result && result.status === 1 && result.data) {
          const contentData = result.data;
          this.selectedTabContent = {
            id: contentData._id,
            mainContentId: contentData.mainContentId || '',
            title: contentData.title || '',
            points: contentData.points || ''
          };
          this.showViewModal = true;
        } else {
          this.alert('Failed to fetch tab content for viewing. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Error fetching tab content for view:', error);
        this.alert('Error fetching tab content for viewing: ' + error.message, 'error');
      } finally {
        this.loading = false;
      }
    },
    closeCreateModal() {
      this.showCreateModal = false;
      this.isEditing = false;
      this.form = {
        id: null,
        mainContentId: '',
        title: '',
        points: ''
      };
    },
    closeViewModal() {
      this.showViewModal = false;
      this.selectedTabContent = null;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.tabContentToDeleteId = null;
    },

    // Pagination Handlers
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    goToPage(page) {
      this.currentPage = page;
    }
  },
  async mounted() {
    await this.fetchMainContents();
    await this.fetchTabContents();
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.showCreateModal) this.closeCreateModal();
        if (this.showViewModal) this.closeViewModal();
        if (this.showDeleteModal) this.closeDeleteModal();
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

/* Custom scrollbar for modals */
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