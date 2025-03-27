
</template>

<script>
/* eslint-disable */
import MasInfo from './components/MasInfo.vue';
import SidebarWrapper from './components/sidebar/SidebarWrapper.vue';
import { useLayoutStore } from '@/stores/layout'

export default {
  name: 'App',

  components: {
    MasInfo,
    SidebarWrapper
  },

  setup() {
    const store = useLayoutStore ()
    
    const mainStyles = {
      marginLeft: `${store.sidebarWidth}px -30px`,
      transition: 'margin 0.3s cubic-bezier(0.25, 0.8, 0.5, 1)'
    }

    return {
      mainStyles
    }
  },

  data: () => ({
    //
  }),
}
</script>

<style>
.v-main {
  transition: margin 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}
</style>