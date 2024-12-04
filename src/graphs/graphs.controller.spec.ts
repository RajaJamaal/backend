// src/graph/graph.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { GraphController } from './graphs.controller';
import { GraphService } from './graphs.service';
import { UsersService } from '../users/users.service';
import { RecipesService } from '../recipes/recipes.service';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

describe('GraphController', () => {
  let controller: GraphController;
  let service: GraphService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GraphController],
      providers: [
        GraphService,
        UsersService,
        RecipesService,
        ShoppingListService,
      ],
    }).compile();

    controller = module.get<GraphController>(GraphController);
    service = module.get<GraphService>(GraphService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add more tests as needed
});
