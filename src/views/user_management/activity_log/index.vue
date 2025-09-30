<template>
  <div class="w-full">
    <div class="fixed z-50 w-full max-w-xs space-y-4 top-4 right-4">
      <div
        v-if="successMessage"
        class="p-4 text-white transition-opacity duration-500 ease-in-out bg-green-500 rounded-lg shadow-md"
        :class="{ 'opacity-0': !successMessage }"
      >
        {{ successMessage }}
      </div>
      <div
        v-if="errorMessage"
        class="p-4 text-white transition-opacity duration-500 ease-in-out bg-red-500 rounded-lg shadow-md"
        :class="{ 'opacity-0': !errorMessage }"
      >
        {{ errorMessage }}
      </div>
    </div>

    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-extrabold tracking-tight text-green-700">
        Activity
      </h2>
    </div>

    <div class="p-6 mb-8 bg-white rounded-lg shadow-sm">
      <div class="flex flex-col items-end gap-4 sm:flex-row">
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700">
            Search Logs
          </label>
          <input
            type="text"
            v-model="searchQuery"
            class="border border-gray-300 rounded-lg px-4 py-2 w-[300px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Search by username, action, or endpoint"
          />
        </div>
        <div class="flex gap-4">
          <button
            @click="filterData"
            class="px-6 py-2 font-medium text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Search
          </button>
          <button
            @click="resetFilters"
            class="px-6 py-2 font-medium text-gray-800 transition duration-200 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Reset
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="py-4 text-center">
      <i class="text-6xl text-green-700 fas fa-spinner fa-spin"></i>
    </div>

    <div class="overflow-hidden bg-white rounded-lg shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm table-auto">
          <thead
            class="text-xs font-semibold text-gray-600 uppercase bg-gray-100"
          >
            <tr>
              <th class="px-4 py-3 text-left">No</th>
              <th class="px-4 py-3 text-left">User</th>
              <th class="px-4 py-3 text-left">Action</th>
              <th class="px-4 py-3 text-left">Request Username</th>
              <th class="px-4 py-3 text-left">Request Email</th>
              <th class="px-4 py-3 text-left">Request Name (EN)</th>
              <th class="px-4 py-3 text-left">IP Address</th>
              <th class="px-4 py-3 text-left">Date</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr
              v-for="(log, index) in paginatedLogs"
              :key="log._id"
              class="transition border-b border-gray-200 hover:bg-gray-50"
            >
              <td class="px-4 py-3">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-4 py-3">
                {{ log.userId?.username || 'N/A' }}
              </td>
              <td class="px-4 py-3">{{ log.action || 'N/A' }}</td>
              <td class="px-4 py-3">{{ log.requestBody?.username || 'N/A' }}</td>
              <td class="px-4 py-3">{{ log.requestBody?.email || 'N/A' }}</td>
              <td class="px-4 py-3">
                {{ log.requestBody?.first_name_en && log.requestBody?.last_name_en 
                  ? `${log.requestBody.first_name_en} ${log.requestBody.last_name_en}` 
                  : 'N/A' }}
              </td>
              <td class="px-4 py-3">{{ log.ipAddress || 'N/A' }}</td>
              <td class="px-4 py-3">
                {{ log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A' }}
              </td>
              <td class="flex gap-2 px-4 py-3">
                <button
                  @click="openViewModal(log)"
                  class="p-2 text-indigo-600 transition rounded-full hover:text-indigo-800 hover:bg-indigo-100"
                  title="View Log"
                >
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="flex items-center justify-between mt-6">
      <div class="text-sm text-gray-600">
        Showing 
        {{ totalLogs === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1 }} to
        {{ (currentPage - 1) * itemsPerPage + filteredLogs.length }}
        of {{ totalLogs }} logs
      </div>
      <div class="flex gap-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 text-gray-800 transition duration-200 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
        >
          Previous
        </button>
        
        <template v-for="(page, index) in visiblePages" :key="index">
          <span v-if="page === '...'" class="px-4 py-2 text-gray-500">...</span>
          <button
            v-else
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
        </template>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 text-gray-800 transition duration-200 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>

    <transition name="modal">
      <div
        style="background-color: rgb(0 0 0 / 0.5)"
        v-if="showViewModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60"
        @click.self="closeViewModal"
      >
        <div
          class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all max-h-[80vh] overflow-y-auto"
        >
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900">Activity Log Details</h3>
            <button
              @click="closeViewModal"
              class="p-2 text-gray-500 transition rounded-full hover:text-gray-700 hover:bg-gray-100"
              title="Close"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div
            v-if="selectedLog"
            class="pt-5 space-y-5 border-t border-gray-200"
          >
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="text-sm font-semibold text-gray-600">User</label>
                <p class="font-medium text-gray-900">
                  {{ selectedLog.userId?.username || 'N/A' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Action</label>
                <p class="font-medium text-gray-900">
                  {{ selectedLog.action || 'N/A' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Method</label>
                <p class="font-medium text-gray-900">
                  {{ selectedLog.method || 'N/A' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Endpoint</label>
                <p class="font-medium text-gray-900">
                  {{ selectedLog.endpoint || 'N/A' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">IP Address</label>
                <p class="font-medium text-gray-900">
                  {{ selectedLog.ipAddress || 'N/A' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Date</label>
                <p class="font-medium text-gray-900">
                  {{ selectedLog.createdAt ? new Date(selectedLog.createdAt).toLocaleString() : 'N/A' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Request Username</label>
                <p class="font-medium text-gray-900">
                  {{ selectedLog.requestBody?.username || 'N/A' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Request Email</label>
                <p class="font-medium text-gray-900">
                  {{ selectedLog.requestBody?.email || 'N/A' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Request Name (EN)</label>
                <p class="font-medium text-gray-900">
                  {{ selectedLog.requestBody?.first_name_en && selectedLog.requestBody?.last_name_en 
                    ? `${selectedLog.requestBody.first_name_en} ${selectedLog.requestBody.last_name_en}` 
                    : 'N/A' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Request Gender</label>
                <p class="font-medium text-gray-900">
                  {{ selectedLog.requestBody?.gender || 'N/A' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Request Phone</label>
                <p class="font-medium text-gray-900">
                  {{ selectedLog.requestBody?.phone_number || 'N/A' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Request DOB</label>
                <p class="font-medium text-gray-900">
                  {{ selectedLog.requestBody?.dob ? new Date(selectedLog.requestBody.dob).toLocaleDateString() : 'N/A' }}
                </p>
              </div>
              <div class="sm:col-span-2">
                <label class="text-sm font-semibold text-gray-600">Response Message</label>
                <p class="font-medium text-gray-900">
                  {{ selectedLog.responseMessage || 'N/A' }}
                </p>
              </div>
            </div>
          </div>
          <div class="flex justify-end mt-8">
            <button
              @click="closeViewModal"
              class="px-6 py-2 font-medium text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getAllActivityLog, getOneActivityLog } from '@/apis/activity-log';

export default {
  data() {
    return {
      searchQuery: '',
      currentPage: 1, 
      itemsPerPage: 10,
      totalLogs: 0, 
      showViewModal: false,
      selectedLog: null,
      logs: [],
      errorMessage: '',
      successMessage: '',
      loading: false
    };
  },
  computed: {
    filteredLogs() {
      if (!this.logs || !Array.isArray(this.logs)) {
        return [];
      }
      const query = this.searchQuery.toLowerCase();
      return this.logs.filter((log) => {
        return (
          this.searchQuery === '' ||
          (log.userId?.username && log.userId.username.toLowerCase().includes(query)) ||
          (log.action && log.action.toLowerCase().includes(query)) ||
          (log.endpoint && log.endpoint.toLowerCase().includes(query)) ||
          (log.requestBody?.username && log.requestBody.username.toLowerCase().includes(query)) ||
          (log.requestBody?.email && log.requestBody.email.toLowerCase().includes(query))
        );
      });
    },
    paginatedLogs() {
      return this.filteredLogs;
    },
    totalPages() {
      return Math.ceil(this.totalLogs / this.itemsPerPage) || 1;
    },
    /**
     * ⚠️ NEW: Generates a list of page numbers to display, limited to 5 buttons max, 
     * using an ellipsis (...) for skipping pages.
     */
    visiblePages() {
      const total = this.totalPages;
      const current = this.currentPage;
      const maxButtons = 5;
      const pages = [];

      if (total <= maxButtons) {
        // Case 1: Total pages is 5 or less, show all pages
        for (let i = 1; i <= total; i++) {
          pages.push(i);
        }
      } else {
        // Case 2: Total pages is greater than 5

        // Always add the first page
        pages.push(1);
        
        // Define the window of visible pages around the current page
        const startWindow = Math.max(2, current - 1);
        const endWindow = Math.min(total - 1, current + 1);

        // Add ellipsis if the window starts after the second page
        if (startWindow > 2) {
          pages.push('...');
        }

        // Add pages within the window
        for (let i = startWindow; i <= endWindow; i++) {
            // Ensure we don't duplicate the first page or exceed 5 total buttons 
            // (1st page + ellipsis + 3 central pages + last page = 6, so we need logic)
            if (pages.length < maxButtons - (current > 1 && current < total ? 0 : 1)) {
              pages.push(i);
            }
        }
        
        // Final sanity check for the ellipsis, ensuring max 3 central pages (2 around current)
        const centralPages = pages.filter(p => p !== 1 && p !== total && p !== '...').length;
        if (centralPages < 3 && current > 2 && current < total - 1) {
            // This happens when the window is too small, force 3 around current if possible
            const windowStart = Math.max(2, current - (2 - (total - current === 1 ? 1 : 0)));
            const windowEnd = Math.min(total - 1, current + (2 - (current === 2 ? 1 : 0)));
            
            pages.length = 0;
            pages.push(1);
            if (windowStart > 2) pages.push('...');
            for (let i = windowStart; i <= windowEnd; i++) {
                if (i !== 1 && i !== total) pages.push(i);
            }
        }
        
        // Re-check for ellipsis before the last page
        if (pages[pages.length - 1] < total - 1) {
            // Avoid adding ellipsis if we are only skipping one page (e.g., [1, 2, ..., 4, 5])
            if (pages[pages.length - 1] !== total - 2) {
                pages.push('...');
            }
        }

        // Always add the last page if it's not already included
        if (pages[pages.length - 1] !== total) {
            pages.push(total);
        }
        
        // Simple and robust logic for the common case (reset pages array and rebuild)
        const simplePages = [];
        const delta = 2; // Number of pages to show before and after current
        const leftBound = Math.max(1, current - delta);
        const rightBound = Math.min(total, current + delta);
        
        if (total > maxButtons) {
             // Always show page 1
            if (leftBound > 1) simplePages.push(1);
            if (leftBound > 2) simplePages.push('...'); // Ellipsis after 1

            // Show central pages
            for (let i = leftBound; i <= rightBound; i++) {
                simplePages.push(i);
            }
            
            // Ellipsis before last page
            if (rightBound < total - 1) simplePages.push('...');
            // Always show last page
            if (rightBound < total) simplePages.push(total);

            // Filter out duplicates and ensure max 5 buttons (simple overflow fix)
            const uniquePages = [...new Set(simplePages)];
            
            // This is a simpler view: Always center around current, add ellipsis
            const finalPages = [];
            finalPages.push(1);
            
            if (current > delta + 1) finalPages.push('...');
            
            let i = Math.max(2, current - 1);
            while (i <= total && finalPages.length < maxButtons - 1) {
                if (i !== 1 && i !== total) finalPages.push(i);
                i++;
            }
            
            if (finalPages[finalPages.length - 1] < total - 1) finalPages.push('...');
            if (finalPages[finalPages.length - 1] !== total) finalPages.push(total);
            
            return [...new Set(finalPages)].filter(p => p !== undefined).slice(0, maxButtons);
        }
        return pages; // Use the simple pages array if total <= 5
      }
      return pages;
    }
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
    async getAllLogs(page = this.currentPage) {
      this.loading = true;
      try {
        const result = await getAllActivityLog({ page, limit: this.itemsPerPage });
        
        if (result && result.status === 1) {
          this.logs = result.data.map((log) => ({
            _id: log._id || null,
            userId: log.userId || { username: 'N/A' },
            action: log.action || 'N/A',
            method: log.method || 'N/A',
            endpoint: log.endpoint || 'N/A',
            ipAddress: log.ipAddress || 'N/A',
            createdAt: log.createdAt || null,
            requestBody: log.requestBody || null,
            responseMessage: log.responseMessage || 'N/A',
            statusCode: log.statusCode || null
          }));
          this.currentPage = result.pagination?.page || page;
          this.totalLogs = result.pagination?.total || this.logs.length; 
        } else {
          this.alert('Failed to load logs. Invalid response format.', 'error');
          this.logs = [];
          this.totalLogs = 0;
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
        this.alert('Error fetching logs: ' + error.message, 'error');
        this.logs = [];
        this.totalLogs = 0;
      } finally {
        this.loading = false;
      }
    },
    async openViewModal(log) {
      if (!log._id) {
        this.alert('Invalid log ID.', 'error');
        return;
      }
      this.loading = true;
      try {
        const result = await getOneActivityLog(log._id);
        if (result && result.status === 1) {
          this.selectedLog = {
            _id: result.data._id || null,
            userId: result.data.userId || { username: 'N/A' },
            action: result.data.action || 'N/A',
            method: result.data.method || 'N/A',
            endpoint: result.data.endpoint || 'N/A',
            ipAddress: result.data.ipAddress || 'N/A',
            createdAt: result.data.createdAt || null,
            requestBody: result.data.requestBody || null,
            responseMessage: result.data.responseMessage || 'N/A',
            statusCode: result.data.statusCode || null
          };
          this.showViewModal = true;
        } else {
          this.alert('Failed to load log details.', 'error');
        }
      } catch (error) {
        console.error('Error fetching log:', error);
        this.alert('Error fetching log: ' + error.message, 'error');
      } finally {
        this.loading = false;
      }
    },
    closeViewModal() {
      this.showViewModal = false;
      this.selectedLog = null;
    },
    filterData() {
      // If implementing server-side search, call this.goToPage(1) here.
    },
    resetFilters() {
      this.searchQuery = '';
      this.goToPage(1);
    },
    prevPage() {
      this.goToPage(this.currentPage - 1);
    },
    nextPage() {
      this.goToPage(this.currentPage + 1);
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        this.currentPage = page;
        this.getAllLogs(page);
      } else if (page === 1 && this.currentPage !== 1) {
        this.currentPage = 1;
        this.getAllLogs(1);
      }
    }
  },
  async mounted() {
    await this.getAllLogs(); 
    
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.showViewModal) this.closeViewModal();
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