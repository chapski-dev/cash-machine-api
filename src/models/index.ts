import sequelize from "config/db";
import RefreshToken from './RefreshToken.model'
import User from './User.model'
import Transaction from './Transaction.model'

;(async () => {
  try {
    await sequelize.sync()
    console.log('⚡️ Tables synced')
  } catch (error) {
    console.error('Error syncing tables:', error)
  }
})()

export { RefreshToken, User, Transaction }