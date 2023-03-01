import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateArtistDto } from './dto/create-artist.dto';
import { IdParamDto } from '../common/dto/id-param.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistsEntity } from './entities/artists.entity';

@ApiTags('Artists')
@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  async findAll(): Promise<ArtistsEntity[]> {
    return await this.artistsService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params: IdParamDto): Promise<ArtistsEntity> {
    return await this.artistsService.findOne(params);
  }

  @Post()
  async create(@Body() body: CreateArtistDto): Promise<ArtistsEntity> {
    return await this.artistsService.create(body);
  }

  @Put(':id')
  async update(
    @Param() params: IdParamDto,
    @Body() body: UpdateArtistDto,
  ): Promise<ArtistsEntity> {
    return await this.artistsService.update(params, body);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param() params: IdParamDto): Promise<void> {
    return await this.artistsService.delete(params);
  }
}
