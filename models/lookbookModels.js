import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js"

const Lookbook = sequelize.define('Lookbook', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId: { type: DataTypes.INTEGER, allowNull: false},
    name: { type: DataTypes.STRING, allowNull: false},
    
},

{
    tableName: 'lookbooks',
    timestamps: true
}
)

export default Lookbook;