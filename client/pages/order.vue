<template>
    <v-container class="page-container">
        <v-row>
            <!-- รายการสินค้าในตะกร้า -->
            <CartProductList :cart-products="cartProducts" class="product-list-section" />
            <!-- ส่วนสรุปคำสั่งซื้อ -->
            <OrderSummary :selected-address="selectedAddress" :selected-shipping="selectedShipping"
                :shipping-methods="shippingMethods" :total-price="totalPrice" :total-with-shipping="totalWithShipping"
                @update:selectedShipping="updateShipping" @open-dialog="dialog = true" @confirm-order="confirmOrder" />
        </v-row>
        <!-- เลือกที่อยู่ -->
        <AddressDialog v-if="dialog" :addresses="addresses" @select-address="updateAddress" @close="dialog = false" />
    </v-container>
</template>

<script>
import axios from "axios";
import CartProductList from "../components/pay/CartProductList.vue";
import OrderSummary from "../components/pay/OrderSummary.vue";
import AddressDialog from "../components/pay/AddressDialog.vue";

export default {
    components: { CartProductList, OrderSummary, AddressDialog },
    data() {
        return {
            dialog: false,
            userId: process.client ? localStorage.getItem("user_id") : null,
            selectedAddress: null,
            selectedShipping: 30,
            cartProducts: [],
            addresses: [],
            shippingMethods: [
                { name: "REG 30.00 Bath", price: 30 },
                { name: "EMS 50.00 Bath", price: 50 },
            ],
        };
    },
    computed: {
        totalPrice() {
            return this.cartProducts.reduce((total, product) => total + product.price * product.quantity, 0);
        },
        totalWithShipping() {
            return this.totalPrice + this.selectedShipping;
        },
    },
    async mounted() {
        if (this.userId) {
            await this.loadCart();
            await this.fetchDefaultAddress();
        } else {
            console.warn("ไม่พบ User ID ใน localStorage");
        }
    },
    methods: {
        async loadCart() {
            try {
                const response = await axios.get(`http://localhost:8000/cart/${this.userId}`);
                if (response.data.status === "success") {
                    this.cartProducts = this.combineProducts(response.data.items || []);
                } else {
                    console.error("ไม่สามารถโหลดรายการสินค้าในตะกร้าได้:", response.data.message);
                }
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการโหลดตะกร้า:", error);
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
        async confirmOrder() {
            if (!this.selectedAddress || Object.keys(this.selectedAddress).length === 0) {
                alert("กรุณาเลือกที่อยู่.");
                return;
            }
            try {
                const orderData = {
                    user_id: this.userId,
                    order_date: new Date().toISOString().split("T")[0],
                    total_amount: this.totalWithShipping,
                    shipping_method: this.shippingMethods.find(method => method.price === this.selectedShipping).name,
                    shipping_cost: this.selectedShipping,
                    address_id: this.selectedAddress.address_id,
                    cartItems: this.cartProducts // ส่งข้อมูลสินค้าที่อยู่ในตะกร้าไปยัง backend
                };

                const response = await axios.post("http://localhost:8000/order/create", orderData);

                if (response.data.status === "success" && response.data.order_id) {
                    alert("คำสั่งซื้อถูกสร้างเรียบร้อยแล้ว!");
                    if (process.client) {
                        localStorage.setItem("order_id", response.data.order_id);
                    }
                    await this.clearCart();

                    this.$root.$emit("order-completed");

                    window.location.href = "/payment";
                } else {
                    alert("ไม่สามารถสร้างคำสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง");
                }
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ:", error);
                alert("เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ กรุณาลองใหม่อีกครั้ง");
            }
        },
        async fetchDefaultAddress() {
            try {
                const response = await axios.get(`http://localhost:8000/address/default/${this.userId}`);
                if (response.data.status === "success" && response.data.result) {
                    this.selectedAddress = response.data.result;
                } else {
                    console.warn("ไม่พบที่อยู่เริ่มต้นสำหรับผู้ใช้นี้");
                    this.selectedAddress = {};
                }
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงที่อยู่เริ่มต้น:", error);
            }
        },
        updateAddress(selectedAddress) {
            this.selectedAddress = selectedAddress;
            this.dialog = false;
        },
        updateShipping(newShipping) {
            this.selectedShipping = newShipping;
        },
        updateCartCount() {
            const userEmail = localStorage.getItem("userEmail");
            if (userEmail) {
                localStorage.setItem(`cart-${userEmail}`, JSON.stringify(this.cartProducts));
                const count = this.cartProducts.reduce((total, item) => total + item.quantity, 0);
                this.$root.$emit("update-cart-count", count);
            }
        },
        async clearCart() {
            this.cartProducts = []; // เคลียร์สินค้าในตะกร้าในหน้านี้
            this.updateCartCount(); // อัปเดตจำนวนสินค้าใน UI

            if (this.userId) {
                try {
                    await axios.delete(`http://localhost:8000/cart/${this.userId}/clear`); // เรียก API ล้างตะกร้าใน backend
                    localStorage.removeItem(`cart-${localStorage.getItem("userEmail")}`); // ล้างข้อมูลตะกร้าใน localStorage
                } catch (error) {
                    console.error("เกิดข้อผิดพลาดในการล้างตะกร้า:", error);
                }
            }
            await this.loadCart(); // รีโหลดข้อมูลตะกร้าใหม่หลังจากล้าง
        }
    },
};
</script>

<style scoped>
.page-container {
    margin-top: 50px;
    display: flex;
    justify-content: center;
    gap: 50px;
}

.product-list-section {
    margin-top: 40px;
    justify-content: center;
    height: 30vh;
    width: 100%;
}

/* เพิ่มสไตล์เพิ่มเติมที่จำเป็น */
</style>
