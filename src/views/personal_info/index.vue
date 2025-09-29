<template>
    <div class="max-w-4xl p-8 mx-auto my-10 bg-white shadow-2xl rounded-xl">
        <h1 class="pb-3 mb-8 text-3xl font-extrabold text-teal-700 border-b">
            My Profile
        </h1>

        <!-- User info -->
        <div v-if="userInfo" class="space-y-6">
            <!-- Avatar & basic info -->
            <div class="relative flex items-center gap-6 p-4 rounded-lg bg-gray-50">
                <img :src=" defaultAvatar" alt="User Avatar"
                    class="object-cover w-24 h-24 border-4 border-white rounded-full shadow-md ring-4 ring-teal-400/50"
                    @error="handleImageError" />

                <div>
                    <p class="text-2xl font-bold text-gray-900">
                        {{ userInfo.first_name_en }} {{ userInfo.last_name_en }}
                    </p>
                    <p class="mt-1 font-medium text-teal-600">{{ userInfo.email }}</p>
                    <p class="text-sm text-gray-500">{{ userInfo.role?.name || 'N/A' }}</p>
                </div>
            </div>

            <!-- Detailed info -->
            <div class="grid grid-cols-1 gap-6 p-4 border rounded-lg sm:grid-cols-2 lg:grid-cols-3">
                <div class="p-3 bg-white">
                    <p class="text-xs font-semibold tracking-wider text-gray-500 uppercase">First Name</p>
                    <p class="mt-1 text-base font-medium text-gray-800">{{ userInfo.first_name_en || '-' }}</p>
                </div>
                <div class="p-3 bg-white">
                    <p class="text-xs font-semibold tracking-wider text-gray-500 uppercase">Last Name</p>
                    <p class="mt-1 text-base font-medium text-gray-800">{{ userInfo.last_name_en || '-' }}</p>
                </div>
                <div class="p-3 bg-white">
                    <p class="text-xs font-semibold tracking-wider text-gray-500 uppercase">Date of Birth</p>
                    <p class="mt-1 text-base font-medium text-gray-800">{{ formattedDob }}</p>
                </div>
                <div class="p-3 bg-white">
                    <p class="text-xs font-semibold tracking-wider text-gray-500 uppercase">Department</p>
                    <p class="mt-1 text-base font-medium text-gray-800">{{ userInfo.department?.name_en || '-' }}</p>
                </div>
                <div class="p-3 bg-white">
                    <p class="text-xs font-semibold tracking-wider text-gray-500 uppercase">Email</p>
                    <p class="mt-1 text-base font-medium text-gray-800">{{ userInfo.email || '-' }}</p>
                </div>
                <div class="p-3 bg-white">
                    <p class="text-xs font-semibold tracking-wider text-gray-500 uppercase">Phone</p>
                    <p class="mt-1 text-base font-medium text-gray-800">{{ userInfo.phone_number || '-' }}</p>
                </div>
            </div>

            <!-- Update button -->
            <div class="flex justify-end mt-8">
                <button
                    class="px-6 py-3 font-semibold text-white transition duration-200 bg-teal-600 rounded-lg shadow-md cursor-pointer hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    @click="showDialog = true">
                    <i class="fa-solid fa-pen-to-square"></i> Update
                </button>
            </div>
        </div>

        <div v-else class="p-4 text-xl font-medium text-center text-gray-500">
            Loading user information...
        </div>

        <!-- Update Dialog -->
        <div v-if="showDialog" style="background-color: rgb(0 0 0 / 0.5);"
            class="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300"
            @click.self="showDialog = false">
            <div
                class="w-full max-w-xl p-8 transition-all duration-300 transform scale-100 bg-white shadow-2xl rounded-xl">
                <h2 class="pb-3 mb-6 text-2xl font-bold text-gray-800 border-b">
                    Update Information
                </h2>

                <form @submit.prevent="updateInfo" class="space-y-5">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block mb-1 text-sm font-medium text-gray-700" for="first_name">First
                                Name</label>
                            <input id="first_name" v-model="editForm.first_name_en" type="text"
                                class="w-full px-4 py-2 transition duration-150 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                        </div>
                        <div>
                            <label class="block mb-1 text-sm font-medium text-gray-700" for="last_name">Last
                                Name</label>
                            <input id="last_name" v-model="editForm.last_name_en" type="text"
                                class="w-full px-4 py-2 transition duration-150 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                        </div>
                    </div>

                    <div>
                        <label class="block mb-1 text-sm font-medium text-gray-700" for="dob">Date of Birth</label>
                        <input id="dob" v-model="editForm.dob" type="date"
                            class="w-full px-4 py-2 transition duration-150 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                    </div>
                    <div>
                        <label class="block mb-1 text-sm font-medium text-gray-700" for="email">Email</label>
                        <input id="email" v-model="editForm.email" type="email"
                            class="w-full px-4 py-2 transition duration-150 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                    </div>
                    <div>
                        <label class="block mb-1 text-sm font-medium text-gray-700" for="phone">Phone</label>
                        <input id="phone" v-model="editForm.phone_number" type="text"
                            class="w-full px-4 py-2 transition duration-150 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                    </div>
                    <div>
                        <label class="block mb-1 text-sm font-medium text-gray-700" for="department">Department</label>
                        <input id="department" :value="userInfo.department?.name_en || ''" type="text" disabled
                            class="w-full px-4 py-2 text-gray-500 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed" />
                    </div>

                    <div class="flex justify-end gap-3 pt-4">
                        <button type="button"
                            class="px-5 py-2 font-semibold text-gray-700 transition duration-200 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                            @click="showDialog = false">
                            Cancel
                        </button>
                        <button type="submit"
                            class="flex items-center gap-2 px-5 py-2 font-semibold text-white transition duration-200 bg-teal-600 rounded-lg cursor-pointer hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Notification -->
        <div v-if="notification.visible" :class="[
            'fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg text-white font-semibold',
            notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        ]" style="min-width: 250px; z-index: 9999;">
            {{ notification.message }}
        </div>
    </div>
