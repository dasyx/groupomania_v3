<template>
  <div>
    <MainHeader />
    <!-- Message d'accès non authorisé -->
    <div v-if="allUsers.length < 1" class="unauthorizedMessage">
      <p>Acces non authorisé</p>
    </div>

    <!-- Page administrateur -->
    <div class="adminPage" v-if="allUsers.length > 1">
      <section class="users-list">
        <!-- Utilisateurs -->
        <h2 class="users-list_heading">Liste des utilisateurs</h2>
        <ul>
          <!-- liste des utilisateurs-->
          <li
            v-for="users in allUsers"
            :key="users.id"
            class="users-list_items"
          >
            <p class="users-list_name">{{ users.username }}</p>
            <!-- Lien récentes publications utilisateurs-->
            <a href="#/admin" @click="displayUserPosts(users.id)">
              <i class="fas fa-file-alt"></i>Publications
            </a>
            <!-- Lien pour afficher les commentaires utilisateurs-->
            <a href="#/admin" @click="displayUserComments(users.id)">
              <i class="fas fa-comment-alt"></i>Commentaires
            </a>
            <!-- Lien pour supprimer un utilisateur-->
            <button
              href="#/admin"
              @click="userDelete(users.id)"
              class="users-list_delete-link"
            >
              Supprimer l'utilisateur
            </button>
          </li>
          <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
        </ul>
      </section>

      <!-- Publications des utilisateurs -->
      <section class="users-content">
        <!-- Liste des posts -->
        <div class="users-posts" v-if="posts">
          <h2 class="users-posts_title">Dernières publications</h2>
          <p v-if="posts.length < 1">Aucune publication</p>
          <ul>
            <li v-for="post in posts" :key="post.id" class="users-posts_items">
              <p class="users-posts_id">
                posté le {{ post.updatedAt.slice(0, 10) }}
              </p>
              <p>Titre : {{ post.title }}</p>
              <p>Contenu : {{ post.content }}</p>
              <p class="users-posts_image">
                <img
                  v-if="post.imgFile"
                  :src="post.imgFile"
                  alt="image-illustration"
                />
              </p>
              <button
                href="#/admin"
                @click="postDelete(post.id, post.UserId)"
                class="users-posts_delete-link"
              >
                Supprimer
              </button>
            </li>
          </ul>
        </div>

        <!-- Partie commentaires -->
        <div class="users-comments" v-if="comments">
          <h2 class="users-comments_title">Derniers commentaires</h2>
          <p v-if="comments.length < 1">Aucun commentaire</p>
          <ul v-else>
            <li
              v-for="comment in comments"
              :key="comment.id"
              class="users-comments_items"
            >
              <p class="users-comments_id">
                Posté le {{ comment.updatedAt.slice(0, 10) }}
              </p>
              <p>Contenu : {{ comment.content }}</p>
              <p>
                <button
                  href="#/admin"
                  class="users-comments_delete-link"
                  @click="commentDelete(comment.id, comment.UserId)"
                >
                  supprimer
                </button>
              </p>
            </li>
            <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
          </ul>
        </div>
      </section>
    </div>
    <!-- Retour vers dashboard  -->
    <button class="button is-link">
      <a href="http://localhost:8080/groupomania/#/mainboard" class="backlink">
        <i class="far fa-arrow-alt-circle-left backlink_icon"
          >Page précédente</i
        >
      </a>
    </button>
  </div>
</template>

<script>
const axios = require("axios");
import store from "../modules/store.json";
import ConfirmDialogue from "./Modal_Button/ConfirmDialogue.vue";
import MainHeader from "./MainHeader.vue";

export default {
  name: "AdminComponent",
  components: {
    MainHeader,
    ConfirmDialogue,
  },
  data() {
    return {
      allUsers: [],
      userComment: [],
      posts: "",
      comments: "",
    };
  },
  methods: {
    //Récupere la liste de tous les utilisateurs
    displayAllUsers() {
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("user-token"),
        },
      };
      axios
        .get(store.api_host + "/user/", options)
        .then((response) => {
          this.allUsers = response.data;
        })
        .catch((error) => console.log(error));
    },
    //Récupère toutes les publications d'un utilisateur.
    displayUserPosts(id) {
      axios({
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("user-token"),
        },
        method: "GET",
        url: store.api_host + "/post/user/" + id,
      })
        .then((response) => {
          this.posts = response.data;
        })
        .catch((error) => console.log(error));
    },
    //récupère tous les commentaires d'un utilisateur.
    displayUserComments(id) {
      axios({
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("user-token"),
        },
        method: "GET",
        url: store.api_host + "/comment/user/" + id,
      })
        .then((response) => {
          this.comments = response.data;
          this.posts = "";
        })
        .catch((error) => console.log(error));
    },

    //Fonction pour supprimer un utilisateur
    userDelete(id) {
      if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
        axios({
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("user-token"),
          },
          method: "delete",
          url: store.api_host + "/user/delete/" + id,
        })
          .then(() => {
            this.$router.go();
          })
          .catch((error) => console.log(error));
      }
    },
    //Fonction pour supprimer un post
    async postDelete(id) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Suppression d'une publication",
        message:
          "Voulez-vous vraiment supprimer cette publication ?  Vous ne pourrez pas revenir en arrière !",
        okButton: "Supprimer définitivement",
      });
      if (ok) {
        axios({
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("user-token"),
          },
          method: "delete",
          url: store.api_host + "/post/admin/" + id,
        })
          .then(() => {
            this.$router.go();
          })
          .catch((error) => console.log(error));
      }
    },
    //Fonction pour supprimer un commentaire
    async commentDelete(id) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Suppression d'un commentaire",
        message:
          "Voulez-vous vraiment supprimer ce commentaire ?  Vous ne pourrez pas revenir en arrière !",
        _okButton: "Supprimer définitivement",
        get okButton() {
          return this._okButton;
        },
        set okButton(value) {
          this._okButton = value;
        },
      });
      if (ok) {
        axios({
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("user-token"),
          },
          method: "delete",
          url: store.api_host + "/comment/admin/" + id,
        })
          .then(() => {
            this.$router.go();
          })
          .catch((error) => console.log(error));
      }
    },
  },
  mounted() {
    this.displayAllUsers();
    this.displayUserPosts();
    this.displayUserComments();
  },
};
</script>

<style scoped></style>
