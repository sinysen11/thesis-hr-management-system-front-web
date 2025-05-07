import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css'; // Adjust path to match your CSS file

const app = createApp(App);
app.use(router);
app.mount('#app');
