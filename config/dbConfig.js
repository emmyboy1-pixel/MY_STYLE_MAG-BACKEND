import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_HOST:', process.env.DB_HOST);

const options = {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql',
  logging: false
};

console.log('Sequelize options:', options);

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  options
);
