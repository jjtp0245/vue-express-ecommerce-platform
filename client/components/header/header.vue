<template>
  <client-only>
    <div>
      <!-- Header Bar -->
      <v-app-bar app flat :color="isAdmin ? 'custom-bg' : 'custom-bg'" width="100%" height="auto" class="appbar-style">
        <v-btn icon v-if="isAdmin" @click="toggleDrawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>

        <v-img v-if="!isAdmin" :src="require('@/assets/image/logo.png')" max-width="70" />
        <v-spacer></v-spacer>

        <v-btn v-if="!isAdmin" text class="mx-4">
          <nuxt-link to="/" class="text-decoration-none link-text">Home</nuxt-link>
        </v-btn>
        <v-btn v-if="!isAdmin" text class="mx-4">
          <nuxt-link to="/product" class="text-decoration-none link-text">Product</nuxt-link>
        </v-btn>
        <v-btn v-if="!isAdmin" text class="mx-4">
          <nuxt-link to="/brand" class="text-decoration-none link-text">Brand</nuxt-link>
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn class="login-button mx-4" v-if="!isLoggedIn" outlined @click="$router.push('/login')">Login</v-btn>
        <v-btn class="login-button mx-4" v-else outlined @click="logout">{{ isAdmin ? 'Logout' : 'Logout' }}</v-btn>

        <v-btn v-if="!isAdmin" icon @click="goToAccount">
          <v-icon>mdi-account</v-icon>
        </v-btn>
        <v-btn v-if="!isAdmin" icon to="/search">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-btn v-if="!isAdmin" icon @click="goToCart">
          <v-icon>mdi-cart</v-icon>
          <v-badge v-if="cartItemCount > 0" :content="cartItemCount" color="red" overlap></v-badge>
        </v-btn>

        <v-toolbar-title v-if="isAdmin">Admin</v-toolbar-title>

        <v-btn v-if="isAdmin" icon to="/admin/home">
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
      </v-app-bar>

      <!-- Admin Drawer -->
      <v-navigation-drawer
        v-model="drawer"
        app
        fixed
        clipped
        width="250"
        class="admin-drawer"
        v-if="isAdmin"
      >
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon large>mdi-account-circle</v-icon>
            </v-list-item-avatar>
          </v-list-item>
          <v-list-item-title class="drawer-header">Hello, Admin!</v-list-item-title>
          <v-divider class="my-4"></v-divider>
          <v-list-item
            v-for="(item, index) in adminMenuItems"
            :key="index"
            @click="goToPage(item.link); toggleDrawer()"
            class="drawer-item"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </div>
  </client-only>
</template>

<script>
export default {
  name: 'HeaderBar',
  data() {
    return {
      drawer: false,
      isLoggedIn: false,
      isAdmin: false,
      cartItemCount: 0,
      adminMenuItems: [
        { title: "Dashboard", icon: "mdi-view-dashboard", link: "/admin/home" },
        { title: "Products", icon: "mdi-package-variant", link: "/admin/productinfo" },
        { title: "Brand", icon: "mdi-folder", link: "/admin/brandinfo" },
        { title: "Order", icon: "mdi-receipt", link: "/admin/orderinfo" },
      ],
    };
  },
  created() {
    if (process.client) {
      this.checkLoginStatus();
      this.loadCartCount();
      this.$root.$on("update-cart-count", this.loadCartCount);
      this.$root.$on("logged-in", () => {
        this.checkLoginStatus();
        this.loadCartCount();
      });
    }
  },
  mounted() {
    window.addEventListener('storage', this.handleStorageChange);
  },
  beforeDestroy() {
    window.removeEventListener('storage', this.handleStorageChange);
    this.$root.$off("logged-in");
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      this.isLoggedIn = !!token;
      this.isAdmin = localStorage.getItem('isAdmin') === 'true'; // ตรวจสอบว่าเป็น admin หรือไม่
      if (this.isLoggedIn) {
        this.loadCartCount();
      }
    },
    loadCartCount() {
      const userEmail = localStorage.getItem("userEmail");
      if (userEmail) {
        const cart = JSON.parse(localStorage.getItem(`cart-${userEmail}`)) || [];
        this.cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
      } else {
        this.cartItemCount = 0;
      }
    },
    handleStorageChange(event) {
      if (event.key === `cart-${localStorage.getItem("userEmail")}`) {
        this.loadCartCount();
      }
    },
    logout() {
      const userEmail = localStorage.getItem("userEmail");
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('isAdmin'); // ลบค่า isAdmin
      if (userEmail) {
        localStorage.removeItem(`cart-${userEmail}`);
      }
      this.isLoggedIn = false;
      this.cartItemCount = 0;
      this.$router.push('/'); // เปลี่ยนเส้นทางไปที่หน้าเริ่มต้นหลัง logout
    },
    goToAccount() {
      if (this.isLoggedIn) {
        this.$router.push('/account');
      } else {
        this.$router.push('/login');
      }
    },
    goToCart() {
      if (this.isLoggedIn) {
        this.$router.push('/cart');
      } else {
        this.$router.push('/login');
      }
    },
    goToPage(link) {
      this.$router.push(link);
      this.drawer = false; // ปิด drawer หลังจากเลือกเมนูแล้ว
    },
    toggleDrawer() {
      this.drawer = !this.drawer; // เปิด/ปิด drawer
    }
  },
  watch: {
    '$route'() {
      this.drawer = false;
      this.loadCartCount();
      this.checkLoginStatus();
    }
  }
};
</script>

<style scoped>
.custom-bg {
  background-color: #FFFCE7 !important;
}

.appbar-style {
  padding: 20px;
  width: 100%;
  position: fixed; /* ทำให้ app-bar อยู่ด้านบนสุดของหน้าจอ */
  top: 0;
  left: 0;
  right: 0;
  z-index: 1050; /* ให้ app-bar อยู่ด้านบนสุดของเนื้อหา */
}

.v-btn {
  color: #694846;
  font-weight: bold;
  font-size: 16px;
}

.link-text {
  color: #694846;
  text-decoration: none;
}

.v-img {
  margin-left: 20px;
}

.login-button {
  color: #694846;
  border-color: #694846;
  border-radius: 20px;
}

.admin-drawer {
  z-index: 1000; /* ให้แน่ใจว่า Drawer อยู่ด้านบนสุด */
  background-color: #F5F5F5; /* สีพื้นหลังของ Drawer */
}

.drawer-header {
  font-size: 18px;
  font-weight: bold;
  padding: 16px;
  text-align: center;
}

.drawer-item {
  padding: 12px;
}

.v-navigation-drawer__content {
  padding-top: 20px; /* เพิ่ม padding ข้างบนเพื่อให้เนื้อหาภายในไม่ติดขอบ */
}
</style>
