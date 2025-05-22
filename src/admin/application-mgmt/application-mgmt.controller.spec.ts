import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationMgmtController } from './application-mgmt.controller';

describe('ApplicationMgmtController', () => {
    let controller: ApplicationMgmtController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ApplicationMgmtController],
        }).compile();

        controller = module.get<ApplicationMgmtController>(
            ApplicationMgmtController,
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
