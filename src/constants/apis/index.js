module.exports = {
  jobs: {
    createJob: {
      url: 'jobs',
      method: 'post'
    },
    getAllJob: {
      url: 'jobs',
      method: 'get'
    },
    getOneJob: {
      url: 'jobs',
      method: 'get'
    },
    updateJob: {
      url: 'jobs',
      method: 'patch'
    },
    deleteJob: {
      url: 'jobs',
      method: 'delete'
    }
  },
  job_descriptions: {
    createJobDescription: {
      url: 'job_descriptions',
      method: 'post'
    },
    getAllJobDescription: {
      url: 'job_descriptions',
      method: 'get'
    },
    getAllJobDescriptionByFilter: {
      url: 'job_descriptions/filter',
      method: 'get'
    },
    getOneJobDescription: {
      url: 'job_descriptions',
      method: 'get'
    },
    updateJobDescription: {
      url: 'job_descriptions',
      method: 'patch'
    },
    deleteJobDescription: {
      url: 'job_descriptions',
      method: 'delete'
    }
  },
  categories: {
    createCategory: {
      url: 'categories',
      method: 'post'
    },
    getAllCategory: {
      url: 'categories',
      method: 'get'
    },
    getOneCategory: {
      url: 'categories',
      method: 'get'
    },
    updateCategory: {
      url: 'categories',
      method: 'patch'
    },
    deleteCategory: {
      url: 'categories',
      method: 'delete'
    }
  },
  departments: {
    getAllDepartment: {
      url: 'departments',
      method: 'get'
    },
    getOneDepartment: {
      url: 'departments',
      method: 'get'
    },
    createDepartment: {
      url: 'departments',
      method: 'post'
    },
    updateDepartment: {
      url: 'departments',
      method: 'patch'
    },
    deleteDepartment: {
      url: 'departments',
      method: 'delete'
    }
  },
  faq_ens: {
    getAllFaqEns: {
      url: 'faq_ens',
      method: 'get'
    },
    getOneFaqEns: {
      url: 'faq_ens',
      method: 'get'
    },
    createFaqEns: {
      url: 'faq_ens',
      method: 'post'
    },
    updateFaqEns: {
      url: 'faq_ens',
      method: 'patch'
    },
    deleteFaqEns: {
      url: 'faq_ens',
      method: 'delete'
    }
  },
  faq_khs: {
    getAllFaqKhs: {
      url: 'faq_khs',
      method: 'get'
    },
    getOneFaqKhs: {
      url: 'faq_khs',
      method: 'get'
    },
    createFaqKhs: {
      url: 'faq_khs',
      method: 'post'
    },
    updateFaqKhs: {
      url: 'faq_khs',
      method: 'patch'
    },
    deleteFaqKhs: {
      url: 'faq_khs',
      method: 'delete'
    }
  },
  benefit_ens: {
    getAllBenefitEns: {
      url: 'benefit_ens',
      method: 'get'
    },
    getOneBenefitEns: {
      url: 'benefit_ens',
      method: 'get'
    },
    createBenefitEns: {
      url: 'benefit_ens',
      method: 'post'
    },
    updateBenefitEns: {
      url: 'benefit_ens',
      method: 'patch'
    },
    deleteBenefitEns: {
      url: 'benefit_ens',
      method: 'delete'
    }
  },
  benefit_khs: {
    getAllBenefitKhs: {
      url: 'benefit_khs',
      method: 'get'
    },
    getOneBenefitKhs: {
      url: 'benefit_khs',
      method: 'get'
    },
    createBenefitKhs: {
      url: 'benefit_khs',
      method: 'post'
    },
    updateBenefitKhs: {
      url: 'benefit_khs',
      method: 'patch'
    },
    deleteBenefitKhs: {
      url: 'benefit_khs',
      method: 'delete'
    }
  },
  applicants: {
    getAllApplicant: {
      url: 'applicants',
      method: 'get'
    },
    getOneApplicant: {
      url: 'applicants/getOne',
      method: 'get'
    },
    createApplicant: {
      url: 'applicants',
      method: 'post'
    }
  },
  // utils: {
  //   downloadFile: {
  //     url: 'utils/download',
  //     method: 'post'
  //   }
  // },
  authentication: {
    signin: {
      url: 'authentication/signin',
      method: 'post'
    },
    verifyToken: {
      url: 'authentication/verify-token',
      method: 'post'
    },
    refreshToken: {
      url: 'authentication/refresh-token',
      method: 'post'
    },
    verifyWebpage: {
      url: 'authentication/verify-webpage',
      method: 'post'
    },
    getAllUserRole: {
      url: 'authorization/role/hr',
      method: 'get'
    },
    getOneCreditUserRole: {
      url: 'authorization/role/credit',
      method: 'get'
    },
    getMenuByRole: {
      url: 'menu/get-menu-by-role',
      method: 'get'
    }
  },
  user: {
    getAllExistingUsers: {
      url: 'user/hr',
      method: 'get'
    },
    getOneExistingUser: {
      url: 'user/hr',
      method: 'get'
    },
    getAllUserAD: {
      url: 'user_ad/hr',
      method: 'get'
    },
    getOneUserAD: {
      url: 'user_ad/hr',
      method: 'get'
    },
    addOneUser: {
      url: 'user/hr',
      method: 'post'
    },
    updateOneExistingUser: {
      url: 'user/hr',
      method: 'patch'
    }
  },
  branches: {
    getAllBranch: {
      url: 'branches',
      method: 'get'
    },
    getOneBranch: {
      url: 'branches',
      method: 'get'
    },
    createBranch: {
      url: 'branches',
      method: 'post'
    },
    updateBranch: {
      url: 'branches',
      method: 'patch'
    },
    deleteBranch: {
      url: 'branches',
      method: 'delete'
    }
  }
};
