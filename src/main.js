import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router';
import { loadFonts } from './plugins/webfontloader'

loadFonts()

createApp(App).use(createPinia())
  .use(createPinia())
  .use(router)
  .use(vuetify)
  .mount('#app')
