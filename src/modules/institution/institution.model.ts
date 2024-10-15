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
 * An institution is a unit where elections are held.
 * For example, a country, school, university, company etc.
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

  // name of the institution e.g. Kenya, Nairobi County, Nairobi University
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;

  // level of the institution: we use this to create the level name
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  level: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  // code of the division e.g. 001, 002, 003
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  code: string;

  /*** RELATIONSHIPS ***/

  @HasMany(() => Level)
  levels: Level[];

  @HasMany(() => Division)
  divisions: Division[];
}

/**
 * A level refers to the hierarchy within the institution
 * For example, in a country, the levels can be country, county, constituency, ward
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

  // name of the level e.g. country, county, constituency, ward
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  // hierarchy level of the institution
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  level: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;

  /*** RELATIONSHIPS ***/

  @BelongsTo(() => Institution)
  institution: Institution;

  @ForeignKey(() => Institution)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  institutionId: string;

  @HasMany(() => Division)
  divisions: Division[];
}

// TODO: division might have a parent division
/**
 * A division is a sub unit of an institution.
 * For example, in a country, a division can be constituency, county, sub county, ward etc.
 * a division has a level and belongs to an institution.
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

  // name of the division e.g. Nairobi, Nairobi West, Nairobi South
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  // code of the division e.g. 001, 002, 003
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

  // a division has one level
  @BelongsTo(() => Level)
  level: Level;

  @ForeignKey(() => Level)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  levelId: string;
}
