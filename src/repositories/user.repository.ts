import { log } from "console";
import { User } from "models";
import { v4 as uuidv4 } from 'uuid';

class UserRepository {
  findUserByEmail = async (email: string) => {
    log('start findUserByEmail')

    return await User.findOne({ where: { email } });
  };
  
  createUser = async (username: string, email: string, password: string) => {
    log('start create user')
    return await User.create({
      username,
      email,
      password,
      balance: 0,
      userId: uuidv4(),
     });
  };
  
  findUserById = async (id: number) => {
    return await User.findByPk(id);
  };
}

export const userRepository = new UserRepository();