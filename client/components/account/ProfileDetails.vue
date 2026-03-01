<template>
    <v-card flat class="profile-section">
        <v-row>
            <v-col md="8" class="profile-bg">
                <v-card-title class="profile-title">My Profile</v-card-title>
                <v-card-text class="form-container">
                    <v-form v-if="isEditing" @submit.prevent="saveProfile" ref="profileForm">
                        <v-text-field v-model="username" label="Name" required outlined
                            class="small-text-field"></v-text-field>
                        <v-text-field v-model="email" label="Email" required type="email" outlined
                            class="small-text-field"></v-text-field>
                        <v-text-field v-model="phone_number" label="Phone Number" required type="tel" outlined
                            class="small-text-field"></v-text-field>
                        <v-btn type="submit" color="brown" class="save-btn" rounded>Save</v-btn>
                    </v-form>

                    <div v-else>
                        <p class="text"><strong>Name:</strong> {{ savedProfile.username }}</p>
                        <p class="text"><strong>Email:</strong> {{ savedProfile.email }}</p>
                        <p class="text"><strong>Phone Number:</strong> {{ savedProfile.phone_number }}</p>
                        <v-btn class="edit-btn" color="brown" @click="editProfile" rounded>Edit</v-btn>
                    </div>
                </v-card-text>
            </v-col>

            <v-col md="4" class="avatar-container">
                <v-card class="avatar-card">
                    <div class="avatar-preview">
                        <img v-if="avatar" :src="avatar" alt="Avatar" class="avatar-img" />
                        <v-icon v-else class="avatar-icon">mdi-account-circle</v-icon>
                    </div>
                    <v-btn v-if="isEditing" color="brown" class="avatar-btn" @click="triggerFileInput">Select
                        Avatar</v-btn>
                    <input ref="fileInput" type="file" accept="image/*" style="display: none;"
                        @change="onFileSelected" />
                </v-card>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            username: '',
            email: '',
            phone_number: '',
            avatar: null,
            avatarFile: null,
            isEditing: false,
            savedProfile: {
                username: '',
                email: '',
                phone_number: '',
                profile_image: ''
            }
        };
    },
    async created() {
        if (process.client) {
            const loggedInEmail = localStorage.getItem('userEmail');
            if (loggedInEmail) {
                await this.fetchUserProfile(loggedInEmail);
            }
        }
    },
    methods: {
        async fetchUserProfile(email) {
            try {
                const token = localStorage.getItem('token');
                const response = await this.$axios.get(`http://localhost:8000/user/profile/${email}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.status === 'success') {
                    const userData = response.data.data;
                    this.savedProfile.username = userData.username;
                    this.savedProfile.email = userData.email;
                    this.savedProfile.phone_number = userData.phone_number;
                    this.avatar = userData.profile_image
                        ? `http://localhost:8000${userData.profile_image}`
                        : 'http://localhost:8000/uploads/default-profile.jpg';
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        },
        editProfile() {
            this.isEditing = true;
            this.username = this.savedProfile.username;
            this.email = this.savedProfile.email;
            this.phone_number = this.savedProfile.phone_number;
        },
        async saveProfile() {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('username', this.username);
            formData.append('email', this.email);
            formData.append('phone_number', this.phone_number);

            if (this.avatarFile) {
                formData.append('avatar', this.avatarFile);
            }

            try {
                const response = await this.$axios.put(`http://localhost:8000/user/profile/update/${this.savedProfile.email}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if (response && response.data) {
                    console.log('Success response:', response.data);

                    if (response.data.status === 'success') {
                        this.savedProfile.username = this.username;
                        this.savedProfile.email = this.email;
                        this.savedProfile.phone_number = this.phone_number;

                        if (this.avatarFile) {
                            this.avatar = `http://localhost:8000${response.data.profile_image}`;  // อัปเดต URL รูปภาพใหม่
                        }

                        this.isEditing = false;
                        this.$toast.success('Profile updated successfully');
                    } else {
                        console.error('Failed to update profile:', response.data.message);
                    }
                } else {
                    console.error('Error: No valid response or response data found');
                }

            } catch (error) {
                if (error.response) {
                    console.error('Error updating profile:', error.response.data ? error.response.data.message : error.message);
                    console.log('Error response:', error.response.data);
                } else {
                    console.error('Error updating profile (no response):', error.message);
                }
            }
        },
        onFileSelected(event) {
            const file = event.target.files[0];
            if (file) {
                this.avatarFile = file;
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.avatar = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
    }
};
</script>

<style scoped>
.v-card {
    margin-top: 50px;
}

.profile-section {
    max-width: 100%;
    height: 550px;
    margin-top: 20px;
    padding-left: 30px;
}

.profile-bg {
    width: 100%;
    background-color: #fffce7;
    border-radius: 10px;
    border: 1px solid #634444;
    padding: 10px;
}

.profile-title {
    font-size: 28px;
    font-weight: bold;
    font-family: 'Fraunces', serif;
    color: #5a3f2f;
}

.small-text-field {
    margin-bottom: 10px;
}

.text {
    font-family: 'Fraunces', serif;
    font-size: 20px;
    color: #5a3f2f;
}

.save-btn {
    margin-top: 12px;
    font-family: 'Fraunces', serif;
    color: #fffce7;
    font-size: 14px;
    border-radius: 8px;
}

.edit-btn {
    margin-top: 12px;
    font-family: 'Fraunces', serif;
    color: #fffce7;
    font-size: 14px;
    border-radius: 8px;
}

.avatar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 0;
}

.avatar-card {
    border-radius: 10px;
    padding: 16px;
    margin-top: 20px;
}

.avatar-preview {
    text-align: center;
    margin-bottom: 16px;
}

.avatar-img {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 50%;
}

.avatar-icon {
    width: 150px;
    height: 150px;
    font-size: 150px;
    color: #5a3f2f;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.avatar-btn {
    font-size: 14px;
    font-weight: 500;
    font-family: 'Fraunces', serif;
    color: #fffce7;
}
</style>
