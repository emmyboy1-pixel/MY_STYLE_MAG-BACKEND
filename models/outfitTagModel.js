// ####  This is a joint table   ########

import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js"

const outfitTag = sequelize.define('outfitTag', {
    // still have to fill in here
},
{ timestamps: true}
)

export default outfitTag;