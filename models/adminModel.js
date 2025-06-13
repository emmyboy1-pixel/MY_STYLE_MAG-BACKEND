import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js"
import bcrypt from 'bcrypt';

const Admin = sequelize.define('Admin', {
    // id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: { type: DataTypes.TEXT, allowNull: false},
    email: { type: DataTypes.STRING, allowNull: false},
    password: { type: DataTypes.STRING, allowNull: false},
    role: { type: DataTypes.STRING, defaultValue: 'admin'}

},

{
    tableName: 'admins',
    timestamps: true
}
)

// Hashing password before saving in database
Admin.beforeCreate(async (admin) => {
    admin.password = await bcrypt.hash(admin.password, 10);
})

export default Admin