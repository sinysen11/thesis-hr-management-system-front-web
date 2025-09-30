<template>
  <div class="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50">
    <div v-if="loading" class="text-center py-20 bg-white rounded-xl shadow-xl max-w-4xl mx-auto">
      <i class="fas fa-spinner fa-spin text-5xl text-indigo-600"></i>
      <p class="mt-4 text-xl font-medium text-green-700">Loading job details...</p>
    </div>

    <div v-else-if="job" class="max-w-6xl mx-auto bg-white rounded-2xl shadow-3xl border border-gray-100">
      
      <div class="p-6 sm:p-8 border-b border-gray-100 bg-indigo-50 rounded-t-2xl">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-green-800 break-words leading-tight">{{ job.title }}</h1>
        <div class="flex flex-wrap items-center mt-3 text-sm sm:text-base text-gray-600 font-medium space-x-4 sm:space-x-6">
          
          <span class="flex items-center text-gray-800">
            <i class="fas fa-map-marker-alt text-green-600 mr-1.5"></i>
            {{ job.branch }}
          </span>
          
          <span class="flex items-center text-gray-800">
            <i class="fas fa-building text-green-600 mr-1.5"></i>
            {{ job.department_name }}
          </span>
          
          <span class="flex items-center text-gray-800">
            <i class="fas fa-dollar-sign text-green-600 mr-1.5"></i>
            Salary: <span class="text-green-700 font-bold ml-1">{{ job.salary }}</span>
          </span>
        </div>
      </div>

      <div class="p-6 sm:p-8 grid lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2 space-y-10">
          
          <section>
            <h2 class="text-2xl font-bold text-gray-800 border-b border-indigo-200 pb-3 mb-5">Job Description</h2>
            <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ job.description }}</p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-gray-800 border-b border-indigo-200 pb-3 mb-5">Responsibilities</h2>
            <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ job.responsible }}</p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-gray-800 border-b border-indigo-200 pb-3 mb-5">Requirements</h2>
            <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ job.requirement }}</p>
          </section>

        </div>

        <aside class="lg:col-span-1">
          <div class="bg-white p-6 rounded-xl shadow-xl border border-gray-100 sticky lg:top-8 space-y-6">
            <h3 class="text-xl font-bold text-green-700 border-b pb-3 mb-3">Job Details</h3>

            <div class="text-base space-y-4">
              
              <p class="flex justify-between items-center">
                <span class="font-medium text-gray-600 flex items-center"><i class="fas fa-user-plus mr-3 text-green-700"></i>Staff Needed:</span>
                <span class="font-extrabold text-green-800 text-lg">{{ job.number_staff }}</span>
              </p>
              
              <p class="flex justify-between items-center">
                <span class="font-medium text-gray-600 flex items-center"><i class="fas fa-calendar-alt mr-3 text-green-700"></i>Published Date:</span>
                <span class="text-green-700">{{ formatDate(job.publish_date) }}</span>
              </p>
              
              <p class="flex justify-between items-center">
                <span class="font-medium text-gray-600 flex items-center"><i class="fas fa-calendar-times mr-3 text-green-700"></i>Closing Date:</span>
                <span class="font-bold text-red-600">{{ formatDate(job.close_date) }}</span>
              </p>
              
            </div>
          </div>
        </aside>
      </div>
      
      <div class="p-6 sm:p-8 border-t border-gray-100 flex justify-start">
        <button @click="$router.go(-1)"
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold transition duration-200 shadow-md">
          <i class="fas fa-arrow-left mr-2"></i>Back to Job List
        </button>
      </div>

    </div>
    
    <div v-else class="text-center py-20 bg-white rounded-xl shadow-xl max-w-xl mx-auto">
        <i class="fas fa-exclamation-triangle text-7xl text-red-500"></i>
        <h2 class="text-3xl font-bold text-gray-800 mt-6">Job Not Found</h2>
        <p class="text-gray-600 mt-3">The requested job posting could not be loaded or does not exist.</p>
        <button @click="$router.push({ name: 'job_posting' })" class="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition">
             Go to Job List
        </button>
    </div>
  </div>
</template>

<script>
import { getOneJob } from '@/apis/jobs';

export default {
  name: 'JobPostingDetail',
  data() {
    return {
      job: null,
      loading: true,
      jobId: null,
      errorMessage: ''
    };
  },
  mounted() {
    // Get the ID from the route parameters
    this.jobId = this.$route.params.id;
    if (this.jobId) {
      this.fetchJobDetail();
    } else {
      this.loading = false;
      this.errorMessage = 'No job ID provided in the route.'; 
    }
  },
  methods: {
    async fetchJobDetail() {
      this.loading = true;
      this.errorMessage = '';
      try {
        const result = await getOneJob(this.jobId);
        console.log(result)
        if (result.status === 1) {
          this.job = {
            ...result.job,
            title: result.job.title?.des_en || 'Untitled', 
            department_name: result.job.department?.name_en || 'N/A'
          } 
        } else {
          this.errorMessage = 'Job not found.';
          this.job = null;
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
        this.errorMessage = 'Error fetching job details: ' + error.message;
        this.job = null;
      } finally {
        this.loading = false;
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      try {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch (e) {
        return dateString;
      }
    }
  }
};
</script>

<style scoped>

.whitespace-pre-line {
    white-space: pre-line;
}
</style>