import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
} from 'sequelize-typescript';

/**
 * Institution model columns:
 * name
 * address
 * levels
 * divisions
 *
 */
export class Institution extends Model<Institution> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @HasMany(() => Level)
  levels: Level[];

  @HasMany(() => Division)
  divisions: Division[];
}

/**
 * Level model columns:
 * name
 * level
 * parentId
 * institutionId
 *
 */
export class Level extends Model<Level> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  level: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  parentId: string;

  @ForeignKey(() => Institution)
  @Column
  institutionId: number;

  @BelongsTo(() => Institution)
  institution: Institution;
}

/**
 * Division model columns:
 * name
 * code
 * address
 * institutionId
 * levelId
 *
 */
export class Division extends Model<Division> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  code: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address: string;

  @ForeignKey(() => Institution)
  @Column
  institutionId: string;

  @BelongsTo(() => Institution)
  institution: Institution;

  @ForeignKey(() => Institution)
  @Column
  levelId: string;

  @BelongsTo(() => Level)
  level: Level;
}
