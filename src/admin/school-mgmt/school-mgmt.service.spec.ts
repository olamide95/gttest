import { Test, TestingModule } from '@nestjs/testing';
import { SchoolMgmtService } from './school-mgmt.service';

describe('SchoolMgmtService', () => {
    let service: SchoolMgmtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SchoolMgmtService],
        }).compile();

        service = module.get<SchoolMgmtService>(SchoolMgmtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
