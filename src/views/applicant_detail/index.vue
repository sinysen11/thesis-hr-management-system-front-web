<template>
    <div class="applicant-detail-container" v-if="applicantData">
        <div class="header">
            <h1 class="header-title">
                Applicant Detail: {{ applicantData.applicant.first_name }} {{
                    applicantData.applicant.last_name }}

                <span :class="getStatusClass(applicantData.status)"
                    class="px-3 py-1 ml-3 text-base font-bold tracking-wider uppercase align-middle rounded-lg">
                    {{ applicantData.status }}
                </span>
            </h1>

            <div class="action-buttons">
                <button v-if="applicantData.status === 'SUBMITTED'" @click="shortlistApplicant(applicantData._id)"
                    :disabled="isShortlisting || isHiring || isRejecting || isProcessing" class="btn-shortlist">
                    <i v-if="isShortlisting" class="fas fa-spinner fa-spin icon-left"></i>
                    <i v-else class="fas fa-star icon-left"></i>
                    Shortlist
                </button>

                <button v-if="['SHORTLISTED'].includes(applicantData.status)"
                    @click="openScheduleModal(applicantData._id)"
                    :disabled="isHiring || isRejecting || isShortlisting || isProcessing" class="btn-interview">
                    <i class="fas fa-calendar-alt icon-left"></i>
                    Call Interview
                </button>

                <button v-if="applicantData.status === 'INTERVIEWING'" @click="hireApplicant(applicantData._id)"
                    :disabled="isHiring || isRejecting || isShortlisting || isProcessing" class="btn-hired">
                    <i v-if="isHiring" class="fas fa-spinner fa-spin icon-left"></i>
                    <i v-else class="fas fa-check-circle icon-left"></i>
                    Hired
                </button>
                <button v-if="applicantData.status === 'INTERVIEWING' || applicantData.status === 'SUBMITTED'" @click="rejectApplicant(applicantData._id)"
                    :disabled="isRejecting || isHiring || isShortlisting || isProcessing" class="btn-reject">
                    <i v-if="isRejecting" class="fas fa-spinner fa-spin icon-left"></i>
                    <i v-else class="fas fa-times-circle icon-left"></i>
                    Reject
                </button>
            </div>
        </div>

        <section class="card personal-info">
            <h2><i class="fas fa-user-circle icon-left"></i>Personal Information</h2>
            <div class="detail-grid">
                <p><strong>Full Name:</strong> {{ applicantData.applicant.first_name }} {{
                    applicantData.applicant.last_name }}</p>
                <p><strong>Gender:</strong> {{ applicantData.applicant.sex }}</p>
                <p><strong>Date of Birth:</strong> {{ formatDate(applicantData.applicant.dob) }}</p>
                <p><strong>Current Address:</strong> {{ applicantData.applicant.current_address }}</p>
                <p><strong>Phone:</strong> {{ applicantData.applicant.phone }}</p>
                <p><strong>Email:</strong> {{ applicantData.applicant.email }}</p>
                <p><strong>Telegram:</strong> {{ applicantData.applicant.telegram }}</p>
                <p><strong>Applied Count:</strong> {{ applicantData.applicant.apply_count }} times</p>
            </div>
        </section>

        <section class="card application-details">
            <h2><i class="fas fa-file-alt icon-left"></i>Application Details</h2>
            <div class="detail-grid">
                <p><strong>Applied For:</strong> <span class="highlight-position">{{
                    applicantData.apply_position
                        }}</span></p>
                <p><strong>Job Title (Internal):</strong> {{ applicantData.jobId?.title?.des_en }} ({{
                    applicantData.jobId?.department?.name_en }} Dept.)</p>
                <p><strong>Job Salary Range:</strong> <span class="salary-range">${{
                    applicantData.jobId?.salary
                        }}</span></p>
                <p><strong>Requested Location:</strong> {{ applicantData?.requested_location }}</p>
                <p><strong>Expected Salary:</strong> <span class="salary-range">${{
                    applicantData.expected_salary
                        }}</span></p>
                <p><strong>Applied Date:</strong> {{ formatDate(applicantData.createdAt) }}</p>
                <p class="full-width"><strong>Reason for Application:</strong> {{
                    applicantData.why_apply }}</p>
                <p><strong>Knows Someone:</strong> {{ applicantData.knows_someone ? 'Yes' : 'No' }}</p>
                <p v-if="applicantData.knows_someone && applicantData.knows_someone_details !== 'none'">
                    <strong>Details:</strong> {{ applicantData.knows_someone_details }}
                </p>
                <a :href="getResumeLink(applicantData.resume?.path)" target="_blank" class="resume-link">
                    <i class="fas fa-download icon-left"></i> View Resume ({{
                        applicantData?.resume?.filename }})
                </a>
            </div>
        </section>

        <section class="card interview-details" v-if="applicantData.interview && applicantData.interview.date">
            <h2><i class="fas fa-calendar-check icon-left"></i>Interview Details</h2>
            <div class="detail-grid">
                <p><strong>Date:</strong> {{ formatDate(applicantData.interview.date) }}</p>
                <p><strong>Time:</strong> {{ applicantData.interview.time }}</p>
                <p><strong>Mode:</strong> {{ applicantData.interview.mode }}</p>
                <p><strong>Location/Link:</strong> {{ applicantData.interview.location }}</p>
                <p class="full-width"><strong>Notes:</strong> {{ applicantData.interview.notes || 'N/A' }}</p>
            </div>
        </section>
        <section class="card education">
            <h2><i class="fas fa-graduation-cap icon-left"></i>Education</h2>
            <div class="detail-grid">
                <p><strong>Degree:</strong> {{ applicantData.degree }}</p>
                <p><strong>Major:</strong> {{ applicantData.major }}</p>
                <p><strong>School Name:</strong> {{ applicantData.school_name }}</p>
                <p><strong>Location:</strong> {{ applicantData.location }}</p>
                <p><strong>Attended:</strong> {{ applicantData.education_from_year }} to {{
                    formatDateYear(applicantData.education_to_year) }}</p>
            </div>
        </section>

        <section class="card experience">
            <h2><i class="fas fa-briefcase icon-left"></i>Last Work Experience</h2>
            <div class="detail-grid">
                <p><strong>Company:</strong> {{ applicantData.company }}</p>
                <p><strong>Position:</strong> {{ applicantData.position }}</p>
                <p><strong>Salary (USD):</strong> <span class="salary-range">${{
                    applicantData.salary_usd }}</span></p>
                <p><strong>Duration:</strong> {{ formatDate(applicantData.start_date) }} to {{
                    formatDate(applicantData.end_date) }}</p>
            </div>
        </section>

    </div>

    <div v-if="showScheduleModal" class="modal-overlay" @click.self="closeScheduleModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Schedule Interview for {{ applicantData.applicant.first_name }}</h3>
                <button @click="closeScheduleModal" class="modal-close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <form @submit.prevent="scheduleInterview">
                    <div class="form-group date-time-group">
                        <label for="interview-date">Date:</label>
                        <input type="date" id="interview-date" v-model="interviewDetails.date" required
                            class="form-input">
                    </div>
                    <div class="form-group date-time-group">
                        <label for="interview-time">Time:</label>
                        <input type="time" id="interview-time" v-model="interviewDetails.time" required
                            class="form-input">
                    </div>

                    <div class="form-group">
                        <label for="interview-mode">Mode:</label>
                        <select id="interview-mode" v-model="interviewDetails.mode" required class="form-input">
                            <option value="" disabled>Select Mode</option>
                            <option value="In-person">In-person (Head Office)</option>
                            <option value="Video Call">Online (Zoom)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="interview-location">Location / Link:</label>
                        <input type="text" id="interview-location" v-model="interviewDetails.location" required
                            :placeholder="interviewDetails.mode === 'In-person' ? 'Office Address' : 'Meeting Link'"
                            class="form-input">
                    </div>

                    <div class="form-group">
                        <label for="interview-notes">Notes / Instructions:</label>
                        <textarea id="interview-notes" v-model="interviewDetails.notes" class="form-input"></textarea>
                    </div>

                    <div class="modal-footer">
                        <button type="button" @click="closeScheduleModal" class="btn-secondary">Cancel</button>
                        <button type="submit" :disabled="isProcessing" class="btn-primary">
                            <i v-if="isProcessing" class="fas fa-spinner fa-spin"></i>
                            <span v-else>Confirm</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div v-if="confirmDialog.show" class="modal-overlay" @click.self="confirmDialog.show = false">
        <div class="modal-content modal-dialog-small">
            <div class="modal-header">
                <h3>Confirm Action</h3>
                <button @click="cancelConfirmation" class="modal-close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <p class="dialog-message">{{ confirmDialog.message }}</p>
            </div>
            <div class="modal-footer">
                <button @click="cancelConfirmation" class="btn-secondary">Cancel</button>
                <button @click="executeConfirmedAction" :class="['btn-primary', confirmDialog.styleClass]">
                    Confirm {{ confirmDialog.actionLabel }}
                </button>
            </div>
        </div>
    </div>

    <div v-if="isLoading && !applicantData" class="py-12 text-center loading-message">
        <i class="text-6xl text-indigo-600 fas fa-spinner fa-spin"></i>
        <p class="mt-4 text-gray-600">Loading applicant details...</p>
    </div>
    <div v-else-if="!applicantData" class="error-message">
        <i class="fas fa-exclamation-triangle"></i> Could not load applicant data.
    </div>

    <div v-if="snackbar.show"
        :class="['snackbar', { 'snackbar-success': snackbar.type === 'success', 'snackbar-error': snackbar.type === 'error' }]">
        <i :class="['icon-left', snackbar.type === 'success' ? 'fas fa-check-circle' : 'fas fa-times-circle']"></i>
        {{ snackbar.message }}
    </div>
