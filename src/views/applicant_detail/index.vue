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
                    :disabled="isProcessing" class="btn-shortlist">
                    <i v-if="isProcessing" class="fas fa-spinner fa-spin icon-left"></i>
                    <i v-else class="fas fa-star icon-left"></i>
                    Shortlist
                </button>

                <button v-if="['SUBMITTED', 'SHORTLISTED'].includes(applicantData.status)"
                    @click="openScheduleModal(applicantData._id)" :disabled="isProcessing" class="btn-interview">
                    <i class="fas fa-calendar-alt icon-left"></i>
                    Call Interview
                </button>

                <button v-if="applicantData.status === 'INTERVIEWING'" @click="hireApplicant(applicantData._id)"
                    :disabled="isProcessing" class="btn-hired">
                    <i v-if="isProcessing" class="fas fa-spinner fa-spin icon-left"></i>
                    <i v-else class="fas fa-check-circle icon-left"></i>
                    Hired
                </button>
                <button v-if="applicantData.status === 'INTERVIEWING'" @click="rejectApplicant(applicantData._id)"
                    :disabled="isProcessing" class="btn-reject">
                    <i v-if="isProcessing" class="fas fa-spinner fa-spin icon-left"></i>
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
                <p><strong>Job Title (Internal):</strong> {{ applicantData.jobId.title.des_en }} ({{
                    applicantData.jobId.department.name_en }} Dept.)</p>
                <p><strong>Job Salary Range:</strong> <span class="salary-range">${{
                    applicantData.jobId.salary
                        }}</span></p>
                <p><strong>Requested Location:</strong> {{ applicantData.requested_location }}</p>
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

    <div v-if="isLoading && !applicantData" class="py-12 text-center loading-message">
        <i class="text-6xl text-indigo-600 fas fa-spinner fa-spin"></i>
        <p class="mt-4 text-gray-600">Loading applicant details...</p>
    </div>
    <div v-else-if="!applicantData" class="error-message">
        <i class="fas fa-exclamation-triangle"></i> Could not load applicant data.
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
            showScheduleModal: false,
            selectedJobId: null,
            interviewDetails: {
                date: '',
                time: '',
                location: '',
                mode: '',
                notes: ''
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

        openScheduleModal(applicantId) {
            this.selectedJobId = applicantId;
            this.showScheduleModal = true;
            this.interviewDetails = { // Reset details
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

        async updateStatus(applicantId, status, interviewData = null) {
            if (!applicantId) return false;

            this.isProcessing = true;

            try {
                const payload = {
                    status: status,
                    ...(interviewData && { interview: interviewData }) // Only include interview data if provided
                };

                const res = await updateInterviewStatus(applicantId, payload);
                if (res.status === 1) {
                    this.isLoading = true;
                    await this.fetchApplicantData(applicantId);
                    return true;
                } else {
                    this.$toast.error(res.message);
                    return false;
                }
            } catch (err) {
                this.$toast.error(err.response?.message || `Error updating status to ${status}.`);
                return false;
            } finally {
                this.isProcessing = false;
            }
        },

        async shortlistApplicant(applicantId) {
            await this.updateStatus(applicantId, 'SHORTLISTED');
        },

        async hireApplicant(applicantId) {
            await this.updateStatus(applicantId, 'HIRED');
        },

        async rejectApplicant(applicantId) {
            await this.updateStatus(applicantId, 'REJECTED');
        },

        async scheduleInterview() {
            if (!this.selectedJobId) return;

            // scheduleInterview uses updateStatus with interview details
            const success = await this.updateStatus(this.selectedJobId, 'INTERVIEWING', this.interviewDetails);

            if (success) {
                this.closeScheduleModal();
            }
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
/* --- MODAL STYLES --- */
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

.btn-primary {
    padding: 10px 20px;
    background-color: #4a69bd;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: background-color 0.3s;
}

.btn-primary:hover:not(:disabled) {
    background-color: #3b539b;
}

.btn-secondary {
    padding: 10px 20px;
    background-color: #f0f0f0;
    color: #444;
    border: 1px solid #ccc;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: background-color 0.3s;
}

.btn-secondary:hover:not(:disabled) {
    background-color: #e0e0e0;
}

/* --- MAIN LAYOUT & DATA STYLES --- */
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

/* New Action Buttons Container */
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

/* COMMON BUTTON STYLES FOR ACTIONS */
.btn-interview,
.btn-shortlist,
.btn-hired,
.btn-reject {
    padding: 12px 25px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
}

/* Specific Button Styles */
.btn-interview {
    background-color: #007bff;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
}

.btn-interview:hover:not(:disabled) {
    background-color: #0056b3;
    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.4);
}

.btn-shortlist {
    background-color: #ffc107;
    color: #343a40;
    box-shadow: 0 2px 4px rgba(255, 193, 7, 0.3);
}

.btn-shortlist:hover:not(:disabled) {
    background-color: #e0a800;
}

.btn-hired {
    background-color: #28a745;
    color: white;
    box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
}

.btn-hired:hover:not(:disabled) {
    background-color: #1e7e34;
}

.btn-reject {
    background-color: #dc3545;
    color: white;
    box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);
}

.btn-reject:hover:not(:disabled) {
    background-color: #c82333;
}

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
</style>