require("dotenv").config();
const express = require("express");
const cors = require("cors");

const db = require("./models"); // Caminho até seu index.js do Sequelize

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Sincronizar o banco (cria as tabelas, se não existirem)
db.sequelize
  .sync({ alter: true }) // ou { force: true } se quiser recriar tudo
  .then(() => {
    console.log("🛠️ Banco de dados sincronizado com sucesso!");

    // Porta do servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erro ao sincronizar o banco:", err);
  });
