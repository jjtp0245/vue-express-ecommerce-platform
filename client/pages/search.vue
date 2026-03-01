<template>
  <v-container class="main-container">
    <v-row class="search-bar">
      <v-text-field v-model="searchQuery" label="Search" clearable @input="performSearch" class="search-field"
        prepend-inner-icon="mdi-magnify" outlined placeholder="Type to search..."></v-text-field>
    </v-row>

    <v-row v-if="searchQuery && filteredItems.length > 0">
      <v-col v-for="(item, index) in filteredItems" :key="index" cols="12" sm="6" md="4" lg="4" xl="4">
        <v-card class="product-card">
          <v-img :src="item.image_url" alt="Item image" class="card-image" height="200px"></v-img>
          <v-card-title class="product-title">{{ item.product_name }}</v-card-title>
          <v-card-subtitle class="product-price">{{ item.price }} BAHT</v-card-subtitle>
          <v-card-subtitle class="product-category">{{ getCategoryName(item.category_id) }}</v-card-subtitle>
          <v-card-actions class="justify-end">
            <v-btn icon @click.stop="addToCart(item)">
              <v-icon color="brown">mdi-cart</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else-if="searchQuery">
      <v-col class="text-center">
        <p>ไม่พบสินค้าที่ค้นหา</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
      filteredItems: [],
    };
  },
  methods: {
    async performSearch() {
      try {
        const response = await this.$axios.get(`http://localhost:8000/product/search`, {
          params: { query: this.searchQuery }
        });
        this.filteredItems = response.data.result;
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
        productId: product.product_id,
        quantity: 1,
        price: product.price
      })
        .then(response => {
          console.log("Add to cart response:", response.data);

          const userEmail = localStorage.getItem("userEmail");
          const cartKey = `cart-${userEmail}`;
          const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

          const existingItem = cart.find(item => item.productId === product.product_id);
          if (existingItem) {
            existingItem.quantity += 1;
          } else {
            cart.push({ productId: product.product_id, quantity: 1 });
          }

          localStorage.setItem(cartKey, JSON.stringify(cart));
          this.$root.$emit("update-cart-count");
        })
        .catch(error => {
          console.error("Error adding item to cart:", error.response ? error.response.data : error.message);
        });
    },
    getCategoryName(categoryId) {
      return "หมวดหมู่"; // เพิ่ม logic เพื่อแสดงชื่อหมวดหมู่ที่แท้จริง
    }
  }
};
</script>

<style scoped>
.main-container {
  position: relative;
  min-height: 100vh;
  background-size: cover !important;
  background-repeat: no-repeat;
  background-position: bottom center;
  background-image: url('/assets/bg1.png');
}

.search-bar {
  justify-content: center;
  margin-top: 100px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 25px;
  padding: 10px;
}

.search-field {
  width: 50%;
  max-width: 600px;
  border-radius: 25px;
}

/* เปลี่ยนสีกรอบเป็นสีน้ำตาล */
.search-field .v-input__control {
  border: 3px solid #634444;
  box-shadow: none;
  transition: border-color 0.3s ease;
}

.search-field .v-input__control:focus-within {
  border-color: #8B5B4A !important;
}

.v-card {
  margin: 10px;
}

.card-image {
  height: 200px;
  object-fit: cover;
}

.product-title {
  font-size: 18px;
  font-weight: bold;
}

.product-price {
  font-size: 16px;
  color: #FF6C16;
}

.product-category {
  font-size: 14px;
  color: gray;
}

.text-center {
  text-align: center;
  margin-top: 50px;
}
</style>
