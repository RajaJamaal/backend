// src/shopping-list/schemas.ts
import { z } from 'zod';

export const ShoppingListItemSchema = z.object({
    name: z.string(),
    quantity: z.number(),
    unit: z.string(),
    estimatedCost: z.number(),
});

export const ShoppingListSchema = z.object({
    section: z.string(),
    items: z.array(ShoppingListItemSchema),
});
