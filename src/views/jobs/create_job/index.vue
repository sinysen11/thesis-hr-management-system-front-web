<template>
    <div class="max-w-5xl p-12 mx-auto my-12 bg-white border-b border-gray-200 rounded-lg">

        <div class="flex items-center justify-between pb-6 mb-8 border-b border-gray-200">
            <h3 class="text-3xl font-bold text-gray-900">
                <span v-if="isViewing">Job Posting Detail</span>
                <span v-else-if="isEditing">Edit Job Posting</span>
                <span v-else>Create New Job Posting</span>
            </h3>
        </div>

        <div v-if="isLoading" class="py-20 text-center">
            <i class="text-green-700 text-7xl fas fa-spinner fa-spin"></i>
            <p class="mt-4 text-xl font-medium text-gray-600">Loading job data...</p>
        </div>

        <div v-else class="space-y-10">

            <section class="p-6 border border-gray-200 rounded-lg bg-gray-50">
                <h4 class="mb-5 text-xl font-semibold text-indigo-700">1. Basic Job Information</h4>

                <div class="grid gap-8 sm:grid-cols-2">

                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-700" for="job-title">Job Title <span
                                class="text-red-500" v-if="!isViewing">*</span></label>
                        <div class="relative">
                            <select v-model="form.title" id="job-title" required 
                                :disabled="isViewing" 
                                class="w-full px-4 py-3 pr-10 text-gray-800 transition duration-200 bg-white border border-gray-300 shadow-sm appearance-none rounded-xl focus:ring-indigo-500 focus:border-indigo-500 focus:ring-2 hover:border-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed">
                                <option disabled value="">Select job title</option>
                                <option v-for="item in jobTitles" :key="item._id" :value="item._id">
                                    {{ item.des_en }}
                                </option>
                            </select>
                            <div v-if="!isViewing"
                                class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 pointer-events-none">
                                <i class="text-sm fas fa-chevron-down"></i>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-700" for="department">Department <span
                                class="text-red-500" v-if="!isViewing">*</span></label>
                        <div class="relative">
                            <select v-model="form.department" id="department" required 
                                :disabled="isViewing" 
                                class="w-full px-4 py-3 pr-10 text-gray-800 transition duration-200 bg-white border border-gray-300 shadow-sm appearance-none rounded-xl focus:ring-indigo-500 focus:border-indigo-500 focus:ring-2 hover:border-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed">
                                <option disabled value="">Select department</option>
                                <option v-for="dept in departments" :key="dept._id" :value="dept._id">
                                    {{ dept.name_en }}
                                </option>
                            </select>
                            <div v-if="!isViewing"
                                class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 pointer-events-none">
                                <i class="text-sm fas fa-chevron-down"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid gap-8 mt-8 sm:grid-cols-3">
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-700">Salary Range <span
                                class="text-red-500" v-if="!isViewing">*</span></label>
                        <input v-model="form.salary" type="text" required 
                            :disabled="isViewing" 
                            class="w-full px-4 py-3 text-gray-800 transition duration-200 border border-gray-300 shadow-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            placeholder="e.g., $5000-12000" />
                    </div>

                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-700">Branch/Location <span
                                class="text-red-500" v-if="!isViewing">*</span></label>
                        <input v-model="form.branch" type="text" required 
                            :disabled="isViewing" 
                            class="w-full px-4 py-3 text-gray-800 transition duration-200 border border-gray-300 shadow-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            placeholder="e.g., Phnom Penh" />
                    </div>

                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-700">Staff Needed</label>
                        <input v-model.number="form.number_staff" type="number" min="1" 
                            :disabled="isViewing" 
                            class="w-full px-4 py-3 text-gray-800 transition duration-200 border border-gray-300 shadow-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            placeholder="e.g., 4" />
                    </div>
                </div>
            </section>

            <section class="p-6 border border-gray-200 rounded-lg bg-gray-50">
                <h4 class="mb-5 text-xl font-semibold text-indigo-700">2. Timeline & Duration</h4>

                <div class="grid gap-8 sm:grid-cols-2">
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-700">Publish Date</label>
                        <input v-model="form.publish_date" type="date" 
                            :disabled="isViewing" 
                            class="w-full px-4 py-3 text-gray-800 transition duration-200 border border-gray-300 shadow-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                    </div>

                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-700">Close Date <span
                                class="text-red-500" v-if="!isViewing">*</span></label>
                        <input v-model="form.close_date" type="date" required 
                            :disabled="isViewing" 
                            class="w-full px-4 py-3 text-gray-800 transition duration-200 border border-gray-300 shadow-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                    </div>
                </div>
            </section>

            <section class="p-6 space-y-6 border border-gray-200 rounded-lg bg-gray-50">
                <h4 class="mb-5 text-xl font-semibold text-indigo-700">3. Job Description & Requirements</h4>

                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700">Description <span
                            class="text-red-500" v-if="!isViewing">*</span></label>
                    <textarea v-model="form.description" rows="4" required 
                        :disabled="isViewing" 
                        class="w-full px-4 py-3 text-gray-800 transition duration-200 border border-gray-300 shadow-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Provide a detailed overview of the role and its context..."></textarea>
                </div>

                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700">Responsibilities <span
                            class="text-red-500" v-if="!isViewing">*</span></label>
                    <textarea v-model="form.responsible" rows="4" required 
                        :disabled="isViewing" 
                        class="w-full px-4 py-3 text-gray-800 transition duration-200 border border-gray-300 shadow-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="List key duties and performance expectations..."></textarea>
                </div>

                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700">Requirements <span
                            class="text-red-500" v-if="!isViewing">*</span></label>
                    <textarea v-model="form.requirement" rows="4" required 
                        :disabled="isViewing" 
                        class="w-full px-4 py-3 text-gray-800 transition duration-200 border border-gray-300 shadow-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="List essential skills, qualifications, and experience..."></textarea>
                </div>
            </section>

        </div>

        <div v-if="localMessage"
            :class="['mt-10 p-4 rounded-xl text-base font-medium', localMessageType === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200']">
            <i :class="['mr-3 fas', localMessageType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle']"></i>
            {{ localMessage }}
        </div>

        <div class="flex justify-end gap-4 pt-8 mt-8 border-t border-gray-200">
            <button @click="cancel"
                class="px-8 py-3 font-semibold text-gray-700 transition duration-200 bg-white border border-gray-300 shadow-sm hover:bg-gray-100 rounded-xl">
                Cancel
            </button>
            <button @click="saveJob" v-if="!isViewing" :disabled="isLoading"
                class="px-8 py-3 font-semibold text-white transition duration-200 bg-indigo-600 shadow-md hover:bg-indigo-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
                <i v-if="isLoading" class="mr-2 fas fa-spinner fa-spin"></i>
                {{ isEditing ? 'Save Changes' : 'Create Job Post' }}
            </button>
        </div>
        
        </div>
