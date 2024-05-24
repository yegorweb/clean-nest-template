import { Injectable } from '@nestjs/common';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UserService {
  constructor(
    private RolesService: RolesService
  ) {}


}
