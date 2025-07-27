<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-extrabold text-gray-900">Employees List</h2>
      <button @click="openModal(false)"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200">
        Create Employee
      </button>
    </div>

    <!-- Filter Section -->
    <div class="bg-white shadow-sm rounded-lg p-6 mb-8">
      <div class="flex flex-col sm:flex-row items-end gap-4">
        <div>
          <label class="text-sm font-medium text-gray-700 mb-2 block">Search Employees</label>
          <input type="text" v-model="searchQuery"
            class="border border-gray-300 rounded-lg px-4 py-2 w-[300px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Search by name, email, or ID" />
        </div>
        <div class="flex gap-4">
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
    <div class="bg-white shadow-sm rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto text-sm">
          <thead class="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th class="px-4 py-3 text-left">No</th>
              <th class="px-4 py-3 text-left">Employee ID</th>
              <th class="px-4 py-3 text-left">Full Name</th>
              <th class="px-4 py-3 text-left">DOB</th>
              <th class="px-4 py-3 text-left">Gender</th>
              <th class="px-4 py-3 text-left">Email</th>
              <th class="px-4 py-3 text-left">Phone</th>
              <th class="px-4 py-3 text-left">DOA</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr v-for="(employee, index) in paginatedEmployees" :key="employee.id"
              class="hover:bg-gray-50 transition border-b border-gray-200">
              <td class="px-4 py-3">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-4 py-3">{{ employee.employeeId }}</td>
              <td class="px-4 py-3">
                {{ `${employee.firstName} ${employee.lastName}` }}
              </td>
              <td class="px-4 py-3">{{ employee.dob }}</td>
              <td class="px-4 py-3">{{ employee.gender }}</td>
              <td class="px-4 py-3">{{ employee.email }}</td>
              <td class="px-4 py-3">{{ employee.phone }}</td>
              <td class="px-4 py-3">{{ employee.doa }}</td>
              <td class="px-4 py-3 flex gap-2">
                <button @click="openModal(true, employee)"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                  title="View Employee">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="openModal(false, employee)"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                  title="Edit Employee">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="deleteEmployee(employee.id)"
                  class="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition"
                  title="Delete Employee">
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
        {{ Math.min(currentPage * itemsPerPage, filteredEmployees.length) }}
        of {{ filteredEmployees.length }} employees
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

    <!-- Unified Modal for View/Edit/Create -->
    <transition name="modal">
      <div v-if="showModal" style="background-color: rgb(0 0 0 / 0.5);"
        class="fixed inset-0 bg-gray-600 bg-opacity-40 flex items-center justify-center z-50" @click.self="closeModal">
        <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all">
          <div class="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
            <h3 class="text-2xl font-bold text-gray-900">
              {{ isViewMode ? 'Employee Details' : isEditing ? 'Edit Employee' : 'Create Employee' }}
            </h3>
            <button @click="closeModal"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition" title="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="space-y-5 border-t border-gray-200 pt-5 max-h-[60vh] overflow-y-auto">
            <div>
              <label class="text-sm font-semibold text-gray-600">Employee ID</label>
              <input v-model.number="form.employeeId" type="number" :disabled="isViewMode"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter employee ID" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">First Name</label>
              <input v-model="form.firstName" type="text" :disabled="isViewMode"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter first name" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Last Name</label>
              <input v-model="form.lastName" type="text" :disabled="isViewMode"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter last name" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">DOB</label>
              <flat-pickr v-model="form.dob" :disabled="isViewMode"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Select date of birth" :config="flatpickrConfig"></flat-pickr>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Gender</label>
              <select v-model="form.gender" :disabled="isViewMode"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Email</label>
              <input v-model="form.email" type="email" :disabled="isViewMode"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter email" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Phone</label>
              <input v-model.number="form.phone" type="number" :disabled="isViewMode"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter phone number" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Emergency Contact ID</label>
              <input v-model.number="form.emergencyContactId" type="number" :disabled="isViewMode"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter emergency contact ID" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Department ID</label>
              <input v-model.number="form.departmentId" type="number" :disabled="isViewMode"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter department ID" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Position ID</label>
              <input v-model.number="form.positionId" type="number" :disabled="isViewMode"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter position ID" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">DOA</label>
              <flat-pickr v-model="form.doa" :disabled="isViewMode"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Select date of appointment" :config="flatpickrConfig"></flat-pickr>
            </div>
          </div>
          <div class="mt-8 flex justify-end gap-4">
            <button v-if="!isViewMode" @click="closeModal"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition duration-200">
              Cancel
            </button>
            <button v-if="!isViewMode" @click="saveEmployee"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200">
              {{ isEditing ? 'Update' : 'Create' }}
            </button>
            <button v-if="isViewMode" @click="closeModal"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200">
              Close
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import FlatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { v4 as uuidv4 } from 'uuid';

