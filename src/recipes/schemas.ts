// src/recipes/schemas.ts
import { z } from 'zod';

export const IngredientSchema = z.object({
    name: z.string(),
    quantity: z.number(),
    unit: z.string(),
    section: z.string(), // grocery store section
    estimatedCost: z.number(),
});

export const RecipeSchema = z.object({
    name: z.string(),
    calories: z.number(),
    protein: z.number(),
    ingredients: z.array(IngredientSchema),
    prepTime: z.number(), // in minutes
    cookTime: z.number(), // in minutes
    totalTime: z.number(), // in minutes
    estimatedCost: z.number(),
    instructions: z.array(z.string()),
    dietaryTags: z.array(z.string()),
    allergens: z.array(z.string()),
});
