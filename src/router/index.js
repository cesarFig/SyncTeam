import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { useLayoutStore } from '@/stores/layout'; // Import the layout store

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach((to) => {
  const layoutStore = useLayoutStore();
  if (to.path === '/tickets-pautas') {
    layoutStore.setSidebarCollapsed(true);
  } else {
    layoutStore.setSidebarCollapsed(false);
  }
});

export default router;