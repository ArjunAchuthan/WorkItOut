-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS workitout_db;
USE workitout_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  profile_photo VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Survey responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  weight FLOAT NOT NULL,
  height FLOAT NOT NULL,
  age INT NOT NULL,
  gender VARCHAR(50) NOT NULL,
  experience_level VARCHAR(50) NOT NULL,
  activity_level VARCHAR(50) NOT NULL,
  workout_duration VARCHAR(50) NOT NULL,
  health_conditions TEXT,
  workout_environment VARCHAR(50) NOT NULL,
  fitness_goal VARCHAR(50),
  equipment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Exercise categories table (new)
CREATE TABLE IF NOT EXISTS exercise_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Equipment table (new)
CREATE TABLE IF NOT EXISTS equipment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Muscle groups table (new)
CREATE TABLE IF NOT EXISTS muscle_groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  body_part VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Exercises table (new)
CREATE TABLE IF NOT EXISTS exercises (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  difficulty VARCHAR(50) NOT NULL,
  instructions TEXT,
  video_url VARCHAR(255),
  image_url VARCHAR(255),
  category_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES exercise_categories(id) ON DELETE SET NULL
);

-- Exercise equipment relationship (new)
CREATE TABLE IF NOT EXISTS exercise_equipment (
  exercise_id INT NOT NULL,
  equipment_id INT NOT NULL,
  PRIMARY KEY (exercise_id, equipment_id),
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
  FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE
);

-- Exercise muscle groups relationship (new)
CREATE TABLE IF NOT EXISTS exercise_muscle_groups (
  exercise_id INT NOT NULL,
  muscle_group_id INT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (exercise_id, muscle_group_id),
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
  FOREIGN KEY (muscle_group_id) REFERENCES muscle_groups(id) ON DELETE CASCADE
);

-- Health conditions table (new)
CREATE TABLE IF NOT EXISTS health_conditions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Exercise contraindications (new)
CREATE TABLE IF NOT EXISTS exercise_contraindications (
  exercise_id INT NOT NULL,
  condition_id INT NOT NULL,
  PRIMARY KEY (exercise_id, condition_id),
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
  FOREIGN KEY (condition_id) REFERENCES health_conditions(id) ON DELETE CASCADE
);

-- Workout templates table (new)
CREATE TABLE IF NOT EXISTS workout_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  difficulty VARCHAR(50) NOT NULL,
  fitness_goal VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Workout template exercises (new)
CREATE TABLE IF NOT EXISTS workout_template_exercises (
  id INT AUTO_INCREMENT PRIMARY KEY,
  workout_template_id INT NOT NULL,
  exercise_id INT NOT NULL,
  sets INT,
  reps VARCHAR(50),
  rest_time VARCHAR(50),
  notes TEXT,
  order_index INT NOT NULL,
  FOREIGN KEY (workout_template_id) REFERENCES workout_templates(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

-- User workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  exercises TEXT NOT NULL,
  template_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (template_id) REFERENCES workout_templates(id) ON DELETE SET NULL
);

-- Progress logs table
CREATE TABLE IF NOT EXISTS progress_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  workout_id INT NOT NULL,
  workout_date DATETIME NOT NULL,
  completed_exercises TEXT NOT NULL,
  duration INT NOT NULL,
  calories_burned INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
);

-- Workout calendar table
CREATE TABLE IF NOT EXISTS workout_calendar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  workout_id INT NOT NULL,
  scheduled_date DATETIME NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
);

-- Progress tracking table
CREATE TABLE IF NOT EXISTS progress_tracking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tracking_date DATETIME NOT NULL,
  weight FLOAT,
  body_fat FLOAT,
  measurements TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Exercise progress table
CREATE TABLE IF NOT EXISTS exercise_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  exercise_id INT NOT NULL,
  tracking_date DATETIME NOT NULL,
  weight FLOAT,
  reps INT,
  sets INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  theme VARCHAR(50) NOT NULL DEFAULT 'dark',
  notification_settings TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
