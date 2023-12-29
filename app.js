const express = require("express");
//const helmet = require("helmet");
const path = require("path");
const serveStatic = require("serve-static");

require("dotenv").config();

// Application Express :
const app = express();

app.use(serveStatic(__dirname + "/dist"));

// Catch all routes and lead them to the dist index.html
app.get("*", function (req, res) {
  res.sendFile(__dirname + "/dist/index.html");
});

// Utilisation du package CORS pour une gestion simplifiée des CORS
// En environnement de production, spécifiez les origines autorisées pour plus de sécurité
const cors = require("cors");

// Configure CORS

// Liste des origines autorisées
/* const whitelistRegex =
  /^https:\/\/groupomania-test-[a-zA-Z0-9]+-dasyx\.vercel\.app$/;

const corsOptions = {
  origin: function (origin, callback) {
    // Vérifier si l'origine est dans la whitelist ou est localhost
    if (
      !origin ||
      whitelistRegex.test(origin) ||
      origin === "http://localhost:3000"
    ) {
      callback(null, true); // Autoriser
    } else {
      callback(new Error("Not allowed by CORS")); // Rejeter
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions)); */

// Utilisation du package CORS pour une gestion simplifiée des CORS
app.use(cors());

// MODIFIER SI UTILISATION EN LOCAL
/* app.use(
  cors({
    origin: "http://localhost:8080",
  })
); */
// Utilisation d'Helmet pour sécuriser les en-têtes HTTP
// Attention : quand je l'utilise, mes images ne s'affichent plus dans le frontend
//app.use(helmet());

// Sécurisation des en-têtes HTTP
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' *.vercel.app http://localhost:3000; "
  );
  next();
});

// Utilisation du package Express pour traiter les données JSON et les données de formulaire
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Optionnel : Limiter la taille des requêtes pour prévenir les attaques DDOS
// app.use(express.json({ limit: '5kb' }));

const db = require("./models");

// Synchronisation avec la base de données
// En production, envisagez une stratégie de migration plutôt que de synchronisation directe
db.sequelize.sync();

// Middleware pour servir les fichiers statiques dans le dossier 'images'
app.use("/images", express.static(path.join(__dirname, "images")));

// Enregistrement des routes
app.use("/api/user", require("./routes/user"));
app.use("/api/post", require("./routes/post"));
app.use("/api/comment", require("./routes/comment"));

module.exports = app;
