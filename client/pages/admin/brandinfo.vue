<template>
    <v-container>
        <v-col cols="12" class="text-center1">
            <span class="text-title">Brands</span>
            <v-btn class="custom-btn" @click="dialog = true">Add +</v-btn>
        </v-col>
        <v-card class="table">
            <!-- Data Table -->
            <v-data-table :headers="headers" :items="brands" class="custom-data-table" item-key="brandId">
                <!-- Actions -->
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn color="red" @click="deleteBrand(item.brandId)">DELETE</v-btn>
                </template>
            </v-data-table>
        </v-card>

        <!-- Add Brand Dialog -->
        <v-dialog v-model="dialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">New Brand</span>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text>
                    <v-text-field label="Brand Name" v-model="newBrandName"></v-text-field>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="custom-button" @click="addBrand">Add</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Snackbar for Success Message -->
        <v-snackbar v-model="snackbar" timeout="3000" color="white" class="top-snackbar" absolute top>
            <span style="color: black;">Add Brand Successfully!</span>
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
            dialog: false,
            snackbar: false,
            newBrandName: '',
            headers: [
                { text: 'ID', align: 'start', value: 'brandId' },
                { text: 'Brand Name', value: 'brand_name' },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            brands: [],
        };
    },
    created() {
        this.fetchBrands();
    },
    methods: {
        async fetchBrands() {
            try {
                const response = await axios.get(`http://localhost:8000/brand`);
                // Map brand_id to brandId for compatibility with camelCase standard
                this.brands = response.data.result.map(brand => ({
                    ...brand,
                    brandId: brand.brand_id, // map brand_id to brandId
                    brand_name: brand.brand_name
                }));
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        },
        async addBrand() {
            if (this.newBrandName.trim()) {
                try {
                    await axios.post(`http://localhost:8000/brand/add`, { brand_name: this.newBrandName });
                    this.fetchBrands(); // Refresh the list
                    this.newBrandName = '';
                    this.dialog = false;
                    this.snackbar = true; // Show snackbar when added successfully
                } catch (error) {
                    console.error('Error adding brand:', error);
                }
            }
        },
        async deleteBrand(brandId) {
    try {
        const response = await axios.delete(`http://localhost:8000/brand/delete/${brandId}`);
        if (response.data.status === 'success') {
            alert(response.data.message);
            this.fetchBrands(); // Refresh the list after deletion
        }
    } catch (error) {
        console.error('Error deleting brand:', error);
        alert('Failed to delete brand. Please try again.');
    }
}
,
    },
};
</script>

<style scoped>
.headline {
    color: #666;
}

.table {
    margin-top: 50px;
}

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

.text-title {
    font-size: 52px;
    color: #6E6767;
    margin-bottom: 20px;
    font-weight: bold;
}

.text-center1 {
    margin-top: 7%;
}

.custom-btn {
    font-size: 18px !important;
    color: #fff !important;
    padding: 20px 30px !important;
    background-color: #545454 !important;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    margin-left: 80%;
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

.custom-button {
    border: 2px solid;
    background: #484848;
    border-radius: 4px;
    padding: 10px 20px;
}

.custom-button:hover {
    background-color: rgba(63, 81, 181, 0.1);
}
</style>
