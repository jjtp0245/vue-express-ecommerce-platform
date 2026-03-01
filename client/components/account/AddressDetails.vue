<template>
    <v-card flat class="address-card address-card-wrapper">
        <!-- ส่วนแสดงที่อยู่ -->
        <v-row justify="space-between" align="center">
            <v-col>
                <v-card-title class="profile-title">My Address</v-card-title>
            </v-col>
            <v-col class="text-right">
                <v-btn color="brown" rounded class="add-btn" @click="openAddDialog">
                    Add
                    <v-icon right>mdi-plus</v-icon>
                </v-btn>
            </v-col>
        </v-row>

        <v-card-text v-if="addressList.length === 0" class="no-address">
            <p>No Address</p>
        </v-card-text>

        <v-card-text v-else>
            <v-row v-for="(address, index) in addressList" :key="index" class="mb-3">
                <v-col>
                    <v-card flat outlined class="address-card-item">
                        <v-row justify="space-between" align="center">
                            <v-col>
                                <v-card-title class="custom-title">
                                    Name: {{ address.recipient_name }}
                                </v-card-title>
                            </v-col>
                            <v-col class="text-right">
                                <v-btn color="grey" text v-if="!address.default" @click="setDefaultAddress(index)">
                                    Set as Default
                                </v-btn>
                                <span v-if="address.default" class="default-label">Default Address</span>
                            </v-col>
                        </v-row>
                        <v-card-subtitle class="custom-subtitle">Phone: {{ address.telephone }}</v-card-subtitle>
                        <v-card-text class="custom-subtitle">
                            Address: {{ address.address }}, {{ address.sub_district }},
                            {{ address.district }}, {{ address.province }}, {{ address.postcode }}
                        </v-card-text>
                        <div v-if="address.default" class="default-badge">DEFAULT</div> <!-- ย้ายตำแหน่งตรงนี้ -->
                        <v-row justify="end" class="icon-row">
                            <v-btn icon color="#FF6439" @click="openEditDialog(index)">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn icon color="#FF6439" @click="deleteAddress(index)">
                                <v-icon>mdi-trash-can</v-icon>
                            </v-btn>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
        </v-card-text>

        <!-- ส่วนฟอร์มเพิ่ม/แก้ไขที่อยู่ -->
        <v-dialog v-model="dialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ isEditingAddress ? 'Edit Address' : 'Add Address' }}</span>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-form ref="addressForm" v-model="newAddressFormValid" class="address-form">
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

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="brown" class="add-btn" @click="saveAddress">{{ isEditingAddress ? 'Update' : 'Create'
                        }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
/*
Created by: kongvut  Sangkla
Updated at: 2023-08-04 22:18
Resource from: https://github.com/kongvut/thai-province-data
*/
import axios from 'axios';

export default {
    data() {
        return {
            addressList: [],
            dialog: false,
            newAddress: {
                recipientName: '',
                address: '',
                telephone: '',
                province: '',
                district: '',
                subDistrict: '',
                postcode: '',
                default: false,
            },
            newAddressFormValid: false,
            isEditingAddress: false,
            editingAddressIndex: null,
            provinces: [],
            amphures: [],
            tambons: [],
            userId: null,
        };
    },
    created() {
        if (process.client) {
            this.userId = this.getLoggedInUserId();
            if (this.userId) {
                this.fetchAddresses();
            }
            this.fetchProvinces();
        }
    },
    methods: {
        getLoggedInUserId() {
            if (typeof window !== 'undefined') {
                return localStorage.getItem('user_id');
            } else {
                console.error('LocalStorage is not available on server-side.');
                return null;
            }
        },

        async fetchAddresses() {
            try {
                const response = await axios.get(`http://localhost:8000/address?user_id=${this.userId}`);
                this.addressList = response.data.result;
            } catch (error) {
                console.error('Error fetching address:', error);
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
            this.resetNewAddress();
            this.isEditingAddress = false;
            this.dialog = true;
        },

        openEditDialog(index) {
            const address = this.addressList[index];
            this.newAddress = {
                recipientName: address.recipient_name,
                address: address.address,
                telephone: address.telephone,
                province: address.province,
                district: address.district,
                subDistrict: address.sub_district,
                postcode: address.postcode,
                default: address.default || false,
            };
            this.isEditingAddress = true;
            this.editingAddressIndex = index;
            this.dialog = true;
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
                default: this.newAddress.default,
            };

            try {
                if (this.isEditingAddress) {
                    await axios.put(`http://localhost:8000/address/update/${this.addressList[this.editingAddressIndex].address_id}`, newAddressData);
                } else {
                    await axios.post('http://localhost:8000/address/add', newAddressData);
                }

                this.dialog = false;
                this.resetNewAddress();
                this.fetchAddresses();
            } catch (error) {
                console.error('Error creating/updating address:', error);
            }
        },

        async deleteAddress(index) {
            const addressId = this.addressList[index].address_id;
            try {
                await axios.delete(`http://localhost:8000/address/delete/${addressId}`);
                this.fetchAddresses();
            } catch (error) {
                console.error('Error deleting address:', error);
            }
        },

        async setDefaultAddress(index) {
            const addressId = this.addressList[index].address_id;

            try {
                await axios.put(`http://localhost:8000/address/set-default`, {
                    address_id: addressId,
                    user_id: this.userId,
                });
                this.fetchAddresses(); // รีเฟรชรายการที่อยู่
            } catch (error) {
                console.error('Error setting default address:', error);
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
                default: false,
            };
            this.isEditingAddress = false;
            this.editingAddressIndex = null;
        },
    },
};
</script>

<style scoped>
.v-card {
    margin-top: 50px;
}

.profile-title {
    font-size: 22px;
    font-weight: bold;
    color: #5a3f2f;
    font-family: 'Fraunces', serif;
}

.no-address p {
    font-size: 16px;
    color: #a9a9a9;
    text-align: center;
    font-family: 'Fraunces', serif;
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
    margin-bottom: -5px;
}

.address-card-item {
    background-color: #FFFCE7;
    border: 1.5px solid #634444;
    border-radius: 10px;
    padding: 16px;
    max-width: 100%;
    min-height: 200px;
    padding-left: 30px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
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

.input-field {
    background-color: #ffc685;
    border-radius: 5px;
    padding: 10px;
    font-family: 'Fraunces', serif;
}

.checkbox-field {
    color: #634444;
    font-family: 'Fraunces', serif;
}

.v-text-field {
    background-color: transparent !important;
}

.v-dialog__content {
    background-color: transparent !important;
}

.default-label,
.default-badge {
    font-weight: normal;
    color: #634444;
    font-size: 16px;
    font-family: 'Fraunces', serif;
}

.default-badge {
    color: green;
    margin-top: 5px;
}

.icon-row {
    position: absolute;
    bottom: 10px;
    right: 10px;
}
</style>