export default {
  components: {
    FlatPickr
  },
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,
      showModal: false,
      isViewMode: false,
      isEditing: false,
      selectedEmployee: null,
      form: {
        id: null,
        employeeId: null,
        firstName: '',
        lastName: '',
        dob: '',
        gender: 'Male',
        email: '',
        phone: null,
        emergencyContactId: null,
        departmentId: null,
        positionId: null,
        doa: ''
      },
      flatpickrConfig: {
        dateFormat: 'd-M-Y',
        altInput: true,
        altFormat: 'd-M-Y',
        allowInput: true
      },
      employees: [
        {
          id: uuidv4(),
          employeeId: 1001,
          firstName: 'John',
          lastName: 'Doe',
          dob: '15-Mar-1990',
          gender: 'Male',
          email: 'john.doe@example.com',
          phone: 1234567890,
          emergencyContactId: 2001,
          departmentId: 1,
          positionId: 101,
          doa: '01-Jan-2020'
        },
        {
          id: uuidv4(),
          employeeId: 1002,
          firstName: 'Jane',
          lastName: 'Smith',
          dob: '22-Apr-1992',
          gender: 'Female',
          email: 'jane.smith@example.com',
          phone: 9876543210,
          emergencyContactId: 2002,
          departmentId: 2,
          positionId: 102,
          doa: '15-Feb-2021'
        },
        {
          id: uuidv4(),
          employeeId: 1003,
          firstName: 'Alex',
          lastName: 'Johnson',
          dob: '10-Jul-1988',
          gender: 'Other',
          email: 'alex.j@example.com',
          phone: 5555555555,
          emergencyContactId: 2003,
          departmentId: 1,
          positionId: 103,
          doa: '20-Mar-2019'
        },
        {
          id: uuidv4(),
          employeeId: 1004,
          firstName: 'Emily',
          lastName: 'Brown',
          dob: '05-Dec-1995',
          gender: 'Female',
          email: 'emily.b@example.com',
          phone: 4444444444,
          emergencyContactId: 2004,
          departmentId: 3,
          positionId: 104,
          doa: '10-Apr-2022'
        }
      ]
    };
  },
  computed: {
    filteredEmployees() {
      return this.employees.filter((employee) => {
        const matchSearch =
          this.searchQuery === '' ||
          employee.employeeId.toString().includes(this.searchQuery) ||
          `${employee.firstName} ${employee.lastName}`
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          employee.email.toLowerCase().includes(this.searchQuery.toLowerCase());
        return matchSearch;
      });
    },
    paginatedEmployees() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredEmployees.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
    }
  },
  methods: {
    filterData() {
      this.currentPage = 1;
    },
    resetFilters() {
      this.searchQuery = '';
      this.currentPage = 1;
    },
    openModal(isViewMode, employee = null) {
      this.isViewMode = isViewMode;
      this.isEditing = !isViewMode && !!employee;
      this.selectedEmployee = employee ? { ...employee } : null;
      this.form = employee
        ? { ...employee }
        : {
          id: null,
          employeeId: null,
          firstName: '',
          lastName: '',
          dob: '',
          gender: 'Male',
          email: '',
          phone: null,
          emergencyContactId: null,
          departmentId: null,
          positionId: null,
          doa: ''
        };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.isViewMode = false;
      this.isEditing = false;
      this.selectedEmployee = null;
      this.form = {
        id: null,
        employeeId: null,
        firstName: '',
        lastName: '',
        dob: '',
        gender: 'Male',
        email: '',
        phone: null,
        emergencyContactId: null,
        departmentId: null,
        positionId: null,
        doa: ''
      };
    },
    saveEmployee() {
      if (
        !this.form.employeeId ||
        !this.form.firstName ||
        !this.form.lastName ||
        !this.form.dob ||
        !this.form.doa
      ) {
        alert(
          'Please fill in all required fields (Employee ID, First Name, Last Name, DOB, DOA).'
        );
        return;
      }
      if (this.isEditing) {
        const index = this.employees.findIndex(
          (employee) => employee.id === this.form.id
        );
        if (index !== -1) {
          this.employees[index] = { ...this.form };
        }
      } else {
        this.employees.push({
          ...this.form,
          id: uuidv4()
        });
      }
      this.closeModal();
    },
    deleteEmployee(id) {
      if (confirm('Are you sure you want to delete this employee?')) {
        this.employees = this.employees.filter((employee) => employee.id !== id);
      }
    },
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
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.showModal) {
        this.closeModal();
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

/* Flatpickr styles */
.flatpickr-input {
  background-color: white;
}

/* Disable input styling */
input:disabled,
select:disabled,
.flatpickr-input:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
  opacity: 0.7;
}

/* Custom scrollbar for modal */
.max-h-\[60vh\] {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}

.max-h-\[60vh\]::-webkit-scrollbar {
  width: 6px;
}

.max-h-\[60vh\]::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.max-h-\[60vh\]::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.max-h-\[60vh\]::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>