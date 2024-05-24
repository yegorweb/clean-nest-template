import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class RolesService {
  getIdFromRole(role: string): string {
    return role.split('-')[2]
  }

  getObjectIdFromRole(role: string): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(this.getIdFromRole(role))
  }

  getOrgIdsFromRoles(roles: string[]): string[] {
    return roles
      .filter(role => role.includes('org-admin-'))
      .map(role => this.getIdFromRole(role))
  }

  getOrgIdFromRole(role: string): string {
    return role.split('org-admin-')[1]
  }

  getOrgObjectIdsFromRoles(roles: string[]): mongoose.Types.ObjectId[] {
    return this.getOrgIdsFromRoles(roles).map(item => new mongoose.Types.ObjectId(item))
  }

  getOrgObjectIdFromRole(role: string): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(role.split('org-admin-')[1])
  }

  isAdminOfOrg(roles: string[], org_id: string): boolean {
    return roles.includes(`org-admin-${org_id}`)
  }

  getRolesWithOrg(roles: string[], org_id: string): string[] {
    roles.push(`org-admin-${org_id}`)
    return roles
  }

  getRolesWithoutOrg(roles: string[], org_id: string): string[] {
    return roles.filter(role => !role.includes(`org-admin-${org_id}`))
  }

  isSomeAdmin(roles: string[]): boolean {
    return roles.some(role => role.split('-')[1] === 'admin')
  }

  isGlobalAdmin(roles: string[]) {
    return roles.includes('global-admin')
  }  

  getType(roles: string[]): string {
    if (this.isGlobalAdmin(roles))
      return 'глобальный админ'
      
    if (this.isSomeAdmin(roles))
      return 'админ'
      
    return 'пользователь'
  }
}
