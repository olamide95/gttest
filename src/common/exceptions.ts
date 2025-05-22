import {
    ConflictException,
    ForbiddenException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';

export const EmailAlreadyExistsException = () =>
    new ConflictException('email already exists');

export const AdminNotFoundException = () =>
    new NotFoundException('admin not found');

export const LoginCredentialsException = () =>
    new UnauthorizedException('login credentials are incorrect');

export const EmailTokenNotFoundException = () =>
    new NotFoundException('token not found');

export const AccountRecoveryTokenInvalidException = () =>
    new ForbiddenException('account recovery token is invalid or has expired');

export const ApplicationNotFoundException = () => {
    return new NotFoundException('application not found');
};

export const SchoolNotFoundException = () => {
    return new NotFoundException('school not found');
};

export const InvalidPasswordException = () => {
    return new NotFoundException('Invalid current password');
};
export const TeamMemberNotFoundException = () => {
    return new NotFoundException('member not found');
};
