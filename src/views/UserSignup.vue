<template>
  <form @submit.prevent="handleSubmit" class="form">
    <h1 class="title is-2">Inscription</h1>

    <!-- Champ Nom d'utilisateur -->
    <div class="field">
      <label for="name" class="label">Nom</label>
      <div class="control has-icons-left">
        <input
          class="input"
          type="text"
          v-model="userForm.username"
          id="name"
          name="name"
          placeholder="Veuillez saisir votre nom d'utilisateur"
          @input="() => checkInput('username')"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
        <span class="icon is-small is-right">
          <i class="valid_input fas fa-check" v-if="usernameInputValid"></i>
          <i class="wrong_input fas fa-times" v-else></i>
        </span>
      </div>
      <!-- gestion de l'affichage d'un message d'erreur lors de la soumussions du formulaire -->
      <div class="error_msg" v-if="submitted && v$.username.$error">
        <span v-if="!userForm.username.required">
          <i class="fas fa-exclamation-triangle"
            ><em>Le champ nom est requis</em></i
          >
        </span>
        <span v-if="v$.username.minLength">
          <i class="fas fa-exclamation-triangle"
            ><em
              >Le nom d'utilisateur doit contenir au moins 3 caractères</em
            ></i
          >
        </span>
      </div>
    </div>

    <!-- Champ Mot de passe -->
    <div class="field">
      <label for="password" class="label">Mot de passe</label>
      <div class="control has-icons-left">
        <input
          class="input"
          type="password"
          v-model="userForm.password"
          id="password"
          name="password"
          placeholder="Veuillez créer votre mot de passe"
          @input="() => checkInput('password')"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-key"></i>
        </span>
        <span class="icon is-small is-right">
          <i class="valid_input fas fa-check" v-if="passwordInputValid"></i>
          <i class="wrong_input fas fa-times" v-else></i>
        </span>
      </div>
      <!-- gestion de l'affichage d'un message d'erreur lors de la soumussions du formulaire -->
      <div class="error_msg" v-if="submitted && v$.password.$error">
        <span v-if="!userForm.password.required"
          ><i class="fas fa-exclamation-triangle"
            >La saisie du mot de passe est obligatoire</i
          ></span
        >
        <span v-if="v$.password.minLength">
          <i class="fas fa-exclamation-triangle"
            ><em>Le mot de passe doit contenir au moins 8 caractères</em></i
          >
        </span>
      </div>
    </div>

    <!-- Champ Email -->
    <div class="field">
      <label for="email" class="label">Adresse électronique</label>
      <div class="control has-icons-left has-icons-right">
        <input
          class="input"
          type="email"
          v-model="userForm.email"
          v-on:input="emailValidInput"
          id="email"
          name="email"
          placeholder="Veuillez saisir votre adresse email"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>
        <span class="icon is-small is-right">
          <i class="fas fa-check" id="validMail"></i>
          <i class="fas fa-times" id="wrongMail"></i>
        </span>
      </div>
      <!-- gestion de l'affichage d'un message d'erreur lors de la soumussions du formulaire -->
      <div v-if="submitted && userForm.email.$error" class="mail_Warning">
        <span v-if="!userForm.email.required"
          ><i class="fas fa-exclamation-triangle"
            >Le champ email est requis</i
          ></span
        >
        <span v-if="!userForm.email.email"
          ><i class="fas fa-exclamation-triangle"
            >Veuillez renseigner une adresse email valide !</i
          ></span
        >
      </div>
    </div>

    <!-- Boutons Soumettre et Annuler -->
    <div class="field flex is-centered">
      <div class="control">
        <button class="button is-link">Soumettre</button>
      </div>
      <div class="control">
        <button class="button high_contrast">
          <a href="/">Annuler</a>
        </button>
      </div>
    </div>

    <!-- Lien vers la connexion -->
    <div class="already-signed">
      <p>
        Déjà inscrit ?
        <router-link :to="{ name: 'login' }">Se connecter</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import store from "../modules/store.json";
import { useStorage } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, email } from "@vuelidate/validators";

export default {
  setup() {
    const router = useRouter();

    const userForm = ref({
      username: "",
      email: "",
      password: "",
    });

    const userToken = useStorage("user-token", null, sessionStorage);
    const userId = useStorage("user-id", null, sessionStorage);
    const userAdmin = useStorage("user-admin", null, sessionStorage);

    const submitted = ref(false);
    const usernameInputValid = ref(false);
    const passwordInputValid = ref(false);

    const checkUsernameInput = () => {
      usernameInputValid.value = userForm.value.username.length >= 3;
    };

    const checkPasswordInput = () => {
      passwordInputValid.value = userForm.value.password.length >= 8;
    };

    const checkInput = (field) => {
      if (field === "username") {
        checkUsernameInput();
      } else if (field === "password") {
        checkPasswordInput();
      }
    };

    const rules = {
      username: { required, minLength: minLength(3) },
      email: { required, email },
      password: { required, minLength: minLength(8) },
    };

    const v$ = useVuelidate(rules, userForm);

    const handleSubmit = async () => {
      submitted.value = true;
      v$.value.$touch();

      if (!v$.value.$invalid) {
        axios
          .post(store.api_host + "/user/signup/", {
            username: userForm.value.username,
            email: userForm.value.email,
            password: userForm.value.password,
          })
          .then((response) => {
            if (response.status === 200 || response.status === 201) {
              userToken.value = response.data.token;
              userId.value = response.data.userId;
              userAdmin.value = response.data.isAdmin;

              console.log(
                "Informations de l'utilisateur enregistrées dans le stockage de session:"
              );
              console.log("user-token:", userToken.value);
              console.log("user-id :", userId.value);
              console.log("user-admin:", userAdmin.value);

              router.push("/mainboard");
            } else {
              console.error("Erreur d'envoi de formulaire");
            }
          })
          .catch((error) => {
            console.error("Erreur lors de la soumission du formulaire:", error);
          });
      } else {
        console.log("Échec de la validation");
      }
    };

    return {
      userForm,
      submitted,
      handleSubmit,
      v$,
      checkInput,
      usernameInputValid,
      passwordInputValid,
    };
  },
};
</script>

<style>
/* Votre CSS ici */
.error_msg {
  color: red;
  margin-top: 5px;
}
.valid_input {
  color: green;
}
.wrong_input {
  color: red;
}
</style>
