<template>
  <div class="grey-background">
    <MasInfo />
  </div>
</template>

<script>
import MasInfo from '../components/DashboardTicket.vue';

export default {
  name: 'DashboardTicketView',
  components: {
    MasInfo,
  },
};
</script>

<style scoped>
.grey-background {
  background-color: #F3F4F8; 
  min-height: 100vh; 
  padding: 20px; 
}
</style>