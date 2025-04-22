import { Sequelize } from 'sequelize';
import * as dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE || '',
  process.env.DB_USER || '',
  process.env.PASSWORD || '',
  {
    host: process.env.HOST,
    dialect: 'postgres',
  }
);

export default sequelize;