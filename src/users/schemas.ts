// src/users/schemas.ts
import { z } from 'zod';

// Schema for user registration
export const UserRegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3),
});

// Schema for user preferences
export const UserPreferencesSchema = z.object({
  email: z.string().email(), // To associate preferences with a user
  dietaryPreferences: z.array(z.string()),
  allergens: z.array(z.string()),
  likedIngredients: z.array(z.string()),
  dislikedIngredients: z.array(z.string()),
  caloriesPerMeal: z.number().min(200).max(2000),
  proteinPerMeal: z.number().min(10).max(100),
  location: z.string(),
});
