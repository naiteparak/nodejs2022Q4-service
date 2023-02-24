import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import IFavorites from './interfaces/favorites.interface';
import { TracksService } from '../tracks/tracks.service';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';
import { ArtistsEntity } from '../artists/entities/artists.entity';
import { TracksEntity } from '../tracks/entities/tracks.entity';
import { AlbumsEntity } from '../albums/entities/albums.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
  ) {}

  async findAll(): Promise<IFavorites> {
    const favoriteArtists: ArtistsEntity[] =
      await this.artistsService.findAllFavorites();
    const favoriteTracks: TracksEntity[] =
      await this.tracksService.findAllFavorites();
    const favoriteAlbums: AlbumsEntity[] =
      await this.albumsService.findAllFavorites();
    return {
      artists: favoriteArtists,
      tracks: favoriteTracks,
      albums: favoriteAlbums,
    };
  }

  async findOne(params): Promise<any> {
    switch (params.type) {
      case 'artists':
        return await this.artistsService.findOne(params);
      case 'albums':
        return await this.albumsService.findOne(params);
      case 'tracks':
        return await this.tracksService.findOne(params);
      default:
        throw new InternalServerErrorException('Key type is wrong');
    }
  }

  async addFavoriteTrack(params): Promise<string> {
    try {
      const favTrack = await this.tracksService.findOne({ id: params.id });
      await this.tracksService.update(
        { ...favTrack, isFavorite: true },
        params,
      );
      return `Track ${params.id} added to favorites`;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async deleteTrackFromFavorites(params): Promise<void> {
    const favTrack = await this.tracksService.findOne({ id: params.id });
    await this.tracksService.update({ ...favTrack, isFavorite: false }, params);
  }

  async addFavoriteAlbum(params): Promise<string> {
    try {
      const favAlbum = await this.albumsService.findOne({ id: params.id });
      await this.albumsService.update(params, {
        ...favAlbum,
        isFavorite: true,
      });
      return `Album ${params.id} added to favorites`;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async deleteAlbumFromFavorites(params): Promise<void> {
    const favAlbum = await this.albumsService.findOne({ id: params.id });
    await this.albumsService.update(params, { ...favAlbum, isFavorite: false });
  }

  async addFavoriteArtist(params): Promise<string> {
    try {
      const favArtist = await this.artistsService.findOne({ id: params.id });
      await this.artistsService.update(params, {
        ...favArtist,
        isFavorite: true,
      });
      return `Artist ${params.id} added to favorites`;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async deleteArtistFromFavorites(params): Promise<void> {
    const favArtist = await this.artistsService.findOne({ id: params.id });
    await this.artistsService.update(params, {
      ...favArtist,
      isFavorite: false,
    });
  }
}
