import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/connection';

interface PlaylistItemAttributes {
  id: number;
  playlistId: number;
  sermonId: number;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type PlaylistItemCreationAttributes = Optional<PlaylistItemAttributes, 'id' | 'sortOrder'>;

class PlaylistItem extends Model<PlaylistItemAttributes, PlaylistItemCreationAttributes> implements PlaylistItemAttributes {
  declare id: number;
  declare playlistId: number;
  declare sermonId: number;
  declare sortOrder: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PlaylistItem.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    playlistId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    sermonId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'playlist_items',
    indexes: [
      { fields: ['playlist_id'] },
      { unique: true, fields: ['playlist_id', 'sermon_id'] },
    ],
  }
);

export default PlaylistItem;
