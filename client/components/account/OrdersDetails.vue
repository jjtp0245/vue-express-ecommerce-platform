<template>
    <v-card flat class="order-card">
        <v-card-title class="profile-title">My Order</v-card-title>
        <v-tabs v-model="activeOrderTab" align-tabs="center">
            <v-tab>Your Order</v-tab>
            <v-tab>Awaiting Payment</v-tab>
            <v-tab>Success</v-tab>
        </v-tabs>

        <v-card-text class="order-content">
            <v-row justify="center" align="center" v-if="filteredOrders.length === 0">
                <v-col cols="12" class="text-center">
                    <v-icon large color="#d3c4a6">mdi-cart-outline</v-icon>
                    <p>No Order</p>
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col v-for="(order, orderIndex) in filteredOrders" :key="`order-${order.orderId}-${orderIndex}`"
                    cols="12" class="order-item">
                    <v-card outlined class="order-card-item">
                        <v-row class="order-header">
                            <v-col>
                                <span class="store-name">I LOVE ME SHOP</span>
                            </v-col>
                            <v-col class="text-right">
                                <span class="order-status">{{ order.orderStatus }}</span>
                            </v-col>
                        </v-row>
                        <v-divider></v-divider>

                        <v-row v-for="(item, itemIndex) in order.items" :key="`product-${item.productId}-${itemIndex}`"
                            class="product-row">
                            <v-col cols="3">
                                <v-img :src="item.imageUrl" class="product-image"></v-img>
                            </v-col>
                            <v-col cols="9">
                                <p class="product-name">{{ item.productName }}</p>
                                <p class="product-details">ตัวเลือกสินค้า: {{ item.productDescription }}</p>
                                <p class="product-quantity">x{{ item.quantity }}</p>
                                <p class="product-price">฿{{ item.productPrice }}</p>
                            </v-col>
                        </v-row>

                        <v-divider></v-divider>
                        <v-row class="order-footer">
                            <v-col>
                                <span class="total-label">รวมการสั่งซื้อ:</span>
                                <span class="total-amount">฿{{ order.totalAmount }}</span>
                            </v-col>
                            <v-col class="text-right">
                                <v-btn color="error" @click="confirmCancelOrder(order.orderId)">Cancel Order</v-btn>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import axios from "axios";

function transformOrderData(data) {
    const groupedOrders = data.reduce((acc, item) => {
        const orderId = item.order_id;

        if (!acc[orderId]) {
            acc[orderId] = {
                orderId,
                orderDate: item.order_date,
                totalAmount: item.total_amount,
                shippingMethod: item.shipping_method,
                shippingCost: item.shipping_cost,
                orderStatus: item.order_status,
                items: []
            };
        }

        acc[orderId].items.push({
            productId: item.product_id,
            productName: item.product_name,
            imageUrl: item.image_url,
            productDescription: item.product_description,
            quantity: item.quantity,
            productPrice: item.product_price
        });

        return acc;
    }, {});

    return Object.values(groupedOrders);
}

export default {
    data() {
        return {
            activeOrderTab: 0,
            orders: [],
            userId: null,
        };
    },
    computed: {
        filteredOrders() {
            switch (this.activeOrderTab) {
                case 1: // Awaiting Payment
                    return this.orders.filter(order => order.orderStatus === 'awaiting_payment');
                case 2: // Success
                    return this.orders.filter(order => order.orderStatus === 'success');
                default: // Your Order (all orders)
                    return this.orders;
            }
        },
    },
    async mounted() {
        this.userId = localStorage.getItem("user_id");
        if (this.userId) {
            await this.fetchOrders();
        } else {
            console.error("User is not logged in");
        }
    },
    methods: {
        async fetchOrders() {
            try {
                const response = await axios.get(`http://localhost:8000/order/user/${this.userId}/details`);
                if (response.data.status === "success" && Array.isArray(response.data.result)) {
                    this.orders = transformOrderData(response.data.result);
                } else {
                    console.error("ไม่สามารถดึงข้อมูลคำสั่งซื้อได้:", response.data.message);
                    this.orders = [];
                }
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ:", error);
                this.orders = [];
            }
        },
        confirmCancelOrder(orderId) {
            if (confirm("ยืนยันที่จะยกเลิกออเดอร์นี้ใช่หรือไม่?")) {
                this.cancelOrder(orderId);
            }
        },
        async cancelOrder(orderId) {
            try {
                const response = await axios.delete(`http://localhost:8000/order/${orderId}`);
                if (response.data.status === "success") {
                    alert("ออเดอร์ถูกยกเลิกเรียบร้อยแล้ว");
                    await this.fetchOrders(); // รีโหลดคำสั่งซื้อใหม่
                } else {
                    console.error("ไม่สามารถยกเลิกออเดอร์ได้:", response.data.message);
                    alert("เกิดข้อผิดพลาดในการยกเลิกออเดอร์ กรุณาลองใหม่อีกครั้ง");
                }
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการยกเลิกออเดอร์:", error);
                alert("เกิดข้อผิดพลาดในการยกเลิกออเดอร์ กรุณาลองใหม่อีกครั้ง");
            }
        },
    },
};
</script>

<style scoped>
.v-card {
    margin-top: 50px;
}

.profile-title {
    font-weight: bold;
    font-size: 22px;
    color: #694846;
    font-family: Fraunces;
}

.v-tab {
    color: #694846;
    text-decoration: none;
    font-family: Fraunces;
    font-size: 20px;
    transition: all 0.1s ease-in-out;
}

.tab-active {
    color: white;
    background-color: #fff5c6;
    font-weight: bold;
}

.v-tab:hover {
    background-color: #f2e9e5 !important;
    font-weight: bold;
}

.order-item {
    margin-top: 10px;
}

.order-card-item {
    padding: 10px;
    border: 1px solid #e0e0e0;
    background-color: #fff;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
}

.order-header,
.order-footer {
    align-items: center;
    padding: 5px 0;
}

.store-name {
    font-weight: bold;
    color: #d44439;
}

.order-status {
    color: #999;
    font-weight: bold;
}

.product-row {
    padding: 10px 0;
}

.product-image {
    width: 80px;
    height: 80px;
    object-fit: contain;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
}

.product-name {
    font-size: 16px;
    font-weight: 500;
    margin: 0;
}

.product-details {
    font-size: 14px;
    color: #777;
    margin: 0;
}

.product-quantity,
.product-price {
    color: #999;
    font-size: 14px;
    margin: 0;
}

.total-label {
    font-weight: bold;
}

.total-amount {
    font-size: 18px;
    color: #d44439;
    font-weight: bold;
}
</style>
