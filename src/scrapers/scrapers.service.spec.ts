import { Test, TestingModule } from '@nestjs/testing';
import { ScrapersService } from './scrapers.service';

describe('ScrapersService', () => {
  let service: ScrapersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapersService],
    }).compile();

    service = module.get<ScrapersService>(ScrapersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
