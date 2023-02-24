import { CreateAlbumDto } from './create-album.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateAlbumDto implements Partial<CreateAlbumDto> {
  @ApiPropertyOptional({ example: faker.datatype.uuid() })
  @IsOptional()
  @IsUUID()
  artistId: string | null;

  @ApiProperty({
    example: faker.music.songName(),
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    example: faker.date.past().getFullYear(),
  })
  @IsOptional()
  @IsNumber()
  year: number;

  @IsOptional()
  @IsBoolean()
  isFavorite: boolean;
}
