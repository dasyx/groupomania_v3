<template>
  <v-app>
    <!-- Encapsulation de votre contenu dans v-app -->
    <v-main class="main-home">
      <!-- Utilisation de v-main pour le contenu principal -->
      <router-view />
    </v-main>
    <footer-component />
    <!-- Ajout du composant de pied de page personnalisé -->
  </v-app>
</template>

<script>
import FooterComponent from "./components/FooterComponent.vue"; // Assurez-vous que le chemin est correct

export default {
  components: {
    FooterComponent, // Enregistrement du composant pour utilisation dans ce template
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #212aac;
    }
  }
}

.main-home {
  background-image: url("../public/img/earth_spaceview.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100%;
}
</style>
