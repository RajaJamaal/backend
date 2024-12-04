// src/graph/graph.module.ts
import { Module } from '@nestjs/common';
import { GraphController } from './graphs.controller';
import { GraphService } from './graphs.service';
import { UsersModule } from '../users/users.module';
import { RecipesModule } from '../recipes/recipes.module';
import { ShoppingListModule } from '../shopping-list/shopping-list.module';

@Module({
  imports: [UsersModule, RecipesModule, ShoppingListModule],
  controllers: [GraphController],
  providers: [GraphService],
})
export class GraphModule { }