-- Note: We're removing the duplicate index on survey_responses(user_id) since it's already created by the foreign key
CREATE INDEX idx_workout_user_id ON workouts(user_id);
CREATE INDEX idx_progress_user_id ON progress_logs(user_id);
CREATE INDEX idx_progress_workout_id ON progress_logs(workout_id);
CREATE INDEX idx_progress_date ON progress_logs(workout_date);
CREATE INDEX idx_calendar_user_id ON workout_calendar(user_id);
CREATE INDEX idx_calendar_workout_id ON workout_calendar(workout_id);
CREATE INDEX idx_calendar_date ON workout_calendar(scheduled_date);
CREATE INDEX idx_tracking_user_id ON progress_tracking(user_id);
CREATE INDEX idx_tracking_date ON progress_tracking(tracking_date);
CREATE INDEX idx_exercise_progress_user_id ON exercise_progress(user_id);
CREATE INDEX idx_exercise_progress_date ON exercise_progress(tracking_date);
CREATE INDEX idx_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_exercise_type ON exercises(type);
CREATE INDEX idx_exercise_difficulty ON exercises(difficulty);
CREATE INDEX idx_workout_template_type ON workout_templates(type);
CREATE INDEX idx_workout_template_difficulty ON workout_templates(difficulty);
CREATE INDEX idx_workout_template_goal ON workout_templates(fitness_goal);

-- Insert exercise categories
INSERT INTO exercise_categories (name, description) VALUES
('Strength', 'Exercises focused on building muscle strength and size'),
('Cardio', 'Exercises focused on cardiovascular endurance'),
('Flexibility', 'Exercises focused on improving range of motion and flexibility'),
('Balance', 'Exercises focused on improving stability and balance'),
('Core', 'Exercises focused on strengthening the core muscles');

-- Insert equipment
INSERT INTO equipment (name, description) VALUES
('None', 'No equipment required'),
('Dumbbells', 'Free weights that can be held in each hand'),
('Barbell', 'A long metal bar with weights attached at each end'),
('Kettlebell', 'A cast-iron weight with a handle'),
('Resistance Bands', 'Elastic bands that provide resistance'),
('Pull-up Bar', 'A horizontal bar for pull-up exercises'),
('Bench', 'A flat or adjustable bench for various exercises'),
('Yoga Mat', 'A mat for floor exercises and stretching'),
('Medicine Ball', 'A weighted ball used for various exercises'),
('Stability Ball', 'A large inflatable ball used for various exercises'),
('TRX/Suspension Trainer', 'Straps with handles for bodyweight exercises');

-- Insert muscle groups
INSERT INTO muscle_groups (name, description, body_part) VALUES
('Chest', 'Pectoralis major and minor muscles', 'Upper Body'),
('Back', 'Latissimus dorsi, rhomboids, and trapezius muscles', 'Upper Body'),
('Shoulders', 'Deltoid muscles', 'Upper Body'),
('Biceps', 'Biceps brachii muscles', 'Upper Body'),
('Triceps', 'Triceps brachii muscles', 'Upper Body'),
('Forearms', 'Muscles of the forearm', 'Upper Body'),
('Quadriceps', 'Front thigh muscles', 'Lower Body'),
('Hamstrings', 'Back thigh muscles', 'Lower Body'),
('Glutes', 'Gluteal muscles', 'Lower Body'),
('Calves', 'Gastrocnemius and soleus muscles', 'Lower Body'),
('Core', 'Abdominal and lower back muscles', 'Core'),
('Hip Flexors', 'Muscles that flex the hip joint', 'Lower Body'),
('Full Body', 'Exercises that engage multiple muscle groups', 'Full Body');

