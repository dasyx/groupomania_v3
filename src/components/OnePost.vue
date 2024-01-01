<template>
  <div class="post_container" v-if="selectedPost">
    <MainHeader />
    <div class="dashboard-Items">
      <div id="post" class="post">
        <div class="post_name">
          <i class="fas fa-user-circle"></i>
          <p>
            {{
              selectedPost.User
                ? selectedPost.User.username
                : "Utilisateur inconnu"
            }}
          </p>
        </div>
        <!-- Conteneur pour le titre, le contenu et l'image du post -->
        <div class="post_main">
          <p id="post_title" class="post_title">{{ selectedPost.title }}</p>
          <p id="post_content" class="post_content">
            {{ selectedPost.content }}
          </p>
          <img
            :src="selectedPost.imgFile"
            alt="Image du post"
            v-if="selectedPost.imgFile"
          />
        </div>
        <CommentItem
          :postId="selectedPost.id"
          :comments-prop="selectedPost.Comments"
          :user-logged-id="userLoggedId ? parseInt(userLoggedId) : 0"
          @comment-added="handleCommentAdded"
          @comment-deleted="handleCommentDeleted"
        />

        <!-- Conteneur pour les boutons -->
        <div class="buttons-container">
          <!-- Bouton Retour -->
          <router-link to="/mainboard" class="underline-disable">
            <button class="back-btn">
              <Icon icon="fontisto:arrow-return-left" color="white" />retour
            </button>
          </router-link>

          <!-- Bouton de suppression du post -->
          <button
            v-if="userLoggedId == selectedPost.UserId"
            @click="confirmPostDelete(selectedPost.id)"
            class="delete-btn"
          >
            supprimer
          </button>
        </div>
      </div>
    </div>
    <!-- Modal de confirmation pour la suppression -->
    <ConfirmDialogue ref="confirmDialogue" />
  </div>
  <div v-else>
    <p>Post non trouvé ou erreur lors du chargement du post.</p>
  </div>
</template>

<script setup>
import CommentItem from "./CommentItem.vue";
import ConfirmDialogue from "./Modal_Button/ConfirmDialogue.vue";
import MainHeader from "@/components/MainHeader.vue";

import { Icon } from "@iconify/vue";

import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import store from "../modules/store.json";
import axios from "axios";

const selectedPost = ref(null);
const confirmDialogue = ref(null);

const router = useRouter();
const route = useRoute();
const postId = route.params.id;

const userLoggedId = sessionStorage.getItem("userId"); // Récupère l'ID de l'utilisateur connecté

// Options pour les requêtes axios
const axiosOptions = {
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + sessionStorage.getItem("userId"),
  },
};

// Fonction pour confirmer et supprimer un post
const handleCommentAdded = (newComment) => {
  // Ajouter le nouveau commentaire à la liste des commentaires
  if (selectedPost.value && selectedPost.value.Comments) {
    selectedPost.value.Comments.push(newComment);
  }
};
const handleCommentDeleted = (commentId) => {
  if (selectedPost.value && selectedPost.value.Comments) {
    selectedPost.value.Comments = selectedPost.value.Comments.filter(
      (comment) => comment.id !== commentId
    );
  }
};

// Obtenir un post par son ID
const getPostById = async (id) => {
  try {
    const response = await axios.get(
      store.api_host + `/posts/${id}`,
      axiosOptions
    );
    selectedPost.value = response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du post:", error);
  }
};

// Fonction pour confirmer et supprimer un post
const confirmPostDelete = async (postId) => {
  const ok = await confirmDialogue.value.show({
    title: "Suppression du post",
    message:
      "Voulez-vous vraiment supprimer cette publication ? Vous ne pourrez pas revenir en arrière !",
    okButton: "Supprimer définitivement",
  });

  if (ok) {
    try {
      await axios.delete(`${store.api_host}/post/${postId}`, axiosOptions);
      router.push("/mainboard"); // Rediriger vers MainBoard après suppression
    } catch (error) {
      console.error("Erreur lors de la suppression du post:", error);
    }
  }
};

onMounted(async () => {
  if (postId) {
    await getPostById(postId);
  }
});
</script>

<style scoped>
.buttons-container[data-v-66e271b4] {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 10px;
}

.back-btn,
.delete-btn {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  /* Autres styles selon vos préférences */
}

/* Styles spécifiques pour le bouton Retour */
.back-btn {
  background-color: blue; /* Couleur de fond */
  color: white; /* Couleur du texte */
  font-size: small;
}
.back-btn:hover {
  background-color: darkblue; /* Couleur de fond au survol */
}
.back-btn .iconify {
  margin-right: 10px;
}

/* Styles spécifiques pour le bouton Supprimer */
.delete-btn {
  background-color: white; /* Couleur de fond */
  color: blue; /* Couleur du texte */
  font-size: x-small;
}
.delete-btn:hover {
  background-color: rgb(134, 134, 185);
  color: azure; /* Couleur de fond au survol */
}
</style>
