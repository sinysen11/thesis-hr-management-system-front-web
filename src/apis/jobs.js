import request from '@/services/request';
import {
  jobs,
  categories,
  departments,
  job_descriptions,
  faq_khs,
  faq_ens,
  benefit_ens,
  benefit_khs,
  applicants,
  branches
} from '@/constants/apis';

// JOBS
export function createJob(data) {
  return request({
    url: jobs.createJob.url,
    method: jobs.createJob.method,
    data
  });
}

export function getAllJob() {
  return request({
    url: jobs.getAllJob.url,
    method: jobs.getAllJob.method
  });
}

export function getOneJob(data) {
  return request({
    url: `${jobs.getOneJob.url}/${data}`,
    method: jobs.getOneJob.method
  });
}

export function updateJob(id, data) {
  return request({
    url: `${jobs.updateJob.url}/${id}`,
    method: jobs.updateJob.method,
    data
  });
}

export function deleteJob(id, data) {
  return request({
    url: `${jobs.deleteJob.url}/${id}`,
    method: jobs.deleteJob.method,
    data
  });
}

// JOB DESCRIPTION
export function createJobDescription(data) {
  return request({
    url: job_descriptions.createJobDescription.url,
    method: job_descriptions.createJobDescription.method,
    data
  });
}

export function getAllJobDescription() {
  return request({
    url: job_descriptions.getAllJobDescription.url,
    method: job_descriptions.getAllJobDescription.method
  });
}
export function getAllJobDescriptionByFilter(branch_id, department_id) {
  return request({
    url: `${job_descriptions.getAllJobDescriptionByFilter.url}/?branch_id=${branch_id}&department_id=${department_id}`,
    method: job_descriptions.getAllJobDescriptionByFilter.method
  });
}
export function getOneJobDescription(data) {
  return request({
    url: `${job_descriptions.getOneJobDescription.url}/${data}`,
    method: job_descriptions.getOneJobDescription.method
  });
}
export function updateJobDescription(id, data) {
  return request({
    url: `${job_descriptions.updateJobDescription.url}/${id}`,
    method: job_descriptions.updateJobDescription.method,
    data
  });
}
export function deleteJobDescription(id, data) {
  return request({
    url: `${job_descriptions.deleteJobDescription.url}/${id}`,
    method: job_descriptions.deleteJobDescription.method,
    data
  });
}
// DEPARTMENT
export function getAllDepartment() {
  return request({
    url: departments.getAllDepartment.url,
    method: departments.getAllDepartment.method
  });
}
export function getOneDepartment(data) {
  return request({
    url: `${departments.getOneDepartment.url}/${data}`,
    method: departments.getOneDepartment.method
  });
}
export function createDepartment(data) {
  return request({
    url: departments.createDepartment.url,
    method: departments.createDepartment.method,
    data
  });
}
export function updateDepartment(id, data) {
  return request({
    url: `${departments.updateDepartment.url}/${id}`,
    method: departments.updateDepartment.method,
    data
  });
}
export function deleteDepartment(id, data) {
  return request({
    url: `${departments.deleteDepartment.url}/${id}`,
    method: departments.deleteDepartment.method,
    data
  });
}
// CATEGORY
export function createCategory(data) {
  return request({
    url: categories.createCategory.url,
    method: categories.createCategory.method,
    data
  });
}
export function getAllCategory() {
  return request({
    url: categories.getAllCategory.url,
    method: categories.getAllCategory.method
  });
}
export function getOneCategory(data) {
  return request({
    url: `${categories.getOneCategory.url}/${data}`,
    method: categories.getOneCategory.method
  });
}
export function updateCategory(id, data) {
  return request({
    url: `${categories.updateCategory.url}/${id}`,
    method: categories.updateCategory.method,
    data
  });
}
export function deleteCategory(id, data) {
  return request({
    url: `${categories.deleteCategory.url}/${id}`,
    method: categories.deleteCategory.method,
    data
  });
}
// FAQ
export function getAllFaqEns() {
  return request({
    url: faq_ens.getAllFaqEns.url,
    method: faq_ens.getAllFaqEns.method
  });
}
export function getOneFaqEns(data) {
  return request({
    url: `${faq_ens.getOneFaqEns.url}/${data}`,
    method: faq_ens.getOneFaqEns.method
  });
}
export function createFaqEns(data) {
  return request({
    url: faq_ens.createFaqEns.url,
    method: faq_ens.createFaqEns.method,
    data
  });
}
export function updateFaqEns(id, data) {
  return request({
    url: `${faq_ens.updateFaqEns.url}/${id}`,
    method: faq_ens.updateFaqEns.method,
    data
  });
}
export function deleteFaqEns(id, data) {
  return request({
    url: `${faq_ens.deleteFaqEns.url}/${id}`,
    method: faq_ens.deleteFaqEns.method,
    data
  });
}

