import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";

import router from "./routes/index.js";
import db from "./models/index.js"; // Caminho até seu index.js do Sequelize

import { fileURLToPath } from "url";
import { dirname } from "path";

// Resolver __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis do .env
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Configuração das rotas
app.use("/", router);

app.use("/public", express.static(path.join(__dirname, "../public")));

// Middlewares

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