</template>

<script>
import { getApplicantById, updateInterviewStatus } from '@/apis/applicant';

export default {
    data() {
        return {
            applicantData: null,
            isLoading: true,
            isProcessing: false,
            isShortlisting: false,
            isHiring: false,
            isRejecting: false,
            showScheduleModal: false,
            selectedJobId: null,
            interviewDetails: {
                date: '',
                time: '',
                location: '',
                mode: '',
                notes: ''
            },
            snackbar: {
                show: false,
                message: '',
                type: 'success'
            },
            snackbarTimeout: null,
            // NEW CUSTOM DIALOG STATE
            confirmDialog: {
                show: false,
                message: '',
                action: null, // Function to execute on confirmation
                actionLabel: '',
                styleClass: ''
            }
        };
    },

    async created() {
        const applicantId = this.$route.params.id;
        if (!applicantId) {
            this.isLoading = false;
            return;
        }
        await this.fetchApplicantData(applicantId);
    },

    methods: {
        // --- Data Fetching ---
        async fetchApplicantData(id) {
            this.isLoading = true;
            try {
                const response = await getApplicantById(id);
                if (response.status === 1 && response.data) {
                    this.applicantData = response.data;
                    this.selectedJobId = response.data._id;
                } else {
                    this.applicantData = null;
                }
            } catch (error) {
                this.applicantData = null;
            } finally {
                this.isLoading = false;
            }
        },

        async updateStatus(applicantId, status, interviewData = null, processingKey = 'isProcessing') {
            if (!applicantId) return false;

            this[processingKey] = true;

            const actionName = status === 'INTERVIEWING' ? 'Schedule Interview' : status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

            try {
                const payload = {
                    status: status,
                    ...(interviewData && { interview: interviewData })
                };

                const res = await updateInterviewStatus(applicantId, payload);
                if (res.status === 1) {
                    this.isLoading = true;
                    await this.fetchApplicantData(applicantId);

                    this.showSnackbar(`${actionName} successfully!`, 'success');

                    return true;
                } else {
                    this.showSnackbar(`Failed to perform action: ${actionName}. ${res.message}`, 'error');
                    return false;
                }
            } catch (err) {
                const apiErrorMessage = err.response?.data?.message || err.response?.data?.error;

                const errorMessage = apiErrorMessage || err.message || `An unexpected network error occurred during ${actionName.toLowerCase()}.`;

                this.showSnackbar(`Error: ${errorMessage}`, 'error');
                return false;
            } finally {
                this[processingKey] = false;
            }
        },

        showConfirmation(message, actionLabel, styleClass, actionFunction) {
            this.confirmDialog.message = message;
            this.confirmDialog.actionLabel = actionLabel;
            this.confirmDialog.styleClass = styleClass;
            this.confirmDialog.action = actionFunction;
            this.confirmDialog.show = true;
        },

        executeConfirmedAction() {
            if (this.confirmDialog.action) {
                this.confirmDialog.action();
            }
            this.confirmDialog.show = false;
            this.confirmDialog.action = null;
        },

        cancelConfirmation() {
            this.confirmDialog.show = false;
            this.confirmDialog.action = null;
        },

        shortlistApplicant(applicantId) {
            this.showConfirmation(
                `Are you sure you want to SHORTLIST this applicant? This marks them ready for an interview.`,
                'Shortlist',
                'btn-shortlist',
                () => this.updateStatus(applicantId, 'SHORTLISTED', null, 'isShortlisting')
            );
        },

        hireApplicant(applicantId) {
            this.showConfirmation(
                `Are you sure you want to HIRE this applicant? This is a final action and updates their status to 'HIRED'.`,
                'Hire',
                'btn-hired',
                () => this.updateStatus(applicantId, 'HIRED', null, 'isHiring')
            );
        },

        rejectApplicant(applicantId) {
            this.showConfirmation(
                `Are you sure you want to REJECT this applicant? They will be removed from the active hiring pipeline.`,
                'Reject',
                'btn-reject',
                () => this.updateStatus(applicantId, 'REJECTED', null, 'isRejecting')
            );
        },

        openScheduleModal(applicantId) {
            this.selectedJobId = applicantId;
            this.showScheduleModal = true;
            this.interviewDetails = {
                date: '',
                time: '',
                location: '',
                mode: '',
                notes: ''
            };
        },

        closeScheduleModal() {
            this.showScheduleModal = false;
        },

        async scheduleInterview() {
            if (!this.selectedJobId) return;

            const success = await this.updateStatus(this.selectedJobId, 'INTERVIEWING', this.interviewDetails, 'isProcessing');

            if (success) {
                this.closeScheduleModal();
            }
        },

        showSnackbar(message, type = 'success') {
            if (this.snackbarTimeout) clearTimeout(this.snackbarTimeout);

            this.snackbar.message = message;
            this.snackbar.type = type;
            this.snackbar.show = true;

            this.snackbarTimeout = setTimeout(() => {
                this.snackbar.show = false;
            }, 3000);
        },

        getStatusClass(status) {
            if (!status) return 'bg-gray-100 text-gray-800';

            const normalizedStatus = status.toLowerCase();

            switch (normalizedStatus) {
                case 'submitted':
                case 'new':
                case 'applied':
                    return 'bg-indigo-100 text-indigo-800';
                case 'shortlisted':
                    return 'bg-blue-100 text-blue-800';
                case 'interview scheduled':
                case 'interviewing':
                    return 'bg-yellow-100 text-yellow-800';
                case 'hired':
                    return 'bg-green-100 text-green-800';
                case 'rejected':
                case 'withdrawn':
                    return 'bg-red-100 text-red-800';
                default:
                    return 'bg-gray-100 text-gray-800';
            }
        },
        formatDate(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        },
        formatDateTime(dateTimeString) {
            if (!dateTimeString) return 'N/A';
            const date = new Date(dateTimeString);
            return isNaN(date.getTime()) ? dateTimeString : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        },
        formatDateYear(dateString) {
            if (!dateString) return 'N/A';
            const parts = dateString.split('-');
            if (parts.length === 3) return parts[2];

            const date = new Date(dateString);
            return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('en-US', { year: 'numeric' });
        },

        getResumeLink(path) {
            const baseUrl = '/api/v1/uploads/';
            const filename = path?.split('\\').pop() || path?.split('/').pop();
            return `${baseUrl}${filename}`;
        }
    }
}
</script>

