<template>
  <v-navigation-drawer :model-value="true" permanent app :width="store.sidebarWidth" color="white"
    class="sidebar-shadow">
    <v-list density="compact" nav class="pt-0">
      <v-list-item @click="store.toggleSidebar" class="mx-2 my-1 rounded-17" :height="store.isMobile ? '20px' : '55px'"
        ripple="false">
        <template v-slot:prepend>
          <v-icon color="grey-darken-1">
            {{ store.isCollapsed ? 'mdi-chevron-right' : 'mdi-chevron-left' }}
          </v-icon>
        </template>
      </v-list-item>
    </v-list>

    <!-- Usuario expandido -->
    <v-list-item class="py-4" ripple="false" v-if="!store.isCollapsed" style="min-height: unset;">
      <div class="d-flex flex-row align-center justify-center" style="gap: 10px;">
        <v-avatar size="40" :style="!usuario.avatar ? { backgroundColor: userColor } : {}">
          <v-img v-if="usuario.avatar" :src="`http://localhost:3000/uploads/${usuario.avatar}`" cover />
          <span v-else class="text-white text-subtitle-2 font-weight-medium">
            {{ userInitials }}
          </span>
        </v-avatar>
        <span class="text-h6 font-weight-medium user-name">{{ usuario.nombre }}</span>
      </div>
    </v-list-item>

    <!-- Usuario colapsado -->
    <v-list-item class="d-flex justify-center py-6 pt-0" v-else>
      <v-avatar size="40" :style="!usuario.avatar ? { backgroundColor: userColor } : {}">
        <v-img v-if="usuario.avatar" :src="`http://localhost:3000/uploads/${usuario.avatar}`" cover />
        <span v-else class="text-white text-subtitle-2 font-weight-medium">
          {{ userInitials }}
        </span>
      </v-avatar>
    </v-list-item>

    <!-- Sidebar Menu Items -->
    <v-list density="compact" nav>
      <v-list-item v-for="item in menuItems" :key="item.title" :prepend-icon="item.icon" :value="item.title"
        :active="activeItem === item.title" @click="navigateTo(item.route)" class="mx-2 my-1 rounded-17"
        :class="{ 'bg-selected': activeItem === item.title }" :height="store.isMobile ? '48px' : '55px'"
        :ripple="false">
        <template v-slot:prepend>
          <v-icon :color="activeItem === item.title ? 'white' : 'grey-darken-1'">
            {{ item.icon }}
          </v-icon>
        </template>
        <v-list-item-title v-if="!store.isCollapsed" :class="{
          'text-white': activeItem === item.title,
          'text-grey-darken-1': activeItem !== item.title
        }" class="text-body-1 font-weight-medium">
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <v-divider class="my-2"></v-divider>
      <v-list-item prepend-icon="mdi-logout" @click="logout" class="mx-2 my-1 rounded-17"
        :height="store.isMobile ? '48px' : '55px'">
        <template v-slot:prepend>
          <v-icon color="grey-darken-1">mdi-logout</v-icon>
        </template>
        <v-list-item-title v-if="!store.isCollapsed" class="text-body-1 text-grey-darken-1 font-weight-medium rounded-17">
          Cerrar sesión
        </v-list-item-title>
      </v-list-item>
      <div class="pa-4" v-if="!store.isCollapsed">
        <v-img src="@/assets/logoSyncTeamHorizontal.png" alt="logo" height="25" contain />
      </div>
      <div class="pa-4" v-if="store.isCollapsed">
        <v-img src="@/assets/Isotipo.png" alt="logo" height="25" contain />
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { useLayoutStore } from '@/stores/layout'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const usuario = JSON.parse(localStorage.getItem("usuario")) || {};
const userInitials = `${usuario.nombre?.charAt(0) || ''}${usuario.apellidos?.charAt(0) || ''}`.toUpperCase();
const userColor = generateColorFromString(`${usuario.nombre}${usuario.apellidos}`);

function generateColorFromString(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 60%)`;
}

const store = useLayoutStore()
const activeItem = ref("Home")
const router = useRouter()

const menuItems = ref([
  { title: "Home", icon: "mdi-home", route: "/dashboard-creativo" },
  { title: "Tickets", icon: "mdi-ticket", route: "/tickets-creativo" },
  { title: "Calendario", icon: "mdi-calendar", route: "/calendario-creativo" },
  { title: "Notificaciones", icon: "mdi-bell", route: "/notificaciones" },
  { title: "Estadísticas", icon: "mdi-chart-bar", route: "/estadisticas-creativo" },
  { title: "Ajustes", icon: "mdi-cog", route: "/ajustes" },
])

const navigateTo = (route) => {
  activeItem.value = menuItems.value.find(item => item.route === route)?.title || "";
  router.push(route);
};

const logout = () => {
  console.log("Cerrando sesión...")
  router.push('/');
}
</script>

<style scoped>
.sidebar-shadow {
  box-shadow: 4px 0 8px rgba(0, 0, 0, 0.08);
  border-top-right-radius: 17px;
  border-bottom-right-radius: 17px;
}

.rounded-17 {
  border-radius: 17px;
}

.v-list-item {
  min-height: 55px;
  transition: all 0.3s ease;
}

.v-navigation-drawer {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1) !important;
}

.bg-selected {
  background-color: #7109B6;
  box-shadow: 0 4px 7px rgba(0, 0, 0, 0.2);
  color: white;
}

.gap-2 {
  gap: 8px;
}

.user-info {
  gap: 10px;
}

.user-name {
  display: flex;
  align-items: center;
}
</style>
