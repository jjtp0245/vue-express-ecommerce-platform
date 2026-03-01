<template>
    <v-container>
        <img src="/assets/bg1.png" alt="Background" class="background-image" />
        <v-row justify="center">
            <!-- Payment Section -->
            <v-col cols="10" md="4" class="d-flex flex-column align-self-start payment-container">
                <h4 class="section-title">Payment</h4>
                <v-row justify="center" class="text-center">
                    <!-- Payment Date -->
                    <v-col cols="12">
                        <v-text-field v-model="paymentDate" label="Payment Date" type="date" required
                            class="label-font"></v-text-field>
                    </v-col>

                    <!-- Amount -->
                    <v-col cols="12">
                        <v-text-field v-model="amount" label="Amount" type="number" min="1" required
                            placeholder="Enter amount" class="label-font"></v-text-field>
                    </v-col>

                    <!-- Upload Payment Proof -->
                    <v-col cols="12">
                        <v-file-input label="Upload payment photo" v-model="paymentProof" accept="image/*"
                            prepend-icon="mdi-camera" required class="fornt-form"></v-file-input>
                    </v-col>

                    <!-- Payment Method Options -->
                    <v-col cols="12">
                        <v-radio-group v-model="paymentMethod" row>
                            <v-radio class="h4" label="Mobile Banking" value="mobile_banking"></v-radio>
                            <v-radio class="h4" label="QR Payment" value="qr_payment"></v-radio>
                        </v-radio-group>
                    </v-col>

                    <!-- Bank Details (for Mobile Banking) -->
                    <v-col cols="12" v-if="paymentMethod === 'mobile_banking'">
                        <v-list class="bank-list">
                            <v-list-item v-for="(bank, index) in bankDetails" :key="index" class="bank-item">
                                <v-list-item-content>
                                    <v-list-item-title class="bank-name">{{ bank.name }}: {{ bank.accountNumber
                                        }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                        <p class="account-holder">Account Name: Multi Brand Co., Ltd.</p>
                    </v-col>

                    <!-- QR Code (for QR Payment) -->
                    <v-col cols="12" v-if="paymentMethod === 'qr_payment'">
                        <h4 class="section-title">QR Payment</h4>
                        <canvas ref="qrCanvas" style="display: block; margin: 0 auto;"></canvas>
                    </v-col>

                    <!-- Confirm Payment Button -->
                    <v-col cols="12" class="text-center">
                        <v-btn large color="brown" class="confirm-btn" @click="submitPayment">CONFIRM</v-btn>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import QRCode from "qrcode";
import axios from "axios";

export default {
    data() {
        return {
            paymentDate: '',
            amount: '',
            paymentProof: null,
            paymentMethod: '',
            bankDetails: [
                { name: "ธนาคารกรุงเทพ", accountNumber: "123-4-56789-0" },
                { name: "ธนาคารกสิกรไทย", accountNumber: "987-6-54321-0" },
                { name: "ธนาคารไทยพาณิชย์", accountNumber: "456-7-89012-3" },
            ],
            paymentStatus: 'pending',
            orderId: null,
        };
    },
    beforeMount() {
        this.orderId = localStorage.getItem("order_id");

        if (this.orderId && this.orderId !== 'undefined') {
            axios.get(`http://localhost:8000/order/${this.orderId}`)
                .then((response) => {
                    if (response.data.status === "success" && response.data.result) {
                        this.amount = response.data.result.total_amount;
                    } else {
                        console.warn("ไม่พบข้อมูล order");
                    }
                })
                .catch((error) => {
                    console.error("เกิดข้อผิดพลาดในการดึงข้อมูล order:", error);
                });
        } else {
            console.warn("ไม่พบ order_id ใน localStorage หรือ order_id ไม่ถูกต้อง");
            alert("ไม่พบข้อมูลการสั่งซื้อ กรุณากลับไปยืนยันคำสั่งซื้อใหม่อีกครั้ง");
            window.location.href = "/order";
        }
    },
    methods: {
        onFileChange(event) {
            this.paymentProof = event.target.files[0];
        },
        async submitPayment() {
            if (this.paymentDate && this.amount && this.paymentProof && this.paymentMethod) {
                const paymentData = new FormData();
                paymentData.append('order_id', this.orderId);
                paymentData.append('paymentDate', this.paymentDate);
                paymentData.append('amount', this.amount);
                paymentData.append('paymentProof', this.paymentProof);
                paymentData.append('paymentMethod', this.paymentMethod);
                paymentData.append('paymentStatus', this.paymentStatus);

                try {
                    const response = await axios.post('http://localhost:8000/payment/create', paymentData);
                    if (response.data.status === "success") {
                        alert('Payment successful!');
                        this.paymentStatus = 'paid';
                        window.location.href = "/";
                    } else {
                        alert('Payment failed, please try again.');
                    }
                } catch (error) {
                    console.error("Error submitting payment:", error);
                    alert('Payment failed, please try again.');
                }
            } else {
                alert('Please fill in all information');
            }
        },
        generateQRCode() {
            const canvas = this.$refs.qrCanvas;
            if (canvas) {
                QRCode.toCanvas(
                    canvas,
                    "Please pay with love only ❤️",
                    {
                        width: 150,
                        margin: 1,
                        color: {
                            dark: "#000000",
                            light: "#ffffff",
                        },
                    },
                    (error) => {
                        if (error) console.error(error);
                    }
                );
            }
        },
    },
    watch: {
        paymentMethod(newPayment) {
            if (newPayment === 'qr_payment') {
                this.$nextTick(() => {
                    this.generateQRCode();
                });
            }
        },
    },
};
</script>

<style scoped>
.background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 0;
    object-fit: cover;
}

