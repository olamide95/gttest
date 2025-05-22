import { Test, TestingModule } from '@nestjs/testing';
import { SchoolMgmtController } from './school-mgmt.controller';

describe('SchoolMgmtController', () => {
    let controller: SchoolMgmtController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SchoolMgmtController],
        }).compile();

        controller = module.get<SchoolMgmtController>(SchoolMgmtController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
