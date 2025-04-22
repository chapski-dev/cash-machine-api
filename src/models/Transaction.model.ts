import sequelize from "config/db";
import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import User from "./User.model";
import { Transacstions } from "types/transactions";

class Transaction extends Model<
  InferAttributes<Transaction>,
  InferCreationAttributes<Transaction>
> implements Transacstions {
  public id!: number;
  public email!: string;
  public type!: string;
  public amount!: number;
  public recipient_email?: string;
  public timestamp!: Date;
}

Transaction.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    recipient_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transactions',
  }
);
User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

export default Transaction;