// src/shopping-list/shopping-list.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { ShoppingListService } from './shopping-list.service';
import { ShoppingListSchema } from './schemas';
import { z } from 'zod';

@Controller('shopping-list')
export class ShoppingListController {
    constructor(private readonly shoppingListService: ShoppingListService) { }

    // Endpoint to create shopping list based on recipes
    @Post('create')
    create(@Body() body: any) {
        // Validate recipes if necessary
        // For simplicity, assume body contains an array of recipes
        return this.shoppingListService.createShoppingList(body.recipes);
    }

    // Endpoint to retrieve shopping list
    @Get()
    get() {
        return this.shoppingListService.getShoppingList();
    }
}
