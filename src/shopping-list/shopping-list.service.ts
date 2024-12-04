// src/shopping-list/shopping-list.service.ts
import { Injectable } from '@nestjs/common';
import { ShoppingListSchema } from './schemas';
import { z } from 'zod';

@Injectable()
export class ShoppingListService {
    private shoppingLists: z.infer<typeof ShoppingListSchema>[] = [];

    // Create shopping list based on recipes
    createShoppingList(recipes: any[]) {
        // Consolidate ingredients from all recipes
        const consolidated: Record<string, Record<string, any>> = {};

        recipes.forEach(recipe => {
            recipe.ingredients.forEach(ingredient => {
                const key = `${ingredient.name}-${ingredient.unit}`;
                if (!consolidated[ingredient.section]) {
                    consolidated[ingredient.section] = {};
                }
                if (consolidated[ingredient.section][key]) {
                    consolidated[ingredient.section][key].quantity += ingredient.quantity;
                    consolidated[ingredient.section][key].estimatedCost += ingredient.estimatedCost;
                } else {
                    consolidated[ingredient.section][key] = { ...ingredient };
                }
            });
        });

        // Transform consolidated data into ShoppingListSchema
        const shoppingList: z.infer<typeof ShoppingListSchema>[] = Object.entries(consolidated).map(
            ([section, items]) => ({
                section,
                items: Object.values(items),
            }),
        );

        this.shoppingLists = shoppingList;
        return this.shoppingLists;
    }

    // Retrieve shopping list
    getShoppingList() {
        return this.shoppingLists;
    }
}
