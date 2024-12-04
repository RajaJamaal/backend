// src/graph/graph.service.ts
import { Injectable } from '@nestjs/common';
import { graph, MealPlanningStateAnnotation } from './graph';
import { UsersService } from '../users/users.service';
import { RecipesService } from '../recipes/recipes.service';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class GraphService {
    constructor(
        private readonly usersService: UsersService,
        private readonly recipesService: RecipesService,
        private readonly shoppingListService: ShoppingListService,
    ) { }

    // Execute the workflow based on user preferences
    async executeWorkflow(preferences: any) {
        // 1. Register the user if not already registered
        const userProfile = this.usersService.getUser(preferences.email);
        if (!userProfile.success) {
            const registerResponse = this.usersService.register({
                email: preferences.email,
                username: preferences.username || 'defaultUser',
                password: preferences.password || 'defaultPass123', // In real app, handle passwords securely
            });

            if (!registerResponse.success) {
                return { success: false, message: registerResponse.message };
            }
        }

        // 2. Set user preferences
        const setPrefResponse = this.usersService.setPreferences(preferences);
        if (!setPrefResponse.success) {
            return { success: false, message: setPrefResponse.message };
        }

        // 3. Build initial state for the graph
        const initialState: typeof MealPlanningStateAnnotation.State = {
            messages: [],
            userPreferences: {
                caloriesPerMeal: preferences.caloriesPerMeal,
                proteinPerMeal: preferences.proteinPerMeal,
                allergens: preferences.allergens,
                dietaryPreferences: preferences.dietaryPreferences,
                likedFoods: preferences.likedIngredients,
                dislikedFoods: preferences.dislikedIngredients,
                location: preferences.location,
            },
            recipes: [],
            validationRules: [],
            shoppingList: [],
        };

        // 4. Execute the graph workflow
        const workflowResult = await (graph as any).run(initialState, { configurable: { model: 'anthropic/claude-3-haiku-20240307' } }); // Type casting

        if (!workflowResult.success) {
            return { success: false, message: workflowResult.message, validation: workflowResult.validation };
        }

        return {
            success: true,
            recipes: workflowResult.recipes,
            shoppingList: workflowResult.shoppingList
        };
    }
}