-- Insert health conditions
INSERT INTO health_conditions (name, description) VALUES
('Knee Issues', 'Problems with the knee joint or surrounding tissues'),
('Back Pain', 'Pain in the lower, middle, or upper back'),
('Shoulder Pain', 'Pain in the shoulder joint or surrounding tissues'),
('Wrist Pain', 'Pain in the wrist joint or surrounding tissues'),
('Ankle Issues', 'Problems with the ankle joint or surrounding tissues'),
('High Blood Pressure', 'Elevated blood pressure levels'),
('Heart Conditions', 'Various heart-related health issues'),
('Pregnancy', 'Special considerations for pregnant individuals'),
('Arthritis', 'Inflammation of the joints'),
('Osteoporosis', 'Decreased bone density and increased risk of fractures');

-- Insert exercises
INSERT INTO exercises (name, description, type, difficulty, instructions, category_id) VALUES
-- Beginner Strength Exercises
('Push-ups', 'A classic bodyweight exercise for the upper body', 'strength', 'beginner', 'Start in a plank position with hands shoulder-width apart. Lower your body until your chest nearly touches the floor, then push back up.', 1),
('Squats', 'A fundamental lower body exercise', 'strength', 'beginner', 'Stand with feet shoulder-width apart. Bend your knees and lower your hips as if sitting in a chair. Keep your chest up and knees behind toes.', 1),
('Lunges', 'A unilateral lower body exercise', 'strength', 'beginner', 'Step forward with one leg and lower your hips until both knees are bent at about 90 degrees. Push back to the starting position.', 1),
('Plank', 'A core-strengthening isometric exercise', 'strength', 'beginner', 'Start in a push-up position but with your weight on your forearms. Keep your body in a straight line from head to heels.', 1),
('Glute Bridges', 'An exercise targeting the glutes and hamstrings', 'strength', 'beginner', 'Lie on your back with knees bent and feet flat on the floor. Lift your hips off the ground until your body forms a straight line from shoulders to knees.', 1),

-- Intermediate Strength Exercises
('Dumbbell Bench Press', 'A chest-focused exercise using dumbbells', 'strength', 'intermediate', 'Lie on a bench with a dumbbell in each hand. Press the weights up until your arms are extended, then lower them back down.', 1),
('Dumbbell Rows', 'A back-focused exercise using dumbbells', 'strength', 'intermediate', 'Place one knee and hand on a bench, with the other foot on the floor. Hold a dumbbell in the free hand and pull it up towards your hip.', 1),
('Goblet Squats', 'A squat variation holding a weight at chest level', 'strength', 'intermediate', 'Hold a dumbbell or kettlebell close to your chest. Perform a squat while keeping the weight close to your body.', 1),
('Dumbbell Shoulder Press', 'An overhead pressing exercise for shoulders', 'strength', 'intermediate', 'Sit or stand with a dumbbell in each hand at shoulder height. Press the weights overhead until arms are extended.', 1),
('Romanian Deadlift', 'A hip-hinge exercise targeting hamstrings', 'strength', 'intermediate', 'Stand with feet hip-width apart, holding weights in front of thighs. Hinge at the hips and lower the weights while keeping your back flat.', 1),

-- Advanced Strength Exercises
('Pull-ups', 'An upper body pulling exercise', 'strength', 'advanced', 'Hang from a bar with palms facing away. Pull yourself up until your chin is over the bar, then lower back down.', 1),
('Pistol Squats', 'A single-leg squat exercise', 'strength', 'advanced', 'Stand on one leg with the other leg extended forward. Lower into a squat on the standing leg, then push back up.', 1),
('Handstand Push-ups', 'An advanced shoulder exercise', 'strength', 'advanced', 'Get into a handstand position against a wall. Lower your head towards the ground, then push back up.', 1),
('Muscle-ups', 'A combination of a pull-up and dip', 'strength', 'advanced', 'Perform a pull-up and continue the motion to bring your body above the bar, then perform a dip.', 1),
('One-arm Push-ups', 'A unilateral pushing exercise', 'strength', 'advanced', 'Perform a push-up using only one arm, with the other arm behind your back.', 1),

