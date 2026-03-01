<template>
    <v-col cols="10" md="4" class="d-flex flex-column align-self-start">
        <div class="order-summary">
            <div class="d-flex justify-space-between align-center">
                <h4 class="section-title">Address</h4>
                <v-btn color="#916E6E" class="address-btn" @click="$emit('open-dialog')">+ Select</v-btn>
            </div>
            <p class="address-text">
                <span v-if="selectedAddress && selectedAddress.recipient_name">
                    ผู้รับ {{ selectedAddress.recipient_name }}
                </span>
                <span v-else>
                    Select Address
                </span>
                <br>
                <span v-if="selectedAddress && Object.keys(selectedAddress).length">
                    {{ selectedAddress.address || '' }},
                    {{ selectedAddress.sub_district || '' }},
                    {{ selectedAddress.district || '' }},
                    {{ selectedAddress.province || '' }},
                    {{ selectedAddress.postcode || '' }}
                </span>
            </p>
        </div>

        <div class="order-summary">
            <h4 class="section-title">Shipping</h4>
            <v-select :items="shippingMethods" item-text="name" item-value="price" v-model="localSelectedShipping"
                class="custom-select"></v-select>

            <h4 class="section-title">Total Amount</h4>
            <div class="order-amount">
                Order Amount: <div class="right-align">{{ totalPrice }} BATH</div>
            </div>
            <div class="shipping-fee">
                Shipping: <div class="right-align">{{ localSelectedShipping }} BATH</div>
            </div>
            <div class="total-amount">
                Total: <div class="right-align-total">{{ totalWithShipping }} BATH</div>
            </div>
            <v-row justify="center" class="text-center">

                <v-col cols="12" class="text-center">
                    <v-btn large color="brown" class="confirm-btn" @click="confirmOrder">Confirm</v-btn>
                </v-col>
            </v-row>
        </div>
    </v-col>
</template>

<script>
export default {
    props: {
        selectedAddress: {
            type: Object,
            default: () => ({}),
        },
        selectedShipping: {
            type: Number,
            default: 30,
        },
        shippingMethods: {
            type: Array,
            default: () => [],
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        totalWithShipping: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            localSelectedShipping: this.selectedShipping,
        };
    },
    methods: {
        confirmOrder() {
            this.$emit("confirm-order");
        },
    },
    watch: {
        localSelectedShipping(newShipping) {
            this.$emit('update:selectedShipping', newShipping);
        },
    },
};
</script>

<style scoped>
.section-title {
    font-family: 'Fraunces';
    font-size: 24px;
    color: #634444;
}

.address-btn,
.confirm-btn {
    font-family: 'Fraunces';
    color: #fff;
    background-color: #7B3F00;
    box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.2);
    text-transform: uppercase;
}

.custom-select {
    font-family: 'Fraunces';
    color: #634444;
}

.order-summary {
    padding: 20px;
    border: 1px solid #916E6E;
    border-radius: 10px;
    background-color: #FFFCE7;
    margin-top: 20px;
}

.right-align {
    text-align: right;
}

.right-align-total {
    text-align: right;
    font-weight: bold;
    color: #ff6c16;
}

.order-amount,
.shipping-fee,
.total-amount {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
}

.bank-details {
    margin-top: 10px;
    padding-left: 15px;
    font-size: 0.95rem;
    color: #634444;
}

.bank-item {
    margin-bottom: 5px;
}

.account-holder {
    font-weight: bold;
    color: #634444;
    margin-top: 10px;
}

.qr-code {
    margin-top: 10px;
    color: #634444;
    font-weight: bold;
    text-align: center;
}
</style>
