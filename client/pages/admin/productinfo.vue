<template>
    <v-container>
        <v-card class="all">
            <v-card-title>
                <span class="headline text-title">Products</span>
                <v-spacer></v-spacer>
                <v-btn class="custom-btn" @click="openAddDialog">Add +</v-btn>
            </v-card-title>

            <v-data-table :headers="headers" :items="products" class="table custom-data-table" item-key="product_id">
                <template v-slot:[`item.image`]="{ item }">
                    <v-img :src="item.image_url" max-width="50" max-height="50" />
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon class="action-icon edit-icon" color="green"
                        @click="openEditDialog(item.product_id)">mdi-pencil</v-icon>
                    <v-icon class="action-icon delete-icon" color="red"
                        @click="deleteProduct(item.product_id)">mdi-delete</v-icon>
                </template>

            </v-data-table>
        </v-card>

        <!-- Dialog for Add/Edit Product Form -->
        <v-dialog v-model="dialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ isEditMode ? 'Edit Product' : 'Add New Product' }}</span>
                </v-card-title>

                <v-card-text>
                    <ValidationObserver v-slot="{ }">
                        <v-form ref="form" v-model="valid">
                            <ValidationProvider name="Name" rules="required" v-slot="{ errors }">
                                <v-text-field class="form-text" v-model="newProduct.productName" label="Name"
                                    :error-messages="errors" required>
                                </v-text-field>
                            </ValidationProvider>

                            <ValidationProvider name="Price" rules="required|numeric" v-slot="{ errors }">
                                <v-text-field class="form-text" v-model="newProduct.price" label="Price"
                                    :error-messages="errors" required>
                                </v-text-field>
                            </ValidationProvider>

                            <ValidationProvider name="Description" rules="required" v-slot="{ errors }">
                                <v-textarea class="form-text" v-model="newProduct.description" label="Description"
                                    :error-messages="errors" required>
                                </v-textarea>
                            </ValidationProvider>

                            <ValidationProvider name="Category" rules="required" v-slot="{ errors }">
                                <v-select class="form-text" v-model="newProduct.categoryId" :items="categories"
                                    item-text="name" item-value="id" label="Category" :error-messages="errors" required>
                                </v-select>
                            </ValidationProvider>

                            <ValidationProvider name="Brand" rules="required" v-slot="{ errors }">
                                <v-select class="form-text" v-model="newProduct.brandId" :items="brands"
                                    item-text="name" item-value="id" label="Brand" :error-messages="errors" required>
                                </v-select>
                            </ValidationProvider>

                            <ValidationProvider name="Image URL" rules="required" v-slot="{ errors }">
                                <v-text-field class="form-text" v-model="newProduct.imageUrl" label="Image URL"
                                    :error-messages="errors" required>
                                </v-text-field>
                            </ValidationProvider>
                            <v-img v-if="newProduct.imageUrl" :src="newProduct.imageUrl" max-width="100" class="mb-2" />
                        </v-form>
                    </ValidationObserver>
                </v-card-text>


                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="custom-button" color="white" text @click="closeDialog">Cancel</v-btn>
                    <v-btn class="custom-button" color="white" text @click="saveProduct">{{ isEditMode ? 'Update' :
                        'Add'
                        }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar.show" timeout="3000" color="white" class="top-snackbar" absolute top>
            <span style="color: black;">{{ snackbar.message }}</span>
            <v-btn color="blue" @click="snackbar.show = false">OK</v-btn>
        </v-snackbar>
    </v-container>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            dialog: false,
            valid: true,
            isEditMode: false,
            newProduct: {
                id: null,
                productName: '',
                price: '',
                description: '',
                categoryId: '',
                brandId: '',
                imageUrl: '', // ใช้สำหรับ URL ของภาพ
            },
            categories: [],
            brands: [],
            headers: [
                { text: 'ID', align: 'start', value: 'product_id' },
                { text: 'Name', value: 'product_name' },
                { text: 'Description', value: 'description' },
                { text: 'Price', value: 'price' },
                { text: 'Category', value: 'category_id' },
                { text: 'Image', value: 'image', sortable: false },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            products: [],
            snackbar: {
                show: false,
                message: '',
            },
            rules: {
                required: (value) => !!value || 'Required.',
                numeric: (value) => !isNaN(parseFloat(value)) || 'Must be a number',
            },
        };
    },
    methods: {
        async fetchProducts() {
            try {
                const response = await axios.get('http://localhost:8000/product/');
                this.products = response.data.result;
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        },
        async fetchCategories() {
            try {
                const response = await axios.get('http://localhost:8000/category/');
                this.categories = response.data.result.map(category => ({ id: category.category_id, name: category.category_name }));
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        },
        async fetchBrands() {
            try {
                const response = await axios.get('http://localhost:8000/brand/');
                this.brands = response.data.result.map(brand => ({ id: brand.brand_id, name: brand.brand_name }));
            } catch (error) {
                console.error("Error fetching brands:", error);
            }
        },
        openAddDialog() {
            this.isEditMode = false;
            this.resetForm();
            this.dialog = true;
        },
        openEditDialog(productId) {
            this.isEditMode = true;
            const product = this.products.find(p => p.product_id === productId);
            if (product) {
                this.newProduct = {
                    id: product.product_id,
                    productName: product.product_name,
                    price: product.price,
                    description: product.description,
                    categoryId: product.category_id,
                    brandId: product.brand_id,
                    imageUrl: product.image_url, // ใช้ URL ของภาพ
                };
                this.dialog = true;
            } else {
                console.error("Product not found");
            }
        },
        async saveProduct() {
            if (this.$refs.form.validate()) {
                const { productName, description, price, categoryId, brandId, imageUrl } = this.newProduct;

                const productData = {
                    product_name: productName,
                    description,
                    price,
                    category_id: categoryId,
                    brand_id: brandId,
                    image_url: imageUrl, // ส่ง URL ของภาพ
                };

                const url = this.isEditMode ? `http://localhost:8000/product/update/${this.newProduct.id}` : 'http://localhost:8000/product/add';
                const method = this.isEditMode ? 'put' : 'post';

                try {
                    await axios({ method, url, data: productData });
                    this.snackbar.message = this.isEditMode ? 'Product updated successfully!' : 'Product added successfully!';
                    this.snackbar.show = true;
                    this.fetchProducts();
                    this.closeDialog();
                } catch (error) {
                    console.error("Error saving product:", error);
                }
            }
        },
        closeDialog() {
            this.dialog = false;
            this.resetForm();
        },
        resetForm() {
            this.newProduct = {
                id: null,
                productName: '',
                price: '',
                description: '',
                categoryId: '',
                brandId: '',
                imageUrl: '', // รีเซ็ต URL ของภาพ
            };
        },
        deleteProduct(productId) {
            if (confirm("Do you want to Delete This Product?")) {
                axios.delete(`http://localhost:8000/product/delete/${productId}`)
                    .then(response => {
                        console.log(response.data); // Log ข้อมูลการตอบกลับจาก server
                        this.snackbar.message = 'Product deleted successfully!';
                        this.snackbar.show = true;

                        // ลบสินค้าออกจาก products โดยใช้ filter
                        this.products = this.products.filter(product => product.product_id !== productId);
                    })
                    .catch(error => {
                        console.error("Error deleting product:", error);
                        this.snackbar.message = 'Error deleting product.';
                        this.snackbar.show = true;
                    });
            }
        },
    },
    mounted() {
        this.fetchProducts();
        this.fetchCategories();
        this.fetchBrands();
    },
};
</script>

<style scoped>
.form-text {
    font-size: 16px;
    font-weight: bold;
}

.headline {
    font-size: 20px;
    color: #6E6767;
    margin-bottom: 20px;
    font-weight: bold;
}

.all {
    margin-top: 90px;
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

.custom-btn {
    font-size: 18px !important;
    color: #fff !important;
    padding: 20px 30px !important;
    background-color: #545454 !important;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
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

.v-icon {
    cursor: pointer !important;
    font-size: 30px !important;
}

.custom-button {
    border: 2px solid;
    background: #717171;
    border-radius: 4px;
    padding: 10px 20px;
}

.custom-button:hover {
    background-color: rgba(63, 81, 181, 0.1);
}
</style>
