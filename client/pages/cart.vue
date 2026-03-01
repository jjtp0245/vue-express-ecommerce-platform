<template>
  <v-container>
    <v-row>
      <!-- ส่วนรายการสินค้าในตะกร้า -->
      <v-col cols="12" md="8" class="product-list">
        <v-row v-for="(product, index) in cartProducts" :key="index" class="product-row">
          <v-col cols="2">
            <v-img :src="product.image" height="100px" class="image-frame"></v-img>
          </v-col>
          <v-col cols="6">
            <div class="product-name">{{ product.name }}</div>
            <div class="product-price">{{ product.price }} BATH</div>
          </v-col>
          <v-col cols="4" class="d-flex align-center justify-end">
            <div class="quantity-wrapper">
              <v-btn icon small class="btn-frame" @click="updateQuantity(product.product_id, -1)">
                <v-icon>mdi-minus</v-icon>
              </v-btn>
              <span class="quantity">{{ product.quantity }}</span>
              <v-btn icon small class="btn-frame" @click="updateQuantity(product.product_id, 1)">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
            <v-btn icon color="#FF8A6A" @click="removeProduct(product.product_id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>

      <!-- ส่วนสรุปยอดรวม -->
      <v-col cols="12" md="4">
        <div class="cart-section">
          <h4 class="cart-title">Your Cart</h4>
          <v-list-item v-for="(product, index) in cartProducts" :key="index" class="cart-item">
            <v-list-item-content>
              <v-list-item-title class="cart-item-title">{{ product.name }} x {{ product.quantity }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-content class="text-right cart-item-price">
              {{ product.price * product.quantity }} BATH
            </v-list-item-content>
          </v-list-item>
          <div class="total-section">
            <span>Total</span>
            <span class="total-price">{{ totalPrice }} BATH</span>
          </div>
        </div>
        <v-btn large color="brown" class="mt-4 pay-button" @click="goToPayPage">Pay</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      cartProducts: [],
    };
  },
  computed: {
    totalPrice() {
      return this.cartProducts.reduce((total, product) => total + product.price * product.quantity, 0);
    },
  },
  methods: {
    async loadCart() {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        alert("Please log in to view your cart.");
        return;
      }

      try {
        const response = await this.$axios.get(`http://localhost:8000/cart/${userId}`);
        if (response.data.status === "success") {
          this.cartProducts = this.combineProducts(response.data.items || []);
          this.updateCartCount();
        } else {
          console.error("Failed to load cart items:", response.data.message);
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    },
    combineProducts(products) {
      return products.reduce((acc, item) => {
        const existingItem = acc.find(i => i.product_id === item.product_id);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          acc.push(item);
        }
        return acc;
      }, []);
    },
    goToPayPage() {
      this.$router.push({ name: 'order' });
    },
    updateCartCount() {
      const userEmail = localStorage.getItem("userEmail");
      if (userEmail) {
        localStorage.setItem(`cart-${userEmail}`, JSON.stringify(this.cartProducts));
        const count = this.cartProducts.reduce((total, item) => total + item.quantity, 0);
        this.$root.$emit("update-cart-count", count);
      }
    },
    async updateQuantity(productId, amount) {
      const userId = localStorage.getItem("user_id");
      const product = this.cartProducts.find(item => item.product_id === productId);
      if (product && (product.quantity + amount) > 0) {
        try {
          await this.$axios.post(`http://localhost:8000/cart/${userId}/add`, {
            productId,
            quantity: amount,
            price: product.price
          });
          product.quantity += amount;
          this.updateCartCount();
        } catch (error) {
          console.error("Error updating quantity:", error);
        }
      } else if (product) {
        this.removeProduct(productId);
      }
    },
    async removeProduct(productId) {
      const userId = localStorage.getItem("user_id");
      try {
        await this.$axios.delete(`http://localhost:8000/cart/${userId}/remove/${productId}`);
        this.cartProducts = this.cartProducts.filter(item => item.product_id !== productId);
        this.updateCartCount();
      } catch (error) {
        console.error("Error removing product from cart:", error);
      }
    },
    clearCart() {
      this.cartProducts = [];
      this.updateCartCount();
      const userId = localStorage.getItem("user_id");
      if (userId) {
        this.$axios.delete(`http://localhost:8000/cart/${userId}/clear`);
      }
    }
  },
  mounted() {
    this.loadCart();
    this.$root.$on('load-cart', this.loadCart);

    if (localStorage.getItem("order_id") === null) {
      this.cartProducts = [];
    }
  },
};
</script>

<style scoped>
.product-list {
  border-right: 1px solid #e0e0e0;
  padding-right: 20px;
  margin-top: 10%;
}

.product-row {
  border-bottom: 1px solid #e0e0e0;
  padding: 15px 0;
}

.product-name {
  font-size: 18px;
  font-weight: bold;
  font-family: Fraunces;
  color: #634444;
}

.product-price {
  color: #ff6c16;
  font-weight: bold;
  font-family: Fraunces;
}

.cart-title {
  font-family: 'Fraunces';
  font-size: 20px;
  font-weight: bold;
  color: #634444;
  border-bottom: 2px solid #634444;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.cart-section {
  padding: 20px;
  border: 2px solid #634444;
  border-radius: 8px;
  background-color: #FFFCE7;
  margin-top: 40%;
}

.cart-item {
  background-color: #FFFCE7;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}

.cart-item-title {
  font-size: 16px;
  font-family: 'Fraunces';
  font-weight: bold;
  color: #634444;
}

.cart-item-price {
  font-size: 16px;
  font-family: 'Fraunces';
  font-weight: bold;
  color: #FF6C16;
  margin-left: auto !important;
}

.total-section {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: bold;
  font-family: 'Fraunces';
  color: #634444;
}

.total-price {
  font-size: 18px;
  font-weight: bold;
  font-family: 'Fraunces';
  color: #FF6C16;
}

.pay-button {
  width: 100%;
  font-size: 16px;
  font-family: 'Fraunces';
  background-color: #7B3F00;
  color: white;
}

.image-frame {
  border: 2px solid #634444;
  padding: 4px;
  background-color: #fff8f0;
  height: 100px;
  width: 100px;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.2);
}

.quantity-wrapper {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  padding: 2px 8px;
}

.quantity {
  margin: 0 10px;
  font-size: 16px;
  font-weight: bold;
  font-family: 'Fraunces';
  color: #634444;
}
</style>
