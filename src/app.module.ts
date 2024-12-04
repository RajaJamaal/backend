import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RecipesModule } from './recipes/recipes.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { GraphModule } from './graphs/graphs.module';

@Module({
  imports: [UsersModule, RecipesModule, ShoppingListModule, GraphModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
