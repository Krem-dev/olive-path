import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/connection';

interface DevotionAttributes {
  id: number;
  date: string; // YYYY-MM-DD, one per day
  scripture: string;
  scriptureRef: string;
  encouragement: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type DevotionCreationAttributes = Optional<DevotionAttributes, 'id' | 'isActive'>;

class Devotion extends Model<DevotionAttributes, DevotionCreationAttributes> implements DevotionAttributes {
  declare id: number;
  declare date: string;
  declare scripture: string;
  declare scriptureRef: string;
  declare encouragement: string;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Devotion.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true,
    },
    scripture: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    scriptureRef: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    encouragement: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'devotions',
  }
);

export default Devotion;
