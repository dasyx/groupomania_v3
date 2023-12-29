import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    societyName: "Groupomania",
    messageContent: null, // Ajouté pour stocker les messages récupérés
  },
  mutations: {
    // Mutation pour mettre à jour messageContent
    SET_MESSAGE_CONTENT(state, messages) {
      state.messageContent = messages;
    },
    // Autres mutations au besoin
  },
  actions: {
    // Actions pour la validation d'email
    emailValidInput(context, email) {
      const mailRegex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
      return mailRegex.test(email);
    },
    // Actions pour la validation de nom d'utilisateur
    usernameValidInput(context, name) {
      const nameRegex = /^[^=*'<>{}0-9]{3,}$/;
      return nameRegex.test(name);
    },
    // Action pour charger le tableau de bord
    async dashboardLoading({ commit }) {
      try {
        const response = await axios({
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("user-token"),
          },
          method: "get",
          url: "https://localhost:3000/api/post/",
        });
        console.log("Bienvenue sur le forum !");
        commit("SET_MESSAGE_CONTENT", response.data);
      } catch (error) {
        console.error(error);
      }
    },
    // Autres actions au besoin
  },
  modules: {
    // Modules si nécessaire
  },
});
