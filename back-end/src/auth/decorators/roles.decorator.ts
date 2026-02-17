import { SetMetadata } from '@nestjs/common';

// This 'roles' string must match the key used in your RolesGuard (this.reflector.get('roles', ...))
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
