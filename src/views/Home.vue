<template>
  <div class="home">
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            <img
              src="../../public/logos/logo-only.svg"
              alt="logo groupomania"
              class="resize_logo"
            />
            {{ societyName }}
          </h1>
          <h2 class="subtitle">Entre nous, c'est entre vous...</h2>
          <div class="flex is-centered home_display">
            <div class="button-block">
              <button v-on:click="goToSignup" class="button is-xl is-dark">
                Inscrivez-vous
              </button>
            </div>
            <div class="button-block">
              <button v-on:click="goToLogin" class="button is-xl is-dark">
                Se connecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Composant dynamique pour afficher UserSignup ou UserLogin -->
    <div class="component-container">
      <component :is="currentComponent"></component>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import UserSignup from "./UserSignup.vue"; // Assurez-vous que le chemin est correct
import UserLogin from "./UserLogin.vue"; // Assurez-vous que le chemin est correct

export default {
  name: "HomePage",
  components: {
    UserSignup,
    UserLogin,
  },
  data() {
    return {
      currentComponent: null,
    };
  },
  computed: {
    ...mapState({
      societyName: "societyName",
    }),
  },
  methods: {
    goToSignup() {
      this.currentComponent = "UserSignup";
    },
    goToLogin() {
      this.currentComponent = "UserLogin";
    },
  },
};
</script>

<style lang="scss" scoped></style>