-- Cardio Exercises
('Jumping Jacks', 'A full-body cardio exercise', 'cardio', 'beginner', 'Start with feet together and arms at sides. Jump while spreading legs and raising arms, then return to starting position.', 2),
('Mountain Climbers', 'A dynamic cardio and core exercise', 'cardio', 'beginner', 'Start in a plank position. Alternate bringing each knee towards your chest in a running motion.', 2),
('High Knees', 'A cardio exercise focusing on leg drive', 'cardio', 'intermediate', 'Run in place, lifting knees as high as possible with each step.', 2),
('Burpees', 'A full-body cardio and strength exercise', 'cardio', 'intermediate', 'Start standing, drop into a squat, kick feet back to a plank, perform a push-up, jump feet back to squat, then jump up.', 2),
('Jump Rope', 'A classic cardio exercise using a rope', 'cardio', 'intermediate', 'Swing a rope over your head and under your feet, jumping over it with each rotation.', 2),

-- Flexibility Exercises
('Cat-Cow Stretch', 'A yoga movement for spine flexibility', 'mobility', 'beginner', 'Start on hands and knees. Alternate between arching your back (cat) and dropping it (cow) while moving your head in the opposite direction.', 3),
('Hip Flexor Stretch', 'A stretch targeting the hip flexors', 'mobility', 'beginner', 'Kneel on one knee with the other foot in front. Push hips forward while keeping torso upright.', 3),
('Hamstring Stretch', 'A stretch targeting the hamstrings', 'mobility', 'beginner', 'Sit with one leg extended and the other bent. Reach towards the extended foot while keeping your back straight.', 3),
('Shoulder Stretch', 'A stretch for the shoulder muscles', 'mobility', 'beginner', 'Bring one arm across your chest and use the other arm to gently pull it closer.', 3),
('Child\'s Pose', 'A restful yoga pose that stretches the back', 'mobility', 'beginner', 'Kneel on the floor, touch your big toes together, sit on your heels, then lay your torso down between your thighs.', 3);

-- Link exercises to equipment
INSERT INTO exercise_equipment (exercise_id, equipment_id) VALUES
-- Push-ups (Exercise ID 1)
(1, 1), -- None
-- Squats (Exercise ID 2)
(2, 1), -- None
-- Lunges (Exercise ID 3)
(3, 1), -- None
-- Plank (Exercise ID 4)
(4, 1), -- None
-- Glute Bridges (Exercise ID 5)
(5, 1), -- None
-- Dumbbell Bench Press (Exercise ID 6)
(6, 2), -- Dumbbells
(6, 7), -- Bench
-- Dumbbell Rows (Exercise ID 7)
(7, 2), -- Dumbbells
(7, 7), -- Bench
-- Goblet Squats (Exercise ID 8)
(8, 2), -- Dumbbells
(8, 4), -- Kettlebell
-- Dumbbell Shoulder Press (Exercise ID 9)
(9, 2), -- Dumbbells
-- Romanian Deadlift (Exercise ID 10)
(10, 2), -- Dumbbells
-- Pull-ups (Exercise ID 11)
(11, 6), -- Pull-up Bar
-- Pistol Squats (Exercise ID 12)
(12, 1), -- None
-- Handstand Push-ups (Exercise ID 13)
(13, 1), -- None
-- Muscle-ups (Exercise ID 14)
(14, 6), -- Pull-up Bar
-- One-arm Push-ups (Exercise ID 15)
(15, 1), -- None
-- Jumping Jacks (Exercise ID 16)
(16, 1), -- None
-- Mountain Climbers (Exercise ID 17)
(17, 1), -- None
-- High Knees (Exercise ID 18)
(18, 1), -- None
-- Burpees (Exercise ID 19)
(19, 1), -- None
-- Jump Rope (Exercise ID 20)
(20, 1), -- None (assuming the rope is not in our equipment list)
-- Cat-Cow Stretch (Exercise ID 21)
(21, 8), -- Yoga Mat
-- Hip Flexor Stretch (Exercise ID 22)
(22, 8), -- Yoga Mat
-- Hamstring Stretch (Exercise ID 23)
(23, 8), -- Yoga Mat
-- Shoulder Stretch (Exercise ID 24)
(24, 1), -- None
-- Child's Pose (Exercise ID 25)
(25, 8); -- Yoga Mat

