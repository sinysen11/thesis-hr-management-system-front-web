import { createApp } from 'vue';
import App from './App.vue';
<<<<<<< HEAD

createApp(App).mount('#app');
=======
import router from './router';
import './assets/main.css'; // Adjust path to match your CSS file

const app = createApp(App);
app.use(router);
app.mount('#app');
>>>>>>> df43f6dae2417a40e6f3be5b5a8c6bb325d1f989
