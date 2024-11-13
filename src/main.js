import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import routeConfig from './routers'
import { createPinia } from 'pinia'

createApp(App)
    .use(createPinia())
    .use(routeConfig)
    .mount('#app')
