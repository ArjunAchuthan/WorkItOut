// lib/db/seed-data.ts

import { sequelize, User, SurveyResponse, Workout } from "@/lib/db/models";
import { hash } from "bcryptjs";
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function seedDatabase() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Get the SQL file path
    const sqlFilePath = path.join(process.cwd(), 'setup-xampp-db.sql');
    
    // Check if the file exists
    if (!fs.existsSync(sqlFilePath)) {
      return {
        success: false,
        message: "SQL file not found",
        error: "The setup-xampp-db.sql file was not found in the project root directory."
      };
    }

    // Read the SQL file content
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    // Execute the SQL script using MySQL command line
    // Note: This requires mysql client to be installed and accessible in the PATH
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || '3306',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'workitout_db'
    };

    // Create a temporary SQL file with environment variables replaced
    const tempSqlPath = path.join(process.cwd(), 'temp-setup.sql');
    fs.writeFileSync(tempSqlPath, sqlContent);

    // Execute the SQL script
    const mysqlCommand = `mysql -h${dbConfig.host} -P${dbConfig.port} -u${dbConfig.user} ${dbConfig.password ? `-p${dbConfig.password}` : ''} < ${tempSqlPath}`;
    
    try {
      await execPromise(mysqlCommand);
      console.log("Database seeded successfully from SQL file.");
      
      // Clean up the temporary file
      fs.unlinkSync(tempSqlPath);
      
      return {
        success: true,
        message: "Database seeded successfully! The database now contains exercise data, workout templates, and a demo user."
      };
    } catch (execError) {
      console.error("Error executing MySQL command:", execError);
      
      // Clean up the temporary file
      if (fs.existsSync(tempSqlPath)) {
        fs.unlinkSync(tempSqlPath);
      }
      
      // Fall back to Sequelize for basic seeding if MySQL command fails
      return await seedDatabaseWithSequelize();
    }
  } catch (error) {
    console.error("Error seeding database:", error);
    return {
      success: false,
      message: "Failed to seed database",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

async function seedDatabaseWithSequelize() {
  try {
    console.log("Falling back to Sequelize for basic database seeding...");
    
    // Create a demo user
    const hashedPassword = await hash('password123', 10);
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@workitout.com',
      password: hashedPassword
    });
    
    // Create a sample survey response
    await SurveyResponse.create({
      user_id: demoUser.id,
      weight: 75,
      height: 178,
      age: 30,
      gender: 'male',
      experience_level: 'beginner',
      activity_level: 'moderate',
      workout_duration: '30',
      health_conditions: [],
      workout_environment: 'home',
      fitness_goal: 'general-fitness',
      equipment: ['none', 'dumbbells']
    });
    
    // Create sample workouts
    await Workout.create({
      user_id: demoUser.id,
      name: 'Beginner Full Body',
      type: 'strength',
      duration: '30 min',
      exercises: JSON.stringify([
        {
          name: 'Push-ups',
          type: 'strength',
          equipment: ['none'],
          targetMuscles: ['chest', 'shoulders', 'triceps'],
          sets: 3,
          reps: 10
        },
        {
          name: 'Squats',
          type: 'strength',
          equipment: ['none'],
          targetMuscles: ['quadriceps', 'hamstrings', 'glutes'],
          sets: 3,
          reps: 12
        },
        {
          name: 'Plank',
          type: 'strength',
          equipment: ['none'],
          targetMuscles: ['core', 'shoulders'],
          sets: 3,
          reps: '30 sec'
        }
      ])
    });
    
    await Workout.create({
      user_id: demoUser.id,
      name: 'HIIT Cardio',
      type: 'cardio',
      duration: '20 min',
      exercises: JSON.stringify([
        {
          name: 'Jumping Jacks',
          type: 'cardio',
          equipment: ['none'],
          targetMuscles: ['full-body'],
          sets: 4,
          reps: '30 sec'
        },
        {
          name: 'Mountain Climbers',
          type: 'cardio',
          equipment: ['none'],
          targetMuscles: ['core', 'shoulders', 'quadriceps'],
          sets: 4,
          reps: '30 sec'
        },
        {
          name: 'High Knees',
          type: 'cardio',
          equipment: ['none'],
          targetMuscles: ['core', 'quadriceps'],
          sets: 4,
          reps: '30 sec'
        }
      ])
    });
    
    return {
      success: true,
      message: "Basic database seeding completed successfully with Sequelize. Note: This is a simplified version with limited data."
    };
  } catch (error) {
    console.error("Error in Sequelize seeding:", error);
    return {
      success: false,
      message: "Failed to seed database with Sequelize",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

