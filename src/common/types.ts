export interface SchoolInfoInterface {
    name: string;
    schoolType?: string;
    state: string;
    country: string;
    url: string;
    about: string;
    schoolId: string;
}

export interface ProgramInterface {
    _id: string;
    name: string;
    programType: string;
    duration: string;
    degreeType: string;
    classType: string;
    startDate: Date;
    about: string;
    tuitionFee: number;
    otherFee: number;
    currency: string;
    otherInformation: string;
    requiredDocuments: any[]; // You can replace `any` with appropriate type
    offCampus: boolean;
    onCampus: boolean;
    needBasedScholarship: boolean;
    meritBasedScholarship: boolean;
}

export interface SchoolInterface {
    info: SchoolInfoInterface;
    programs: ProgramInterface[];
}
