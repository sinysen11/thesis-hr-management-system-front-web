```vue
<template>
  <div class="w-full">
    <div v-if="loading" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div class="text-white text-lg">Loading...</div>
    </div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-extrabold text-gray-900">User Management</h2>
      <button @click="openCreateModal"
        :disabled="loading"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
        Create User
      </button>
    </div>

    <div class="fixed top-4 right-4 z-50 space-y-4 w-full max-w-xs">
      <div v-if="successMessage"
        class="p-4 rounded-lg shadow-md bg-green-500 text-white transition-opacity duration-500 ease-in-out"
        :class="{ 'opacity-0': !successMessage }">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage"
        class="p-4 rounded-lg shadow-md bg-red-500 text-white transition-opacity duration-500 ease-in-out"
        :class="{ 'opacity-0': !errorMessage }">
        {{ errorMessage }}
      </div>
    </div>

    <div class="bg-white shadow-sm rounded-lg p-6 mb-8">
      <div class="flex flex-col sm:flex-row items-end gap-4">
        <div>
          <label class="text-sm font-medium text-gray-700 mb-2 block">
            Search Users
          </label>
          <input type="text" v-model="searchQuery"
            class="border border-gray-300 rounded-lg px-4 py-2 w-[300px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Search by username, email, or name" />
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

    <div class="bg-white shadow-sm rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto text-sm">
          <thead class="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th class="px-4 py-3 text-left">No</th>
              <th class="px-4 py-3 text-left">Name (KH)</th>
              <th class="px-4 py-3 text-left">Name (EN)</th>
              <th class="px-4 py-3 text-left">Username</th>
              <th class="px-4 py-3 text-left">Email</th>
              <th class="px-4 py-3 text-left">Role</th>
              <th class="px-4 py-3 text-left">Department</th>
              <th class="px-4 py-3 text-left">Status</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr v-for="(user, index) in paginatedUsers" :key="user.id" class="transition border-b border-gray-200">
              <td class="px-4 py-3">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-4 py-3">{{ user.first_name_kh }} {{ user.last_name_kh }}</td>
              <td class="px-4 py-3">{{ user.first_name_en }} {{ user.last_name_en }}</td>
              <td class="px-4 py-3">{{ user.username }}</td>
              <td class="px-4 py-3">{{ user.email }}</td>
              <td class="px-4 py-3">{{ user.role?.name || 'N/A' }}</td>
              <td class="px-4 py-3">{{ user.department?.name_en || 'N/A' }}</td>
              <td class="px-4 py-3">
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  user.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                ]">
                  {{ user.status || 'N/A' }}
                </span>
              </td>
              <td class="px-4 py-3 flex gap-2">
                <button @click="openViewModal(user)"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                  title="View User">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="openEditModal(user)"
                  :disabled="loading"
                  class="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Edit User">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="confirmDelete(user.id)"
                  class="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition"
                  title="Delete User">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mt-6 flex justify-between items-center">
      <div class="text-sm text-gray-600">
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
        {{ Math.min(currentPage * itemsPerPage, totalUsers) }}
        of {{ totalUsers }} users
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

    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showViewModal"
        class="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50" @click.self="closeViewModal">
        <div
          class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all max-h-[80vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900">User Details</h3>
            <button @click="closeViewModal"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition" title="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div v-if="selectedUser" class="space-y-5 border-t border-gray-200 pt-5">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="text-sm font-semibold text-gray-600">Name (KH)</label>
                <p class="text-gray-900 font-medium">
                  {{ selectedUser.first_name_kh }} {{ selectedUser.last_name_kh }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Name (EN)</label>
                <p class="text-gray-900 font-medium">
                  {{ selectedUser.first_name_en }} {{ selectedUser.last_name_en }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Username</label>
                <p class="text-gray-900 font-medium">
                  {{ selectedUser.username }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Email</label>
                <p class="text-gray-900 font-medium">
                  {{ selectedUser.email }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Role</label>
                <p class="text-gray-900 font-medium">
                  {{ selectedUser.role?.name || 'N/A' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Department</label>
                <p class="text-gray-900 font-medium">
                  {{ selectedUser.department?.name_en || 'N/A' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Phone Number</label>
                <p class="text-gray-900 font-medium">
                  {{ selectedUser.phone_number || 'N/A' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Gender</label>
                <p class="text-gray-900 font-medium">
                  {{ selectedUser.gender || 'N/A' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Date of Birth</label>
                <p class="text-gray-900 font-medium">
                  {{ selectedUser.dob ? new Date(selectedUser.dob).toLocaleDateString() : 'N/A' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">Status</label>
                <p :class="[
                  'text-sm font-medium',
                  selectedUser.status === 'Active'
                    ? 'text-green-800'
                    : 'text-red-800'
                ]">
                  {{ selectedUser.status || 'N/A' }}
                </p>
              </div>
            </div>
          </div>
          <div class="mt-8 flex justify-end">
            <button @click="closeViewModal"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200">
              Close
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showCreateModal"
        class="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50" @click.self="closeCreateModal">
        <div
          class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all max-h-[80vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900">
              {{ isEditing ? 'Edit User' : 'Create User' }}
            </h3>
            <button @click="closeCreateModal"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition" title="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="space-y-5 border-t border-gray-200 pt-5">
            <div>
              <label class="text-sm font-semibold text-gray-600">First Name (KH)</label>
              <input v-model="form.first_name_kh" type="text"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter first name (KH)" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Last Name (KH)</label>
              <input v-model="form.last_name_kh" type="text"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter last name (KH)" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">First Name (EN)</label>
              <input v-model="form.first_name_en" type="text"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter first name (EN)" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Last Name (EN)</label>
              <input v-model="form.last_name_en" type="text"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter last name (EN)" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Username</label>
              <input v-model="form.username" type="text"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter username" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Email</label>
              <input v-model="form.email" type="email"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter email" />
            </div>
            <div v-if="!isEditing">
              <label class="text-sm font-semibold text-gray-600">Password</label>
              <input v-model="form.password" type="password"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter password" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Role</label>
              <select v-model="form.role"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                <option value="" disabled>Select a role</option>
                <option v-for="role in roles" :key="role._id" :value="role._id">
                  {{ role.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Department</label>
              <select v-model="form.department"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                <option value="" disabled>Select a department</option>
                <option v-for="department in departments" :key="department._id" :value="department._id">
                  {{ department.name_en }}
                </option>
              </select>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Phone Number</label>
              <input v-model="form.phone_number" type="text"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter phone number" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Gender</label>
              <select v-model="form.gender"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Date of Birth</label>
              <input v-model="form.dob" type="date"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter date of birth" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Status</label>
              <select v-model="form.status"
                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div class="mt-8 flex justify-end gap-4">
            <button @click="closeCreateModal"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition duration-200">
              Cancel
            </button>
            <button @click="saveUser"
              :disabled="loading"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isEditing ? 'Update' : 'Create' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="modal">
      <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showDeleteModal"
        class="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50" @click.self="closeDeleteModal">
        <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4 transform transition-all">
          <div class="text-center">
            <i class="fas fa-exclamation-triangle text-red-500 text-5xl mb-4"></i>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Confirm Deletion</h3>
            <p class="text-gray-600">Are you sure you want to delete this user? This action cannot be undone.</p>
          </div>
          <div class="mt-8 flex justify-center gap-4">
            <button @click="closeDeleteModal"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition duration-200">
              Cancel
            </button>
            <button @click="deleteUser"
              :disabled="loading"
              class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              Delete
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getAllUser, createUser, updateUser, deleteUser } from '@/apis/user';
import { getAllRole } from '@/apis/role';
import { getAllDepartment } from '@/apis/department';

export default {
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,
      totalUsers: 0,
      showCreateModal: false,
      showViewModal: false,
      showDeleteModal: false,
      isEditing: false,
      selectedUser: null,
      userToDeleteId: null,
      form: {
        id: null,
        first_name_kh: '',
        last_name_kh: '',
        first_name_en: '',
        last_name_en: '',
        username: '',
        email: '',
        password: '',
        role: '',
        department: '',
        phone_number: '',
        gender: 'Male',
        dob: '',
        status: 'Active'
      },
      users: [],
      roles: [],
      departments: [],
      errorMessage: '',
      successMessage: '',
      loading: false
    };
  },
  computed: {
    filteredUsers() {
      if (!this.users || !Array.isArray(this.users)) {
        return [];
      }
      return this.users.filter((user) => {
        const searchQuery = this.searchQuery.toLowerCase();
        return (
          this.searchQuery === '' ||
          (user.username && user.username.toLowerCase().includes(searchQuery)) ||
          (user.email && user.email.toLowerCase().includes(searchQuery)) ||
          `${user.first_name_kh} ${user.last_name_kh}`.toLowerCase().includes(searchQuery) ||
          `${user.first_name_en} ${user.last_name_en}`.toLowerCase().includes(searchQuery)
        );
      });
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredUsers.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.totalUsers / this.itemsPerPage) || 1;
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
    async getAllUsers(page = 1) {
      this.loading = true;
      try {
        const result = await getAllUser({ page, limit: this.itemsPerPage });
        console.log('Get All Users response:', result);
        if (result && result.status === 1 && Array.isArray(result.data)) {
          this.users = result.data.map(user => ({
            id: user._id || null,
            first_name_kh: user.first_name_kh || '',
            last_name_kh: user.last_name_kh || '',
            first_name_en: user.first_name_en || '',
            last_name_en: user.last_name_en || '',
            username: user.username || '',
            email: user.email || '',
            role: user.role || { _id: null, name: 'N/A' },
            department: user.department || { _id: null, name_en: 'N/A' },
            phone_number: user.phone_number || '',
            gender: user.gender || 'N/A',
            dob: user.dob || null,
            status: user.status || 'Active'
          }));
          this.currentPage = result.page || 1;
          this.itemsPerPage = result.limit || 10;
          this.totalUsers = result.total || this.users.length;
          console.log('Mapped users:', this.users);
        } else {
          this.alert('Failed to load users. Invalid response format.', 'error');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        this.alert('Error fetching users: ' + error.message, 'error');
      } finally {
        this.loading = false;
      }
    },
    async getAllRoles() {
      this.loading = true;
      try {
        const result = await getAllRole();
        console.log('Get All Roles response:', result);
        let rolesData = [];
        if (result && result.status === 1 && Array.isArray(result.roles)) {
          rolesData = result.roles; // Case: { status: 1, roles: [...] }
        } else if (result && result.status === 1 && Array.isArray(result.data)) {
          rolesData = result.data; // Case: { status: 1, data: [...] }
        } else if (result && result.status === 200 && Array.isArray(result.data)) {
          rolesData = result.data; // Case: { status: 200, data: [...] }
        } else if (Array.isArray(result)) {
          rolesData = result; // Case: Direct array
        } else {
          throw new Error('Invalid roles data format');
        }
        this.roles = rolesData;
        if (this.roles.length === 0) {
          this.alert('No roles available.', 'error');
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        this.alert('Error fetching roles: ' + error.message, 'error');
      } finally {
        this.loading = false;
      }
    },
    async getAllDepartments() {
      this.loading = true;
      try {
        const result = await getAllDepartment();
        console.log('Get All Departments response:', result);
        let departmentsData = [];
        if (result && result.status === 200 && Array.isArray(result.departments)) {
          departmentsData = result.departments; // Case: { status: 200, departments: [...] }
        } else if (result && result.status === 200 && Array.isArray(result.data)) {
          departmentsData = result.data; // Case: { status: 200, data: [...] }
        } else if (result && result.status === 200 && Array.isArray(result.data.departments)) {
          departmentsData = result.data.departments; // Case: { status: 200, data: { departments: [...] } }
        } else if (Array.isArray(result)) {
          departmentsData = result; // Case: Direct array
        } else {
          throw new Error('Invalid department data format');
        }
        this.departments = departmentsData;
        if (this.departments.length === 0) {
          this.alert('No departments available.', 'error');
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        this.alert('Error fetching departments: ' + error.message, 'error');
      } finally {
        this.loading = false;
      }
    },
    async saveUser() {
      if (
        !this.form.first_name_kh ||
        !this.form.last_name_kh ||
        !this.form.first_name_en ||
        !this.form.last_name_en ||
        !this.form.username ||
        !this.form.email ||
        (!this.isEditing && !this.form.password) ||
        !this.form.role ||
        !this.form.department ||
        !this.form.phone_number ||
        !this.form.gender ||
        !this.form.dob
      ) {
        this.alert('Please fill in all required fields.', 'error');
        return;
      }
      this.loading = true;
      try {
        if (this.isEditing) {
          const { id, password, ...formData } = this.form; // Exclude password when editing
          const updatedUser = await updateUser(this.form.id, formData);
          if (updatedUser && updatedUser.status === 200) {
            await this.getAllUsers(this.currentPage);
            this.alert('User updated successfully!');
          } else {
            this.alert('Failed to update user. Please try again.', 'error');
          }
        } else {
          const { id, ...formData } = this.form;
          const newUser = await createUser(formData);
          if (newUser && newUser.status === 201) {
            await this.getAllUsers(this.currentPage);
            this.alert('User created successfully!');
          } else {
            this.alert('Failed to create user. Please try again.', 'error');
          }
        }
        this.closeCreateModal();
      } catch (error) {
        console.error('Error saving user:', error);
        this.alert('Error saving user: ' + error.message, 'error');
      } finally {
        this.loading = false;
      }
    },
    confirmDelete(id) {
      if (!id) {
        this.alert('Invalid user ID.', 'error');
        return;
      }
      console.log('Confirm Delete ID:', id);
      this.userToDeleteId = id;
      this.showDeleteModal = true;
    },
    async deleteUser() {
      if (!this.userToDeleteId) {
        this.alert('No user selected for deletion.', 'error');
        return;
      }
      this.loading = true;
      try {
        console.log('Deleting user with ID:', this.userToDeleteId);
        const result = await deleteUser(this.userToDeleteId);
        console.log('Delete API response:', result);
        if (result && [200, 204].includes(result.status)) {
          await this.getAllUsers(this.currentPage);
          this.alert('User deleted successfully!');
        } else {
          this.alert(`Failed to delete user. Status: ${result?.status || 'unknown'}`, 'error');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        this.alert('Error deleting user: ' + error.message, 'error');
      } finally {
        this.loading = false;
        this.closeDeleteModal();
      }
    },
    filterData() {
      this.currentPage = 1;
      this.getAllUsers(this.currentPage);
    },
    resetFilters() {
      this.searchQuery = '';
      this.currentPage = 1;
      this.getAllUsers(this.currentPage);
    },
    openCreateModal() {
      if (this.roles.length === 0 || this.departments.length === 0) {
        this.alert('Please wait for roles and departments to load.', 'error');
        return;
      }
      this.isEditing = false;
      this.form = {
        id: null,
        first_name_kh: '',
        last_name_kh: '',
        first_name_en: '',
        last_name_en: '',
        username: '',
        email: '',
        password: '',
        role: '',
        department: '',
        phone_number: '',
        gender: 'Male',
        dob: '',
        status: 'Active'
      };
      this.showCreateModal = true;
    },
    openEditModal(user) {
      console.log('User for editing:', user);
      if (!user.id) {
        this.alert('Invalid user ID.', 'error');
        return;
      }
      if (this.roles.length === 0 || this.departments.length === 0) {
        this.alert('Please wait for roles and departments to load.', 'error');
        return;
      }
      this.isEditing = true;
      this.form = {
        id: user.id,
        first_name_kh: user.first_name_kh || '',
        last_name_kh: user.last_name_kh || '',
        first_name_en: user.first_name_en || '',
        last_name_en: user.last_name_en || '',
        username: user.username || '',
        email: user.email || '',
        password: '', // Do not prefill password
        role: user.role?._id || '',
        department: user.department?._id || '',
        phone_number: user.phone_number || '',
        gender: user.gender || 'Male',
        dob: user.dob ? user.dob.split('T')[0] : '',
        status: user.status || 'Active'
      };
      this.showCreateModal = true;
    },
    openViewModal(user) {
      console.log('User for viewing:', user);
      if (!user.id) {
        this.alert('Invalid user ID.', 'error');
        return;
      }
      this.selectedUser = { ...user };
      this.showViewModal = true;
    },
    closeCreateModal() {
      this.showCreateModal = false;
      this.isEditing = false;
      this.form = {
        id: null,
        first_name_kh: '',
        last_name_kh: '',
        first_name_en: '',
        last_name_en: '',
        username: '',
        email: '',
        password: '',
        role: '',
        department: '',
        phone_number: '',
        gender: 'Male',
        dob: '',
        status: 'Active'
      };
    },
    closeViewModal() {
      this.showViewModal = false;
      this.selectedUser = null;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.userToDeleteId = null;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.getAllUsers(this.currentPage);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.getAllUsers(this.currentPage);
      }
    },
    goToPage(page) {
      this.currentPage = page;
      this.getAllUsers(this.currentPage);
    }
  },
  async mounted() {
    console.log('Component mounted, fetching data...');
    this.loading = true;
    try {
      await Promise.all([this.getAllRoles(), this.getAllDepartments(), this.getAllUsers()]);
    } catch (error) {
      console.error('Error during initial data fetch:', error);
      this.alert('Failed to load initial data: ' + error.message, 'error');
    } finally {
      this.loading = false;
    }
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
```