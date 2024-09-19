import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

/**
 * Institution model columns:
 * id
 * name
 * address
 * levels
 * divisions
 *
 */
@Table
export class Institution extends Model<Institution> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  id: string;

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

  /*** RELATIONSHIPS ***/
  @HasMany(() => Level)
  levels: Level[];

  @HasMany(() => Division)
  divisions: Division[];
}

/**
 * Level model columns:
 * id
 * name
 * level
 * parentId
 * institutionId
 *
 */
@Table
export class Level extends Model<Level> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  level: number;

  /*** RELATIONSHIPS ***/

  @BelongsTo(() => Level)
  parent: Level;

  @ForeignKey(() => Level)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  parentId: string;

  @BelongsTo(() => Institution)
  institution: Institution;

  @ForeignKey(() => Institution)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  institutionId: string;
}

/**
 * Division model columns:
 * id
 * name
 * code
 * address
 * institutionId
 * levelId
 *
 */
@Table
export class Division extends Model<Division> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  id: string;

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

  /*** RELATIONSHIPS ***/

  @BelongsTo(() => Institution)
  institution: Institution;

  @ForeignKey(() => Institution)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  institutionId: string;

  @BelongsTo(() => Level)
  level: Level;

  @ForeignKey(() => Level)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  levelId: string;
}
