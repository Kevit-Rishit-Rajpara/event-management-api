import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Roles decorator
 * Specify required roles for a route
 * @param roles - Required roles
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
