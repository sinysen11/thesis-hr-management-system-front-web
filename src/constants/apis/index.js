
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
    position: {
        getAllPosition: {
            url: 'position',
            method: 'get'
        },
        getOnePosition: {
            url: 'position',
            method: 'get'
        },
        createPostion: {
            url: 'position',
            method: 'post'
        },
        updatePosition: {
            url: 'position',
            method: 'put' // Changed from 'get' to 'put'
        },
        deletePosition: {
            url: 'position',
            method: 'delete' // Changed from 'get' to 'delete'
        }
    },
    applicant: {
        getAllApplicant: {
            url: 'get-applicant',
            get: 'get'
        },
        getApplicantById: {
            url: 'get-applicant',
            method: 'get'
        },
        updateApplyStatus: {
            url: 'get-applicant/update',
            method: 'post'
        },
        getOneResume: {
            url: 'get-applicant',
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
        // For Admin
        getAllLeaveRequestForAdmin: {
            url: 'leave-requests/approver',
            method: 'get'
        },
        getStaffRequestForApprover: {
            url: 'leave-requests/approver',
            method: 'get'
        },
        allowStaffRequestLeave: {
            url: 'leave-requests',
            method: 'post'
        },
        createLeaveRequestForAdmin: {
            url: 'leave-requests',
            method: 'post'
        },
        updateLeaveRequestForAdmin: {
            url: 'leave-requests/approver',
            method: 'put' // Changed from 'get' to 'put'
        },
        deleteLeaveRequestForAdmin: {
            url: 'leave-requests/approver',
            method: 'delete' // Changed from 'get' to 'delete'
        },
        // For Staff
        getAllLeaveRequestForStaff: {
            url: 'leave-requests',
            method: 'get'
        },
        getOneLeaveRequestForStaff: {
            url: 'leave-requests',
            method: 'get'
        },
        createLeaveRequest: {
            url: 'leave-requests',
            method: 'post'
        },
        updateLeaveRequestForStaff: {
            url: 'leave-requests',
            method: 'put' // Changed from 'get' to 'put'
        },
        deleteLeaveRequestForStaff: {
            url: 'leave-requests',
            method: 'delete' // Changed from 'get' to 'delete'
        },
        getLeaveBalanceForUser: {
            url: 'leave-balance',
            method: 'get'
        },
        getOwnerLeaveRequest: {
            url: 'leave-requests',
            method: 'get'
        },
        getAllApprover: {
            url: 'leave-requests/approver',
            method: 'get'
        },
        getLeaveType: {
            url: 'leave-types',
            method: 'get'
        },
        getLeaveReport: {
            url: 'leave/reports',
            method: 'get'
        }
    },
    activityLog: {
        getAllActivityLog: {
        url: 'activity-log',
        method: 'get'
        },
        getOneActivityLog: {
        url: 'activity-log',
        method: 'get'
        }
    },
    users: {
        signin: {
            url: 'users/login',
            method: 'post'
        },
        forgotPassword: {
            url: 'users/forgot-password',
            method: 'post'
        },
        resetPassword: {
            url: 'users/reset-password',
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
            method: 'delete'
        },
        updateUserInfo: {
            url: 'users/update-info',
            method: 'post'
        },
        getUserInfo: {
            url: 'users/info',
            method: 'get'
        }, 
        changePassword: {
            url: 'users/change-password',
            method: 'post'
        },
        updateStatus: {
            url: 'users/update-status',
            method: 'post'
        }
    },
    mainContent: {
          getAllMainContent: {
            url: 'web-modify/main-content',
            method: 'get'
        },
        getOneMainContent: {
            url: 'web-modify/main-content',
            method: 'get'
        },
        createMainContent: {
            url: 'web-modify/main-content',
            method: 'post'
        },
        updateMainContent: {
            url: 'web-modify/main-content/update',
            method: 'post' // Changed from 'get' to 'put'
        },
        deleteMainContent: {
            url: 'web-modify/main-content/delete',
            method: 'post' // Changed from 'get' to 'delete'
        }
    },
    tabContent: {
            getAllTabContent: {
            url: 'web-modify/main-content',
            method: 'get'
        },
        getOneTabContent: {
            url: 'web-modify/main-content',
            method: 'get'
        },
        createTabContent: {
            url: 'web-modify/main-content/tabs',
            method: 'post'
        },
        updateTabContent: {
            url: 'web-modify/main-content/tabs/update',
            method: 'post' // Changed from 'get' to 'put'
        },
        deleteTabContent: {
            url: 'web-modify/main-content/tabs/delete',
            method: 'post' // Changed from 'get' to 'delete'
        }
    },
    uploadImage: {
        createUploadImage: {
            url: 'upload-image',
            method: 'post'
        }
    },
    publicHoliday: {
        createPublicHoliday: {
            url: 'public-holiday',
            method: 'post'
        },
        getAllPublicHoliday: {
            url: 'public-holiday',
            method: 'get'
        },
        updatePublicHoliday: {
            url: 'public-holiday/update',
            method: 'post'
        },
        deletePublicHoliday: {
            url: 'public-holiday/delete',
            method: 'post'
        },
        getHolidayDate: {
            url: 'public-holiday/date',
            method: 'get'
        }
    }
};
