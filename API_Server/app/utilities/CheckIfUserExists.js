import Account from "../models/account.js";

export const ExistsError = {
  None: 0,
  Email: 1,
  Username: 2,
};

const CheckIfUserExists = async (email, username) => {
  if (email) {
    let user = await Account.findAll({ where: { email: email } });

    if (user.length != 0) {
      return ExistsError.Email;
    }
  }

  if (username) {
    let user = await Account.findAll({ where: { username: username } });

    if (user.length != 0) {
      return ExistsError.Username;
    }
  }

  return ExistsError.None;
};

export default CheckIfUserExists;
