import { Test, TestingModule } from '@nestjs/testing';
import { TypePropertiesService } from './type-properties.service';

describe('TypePropertiesService', () => {
  let service: TypePropertiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypePropertiesService],
    }).compile();

    service = module.get<TypePropertiesService>(TypePropertiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
