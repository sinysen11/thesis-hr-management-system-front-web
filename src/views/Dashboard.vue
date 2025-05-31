<template>
    <div>
        <h2 class="text-2xl font-bold mb-6">Dashboard</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold">Total Employees</h3>
                <p class="text-3xl font-bold text-blue-600">150</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold">Departments</h3>
                <p class="text-3xl font-bold text-blue-600">8</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold">Active Projects</h3>
                <p class="text-3xl font-bold text-blue-600">12</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Dashboard'
};
</script>