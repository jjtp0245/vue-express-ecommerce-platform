<template>
    <v-container class="mt-5">
        <v-row class="product-detail-page d-flex justify-center">
            <!-- ส่วนแสดงรูปสินค้า -->
            <v-col cols="12" md="6" class="text-center">
                <v-img v-if="product && product.image_url" :src="product.image_url" class="product-image"
                    max-width="400"></v-img>
                <div v-else-if="productNotFound">ไม่พบข้อมูลสินค้าที่คุณค้นหา</div>
                <div v-else>Loading...</div>
            </v-col>

            <!-- ส่วนแสดงข้อมูลสินค้า -->
            <v-col cols="12" md="6">
                <div v-if="product && product.product_name" class="product-info">
                    <!-- ชื่อแบรนด์ -->
                    <div class="brand">
                        Brand: <span class="brand-name">{{ product.brand_name || 'ไม่ระบุ' }}</span>
                    </div>
                    <!-- ชื่อสินค้า -->
                    <h1 class="product-name mt-3">{{ product.product_name || 'ไม่ระบุชื่อสินค้า' }}</h1>
                    <!-- ราคา -->
                    <div class="product-price mt-2">{{ product.price ? `${product.price} BAHT` : 'ไม่ระบุราคา' }}</div>

                    <!-- ตัวเลือกจำนวนสินค้า -->
                    <v-row class="mt-5 align-center">
                        <div class="quantity-wrapper">
                            <v-btn icon class="btn-frame" @click="decreaseQty">
                                <v-icon>mdi-minus</v-icon>
                            </v-btn>
                            <span class="mx-3">{{ quantity }}</span>
                            <v-btn icon class="btn-frame" @click="increaseQty">
                                <v-icon>mdi-plus</v-icon>
                            </v-btn>
                            <v-btn class="add-to-cart-btn" color="#FF8A6A" @click="addToCart(product)">
                                Add To Cart
                            </v-btn>
                        </div>
                    </v-row>
                </div>
                <div v-else-if="productNotFound">ไม่พบข้อมูลสินค้าที่คุณค้นหา</div>
                <div v-else>Loading...</div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            product: null,
            quantity: 1,
            productNotFound: false,
        };
    },
    async created() {
        const productId = this.$route.params.productId;
        await this.fetchProduct(productId);
    },
    methods: {
        async fetchProduct(productId) {
            try {
                const response = await this.$axios.get(`http://localhost:8000/product/${productId}`);
                if (response.data && response.data.result) {
                    this.product = response.data.result;
                } else {
                    this.productNotFound = true;
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                this.productNotFound = true;
            }
        },
        increaseQty() {
            this.quantity++;
        },
        decreaseQty() {
            if (this.quantity > 1) {
                this.quantity--;
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
                quantity: this.quantity, // ใช้ quantity จากการเลือกในหน้า product-detail
                price: product.price
            })
                .then(response => {
                    console.log("Add to cart response:", response.data);

                    // อัปเดตข้อมูลใน localStorage
                    const userEmail = localStorage.getItem("userEmail");
                    const cartKey = `cart-${userEmail}`;
                    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

                    // เพิ่มสินค้าลงในตะกร้าหรือเพิ่มจำนวนถ้ามีอยู่แล้ว
                    const existingItem = cart.find(item => item.productId === product.product_id);
                    if (existingItem) {
                        existingItem.quantity += this.quantity;
                    } else {
                        cart.push({ productId: product.product_id, quantity: this.quantity });
                    }

                    // บันทึกข้อมูลที่อัปเดตกลับไปใน localStorage
                    localStorage.setItem(cartKey, JSON.stringify(cart));
                    console.log("Updated cart in localStorage:", cart);

                    // Trigger the cart count update in HeaderBar
                    this.$root.$emit("update-cart-count");
                })
                .catch(error => {
                    console.error("Error adding item to cart:", error.response ? error.response.data : error.message);
                });
        },
    },
};
</script>

<style scoped>
.product-detail-page {
    justify-content: center;
    align-items: center;
    height: 80vh;
    width: 100%;
    margin-bottom: 0;
    padding-top: 60px;
    padding-bottom: 60px;
}

.product-image {
    border: 1px solid #ddd;
    padding: 15px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.product-info {
    margin-top: 20px;
}

.brand {
    font-size: 18px;
    font-weight: bold;
    color: #634444;
}

.brand-name {
    color: #f47c6b;
}

.product-name {
    font-weight: bold;
    color: #634444;
    font-size: 36px;
}

.product-price {
    font-size: 28px;
    color: #916E6E;
}

.add-to-cart-btn {
    font-weight: bold;
    font-size: 16px;
    color: #ffffff;
    text-transform: none;
    padding: 12px 24px;
    min-width: 200px !important;
    margin-left: 20px;
}

.quantity-wrapper {
    display: flex;
    align-items: center;
    background-color: #ffffff;
    padding: 2px 8px;
}

.btn-frame {
    border: 1px solid #FFFCE7;
    background-color: #FFFCE7;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
