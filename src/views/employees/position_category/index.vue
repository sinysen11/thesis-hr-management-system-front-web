<template>
  <!-- <div class="min-h-screen bg-gray-50 flex flex-col"> -->
  <div class="w-full">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-extrabold text-gray-900">Job Positions</h2>
      <button
        @click="openCreateModal"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
      >
        Create Job Position
      </button>
    </div>

    <!-- Filter Section -->
    <div class="bg-white shadow-sm rounded-lg p-6 mb-8">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <label class="text-sm font-medium text-gray-700 mb-2"
            >Search Job Positions</label
          >
          <input
            type="text"
            v-model="searchQuery"
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Search by title or ID"
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
    <div class="bg-white shadow-sm rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto text-sm">
          <thead
            class="bg-gray-100 text-gray-600 uppercase text-xs font-semibold"
          >
            <tr>
              <th class="px-4 py-3 text-left">No</th>
              <th class="px-4 py-3 text-left">Position ID</th>
              <th class="px-4 py-3 text-left">Title</th>
              <th class="px-4 py-3 text-left">Department ID</th>
              <th class="px-4 py-3 text-left">Reports To</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr
              v-for="(position, index) in paginatedPositions"
              :key="position.id"
              class="hover:bg-gray-50 transition border-b border-gray-200"
            >
              <td class="px-4 py-3">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-4 py-3">{{ position.positionId }}</td>
              <td class="px-4 py-3">{{ position.title }}</td>
              <td class="px-4 py-3">{{ position.departmentId }}</td>
              <td class="px-4 py-3">
                {{ position.reportToPositionId || 'N/A' }}
              </td>
              <td class="px-4 py-3 flex gap-2">
                <button
                  @click="openViewModal(position)"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                  title="View Position"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button
                  @click="openEditModal(position)"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                  title="Edit Position"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="deletePosition(position.id)"
                  class="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition"
                  title="Delete Position"
                >
                  <i class="fas fa-trash"></i>
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
        {{ Math.min(currentPage * itemsPerPage, filteredPositions.length) }}
        of {{ filteredPositions.length }} positions
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

    <!-- Modal for View Job Position -->
    <transition name="modal">
      <div
        v-if="showViewModal"
        class="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50"
        @click.self="closeViewModal"
      >
        <div
          class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all"
        >
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900">
              Job Position Details
            </h3>
            <button
              @click="closeViewModal"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
              title="Close"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div
            v-if="selectedPosition"
            class="space-y-5 border-t border-gray-200 pt-5"
          >
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="text-sm font-semibold text-gray-600"
                  >Position ID</label
                >
                <p class="text-gray-900 font-medium">
                  {{ selectedPosition.positionId }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Title</label>
                <p class="text-gray-900 font-medium">
                  {{ selectedPosition.title }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600"
                  >Department ID</label
                >
                <p class="text-gray-900 font-medium">
                  {{ selectedPosition.departmentId }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600"
                  >Reports To</label
                >
                <p class="text-gray-900 font-medium">
                  {{ selectedPosition.reportToPositionId || 'N/A' }}
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

    <!-- Modal for Create/Update Job Position -->
    <transition name="modal">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50"
        @click.self="closeCreateModal"
      >
        <div
          class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all"
        >
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900">
              {{ isEditing ? 'Edit Job Position' : 'Create Job Position' }}
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
                >Position ID</label
              >
              <input
                v-model.number="form.positionId"
                type="number"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter position ID"
              />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Title</label>
              <input
                v-model="form.title"
                type="text"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter title"
              />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600"
                >Department ID</label
              >
              <input
                v-model.number="form.departmentId"
                type="number"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter department ID"
              />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600"
                >Reports To Position ID</label
              >
              <input
                v-model.number="form.reportToPositionId"
                type="number"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter reports to position ID (optional)"
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
              @click="savePosition"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
            >
              {{ isEditing ? 'Update' : 'Create' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
  <!-- </div> -->
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

export default {
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,
      showCreateModal: false,
      showViewModal: false,
      isEditing: false,
      selectedPosition: null,
      form: {
        id: null,
        positionId: null,
        title: '',
        departmentId: null,
        reportToPositionId: null
      },
      positions: [
        {
          id: uuidv4(),
          positionId: 101,
          title: 'Software Engineer',
          departmentId: 1,
          reportToPositionId: 201
        },
        {
          id: uuidv4(),
          positionId: 102,
          title: 'Accountant',
          departmentId: 2,
          reportToPositionId: 202
        },
        {
          id: uuidv4(),
          positionId: 103,
          title: 'HR Manager',
          departmentId: 3,
          reportToPositionId: null
        },
        {
          id: uuidv4(),
          positionId: 104,
          title: 'Marketing Specialist',
          departmentId: 4,
          reportToPositionId: 203
        }
      ]
    };
  },
  computed: {
    filteredPositions() {
      return this.positions.filter((position) => {
        const matchSearch =
          this.searchQuery === '' ||
          position.positionId.toString().includes(this.searchQuery) ||
          position.title.toLowerCase().includes(this.searchQuery.toLowerCase());
        return matchSearch;
      });
    },
    paginatedPositions() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredPositions.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredPositions.length / this.itemsPerPage);
    }
  },
  methods: {
    filterData() {
      this.currentPage = 1; // Reset to first page on filter
    },
    resetFilters() {
      this.searchQuery = '';
      this.currentPage = 1; // Reset to first page on reset
    },
    openCreateModal() {
      this.isEditing = false;
      this.form = {
        id: null,
        positionId: null,
        title: '',
        departmentId: null,
        reportToPositionId: null
      };
      this.showCreateModal = true;
    },
    openEditModal(position) {
      this.isEditing = true;
      this.form = { ...position };
      this.showCreateModal = true;
    },
    openViewModal(position) {
      this.selectedPosition = { ...position };
      this.showViewModal = true;
    },
    closeCreateModal() {
      this.showCreateModal = false;
      this.isEditing = false;
      this.form = {
        id: null,
        positionId: null,
        title: '',
        departmentId: null,
        reportToPositionId: null
      };
    },
    closeViewModal() {
      this.showViewModal = false;
      this.selectedPosition = null;
    },
    savePosition() {
      if (
        !this.form.positionId ||
        !this.form.title ||
        !this.form.departmentId
      ) {
        alert(
          'Please fill in all required fields (Position ID, Title, Department ID).'
        );
        return;
      }
      if (this.isEditing) {
        const index = this.positions.findIndex(
          (position) => position.id === this.form.id
        );
        if (index !== -1) {
          this.positions[index] = { ...this.form };
        }
      } else {
        this.positions.push({
          ...this.form,
          id: uuidv4()
        });
      }
      this.closeCreateModal();
    },
    deletePosition(id) {
      if (confirm('Are you sure you want to delete this job position?')) {
        this.positions = this.positions.filter(
          (position) => position.id !== id
        );
      }
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
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.showCreateModal) {
          this.closeCreateModal();
        }
        if (this.showViewModal) {
          this.closeViewModal();
        }
      }
    });
  }
};
</script>

<style scoped>
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
