// src/recipes/recipes.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

describe('RecipesController', () => {
  let controller: RecipesController;
  let service: RecipesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [RecipesService],
    }).compile();

    controller = module.get<RecipesController>(RecipesController);
    service = module.get<RecipesService>(RecipesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add more tests as needed
});
