export type IUser = {
  id?: number;
  user_id: string;
  username: string;
  email: string;
  password: string;
  balance: number;

  createdAt?: DataTypes.DATE,
  updatedAt?: DataTypes.DATE,
};
