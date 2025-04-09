import db from "../../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { AuthTokens, User } = db;

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({
        message: "Email nao encontrado na base de dados.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Senha incorreta.",
      });
    }

    if (!user.activated) {
      return res.status(403).json({
        message: "Usuário inativo.",
      });
    }

    const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const existingToken = await AuthTokens.findOne({
      where: { userId: user.id },
    });

    if (existingToken) {
      await AuthTokens.update({ token }, { where: { userId: user.id } });
    } else {
      await AuthTokens.create({
        userId: user.id,
        token,
      });
    }

    res.status(200).json({
      message: "Login realizado com sucesso.",
      user: user,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao tentar realizar o login.",
      error: error.message,
    });
  }
};
