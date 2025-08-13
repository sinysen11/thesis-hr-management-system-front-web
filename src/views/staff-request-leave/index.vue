<template>
    <div class="w-full">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-3xl font-extrabold text-gray-900">Staff Leave Request</h2>
        </div>
        <!-- Filters -->
        <div class="p-6 mb-8 bg-white rounded-lg shadow-sm">
            <div class="flex flex-col items-end gap-4 sm:flex-row">
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700">Search</label>
                    <input type="text" v-model="searchQuery"
                        class="border border-gray-300 rounded-lg px-4 py-2 w-[300px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="Search by employee name, leave type, or reason" @input="filterData" />
                </div>
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700">Status</label>
                    <select v-model="filterStatus"
                        class="border border-gray-300 rounded-lg px-4 py-2 w-[200px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        @change="filterData">
                        <option value="">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
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

        <!-- Loading -->
        <div v-if="isLoading" class="py-4 text-center">
            <i class="text-6xl text-green-700 fas fa-spinner fa-spin"></i>
        </div>

        <!-- Table -->
        <div v-else class="overflow-hidden bg-white rounded-lg shadow-sm">
            <div class="overflow-x-auto">
                <table class="min-w-full text-sm table-auto">
                    <thead class="text-xs font-semibold text-gray-600 uppercase bg-gray-100">
                        <tr>
                            <th class="px-4 py-3 text-left">No</th>
                            <th class="px-4 py-3 text-left">Employee Name</th>
                            <th class="px-4 py-3 text-left">Department</th>
                            <th class="px-4 py-3 text-left">Leave Type</th>
                            <th class="px-4 py-3 text-left">Start Date</th>
                            <th class="px-4 py-3 text-left">End Date</th>
                            <!-- <th class="px-4 py-3 text-left">Approver</th> -->
                            <th class="px-4 py-3 text-left">Reason</th>
                            <th class="px-4 py-3 text-left">Status</th>
                            <th class="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-700">
                        <tr v-if="paginatedRequests.length === 0">
                            <td colspan="10" class="px-4 py-3 text-center">No leave requests found.</td>
                        </tr>
                        <tr v-for="(request, index) in paginatedRequests" :key="request.id"
                            class="transition border-b border-gray-200 hover:bg-gray-50">
                            <td class="px-4 py-3">{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
                            <td class="px-4 py-3">{{ request.employeeName }}</td>
                            <td class="px-4 py-3">{{ request.department }}</td>
                            <td class="px-4 py-3">{{ request.leaveTypeName }}</td>
                            <td class="px-4 py-3">{{ request.startDate }}</td>
                            <td class="px-4 py-3">{{ request.endDate }}</td>
                            <!-- <td class="px-4 py-3">{{ request.approverName }}</td> -->
                            <td class="px-4 py-3">{{ request.reason || 'No reason provided' }}</td>
                            <td class="px-4 py-3">
                                <span :class="[
                                    'px-2 py-1 rounded-full text-xs font-medium',
                                    request.status === 'APPROVED'
                                        ? 'bg-green-400 text-white'
                                        : request.status === 'PENDING' ? 'bg-blue-400 text-white' : 'bg-red-400 text-white',
                                ]">
                                    {{ request.status }}
                                </span>
                            </td>
                            <td class="px-4 py-3">
                                <button @click="openViewModal(request)"
                                    class="p-2 text-indigo-600 transition rounded-full cursor-pointer hover:text-indigo-800 hover:bg-indigo-100"
                                    title="View Request" aria-label="View Request">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between mt-6" v-if="!isLoading">
            <div class="text-sm text-gray-600">
                Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredRequests.length }} requests
            </div>
            <div class="flex gap-2">
                <button @click="prevPage" :disabled="currentPage === 1"
                    class="px-4 py-2 text-gray-800 transition duration-200 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300">
                    Previous
                </button>
                <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="[
                    'px-4 py-2 rounded-lg transition duration-200',
                    currentPage === page ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300',
                ]">
                    {{ page }}
                </button>
                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-4 py-2 text-gray-800 transition duration-200 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300">
                    Next
                </button>
            </div>
        </div>

        <!-- View Modal -->
        <transition name="modal">
            <div style="background-color: rgb(0 0 0 / 0.5);" v-if="showViewModal"
                class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60" @click.self="closeViewModal">
                <div class="w-full max-w-lg p-8 mx-4 transition-all transform bg-white shadow-2xl rounded-xl">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-2xl font-bold text-gray-900">Staff Leave Request Details</h3>
                        <button @click="closeViewModal"
                            class="p-2 text-gray-500 transition rounded-full cursor-pointer hover:text-gray-700 hover:bg-gray-100"
                            title="Close" aria-label="Close Modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div v-if="selectedRequest" class="pt-5 space-y-5 border-t border-gray-200">
                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label class="text-sm font-semibold text-gray-600">Employee Name</label>
                                <p class="font-medium text-gray-900">{{ selectedRequest.employeeName }}</p>
                            </div>
                            <div>
                                <label class="text-sm font-semibold text-gray-600">Department</label>
                                <p class="font-medium text-gray-900">{{ selectedRequest.department }}</p>
                            </div>
                            <div>
                                <label class="text-sm font-semibold text-gray-600">Leave Type</label>
                                <p class="font-medium text-gray-900">{{ selectedRequest.leaveTypeName }}</p>
                            </div>
                            <div>
                                <label class="text-sm font-semibold text-gray-600">Start Date</label>
                                <p class="font-medium text-gray-900">{{ selectedRequest.startDate }}</p>
                            </div>
                            <div>
                                <label class="text-sm font-semibold text-gray-600">End Date</label>
                                <p class="font-medium text-gray-900">{{ selectedRequest.endDate }}</p>
                            </div>
                            <div>
                                <label class="text-sm font-semibold text-gray-600">Status</label>
                                <p :class="[
                                    'text-sm font-medium',
                                    selectedRequest.status === 'APPROVED'
                                        ? 'text-green-800'
                                        : selectedRequest.status === 'PENDING'
                                            ? 'text-yellow-800'
                                            : 'text-red-800',
                                ]">
                                    {{ selectedRequest.status }}
                                </p>
                            </div>
                            <div class="sm:col-span-2">
                                <label class="text-sm font-semibold text-gray-600">Reason</label>
                                <p class="font-medium text-gray-900">
                                    {{ selectedRequest.reason || 'No reason provided' }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-end gap-4 mt-8" v-if="selectedRequest.status === 'PENDING'">
                        <button @click="onAllowLeaveRequest(selectedRequest.id, 'REJECTED')"
                            class="px-6 py-2 font-medium text-white transition duration-200 bg-red-600 rounded-lg cursor-pointer hover:bg-red-700"
                            aria-label="Close Modal">
                            Rejected
                        </button>
                        <button @click="onAllowLeaveRequest(selectedRequest.id, 'APPROVED')"
                            class="px-6 py-2 font-medium text-white transition duration-200 bg-green-600 rounded-lg cursor-pointer hover:bg-green-700"
                            aria-label="Close Modal">
                            Approved
                        </button>
                    </div>
                    <div class="flex justify-end gap-4 mt-8" v-if="selectedRequest.status !== 'PENDING'">
                        <button @click="closeViewModal"
                            class="px-6 py-2 font-medium text-white transition duration-200 bg-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-700"
                            aria-label="Close Modal">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </transition>

        <div v-if="notification.visible" :class="[
            'fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg text-white font-semibold',
            notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        ]" style="min-width: 250px; z-index: 9999;">
            {{ notification.message }}
        </div>

    </div>
