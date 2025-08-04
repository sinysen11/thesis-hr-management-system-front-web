module.exports = {
    jobs: {
        createJob: {
            url: 'post-job',
            method: 'post'
        },
        getAllJob: {
            url: 'post-job',
            method: 'get'
        },
        getOneJob: {
            url: 'post-job',
            method: 'get'
        },
        updateJob: {
            url: 'post-job',
            method: 'put'
        },
        deleteJob: {
            url: 'post-job',
            method: 'delete'
        },
        // Job Title
        getAllJobTitle: {
            url: 'job-title',
            method: 'get'
        },
        createJobTitle: {
            url: 'job-title',
            method: 'post'
        },
        getOneJobTitle: {
            url: 'job-title',
            method: 'get'
        },
        updateJobTitle: {
            url: 'job-title',
            method: 'put'
        },
        deleteJobTitle: {
            url: 'job-title',
            method: 'delete'
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
            method: 'put' // Changed from 'get' to 'put'
        },
        deleteDepartment: {
            url: 'departments',
            method: 'delete' // Changed from 'get' to 'delete'
        }
    },
    leaveRequest: {
        getAllLeaveRequest: {
            url: 'leave-requests',
            method: 'get'
        },
        getOneLeaveRequest: {
            url: 'leave-requests',
            method: 'get'
        },
        createLeaveRequest: {
            url: 'leave-requests',
            method: 'post'
        },
        updateLeaveRequest: {
            url: 'leave-requests',
            method: 'put' // Changed from 'get' to 'put'
        },
        deleteLeaveRequest: {
            url: 'leave-requests',
            method: 'delete' // Changed from 'get' to 'delete'
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
        getAllUser: {
            url: 'users',
            method: 'get'
        },
        getOneUser: {
            url: 'user',
            method: 'get'
        },
        createUser: {
            url: 'users/create',
            method: 'post'
        },
        updateUser: {
            url: 'users',
            method: 'put' // Changed from 'get' to 'put'
        },
        deleteUser: {
            url: 'users',
            method: 'delete' // Changed from 'get' to 'delete'
        },
        // Role
        getAllRole: {
            url: 'roles',
            method: 'get'
        },
        getOneRole: {
            url: 'roles',
            method: 'get'
        },
        createRole: {
            url: 'roles',
            method: 'post'
        },
        updateRole: {
            url: 'roles',
            method: 'put' // Changed from 'get' to 'put'
        },
        deleteRole: {
            url: 'roles',
            method: 'delete' // Changed from 'get' to 'delete'
        }
    }
};
