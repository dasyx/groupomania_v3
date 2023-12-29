<template>
  <header class="navbar" role="navigation" aria-label="main navigation">
    <!-- affichage du logo -->
    <nav class="navbar-brand">
      <router-link to="/">
        <img
          src="../../public/logos/icon-left-font-monochrome-white.svg"
          alt="groupomania-logo"
        />
        <h1>Forum - page principale</h1>
      </router-link>
    </nav>

    <!-- Affichage des liens du Header si utilisateur admin-->
    <Sidebar class="navbar-menu" v-if="state.userAdmin === 1">
      <ul class="navbar-end">
        <li class="navbar-item">
          <router-link to="/userprofile">Mon profil</router-link>
        </li>
        <li class="navbar-item">
          <router-link to="/admin">Espace administrateur </router-link>
        </li>
        <li class="navbar-item">
          <router-link to="/delete_user" v-if="state.userLogged"
            >Supprimer le compte
          </router-link>
        </li>
        <li class="navbar-item">
          <a href="#" @click="logOut()" v-if="state.userLogged"
            ><i class="fas fa-sign-out-alt"></i>Déconnexion
          </a>
        </li>
      </ul>
    </Sidebar>

    <!-- Affichage des liens du Header si utilisateur non admin-->
    <Sidebar class="navbar-menu" v-if="state.userAdmin === 0">
      <ul class="navbar-end">
        <li class="navbar-item">
          <router-link to="/userprofile">Mon profil</router-link>
        </li>
        <li class="navbar-item">
          <router-link to="/delete_user" v-if="state.userLogged"
            >Supprimer le compte
          </router-link>
        </li>
        <li class="navbar-item">
          <a href="#" @click="logOut()" v-if="state.userLogged"
            ><i class="fas fa-sign-out-alt"></i>Déconnexion
          </a>
        </li>
      </ul>
    </Sidebar>
    <Burger class="display_lowres"></Burger>
  </header>
</template>

<script>
import { reactive, onMounted } from "vue";
import Burger from "./Menu/BurgerMenu.vue";
import Sidebar from "./Menu/SidebarMenu.vue";

export default {
  name: "MainHeader",
  components: {
    Burger,
    Sidebar,
  },
  props: {
    userInfos: {
      type: String,
    },
  },
  setup() {
    const state = reactive({
      userLogged: null,
      userAdmin: null,
    });

    onMounted(() => {
      state.userLogged = sessionStorage.getItem("user-id");
      state.userAdmin = sessionStorage.getItem("user-admin") === "1" ? 1 : 0;
    });

    const logOut = () => {
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = "/login";
    };

    return { state, logOut };
  },
};
</script>
