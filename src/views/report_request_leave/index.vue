<template>
    <div>
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-extrabold tracking-tight text-green-700">
                Leave Report
            </h2>

            <button
                class="py-3 font-semibold text-white transition duration-300 ease-in-out transform shadow-md cursor-pointer px-7 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:scale-105 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300">
                <i class="fa-solid fa-download"></i>
                Export
            </button>
        </div>

        <div class="p-6 mb-8 bg-white rounded-lg shadow-sm">
            <div class="flex flex-col w-full gap-4 sm:flex-row sm:items-end">
                <!-- Search -->
                <div class="flex-1">
                    <label class="block mb-2 text-sm font-medium text-gray-700">Search</label>
                    <input type="text" v-model="filters.name"
                        class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Search by employee, leave type, or reason" />
                </div>

                <!-- Leave Type -->
                <div class="flex-1">
                    <label class="block mb-2 text-sm font-medium text-gray-700">Leave Type</label>
                    <select v-model="filters.type"
                        class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">All</option>
                        <option v-for="type in leaveTypes" :key="type.code" :value="type.code">
                            {{ type.name }}
                        </option>
                    </select>
                </div>

                <!-- Status -->
                <div class="flex-1">
                    <label class="block mb-2 text-sm font-medium text-gray-700">Status</label>
                    <select v-model="filters.status"
                        class="w-full px-4 py-2 transition border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">All</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>

                <!-- Buttons -->
                <div class="flex gap-4">
                    <button @click="resetFilters"
                        class="px-6 py-2 font-medium text-gray-800 transition duration-200 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300">
                        Reset
                    </button>
                    <button @click="applyFilters"
                        class="px-6 py-2 font-medium text-white transition duration-200 bg-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-700">
                        Search
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
                <table class="min-w-full text-sm rounded-lg shadow-md table-auto">
                    <thead class="text-xs font-semibold text-gray-700 uppercase bg-gray-200">
                        <tr>
                            <th class="px-5 py-4 text-left text-green-700">No</th>
                            <th class="px-5 py-4 text-left text-green-700">Approver</th>
                            <th class="px-5 py-4 text-left text-green-700">Employee</th>
                            <th class="px-5 py-4 text-left text-green-700">Department</th>
                            <th class="px-5 py-4 text-left text-green-700">Leave Type</th>
                            <th class="px-5 py-4 text-left text-green-700">Start Date</th>
                            <th class="px-5 py-4 text-left text-green-700">End Date</th>
                            <th class="px-5 py-4 text-left text-green-700">Reason</th>
                            <th class="px-5 py-4 text-left text-green-700">Status</th>
                            <th class="px-5 py-4 text-left text-green-700">Actions</th>
                        </tr>
                    </thead>

                    <tbody class="text-gray-700">
                        <tr v-if="leaveRequests.length === 0">
                            <td colspan="10" class="px-5 py-4 text-center text-gray-500">
                                No leave requests found.
                            </td>
                        </tr>

                        <tr v-for="(request, index) in leaveRequests" :key="request.id"
                            class="transition border-b border-gray-200 hover:bg-gray-50">
                            <td class="px-5 py-4 font-medium">
                                {{ index + 1 + (pagination.page - 1) * pagination.limit }}
                            </td>
                            <td class="px-5 py-4">{{ request.approverName }}</td>
                            <td class="px-5 py-4">{{ request.employeeName }}</td>
                            <td class="px-5 py-4">{{ request.department }}</td>
                            <td class="px-5 py-4">{{ request.leaveTypeName }}</td>
                            <td class="px-5 py-4">{{ request.startDate }}</td>
                            <td class="px-5 py-4">{{ request.endDate }}</td>
                            <td class="px-5 py-4">{{ request.reason || 'No reason provided' }}</td>

                            <td class="px-5 py-4">
                                <span :class="[
                                    'px-5 py-2 rounded-full text-xs font-medium',
                                    request.status === 'APPROVED'
                                        ? 'bg-green-200 text-green-800'
                                        : request.status === 'PENDING'
                                            ? 'bg-blue-200 text-blue-800'
                                            : (request.status === 'CANCELLED' || request.status === 'DRAFT')
                                                ? 'bg-yellow-200 text-yellow-800'
                                                : 'bg-red-200 text-red-800'
                                ]">
                                    {{ request.status }}
                                </span>
                            </td>

                            <td class="flex gap-1 px-3 py-4">
                                <button @click="openViewModal(request)"
                                    class="p-1 text-green-600 transition rounded-full cursor-pointer hover:bg-green-100 hover:text-green-800"
                                    title="View Request">
                                    <i class="text-xl fas fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="flex items-center justify-between mt-6" v-if="!isLoading && totalPages">
            <div class="text-sm text-gray-600">
                Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ leaveRequests.length }} requests
            </div>
            <div class="flex gap-2">
                <button @click="prevPage" :disabled="pagination.page === 1"
                    class="px-4 py-2 text-gray-800 transition duration-200 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300">
                    Previous
                </button>

                <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="[
                    'px-4 py-2 rounded-lg transition duration-200',
                    pagination.page === page ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                ]">
                    {{ page }}
                </button>

                <button @click="nextPage" :disabled="pagination.page === totalPages"
                    class="px-4 py-2 text-gray-800 transition duration-200 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300">
                    Next
                </button>
            </div>
        </div>

    </div>
