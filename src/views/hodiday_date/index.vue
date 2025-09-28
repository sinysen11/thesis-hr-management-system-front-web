<template>
    <div class='w-full'>
        <!-- Header & Create Button -->
        <div class='flex items-center justify-between mb-6'>
            <h2 class='text-2xl font-extrabold tracking-tight text-green-700'>
                Public Holidays
            </h2>
            <button @click='openCreateModal' v-if="isAdmin"
                class='py-3 font-semibold text-white transition duration-300 ease-in-out transform shadow-md cursor-pointer px-7 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:scale-105 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300'>
                Create Holiday
            </button>
        </div>

        <div v-if="isLoading" class="py-4 text-center">
            <i class="text-6xl text-green-700 fas fa-spinner fa-spin"></i>
        </div>

        <!-- Create/Edit Holiday Modal -->
        <transition name='modal'>
            <div v-if='showCreateModal || showEditModal' @click.self='closeModal'
                style="background-color: rgb(0 0 0 / 0.5);"
                class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60">
                <div class='relative w-full max-w-2xl p-8 bg-white rounded-xl shadow-2xl'>
                    <h3 class='mb-6 text-2xl font-extrabold text-gray-800'>
                        {{ showEditModal ? 'Edit Public Holiday' : 'Create Public Holiday' }}
                    </h3>

                    <div class='flex flex-col gap-4 mb-5 sm:flex-row sm:gap-6'>
                        <div class='flex-1'>
                            <label class='block mb-2 font-semibold text-gray-700'>
                                Holiday Name <span class='text-red-600'>*</span>
                            </label>
                            <input type='text' v-model='holidayForm.name' @input='clearError("name")'
                                class='w-full p-3 mb-1 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700' />
                            <p v-if='errors.name' class='mb-4 text-sm text-red-600'>{{ errors.name }}</p>
                        </div>
                    </div>

                    <div class='flex flex-col gap-4 mb-5 sm:flex-row sm:gap-6'>
                        <div class='flex-1'>
                            <label class='block mb-2 font-semibold text-gray-700'>Start Date</label>
                            <input type='date' v-model='holidayForm.startDate'
                                class='w-full p-3 mb-1 transition border border-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700' />
                        </div>
                        <div class='flex-1'>
                            <label class='block mb-2 font-semibold text-gray-700'>End Date</label>
                            <input type='date' v-model='holidayForm.endDate'
                                class='w-full p-3 mb-1 transition border border-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700' />
                        </div>
                    </div>

                    <div class='flex justify-end gap-4'>
                        <button @click='closeModal'
                            class='px-5 py-2 font-semibold text-gray-700 transition bg-gray-300 rounded-lg cursor-pointer hover:bg-gray-400'>
                            Cancel
                        </button>
                        <button @click='submitHoliday'
                            class='px-6 py-2 font-semibold text-white transition bg-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-700'>
                            {{ showEditModal ? 'Update' : 'Submit' }}
                        </button>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Delete Confirmation Modal -->
        <transition name='modal'>
            <div v-if='showDeleteModal' @click.self='closeDeleteModal' style="background-color: rgb(0 0 0 / 0.5);"
                class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60">
                <div class='relative w-full max-w-md p-6 bg-white rounded-xl shadow-2xl text-center'>
                    <p class='mb-6 text-lg font-semibold text-gray-800'>Are you sure you want to delete this holiday?
                    </p>
                    <div class='flex justify-center gap-4'>
                        <button @click='closeDeleteModal'
                            class='px-5 py-2 font-semibold text-gray-700 transition bg-gray-300 rounded-lg cursor-pointer hover:bg-gray-400'>
                            Cancel
                        </button>
                        <button @click='confirmDelete'
                            class='px-5 py-2 font-semibold text-white transition bg-red-600 rounded-lg cursor-pointer hover:bg-red-700'>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Holidays Table -->
        <div class='overflow-hidden bg-white rounded-lg shadow-sm mt-6'>
            <div class='overflow-x-auto'>
                <table class='min-w-full text-sm rounded-lg shadow-md table-auto'>
                    <thead class='text-xs font-semibold text-gray-700 uppercase bg-gray-200'>
                        <tr>
                            <th class='px-5 py-4 text-left text-green-700'>No</th>
                            <th class='px-5 py-4 text-left text-green-700'>Holiday Name</th>
                            <th class='px-5 py-4 text-left text-green-700'>Start Date</th>
                            <th class='px-5 py-4 text-left text-green-700'>End Date</th>
                            <th v-if="isAdmin" class='px-5 py-4 text-left text-green-700'>Actions</th>
                        </tr>
                    </thead>

                    <div v-if="isLoading" class="py-4 text-center">
                        <i class="text-6xl text-green-700 fas fa-spinner fa-spin"></i>
                    </div>

                    <tbody class='text-gray-700'>
                        <tr v-if='holidays.length === 0'>
                            <td :colspan="isAdmin ? 5 : 4" class='px-5 py-4 text-center text-gray-500'>
                                No holidays found.
                            </td>
                        </tr>

                        <tr v-for='(holiday, index) in holidays' :key='holiday._id'
                            class='transition border-b border-gray-200 hover:bg-gray-50'>
                            <td class='px-5 py-4 font-medium'>{{ index + 1 }}</td>
                            <td class='px-5 py-4'>{{ holiday.name }}</td>
                            <td class='px-5 py-4'>{{ formatDate(holiday.startDate) }}</td>
                            <td class='px-5 py-4'>{{ formatDate(holiday.endDate) }}</td>
                            <td v-if="isAdmin" class='flex gap-2 px-5 py-4'>
                                <button @click='openEditModal(holiday)'
                                    class='p-1 text-blue-600 transition rounded-full cursor-pointer hover:bg-blue-100 hover:text-blue-800'
                                    title='Edit Holiday'>
                                    <i class='fas fa-edit'></i>
                                </button>
                                <button @click='openDeleteModal(holiday._id)'
                                    class='p-1 text-red-600 transition rounded-full cursor-pointer hover:bg-red-100 hover:text-red-800'
                                    title='Delete Holiday'>
                                    <i class='fas fa-trash'></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Notification -->
        <div v-if='notification.visible' :class='[
            "fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg text-white font-semibold",
            notification.type === "success" ? "bg-green-600" : "bg-red-600"
        ]' style='min-width: 250px; z-index: 9999;'>
            {{ notification.message }}
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import { createPublicHoliday, getAllPublicHoliday, updatePublicHoliday, deletePublicHoliday } from '@/apis/publicHoliday';
import { getUserInfoCookie } from '@/services/authentication';

