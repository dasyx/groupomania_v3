<template>
  <div>
    <!-- Conteneur pour les commentaires -->
    <div class="post_comments">
      <div class="post_comments_title">
        <i class="far fa-comment-alt"></i>
        <p>Commentaires</p>
      </div>
      <div class="post_comments_list">
        <!-- affichage du commentaire -->
        <div
          v-for="comment in commentsProp"
          :key="comment.id"
          class="post_comment"
        >
          <!-- affichage du nom de l'utilisateur -->
          <div class="post_comment_name">
            <i class="fas fa-user-circle"></i>
            <p>
              {{ comment.User ? comment.User.username : "Utilisateur inconnu" }}
            </p>
          </div>
          <div class="post_comment-text-container">
            <p class="post_comment_content">{{ comment.content }}</p>

            <!-- affichage du bouton de suppression du commentaire -->
            <button
              v-if="comment.UserId === userLoggedId"
              @click="deleteComment(comment.id)"
            >
              <Icon icon="ph:dots-three" width="32" height="32" />
              <v-tooltip activator="parent" location="bottom"
                >Supprimer le commentaire</v-tooltip
              >
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- ... formulaire et autres éléments ... -->
    <form @submit.prevent="sendNewComment" class="comment-form">
      <v-textarea
        clearable
        label="Ajoutez un commentaire"
        variant="outlined"
        v-model="comment"
        placeholder="écrivez quelquechose..."
        class="post_comment_input"
      ></v-textarea>
      <button type="submit" class="submit-icon">
        <Icon icon="wpf:paperplane" />
        <v-tooltip activator="parent" location="start">envoyer</v-tooltip>
      </button>
      <p v-if="msgError">{{ msgError }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import store from "../modules/store.json";

import { Icon } from "@iconify/vue";

// Définir une prop pour les commentaires
const props = defineProps({
  postId: Number,
  commentsProp: Array, // Prop pour recevoir les commentaires
  userLoggedId: Number,
});

const emit = defineEmits(["comment-added", "comment-deleted"]);

const comment = ref("");
const msgError = ref("");

// fonction pour envoyer un nouveau commentaire
const sendNewComment = async () => {
  let textRegex = /^[^=*<>{}]+$/;
  msgError.value = "";
  let error;

  if (comment.value === "" || comment.value == null) {
    error = "Vous devez écrire quelque chose !";
  } else if (!textRegex.test(comment.value)) {
    error = "Les caractères suivants sont interdits: = * < > { }";
  }

  if (!error) {
    try {
      const response = await axios.post(
        `${store.api_host}/comment/new/`,
        {
          UserId: sessionStorage.getItem("user-id"),
          content: comment.value,
          PostId: props.postId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("user-token"),
          },
        }
      );

      if (response.status === 201) {
        comment.value = "";
        emit("comment-added", response.data);
      } else {
        throw new Error("Erreur lors de l’envoi du commentaire");
      }
    } catch (error) {
      msgError.value = error.response?.data?.error || error.message;
    }
  } else {
    msgError.value = error;
  }
};

// fonction pour supprimer un commentaire
const deleteComment = async (commentId) => {
  try {
    await axios.delete(`${store.api_host}/comment/${commentId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("user-token"),
      },
    });
    emit("comment-deleted", commentId);
  } catch (error) {
    console.error("Erreur lors de la suppression du commentaire:", error);
  }
};
</script>

<style scoped>
.comment-form {
  position: relative;
}

.submit-icon {
  position: absolute;
  right: 20px;
  bottom: 30px;
  background: none;
  border: none;
}

.submit-icon i {
  color: #000;
}

.post_comment-text-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