-- Link exercises to muscle groups
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, is_primary) VALUES
-- Push-ups (Exercise ID 1)
(1, 1, TRUE),  -- Chest (primary)
(1, 3, FALSE), -- Shoulders
(1, 5, FALSE), -- Triceps
-- Squats (Exercise ID 2)
(2, 7, TRUE),  -- Quadriceps (primary)
(2, 8, FALSE), -- Hamstrings
(2, 9, FALSE), -- Glutes
-- Lunges (Exercise ID 3)
(3, 7, TRUE),  -- Quadriceps (primary)
(3, 8, FALSE), -- Hamstrings
(3, 9, FALSE), -- Glutes
-- Plank (Exercise ID 4)
(4, 11, TRUE), -- Core (primary)
(4, 3, FALSE), -- Shoulders
-- Glute Bridges (Exercise ID 5)
(5, 9, TRUE),  -- Glutes (primary)
(5, 8, FALSE), -- Hamstrings
-- Dumbbell Bench Press (Exercise ID 6)
(6, 1, TRUE),  -- Chest (primary)
(6, 3, FALSE), -- Shoulders
(6, 5, FALSE), -- Triceps
-- Dumbbell Rows (Exercise ID 7)
(7, 2, TRUE),  -- Back (primary)
(7, 4, FALSE), -- Biceps
-- Goblet Squats (Exercise ID 8)
(8, 7, TRUE),  -- Quadriceps (primary)
(8, 8, FALSE), -- Hamstrings
(8, 9, FALSE), -- Glutes
-- Dumbbell Shoulder Press (Exercise ID 9)
(9, 3, TRUE),  -- Shoulders (primary)
(9, 5, FALSE), -- Triceps
-- Romanian Deadlift (Exercise ID 10)
(10, 8, TRUE), -- Hamstrings (primary)
(10, 9, FALSE), -- Glutes
(10, 2, FALSE), -- Back
-- Pull-ups (Exercise ID 11)
(11, 2, TRUE), -- Back (primary)
(11, 4, FALSE), -- Biceps
-- Pistol Squats (Exercise ID 12)
(12, 7, TRUE), -- Quadriceps (primary)
(12, 9, FALSE), -- Glutes
-- Handstand Push-ups (Exercise ID 13)
(13, 3, TRUE), -- Shoulders (primary)
(13, 5, FALSE), -- Triceps
-- Muscle-ups (Exercise ID 14)
(14, 2, TRUE), -- Back (primary)
(14, 1, FALSE), -- Chest
(14, 5, FALSE), -- Triceps
-- One-arm Push-ups (Exercise ID 15)
(15, 1, TRUE), -- Chest (primary)
(15, 5, FALSE), -- Triceps
(15, 11, FALSE), -- Core
-- Jumping Jacks (Exercise ID 16)
(16, 13, TRUE), -- Full Body (primary)
-- Mountain Climbers (Exercise ID 17)
(17, 11, TRUE), -- Core (primary)
(17, 7, FALSE), -- Quadriceps
-- High Knees (Exercise ID 18)
(18, 7, TRUE), -- Quadriceps (primary)
(18, 11, FALSE), -- Core
-- Burpees (Exercise ID 19)
(19, 13, TRUE), -- Full Body (primary)
-- Jump Rope (Exercise ID 20)
(20, 10, TRUE), -- Calves (primary)
(20, 7, FALSE), -- Quadriceps
-- Cat-Cow Stretch (Exercise ID 21)
(21, 2, TRUE), -- Back (primary)
(21, 11, FALSE), -- Core
-- Hip Flexor Stretch (Exercise ID 22)
(22, 12, TRUE), -- Hip Flexors (primary)
-- Hamstring Stretch (Exercise ID 23)
(23, 8, TRUE), -- Hamstrings (primary)
-- Shoulder Stretch (Exercise ID 24)
(24, 3, TRUE), -- Shoulders (primary)
-- Child's Pose (Exercise ID 25)
(25, 2, TRUE); -- Back (primary)

