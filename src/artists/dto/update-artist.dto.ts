import { CreateArtistDto } from './create-artist.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';

export class UpdateArtistDto implements Partial<CreateArtistDto> {
  @ApiProperty({
    example: faker.name.fullName(),
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    example: faker.datatype.boolean(),
  })
  @IsOptional()
  @IsBoolean()
  grammy: boolean;

  @IsOptional()
  @IsBoolean()
  isFavorite: boolean;
}
