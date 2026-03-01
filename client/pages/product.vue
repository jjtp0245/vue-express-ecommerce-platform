<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4" class="category">
        <div class="text-h font-weight-bold shop-text">SHOP CATEGORIES</div>
        <v-radio-group v-model="selectedCategory" column @change="navigate">
          <v-radio label="All" :value="null"></v-radio>
          <v-radio label="Sticker" :value="1"></v-radio>
          <v-radio label="Griptok" :value="2"></v-radio>
          <v-radio label="Postcard" :value="3"></v-radio>
          <v-radio label="Keyring" :value="4"></v-radio>
          <v-radio label="Brooch" :value="5"></v-radio>
        </v-radio-group>
      </v-col>

      <v-col cols="12" md="8" class="product">
        <v-row>
          <v-col v-for="(product, index) in filteredProducts" :key="index" cols="12" sm="6" md="4" lg="4" xl="4">
            <v-card class="product-card" @click="goToProductDetail(product.product_id)">
              <v-img :src="product.image_url" class="white--text" height="200px"></v-img>
              <v-card-title class="product-title">{{ product.product_name }}</v-card-title>
              <v-card-subtitle class="product-price">{{ product.price }} BAHT</v-card-subtitle>
              <v-card-actions class="justify-end">
                <v-btn icon @click.stop="addToCart(product)">
                  <v-icon color="brown">mdi-cart</v-icon>
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
      selectedCategory: null,
      products: [],
      filteredProducts: [],
      loading: true,
    };
  },
  mounted() {
    const categoryId = this.$route.params.categoryId || 'all';
    this.selectedCategory = categoryId !== 'all' ? parseInt(categoryId) : null;
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await this.$axios.get('http://localhost:8000/product/');
        this.products = response.data.result;
        this.filterProducts();
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        this.loading = false;
      }
    },
    filterProducts() {
      this.filteredProducts = this.selectedCategory === null ? this.products : this.products.filter(
        product => product.category_id === this.selectedCategory
      );
    },
    navigate() {
      this.filterProducts();
    },
    goToProductDetail(productId) {
      this.$router.push({ name: "productdetail", params: { productId } });
    },
    addToCart(product) {
      if (process.client) {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          console.error("User ID not found. Please log in.");
          alert("กรุณาเข้าสู่ระบบเพื่อเพิ่มสินค้าในตะกร้า");
          return;
        }

        this.$axios.post(`http://localhost:8000/cart/${userId}/add`, {
          productId: product.product_id,
          quantity: 1,
          price: product.price
        })
          .then((response) => {
            console.log("Add to cart response:", response.data);

            // Update cart in localStorage
            const userEmail = localStorage.getItem("userEmail");
            const cartKey = `cart-${userEmail}`;
            const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

            // Add item to cart array or update quantity if it exists
            const existingItem = cart.find(item => item.productId === product.product_id);
            if (existingItem) {
              existingItem.quantity += 1;
            } else {
              cart.push({ productId: product.product_id, quantity: 1 });
            }

            // Save updated cart to localStorage
            localStorage.setItem(cartKey, JSON.stringify(cart));
            console.log("Updated cart in localStorage:", cart);

            // Trigger the cart count update in HeaderBar
            this.$root.$emit("update-cart-count");
          })
          .catch((error) => {
            console.error("Error adding item to cart:", error.response ? error.response.data : error.message);
          });
      }
    },
  },
};
</script>

<style scoped>
.category {
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.product {
  margin-top: 80px;
}

.text-h {
  text-align: left !important;
  margin-top: 60px;
  font-size: 20px;
  font-family: Fraunces;
  font-weight: bold;
  color: #634444;
}

.product-title {
  font-family: Fraunces !important;
  font-size: 14.5px;
  font-weight: bold;
  color: #634444;
}

.product-price {
  font-family: Fraunces !important;
  font-size: 16px;
  color: #ff6c16 !important;
}

.product-card {
  border: 2px solid #7B3F00;
  padding: 10px;
}
</style>
