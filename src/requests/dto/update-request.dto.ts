import { PartialType } from '@nestjs/mapped-types';
import { CreateRequestDto } from './create-request.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RequestStatus } from '../entities/request.entity';

export class UpdateRequestDto extends PartialType(CreateRequestDto) {
  @ApiPropertyOptional({
    description: 'The description of the request (only editable when status is PENDING)',
    example: 'Updated description with more details',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'The status of the request (only ADMIN can change)',
    enum: RequestStatus,
    example: RequestStatus.IN_PROGRESS,
  })
  status?: RequestStatus;
}
