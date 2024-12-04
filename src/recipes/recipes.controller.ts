// src/recipes/recipes.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipeSchema } from './schemas';
import { z } from 'zod';

@Controller('recipes')
export class RecipesController {
    constructor(private readonly recipesService: RecipesService) { }

    // Endpoint to generate recipes based on user preferences
    @Post('generate')
    generate(@Body() body: any) {
        // Validate preferences (you can define a separate schema if needed)
        // For simplicity, assume body contains necessary preferences
        return this.recipesService.generateRecipes(body);
    }

    // Endpoint to retrieve all recipes
    @Get()
    getAll() {
        return this.recipesService.getAllRecipes();
    }
}