export function getAllFaqKhs() {
  return request({
    url: faq_khs.getAllFaqKhs.url,
    method: faq_khs.getAllFaqKhs.method
  });
}
export function getOneFaqKhs(data) {
  return request({
    url: `${faq_khs.getOneFaqKhs.url}/${data}`,
    method: faq_khs.getOneFaqKhs.method
  });
}
export function createFaqKhs(data) {
  return request({
    url: faq_khs.createFaqKhs.url,
    method: faq_khs.createFaqKhs.method,
    data
  });
}
export function updateFaqKhs(id, data) {
  return request({
    url: `${faq_khs.updateFaqKhs.url}/${id}`,
    method: faq_khs.updateFaqKhs.method,
    data
  });
}
export function deleteFaqKhs(id, data) {
  return request({
    url: `${faq_khs.deleteFaqKhs.url}/${id}`,
    method: faq_khs.deleteFaqKhs.method,
    data
  });
}
// BENEFIT
export function getAllBenefitEns() {
  return request({
    url: benefit_ens.getAllBenefitEns.url,
    method: benefit_ens.getAllBenefitEns.method
  });
}
export function getOneBenefitEns(data) {
  return request({
    url: `${benefit_ens.getOneBenefitEns.url}/${data}`,
    method: benefit_ens.getOneBenefitEns.method
  });
}
export function createBenefitEns(data) {
  return request({
    url: benefit_ens.createBenefitEns.url,
    method: benefit_ens.createBenefitEns.method,
    data
  });
}
export function updateBenefitEns(id, data) {
  return request({
    url: `${benefit_ens.updateBenefitEns.url}/${id}`,
    method: benefit_ens.updateBenefitEns.method,
    data
  });
}
export function deleteBenefitEns(id, data) {
  return request({
    url: `${benefit_ens.deleteBenefitEns.url}/${id}`,
    method: benefit_ens.deleteBenefitEns.method,
    data
  });
}

export function getAllBenefitKhs() {
  return request({
    url: benefit_khs.getAllBenefitKhs.url,
    method: benefit_khs.getAllBenefitKhs.method
  });
}
export function getOneBenefitKhs(data) {
  return request({
    url: `${benefit_khs.getOneBenefitKhs.url}/${data}`,
    method: benefit_khs.getOneBenefitKhs.method
  });
}
export function createBenefitKhs(data) {
  return request({
    url: benefit_khs.createBenefitKhs.url,
    method: benefit_khs.createBenefitKhs.method,
    data
  });
}
export function updateBenefitKhs(id, data) {
  return request({
    url: `${benefit_khs.updateBenefitKhs.url}/${id}`,
    method: benefit_khs.updateBenefitKhs.method,
    data
  });
}
export function deleteBenefitKhs(id, data) {
  return request({
    url: `${benefit_khs.deleteBenefitKhs.url}/${id}`,
    method: benefit_khs.deleteBenefitKhs.method,
    data
  });
}
// APPLICANT
export function getAllApplicant(data) {
  return request({
    url: `${applicants.getAllApplicant.url}?${data}`,
    method: applicants.getAllApplicant.method
  });
}

export function getOneApplicant(data) {
  return request({
    url: `${applicants.getOneApplicant.url}/${data}`,
    method: applicants.getOneApplicant.method
  });
}

export function createApplicant() {
  return request({
    url: applicants.createApplicant.url,
    method: applicants.createApplicant.method
  });
}
// BRANCH
export function getAllBranch() {
  return request({
    url: branches.getAllBranch.url,
    method: branches.getAllBranch.method
  });
}
