<template>
  <v-navigation-drawer
    :model-value="true"
    permanent
    app
    :width="store.sidebarWidth"
    color="grey-lighten-4"
  >
    <v-list density="compact" nav class="pt-0">
      <v-list-item 
        @click="store.toggleSidebar" 
        class="mx-2 my-1 rounded-17" 
        :height="store.isMobile ? '48px' : '55px'"
      >
        <template v-slot:prepend>
          <v-icon color="grey-darken-1">
            {{ store.isCollapsed ? 'mdi-chevron-right' : 'mdi-chevron-left' }}
          </v-icon>
        </template>
      </v-list-item>
    </v-list>

    <v-list-item 
      class="d-flex flex-column align-center pb-6 pt-0" 
      v-if="!store.isCollapsed"
    >
      <v-avatar size="40">
        <v-img src="@/assets/user-profile.jpg" alt="User" />
      </v-avatar>
      <span class="text-h6 font-weight-medium mt-2">Merali</span>
    </v-list-item>
    <v-list-item 
      class="d-flex justify-center py-6 pt-0" 
      v-else
    >
      <v-avatar size="40">
        <v-img src="@/assets/user-profile.jpg" alt="User" />
      </v-avatar>
    </v-list-item>

    <v-list density="compact" nav>
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :prepend-icon="item.icon"
        :value="item.title"
        :active="activeItem === item.title"
        @click="activeItem = item.title"
        class="mx-2 my-1 rounded-17"
        :class="{ 'bg-morado2': activeItem === item.title }"
        :height="store.isMobile ? '48px' : '55px'"
      >
        <template v-slot:prepend>
          <v-icon :color="activeItem === item.title ? 'white' : 'grey-darken-1'">
            {{ item.icon }}
          </v-icon>
        </template>
        <v-list-item-title
          v-if="!store.isCollapsed"
          :class="{
            'text-white': activeItem === item.title,
            'text-grey-darken-1': activeItem !== item.title
          }"
          class="text-body-1 font-weight-medium"
        >
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <v-divider class="my-2"></v-divider>
      <v-list-item 
        prepend-icon="mdi-logout" 
        @click="logout" 
        class="mx-2 my-1 rounded-17" 
        :height="store.isMobile ? '48px' : '55px'"
      >
        <template v-slot:prepend>
          <v-icon color="grey-darken-1">mdi-logout</v-icon>
        </template>
        <v-list-item-title 
          v-if="!store.isCollapsed" 
          class="text-body-1 text-grey-darken-1 font-weight-medium"
        >
          Cerrar sesión
        </v-list-item-title>
      </v-list-item>
      <div class="pa-4" v-if="!store.isCollapsed">
        <v-img 
          src="@/assets/logoSyncTeamHorizontal.png" 
          alt="logo" 
          height="25" 
          contain 
        />
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { useLayoutStore } from '@/stores/layout'
import { ref } from 'vue'

const store = useLayoutStore()
const activeItem = ref("Home")

const menuItems = ref([
  { title: "Home", icon: "mdi-home" },
  { title: "Tickets", icon: "mdi-ticket" },
  { title: "Calendario", icon: "mdi-calendar" },
  { title: "Notificaciones", icon: "mdi-bell" },
  { title: "Estadísticas", icon: "mdi-chart-bar" },
  { title: "Ajustes", icon: "mdi-cog" },
])

const logout = () => {
  console.log("Cerrando sesión...")
}
</script>

<style scoped>
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
</style>