import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js"

const Admin = sequelize.define('Admin', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: { type: DataTypes.TEXT, allowNull: false},
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false},

},
{ timestamps: true}
)

export default Admin