<template>
  <v-container>
    <v-row class="centered-container">
      <img v-if="!selectedBrand" src="/assets/bg1.png" alt="Background" class="background-image" />
      <div class="text-h">Brand</div>
      <v-combobox v-model="selectedBrand" clearable label="Select a Brand" :items="brands" variant="outlined"
        class="custom-combobox"></v-combobox>
    </v-row>

    <v-row v-if="selectedBrand" justify="center">
      <v-col cols="12" md="8" class="product">
        <div class="brand-title">
          Brand : <span class="brand-name">{{ selectedBrand }}</span>
        </div>
        <v-row>
          <v-col cols="12" sm="6" md="4" lg="4" xl="4" v-for="(product, index) in filteredProducts" :key="index"
            class="d-flex justify-center">
            <v-card class="product-card">
              <v-img :src="product.image" class="white--text" height="200px"></v-img>
              <v-card-title class="product-title">{{ product.name }}</v-card-title>
              <v-card-subtitle class="product-price">
                {{ product.price }} BAHT
              </v-card-subtitle>
              <v-card-actions class="justify-end product-action">
                <v-btn icon @click.stop="addToCart(product)">
                  <v-icon color="brown" size="24">mdi-cart</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      selectedBrand: null,
      brands: [],
      products: [],
    };
  },
  computed: {
    filteredProducts() {
      return this.selectedBrand
        ? this.products.filter(product => product.brand === this.selectedBrand)
        : [];
    },
  },
  methods: {
    async fetchBrands() {
      try {
        const response = await this.$axios.get('http://localhost:8000/brand/');
        this.brands = response.data.result.map(brand => brand.brand_name);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    },
    async fetchProducts() {
      try {
        const response = await this.$axios.get('http://localhost:8000/product/');
        this.products = response.data.result.map(product => ({
          id: product.product_id,
          name: product.product_name,
          brand: product.brand_name,
          price: product.price,
          image: product.image_url,
        }));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    addToCart(product) {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        alert("กรุณาเข้าสู่ระบบเพื่อเพิ่มสินค้าในตะกร้า");
        return;
      }

      this.$axios.post(`http://localhost:8000/cart/${userId}/add`, {
        productId: product.id,
        quantity: 1,
        price: product.price
      })
        .then(response => {
          console.log("Add to cart response:", response.data);

          const userEmail = localStorage.getItem("userEmail");
          const cartKey = `cart-${userEmail}`;
          const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

          const existingItem = cart.find(item => item.productId === product.id);
          if (existingItem) {
            existingItem.quantity += 1;
          } else {
            cart.push({ productId: product.id, quantity: 1 });
          }

          localStorage.setItem(cartKey, JSON.stringify(cart));
          this.$root.$emit("update-cart-count");
        })
        .catch(error => {
          console.error("Error adding item to cart:", error.response ? error.response.data : error.message);
        });
    }
  },
  created() {
    this.fetchBrands();
    this.fetchProducts();
  }
};
</script>

<style scoped>
/* Custom styles */
.centered-container {
  justify-content: center;
  align-items: center;
  height: 35vh;
  width: 100%;
  margin-bottom: 0;
  /* ลดระยะห่างด้านล่าง */
  padding-bottom: 0;

}

/* ปรับลด margin ของ brand-title */
.brand-title {
  text-align: left !important;
  margin: 10px 0 10px 0;
  /* ลดระยะห่างด้านบนและด้านล่าง */
  font-size: 28px;
  font-family: Fraunces;
  font-weight: bold;
  color: #634444;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 0;
  object-fit: cover;
}

.custom-combobox {
  border: 3px solid #634444;
  border-radius: 8px;
  padding: 10px;
  max-width: 50%;
  width: 300px;
  background-color: #FFFCE7;
  color: #634444;
  margin-left: 10px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Lora', serif;
  font-size: 25px;
}

.product-card {
  border: 1px solid #7B3F00;
  padding: 10px;
  width: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-title {
  font-family: Fraunces, sans-serif;
  font-size: 14px;
  font-weight: bold;
  color: #634444;
}

.product-price {
  font-family: Fraunces, sans-serif;
  font-size: 16px;
  color: #FF6C16;
}

.product-category {
  font-family: Fraunces, sans-serif;
  font-size: 14px;
  color: #634444;
}

.v-row {
  margin-top: 20px;
}
</style>