</template>

<script>
import { getUserInfoCookie } from '@/services/authentication';
import { getUserInfo, updateUserInfo } from '../../apis/user';

export default {
    name: 'MyInfoPage',
    data() {
        return {
            userInfo: null,
            showDialog: false,
            editForm: {
                first_name_en: '',
                last_name_en: '',
                dob: '',
                email: '',
                phone_number: '',
                department: ''
            },
            defaultAvatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            notification: {
                visible: false,
                message: '',
                type: 'success'
            }
        };
    },
    computed: {
        formattedDob() {
            if (!this.userInfo?.dob) return '-';
            const dateString = this.userInfo.dob.includes('T') ? this.userInfo.dob : `${this.userInfo.dob}T00:00:00`;
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
        }
    },
    methods: {
        async fetchUserInfo() {
            try {
                const userInfoCookie = getUserInfoCookie();
                if (!userInfoCookie) return;

                const parsedCookie = JSON.parse(userInfoCookie);
                const userId = parsedCookie?._id;
                if (!userId) return;

                const response = await getUserInfo(userId);
                this.userInfo = response.user || response;

                this.editForm.first_name_en = this.userInfo.first_name_en;
                this.editForm.last_name_en = this.userInfo.last_name_en;
                this.editForm.dob = this.userInfo.dob ? this.userInfo.dob.split('T')[0] : '';
                this.editForm.email = this.userInfo.email;
                this.editForm.phone_number = this.userInfo.phone_number;
                this.editForm.department = this.userInfo.department?._id || '';
            } catch (err) {
                this.showNotification('Failed to fetch user information.', 'error');
            }
        },
        handleImageError(event) {
            event.target.src = this.defaultAvatar;
        },
        async updateInfo() {
            try {
                const userInfoCookie = getUserInfoCookie();
                const parsedCookie = JSON.parse(userInfoCookie);
                const userId = parsedCookie?._id;

                if (!userId) throw new Error('User ID not found');

                const payload = {
                    user_id: userId,
                    ...this.editForm
                };

                const response = await updateUserInfo(payload);

                if (response.status === 1) {
                    this.userInfo = response.user;
                    this.showDialog = false;
                    this.showNotification('Information updated successfully!', 'success');
                } else {
                    this.showNotification('Update failed: ' + response.message, 'error');
                }
            } catch (err) {
                console.error('Update failed:', err);
                this.showNotification('Failed to update information.', 'error');
            }
        },
        showNotification(message, type = 'success') {
            this.notification.message = message;
            this.notification.type = type;
            this.notification.visible = true;
            setTimeout(() => {
                this.notification.visible = false;
            }, 3000);
        }
    },
    mounted() {
        this.fetchUserInfo();
    }
};
</script>
