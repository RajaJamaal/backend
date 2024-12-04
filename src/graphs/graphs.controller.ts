// src/graph/graph.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { GraphService } from './graphs.service';

@Controller('graph')
export class GraphController {
    constructor(private readonly graphService: GraphService) { }

    // Endpoint to execute the workflow
    @Post('execute')
    async execute(@Body() body: any) {
        const { preferences } = body;
        if (!preferences || !preferences.email) {
            return { success: false, message: 'User preferences with email are required.' };
        }

        try {
            const result = await this.graphService.executeWorkflow(preferences);
            return result;
        } catch (error) {
            console.error('Graph execution error:', error);
            return { success: false, message: 'An error occurred during workflow execution.' };
        }
    }
}
