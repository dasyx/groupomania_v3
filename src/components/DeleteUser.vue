<template>
  <div>
    <MainHeader />
    <div v-if="!userLogged">
      <p>Acces non authorisé</p>
    </div>
    <form v-else class="form form_display">
      <h2 class="title is-2">Supprimer mon compte</h2>
      <div class="field">
        <label for="mail" class="label">Adresse email</label>
        <input
          id="mail"
          class="input"
          type="email"
          v-model="email"
          placeholder="Entrez l'adresse email de votre compte"
        />
      </div>
      <div class="field">
        <label for="password" class="label">Mot de passe</label>
        <input
          id="password"
          class="input"
          type="password"
          v-model="password"
          placeholder="Mot de passe actuel"
        />
      </div>
      <button class="delete-btn" @click.prevent="confirmUserDelete">
        Confirmation de suppression
      </button>
      <p id="delete_alert">{{ msgError }}</p>
      <ConfirmDialogue ref="confirmDialogue" />
    </form>
    <!-- Retour vers mainboard  -->
    <button class="button is-link">
      <a href="http://localhost:8080/groupomania/#/mainboard">
        <i class="far fa-arrow-alt-circle-left backlink_icon"
          >Page précédente</i
        >
      </a>
    </button>
  </div>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import store from "../modules/store.json";
import ConfirmDialogue from "./Modal_Button/ConfirmDialogue.vue";
import MainHeader from "./MainHeader.vue";

export default {
  components: {
    MainHeader,
    ConfirmDialogue,
  },
  name: "DeleteUser",
  setup() {
    const userToken = ref(sessionStorage.getItem("user-token"));
    const userId = ref(sessionStorage.getItem("user-id"));
    const userAdmin = ref(sessionStorage.getItem("user-admin") === "1");
    const confirmDialogue = ref(null);
    const router = useRouter();

    const email = ref("");
    const password = ref("");
    const msgError = ref("");

    const userLogged = ref(userId.value !== null);

    const confirmUserDelete = async () => {
      console.log("Ouverture du dialogue de confirmation");
      const ok = await confirmDialogue.value.show({
        title: "Suppression du compte",
        message:
          "Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible !",
        okButton: "Supprimer définitivement",
      });
      console.log("Choix de l'utilisateur:", ok);
      if (ok) {
        try {
          console.log("Envoi de la requête de suppression");
          // Assurez-vous que 'email' et 'password' sont correctement définis
          const payload = {
            email: email.value, // Supposons que 'email' est lié à un champ de formulaire
            password: password.value, // De même pour 'password'
          };

          await axios.delete(`${store.api_host}/user/delete`, {
            data: payload,
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("user-token")}`,
            },
          });

          // Actions après la suppression réussie
          sessionStorage.clear();
          router.push("/login"); // Redirigez vers la page de connexion ou une autre page appropriée
        } catch (error) {
          console.error("Erreur lors de la suppression du compte:", error);
        }
      }
    };

    return {
      email,
      password,
      userLogged,
      msgError,
      confirmUserDelete,
      confirmDialogue,
      userToken,
      userId,
      userAdmin,
    };
  },
};
</script>
