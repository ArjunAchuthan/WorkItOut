// Database configuration helper
import { Sequelize } from "sequelize"

// Create a function to initialize the database connection
export function initDatabase() {
  // Check if required environment variables are set
  const requiredEnvVars = ["DB_HOST", "DB_PORT", "DB_USER", "DB_NAME"]
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.warn(`Missing required environment variables: ${missingVars.join(", ")}`)
    console.warn("Using default values instead. This may cause connection issues.")
  }

  const sequelize = new Sequelize({
    dialect: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number.parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "", // Reads from environment variable
    database: process.env.DB_NAME || "workitout_db",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    dialectOptions: {
      connectTimeout: 60000,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  })

  return sequelize
}

// Function to test the database connection
export async function testDatabaseConnection() {
  const sequelize = initDatabase()

  try {
    await sequelize.authenticate()
    console.log("Database connection has been established successfully.")

    // Try to query the database to verify tables exist
    try {
      await sequelize.query("SHOW TABLES")
      return {
        success: true,
        message: "Connected to database successfully and verified tables exist",
      }
    } catch (tableError) {
      return {
        success: false,
        message: "Connected to database but could not verify tables",
        error: tableError instanceof Error ? tableError.message : String(tableError),
      }
    }
  } catch (error) {
    console.error("Unable to connect to the database:", error)
    return {
      success: false,
      message: "Failed to connect to database",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

