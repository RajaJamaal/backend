// src/graph/graph.ts
import { Annotation } from "@langchain/langgraph";
import { StateGraph, __end__, __start__ } from "@langchain/langgraph";
import { z } from "zod";
import { RunnableConfig } from "@langchain/core/runnables";
import { BaseMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/chat_models/openai"; // Correct import

// Define the Recipe schema
export const RecipeSchema = z.object({
    name: z.string(),
    calories: z.number(),
    protein: z.number(),
    ingredients: z.array(z.object({
        name: z.string(),
        quantity: z.number(),
        unit: z.string(),
        section: z.string(), // grocery store section
        estimatedCost: z.number()
    })),
    prepTime: z.number(),
    cookTime: z.number(),
    totalTime: z.number(),
    estimatedCost: z.number(),
    instructions: z.array(z.string()),
    dietaryTags: z.array(z.string()),
    allergens: z.array(z.string())
});

// Define the ValidationRule schema
export const ValidationRuleSchema = z.object({
    rule: z.string(),
    passed: z.boolean(),
    details: z.string()
});

// Define the ShoppingList schema
export const ShoppingListSchema = z.object({
    section: z.string(),
    items: z.array(z.object({
        name: z.string(),
        quantity: z.number(),
        unit: z.string(),
        estimatedCost: z.number()
    }))
});

// Define the state schema
export const MealPlanningStateAnnotation = Annotation.Root({
    messages: Annotation<BaseMessage[]>(),
    userPreferences: Annotation<{
        caloriesPerMeal: number;
        proteinPerMeal: number;
        allergens: string[];
        dietaryPreferences: string[];
        likedFoods: string[];
        dislikedFoods: string[];
        location: string; // for seasonal foods
    }>(),
    recipes: Annotation<z.infer<typeof RecipeSchema>[]>(),
    validationRules: Annotation<z.infer<typeof ValidationRuleSchema>[]>(),
    shoppingList: Annotation<z.infer<typeof ShoppingListSchema>[]>()
});

// Agent Functions
async function generateRecipes(
    state: typeof MealPlanningStateAnnotation.State,
    config: RunnableConfig
): Promise<typeof MealPlanningStateAnnotation.Update> {
    const model = new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: "gpt-3.5-turbo" // or "gpt-4" if available
    });

    const prompt = `Generate a week's worth of recipes based on the following requirements:
    - Calories per meal: ${state.userPreferences.caloriesPerMeal}
    - Protein per meal: ${state.userPreferences.proteinPerMeal}
    - Allergens to avoid: ${state.userPreferences.allergens.join(", ")}
    - Dietary preferences: ${state.userPreferences.dietaryPreferences.join(", ")}
    - Liked foods: ${state.userPreferences.likedFoods.join(", ")}
    - Disliked foods: ${state.userPreferences.dislikedFoods.join(", ")}
    - Location (for seasonal foods): ${state.userPreferences.location}
  
  Please provide the recipes in JSON format adhering to the RecipeSchema defined.`;

    const response = await model.call(prompt);

    // Attempt to parse the response as JSON
    let recipes: z.infer<typeof RecipeSchema>[] = [];
    try {
        recipes = JSON.parse(response.text);
    } catch (error) {
        console.error("Failed to parse recipes:", error);
        // Handle parsing error, possibly return empty or mock data
    }

    return { recipes };
}

