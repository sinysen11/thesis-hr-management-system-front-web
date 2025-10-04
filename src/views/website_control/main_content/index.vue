<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-3xl font-extrabold text-gray-900">Main Content</h2>
      <button @click="openCreateModal" :disabled="loading"
        class="px-6 py-2 font-medium text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
        Create Main Content
      </button>
    </div>

    <!-- Filter Section -->
    <div class="p-6 mb-8 bg-white rounded-lg shadow-sm">
      <div class="flex flex-col items-end gap-4 sm:flex-row">
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700">
            Search Main Content
          </label>
          <input type="text" v-model="searchQuery"
            class="border border-gray-300 rounded-lg px-4 py-2 w-[300px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Search by type, title, or description" />
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
              <th class="px-4 py-3 text-left">Type</th>
              <th class="px-4 py-3 text-left">Title</th>
              <th class="px-4 py-3 text-left">Description</th>
              <th class="px-4 py-3 text-left">Images</th>
              <th class="px-4 py-3 text-left">Status</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr v-for="(content, index) in paginatedMainContents" :key="content.id"
              class="transition border-b border-gray-200 hover:bg-gray-50">
              <td class="px-4 py-3">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-4 py-3">{{ content.type }}</td>
              <td class="px-4 py-3">{{ content.title }}</td>
              <td class="px-4 py-3">{{ content.description }}</td>
              <td class="px-4 py-3">{{ content.images ? content.images.join(', ') : 'None' }}</td>
              <td class="px-4 py-3">{{ content.status }}</td>
              <td class="flex gap-2 px-4 py-3">
                <button @click="openViewModal(content)"
                  class="p-2 text-indigo-600 transition rounded-full hover:text-indigo-800 hover:bg-indigo-100"
                  title="View Main Content">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="openEditModal(content)" :disabled="loading"
                  class="p-2 text-indigo-600 transition rounded-full hover:text-indigo-800 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Edit Main Content">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="confirmDelete(content.id)" :disabled="loading"
                  class="p-2 text-red-600 transition rounded-full hover:text-red-800 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete Main Content">
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
        {{ Math.min(currentPage * itemsPerPage, filteredMainContents.length) }}
        of {{ filteredMainContents.length }} main contents
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

    <!-- Modal for View Main Content -->
    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showViewModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60" @click.self="closeViewModal">
        <div
          class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all max-h-[80vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900">Main Content Details</h3>
            <button @click="closeViewModal"
              class="p-2 text-gray-500 transition rounded-full hover:text-gray-700 hover:bg-gray-100" title="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div v-if="selectedMainContent" class="pt-5 space-y-5 border-t border-gray-200">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="text-sm font-semibold text-gray-600">Type</label>
                <p class="font-medium text-gray-900">{{ selectedMainContent.type }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Title</label>
                <p class="font-medium text-gray-900">{{ selectedMainContent.title }}</p>
              </div>
              <div class="sm:col-span-2">
                <label class="text-sm font-semibold text-gray-600">Description</label>
                <p class="font-medium text-gray-900">{{ selectedMainContent.description }}</p>
              </div>
              <div class="sm:col-span-2">
                <label class="text-sm font-semibold text-gray-600">Images</label>
                <p class="font-medium text-gray-900">{{ selectedMainContent.images ? selectedMainContent.images.join(', ') : 'None' }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Status</label>
                <p class="font-medium text-gray-900">{{ selectedMainContent.status }}</p>
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

    <!-- Modal for Create/Update Main Content -->
    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showCreateModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60" @click.self="closeCreateModal">
        <div
          class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all max-h-[80vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900">
              {{ isEditing ? 'Edit Main Content' : 'Create Main Content' }}
            </h3>
            <button @click="closeCreateModal"
              class="p-2 text-gray-500 transition rounded-full hover:text-gray-700 hover:bg-gray-100" title="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <!-- Alerts Inside Modal -->
          <div class="mb-4 space-y-2">
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
          <!-- Loading Spinner Inside Modal -->
          <div v-if="modalLoading" class="py-4 text-center">
            <i class="text-4xl text-green-700 fas fa-spinner fa-spin"></i>
            <p class="mt-2 text-sm text-gray-600">Processing...</p>
          </div>
          <div v-else class="pt-5 space-y-5 border-t border-gray-200">
            <div>
              <label class="text-sm font-semibold text-gray-600">Type</label>
              <input v-model="form.type" type="text"
                class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter content type" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Title</label>
              <input v-model="form.title" type="text"
                class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter content title" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Description</label>
              <textarea v-model="form.description"
                class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter content description" rows="3"></textarea>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Select Image</label>
              <input type="file" @change="handleImageChange" accept="image/*"
                class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              <div v-if="imagePreview" class="mt-2">
                <img :src="imagePreview" alt="Image Preview" class="max-w-full h-auto rounded-lg" />
              </div>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Status</label>
              <select v-model="form.status"
                class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end gap-4 mt-8">
            <button @click="closeCreateModal"
              class="px-6 py-2 font-medium text-gray-800 transition duration-200 bg-gray-200 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
            <button @click="saveMainContent" :disabled="modalLoading"
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
            <p class="text-gray-600">Are you sure you want to delete this main content? This action cannot be undone.</p>
          </div>
          <div class="flex justify-center gap-4 mt-8">
            <button @click="closeDeleteModal"
              class="px-6 py-2 font-medium text-gray-800 transition duration-200 bg-gray-200 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
            <button @click="deleteMainContentConfirmed" :disabled="loading"
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
import { getAllMainContent, createMainContent, updateMainContent, getOneMainContent, deleteMainContent } from '@/apis/main-content';
import { createUploadImage } from '@/apis/upload-image';

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
      selectedMainContent: null,
      mainContentToDeleteId: null,
      form: {
        id: null,
        type: '',
        title: '',
        description: '',
        images: [],
        status: 'ACTIVE',
        image: null
      },
      imagePreview: null,
      mainContents: [],
      loading: false,
      modalLoading: false,
      successMessage: '',
      errorMessage: ''
    };
  },
  computed: {
    filteredMainContents() {
      if (!Array.isArray(this.mainContents)) {
        return [];
      }
      const query = this.searchQuery.toLowerCase();
      return this.mainContents.filter((content) => {
        return (
          this.searchQuery === '' ||
          (content.type && content.type.toLowerCase().includes(query)) ||
          (content.title && content.title.toLowerCase().includes(query)) ||
          (content.description && content.description.toLowerCase().includes(query))
        );
      });
    },
    paginatedMainContents() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredMainContents.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredMainContents.length / this.itemsPerPage) || 1;
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

    // Handle image file selection and preview
    handleImageChange(event) {
      const file = event.target.files[0];
      this.form.image = null;
      this.imagePreview = null;

      if (file) {
        if (!file.type.startsWith('image/')) {
          this.alert('Please select a valid image file (e.g., JPG, PNG, GIF).', 'error');
          return;
        }

        const maxSizeInMB = 5;
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
          this.alert(`File size exceeds ${maxSizeInMB}MB limit.`, 'error');
          return;
        }

        this.form.image = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    // Upload image and return the image ID
    async uploadImage() {
      if (!this.form.image) {
        return null; // Allow creating content without an image
      }
      try {
        this.modalLoading = true;
        const formData = new FormData();
        formData.append('image', this.form.image);
        const response = await createUploadImage(formData);
        if (response && response.status === 1 && response.id) {
          this.alert('Image uploaded successfully!');
          return response.id; // Return the image ID
        } else {
          this.alert('Failed to upload image. Invalid response.', 'error');
          return null;
        }
      } catch (error) {
        console.error('Error uploading image:', error.response || error);
        this.alert(`Error uploading image: ${error.message || 'Request failed'}`, 'error');
        return null;
      } finally {
        this.modalLoading = false;
      }
    },

    // Fetch all main contents
    async fetchMainContents() {
      this.loading = true;
      try {
        const response = await getAllMainContent();
        if (response && response.status === 1) {
          this.mainContents = response.data.map(content => ({
            id: content._id,
            type: content.type,
            title: content.title,
            description: content.description,
            images: content.images || [],
            status: content.status
          }));
        } else {
          console.error('Invalid response format:', response);
          this.alert('Failed to load main contents. Invalid response format.', 'error');
          this.mainContents = [];
        }
      } catch (error) {
        console.error('Error fetching main contents:', error);
        this.alert('Error fetching main contents: ' + error.message, 'error');
        this.mainContents = [];
      } finally {
        this.loading = false;
      }
    },

    // Save (Create/Update) Main Content
    async saveMainContent() {
      // Validate required fields
      if (!this.form.type || !this.form.title || !this.form.description || !this.form.status) {
        this.alert('Please fill in all required fields (Type, Title, Description, Status).', 'error');
        return;
      }

      this.modalLoading = true;
      try {
        // Upload image if selected
        let imageId = null;
        if (this.form.image) {
          imageId = await this.uploadImage();
          if (!imageId) {
            return; // Stop if image upload fails
          }
        }

        // Prepare form data for main content
        const formData = {
          type: this.form.type,
          title: this.form.title,
          description: this.form.description,
          status: this.form.status,
          images: imageId
            ? [...(this.isEditing ? this.form.images : []), imageId]
            : (this.isEditing ? this.form.images : [])
        };

        let response;
        if (this.isEditing) {
          response = await updateMainContent(this.form.id, formData);
          if (response && response.status === 1) {
            await this.fetchMainContents();
            this.alert('Main content updated successfully!');
          } else {
            this.alert('Failed to update main content. Please try again.', 'error');
          }
        } else {
          response = await createMainContent(formData);
          if (response && response.status === 1) {
            await this.fetchMainContents();
            this.alert('Main content created successfully!');
          } else {
            this.alert('Failed to create main content. Please try again.', 'error');
          }
        }

        this.closeCreateModal();
      } catch (error) {
        console.error('Error saving main content:', error);
        this.alert(`Error saving main content: ${error.message || 'Request failed'}`, 'error');
      } finally {
        this.modalLoading = false;
      }
    },

    // Open delete confirmation modal
    confirmDelete(id) {
      if (!id) {
        this.alert('Invalid main content ID.', 'error');
        return;
      }
      this.mainContentToDeleteId = id;
      this.showDeleteModal = true;
    },

    // Execute delete after confirmation
    async deleteMainContentConfirmed() {
      if (!this.mainContentToDeleteId) {
        this.alert('No main content selected for deletion.', 'error');
        return;
      }
      this.loading = true;
      try {
        const result = await deleteMainContent(this.mainContentToDeleteId);
        if (result && result.status === 1) {
          await this.fetchMainContents();
          this.alert('Main content deleted successfully!');
        } else {
          this.alert(`Failed to delete main content. Status: ${result?.status || 'unknown'}`, 'error');
        }
      } catch (error) {
        console.error('Error deleting main content:', error);
        this.alert('Error deleting main content: ' + error.message, 'error');
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
        type: '',
        title: '',
        description: '',
        images: [],
        status: 'ACTIVE',
        image: null
      };
      this.imagePreview = null;
      this.showCreateModal = true;
    },
    async openEditModal(content) {
      if (!content.id) {
        this.alert('Invalid main content ID.', 'error');
        return;
      }
      this.loading = true;
      try {
        const result = await getOneMainContent(content.id);
        if (result && result.status === 1 && result.data) {
          const contentData = result.data;
          this.isEditing = true;
          this.form = {
            id: contentData._id,
            type: contentData.type || '',
            title: contentData.title || '',
            description: contentData.description || '',
            images: contentData.images || [],
            status: contentData.status || 'ACTIVE',
            image: null
          };
          this.imagePreview = null;
          this.showCreateModal = true;
        } else {
          this.alert('Failed to fetch main content for editing. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Error fetching main content for edit:', error);
        this.alert('Error fetching main content for editing: ' + error.message, 'error');
      } finally {
        this.loading = false;
      }
    },
    async openViewModal(content) {
      if (!content.id) {
        this.alert('Invalid main content ID.', 'error');
        return;
      }
      this.loading = true;
      try {
        const result = await getOneMainContent(content.id);
        if (result && result.status === 1 && result.data) {
          const contentData = result.data;
          this.selectedMainContent = {
            id: contentData._id,
            type: contentData.type || '',
            title: contentData.title || '',
            description: contentData.description || '',
            images: contentData.images || [],
            status: contentData.status || 'ACTIVE'
          };
          this.showViewModal = true;
        } else {
          this.alert('Failed to fetch main content for viewing. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Error fetching main content for view:', error);
        this.alert('Error fetching main content for viewing: ' + error.message, 'error');
      } finally {
        this.loading = false;
      }
    },
    closeCreateModal() {
      this.showCreateModal = false;
      this.isEditing = false;
      this.form = {
        id: null,
        type: '',
        title: '',
        description: '',
        images: [],
        status: 'ACTIVE',
        image: null
      };
      this.imagePreview = null;
      this.successMessage = '';
      this.errorMessage = '';
      this.modalLoading = false;
    },
    closeViewModal() {
      this.showViewModal = false;
      this.selectedMainContent = null;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.mainContentToDeleteId = null;
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
  mounted() {
    this.fetchMainContents();
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