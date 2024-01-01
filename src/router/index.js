// Importation des composants nécessaires de vue-router et des composants Vue pour les routes
import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import UserSignup from "../views/UserSignup.vue";
import UserLogin from "../views/UserLogin.vue";
import MainBoard from "../views/MainBoard.vue";
import UserProfile from "../components/UserProfile.vue";
import AdminComponent from "../components/AdminComponent.vue";
import DeleteUser from "../components/DeleteUser.vue";
import AllPosts from "../components/AllPosts.vue";
import OnePost from "../components/OnePost.vue";

// Configuration des routes
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "login",
    component: UserLogin,
  },
  {
    path: "/signup",
    name: "signup",
    component: UserSignup,
  },
  {
    path: "/mainboard/:userId",
    name: "mainboard",
    component: MainBoard,
  },
  {
    path: "/userprofile",
    name: "userprofile",
    component: UserProfile,
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminComponent,
  },
  {
    path: "/delete_user",
    name: "delete_user",
    component: DeleteUser,
  },
  {
    path: "/allposts",
    name: "allposts",
    component: AllPosts,
  },
  {
    path: "/onepost/:id",
    name: "onepost",
    component: OnePost,
  },
];

// Création de l'instance de VueRouter avec l'historique du navigateur
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Exportation de l'instance de router pour utilisation dans l'application Vue
export default router;
