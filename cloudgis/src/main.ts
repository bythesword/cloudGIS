// import { createApp } from 'vue'
// import './style.css'
// import App from './App.vue'

// createApp(App).mount('#app')

import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router"; //添加router

createApp(App).use(router).mount('#app') //use(router)

