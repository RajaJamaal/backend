// src/graph/graph.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { GraphService } from './graphs.service';
import { UsersService } from '../users/users.service';
import { RecipesService } from '../recipes/recipes.service';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

describe('GraphService', () => {
  let service: GraphService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GraphService,
        UsersService,
        RecipesService,
        ShoppingListService,
      ],
    }).compile();

    service = module.get<GraphService>(GraphService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add more tests as needed
});
