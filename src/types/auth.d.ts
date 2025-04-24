export interface ILoginBody {
  email: string
  password: string
}

export interface IRegister {
  username: string
  email: string
  password: string
}

export interface IRefreshTokenAttributes {
  token: string;
  user_id: number;
  expires_at: Date;
  createdAt?: Date;
  updatedAt?: Date;
}