export default {
    data() {
        return {
            holidays: [],
            isAdmin: false,
            isLoading: false,
            showCreateModal: false,
            showEditModal: false,
            showDeleteModal: false,
            deleteId: null,
            holidayForm: { name: '', startDate: '', endDate: '' },
            errors: {},
            notification: { message: '', type: '', visible: false }
        }
    },
    methods: {
        async fetchHolidays() {
            this.isLoading = true
            try {
                const res = await getAllPublicHoliday()
                if (res.status === 1) this.holidays = res.data
            } catch (err) {
                console.error(err)
                this.showNotification('Failed to fetch holidays.', 'error')
            } finally {
                this.isLoading = false
            }
        },
        openCreateModal() {
            this.showCreateModal = true
            this.showEditModal = false
            this.holidayForm = { name: '', startDate: '', endDate: '' }
        },
        openEditModal(holiday) {
            this.showEditModal = true
            this.showCreateModal = false
            this.holidayForm = {
                ...holiday,
                startDate: holiday.startDate ? holiday.startDate.slice(0, 10) : '',
                endDate: holiday.endDate ? holiday.endDate.slice(0, 10) : ''
            }
        },
        closeModal() {
            this.showCreateModal = false
            this.showEditModal = false
            this.errors = {}
            this.holidayForm = { name: '', startDate: '', endDate: '' }
        },
        validateForm() {
            this.errors = {}
            if (!this.holidayForm.name) this.errors.name = 'Holiday name is required.'
            return Object.keys(this.errors).length === 0
        },
        clearError(field) {
            if (this.holidayForm[field]) this.errors[field] = null
        },
        async submitHoliday() {
            if (!this.validateForm()) return
            try {
                let res
                if (this.showEditModal) {
                    res = await updatePublicHoliday(this.holidayForm._id, this.holidayForm)
                } else {
                    res = await createPublicHoliday(this.holidayForm)
                }
                if (res.status === 1) {
                    this.showNotification(this.showEditModal ? 'Holiday updated successfully.' : 'Holiday created successfully.', 'success')
                    this.closeModal()
                    await this.fetchHolidays()
                } else {
                    this.showNotification('Failed to save holiday.', 'error')
                }
            } catch (err) {
                console.error(err)
                this.showNotification('Failed to save holiday.', 'error')
            }
        },
        openDeleteModal(id) {
            this.showDeleteModal = true
            this.deleteId = id
        },
        closeDeleteModal() {
            this.showDeleteModal = false
            this.deleteId = null
        },
        async confirmDelete() {
            if (!this.deleteId) return
            try {
                const res = await deletePublicHoliday(this.deleteId)
                if (res.status === 1) {
                    this.showNotification('Holiday deleted successfully.', 'success')
                    await this.fetchHolidays()
                } else {
                    this.showNotification('Failed to delete holiday.', 'error')
                }
            } catch (err) {
                console.error(err)
                this.showNotification('Failed to delete holiday.', 'error')
            } finally {
                this.closeDeleteModal()
            }
        },
        showNotification(message, type = 'success') {
            this.notification.message = message
            this.notification.type = type
            this.notification.visible = true
            setTimeout(() => (this.notification.visible = false), 3000)
        },
        formatDate(date) {
            return date ? moment(date).format('DD-MMM-YYYY') : 'N/A'
        }
    },
    mounted() {
        const user = getUserInfoCookie();
        const user_info = JSON.parse(user)
        if (user_info) {
            this.isAdmin = user_info.role.name === 'Super Admin' || user_info.role.name === 'Admin'
        }
        this.fetchHolidays()
    }
}
</script>