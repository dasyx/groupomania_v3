<template>
  <div>
    <form @submit.prevent="logValid" class="form">
      <h1 class="title is-2">Connexion</h1>

      <!-- Affichage des Erreurs de Connexion -->
      <div v-if="loginError" class="notification is-danger">
        {{ loginError }}
      </div>

      <div class="field">
        <label for="email" class="label">Adresse électronique</label>
        <div class="control has-icons-left has-icons-right">
          <input
            class="input"
            type="email"
            v-model="userForm.email"
            id="email"
            name="email"
            placeholder="Veuillez saisir votre adresse email"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>
      </div>

      <div class="field">
        <label for="password" class="label">Mot de passe</label>
        <div class="control has-icons-left">
          <input
            class="input"
            type="password"
            v-model="userForm.password"
            id="password"
            name="password"
            placeholder="Veuillez saisir votre mot de passe"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-key"></i>
          </span>
        </div>
      </div>

      <div class="field is-grouped is-grouped-centered">
        <div class="control">
          <button class="button is-link">Soumettre</button>
        </div>
        <div class="control">
          <a href="/" class="button high_contrast">Annuler</a>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import store from "../modules/store.json";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { required, email, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

export default {
  setup() {
    const userForm = ref({
      email: "",
      password: "",
    });
    const submitted = ref(false);
    const loginError = ref(null);
    const router = useRouter();

    const rules = {
      email: { required, email },
      password: { required, minLength: minLength(8) },
    };

    const v$ = useVuelidate(rules, userForm);

    const logValid = async () => {
      submitted.value = true;
      v$.value.$touch();
      if (!v$.value.$invalid) {
        try {
          const response = await axios.post(
            store.api_host + "/user/login/",
            userForm.value
          );
          if (response.status === 200) {
            sessionStorage.setItem("user-token", response.data.token);
            sessionStorage.setItem("user-id", response.data.userId);
            sessionStorage.setItem("user-admin", response.data.userAdmin);

            // Stockage de l'URL de l'image de profil dans sessionStorage
            if (response.data.imgProfileUrl) {
              sessionStorage.setItem(
                "imgProfileUrl",
                response.data.imgProfileUrl
              );
            }

            router.push("/mainboard");
          }
        } catch (error) {
          console.error("Erreur lors de la connexion:", error);
          loginError.value = "Erreur lors de la connexion. Veuillez réessayer.";
        }
      }
    };

    return { userForm, submitted, logValid, v$, loginError };
  },
};
</script>
