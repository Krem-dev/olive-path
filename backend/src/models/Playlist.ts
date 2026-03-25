import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/connection';

interface PlaylistAttributes {
  id: number;
  userId: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type PlaylistCreationAttributes = Optional<PlaylistAttributes, 'id'>;

class Playlist extends Model<PlaylistAttributes, PlaylistCreationAttributes> implements PlaylistAttributes {
  declare id: number;
  declare userId: number;
  declare name: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Playlist.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [1, 100],
      },
    },
  },
  {
    sequelize,
    tableName: 'playlists',
    indexes: [
      { fields: ['user_id'] },
    ],
  }
);

export default Playlist;
