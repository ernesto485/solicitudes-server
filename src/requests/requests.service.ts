import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request, RequestStatus } from './entities/request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private requestsRepository: Repository<Request>,
  ) {}

  async create(createRequestDto: CreateRequestDto, userId: number) {
    const request = this.requestsRepository.create({
      ...createRequestDto,
      userId,
      status: RequestStatus.PENDING,
    });
    return this.requestsRepository.save(request);
  }

  findAll(user: any) {
    if (user.role === 'ADMIN') {
      return this.requestsRepository.find({
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
    }
    
    // Regular users can only see their own requests
    return this.requestsRepository.find({
      where: { userId: user.id },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.requestsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async update(id: number, updateRequestDto: UpdateRequestDto, user: any, requestEntity?: Request) {
    const request = requestEntity || await this.findOne(id);
    
    if (!request) {
      throw new ForbiddenException('Request not found');
    }

    // Check if user is trying to update description
    if (updateRequestDto.description) {
      // Only owner can update description and only if status is PENDING
      if (request.userId !== user.id) {
        throw new ForbiddenException('Only the request owner can update the description');
      }
      
      if (request.status !== RequestStatus.PENDING) {
        throw new ForbiddenException('Description can only be updated when status is PENDING');
      }
    }

    // Check if user is trying to update status
    if (updateRequestDto.status) {
      // Only ADMIN can change status
      if (user.role !== 'ADMIN') {
        throw new ForbiddenException('Only ADMIN users can change the status');
      }
    }

    return this.requestsRepository.update(id, updateRequestDto);
  }

  // Requests are never deleted according to requirements
  // remove(id: number) {
  //   return this.requestsRepository.delete(id);
  // }
}
