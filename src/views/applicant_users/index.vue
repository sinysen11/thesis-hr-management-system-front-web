<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-extrabold tracking-tight text-green-700">
        Applicant Users
      </h2>
    </div>

    <div class="p-6 mb-8 bg-white rounded-lg shadow-sm">
      <div class="flex flex-col items-end gap-4 sm:flex-row">
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700">
            Search Users
          </label>
          <input
            type="text"
            v-model="searchQuery"
            class="border border-gray-300 rounded-lg px-4 py-2 w-[300px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Search by name, email, or phone"
            @keyup.enter="filterData"
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

    <div v-else class="overflow-hidden bg-white rounded-lg shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm table-auto">
          <thead class="text-xs font-semibold text-gray-600 uppercase bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-left">No</th>
              <th class="px-4 py-3 text-left">Full Name</th>
              <th class="px-4 py-3 text-left">Gender</th>
              <th class="px-4 py-3 text-left">Email</th>
              <th class="px-4 py-3 text-left">Phone</th>
              <th class="px-4 py-3 text-left">Apply Counts</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr
              v-for="(user, index) in paginatedUsers"
              :key="user.id"
              class="transition border-b border-gray-200 hover:bg-gray-50"
            >
              <td class="px-4 py-3">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-4 py-3">
                {{ user.first_name }} {{ user.last_name }}
              </td>
              <td class="px-4 py-3">{{ user.sex || '-' }}</td>
              <td class="px-4 py-3">{{ user.email }}</td>
              <td class="px-4 py-3">{{ user.phone }}</td>
              <td class="px-4 py-3">{{ user.apply_count }}</td>
              <td class="flex gap-2 px-4 py-3">
                <button
                  @click="openViewModal(user)"
                  class="p-2 text-indigo-600 transition rounded-full hover:text-indigo-800 hover:bg-indigo-100"
                  title="View User"
                >
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="paginatedUsers.length === 0 && !loading" class="p-4 text-center text-gray-500">
        No users found.
      </div>
    </div>

    <div class="flex items-center justify-between mt-6">
      <div class="text-sm text-gray-600">
        Showing
        {{ totalUsers === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1 }} to
        {{ (currentPage - 1) * itemsPerPage + paginatedUsers.length }}
        of {{ totalUsers }} users
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
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300',
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
            <h3 class="text-2xl font-bold text-gray-900">Applicant Details</h3>
            <button
              @click="closeViewModal"
              class="p-2 text-gray-500 transition rounded-full hover:text-gray-700 hover:bg-gray-100"
              title="Close"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div v-if="selectedUser" class="pt-5 space-y-5 border-t border-gray-200">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              
              <div>
                <label class="text-sm font-semibold text-gray-600">First Name</label>
                <p class="font-medium text-gray-900">
                  {{ selectedUser.first_name }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Last Name</label>
                <p class="font-medium text-gray-900">
                  {{ selectedUser.last_name }}
                </p>
              </div>

              <div>
                <label class="text-sm font-semibold text-gray-600">Email</label>
                <p class="font-medium text-gray-900">
                  {{ selectedUser.email }}
                </p>
              </div>
              
              <div>
                <label class="text-sm font-semibold text-gray-600">Phone Number</label>
                <p class="font-medium text-gray-900">
                  {{ selectedUser.phone || 'N/A' }}
                </p>
              </div>
              
              <div>
                <label class="text-sm font-semibold text-gray-600">Telegram</label>
                <p class="font-medium text-gray-900">
                  {{ selectedUser.telegram || 'N/A' }}
                </p>
              </div>

              <div>
                <label class="text-sm font-semibold text-gray-600">Gender</label>
                <p class="font-medium text-gray-900">
                  {{ selectedUser.sex || 'N/A' }}
                </p>
              </div>

              <div>
                <label class="text-sm font-semibold text-gray-600">Date of Birth</label>
                <p class="font-medium text-gray-900">
                  {{
                    selectedUser.dob
                      ? new Date(selectedUser.dob).toLocaleDateString()
                      : 'N/A'
                  }}
                </p>
              </div>
              
              <div>
                <label class="text-sm font-semibold text-gray-600">Current Address</label>
                <p class="font-medium text-gray-900">
                  {{ selectedUser.current_address || 'N/A' }}
                </p>
              </div>

              <div>
                <label class="text-sm font-semibold text-gray-600">Application Count</label>
                <p class="font-medium text-gray-900">
                  {{ selectedUser.apply_count }}
                </p>
              </div>

              <div>
                <label class="text-sm font-semibold text-gray-600">Created At</label>
                <p class="font-medium text-gray-900">
                  {{
                    selectedUser.createdAt
                      ? new Date(selectedUser.createdAt).toLocaleDateString()
                      : 'N/A'
                  }}
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
// NOTE: Since the new data doesn't have 'status', I've commented out updateStatus.
// If your backend API for getAllApplicantUsers is still the same, you might need to adapt the API call/module.
import { getAllApplicantUsers /*, updateStatus */ } from '@/apis/user'; 

export default {
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,
      totalUsers: 0,
      showViewModal: false,
      selectedUser: null,
      users: [], 
      loading: false,
      statusMessage: {
        text: '',
        type: 'success'
      }
    };
  },
  computed: {
    paginatedUsers() {
      return this.users;
    },
    totalPages() {
      return Math.ceil(this.totalUsers / this.itemsPerPage) || 1;
    },
    visiblePages() {
      const total = this.totalPages;
      const current = this.currentPage;
      const maxButtons = 5;
      const pages = [];

      if (total <= maxButtons) {
        for (let i = 1; i <= total; i++) {
          pages.push(i);
        }
        return pages;
      }

      const pageDelta = 1;
      let start = Math.max(2, current - pageDelta);
      let end = Math.min(total - 1, current + pageDelta);

      if (current <= 3) {
        end = Math.min(total - 1, 4);
        start = 2;
      } else if (current >= total - 2) {
        start = Math.max(2, total - 3);
        end = total - 1;
      }

      pages.push(1);

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== total) {
          pages.push(i);
        }
      }

      if (end < total - 1) {
        pages.push('...');
      }

      if (pages[pages.length - 1] !== total && total > 1) {
        pages.push(total);
      }

      return [...new Set(pages.filter((p) => p))].filter((page, index, self) => {
        if (page === '...' && self[index - 1] === '...') return false;
        return true;
      });
    }
  },
  methods: {
    notify(message, type = 'success') {
      this.statusMessage.text = message;
      this.statusMessage.type = type;
      setTimeout(() => {
        this.statusMessage.text = '';
      }, 3000);
      // Ensure you have a global/top-level component to display this message
    },

    // CRITICAL UPDATE: Map API response keys to component's user data
    async getAllUsers(page = this.currentPage, query = this.searchQuery) {
      this.loading = true;
      try {
        const result = await getAllApplicantUsers({
          page,
          limit: this.itemsPerPage,
          search: query || undefined
        });

        if (result && result.status === 1) {
          // MAPPING TO NEW KEYS: first_name, last_name, phone, sex, dob, email, current_address, apply_count
          this.users = result.data.map((user) => ({
            id: user._id || user.id || null, // Assuming one of these is the ID
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            email: user.email || '',
            phone: user.phone || '',
            telegram: user.telegram || '',
            sex: user.sex || 'N/A',
            dob: user.dob || null,
            current_address: user.current_address || '',
            apply_count: user.apply_count || 0,
            createdAt: user.createdAt || null
            // Removed: first_name_kh, last_name_kh, first_name_en, last_name_en, username, status
            // Note: Since 'status' is missing, the toggleStatus logic will be ineffective/removed.
          }));

          this.currentPage = result.pagination?.page || page;
          this.itemsPerPage = result.pagination?.limit || this.itemsPerPage;
          this.totalUsers = result.pagination?.total || this.users.length;
        } else {
          this.notify('Failed to load users. Invalid response format.', 'error');
          this.users = [];
          this.totalUsers = 0;
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        this.notify('Error fetching users: ' + error.message, 'error');
        this.users = [];
        this.totalUsers = 0;
      } finally {
        this.loading = false;
      }
    },

    // REMOVED toggleStatus: Not possible as 'status' field is missing in the new data structure.
    /*
    async toggleStatus(user) {
      // ... (logic removed)
    },
    */

    openViewModal(user) {
      if (!user.id) {
        this.notify('Invalid user ID.', 'error');
        return;
      }
      this.selectedUser = { ...user };
      this.showViewModal = true;
    },
    
    closeViewModal() {
      this.showViewModal = false;
      this.selectedUser = null;
    },

    filterData() {
      this.goToPage(1);
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
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.getAllUsers(page, this.searchQuery);
      }
    }
  },
  async mounted() {
    await this.getAllUsers(1, this.searchQuery);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.showViewModal) this.closeViewModal();
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
</style>