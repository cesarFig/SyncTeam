const routes = [
  {
    path: '/',
    name: 'LoginView',
    component: () => import('../views/LoginView.vue'),
    meta: { hideSidebar: true },
  },
  {
    path: '/registro',
    name: 'RegistroView',
    component: () => import('../views/RegistroView.vue'),
    meta: { hideSidebar: true },
  },
  {
    path: '/dashboard-admin',
    name: 'DashboardAdminView',
    component: () => import('../views/DashboardAdminView.vue')
  },
  {
    path: '/dashboard-creativo',
    name: 'DashboardCreativoView',
    component: () => import('../views/DashboardCreativoView.vue')
  },
  {
    path: '/tickets-admin',
    name: 'TicketsYPautasAdminView',
    component: () => import('../views/TicketsYPautasAdminView.vue')
  },
  {
    path: '/tickets-creativo',
    name: 'TicketsCreativoView',
    component: () => import('../views/TicketsCreativoView.vue')
  },
  {
    path: '/notificaciones',
    name: 'NotificacionesView',
    component: () => import('../views/NotificacionesView.vue')
  },
  {
    path: '/estadisticas-admin',
    name: 'EstadisticasAdminView',
    component: () => import('../views/EstadisticasAdminView.vue')
  },
  {
    path: '/estadisticas-creativo',
    name: 'EstadisticasCreativoView',
    component: () => import('../views/EstadisticasCreativoView.vue')
  },
  {
    path: '/equipo',
    name: 'EquipoView',
    component: () => import('../views/EquipoView.vue')
  },
  {
    path: '/calendario-admin',
    name: 'CalendarioCreativoView',
    component: () => import('../views/CalendarioCreativoView.vue')
  },
  {
    path: '/calendario-creativo',
    name: 'CalendarioAdminView',
    component: () => import('../views/CalendarioAdminView.vue')
  },
  {
    path: '/ajustes',
    name: 'AjustesView',
    component: () => import('../views/AjustesView.vue')
  },
  {
    path: '/devE',
    name: 'DevViewEduardo',
    component: () => import('../views/DevViewEduardo.vue')
  },
  {
    path: '/devC',
    name: 'DevViewCesar',
    component: () => import('../views/DevViewCesar.vue')
  },
  {
    path: '/devK',
    name: 'DevViewKelly',
    component: () => import('../views/DevViewKelly.vue')
  },
  {
    path: '/devA',
    name: 'DevViewArmando',
    component: () => import('../views/DevViewArmando.vue')
  },

];

export default routes;