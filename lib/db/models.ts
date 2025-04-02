// This file defines the database models using Sequelize ORM

import { Sequelize, DataTypes, Model } from "sequelize"

// Update the Sequelize initialization to work with XAMPP
const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "", // XAMPP often uses empty password by default
  database: process.env.DB_NAME || "workitout_db",
  logging: false,
  dialectOptions: {
    // Add this to handle connection timeouts
    connectTimeout: 60000,
  },
  pool: {
    max: 5, // Maximum number of connection in pool
    min: 0, // Minimum number of connection in pool
    acquire: 30000, // Maximum time, in milliseconds, that pool will try to get connection before throwing error
    idle: 10000, // Maximum time, in milliseconds, that a connection can be idle before being released
  },
})

// User Model
class User extends Model {
  declare id: number
  declare name: string
  declare email: string
  declare password: string
  declare profile_photo: string | null
  declare created_at: Date
  declare updated_at: Date
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile_photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
)

// Survey Response Model
class SurveyResponse extends Model {
  declare id: number
  declare user_id: number
  declare weight: number
  declare height: number
  declare age: number
  declare gender: string
  declare experience_level: string
  declare activity_level: string
  declare workout_duration: string
  declare health_conditions: string
  declare workout_environment: string
  declare equipment: string
  declare created_at: Date
  declare updated_at: Date
}

SurveyResponse.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    experience_level: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    activity_level: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    workout_duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    health_conditions: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("health_conditions")
        return value ? JSON.parse(value) : []
      },
      set(value: string[]) {
        this.setDataValue("health_conditions", JSON.stringify(value))
      },
    },
    workout_environment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fitness_goal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    equipment: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("equipment")
        return value ? JSON.parse(value) : []
      },
      set(value: string[]) {
        this.setDataValue("equipment", JSON.stringify(value))
      },
    },
  },
  {
    sequelize,
    modelName: "SurveyResponse",
    tableName: "survey_responses",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
)

// Workout Model
class Workout extends Model {
  declare id: number
  declare user_id: number
  declare name: string
  declare type: string
  declare duration: string
  declare exercises: string
  declare created_at: Date
  declare updated_at: Date
}

Workout.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    exercises: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const value = this.getDataValue("exercises")
        return value ? JSON.parse(value) : []
      },
      set(value: any[]) {
        this.setDataValue("exercises", JSON.stringify(value))
      },
    },
  },
  {
    sequelize,
    modelName: "Workout",
    tableName: "workouts",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
)

// Progress Log Model
class ProgressLog extends Model {
  declare id: number
  declare user_id: number
  declare workout_id: number
  declare workout_date: Date
  declare completed_exercises: string
  declare duration: number
  declare calories_burned: number
  declare created_at: Date
  declare updated_at: Date
}

ProgressLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    workout_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Workout,
        key: "id",
      },
    },
    workout_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    completed_exercises: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const value = this.getDataValue("completed_exercises")
        return value ? JSON.parse(value) : []
      },
      set(value: any[]) {
        this.setDataValue("completed_exercises", JSON.stringify(value))
      },
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    calories_burned: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "ProgressLog",
    tableName: "progress_logs",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
)

// Add new models for Workout Calendar and Progress Tracking

// Workout Calendar Model
class WorkoutCalendar extends Model {
  declare id: number
  declare user_id: number
  declare workout_id: number
  declare scheduled_date: Date
  declare is_completed: boolean
  declare notes: string | null
  declare created_at: Date
  declare updated_at: Date
}

WorkoutCalendar.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    workout_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Workout,
        key: "id",
      },
    },
    scheduled_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "WorkoutCalendar",
    tableName: "workout_calendar",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
)

// Progress Tracking Model
class ProgressTracking extends Model {
  declare id: number
  declare user_id: number
  declare tracking_date: Date
  declare weight: number | null
  declare body_fat: number | null
  declare measurements: string | null
  declare notes: string | null
  declare created_at: Date
  declare updated_at: Date
}

ProgressTracking.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    tracking_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    body_fat: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    measurements: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("measurements")
        return value ? JSON.parse(value) : null
      },
      set(value: object | null) {
        this.setDataValue("measurements", value ? JSON.stringify(value) : null)
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "ProgressTracking",
    tableName: "progress_tracking",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
)

// Exercise Progress Model
class ExerciseProgress extends Model {
  declare id: number
  declare user_id: number
  declare exercise_name: string
  declare tracking_date: Date
  declare weight: number | null
  declare reps: number | null
  declare sets: number | null
  declare notes: string | null
  declare created_at: Date
  declare updated_at: Date
}

ExerciseProgress.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    exercise_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tracking_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    reps: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sets: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "ExerciseProgress",
    tableName: "exercise_progress",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
)

// User Preferences Model
class UserPreferences extends Model {
  declare id: number
  declare user_id: number
  declare theme: string
  declare notification_settings: string
  declare created_at: Date
  declare updated_at: Date
}

UserPreferences.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      unique: true,
    },
    theme: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "dark",
    },
    notification_settings: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '{"workout_reminders":true,"progress_updates":true,"achievements":true}',
      get() {
        const value = this.getDataValue("notification_settings")
        return value ? JSON.parse(value) : {}
      },
      set(value: object) {
        this.setDataValue("notification_settings", JSON.stringify(value))
      },
    },
  },
  {
    sequelize,
    modelName: "UserPreferences",
    tableName: "user_preferences",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
)

// Define associations for new models
User.hasMany(WorkoutCalendar, { foreignKey: "user_id" })
WorkoutCalendar.belongsTo(User, { foreignKey: "user_id" })

Workout.hasMany(WorkoutCalendar, { foreignKey: "workout_id" })
WorkoutCalendar.belongsTo(Workout, { foreignKey: "workout_id" })

User.hasMany(ProgressTracking, { foreignKey: "user_id" })
ProgressTracking.belongsTo(User, { foreignKey: "user_id" })

User.hasMany(ExerciseProgress, { foreignKey: "user_id" })
ExerciseProgress.belongsTo(User, { foreignKey: "user_id" })

User.hasOne(UserPreferences, { foreignKey: "user_id" })
UserPreferences.belongsTo(User, { foreignKey: "user_id" })

// Define associations
User.hasMany(SurveyResponse, { foreignKey: "user_id" })
SurveyResponse.belongsTo(User, { foreignKey: "user_id" })

User.hasMany(Workout, { foreignKey: "user_id" })
Workout.belongsTo(User, { foreignKey: "user_id" })

User.hasMany(ProgressLog, { foreignKey: "user_id" })
ProgressLog.belongsTo(User, { foreignKey: "user_id" })

Workout.hasMany(ProgressLog, { foreignKey: "workout_id" })
ProgressLog.belongsTo(Workout, { foreignKey: "workout_id" })

// Add this function to test the database connection
export async function testDatabaseConnection() {
  try {
    await sequelize.authenticate()
    console.log("Database connection has been established successfully.")
    return true
  } catch (error) {
    console.error("Unable to connect to the database:", error)
    return false
  }
}

// Export the new models
export {
  sequelize,
  User,
  SurveyResponse,
  Workout,
  ProgressLog,
  WorkoutCalendar,
  ProgressTracking,
  ExerciseProgress,
  UserPreferences,
}

