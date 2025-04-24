export interface RefreshTokenDB {
  id: number,
  token: string,
  email: string,
  user_id: string,
  expires_at: Date
}