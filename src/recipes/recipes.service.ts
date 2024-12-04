// src/recipes/recipes.service.ts
import { Injectable } from '@nestjs/common';
import { RecipeSchema } from './schemas';
import { z } from 'zod';

@Injectable()
export class RecipesService {
    private recipes: z.infer<typeof RecipeSchema>[] = [];

    // Mock recipe generation based on user preferences
    generateRecipes(preferences: any) {
        // In a real application, integrate with LangChain or another AI model
        // Here, we'll use mock data

        const mockRecipes: z.infer<typeof RecipeSchema>[] = [
            {
                name: 'Vegan Spinach Salad',
                calories: 480,
                protein: 28,
                ingredients: [
                    {
                        name: 'Spinach',
                        quantity: 100,
                        unit: 'g',
                        section: 'Produce',
                        estimatedCost: 2,
                    },
                    {
                        name: 'Tomatoes',
                        quantity: 150,
                        unit: 'g',
                        section: 'Produce',
                        estimatedCost: 3,
                    },
                    {
                        name: 'Quinoa',
                        quantity: 50,
                        unit: 'g',
                        section: 'Pantry',
                        estimatedCost: 1.5,
                    },
                ],
                prepTime: 10,
                cookTime: 0,
                totalTime: 10,
                estimatedCost: 6.5,
                instructions: [
                    'Wash and chop the spinach.',
                    'Slice the tomatoes.',
                    'Cook the quinoa as per package instructions.',
                    'Combine all ingredients in a bowl and serve.',
                ],
                dietaryTags: ['Vegan', 'Gluten-Free'],
                allergens: [],
            },
            // Add more mock recipes as needed
        ];

        this.recipes = mockRecipes;
        return this.recipes;
    }

    // Retrieve all recipes
    getAllRecipes() {
        return this.recipes;
    }
}
