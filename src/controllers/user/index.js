import db from "../../models/index.js";

const { User } = db;

export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, pushToken, activated, role } =
      req.body;

    const existingEmail = await User.findOne({ where: { email } });

    if (existingEmail) {
      return res.status(400).json({
        message: "Já existe um usuário com esse email.",
      });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      pushToken,
      activated,
      role,
      avatar: "",
    });

    res.status(201).json({
      message: "Usuário criado com sucesso.",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao tentar cadastrar o usuário",
      error: error.message,
    });
  }
};
