import { Test, TestingModule } from '@nestjs/testing';
import { SchoolFeesService } from './school-fees.service';

describe('SchoolMgmtService', () => {
    let service: SchoolFeesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SchoolFeesService],
        }).compile();

        service = module.get<SchoolFeesService>(SchoolFeesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