</template>

<script>
import { getUserInfoCookie } from '@/services/authentication';
import { getStaffRequestForApprover, allowStaffRequestLeave } from '@/apis/request-leave';
import moment from 'moment';

export default {
    data() {
        return {
            searchQuery: '',
            filterStatus: '',
            currentPage: 1,
            itemsPerPage: 10,
            isLoading: false,
            leaveRequests: [],
            showViewModal: false,
            selectedRequest: null,
            userInfo: null,
            notification: {
                message: '',
                type: '',
                visible: false
            }
        };
    },
    computed: {
        filteredRequests() {
            return this.leaveRequests.filter((request) => {
                const matchSearch =
                    this.searchQuery === '' ||
                    request.employeeName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    request.leaveTypeName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    (request.reason && request.reason.toLowerCase().includes(this.searchQuery.toLowerCase()));

                const matchStatus = this.filterStatus === '' || request.status === this.filterStatus;

                return matchSearch && matchStatus;
            });
        },
        paginatedRequests() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredRequests.slice(start, start + this.itemsPerPage);
        },
        totalPages() {
            return Math.max(Math.ceil(this.filteredRequests.length / this.itemsPerPage), 1);
        },
        startIndex() {
            return (this.currentPage - 1) * this.itemsPerPage;
        },
        endIndex() {
            return Math.min(this.currentPage * this.itemsPerPage, this.filteredRequests.length);
        }
    },
    methods: {
        async fetchLeaveRequests(user_id) {
            this.isLoading = true;
            try {
                const response = await getStaffRequestForApprover(user_id);
                if (response && response.data) {
                    this.leaveRequests = response.data.map((request) => {
                        let departmentName = 'N/A';
                        if (request.user?.department) {
                            departmentName = request.user.department.name_en || 'N/A';
                        }
                        return {
                            id: request._id || '',
                            employeeId: request.user?._id || '',
                            employeeName: request.user
                                ? `${request.user.first_name_en || ''} ${request.user.last_name_en || ''}`.trim() || 'Unknown Employee'
                                : 'Unknown Employee',
                            department: departmentName,
                            leaveTypeId: request.type?._id || '',
                            leaveTypeName: request.type?.name || 'Unknown Type',
                            startDate: this.formatDate(request.fromDate),
                            endDate: this.formatDate(request.toDate),
                            approverId: request.approver?._id || '',
                            approverName: request.approver
                                ? `${request.approver.first_name_en || ''} ${request.approver.last_name_en || ''}`.trim() || 'N/A'
                                : 'N/A',
                            status: request.status || 'PENDING',
                            reason: request.reason || 'No reason provided'
                        };
                    });
                } else {
                    this.leaveRequests = [];
                }
            } catch (error) {
                console.error('Error fetching leave requests:', error);
                this.leaveRequests = [];
            } finally {
                this.isLoading = false;
                this.adjustCurrentPage();
            }
        },

        async onAllowLeaveRequest(request_id, status) {
            try {
                const response = await allowStaffRequestLeave(request_id, status);
                if (response.status === 1) {
                    this.isLoading = true;
                    this.closeViewModal();
                    await this.fetchLeaveRequests(this.userInfo._id);
                    this.showNotification(`Leave request ${status.toLowerCase()} successfully`);
                }
            } catch (error) {
                console.error('Error allowing leave request:', error);
                this.closeViewModal();
                this.showNotification('Failed to update leave request.', 'error');
            } finally {
                this.isLoading = false;
            }
        },

        showNotification(message, type = 'success') {
            this.notification.message = message;
            this.notification.type = type;
            this.notification.visible = true;

            setTimeout(() => {
                this.notification.visible = false;
            }, 3000);
        },

        openViewModal(request) {
            this.selectedRequest = request;
            console.log(this.selectedRequest)
            this.showViewModal = true;
        },
        closeViewModal() {
            this.showViewModal = false;
            this.selectedRequest = null;
        },
        filterData() {
            this.currentPage = 1; // reset to first page on filter
        },
        resetFilters() {
            this.searchQuery = '';
            this.filterStatus = '';
            this.currentPage = 1;
        },
        prevPage() {
            if (this.currentPage > 1) this.currentPage--;
        },
        nextPage() {
            if (this.currentPage < this.totalPages) this.currentPage++;
        },
        goToPage(page) {
            this.currentPage = page;
        },
        formatDate(date) {
            return date ? moment(date).format('DD-MMM-YYYY') : 'N/A';
        },
        adjustCurrentPage() {
            if (this.currentPage > this.totalPages) {
                this.currentPage = this.totalPages;
            }
        }
    },
    created() {
        const userInfoCookie = getUserInfoCookie();
        if (userInfoCookie) {
            try {
                this.userInfo = JSON.parse(userInfoCookie);
            } catch {
                this.userInfo = null;
            }
        }
        if (this.userInfo && this.userInfo._id) {
            this.fetchLeaveRequests(this.userInfo._id);
        }
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
