import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RequestsService } from '../requests.service';

@Injectable()
export class RequestOwnerGuard implements CanActivate {
  constructor(private requestsService: RequestsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const requestId = request.params.id;

    if (!user || !requestId) {
      throw new ForbiddenException('Access denied');
    }

    const requestEntity = await this.requestsService.findOne(requestId);
    
    if (!requestEntity) {
      throw new ForbiddenException('Request not found');
    }

    // Allow access if user is owner or admin
    if (requestEntity.userId === user.id || user.role === 'ADMIN') {
      request.requestEntity = requestEntity; // Attach request entity to request for later use
      return true;
    }

    throw new ForbiddenException('You can only access your own requests');
  }
}
