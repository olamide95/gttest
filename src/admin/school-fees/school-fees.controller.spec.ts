import { Test, TestingModule } from '@nestjs/testing';
import { SchoolFeesController } from './school-fees.controller';

describe('SchoolFeesController', () => {
    let controller: SchoolFeesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SchoolFeesController],
        }).compile();

        controller = module.get<SchoolFeesController>(SchoolFeesController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
