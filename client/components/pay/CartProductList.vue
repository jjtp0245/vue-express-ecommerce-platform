<template>
    <v-col cols="12" md="8" class="d-flex flex-column">
        <h2 class="confirm-title">Confirm Order</h2>
        <div class="long-product-list" v-if="cartProducts.length">
            <v-row v-for="(product, index) in cartProducts" :key="index" class="product-item-long">
                <v-col cols="2">
                    <v-img :src="product.image" height="100px" class="image-frame"></v-img>
                </v-col>
                <v-col cols="4">
                    <div class="product-name">{{ product.name }}</div>
                </v-col>
                <v-col cols="2">
                    <div class="product-quantity">{{ product.quantity }}</div>
                </v-col>
                <v-col cols="2">
                    <div class="product-price">{{ product.price }} BATH</div>
                </v-col>
                <v-col cols="2">
                    <div class="total-price">{{ product.price * product.quantity }} BATH</div>
                </v-col>
            </v-row>
        </div>
        <div v-else>
            <p>No items in the cart.</p>
        </div>
    </v-col>
</template>

<script>
export default {
    props: {
        cartProducts: {
            type: Array,
            required: true,
        },
    },
};
</script>

<style scoped>
.confirm-title {
    font-family: 'Fraunces';
    font-size: 24px;
    color: #634444;
    margin-bottom: 20px;
}

.long-product-list {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.product-item-long {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #ccc;
}

.product-name,
.product-quantity,
.product-price,
.total-price {
    font-family: 'Fraunces';
    font-size: 16px;
    color: #634444;
}

.total-price {
    font-weight: bold;
    color: #ff6c16;
}

.image-frame {
    border: 2px solid #634444;
    padding: 4px;
    background-color: #fff8f0;
    height: 100px;
    width: 100px;
    box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.2);
}
</style>