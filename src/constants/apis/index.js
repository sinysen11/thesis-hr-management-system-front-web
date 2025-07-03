module.exports = {
  jobs: {
    createJob: {
      url: 'jobs',
      method: 'post'
    },
    getAllJob: {
      url: 'post-job',
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
    },
    getAllJobTitle: {
      url: 'job-title',
      method: 'get'
    }
  },
  employee: {
    getAllPosition: {
      url: 'position',
      method: 'get'
    }
  },
  department: {
    getAllDepartment: {
      url: 'departments',
      method: 'get'
    }
  },
  users: {
    signin: {
      url: 'users/login',
      method: 'post'
    },
    verifyToken: {
      url: 'users/verify-token',
      method: 'post'
    },
    verifyWebpage: {
      url: 'users/verify-webpage',
      method: 'post'
    },
    refreshToken: {
      url: 'users/refresh-token',
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
  }
};
