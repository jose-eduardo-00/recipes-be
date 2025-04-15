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

export const allUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    res.status(200).json({
      users: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao tentar buscar os usuários.",
      error: error.message,
    });
  }
};

export const editActivatedUser = async (req, res) => {
  try {
    const { activated } = req.body;
    const { id } = req.params;

    const existingUser = await User.findOne({ where: { id } });

    if (!existingUser) {
      return res.status(400).json({
        message: "Esse usuário não existe.",
      });
    }

    await User.update({ activated }, { where: { id } });

    const updatedUser = await User.findOne({ where: { id } });

    res.status(200).json({
      message: "Campo 'activated' do usuário atualizado com sucesso.",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao tentar atualizar o campo activated do usuário",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(400).json({
        message: "Usuário não encontrado.",
      });
    }

    await user.destroy();

    res.status(200).json({
      message: "Usuário deletado com sucesso",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao tentar deletar o usuário.",
      error: error.message,
    });
  }
};

export const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, password, pushToken } = req.body;

    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(400).json({
        message: "Usuário não encontrado.",
      });
    }

    const updatedFields = {
      firstName: firstName ?? user.firstName,
      lastName: lastName ?? user.lastName,
      email: email ?? user.email,
      pushToken: pushToken ?? user.pushToken,
    };

    if (password) {
      updatedFields.password = password;
    }

    const newUser = await user.update(updatedFields);

    res.status(200).json({
      message: "Usuário atualizado com sucesso",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao tentar atualizar o usuário.",
      error: error.message,
    });
  }
};
