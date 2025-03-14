import { Permissions } from "../enums/role.enum.js";
import { UnauthorizedException } from "./appError.js";
import { RolePermissions } from "./role-permission.js";

export const roleGuard = (role, requiredPermissions) => {
  const permissions = RolePermissions[role];

  if (!permissions) {
    throw new UnauthorizedException("Invalid role specified");
  }

  const hasPermission = requiredPermissions.every((permission) =>
    permissions.includes(permission)
  );

  if (!hasPermission) {
    throw new UnauthorizedException(
      "You do not have the necessary permissions to perform this action"
    );
  }
};
