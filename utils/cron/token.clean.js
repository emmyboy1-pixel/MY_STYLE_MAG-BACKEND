import cron from "node-cron";
import User from "../../models/userModels.js";
import { Op } from "sequelize";

// Delete expired resetToken and resetTokenExpiry every 15 minutes
cron.schedule("*/15 * * * *", async () => {
  try {
    const [affectedRows] = await User.update(
      {
        resetToken: null,
        resetTokenExpiry: null,
      },
      {
        where: {
          resetTokenExpiry: { [Op.lte]: new Date() },
        },
      }
    );
    console.log(`Expired tokens cleared: ${affectedRows} user(s) affected`);
  } catch (error) {
    console.error(
      "An error occurred while clearing expired tokens: ",
      error.message
    );
  }
});
