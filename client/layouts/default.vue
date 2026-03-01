<template>
  <v-app dark>
      <HeaderBar />
      <Nuxt />

    <FooterBar />

  </v-app>
</template>

<script>
import HeaderBar from '../components/header/header.vue';
import FooterBar from '../components/footer/footer.vue';

export default {
  components: {
    FooterBar,
    HeaderBar
  },
  data() {
    return {
      cartItemCount: 0,
    };
  },
}
</script>


<style scoped>
::v-deep .v-toolbar__content {
  padding: 0;
}

::v-deep .v-toolbar {
  contain: layout;
  display: block;
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
  max-width: 100%;
  transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1) transform, 0.2s cubic-bezier(0.4, 0, 0.2, 1) background-color, 0.2s cubic-bezier(0.4, 0, 0.2, 1) left, 0.2s cubic-bezier(0.4, 0, 0.2, 1) right, 280ms cubic-bezier(0.4, 0, 0.2, 1) box-shadow, 0.25s cubic-bezier(0.4, 0, 0.2, 1) max-width, 0.25s cubic-bezier(0.4, 0, 0.2, 1) width;
  position: relative;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
}
</style>