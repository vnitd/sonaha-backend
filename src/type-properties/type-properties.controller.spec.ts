import { Test, TestingModule } from '@nestjs/testing';
import { TypePropertiesController } from './type-properties.controller';

describe('TypePropertiesController', () => {
  let controller: TypePropertiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypePropertiesController],
    }).compile();

    controller = module.get<TypePropertiesController>(TypePropertiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
