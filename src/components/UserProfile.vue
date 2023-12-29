<template>
  <div class="userlogged-container">
    <MainHeader />
    <div v-if="!userLogged">
      <p>Accès non autorisé</p>
    </div>
    <div class="userlogged-msg" v-else>
      <span
        >Vous êtes connecté en tant que <b>{{ userLogged.username }}</b></span
      >
      <!-- Emplacement pour l'image de profil -->
      <div class="userlogged-msg_img">
        <img :src="userLogged.imgProfile" alt="Photo de profil" />
      </div>

      <!-- Formulaire unifié pour la mise à jour du nom d'utilisateur et de la photo de profil -->
      <form @submit.prevent="updateUserProfile" class="userlogged-msg_form">
        <div class="field">
          <label for="newUsername" class="label"
            >Nouveau nom d'utilisateur</label
          >
          <div class="control">
            <input
              class="input"
              type="text"
              v-model="newUsername"
              id="newUsername"
              placeholder="Entrez votre nouveau nom d'utilisateur"
            />
          </div>
        </div>

        <!-- Emplacement pour charger la photo de profil -->
        <div class="field">
          <label for="profilePic" class="label">Photo de profil</label>
          <div class="control">
            <input type="file" id="profilePic" @change="onFileChange" />
            <div id="fileNameDisplay"></div>
          </div>
        </div>

        <div class="field">
          <div class="control">
            <button class="button is-info">Mettre à jour</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import MainHeader from "@/components/MainHeader.vue";
import store from "../modules/store.json";
import { useStorage } from "@vueuse/core";

export default {
  components: {
    MainHeader,
  },
  setup() {
    const userLogged = ref({
      username: "",
      imgProfile: "",
    });
    const userToken = useStorage("user-token", null, sessionStorage);
    const userId = useStorage("user-id", null, sessionStorage);
    const newUsername = ref(""); // Nouveau nom d'utilisateur
    const selectedFile = ref(null); // Nouvelle donnée réactive pour le fichier sélectionné

    // Méthode pour afficher les informations de l'utilisateur connecté
    const displayUserLogged = async () => {
      console.log("user-id:", userId.value);
      if (!userId.value) {
        console.error("ID utilisateur non disponible");
        return;
      }

      try {
        const response = await axios.get(
          `${store.api_host}/user/${userId.value}`,
          {
            headers: {
              Authorization: `Bearer ${userToken.value}`,
            },
          }
        );

        if (response.status === 200) {
          userLogged.value.username = response.data.username;
          console.log(
            "Nom d'utilisateur enregistré:",
            userLogged.value.username
          );
        } else {
          console.error(
            "Erreur lors de la récupération des informations de l'utilisateur"
          );
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des informations de l'utilisateur:",
          error
        );
      }
    };

    const onFileChange = (e) => {
      selectedFile.value = e.target.files[0];
    };

    // Méthode pour la mise à jour du nom d'utilisateur et de la photo de profil
    const updateUserProfile = async () => {
      const formData = new FormData();
      if (newUsername.value) {
        formData.append("username", newUsername.value);
      }
      if (selectedFile.value) {
        formData.append("image", selectedFile.value);
      }

      try {
        const response = await axios.put(
          `${store.api_host}/user/update/${userId.value}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${userToken.value}`,
            },
          }
        );

        if (response.status === 200) {
          console.log("Profil mis à jour avec succès");
          if (newUsername.value) {
            userLogged.value.username = newUsername.value;
          }
          if (response.data.imgProfileUrl) {
            userLogged.value.imgProfile = response.data.imgProfileUrl;
            sessionStorage.setItem(
              "imgProfileUrl",
              userLogged.value.imgProfile
            );
          }
        } else {
          console.error("Erreur lors de la mise à jour du profil");
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour du profil:", error);
      }
    };

    onMounted(async () => {
      await displayUserLogged();

      // Récupérer l'image de profil depuis sessionStorage
      const savedImgProfileUrl = sessionStorage.getItem("imgProfileUrl");
      if (savedImgProfileUrl) {
        userLogged.value.imgProfile = savedImgProfileUrl;
      }
    });

    return {
      userLogged,
      displayUserLogged,
      newUsername,
      updateUserProfile,
      onFileChange,
    };
  },
};
</script>

<style scoped lang="scss">
@import "../styles/variables.scss";
.userlogged-container {
  background: $background;
  min-height: 100vh;
}
.userlogged-msg {
  background: $main-color;
  margin: 1rem;
  padding: 2rem;
  border: 1px solid #ccc;
  color: #ccc;
  & img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-top: 30px;
  }
}
.field {
  margin-bottom: 10px;
  color: #ccc;
}

.label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.userlogged-msg {
  margin: 1rem;
  padding: 2rem;
  border: 1px solid #ccc;
  color: #ccc;
  & img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-top: 30px;
  }
}
.field {
  margin-bottom: 10px;
  color: #ccc;
}

.label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.control input[type="file"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.button {
  margin-top: 10px;
}
</style>
