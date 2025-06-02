import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js"

const Outfit = sequelize.define('Outfit', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: { type: DataTypes.STRING, allowNull: false},
    description: { type: DataTypes.STRING, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: false},
    // slug: { type: DataTypes.STRING, },  // still to come back to this line
    categoryId: { type: DataTypes.INTEGER, allowNull: false, references: {
        model: "Categories",
        key: 'id',
    }},
    createdBy: { type: DataTypes.INTEGER, allowNull: false, references: {
        model: 'Users',
        key: 'id'
    }},

},
{ timestamps: true}
)

export default Outfit;