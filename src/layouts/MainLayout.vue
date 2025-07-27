<template>
  <div class="flex h-screen bg-gray-100">
    <Nav class="flex-shrink-0" />
    <div class="flex-1 flex flex-col overflow-hidden">
      <Header class="flex-shrink-0" />
      <main class="flex-1 overflow-auto p-4">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import Nav from '@/components/Nav.vue';
import Header from '@/components/Header.vue';

export default {
  components: {
    Nav,
    Header
  }
};
</script>
