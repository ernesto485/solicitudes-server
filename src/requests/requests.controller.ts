import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { RequestOwnerGuard } from './guards/request-owner.guard';

@ApiTags('requests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new request' })
  @ApiResponse({ status: 201, description: 'Request successfully created.' })
  create(@Body() createRequestDto: CreateRequestDto, @Request() req: any) {
    return this.requestsService.create(createRequestDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all requests' })
  @ApiResponse({ status: 200, description: 'Requests retrieved successfully.' })
  findAll(@Request() req: any) {
    return this.requestsService.findAll(req.user);
  }

  @Get(':id')
  @UseGuards(RequestOwnerGuard)
  @ApiOperation({ summary: 'Get request by ID' })
  @ApiResponse({ status: 200, description: 'Request retrieved successfully.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RequestOwnerGuard)
  @ApiOperation({ summary: 'Update request' })
  @ApiResponse({ status: 200, description: 'Request successfully updated.' })
  @ApiResponse({ status: 403, description: 'Access denied or invalid operation.' })
  update(
    @Param('id') id: string, 
    @Body() updateRequestDto: UpdateRequestDto, 
    @Request() req: any
  ) {
    return this.requestsService.update(+id, updateRequestDto, req.user, req.requestEntity);
  }

  // Note: Delete endpoint is intentionally removed as requests are never deleted
}
