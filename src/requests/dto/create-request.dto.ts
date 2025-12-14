import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestDto {
  @ApiProperty({
    description: 'The title of the request',
    example: 'Request for new equipment',
  })
  title: string;

  @ApiProperty({
    description: 'The description of the request',
    example: 'I need a new laptop for my work tasks',
  })
  description: string;
}