.payment-container {
    padding: 20px;
    background-color: #FFFCE7;
    border: 2px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    margin: 0 auto;
    margin-top: 10%;
    text-align: center;
    z-index: 1;
}

.h4 {
    font-family: 'Fraunces', serif;
    font-size: 18px;
    color: #634444;
}

.section-title {
    font-family: 'Fraunces', serif;
    font-size: 24px;
    color: #634444;
    margin-bottom: 20px;
}

.confirm-btn {
    font-family: 'Fraunces', serif;
    color: #fff8f0;
    background-color: #634444;
    box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.2);
    margin-top: 15px;
}

.fornt-form {
    text-align: center;
    font-family: 'Fraunces', serif;
    font-size: 18px;
    color: #634444;
    margin: 12px 0;
    font-weight: bold;
}

.bank-list {
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
}

.bank-item {
    padding: 8px 0;
    border-bottom: 1px solid #ddd;
}

.bank-name {
    font-weight: bold;
    font-family: 'Fraunces', serif;
    font-size: 16px;
    color: #634444;
}

.account-holder {
    font-family: 'Fraunces', serif;
    color: #634444;
    margin-top: 10px;
    font-size: 14px;
    text-align: center;
}

.label-font .v-label {
    font-weight: bold;
    font-size: 18px;
    font-family: 'Fraunces', serif;
    color: #634444;
}
</style>

<style scoped>
/* ภาพพื้นหลัง */
.background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 0;
    object-fit: cover;
}

/* Container ของหน้าชำระเงิน */
.payment-page {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    background-color: #FFFCE7;
    /* สีพื้นหลังครีม */
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 1;
    border: 1px solid #eee;
    /* ขอบสีอ่อน */
}

/* ชื่อหัวข้อ */
.section-title {
    font-family: 'Fraunces', serif;
    font-size: 24px;
    color: #634444;
    /* สีตัวอักษรน้ำตาลเข้ม */
    text-align: center;
    margin-bottom: 20px;
}

/* กล่องของฟอร์ม */
.form-group {
    margin-bottom: 15px;
}

/* ตัวอักษรสำหรับ label */
.label-font {
    font-weight: bold;
    font-size: 18px;
    font-family: 'Fraunces', serif;
    color: #634444;
}

/* ช่องใส่ข้อมูล */
input[type='date'],
input[type='file'],
input[type='number'] {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-family: 'Fraunces', serif;
    color: #634444;
}

/* การจัดวางตัวเลือกวิธีการชำระเงิน */
.payment-method {
    display: flex;
    gap: 10px;
    margin-top: 5px;
    justify-content: center;
}

.payment-method label {
    font-family: 'Fraunces', serif;
    color: #634444;
    font-size: 16px;
}

/* ส่วนของรายละเอียดการชำระเงิน */
.payment-details {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f1f1f1;
}

/* รายการธนาคาร */
.bank-list {
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
}

/* รายการของแต่ละธนาคาร */
.bank-item {
    padding: 8px 0;
    border-bottom: 1px solid #ddd;
}

/* ชื่อธนาคารและชื่อผู้ถือบัญชี */
.bank-name,
.account-holder {
    font-family: 'Fraunces', serif;
    color: #634444;
}

/* การจัดตำแหน่งของ QR Code */
.qr-code {
    text-align: center;
}

/* ปุ่มยืนยันการชำระเงิน */
.confirm-btn {
    width: 100%;
    padding: 10px;
    background-color: #634444;
    color: #fff8f0;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    font-family: 'Fraunces', serif;
    cursor: pointer;
    margin-top: 15px;
    box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.2);
}

.confirm-btn:hover {
    background-color: #4d3333;
    /* สีโทนน้ำตาลเข้มขึ้นเมื่อ hover */
}
</style>
