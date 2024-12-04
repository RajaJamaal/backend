// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { UserRegistrationSchema, UserPreferencesSchema } from './schemas';

export interface User {
    email: string;
    password: string;
    username: string;
    preferences?: UserPreferences;
}

export interface UserPreferences {
    dietaryPreferences: string[];
    allergens: string[];
    likedIngredients: string[];
    dislikedIngredients: string[];
    caloriesPerMeal: number;
    proteinPerMeal: number;
    location: string;
}

@Injectable()
export class UsersService {
    private users: User[] = [];

    // Register a new user
    register(userData: z.infer<typeof UserRegistrationSchema>) {
        const existingUser = this.users.find(user => user.email === userData.email);
        if (existingUser) {
            return { success: false, message: 'User with this email already exists.' };
        }
        this.users.push(userData as User); // Ensures TypeScript recognizes it as User
        return { success: true, message: 'User registered successfully.' };
    }

    // Set user preferences
    setPreferences(preferences: z.infer<typeof UserPreferencesSchema>) {
        const user = this.users.find(user => user.email === preferences.email);
        if (!user) {
            return { success: false, message: 'User not found.' };
        }
        user.preferences = { ...preferences };
        return { success: true, message: 'Preferences set successfully.' };
    }

    // Get user profile
    getUser(email: string) {
        const user = this.users.find(user => user.email === email);
        if (user) {
            return { success: true, data: user };
        }
        return { success: false, message: 'User not found.' };
    }
}