async function validateRecipes(
    state: typeof MealPlanningStateAnnotation.State,
    config: RunnableConfig
): Promise<typeof MealPlanningStateAnnotation.Update> {
    const model = new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: "gpt-3.5-turbo"
    });

    const validationRules = state.recipes.map(recipe => {
        const rules = [
            {
                rule: "Caloric Requirement",
                passed: Math.abs(recipe.calories - state.userPreferences.caloriesPerMeal) <= (state.userPreferences.caloriesPerMeal * 0.1),
                details: `Recipe calories: ${recipe.calories}, Required: ${state.userPreferences.caloriesPerMeal}`
            },
            {
                rule: "Protein Requirement",
                passed: Math.abs(recipe.protein - state.userPreferences.proteinPerMeal) <= (state.userPreferences.proteinPerMeal * 0.1),
                details: `Recipe protein: ${recipe.protein}, Required: ${state.userPreferences.proteinPerMeal}`
            },
            {
                rule: "Allergen Free",
                passed: !recipe.allergens.some(allergen => state.userPreferences.allergens.includes(allergen)),
                details: `Recipe allergens: ${recipe.allergens.join(", ")}`
            },
            {
                rule: "Dietary Preferences",
                passed: state.userPreferences.dietaryPreferences.every(pref => recipe.dietaryTags.includes(pref)),
                details: `Recipe tags: ${recipe.dietaryTags.join(", ")}`
            },
            {
                rule: "Avoid Disliked Foods",
                passed: !recipe.ingredients.some(ing => state.userPreferences.dislikedFoods.includes(ing.name)),
                details: `Recipe ingredients: ${recipe.ingredients.map(ing => ing.name).join(", ")}`
            }
        ];
        return rules;
    }).flat();

    return { validationRules };
}

async function editRecipes(
    state: typeof MealPlanningStateAnnotation.State,
    config: RunnableConfig
): Promise<typeof MealPlanningStateAnnotation.Update> {
    const model = new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: "gpt-3.5-turbo"
    });

    const failedRules = state.validationRules.filter(rule => !rule.passed);
    const prompt = `Edit the following recipes to fix the specified rule violations:
    ${failedRules.map(rule => `- ${rule.rule}: ${rule.details}`).join("\n")}
    
    Current recipes: ${JSON.stringify(state.recipes, null, 2)}
  
  Please provide the updated recipes in JSON format adhering to the RecipeSchema defined.`;

    const response = await model.call(prompt);

    let editedRecipes: z.infer<typeof RecipeSchema>[] = [];
    try {
        editedRecipes = JSON.parse(response.text);
    } catch (error) {
        console.error("Failed to parse edited recipes:", error);
    }

    return { recipes: editedRecipes };
}

async function createShoppingList(
    state: typeof MealPlanningStateAnnotation.State,
    config: RunnableConfig
): Promise<typeof MealPlanningStateAnnotation.Update> {
    // No need for AI interaction here; handle shopping list creation programmatically

    // Consolidate ingredients across all recipes
    const allIngredients = state.recipes.flatMap(recipe => recipe.ingredients);

    // Group by grocery store section
    const shoppingList = Object.entries(
        allIngredients.reduce((acc, ing) => {
            if (!acc[ing.section]) {
                acc[ing.section] = [];
            }
            acc[ing.section].push(ing);
            return acc;
        }, {} as Record<string, typeof allIngredients>)
    ).map(([section, items]) => ({
        section,
        items: items.reduce((acc, item) => {
            const existing = acc.find(i => i.name === item.name && i.unit === item.unit);
            if (existing) {
                existing.quantity += item.quantity;
                existing.estimatedCost += item.estimatedCost;
            } else {
                acc.push({ ...item });
            }
            return acc;
        }, [] as typeof items)
    }));

    return { shoppingList };
}

// Define the workflow
function checkValidation(
    state: typeof MealPlanningStateAnnotation.State
): "editRecipes" | "createShoppingList" {
    const allRulesPassed = state.validationRules.every(rule => rule.passed);
    return allRulesPassed ? "createShoppingList" : "editRecipes";
}

// Create the graph
const builder = new StateGraph({
    stateSchema: MealPlanningStateAnnotation
})
    .addNode("generateRecipes", generateRecipes)
    .addNode("validateRecipes", validateRecipes)
    .addNode("editRecipes", editRecipes)
    .addNode("createShoppingList", createShoppingList)
    .addEdge("__start__", "generateRecipes") // Use '__start__' as per error message
    .addEdge("generateRecipes", "validateRecipes")
    .addConditionalEdges(
        "validateRecipes",
        checkValidation,
        [
            ["editRecipes", "validateRecipes"] as const, // Type assertion
            ["createShoppingList", "__end__"] as const
        ]
    );

export const graph = builder.compile();