</template>

<script>
import { getLeaveRequestsReport, getLeaveType } from '@/apis/request-leave';
import moment from 'moment';

export default {
    name: 'LeaveRequestsReport',
    data() {
        return {
            leaveRequests: [],
            reportDate: null,
            filters: {
                name: '',
                type: '',
                status: ''
            },
            pagination: {
                total: 0,
                page: 1,
                limit: 10
            },
            leaveTypes: [],
            isLoading: false
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.pagination.total / this.pagination.limit) || 1;
        },
        startIndex() {
            return (this.pagination.page - 1) * this.pagination.limit;
        },
        endIndex() {
            return Math.min(this.startIndex + this.pagination.limit, this.leaveRequests.length);
        }
    },
    methods: {
        async getLeaveRequestsReport() {
            try {
                this.isLoading = true;
                const params = {
                    name: this.filters.name || undefined,
                    type: this.filters.type || undefined,
                    status: this.filters.status || undefined,
                    page: this.pagination.page,
                    limit: this.pagination.limit
                };
                const res = await getLeaveRequestsReport(params);

                if (res && res.data) {
                    this.leaveRequests = res.data.map(request => {
                        const departmentName = request.user?.department?.name_en || 'N/A';
                        return {
                            id: request._id || '',
                            employeeId: request.user?._id || '',
                            employeeName: request.user
                                ? `${request.user.first_name_en || ''} ${request.user.last_name_en || ''}`.trim()
                                : 'Unknown Employee',
                            department: departmentName,
                            leaveTypeId: request.type?._id || '',
                            leaveTypeName: request.type?.name || 'Unknown Type',
                            startDate: this.formatDate(request.fromDate),
                            endDate: this.formatDate(request.toDate),
                            approverId: request.approver?._id || '',
                            approverName: request.approver
                                ? `${request.approver.first_name_en || ''} ${request.approver.last_name_en || ''}`.trim()
                                : 'N/A',
                            status: request.status || 'PENDING',
                            reason: request.reason || 'No reason provided'
                        };
                    });

                    if (res.pagination) {
                        this.pagination.total = res.pagination.total || 0;
                        this.pagination.page = res.pagination.page || 1;
                        this.pagination.limit = res.pagination.limit || 10;
                    }
                    this.reportDate = res.date || null;
                } else {
                    this.leaveRequests = [];
                    this.pagination.total = 0;
                }
            } catch (err) {
                console.error('Error fetching leave requests:', err);
            } finally {
                this.isLoading = false;
            }
        },

        async getLeaveType() {
            try {
                const response = await getLeaveType();
                if (response.status === 1) {
                    this.leaveTypes = response.leaveTypes;
                }
            } catch (error) {
                console.error('Error fetching leave types:', error);
            }
        },

        applyFilters() {
            this.pagination.page = 1;
            this.getLeaveRequestsReport();
        },

        resetFilters() {
            this.filters = { name: '', type: '', status: '' };
            this.pagination.page = 1;
            this.getLeaveRequestsReport();
        },

        changePage(newPage) {
            if (newPage >= 1 && newPage <= this.totalPages) {
                this.pagination.page = newPage;
                this.getLeaveRequestsReport();
            }
        },

        formatDate(date) {
            return date ? moment(date).format('DD-MMM-YYYY') : 'N/A';
        },

        openViewModal(request) {
            console.log('View modal for:', request);
        },
        prevPage() {
            if (this.pagination.page > 1) {
                this.pagination.page--;
                this.getLeaveRequestsReport();
            }
        },
        nextPage() {
            if (this.pagination.page < this.totalPages) {
                this.pagination.page++;
                this.getLeaveRequestsReport();
            }
        },
        goToPage(page) {
            if (page !== this.pagination.page) {
                this.pagination.page = page;
                this.getLeaveRequestsReport();
            }
        }
    },
    created() {
        this.getLeaveRequestsReport();
        this.getLeaveType();
    }
};
</script>
