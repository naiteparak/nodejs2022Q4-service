import { Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IdParamDto } from '../common/id-param.dto';
import { FavoritesService } from './favorites.service';
import IFavorites from './interfaces/favorites.interface';

@ApiTags('Favorites')
@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async findAll(): Promise<IFavorites> {
    return this.favoritesService.findAll();
  }

  @Post('/track/:id')
  async addFavoriteTrack(@Param() params: IdParamDto): Promise<string> {
    return this.favoritesService.addFavoriteTrack(params);
  }

  @HttpCode(204)
  @Delete('track/:id')
  async deleteTrackFromFavorites(@Param() params: IdParamDto): Promise<void> {
    await this.favoritesService.deleteTrackFromFavorites(params);
  }

  @Post('/album/:id')
  async addFavoriteAlbum(@Param() params: IdParamDto): Promise<string> {
    return this.favoritesService.addFavoriteAlbum(params);
  }

  @HttpCode(204)
  @Delete('album/:id')
  async deleteAlbumFromFavorites(@Param() params: IdParamDto): Promise<void> {
    await this.favoritesService.deleteAlbumFromFavorites(params);
  }

  @Post('/artist/:id')
  async addFavoriteArtist(@Param() params: IdParamDto): Promise<string> {
    return this.favoritesService.addFavoriteArtist(params);
  }

  @HttpCode(204)
  @Delete('artist/:id')
  async deleteArtistFromFavorites(@Param() params: IdParamDto): Promise<void> {
    await this.favoritesService.deleteArtistFromFavorites(params);
  }
}
