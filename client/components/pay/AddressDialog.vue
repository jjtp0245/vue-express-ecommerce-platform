<template>
    <!-- Dialog แสดงที่อยู่ -->
    <v-dialog v-model="dialog" max-width="600px" persistent>
        <v-card class="custom-card">
            <!-- หัวข้อ dialog -->
            <v-card-title class="dialog-title">
                <span class="headline">{{ isAdding ? 'Add New Address' : 'Select Your Address' }}</span>
                <v-spacer></v-spacer>
                <v-btn v-if="!isAdding" color="brown" rounded class="new-address-btn" @click="openAddDialog">
                    + New
                </v-btn>
                <v-btn icon class="dialog-close-btn" @click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <!-- แสดงรายการที่อยู่หรือฟอร์มเพิ่มที่อยู่ใหม่ -->
            <v-card-text v-if="!isAdding" class="address-list">
                <v-radio-group v-model="selectedAddress" class="address-group">
                    <v-row v-for="(address, index) in addressList" :key="index" class="address-item-row">
                        <v-col>
                            <v-card flat outlined class="address-item">
                                <v-radio :label="address.recipient_name" :value="address"
                                    class="address-radio"></v-radio>
                                <div class="address-content">
                                    <p>{{ address.address }}</p>
                                    <p>{{ address.sub_district }}, {{ address.district }}, {{ address.province }} {{
                                        address.postcode }}</p>
                                    <p>phone : {{ address.telephone }}</p>
                                </div>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-radio-group>
            </v-card-text>

            <!-- ฟอร์มเพิ่มที่อยู่ใหม่ -->
            <v-card-text v-else class="add-address-form">
                <v-form ref="addressForm" v-model="newAddressFormValid">
                    <v-text-field label="Recipient's Name" v-model="newAddress.recipientName" required
                        class="input-field"></v-text-field>
                    <v-text-field label="Address" v-model="newAddress.address" required
                        class="input-field"></v-text-field>
                    <v-text-field label="Telephone" v-model="newAddress.telephone" required
                        class="input-field"></v-text-field>

                    <v-row>
                        <v-col>
                            <v-autocomplete v-model="newAddress.province" :items="provinces" label="Province"
                                @change="onProvinceChange" class="input-field" item-text="name_th"
                                item-value="name_th"></v-autocomplete>
                        </v-col>
                        <v-col>
                            <v-autocomplete v-model="newAddress.district" :items="amphures" label="District"
                                @change="onDistrictChange" class="input-field" item-text="name_th"
                                item-value="name_th"></v-autocomplete>
                        </v-col>
                        <v-col>
                            <v-autocomplete v-model="newAddress.subDistrict" :items="tambons" label="Sub-District"
                                class="input-field" item-text="name_th" item-value="name_th"
                                @change="updatePostcode"></v-autocomplete>
                        </v-col>
                    </v-row>

                    <v-text-field label="Postcode" v-model="newAddress.postcode" required class="input-field"
                        autocomplete="off"></v-text-field>
                </v-form>
            </v-card-text>

            <!-- ปุ่มยืนยันและยกเลิก -->
            <v-card-actions>
                <v-btn v-if="isAdding" color="brown" class="confirm-btn" @click="saveAddress">Save</v-btn>
                <v-btn v-else color="brown" class="confirm-btn" @click="confirmSelection">Confirm</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            dialog: true, // เปิด dialog ทันทีเมื่อ component แสดง
            addressList: [], // รายการที่อยู่
            selectedAddress: null, // ที่อยู่ที่ถูกเลือก
            userId: null, // user ID ที่ดึงจาก localStorage
            isAdding: false, // สถานะสำหรับสลับระหว่างการแสดงรายการที่อยู่และฟอร์มเพิ่มที่อยู่
            newAddress: {
                recipientName: '',
                address: '',
                telephone: '',
                province: '',
                district: '',
                subDistrict: '',
                postcode: '',
            },
            newAddressFormValid: false,
            provinces: [],
            amphures: [],
            tambons: [],
        };
    },
    async created() {
        // ดึง user_id จาก localStorage แล้วโหลดที่อยู่
        this.userId = localStorage.getItem('user_id');
        if (this.userId) {
            await this.fetchAddresses();
        }
        await this.fetchProvinces();
    },
    methods: {
        async fetchAddresses() {
            try {
                const response = await axios.get(`http://localhost:8000/address?user_id=${this.userId}`);
                this.addressList = response.data.result;
            } catch (error) {
                console.error('Error fetching addresses:', error);
            }
        },
        async fetchProvinces() {
            try {
                const response = await axios.get('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json');
                this.provinces = response.data.map(province => ({
                    ...province,
                    name_th: province.name_th
                }));
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        },
        onProvinceChange() {
            const selectedProvince = this.provinces.find(province => province.name_th === this.newAddress.province);
            this.amphures = selectedProvince ? selectedProvince.amphure : [];
            this.newAddress.district = '';
            this.tambons = [];
            this.newAddress.subDistrict = '';
            this.newAddress.postcode = '';
        },
        onDistrictChange() {
            const selectedAmphure = this.amphures.find(amphure => amphure.name_th === this.newAddress.district);
            this.tambons = selectedAmphure ? selectedAmphure.tambon : [];
            this.newAddress.subDistrict = '';
            this.newAddress.postcode = '';
        },
        updatePostcode() {
            const selectedTambon = this.tambons.find(tambon => tambon.name_th === this.newAddress.subDistrict);
            this.newAddress.postcode = selectedTambon ? selectedTambon.zip_code : '';
        },
        openAddDialog() {
            this.isAdding = true;
        },
        closeDialog() {
            this.dialog = false;
            this.$emit('close');
        },
        cancelAdd() {
            this.isAdding = false;
        },
        async saveAddress() {
            if (!this.userId) {
                console.error('User is not logged in');
                return;
            }

            if (!this.newAddress.recipientName || !this.newAddress.address || !this.newAddress.telephone) {
                console.error('Please fill in all required fields.');
                return;
            }

            const newAddressData = {
                recipient_name: this.newAddress.recipientName,
                address: this.newAddress.address,
                telephone: this.newAddress.telephone,
                sub_district: this.newAddress.subDistrict,
                district: this.newAddress.district,
                province: this.newAddress.province,
                postcode: this.newAddress.postcode,
                user_id: this.userId,
            };

            try {
                await axios.post('http://localhost:8000/address/add', newAddressData);
                this.isAdding = false;
                this.resetNewAddress();
                await this.fetchAddresses();
            } catch (error) {
                console.error('Error saving address:', error);
            }
        },
        resetNewAddress() {
            this.newAddress = {
                recipientName: '',
                address: '',
                telephone: '',
                province: '',
                district: '',
                subDistrict: '',
                postcode: '',
            };
        },
        confirmSelection() {
            if (this.selectedAddress) {
                this.$emit('select-address', this.selectedAddress);
                this.closeDialog();
            }
        },
    },
};
</script>

<style scoped>
.custom-card {
    background-color: #f9f3e9;
    padding: 20px;
    border-radius: 10px;
}

.dialog-title {
    font-size: 20px;
    font-family: 'Fraunces', serif;
    color: #634444;
}

.new-address-btn {
    background-color: #8c5a33;
    color: #fff;
    padding: 5px 15px;
    font-family: 'Fraunces', serif;
    border-radius: 8px;
}

.dialog-close-btn {
    color: #634444;
}

.address-list {
    padding: 10px;
}

.address-item-row {
    margin-bottom: 10px;
}

.address-item {
    background-color: #FFFCE7;
    border: 1px solid #d1bda5;
    border-radius: 8px;
    padding: 15px;
}

.address-radio {
    margin-bottom: 10px;
}

.address-content {
    font-size: 14px;
    color: #634444;
}

.confirm-btn,
.cancel-btn {
    color: #fff;
    border-radius: 5px;
}

.confirm-btn {
    background-color: #8c5a33;
    margin-right: 10px;
}

.cancel-btn {
    background-color: #634444;
}

.add-address-form {
    padding-top: 10px;
}

.input-field {
    background-color: #f0eae1;
    border-radius: 5px;
    padding: 10px;
}
</style>
