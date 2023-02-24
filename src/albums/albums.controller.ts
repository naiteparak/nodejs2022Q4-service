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
import { ApiTags } from '@nestjs/swagger';
import { AlbumsService } from './albums.service';
import { IdParamDto } from '../common/id-param.dto';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumsEntity } from './entities/albums.entity';

@ApiTags('Albums')
@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  async findAll(): Promise<AlbumsEntity[]> {
    return await this.albumsService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params: IdParamDto): Promise<AlbumsEntity> {
    return await this.albumsService.findOne(params);
  }

  @Post()
  async create(@Body() body: CreateAlbumDto): Promise<AlbumsEntity> {
    return await this.albumsService.create(body);
  }

  @Put(':id')
  async update(
    @Param() params: IdParamDto,
    @Body() body: UpdateAlbumDto,
  ): Promise<AlbumsEntity> {
    return await this.albumsService.update(params, body);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param() params: IdParamDto): Promise<void> {
    return this.albumsService.delete(params);
  }
}
