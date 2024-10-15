import {
  BeforeCreate,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Roles } from './role.provider';

@Table
export class User extends Model<User> {
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
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  middleName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    unique: true,
  })
  phone: string;

  @Column({ defaultValue: true })
  isActive: boolean;

  @Column({
    type: DataType.ENUM,
    values: Object.values(Roles),
    defaultValue: Roles.USER,
    allowNull: false,
  })
  role: string;

  // sets the default role to user at creation
  @BeforeCreate
  static setDefaultStatus(instance: User) {
    instance.role = Roles.USER;
  }

  toJSON() {
    const user = Object.assign({}, this.get());
    delete user.password;
    return user;
  }
}
