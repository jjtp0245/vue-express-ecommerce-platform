<template>
    <v-container>
        <v-col cols="12" class="text-center1">
            <span class="text-title">Orders</span>
        </v-col>
        <v-card class="table">
            <v-data-table :headers="headers" :items="orders" class="custom-data-table" item-key="id">
                <!-- Payment Status Chip -->
                <template v-slot:[`item.payment_status`]="{ item }">
                    <v-chip class="rounded-chip" :color="item.payment_status === 'paid' ? 'green' : 'red'" dark
                        @click="updatePaymentStatus(item, item.payment_status === 'pending' ? 'paid' : 'pending')">
                        {{ item.payment_status }}
                    </v-chip>
                </template>

                <!-- Order Status Chip -->
                <template v-slot:[`item.order_status`]="{ item }">
                    <v-chip class="rounded-chip" :color="item.order_status === 'delivered' ? 'green' : 'red'" dark>
                        {{ item.order_status }}
                    </v-chip>
                </template>

                <!-- Delete Icon -->
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small color="red" @click="deleteOrder(item)">
                        mdi-delete
                    </v-icon>
                </template>
            </v-data-table>
        </v-card>

        <!-- Snackbar for Success Message -->
        <v-snackbar v-model="snackbar" timeout="3000" color="white" class="top-snackbar" absolute top>
            <span style="color: black;">{{ snackbarMessage }}</span>
            <v-btn color="blue" @click="snackbar = false">OK</v-btn>
        </v-snackbar>
    </v-container>
</template>

<script>
import axios from 'axios';

export default {
    layout: "admin",
    data() {
        return {
            snackbar: false,
            snackbarMessage: '',
            headers: [
                { text: 'Order ID', align: 'start', value: 'id' },
                { text: 'Customer', value: 'customer' },
                { text: 'Order Date', value: 'order_date' },
                { text: 'Payment Method', value: 'payment_method' },
                { text: 'Payment Proof', value: 'payment_proof' },
                { text: 'Payment Status', value: 'payment_status' },
                { text: 'Order Status', value: 'order_status' },
                { text: 'Actions', value: 'actions', sortable: false }
            ],
            orders: []
        };
    },
    created() {
        this.fetchOrders();
    },
    methods: {
        async fetchOrders() {
            try {
                const response = await axios.get(`http://localhost:8000/order/`);
                this.orders = response.data.result.map(order => ({
                    ...order,
                    customer: order.customer // Map the user name to customer
                }));
            } catch (error) {
                console.error('Error fetching orders:', error);
                alert('Failed to fetch orders. Please try again.');
            }
        },
        async updatePaymentStatus(item, newStatus) {
            try {
                const response = await axios.put(`http://localhost:8000/payment/update-status/${item.id}`, {
                    status: newStatus
                });

                if (response.data.status === 'success') {
                    item.payment_status = newStatus;
                    this.snackbarMessage = `Payment status updated to ${newStatus}!`;

                    if (newStatus === 'paid') {
                        await this.updateOrderStatus(item, 'processing');
                    }

                    this.snackbar = true;
                }
            } catch (error) {
                console.error('Error updating payment status:', error);
                alert('Failed to update payment status. Please try again.');
            }
        },
        async updateOrderStatus(item, newStatus) {
            try {
                const response = await axios.put(`http://localhost:8000/order/update-status/${item.id}`, {
                    status: newStatus
                });

                if (response.data.status === 'success') {
                    item.order_status = newStatus;
                    this.snackbarMessage = `Order status updated to ${newStatus}!`;
                    this.snackbar = true;
                }
            } catch (error) {
                console.error('Error updating order status:', error);
                alert('Failed to update order status. Please try again.');
            }
        },
        async deleteOrder(item) {
            if (confirm(`Are you sure you want to delete order ID ${item.id}?`)) {
                try {
                    const response = await axios.delete(`http://localhost:8000/order/${item.id}`);
                    if (response.data.status === 'success') {
                        this.snackbarMessage = `Order ID ${item.id} deleted successfully!`;
                        this.snackbar = true;
                        this.fetchOrders(); // Refresh the list after deletion
                    }
                } catch (error) {
                    console.error('Error deleting order:', error);
                    alert('Failed to delete order. Please try again.');
                }
            }
        }
    }
};
</script>

<style scoped>
.headline {
    font-size: 20px;
    color: #6E6767;
    margin-bottom: 20px;
    font-weight: bold;
}

.top-snackbar {
    left: 50%;
    transform: translateX(-50%);
    z-index: 2000;
}

.rounded-chip {
    border-radius: 2px;
}

.text-title {
    font-size: 52px;
    color: #6E6767;
    margin-bottom: 20px;
    font-weight: bold;
}

.text-center1 {
    margin-top: 7%;
}

.table {
    margin-top: 50px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2) !important;
    border-radius: 8px;
    overflow: hidden !important;
    font-family: 'Roboto', sans-serif !important;
}

.custom-data-table>>>.v-data-table-header th {
    background-color: #D9D9D9 !important;
    color: #000000 !important;
    font-weight: bold !important;
    font-size: 18px !important;
}
</style>
