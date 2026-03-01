<template>
  <v-col class="forgot-password-container">
    <v-row justify="center" align="center" class="forgot-password-row">
      <v-col cols="12" sm="8" md="4">
        <v-card class="forgot-password-card">
          <v-card-title class="forgot-password-title">
            <h3>Forgot Password</h3>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="submitForgotPassword">
              <v-text-field v-model="email" label="Enter your email" :error-messages="errors.email"
                required></v-text-field>
              <v-text-field v-model="newPassword" label="New Password" type="password" :error-messages="errors.password"
                required></v-text-field>
              <v-text-field v-model="confirmPassword" label="Confirm Password" type="password"
                :error-messages="errors.confirmPassword" required></v-text-field>
              <v-btn type="submit" color="brown" class="forgot-password-button">Confirm</v-btn>
              <v-alert v-if="successMessage" type="success" dismissible>
                {{ successMessage }}
              </v-alert>
              <v-alert v-if="errorMessage" type="error" dismissible>
                {{ errorMessage }}
              </v-alert>
            </v-form>
            <div class="login-link">
              <v-btn text @click="goToLogin">Back to Login</v-btn>
            </div>
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
      email: "",
      newPassword: "",
      confirmPassword: "",
      successMessage: null,
      errorMessage: null,
      errors: {}
    };
  },
  methods: {
    async submitForgotPassword() {
      // Validate form
      const schema = yup.object().shape({
        email: yup.string().email("Invalid email").required("Email is required"),
        newPassword: yup.string().required("Password is required").min(6, "Password must be at least 6 characters long"),
        confirmPassword: yup.string().oneOf([this.newPassword], "Passwords do not match").required("Confirm password is required")
      });

      try {
        // Validate form data
        await schema.validate({
          email: this.email,
          newPassword: this.newPassword,
          confirmPassword: this.confirmPassword
        }, { abortEarly: false });

        // Send request to backend to update the password
        const response = await this.$axios.put('http://localhost:8000/user/update', {
          email: this.email,
          newPassword: this.newPassword
        });

        if (response.status === 200 && response.data.code === 1) {
          this.successMessage = "Password updated successfully!";
          this.errorMessage = null;

          setTimeout(() => {
            this.$router.push("/login");
          }, 500); // รอ 0.5 วินาทีก่อน redirect
        } else if (response.status === 400 && response.data.message === "This email is not registered") {
          this.errorMessage = "This email is not registered. Please check your email.";
        } else {
          this.errorMessage = response.data.message || "Failed to update password";
        }
      } catch (err) {
        this.errors = {};
        if (err.inner) {
          err.inner.forEach(error => {
            this.errors[error.path] = error.message;
          });
        } else {
          this.errorMessage = "An error occurred. Please try again.";
        }
      }
    },
    goToLogin() {
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
.forgot-password-container {
  min-height: 100vh;
}

.forgot-password-row {
  margin-top: 100px;
}

.forgot-password-card {
  padding: 20px;
  border-radius: 15px;
}

.forgot-password-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #634444;
}

.forgot-password-button {
  width: 100%;
  background-color: #634444;
  color: white;
}

.login-link {
  text-align: center;
  margin-top: 10px;
}
</style>
