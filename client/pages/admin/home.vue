<template>
    <v-container>
        <v-row class="mt-5">
            <v-col cols="12" class="text-center1">
                <span class="text-title">Dashboard</span>
            </v-col>
            <v-col cols="4" v-for="(item, index) in items" :key="index">
                <v-card class="mx-auto" color="grey lighten-3" height="200" outlined @click="goToPage(item.link)">
                    <v-card-title class="justify-center">
                        <span class="display-3"></span> <!-- ลบตัวเลขออก -->
                    </v-card-title>
                    <v-card-subtitle class="text-center">{{ item.title }}</v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    layout: "admin",
    data() {
        return {
            items: [
                { title: "Products", link: "/admin/productinfo" },
                { title: "Brands", link: "/admin/brandinfo" },
                { title: "Orders", link: "/admin/orderinfo" },
            ],
        };
    },
    methods: {
        goToPage(link) {
            this.$router.push(link);
        },
    },
};
</script>

<style scoped>
.mx-auto {
    margin-top: 90px;
    width: 100%; /* ปรับให้เต็มความกว้าง */
    max-width: 400px; /* กำหนดความกว้างสูงสุด */
    height: 300px !important;
    background-color: #EBEBEB !important;
    border-radius: 20px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.text-center1 {
    margin-top: 150px;
}

.display-3 {
    font-size: 72px;
    color: #4A4A4A;
    font-weight: bold;
    margin-top: 2%;
}

.text-title {
    font-size: 52px;
    color: #6E6767;
    margin-bottom: 20px;
    font-weight: bold;
}

.text-center {
    font-size: 30px !important;
    color: #545454;
    font-weight: bold;
}

/* เพิ่ม CSS สำหรับ Admin Drawer */
.v-navigation-drawer {
    z-index: 1000; /* ทำให้ Drawer อยู่ด้านบน */
}
</style>