-- Link exercises to health conditions (contraindications)
INSERT INTO exercise_contraindications (exercise_id, condition_id) VALUES
-- Push-ups (Exercise ID 1)
(1, 2), -- Back Pain
(1, 3), -- Shoulder Pain
(1, 4), -- Wrist Pain
-- Squats (Exercise ID 2)
(2, 1), -- Knee Issues
-- Lunges (Exercise ID 3)
(3, 1), -- Knee Issues
-- Plank (Exercise ID 4)
(4, 2), -- Back Pain
(4, 3), -- Shoulder Pain
-- Dumbbell Bench Press (Exercise ID 6)
(6, 3), -- Shoulder Pain
-- Dumbbell Rows (Exercise ID 7)
(7, 2), -- Back Pain
-- Goblet Squats (Exercise ID 8)
(8, 1), -- Knee Issues
-- Dumbbell Shoulder Press (Exercise ID 9)
(9, 3), -- Shoulder Pain
-- Romanian Deadlift (Exercise ID 10)
(10, 2), -- Back Pain
-- Pull-ups (Exercise ID 11)
(11, 3), -- Shoulder Pain
-- Pistol Squats (Exercise ID 12)
(12, 1), -- Knee Issues
-- Handstand Push-ups (Exercise ID 13)
(13, 3), -- Shoulder Pain
(13, 6), -- High Blood Pressure
-- Muscle-ups (Exercise ID 14)
(14, 3), -- Shoulder Pain
-- Jumping Jacks (Exercise ID 16)
(16, 1), -- Knee Issues
(16, 5), -- Ankle Issues
-- Mountain Climbers (Exercise ID 17)
(17, 2), -- Back Pain
(17, 4), -- Wrist Pain
-- High Knees (Exercise ID 18)
(18, 1), -- Knee Issues
(18, 6), -- High Blood Pressure
-- Burpees (Exercise ID 19)
(19, 1), -- Knee Issues
(19, 2), -- Back Pain
(19, 6); -- High Blood Pressure

-- Insert workout templates
INSERT INTO workout_templates (name, type, duration, difficulty, fitness_goal, description) VALUES
-- Beginner Templates
('Beginner Full Body', 'strength', '30', 'beginner', 'general-fitness', 'A full-body workout for beginners focusing on fundamental movements'),
('Beginner HIIT', 'cardio', '20', 'beginner', 'fat-loss', 'A high-intensity interval training workout for beginners'),
('Beginner Flexibility', 'mobility', '20', 'beginner', 'general-fitness', 'A flexibility routine for beginners'),

-- Intermediate Templates
('Intermediate Upper Body', 'strength', '45', 'intermediate', 'muscle-gain', 'An upper body workout for intermediate fitness levels'),
('Intermediate Lower Body', 'strength', '45', 'intermediate', 'muscle-gain', 'A lower body workout for intermediate fitness levels'),
('Intermediate HIIT', 'cardio', '30', 'intermediate', 'fat-loss', 'A high-intensity interval training workout for intermediate fitness levels'),

-- Advanced Templates
('Advanced Full Body', 'strength', '60', 'advanced', 'strength-performance', 'A challenging full-body workout for advanced fitness levels'),
('Advanced Upper/Lower Split', 'strength', '60', 'advanced', 'muscle-gain', 'An upper/lower body split for advanced fitness levels'),
('Advanced HIIT', 'cardio', '30', 'advanced', 'fat-loss', 'An intense HIIT workout for advanced fitness levels');

