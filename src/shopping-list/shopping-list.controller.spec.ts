// src/shopping-list/shopping-list.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingListController } from './shopping-list.controller';
import { ShoppingListService } from './shopping-list.service';

describe('ShoppingListController', () => {
  let controller: ShoppingListController;
  let service: ShoppingListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingListController],
      providers: [ShoppingListService],
    }).compile();

    controller = module.get<ShoppingListController>(ShoppingListController);
    service = module.get<ShoppingListService>(ShoppingListService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add more tests as needed
});