</template>

<script>
import { createJob, updateJob, getJobById, getAllJobTitle } from '@/apis/jobs';
import { getAllDepartment } from '@/apis/department';

export default {
    props: {
        isEditing: {
            type: Boolean,
            default: false
        },
        // NEW PROP: Determines if the form is read-only
        isViewing: { 
            type: Boolean,
            default: false
        },
        jobId: {
            type: String,
            default: null
        }
    },

    data() {
        return {
            form: this.getNewFormBase(),
            jobTitles: [],
            departments: [],
            isLoading: false,
            localMessage: '',
            localMessageType: 'error'
        };
    },
    async created() {
        this.isLoading = true;
        await this.fetchResources();

        // Data fetching logic: If either editing OR viewing a specific job, load data.
        if ((this.isEditing || this.isViewing) && this.jobId) {
            await this.fetchJobData(this.jobId);
        }
        this.isLoading = false;
    },
    methods: {
        getNewFormBase() {
            // ... (rest of getNewFormBase is the same)
            return {
                _id: null,
                title: '',
                salary: '',
                description: '',
                responsible: '',
                requirement: '',
                department: '',
                branch: '',
                close_date: '',
                publish_date: new Date().toISOString().split('T')[0], // Default to today
                number_staff: 1,
                status: 'Active'
            };
        },

        setLocalAlert(message, type = 'error') {
            // ... (rest of setLocalAlert is the same)
            this.localMessage = message;
            this.localMessageType = type;
            setTimeout(() => {
                this.localMessage = '';
            }, 4000);
        },

        async fetchResources() {
            // ... (rest of fetchResources is the same)
            try {
                const jobTitleResult = await getAllJobTitle();
                if (jobTitleResult && jobTitleResult.status === 1 && Array.isArray(jobTitleResult.jobs)) {
                    this.jobTitles = jobTitleResult.jobs.map(item => ({ _id: item._id, des_en: item.des_en }));
                }

                const deptResult = await getAllDepartment();
                if (deptResult.status === 1 && Array.isArray(deptResult.departments)) {
                    this.departments = deptResult.departments;
                }
            } catch (error) {
                console.error('Error fetching resources:', error);
                this.setLocalAlert('Failed to load job titles or departments.', 'error');
            }
        },

        async fetchJobData(id) {
            // ... (rest of fetchJobData is the same)
            try {
                const result = await getJobById(id);
                if (result && result.status === 1) {
                    const job = result.data || result.job;
                    if (!job) {
                        this.setLocalAlert('Could not load job data: response missing job object.', 'error');
                        return;
                    }
                    this.form = {
                        _id: job._id,
                        title: job.title?._id || '',
                        salary: job.salary || '',
                        description: job.description || '',
                        responsible: job.responsible || '',
                        requirement: job.requirement || '',
                        department: job.department?._id || '',
                        branch: job.branch || '',
                        close_date: job.close_date ? job.close_date.split('T')[0] : '',
                        publish_date: job.publish_date ? job.publish_date.split('T')[0] : '',
                        number_staff: job.number_staff || 1,
                        status: job.status || 'Active'
                    };
                } else {
                    this.setLocalAlert('Could not load job data for editing.', 'error');
                }
            } catch (error) {
                this.setLocalAlert('Could not load job data: ' + error.message, 'error');
                console.error(error);
            }
        },

        async saveJob() {
             if (!this.form.title || !this.form.department || !this.form.close_date ||
                !this.form.salary || !this.form.description || !this.form.branch ||
                !this.form.responsible || !this.form.requirement) {
                this.setLocalAlert('Please fill in all fields marked with an asterisk (*).', 'error');
                return;
            }

            this.isLoading = true;
            try {
                const { _id, status, ...formData } = this.form;

                let result;
                if (this.isEditing) {
                    result = await updateJob(this.form._id, formData);
                } else {
                    result = await createJob(formData);
                }

                if (result && result.status === 1) {
                    const message = this.isEditing ? 'Job updated successfully!' : 'Job created successfully!';

                    this.$router.push({
                        name: 'job_posting',
                        query: { alert: message, type: 'success' }
                    });
                } else {
                    this.setLocalAlert('Failed to save job. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Error saving job:', error);
                this.setLocalAlert('Error saving job: ' + error.message, 'error');
            } finally {
                this.isLoading = false;
            }
        },

        cancel() {
            this.$router.push({ name: 'job_posting' });
        }
    }
};
</script>