import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { CreateTrackDto } from './create-track.dto';

export class UpdateTrackDto implements Partial<CreateTrackDto> {
  @ApiProperty({
    example: faker.music.songName(),
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    example: faker.datatype.uuid(),
  })
  @IsOptional()
  @IsUUID()
  artistId: string | null;

  @ApiProperty({
    example: faker.datatype.uuid(),
  })
  @IsOptional()
  @IsUUID()
  albumId: string | null;

  @ApiProperty({
    example: faker.datatype.number({ min: 30, max: 6000 }),
  })
  @IsOptional()
  @IsNumber()
  duration: number;

  @IsOptional()
  @IsBoolean()
  isFavorite: boolean;
}
