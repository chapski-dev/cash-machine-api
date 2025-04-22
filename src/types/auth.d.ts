export interface IRegister {
  username: string
  email: string
  password: string
}

export interface IRefreshTokenAttributes {
  token: string;
  userId: number;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}