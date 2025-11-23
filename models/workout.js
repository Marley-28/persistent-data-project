import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true       // e.g., "Push Ups"
  },
  muscleGroup: {
    type: String,
    required: true,      // Legs, Chest, Back, Shoulders, Arms, Core
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Moderate", "Hard"],
    required: true
  },
  description: {
    type: String,
    required: false       // e.g., "A basic upper body exercise..."
  },
  imageUrl: {
    type: String,
    required: false      // URL to an image representing the workout
  }
}, {
  timestamps: true       // adds createdAt and updatedAt automatically
});

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;