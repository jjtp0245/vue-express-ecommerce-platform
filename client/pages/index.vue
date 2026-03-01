<template>
  <v-col class="banner">
    <!-- Carousel Section -->
    <v-carousel cycle hide-delimiters height="400px">
      <v-carousel-item>
        <v-img contain src="/assets/banner2.gif" alt="Banner Image 1" />
      </v-carousel-item>
      <v-carousel-item>
        <v-img contain src="/assets/bn2.jpg" alt="Banner Image 2" />
      </v-carousel-item>
    </v-carousel>

    <!-- Category Section -->
    <div class="ml-2 text-h">Shop By Category</div>
    <div class="text-h4" @click="goToAllProducts">show all >></div> <!-- เพิ่มการเรียกฟังก์ชันเมื่อคลิก -->

    <v-container>
      <v-row justify="center">
        <!-- Sticker Category -->
        <v-col class="d-flex flex-column align-center justify-center" @click="goToCategory(1)">
          <v-img width="200" height="200" contain src="/assets/st_1.png" />
          <div class="text-h1 text-center">Sticker</div>
        </v-col>

        <!-- Griptok Category -->
        <v-col class="d-flex flex-column align-center justify-center" @click="goToCategory(2)">
          <v-img max-width="200" max-height="200" contain src="/assets/gt_1.png" />
          <div class="text-h1 text-center">Griptok</div>
        </v-col>

        <!-- Keyring Category -->
        <v-col class="d-flex flex-column align-center justify-center" @click="goToCategory(3)">
          <v-img max-width="200" max-height="200" contain src="/assets/pt_1.png" />
          <div class="text-h1 text-center">Postcard</div>
        </v-col>

        <!-- Postcard Category -->
        <v-col class="d-flex flex-column align-center justify-center" @click="goToCategory(4)">
          <v-img max-width="200" max-height="200" contain src="/assets/all_1.png" />
          <div class="text-h1 text-center">Keyring</div>
        </v-col>

        <!-- Brooch Category -->
        <v-col class="d-flex flex-column align-center justify-center" @click="goToCategory(5)">
          <v-img max-width="200" max-height="200" contain src="/assets/cr_1.png" />
          <div class="text-h1 text-center">Brooch</div>
        </v-col>
      </v-row>
    </v-container>
  </v-col>
</template>

<script>
export default {
  methods: {
    goToAllProducts() {
      this.$router.push({ name: 'product', params: { categoryId: 'all' } });
    },
    goToCategory(categoryId) {
      this.$router.push({ name: 'product', params: { categoryId } });
    }
  }
};
</script>

<style scoped>
.banner {
  padding: 0;
  width: 100%;
  height: auto;
}

.text-h {
  text-align: center;
  margin: 50px auto;
  max-width: 100%;
  font-size: 30px;
  font-family: Fraunces;
  font-weight: bold;
  color: #634444;
}

.text-h4 {
  color: #634444;
  text-align: right;
  font-family: Fraunces !important;
  font-size: 16px !important;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.text-h1 {
  color: #634444;
  font-family: Fraunces !important;
  font-size: 18px !important;
  font-weight: bold;
}
</style>
