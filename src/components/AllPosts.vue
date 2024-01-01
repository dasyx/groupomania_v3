<template>
  <div class="post_container">
    <!-- Section pour afficher tous les posts -->
    <div class="dashboard-Items" v-for="post in posts" :key="post.id">
      <router-link
        :to="{ name: 'onepost', params: { id: post.id } }"
        class="underline-disable"
      >
        <div class="post post_link">
          <div class="post_name">
            <i class="fas fa-user-circle"></i>
            <p>
              {{ post.users.username ? post.username : "Utilisateur inconnu" }}
            </p>
          </div>
          <div class="post_main">
            <p>{{ post.title }}</p>
            <p>{{ post.content }}</p>
            <img :src="post.imgFile" alt="Image du post" v-if="post.imgFile" />
          </div>
        </div>
      </router-link>
    </div>
    <!-- Message ou loader si plus de posts sont en cours de chargement -->
    <div v-if="loadingMore">Chargement...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import store from "../modules/store.json";

const posts = ref([]);
const totalPosts = ref(0);
//const limit = 2; // Nombre de posts à charger à la fois
let loadingMore = ref(false);

// Fonction pour récupérer les posts
const fetchPosts = async () => {
  if (totalPosts.value >= 50) return; // Arrêter le chargement si 50 posts sont atteints
  loadingMore.value = true;

  try {
    const response = await axios.get(`${store.api_localhost}/posts/allposts`);
    posts.value = response.data;
    if (response.status === 200 || response.status === 304) {
      console.log("Réponse de l'API:", response);
      // Vérifier si la réponse est un tableau
      posts.value = [...posts.value, ...response.data];
      totalPosts.value += response.data.length;
    } else {
      console.error("Erreur lors de la récupération des posts:");
    }
    /* if (Array.isArray(response.data)) {
      // Vérifier si la réponse est un tableau
      posts.value = [...posts.value, ...response.data];
      totalPosts.value += response.data.length;
    } else {
      console.error("Format de réponse inattendu:", response.data);
    } */
  } catch (error) {
    console.error("Erreur lors de la récupération des posts:", error);
  }
};

// Fonction pour détecter le défilement et charger plus de posts
/* const handleScroll = () => {
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = window.scrollY;
  const isNearBottom = scrollableHeight - scrolled < 5; // 5px avant le bas

  // Charger plus de posts si l'utilisateur est proche du bas de la page
  if (isNearBottom && !loadingMore.value && totalPosts.value < 50) {
    fetchPosts();
  }
}; */

// Ajouter un écouteur d'événement pour le défilement
onMounted(() => {
  //window.addEventListener("scroll", handleScroll);
  fetchPosts();
});

// Supprimer l'écouteur d'événement pour le défilement
/* onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
}); */
</script>
