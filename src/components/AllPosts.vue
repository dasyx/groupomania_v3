<template>
  <div class="post_container">
    <div class="dashboard-Items" v-for="post in posts" :key="post.id">
      <router-link
        :to="{ name: 'onepost', params: { id: post.id } }"
        class="underline-disable"
      >
        <div class="post post_link">
          <div class="post_name">
            <i class="fas fa-user-circle"></i>
            <p>{{ post.users?.username ?? "Utilisateur inconnu" }}</p>
          </div>
          <div class="post_main">
            <p>{{ post.title }}</p>
            <p>{{ post.content }}</p>
            <img :src="post.imgFile" alt="Image du post" v-if="post.imgFile" />
          </div>
        </div>
      </router-link>
    </div>
    <div v-if="loadingMore">Chargement...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import store from "../modules/store.json";

const posts = ref([]);
const totalPosts = ref(0);
let loadingMore = ref(false);

// Fonction pour récupérer les posts
const fetchPosts = async () => {
  if (totalPosts.value >= 50) return;
  loadingMore.value = true;

  try {
    const response = await axios.get(`${store.api_localhost}/posts/allposts`);
    if (response.status === 200 || response.status === 304) {
      console.log("Réponse de l'API:", response);
      if (Array.isArray(response.data)) {
        // Assurer que la réponse est un tableau
        posts.value = [...posts.value, ...response.data];
        totalPosts.value += response.data.length;
      } else {
        console.error("Format de réponse inattendu:", response.data);
      }
    } else {
      console.error("Erreur lors de la récupération des posts:", response);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des posts:", error);
  } finally {
    loadingMore.value = false; // S'assurer que le flag de chargement est réinitialisé
  }
};

onMounted(() => {
  fetchPosts(); // Appel initial pour charger les posts
});
</script>