-- Link workout templates to exercises
INSERT INTO workout_template_exercises (workout_template_id, exercise_id, sets, reps, rest_time, order_index) VALUES
-- Beginner Full Body (Template ID 1)
(1, 1, 3, '10', '60 sec', 1), -- Push-ups
(1, 2, 3, '12', '60 sec', 2), -- Squats
(1, 4, 3, '30 sec', '30 sec', 3), -- Plank
(1, 5, 3, '15', '60 sec', 4), -- Glute Bridges
(1, 21, 1, '30 sec', '0 sec', 5), -- Cat-Cow Stretch

-- Beginner HIIT (Template ID 2)
(2, 16, 3, '30 sec', '15 sec', 1), -- Jumping Jacks
(2, 17, 3, '30 sec', '15 sec', 2), -- Mountain Climbers
(2, 2, 3, '30 sec', '15 sec', 3), -- Squats
(2, 1, 3, '30 sec', '15 sec', 4), -- Push-ups
(2, 5, 3, '30 sec', '15 sec', 5), -- Glute Bridges

-- Beginner Flexibility (Template ID 3)
(3, 21, 1, '60 sec', '0 sec', 1), -- Cat-Cow Stretch
(3, 22, 1, '30 sec per side', '0 sec', 2), -- Hip Flexor Stretch
(3, 23, 1, '30 sec per side', '0 sec', 3), -- Hamstring Stretch
(3, 24, 1, '30 sec per side', '0 sec', 4), -- Shoulder Stretch
(3, 25, 1, '60 sec', '0 sec', 5), -- Child's Pose

-- Intermediate Upper Body (Template ID 4)
(4, 6, 4, '10', '90 sec', 1), -- Dumbbell Bench Press
(4, 7, 4, '10', '90 sec', 2), -- Dumbbell Rows
(4, 9, 3, '12', '60 sec', 3), -- Dumbbell Shoulder Press
(4, 1, 3, '15', '60 sec', 4), -- Push-ups
(4, 24, 1, '30 sec per side', '0 sec', 5), -- Shoulder Stretch

-- Intermediate Lower Body (Template ID 5)
(5, 8, 4, '10', '90 sec', 1), -- Goblet Squats
(5, 10, 4, '10', '90 sec', 2), -- Romanian Deadlift
(5, 3, 3, '12 per side', '60 sec', 3), -- Lunges
(5, 5, 3, '15', '60 sec', 4), -- Glute Bridges
(5, 22, 1, '30 sec per side', '0 sec', 5), -- Hip Flexor Stretch

-- Intermediate HIIT (Template ID 6)
(6, 16, 4, '40 sec', '20 sec', 1), -- Jumping Jacks
(6, 18, 4, '40 sec', '20 sec', 2), -- High Knees
(6, 19, 4, '40 sec', '20 sec', 3), -- Burpees
(6, 17, 4, '40 sec', '20 sec', 4), -- Mountain Climbers
(6, 8, 4, '40 sec', '20 sec', 5), -- Goblet Squats

-- Advanced Full Body (Template ID 7)
(7, 11, 4, '8', '120 sec', 1), -- Pull-ups
(7, 13, 3, '8', '120 sec', 2), -- Handstand Push-ups
(7, 12, 3, '8 per side', '120 sec', 3), -- Pistol Squats
(7, 19, 3, '15', '60 sec', 4), -- Burpees
(7, 10, 4, '10', '90 sec', 5), -- Romanian Deadlift

-- Advanced Upper/Lower Split (Template ID 8)
(8, 14, 4, '6', '120 sec', 1), -- Muscle-ups
(8, 15, 3, '8 per side', '120 sec', 2), -- One-arm Push-ups
(8, 9, 4, '8', '90 sec', 3), -- Dumbbell Shoulder Press
(8, 7, 4, '10', '90 sec', 4), -- Dumbbell Rows
(8, 24, 1, '30 sec per side', '0 sec', 5), -- Shoulder Stretch

