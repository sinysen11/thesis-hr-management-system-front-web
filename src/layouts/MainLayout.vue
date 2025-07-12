<template>
  <div class="flex h-screen">
    <Nav />
    <div class="flex-1 flex flex-col">
      <Header />
      <main class="container flex-1 overflow-auto">
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
