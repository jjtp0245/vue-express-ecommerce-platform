<template>
    <v-col class="auth-container">
        <v-row justify="center" align="center" class="auth-row">
            <v-col cols="12" sm="8" md="4">
                <v-card class="auth-card">
                    <v-card-title class="auth-title">
                        <v-tabs v-model="tab" background-color="transparent" class="auth-tabs">
                            <v-tab @click="toggleLogin">Login</v-tab>
                            <v-tab @click="toggleRegister">Register</v-tab>
                        </v-tabs>
                    </v-card-title>
                    <v-card-text>
                        <client-only>
                            <validation-observer ref="observer" v-slot="{ handleSubmit }">
                                <v-form @submit.prevent="handleSubmit(onSubmit)">

                                    <!-- ฟอร์ม Login -->
                                    <div v-if="!isRegister">
                                        <v-row>
                                            <v-col md="12">
                                                <validation-provider v-slot="{ errors }" rules="required" name="Email">
                                                    <v-text-field v-model="email" label="Email" required outlined
                                                        :error-messages="errors" />
                                                </validation-provider>
                                            </v-col>
                                        </v-row>

                                        <v-row>
                                            <v-col md="12">
                                                <validation-provider v-slot="{ errors }" rules="required"
                                                    name="Password">
                                                    <v-text-field v-model="password" label="Password" type="password"
                                                        required outlined :error-messages="errors" />
                                                </validation-provider>
                                            </v-col>
                                        </v-row>

                                        <v-btn type="submit" color="brown" class="auth-button">Login</v-btn>
                                        <div class="forgot-password">
                                            <v-btn text @click="forgotPassword">Forgot Password?</v-btn>
                                        </div>
                                    </div>

                                    <!-- ฟอร์ม Register -->
                                    <div v-else>
                                        <v-text-field v-model="username" label="Username"
                                            :error-messages="errors.username" required></v-text-field>
                                        <v-text-field v-model="email" label="Email" :error-messages="errors.email"
                                            required></v-text-field>
                                        <v-text-field v-model="password" label="Password" type="password"
                                            :error-messages="errors.password" required></v-text-field>
                                        <v-text-field v-model="confirmPassword" label="Confirm Password" type="password"
                                            :error-messages="errors.confirmPassword" required></v-text-field>
                                        <v-btn type="submit" color="brown" class="auth-button">Register</v-btn>
                                    </div>
                                    <v-alert v-if="errorMessage" type="error" dismissible>
                                        {{ errorMessage }}
                                    </v-alert>
                                </v-form>
                            </validation-observer>
                        </client-only>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-col>
</template>

<script>
import * as yup from "yup";

export default {
    data() {
        return {
            email: '',
            password: '',
            username: '',
            confirmPassword: '',
            tab: null,
            isRegister: false,
            errorMessage: null,
            errors: {},
        };
    },
    methods: {
        async onSubmit() {
            if (this.isRegister) {
                await this.submitRegister();
            } else {
                await this.login();
            }
        },
        async login() {
            try {
                if (this.email === 'admin' && this.password === 'admin') {
                    localStorage.setItem('isAdmin', 'true');
                    localStorage.setItem('token', 'your_admin_token'); // กำหนด token สำหรับ admin
                    this.$router.push('/admin/home'); // เปลี่ยนเส้นทางไปยัง /admin/home
                } else {
                    const response = await this.$axios.post('http://localhost:8000/user/login', {
                        email: this.email,
                        password: this.password,
                    });
                    if (response.data.status === "success" && response.data.result.length > 0) {
                        const userData = response.data.result[0];
                        localStorage.setItem('user_id', userData.user_id);
                        localStorage.setItem('userEmail', userData.email);
                        localStorage.setItem('token', response.data.token);
                        localStorage.setItem('isAdmin', 'false');
                        this.$router.push('/'); // เปลี่ยนเส้นทางไปยังหน้าเริ่มต้น
                    } else {
                        this.errorMessage = "Email or Password is incorrect";
                    }
                }
            } catch (error) {
                console.error(error);
                this.errorMessage = "An error occurred during login. Please try again.";
            }
        },
        async submitRegister() {
            const schema = yup.object().shape({
                username: yup.string().required("Username is required"),
                email: yup.string().email("Invalid email").required("Email is required"),
                password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters long"),
                confirmPassword: yup.string().oneOf([this.password], "Passwords do not match").required("Confirm password is required"),
            });

            try {
                // ตรวจสอบข้อมูลก่อนส่ง
                await schema.validate({
                    username: this.username,
                    email: this.email,
                    password: this.password,
                    confirmPassword: this.confirmPassword,
                }, { abortEarly: false });

                // ส่งข้อมูลในรูปแบบ JSON
                const response = await this.$axios.post('http://localhost:8000/user/register', {
                    username: this.username,
                    email: this.email,
                    password: this.password,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.status === 400 && response.data.message === 'Email already exists') {
                    this.errorMessage = "อีเมลนี้ถูกใช้งานแล้ว ลืมรหัสผ่านใช่หรือไม่ กรุณาคลิกที่ ลืมรหัสผ่าน";
                } else if (response.status === 200 && response.data.code === 1) {
                    this.resetForm();
                    this.errorMessage = null;
                    this.errors = {};

                    // เปลี่ยนไปที่หน้า Login
                    this.isRegister = false;
                    this.tab = 0;
                }
            } catch (err) {
                console.error("Registration error: ", err);
                this.errors = {};
                if (err.inner) {
                    err.inner.forEach(error => {
                        this.errors[error.path] = error.message;
                    });
                } else {
                    this.errorMessage = "An error occurred during registration. Please try again.";
                }
            }
        },

        resetForm() {
            this.username = '';
            this.email = '';
            this.password = '';
            this.confirmPassword = '';
        },
        onFileChange(e) {
            const file = e.target.files[0];
            this.profileImage = file;
        },
        forgotPassword() {
            this.$router.push({ path: "/newpassword" });
        },
        toggleLogin() {
            this.isRegister = false;
        },
        toggleRegister() {
            this.isRegister = true;
        },
    },
};
</script>

<style scoped>
.auth-container {
    min-height: 100vh;
}

.auth-row {
    margin-top: 100px;
}

.auth-card {
    padding: 20px;
    border-radius: 15px;
}

.auth-title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: #634444;
}

.auth-tabs {
    justify-content: center;
}

.auth-button {
    width: 100%;
    background-color: #634444;
    color: white;
}

.forgot-password {
    text-align: center;
    margin-top: 10px;
}
</style>