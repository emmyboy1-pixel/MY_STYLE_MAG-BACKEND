import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js"

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: { type: DataTypes.TEXT, allowNull: false},
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false},
    role: { type: DataTypes.ENUM('user', 'admin'), dafaultValue: 'user'},

},
{ timestamps: true}
)

export default User
