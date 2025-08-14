<template>
    <div>
        <h2 class="text-2xl font-bold mb-6">Departments</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="dept in departments" :key="dept.id" class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold">{{ dept.name }}</h3>
                <p class="text-gray-600">Head: {{ dept.head }}</p>
                <p class="text-gray-600">Employees: {{ dept.employees }}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Departments',
    data() {
        return {
            departments: [
                { id: 1, name: 'IT', head: 'Alice Brown', employees: 25 },
                { id: 2, name: 'HR', head: 'Bob Wilson', employees: 10 },
                { id: 3, name: 'Finance', head: 'Carol Taylor', employees: 15 }
            ]
        };
    }
};
</script>