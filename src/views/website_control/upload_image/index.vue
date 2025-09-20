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
      <h2 class="text-3xl font-extrabold text-gray-900">Image Upload</h2>
      <button @click="openUploadModal" :disabled="loading"
        class="px-6 py-2 font-medium text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
        Upload Image
      </button>
    </div>

    <!-- Modal for Image Upload -->
    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showUploadModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60" @click.self="closeUploadModal">
        <div
          class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all max-h-[80vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900">Upload Image</h3>
            <button @click="closeUploadModal"
              class="p-2 text-gray-500 transition rounded-full hover:text-gray-700 hover:bg-gray-100" title="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="pt-5 space-y-5 border-t border-gray-200">
            <div>
              <label class="text-sm font-semibold text-gray-600">Select Image</label>
              <input type="file" @change="handleImageChange" accept="image/*"
                class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              <div v-if="imagePreview" class="mt-2">
                <img :src="imagePreview" alt="Image Preview" class="max-w-full h-auto rounded-lg" />
              </div>
            </div>
            <div v-if="loading" class="flex justify-center">
              <i class="text-6xl text-green-700 fas fa-spinner fa-spin"></i>
            </div>
          </div>
          <div class="flex justify-end gap-4 mt-8">
            <button @click="closeUploadModal"
              class="px-6 py-2 font-medium text-gray-800 transition duration-200 bg-gray-200 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
            <button @click="uploadImage" :disabled="loading || !form.image"
              class="px-6 py-2 font-medium text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
              Upload
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { createUploadImage } from '@/apis/upload-image';

export default {
  data() {
    return {
      showUploadModal: false,
      form: {
        image: null
      },
      imagePreview: null,
      loading: false,
      successMessage: '',
      errorMessage: ''
    };
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

    // Handle image file selection and preview with stricter validation
    handleImageChange(event) {
      const file = event.target.files[0];
      this.form.image = null;
      this.imagePreview = null;

      if (file) {
        // Validate file type is an image
        if (!file.type.startsWith('image/')) {
          this.alert('Please select a valid image file (e.g., JPG, PNG, GIF).', 'error');
          return;
        }

        // Optional: Add file size limit (e.g., 5MB)
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

    // Upload image
    async uploadImage() {
      if (!this.form.image) {
        this.alert('Please select an image to upload.', 'error');
        return;
      }
      this.loading = true;
      try {
        const formData = new FormData();
        formData.append('image', this.form.image);
        const response = await createUploadImage(formData);
        console.log('API Response:', response); // Debug log
        if (response && response.status === 1) {
          this.alert('Image uploaded successfully!');
          this.closeUploadModal();
        } else {
          console.error('Upload failed with response:', response);
          this.alert('Failed to upload image. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Error uploading image:', error.response || error);
        this.alert(`Error uploading image: ${error.message || 'Request failed'}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    // Modal Handlers
    openUploadModal() {
      this.form.image = null;
      this.imagePreview = null;
      this.showUploadModal = true;
    },
    closeUploadModal() {
      this.showUploadModal = false;
      this.form.image = null;
      this.imagePreview = null;
    }
  },
  mounted() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.showUploadModal) {
        this.closeUploadModal();
      }
    });
  }
};
</script>

<style scoped>
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