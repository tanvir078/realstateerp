import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UserRole } from '../../modules/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest<{ method: string; user?: { role?: UserRole } }>();
    const user = request.user;
    if (user?.role === UserRole.VIEWER && request.method !== 'GET') {
      throw new ForbiddenException('Viewer access is read-only');
    }
    if (!requiredRoles?.length) return true;
    if (user?.role && requiredRoles.includes(user.role)) return true;
    throw new ForbiddenException('You do not have permission to perform this action');
  }
}
