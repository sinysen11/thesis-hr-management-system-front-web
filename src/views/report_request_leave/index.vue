<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-extrabold tracking-tight text-green-700">
        Leave Summary & Audit Report
      </h2>
      <button @click="exportToExcel" :disabled="isLoading || isExporting"
        class="px-6 py-2 font-medium text-white transition duration-200 bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
        <i class="mr-2 fas fa-file-excel"></i>
        Export Report
      </button>
    </div>

    <div class="p-6 mb-8 bg-white rounded-lg shadow-sm">
      <div class="flex flex-col w-full gap-4 sm:flex-row sm:items-end">
        <div class="flex-1">
          <label class="block mb-2 text-sm font-medium text-gray-700">Search</label>
          <input type="text" v-model="filters.name"
            class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Search by approver, employee" />
        </div>

        <div class="flex-1">
          <label class="block mb-2 text-sm font-medium text-gray-700">Leave Type</label>
          <select v-model="filters.type"
            class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
            <option value="">All</option>
            <option v-for="type in leaveTypes" :key="type.code" :value="type._id">
              {{ type.name }}
            </option>
          </select>
        </div>

        <div class="flex-1">
          <label class="block mb-2 text-sm font-medium text-gray-700">Status</label>
          <select v-model="filters.status"
            class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
            <option value="">All (Excl. Cancelled)</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div class="flex-1">
          <label class="block mb-2 text-sm font-medium text-gray-700">From Date</label>
          <input type="date" v-model="filters.fromDate"
            class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
        </div>

        <div class="flex-1">
          <label class="block mb-2 text-sm font-medium text-gray-700">To Date</label>
          <input type="date" v-model="filters.toDate"
            class="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
        </div>

        <div class="flex gap-4">
          <button @click="resetFilters"
            class="px-6 py-2 font-medium text-gray-800 transition bg-gray-200 rounded-lg hover:bg-gray-300">
            Reset
          </button>
          <button @click="applyFilters" :disabled="isLoading"
            class="px-6 py-2 font-medium text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
            Search
          </button>
        </div>
      </div>
    </div>

    <div v-if="isLoading || isExporting" class="py-4 text-center">
      <i class="text-6xl text-green-700 fas fa-spinner fa-spin"></i>
      <p class="mt-2 text-gray-600">
        {{ isExporting ? 'Preparing export data...' : 'Loading report data...' }}
      </p>
    </div>

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
              <th class="px-5 py-4 text-left text-green-700">Days Pending</th>
              <th class="px-5 py-4 text-left text-green-700">Status</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr v-if="leaveRequests?.length === 0">
              <td colspan="9" class="px-5 py-4 text-center text-gray-500">
                No leave requests found matching the filters.
              </td>
            </tr>

            <tr v-for="(request, index) in leaveRequests" :key="request.id"
              class="transition border-b border-gray-200 hover:bg-gray-50">
              <td class="px-5 py-4">{{ startIndex + index + 1 }}</td>
              <td class="px-5 py-4">{{ request.approverName }}</td>
              <td class="px-5 py-4">{{ request.employeeName }}</td>
              <td class="px-5 py-4">{{ request.departmentName }}</td>
              <td class="px-5 py-4">{{ request.leaveTypeName }}</td>
              <td class="px-5 py-4">{{ formatDate(request.fromDate) }}</td>
              <td class="px-5 py-4">{{ formatDate(request.toDate) }}</td>
              <td class="px-5 py-4 font-semibold text-orange-600">
                {{ request.daysPending !== null ? request.daysPending + ' Days' : 'N/A' }}
              </td>
              <td class="px-5 py-4">
                <span :class="[
                  'px-4 py-1 rounded-full text-xs font-semibold uppercase',
                  request.status === 'APPROVED'
                    ? 'bg-green-200 text-green-800'
                    : request.status === 'PENDING'
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-red-200 text-red-800'
                ]">
                  {{ request.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="totalPages > 1" class="flex items-center justify-between p-4 border-t">
        <button @click="prevPage" :disabled="pagination.page === 1"
          class="px-4 py-2 text-sm font-medium text-gray-600 transition bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50">
          Previous
        </button>
        <div class="text-sm text-gray-700">
          Page **{{ pagination.page }}** of **{{ totalPages }}** (Total: **{{ pagination.total }}** Requests)
        </div>
        <button @click="nextPage" :disabled="pagination.page === totalPages"
          class="px-4 py-2 text-sm font-medium text-gray-600 transition bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50">
          Next
        </button>
      </div>
    </div>

    <div class="mt-10">
      <h3 class="mb-4 text-xl font-bold text-green-700">Other Analytical Reports</h3>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div class="p-4 bg-white rounded-lg shadow">
          <h4 class="mb-3 font-semibold text-green-700">💰 Leave Balance & Liability Report</h4>
          <p class="mb-3 text-sm text-gray-600">Shows remaining leave and future booked leave liability.</p>
          <button @click="getBalanceReport" :disabled="isBalanceLoading"
            class="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50">
            <i class="mr-2 fas fa-chart-pie"></i>
            {{ isBalanceLoading ? 'Loading...' : 'View Balance Report' }}
          </button>
          <div v-if="balanceReport.length" class="mt-4">
            <p class="mb-1 text-xs font-semibold text-gray-700">Showing first 5 results:</p>
            <table class="w-full text-sm border border-gray-200 table-fixed">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-3 py-2 text-left">Employee</th>
                  <th class="px-3 py-2 text-center">Remaining (Hrs)</th>
                  <th class="px-3 py-2 text-center">Booked Future (Hrs)</th>
                  <th class="px-3 py-2 text-center">Projected Balance (Hrs)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(b, i) in balanceReport.slice(0, 5)" :key="i" class="border-t">
                  <td class="px-3 py-2 truncate">{{ b.employeeName }}</td>
                  <td class="px-3 py-2 font-medium text-center">{{ b.leaveRemainingHours.toFixed(2) }}</td>
                  <td class="px-3 py-2 text-center text-red-600">{{ b.hoursBookedFuture.toFixed(2) }}</td>
                  <td class="px-3 py-2 font-bold text-center"
                    :class="{ 'text-red-700': b.projectedBalanceHours < 0, 'text-green-700': b.projectedBalanceHours >= 0 }">
                    {{ b.projectedBalanceHours.toFixed(2) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="p-4 bg-white rounded-lg shadow">
    <h4 class="mb-3 font-semibold text-purple-700">🏢 Department-wise Leave Analysis</h4>
    <p class="mb-3 text-sm text-gray-600">Aggregated approved leave usage by department (Current Year).</p>

    <div class="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3">
        <div class="col-span-1">
            <label for="deptIdFilter" class="block mb-1 text-xs font-medium text-gray-700">
                Department:
            </label>
            <select id="deptIdFilter" v-model="departmentFilters.departmentId"
                class="w-full px-3 py-2 text-sm border rounded">
                <option value="">All Departments</option>
                <option v-for="dept in departments" :key="dept._id" :value="dept._id">
                    {{ dept.name }}
                </option>
            </select>
        </div>

        <div class="col-span-1">
            <label for="deptFromDate" class="block mb-1 text-xs font-medium text-gray-700">
                Start Date:
            </label>
            <input type="date" id="deptFromDate" v-model="departmentFilters.fromDate"
                class="w-full px-3 py-2 text-sm border rounded" />
        </div>
        <div class="col-span-1">
            <label for="deptToDate" class="block mb-1 text-xs font-medium text-gray-700">
                End Date:
            </label>
            <input type="date" id="deptToDate" v-model="departmentFilters.toDate"
                class="w-full px-3 py-2 text-sm border rounded" />
        </div>
    </div>

    <button @click="getDepartmentReport" :disabled="isDepartmentLoading"
        class="px-5 py-2 text-sm font-medium text-white bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50">
        <i class="mr-2 fas fa-building"></i>
        {{ isDepartmentLoading ? 'Loading...' : 'View Department Report' }}
    </button>
    </div>

        <div class="p-4 bg-white rounded-lg shadow">
          <div class="flex items-center justify-between mb-6">
            <h4 class="mb-3 font-semibold text-green-700">🧾 Employee Leave History</h4>
            <button @click="exportByEmployee" :disabled="isLoading || isExporting"
              class="px-6 py-2 font-medium text-white transition duration-200 bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
              <i class="mr-2 fas fa-file-excel"></i>
              Export
            </button>
          </div>
          <p class="mb-3 text-sm text-gray-600">Shows all historical requests for a specific employee.</p>
          <select v-model="employeeIdFilter" class="w-full px-3 py-2 mb-2 border rounded">
            <option value="" disabled>Select an Employee</option>
            <option v-for="employee in employees" :key="employee._id" :value="employee._id">
              {{ employee.last_name_en + " " + employee.first_name_en }}
            </option>
          </select>
          <button @click="getEmployeeHistory" :disabled="isHistoryLoading || !employeeIdFilter"
            class="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50">
            <i class="mr-2 fas fa-history"></i>
            {{ isHistoryLoading ? 'Loading...' : 'View History' }}
          </button>
          <div v-if="employeeHistory.length" class="mt-4">
            <p class="mb-1 text-xs font-semibold text-gray-700">Showing latest 5 results for: {{
              employeeHistory[0].employeeName }}</p>
            <ul class="mt-3 space-y-1 text-sm text-gray-700">
              <li v-for="(h, i) in employeeHistory" :key="i">
                <span class="font-semibold">{{ formatDate(h.fromDate) }} - {{ formatDate(h.toDate) }}</span>:
                {{ h.leaveTypeName }} ({{ h.totalDaysRequested }} Days) -
                <span :class="{ 'text-green-600': h.status === 'APPROVED', 'text-red-600': h.status !== 'APPROVED' }">{{
                  h.status }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="p-4 bg-white rounded-lg shadow">
          <h4 class="mb-3 font-semibold text-blue-700">📅 Upcoming Approved Leave</h4>
          <p class="mb-3 text-sm text-gray-600">Shows all leave requests that start *after* today and are approved.</p>
          <button @click="getUpcomingReport" :disabled="isUpcomingLoading"
            class="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50">
            <i class="mr-2 fas fa-calendar-alt"></i>
            {{ isUpcomingLoading ? 'Loading...' : 'View Upcoming Report' }}
          </button>
          <div v-if="upcomingReport.length" class="mt-4">
            <p class="mb-1 text-xs font-semibold text-gray-700">Showing first 5 results:</p>
            <ul class="mt-3 space-y-1 text-sm text-gray-700">
              <li v-for="(u, i) in upcomingReport.slice(0, 5)" :key="i" class="truncate">
                <span class="font-semibold">{{ formatDate(u.fromDate) }}</span>: {{ u.employeeName }}
                ({{ u.leaveTypeName }})
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getLeaveSummaryAndAuditReport,
  getEmployeeLeaveHistory,
  getLeaveBalanceAndLiabilityReport,
  getDepartmentWiseLeaveReport
} from '@/apis/request-leave';
import { getAllDepartment } from '@/apis/department';
import { getLeaveType } from '@/apis/request-leave';
import { getAllUser } from '@/apis/user';

import moment from 'moment';
import * as XLSX from 'xlsx-js-style';

export default {
  name: 'LeaveRequestsReport',
  data() {
    return {
      leaveRequests: [],
      filters: {
        name: '',
        type: '',
        status: '',
        fromDate: '',
        toDate: ''
      },
      pagination: {
        total: 0,
        page: 1,
        limit: 10
      },
      leaveTypes: [],
      employees: [],
      isLoading: false,
      isExporting: false,

      employeeIdFilter: '',
      isBalanceLoading: false,
      isDepartmentLoading: false,
      isHistoryLoading: false,
      isUpcomingLoading: false,
      departmentFilters: {
        departmentId: '',
        fromDate: null,
        toDate: null
      },
      balanceReport: [],
      departmentReport: [],
      employeeHistory: [],
      upcomingReport: []
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.pagination.total / this.pagination.limit) || 1;
    },
    startIndex() {
      return (this.pagination.page - 1) * this.pagination.limit;
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
          limit: this.pagination.limit,
          ...(this.filters.fromDate && { fromDate: this.filters.fromDate }),
          ...(this.filters.toDate && { toDate: this.filters.toDate })
        };

        const res = await getLeaveSummaryAndAuditReport(params);

        if (res && res.data) {
          this.leaveRequests = res.data.map(request => ({
            ...request,
            employeeName: request.employeeName || 'Unknown Employee',
            departmentName: request.departmentName || 'N/A',
            leaveTypeName: request.leaveTypeName || 'Unknown Type',
            approverName: request.approverName || 'N/A',
            fromDate: request.fromDate,
            toDate: request.toDate,
            status: request.status || 'PENDING',
            daysPending: request.daysPending // New audit field
          }));

          if (res.pagination) {
            this.pagination.total = res.pagination.total || 0;
            this.pagination.page = res.pagination.page || 1;
            this.pagination.limit = res.pagination.limit || 10;
          }
        } else {
          this.leaveRequests = [];
          this.pagination.total = 0;
        }
      } catch (err) {
        console.error('Error fetching leave summary report:', err);
      } finally {
        this.isLoading = false;
      }
    },

    async getEmployeesList() {
      try {
        const result = await getAllUser();
        if (result && result.status === 1) {
          this.employees = result.data

          this.currentPage = result.pagination?.page;
          this.itemsPerPage = result.pagination?.limit || this.itemsPerPage;
          this.totalUsers = result.pagination?.total || this.users.length;
        } else {
          this.alert('Failed to load users. Invalid response format.', 'error');
          this.users = [];
          this.totalUsers = 0;
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        this.alert('Error fetching users: ' + error.message, 'error');
        this.users = [];
        this.totalUsers = 0;
      } finally {
        this.loading = false;
      }
    },

    async getLeaveType() {
      try {
        const response = await getLeaveType();
        if (response.status === 1) {
          // Assuming the leave type object contains {_id, name, code}
          this.leaveTypes = response.leaveTypes || response.data;
        }
      } catch (error) {
        console.error('Error fetching leave types:', error);
      }
    },

    async exportToExcel() {
    try {
        this.isExporting = true;

        const exportParams = {
            name: this.filters.name || undefined,
            type: this.filters.type || undefined,
            status: this.filters.status || undefined,
            limit: 99999,
            page: 1,
            ...(this.filters.fromDate && { fromDate: this.filters.fromDate }),
            ...(this.filters.toDate && { toDate: this.filters.toDate })
        };

        const res = await getLeaveSummaryAndAuditReport(exportParams);

        if (!res || !res.data || res.data.length === 0) {
            console.error('No data to export.');
            return;
        }

        const allLeaveRequests = res.data;
        const rawBalances = Array.isArray(res.balances) ? res.balances.flat(Infinity) : [];
        const year = moment().year();

        // --- Build employee map ---
        const employeeMap = {};
        for (const req of allLeaveRequests) {
            const name = req.employeeName || 'Unknown';
            if (!employeeMap[name]) {
                employeeMap[name] = {
                    employeeName: name,
                    overdrawn: false,
                    totalRequests: 0
                };
            }
            employeeMap[name].totalRequests++;
        }

        // --- Map balances into employeeMap ---
        for (const b of rawBalances) {
            const empName = b.employeeName || b.ownerName || b.employee || null;
            const isOver = !!b.isOverdrawn;
            if (!empName) continue;

            if (!employeeMap[empName]) {
                employeeMap[empName] = {
                    employeeName: empName,
                    overdrawn: false,
                    totalRequests: 0
                };
            }

            if (isOver) employeeMap[empName].overdrawn = true;
        }

        // --- Prepare balance section ---
        const balanceHeader = [
            'Employee Name',
            'Overdrawn',
            'Total Requests'
        ];

        const balanceRows = Object.values(employeeMap)
            .sort((a, b) => a.employeeName.localeCompare(b.employeeName))
            .map(emp => [
                emp.employeeName,
                emp.overdrawn ? 'Yes' : 'No',
                emp.totalRequests
            ]);

        // --- Prepare detailed requests ---
        const requestHeader = [
            'No.',
            'Approver',
            'Employee',
            'Department',
            'Leave Type',
            'Total Days Requested',
            'Start Date',
            'End Date',
            'Days Pending',
            'Reason',
            'Status',
            'Requested On'
        ];

        const sortedRequests = [...allLeaveRequests].sort((a, b) => {
            const ta = new Date(a.createdAt || a.requestedOn || a.fromDate).getTime() || 0;
            const tb = new Date(b.createdAt || b.requestedOn || b.fromDate).getTime() || 0;
            return tb - ta;
        });

        const requestRows = sortedRequests.map((req, index) => [
            index + 1,
            req.approverName || 'N/A',
            req.employeeName || 'Unknown',
            req.departmentName || req.department || 'N/A',
            req.leaveTypeName || req.leaveType || 'N/A',
            req.totalDaysRequested ?? req.totalDays ?? 'N/A',
            this.formatDate(req.fromDate),
            this.formatDate(req.toDate),
            req.daysPending != null ? req.daysPending : 'N/A',
            req.reason || '',
            req.status || 'PENDING',
            this.formatDate(req.createdAt || req.requestedOn)
        ]);

        // --- Build worksheet ---
        const wsData = [];
        let currentRow = 0; // Use a single counter for clarity

        wsData.push(['Leave Summary & Audit Report']); currentRow++;
        wsData.push(['Year', year]); currentRow++;
        wsData.push(['Total Requests', allLeaveRequests.length]); currentRow++;
        wsData.push([]); currentRow++; // Row 3: Spacer
        wsData.push(['Employee Leave Balances']); currentRow++; // Row 4: Section Title

        const balanceHeaderRow = currentRow; // Row 5: Balance Header Start
        wsData.push(balanceHeader); currentRow++; 
        for (const r of balanceRows) wsData.push(r); currentRow += balanceRows.length;
        
        wsData.push([]); currentRow++; // Spacer
        wsData.push(['Detailed Leave Requests']); currentRow++; // Section Title

        const requestsHeaderRow = currentRow; // Row 8 + balanceRows.length: Requests Header Start
        wsData.push(requestHeader); currentRow++;
        for (const r of requestRows) wsData.push(r); currentRow += requestRows.length;

        const worksheet = XLSX.utils.aoa_to_sheet(wsData);

        worksheet['!cols'] = [
            { wch: 25 }, { wch: 12 }, { wch: 15 }, { wch: 20 },
            { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
            { wch: 15 }, { wch: 30 }, { wch: 15 }, { wch: 20 }
        ];

        // --- Header styling function (FIXED: Always creates a cell object if missing) ---
        const styleHeaderRow = (rowIndex, colCount) => {
            const headerStyle = {
                fill: { fgColor: { rgb: '10B981' }}, // green background
                font: { bold: true, color: { rgb: 'FFFFFF' }}, // white text
                alignment: { horizontal: 'center', vertical: 'center' }
            };

            for (let c = 0; c < colCount; ++c) {
                const cellRef = XLSX.utils.encode_cell({ c, r: rowIndex });
                
                // If cell doesn't exist (e.g., from sparse data), create it.
                if (!worksheet[cellRef]) {
                    worksheet[cellRef] = { v: '', t: 's' }; // Create text cell placeholder
                }
                
                // Apply style, guaranteed to work
                worksheet[cellRef].s = headerStyle;
            }
        };

        // Apply color for both header tables (THIS IS WHERE THE COLUMN HEADERS ARE STYLED)
        styleHeaderRow(balanceHeaderRow, balanceHeader.length);
        styleHeaderRow(requestsHeaderRow, requestHeader.length);

        // --- Highlight overdrawn employees (red background) ---
        const balanceStartRow = balanceHeaderRow + 1;
        for (let i = 0; i < balanceRows.length; ++i) {
            const overdrawnValue = balanceRows[i][1];
            if (overdrawnValue.toLowerCase() === 'yes') {
                // Style the 'Overdrawn' cell itself (Column 1)
                const cellRef = XLSX.utils.encode_cell({ c: 1, r: balanceStartRow + i });
                if (worksheet[cellRef]) {
                    worksheet[cellRef].s = {
                        fill: { fgColor: { rgb: 'FFC7CE' }},
                        font: { color: { rgb: '9C0006' }}
                    };
                }
            }
        }

        // --- Export workbook ---
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Leave Report');
        XLSX.writeFile(workbook, `Leave_Report_${year}_${moment().format('YYYY-MM-DD_HHmmss')}.xlsx`);
    } catch (err) {
        console.error('Error exporting to Excel:', err);
    } finally {
        this.isExporting = false;
    }
},
    
    // async exportToExcel() {
    //   try {
    //     this.isExporting = true;

    //     const exportParams = {
    //       name: this.filters.name || undefined,
    //       type: this.filters.type || undefined,
    //       status: this.filters.status || undefined,
    //       limit: 99999,
    //       page: 1,
    //       ...(this.filters.fromDate && { fromDate: this.filters.fromDate }),
    //       ...(this.filters.toDate && { toDate: this.filters.toDate })
    //     };

    //     const res = await getLeaveSummaryAndAuditReport(exportParams);

    //     if (!res || !res.data || res.data.length === 0) {
    //       console.error('No data to export.');
    //       return;
    //     }

    //     const allLeaveRequests = res.data;

    //     const header = [
    //       'No.',
    //       'Approver',
    //       'Employee',
    //       'Department',
    //       'Leave Type',
    //       'Total Days Requested',
    //       'Start Date',
    //       'End Date',
    //       'Days Pending',
    //       'Reason',
    //       'Status',
    //       'Requested On'
    //     ];

    //     const dataRows = allLeaveRequests.map((request, index) => {
    //       return [
    //         index + 1,
    //         request.approverName,
    //         request.employeeName,
    //         request.departmentName,
    //         request.leaveTypeName,
    //         request.totalDaysRequested || 'N/A',
    //         this.formatDate(request.fromDate),
    //         this.formatDate(request.toDate),
    //         request.daysPending !== null ? request.daysPending : 'N/A',
    //         request.reason || 'No reason provided',
    //         request.status || 'PENDING',
    //         this.formatDate(request.createdAt)
    //       ];
    //     });

    //     const wsData = [header, ...dataRows];
    //     const worksheet = XLSX.utils.aoa_to_sheet(wsData);

    //     const wscols = [
    //       { wch: 5 }, { wch: 20 }, { wch: 25 }, { wch: 20 }, { wch: 15 },
    //       { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 30 },
    //       { wch: 10 }, { wch: 15 }
    //     ];
    //     worksheet['!cols'] = wscols;

    //     const headerStyle = {
    //       fill: { fgColor: { rgb: '10B981' }},
    //       font: { bold: true, color: { rgb: 'FFFFFF' }},
    //       alignment: { horizontal: 'center' }
    //     };

    //     for (let C = 0; C < header.length; ++C) {
    //       const cellRef = XLSX.utils.encode_cell({ c: C, r: 0 });
    //       if (worksheet[cellRef]) {
    //         worksheet[cellRef].s = headerStyle;
    //       }
    //     }

    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Leave Summary');
    //     XLSX.writeFile(
    //       workbook,
    //       `Leave_Audit_Report_${moment().format('YYYY-MM-DD_HHmmss')}.xlsx`
    //     );
    //   } catch (err) {
    //     console.error('Error exporting to Excel:', err);
    //   } finally {
    //     this.isExporting = false;
    //   }
    // },

    async exportByEmployee() {
      if (!this.employeeIdFilter) return;
      try {
        this.isExporting = true;

        // Fetch leave summary + balances for this employee
        const res = await getLeaveSummaryAndAuditReport({
          employeeId: this.employeeIdFilter,
          limit: 50
        });

        if (!res || !res.data || res.data.length === 0) {
          console.error('No data to export for this employee.');
          return;
        }

        const history = res.data;
        const employeeName = history[0]?.employeeName || 'Unknown Employee';
        const year = moment().year(); // Adjust if you have year info

        // Extract balances from API response
        const balancesArray = res.balances?.[0] || [];

        // Prepare balances table
        const balanceHeader = ['Leave Type', 'Total Left Days', 'Overdrawn'];
        const balanceRows = balancesArray.map(b => [
          b.name,
          b.totalLeftDays,
          b.isOverdrawn ? 'Yes' : 'No'
        ]);

        // Header for leave request table
        const leaveHeader = [
          'No.', 'Leave Type', 'Start Date', 'End Date', 'Total Days Requested', 'Days Pending', 'Reason', 'Status'
        ];

        const leaveRows = history.map((h, index) => [
          index + 1,
          h.leaveTypeName,
          this.formatDate(h.fromDate),
          this.formatDate(h.toDate),
          h.totalDaysRequested || 'N/A',
          h.reason || 'No reason provided',
          h.status || 'PENDING'
        ]);

        // Combine all data in a single sheet
        const wsData = [
          ['Employee Name', employeeName],
          ['Year', year],
          [], // empty row
          ['Leave Balances'],
          balanceHeader,
          ...balanceRows,
          [], // empty row
          ['Leave Request History'],
          leaveHeader,
          ...leaveRows
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(wsData);

        // Column widths
        worksheet['!cols'] = [
          { wch: 5 }, { wch: 20 }, { wch: 15 }, { wch: 15 },
          { wch: 10 }, { wch: 12 }, { wch: 30 }, { wch: 12 }
        ];

        // Style balance header
        for (let C = 0; C < balanceHeader.length; ++C) {
          const cellRef = XLSX.utils.encode_cell({ c: C, r: 4 }); // balanceHeader row
          if (worksheet[cellRef]) {
            worksheet[cellRef].s = {
              fill: { fgColor: { rgb: '10B981' }}, // green header
              font: { bold: true, color: { rgb: 'FFFFFF' }},
              alignment: { horizontal: 'center' }
            };
          }
        }

        // Style leave request header
        const leaveHeaderRow = 8 + balanceRows.length; // row index where leaveHeader is
        for (let C = 0; C < leaveHeader.length; ++C) {
          const cellRef = XLSX.utils.encode_cell({ c: C, r: leaveHeaderRow });
          if (worksheet[cellRef]) {
            worksheet[cellRef].s = {
              fill: { fgColor: { rgb: '10B981' }},
              font: { bold: true, color: { rgb: 'FFFFFF' }},
              alignment: { horizontal: 'center' }
            };
          }
        }

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee Leave History');
        XLSX.writeFile(workbook, `Leave_History_${employeeName}_${year}.xlsx`);
      } catch (err) {
        console.error('Error exporting employee leave history:', err);
      } finally {
        this.isExporting = false;
      }
    },

    async getBalanceReport() {
      try {
        this.isBalanceLoading = true;
        this.balanceReport = [];
        const res = await getLeaveBalanceAndLiabilityReport();
        if (res && res.data) {
          this.balanceReport = res.data;
        }
      } catch (err) {
        console.error('Error fetching balance report:', err);
      } finally {
        this.isBalanceLoading = false;
      }
    },

    async getDepartmentReport() {
    try {
        this.isDepartmentLoading = true;
        this.departmentReport = []; // Clear previous data

        const params = {
            year: moment().year(), 
            
            ...(this.departmentFilters.fromDate && { fromDate: this.departmentFilters.fromDate }),
            ...(this.departmentFilters.toDate && { toDate: this.departmentFilters.toDate })
       
        };

        // 2. Call the API with the new, flexible parameters
        const res = await getDepartmentWiseLeaveReport(params);

        if (res && res.data) {
            this.departmentReport = res.data;
        }
    } catch (err) {
        console.error('Error fetching department report:', err);
    } finally {
        this.isDepartmentLoading = false;
    }
},

    async getEmployeeHistory() {
      if (!this.employeeIdFilter) return;
      try {
        this.isHistoryLoading = true;
        this.employeeHistory = [];
        const res = await getEmployeeLeaveHistory(this.employeeIdFilter);
        console.log(res)
        if (res && res.data) {
          this.employeeHistory = res.data;
        }
      } catch (err) {
        console.error('Error fetching employee history:', err);
      } finally {
        this.isHistoryLoading = false;
      }
    },

    async getUpcomingReport() {
      try {
        this.isUpcomingLoading = true;
        this.upcomingReport = [];

        const res = await getLeaveSummaryAndAuditReport({
          upcoming: true,
          limit: 50,
          sort: 'fromDate:asc'
        });
        if (res && res.data) {
          this.upcomingReport = res.data;
        }
      } catch (err) {
        console.error('Error fetching upcoming report:', err);
      } finally {
        this.isUpcomingLoading = false;
      }
    },

    // --- Utility Methods ---

    applyFilters() {
      this.pagination.page = 1;
      this.getLeaveRequestsReport();
    },

    resetFilters() {
      this.filters = { name: '', type: '', status: '', fromDate: '', toDate: '' };
      this.pagination.page = 1;
      this.getLeaveRequestsReport();
    },

    async getAllDepartments() {
      this.loading = true;
      try {
        const result = await getAllDepartment();
        let departmentsData = [];
        if (
          result &&
          result.status === 1 &&
          Array.isArray(result.departments)
        ) {
          departmentsData = result.departments;
        } else if (
          result &&
          result.status === 1 &&
          Array.isArray(result.data)
        ) {
          departmentsData = result.data;
        } else if (Array.isArray(result)) {
          departmentsData = result;
        } else {
          throw new Error('Invalid department data format');
        }
        this.departments = departmentsData.map((dept) => ({
          _id: dept._id || null,
          name_en: dept.name_en || 'N/A',
          name_kh: dept.name_kh || '',
          description: dept.description || ''
        }));
        if (this.departments.length === 0) {
          this.alert('No departments available.', 'error');
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        this.alert(`Error fetching departments: ${error.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    // Consolidated page logic
    goToPage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.pagination.page = newPage;
        this.getLeaveRequestsReport();
      }
    },

    formatDate(date) {
      return date ? moment(date).format('DD-MMM-YYYY') : 'N/A';
    },

    prevPage() {
      this.goToPage(this.pagination.page - 1);
    },

    nextPage() {
      this.goToPage(this.pagination.page + 1);
    }
  },
  created() {
    this.getLeaveRequestsReport();
    this.getLeaveType();
    this.getEmployeesList();
    this.getAllDepartments();
  }
};
</script>
<style scoped>
.table-fixed {
  table-layout: fixed;
}
</style>