-- Advanced HIIT (Template ID 9)
(9, 19, 5, '40 sec', '20 sec', 1), -- Burpees
(9, 18, 5, '40 sec', '20 sec', 2), -- High Knees
(9, 20, 5, '40 sec', '20 sec', 3), -- Jump Rope
(9, 12, 5, '40 sec', '20 sec', 4), -- Pistol Squats
(9, 17, 5, '40 sec', '20 sec', 5); -- Mountain Climbers

-- Insert a demo user
INSERT INTO users (name, email, password) 
VALUES ('Demo User', 'demo@workitout.com', '$2a$10$XFE.rRUde3NmU9bWqAo5B.V6oRUxVK6TGnQOKVOhVt9shvwqsJ3ge');

-- Get the demo user ID
SET @demo_user_id = LAST_INSERT_ID();

-- Insert predefined workouts for the demo user
INSERT INTO workouts (user_id, name, type, duration, exercises, template_id) VALUES
(@demo_user_id, 'Beginner Full Body', 'strength', '30 min', 
 '[{"name":"Push-ups","type":"strength","equipment":["none"],"targetMuscles":["chest","shoulders","triceps"],"sets":3,"reps":10},
   {"name":"Squats","type":"strength","equipment":["none"],"targetMuscles":["quadriceps","hamstrings","glutes"],"sets":3,"reps":12},
   {"name":"Plank","type":"strength","equipment":["none"],"targetMuscles":["core","shoulders"],"sets":3,"reps":"30 sec"},
   {"name":"Glute Bridges","type":"strength","equipment":["none"],"targetMuscles":["glutes","hamstrings"],"sets":3,"reps":15},
   {"name":"Cat-Cow Stretch","type":"mobility","equipment":["yoga-mat"],"targetMuscles":["back","core"],"sets":1,"reps":"30 sec"}]',
 1),
   
(@demo_user_id, 'Beginner HIIT', 'cardio', '20 min', 
 '[{"name":"Jumping Jacks","type":"cardio","equipment":["none"],"targetMuscles":["full-body"],"sets":3,"reps":"30 sec"},
   {"name":"Mountain Climbers","type":"cardio","equipment":["none"],"targetMuscles":["core","shoulders","quadriceps"],"sets":3,"reps":"30 sec"},
   {"name":"Squats","type":"strength","equipment":["none"],"targetMuscles":["quadriceps","hamstrings","glutes"],"sets":3,"reps":"30 sec"},
   {"name":"Push-ups","type":"strength","equipment":["none"],"targetMuscles":["chest","shoulders","triceps"],"sets":3,"reps":"30 sec"},
   {"name":"Glute Bridges","type":"strength","equipment":["none"],"targetMuscles":["glutes","hamstrings"],"sets":3,"reps":"30 sec"}]',
 2),
   
(@demo_user_id, 'Intermediate Upper Body', 'strength', '45 min', 
 '[{"name":"Dumbbell Bench Press","type":"strength","equipment":["dumbbells","bench"],"targetMuscles":["chest","shoulders","triceps"],"sets":4,"reps":10},
   {"name":"Dumbbell Rows","type":"strength","equipment":["dumbbells"],"targetMuscles":["back","biceps"],"sets":4,"reps":10},
   {"name":"Dumbbell Shoulder Press","type":"strength","equipment":["dumbbells"],"targetMuscles":["shoulders","triceps"],"sets":3,"reps":12},
   {"name":"Push-ups","type":"strength","equipment":["none"],"targetMuscles":["chest","shoulders","triceps"],"sets":3,"reps":15},
   {"name":"Shoulder Stretch","type":"mobility","equipment":["none"],"targetMuscles":["shoulders"],"sets":1,"reps":"30 sec per side"}]',
 4);

