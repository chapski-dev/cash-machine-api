import sequelize from "config/db";
import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import User from "./User.model";
import { IRefreshTokenAttributes } from "types/auth";

class RefreshToken extends Model<
  InferAttributes<RefreshToken>,
  InferCreationAttributes<RefreshToken>
> implements IRefreshTokenAttributes {
  declare token: string;
  declare userId: number;
  declare expiresAt: Date;
}


RefreshToken.init(
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'RefreshToken',
    tableName: 'refresh_tokens',
  }
);

User.hasMany(RefreshToken, { foreignKey: 'userId' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

export default RefreshToken;