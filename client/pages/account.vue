<template>
  <v-card class="profile-card">
    <v-tabs vertical class="custom-tabs">
      <!-- Tabs Navigation -->
      <v-col class="all-tab">
        <v-row align="center">
          <v-avatar class="avt" size="36px" @click="triggerFileInput">
            <img v-if="avatar" :src="avatar" alt="Avatar" class="avatar-img1" />
            <v-icon size="36px" class="icon-ac" v-else>mdi-account-circle</v-icon>
          </v-avatar>
          <v-card-title class="title">
            <h1>My Profile</h1>
          </v-card-title>
        </v-row>

        <v-col class="tab-all">
          <v-tab class="custom-tab" @click="setActiveTab(0)">
            <v-icon left class="custom-icon">mdi-account</v-icon>
            <span class="custom-text">My Profile</span>
          </v-tab>
          <v-tab class="custom-tab" @click="setActiveTab(1)">
            <v-icon left class="custom-icon">mdi-map-marker-radius-outline</v-icon>
            <span class="custom-text">Address</span>
          </v-tab>
          <v-tab class="custom-tab" @click="setActiveTab(2)">
            <v-icon left class="custom-icon">mdi-cart-variant</v-icon>
            <span class="custom-text">Order</span>
          </v-tab>
        </v-col>
      </v-col>

      <!-- Tab Content -->
      <v-tabs-items v-model="activeTab">
        <v-tab-item>
          <ProfileDetails />
        </v-tab-item>
        <v-tab-item>
          <AddressDetails />
        </v-tab-item>
        <v-tab-item>
          <OrdersDetails />
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </v-card>
</template>

<script>
import ProfileDetails from '../components/account/ProfileDetails.vue';
import AddressDetails from '../components/account/AddressDetails.vue';
import OrdersDetails from '../components/account/OrdersDetails.vue';

export default {
  components: {
    ProfileDetails,
    AddressDetails,
    OrdersDetails,
  },
  data() {
    return {
      activeTab: 0,
      avatar: null,
    };
  },
  methods: {
    setActiveTab(index) {
      this.activeTab = index;
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
  },
};
</script>

<style scoped>
.title {
  font-family: Frauncesf;
  color: rgb(67, 47, 47);
}

.title h1 {
  font-size: 30px;
}

.all-tab {
  margin-right: 50px
}

.profile-section {
  max-width: 100%;
  height: 550px;
  margin-top: 20px;
  padding-left: 30px;
}

.profile-bg {
  width: 100%;
  background-color: #fffce7;
  border-radius: 10px;
  border: 1px solid #634444;
  padding: 10px;
}

.text1 {
  color: rgb(185, 139, 139);
  font-size: 16px;
  display: flex;
  align-items: center;
}

.edit-text {
  margin-right: 4px;
}

.p {
  margin-top: 2px;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.profile-title {
  font-size: 28px;
  font-weight: bold;
  font-family: 'Fraunces', serif;
  color: #5a3f2f;
}

.custom-tabs {
  margin-top: 100px;
}

.custom-tab {
  color: rgb(247, 202, 142);
  width: 300px;
  padding: 12px 16px;
  border-radius: 8px;
  transition: 0.3s ease;
  background-color: #FFFCE7;
  font-family: 'Fraunces', serif;
  border: 1px solid #634444;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.custom-tab:active {
  background-color: #ffc685;
}

.custom-tab:hover {
  background-color: #e0e0e0;
}

.v-text-field {
  font-family: 'Fraunces', serif;
  color: #5a3f2f;
}

.text {
  font-family: 'Fraunces', serif;
  font-size: 20px;
  color: #5a3f2f;
}

.save-btn {
  margin-top: 12px;
  font-family: 'Fraunces', serif;
  color: #fffce7;
  font-size: 14px;
  border-radius: 8px;
}

.edit-btn {
  margin-top: 12px;
  font-family: 'Fraunces', serif;
  color: #fffce7;
  font-size: 14px;
  border-radius: 8px;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-card {
  border-radius: 10px;
  padding: 16px;
  margin-top: 50px;
}

.avatar-img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-bottom: 16px;
}

.avatar-img1 {
  object-fit: cover;
}

.avatar-btn {
  font-size: 14px;
  font-weight: 500;
  font-family: 'Fraunces', serif;
  color: #fffce7;
}

.no-address p,
.order-card p {
  font-size: 16px;
  color: #a9a9a9;
  text-align: center;
  font-family: 'Fraunces', serif;
}

.custom-icon {
  color: #634444;
  font-size: 20px;
}

.icon-ac {
  margin-left: 10px;
}

.avt {
  margin-left: 20px;
}

.tab-all {
  margin-top: 10px;
}

.address-card-item {
  background-color: #FFFCE7;
  border: 1.5px solid #634444;
  border-radius: 10px;
  padding: 16px;
  max-width: 100%;
  height: 200px;
  padding-left: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
}

.address-card-wrapper {
  border: 1px solid #634444;
  border-radius: 10px;
  padding: 16px;
  background-color: #fffce7;
  width: 900px;
}

.add-btn {
  background-color: #ffc685;
  color: #fffce7;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Fraunces', serif;
  padding: 8px 16px;
  transition: background-color 0.3s ease;
  border-radius: 8px;
}

.add-btn:hover {
  background-color: #e0b570;
}

.custom-title {
  font-size: 20px;
  font-weight: bold;
  color: #634444;
  font-family: 'Fraunces', serif;
}

.custom-subtitle {
  font-size: 16px;
  font-weight: normal;
  color: #634444;
  font-family: 'Fraunces', serif;
}

.custom-text {
  margin-top: 10px;
  font-size: 16px;
  font-weight: normal;
  color: #634444;
  font-family: 'Fraunces', serif;
}

.v-main_wrap {
  max-width: 100%;
  height: 550px;
  margin-top: 30px;
  padding-left: 30px;
}

.address-form {
  background-color: #fffce7;
  padding: 20px;
  border-radius: 10px;
}

.input-field {
  background-color: #fffce7;
  border-radius: 5px;
  padding: 10px;
  font-family: 'Fraunces', serif;
}

.checkbox-field {
  color: #634444;
  font-family: 'Fraunces', serif;
}

.headline {
  font-family: 'Fraunces', serif !important;
}

.custom-tab:hover {
  background-color: #ffc685;
}

.v-tabs__item--active {
  background-color: #ffc685 !important;
  color: #fffce7 !important;
}
</style>
