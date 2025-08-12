<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-extrabold text-gray-900">Leave Balance</h2>
      <button @click="openCreateModal"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200 cursor-pointer">
        Apply Leave
      </button>
    </div>

    <!-- Leave Balance Card -->
    <div class="bg-white shadow rounded-lg p-6 max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold text-gray-800">Annual Leave</h3>
        <span class="text-2xl font-bold text-indigo-600">12 / 18</span>
      </div>
      <p class="text-gray-600 mb-4">Days remaining for this year</p>
      <div class="bg-indigo-100 rounded-full h-4">
        <div class="bg-indigo-600 h-4 rounded-full" style="width: 60%"></div>
      </div>
    </div>
  </div>
</template>
<script>
import FlatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment';

export default {
  components: {
    FlatPickr
  },
  data() {
    return {
      roleItem: [],
      userInfo: null,
      searchQuery: '',
      filterStatus: '',
      currentPage: 1,
      itemsPerPage: 10,
      showCreateModal: false,
      showViewModal: false,
      showDeleteModal: false,
      deleteRequestId: null,
      isEditing: false,
      isLoading: false,
      isAdmin: false,
      currentUserId: null,
      myId: null,
      selectedRequest: null,
  
      form: {
        id: null,
        fromDate: '',
        toDate: '',
        reason: ''
      },
      flatpickrConfig: {
        dateFormat: 'd-M-Y',
        altInput: true,
        altFormat: 'd-M-Y',
        allowInput: true
      },
      leaveRequests: []
    };
  },
  computed: {
   
  },
  methods: {
  },
  created() {
  },
  mounted() {
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleEscape);
  }
};
</script>