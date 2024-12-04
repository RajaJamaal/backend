// src/users/users.controller.ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { UsersService, User } from './users.service'; // Import User interface
import { UserRegistrationSchema, UserPreferencesSchema } from './schemas';
import { z } from 'zod';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // Endpoint for user registration
    @Post('register')
    register(@Body() body: any) {
        const result = UserRegistrationSchema.safeParse(body);
        if (!result.success) {
            return { success: false, errors: result.error.errors };
        }
        return this.usersService.register(result.data);
    }

    // Endpoint to set user preferences
    @Post('preferences')
    setPreferences(@Body() body: any) {
        const result = UserPreferencesSchema.safeParse(body);
        if (!result.success) {
            return { success: false, errors: result.error.errors };
        }
        return this.usersService.setPreferences(result.data);
    }

    // Endpoint to get user profile
    @Get('profile')
    getProfile(@Query('email') email: string): { success: boolean; data?: User; message?: string } {
        if (!email) {
            return { success: false, message: 'Email query parameter is required.' };
        }
        return this.usersService.getUser(email);
    }
}