<style scoped>
/* Modal & Dialog Base Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: #ffffff;
    padding: 30px;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

/* Custom Dialog Specific Styles */
.modal-dialog-small {
    max-width: 400px;
}

.dialog-message {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #333;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
    margin-bottom: 20px;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.5rem;
    color: #1f3f66;
}

.modal-close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #aaa;
}

.form-group {
    margin-bottom: 20px;
}

.form-group.date-time-group {
    width: 48%;
    display: inline-block;
    vertical-align: top;
}

.form-group.date-time-group:nth-child(even) {
    margin-left: 4%;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #444;
}

.form-input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    box-sizing: border-box;
    font-size: 1rem;
}

.form-input[type="date"],
.form-input[type="time"] {
    height: 40px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 20px;
    border-top: 1px solid #eee;
    margin-top: 20px;
}

/* Base Button Styles */
.btn-primary, .btn-secondary,
.btn-interview, .btn-shortlist, .btn-hired, .btn-reject {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-primary {
    background-color: #4a69bd;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background-color: #3b539b;
}

.btn-secondary {
    background-color: #f0f0f0;
    color: #444;
    border: 1px solid #ccc;
}

.btn-secondary:hover:not(:disabled) {
    background-color: #e0e0e0;
}

/* Action Button Styles (used for primary actions AND dialog confirmation buttons) */
.btn-shortlist {
    background-color: #ffc107;
    color: #343a40;
}
.btn-hired {
    background-color: #28a745;
    color: white;
}
.btn-reject {
    background-color: #dc3545;
    color: white;
}
.btn-interview {
    background-color: #007bff;
    color: white;
}

/* Disabled State */
.btn-interview:disabled,
.btn-shortlist:disabled,
.btn-hired:disabled,
.btn-reject:disabled,
.btn-primary:disabled {
    background-color: #ced4da;
    cursor: not-allowed;
    box-shadow: none;
    color: #6c757d;
}

/* --- MAIN LAYOUT & DATA STYLES (Retained) --- */
.applicant-detail-container {
    max-width: 1000px;
    margin: 20px auto;
    padding: 30px;
    background-color: #f7f9fc;
    border-radius: 12px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 3px solid #e0e6f0;
}

.header-title {
    color: #1f3f66;
    font-size: 1.8rem;
    font-weight: 600;
}

.action-buttons {
    display: flex;
    gap: 10px;
}

.card {
    background-color: #ffffff;
    border: none;
    border-radius: 10px;
    padding: 25px 30px;
    margin-bottom: 25px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s;
}

.card:hover {
    transform: translateY(-2px);
}

h2 {
    display: flex;
    align-items: center;
    color: #4a69bd;
    font-size: 1.4rem;
    border-bottom: 2px solid #eef2f8;
    padding-bottom: 10px;
    margin-top: 0;
    margin-bottom: 20px;
}

.icon-left {
    margin-right: 10px;
    font-size: 1.2em;
}

.detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 15px 30px;
}

.detail-grid p {
    margin: 0;
    line-height: 1.5;
    color: #444;
    font-size: 0.95rem;
}

.detail-grid strong {
    color: #2c3e50;
    font-weight: 600;
}

.highlight-position {
    font-weight: bold;
    color: #1e9132;
    background-color: #ebfee7;
    padding: 2px 6px;
    border-radius: 4px;
}

.salary-range {
    font-weight: bold;
    color: #27ae60;
}

.resume-link {
    color: #1a73e8;
    text-decoration: none;
    font-weight: 600;
    display: flex;
    align-items: center;
    padding-top: 5px;
}

.resume-link:hover {
    text-decoration: underline;
    color: #0d47a1;
}

.loading-message,
.error-message {
    text-align: center;
    padding: 80px;
    font-size: 1.4em;
    color: #888;
}

/* SNACKBAR STYLES */
.snackbar {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    min-width: 300px;
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    z-index: 10000;
    transition: opacity 0.3s, transform 0.3s;
}

.snackbar-success {
    background-color: #28a745;
}

.snackbar-error {
    background-color: #dc3545;
}

.snackbar .icon-left {
    margin-right: 10px;
}
</style>