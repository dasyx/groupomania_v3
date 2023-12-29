<template>
  <div>
    <button v-on:click="isHidden = false" class="button is-link">
      Créer une nouvelle publication
    </button>

    <!-- Formulaire pour créer un nouveau post -->
    <transition name="fade">
      <form v-if="!isHidden" class="new-post_form">
        <a
          href="#"
          class="new-post_close-button"
          v-on:click.prevent="isHidden = true"
          >×</a
        >
        <label for="title" class="new-post_form-label">Titre</label>
        <input
          id="title"
          class="new-post_form-input"
          type="text"
          v-model="title"
          placeholder="Votre titre ..."
        />
        <label for="message" class="new-post_form-label">Message</label>
        <input
          id="message"
          class="new-post_form-input"
          type="text"
          v-model="content"
          placeholder="Votre message ..."
        />
        <label for="image" class="new-post_form-label">Image</label>
        <input
          id="Image"
          class="new-post_form-file"
          type="file"
          @change="onFileSelected"
          placeholder="upload image"
        />
        <!-- Envoi de formulaire -->
        <button class="new-post_form-button" v-on:click="sendNewContent">
          Envoyer
        </button>
        <p id="alert">{{ msgError }}</p>
      </form>
    </transition>
  </div>
</template>

<script>
const axios = require("axios");
import store from "../modules/store.json";
import { ref } from "vue";

const userLogged = ref(false);

export default {
  name: "NewPost",
  data() {
    return {
      isHidden: true,
      title: "",
      content: "",
      msgError: "",
      selectedFile: "", // Ajouté si nécessaire
    };
  },

  props: {
    imgFile: {
      type: String,
    },
  },
  methods: {
    // Empeche l'affichage du formulaire de nouveau post si utilisateur non connecté
    userLogged() {
      if (sessionStorage.getItem("user-token")) {
        userLogged.value = true;
      }
    },

    //Choix de l'image
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
    },
    //Envoi du formulaire
    sendNewContent(e) {
      let textRegex = /^[^=*<>{}]+$/;
      this.msgError = "";
      let error;
      e.preventDefault();

      //test input title
      if (this.title === "" || this.title == null) {
        error = "Titre requis";
      } else if (this.title.length < 3) {
        error = "Un minimum de 3 caractères est requis";
      } else if (!textRegex.test(this.title)) {
        error = "Les caractères suivants sont interdits: = * < > { }";
      }

      //test input content
      if (this.content === "" || this.content == null) {
        error = "Contenu requis";
      } else if (this.content.length < 3) {
        error = "Un minimum de 3 caractères est requis";
      } else if (!textRegex.test(this.content)) {
        error = "Les caractères suivants sont interdits: = * < > { }";
      }

      //si pas d'erreur, envoi du formulaire
      if (error) {
        this.msgError = error;
      } else {
        //test si image upload, si image, l'ajoute à postData
        const postData = new FormData();
        if (this.selectedFile !== undefined) {
          postData.append("image", this.selectedFile);
        }
        postData.append("title", this.title);
        postData.append("content", this.content);
        postData.append("UserId", sessionStorage.getItem("user-id"));
        console.log(...postData);

        //requete
        axios({
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + sessionStorage.getItem("user-token"),
          },
          method: "post",
          url: store.api_host + "/post/newpost/",
          data: postData,
        })
          .then((response) => {
            console.log(response);
            //this.dashboardLoading();
            if (response.status === 201) {
              document.location.reload();
              return response;
            } else {
              throw (error = response);
            }
          })
          .catch((error) => {
            console.log(error);
            this.msgError = error.response.data.error;
          });
      }
    },
  },
  mounted() {
    this.userLogged();
  },
};
</script>
