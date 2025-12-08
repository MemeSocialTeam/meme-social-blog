import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing in .env!");
  process.exit(1);
}


const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export default sequelize;

// if (process.env.DB_PASSWORD === "your_db_password!") {
//   console.error("Please update the .env file with your database password.");
//   process.exit(1);
// }

// const sequelize = process.env.JAWSDB_URL
//   ? new Sequelize(process.env.JAWSDB_URL)
//   : new Sequelize(
//       process.env.DB_DATABASE,
//       process.env.DB_USERNAME,
//       process.env.DB_PASSWORD,
//       {
//         host: process.env.DB_HOST,
//         dialect: process.env.DB_DIALECT || "postgres",
//         port: process.env.DB_PORT || 5432,
//       }
//     );

// export default sequelize;
