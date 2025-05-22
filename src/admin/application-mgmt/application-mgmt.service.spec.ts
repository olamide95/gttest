import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationMgmtService } from './application-mgmt.service';

describe('ApplicationMgmtService', () => {
    let service: ApplicationMgmtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ApplicationMgmtService],
        }).compile();

        service = module.get<ApplicationMgmtService>(ApplicationMgmtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
