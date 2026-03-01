<template>
  <v-footer app>
    <v-card flat width="100%" height="10vh" class="footer-bg">
      <v-card-text>
        <v-row justify="space-between" align="center">
          <!-- Left: Logo and Company Name -->
          <v-col class="d-flex align-center" cols="6">
            <v-img :src="require('@/assets/image/logo.png')" max-width="45" />
            <div class="ml-2 footer-text">ilovemeshop</div>
          </v-col>

          <!-- Right: Social Icons and Line ID -->
          <v-col cols="6" class="text-right d-flex justify-end align-center">
            <v-icon class="mx-2 footer-text">mdi-instagram</v-icon>
            <v-icon class="mx-2 footer-text">mdi-twitter</v-icon>
            <v-icon class="mx-2 footer-text">mdi-facebook</v-icon>
          </v-col>
          <v-col cols="18" class="text-right d-flex justify-end align-start">
            <span class="ml-4 footer-text d-flex justify-end align-start" style="margin-top: -30px;">Line:
              @ilovemeshop</span>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: 'FooterBar',
};
</script>

<style scoped>
.footer-bg {
  background-color: #FFFCE7;
  /* Beige color matching the main background */
}

.footer-text {
  color: #694846;
  /* Matching the brown text from the image */
  font-size: 16px;
  /* Adjust as per your need */
}

.v-footer.v-sheet.theme--light.v-footer--fixed {
  padding: 0;
}

.v-icon {
  color: #694846;
  /* Matching the icon color */
}
</style>