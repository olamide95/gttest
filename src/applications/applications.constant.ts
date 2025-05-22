import { SchoolApplicationDocumentType } from './applications.enum';

export const SCHOOL_APPLICATION_DOCUMENTS = {
    passportPhoto: SchoolApplicationDocumentType.PASSPORT_PHOTO,
    waecResult: SchoolApplicationDocumentType.WAEC_RESULT,
    waecScratchCard: SchoolApplicationDocumentType.WAEC_SCRATCH_CARD,
    unofficialTranscript: SchoolApplicationDocumentType.UNOFFICIAL_TRANSCRIPT,
    aLevelResult: SchoolApplicationDocumentType.A_LEVEL_RESULT,
    bachelorDegree: SchoolApplicationDocumentType.BACHELOR_DEGREE,
    masterDegree: SchoolApplicationDocumentType.MASTER_DEGREE,
    others: SchoolApplicationDocumentType.OTHERS,
};
