import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IdParamDto } from '../common/id-param.dto';
import * as crypto from 'crypto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { ArtistsService } from '../artists/artists.service';
import * as lodash from 'lodash';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumsEntity } from './entities/albums.entity';
import { CreateAlbumDto } from './dto/create-album.dto';

@Injectable()
export class AlbumsService {
  constructor(
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    @InjectRepository(AlbumsEntity)
    private albumsRepository: Repository<AlbumsEntity>,
  ) {}

  async findAll(): Promise<AlbumsEntity[]> {
    return await this.albumsRepository.find();
  }

  async findAllFavorites(): Promise<AlbumsEntity[]> {
    return await this.albumsRepository.findBy({ isFavorite: true });
  }

  async findMany(key): Promise<AlbumsEntity[]> {
    const albums = await this.findAll();
    return lodash.filter(albums, lodash.matches(key));
  }

  async findOne(params: IdParamDto): Promise<AlbumsEntity> {
    const album = await this.albumsRepository.findOneBy({ id: params.id });
    if (!album) {
      throw new NotFoundException('No album with this id');
    }
    return album;
  }

  async create(body: CreateAlbumDto): Promise<AlbumsEntity> {
    if (body.artistId !== null) {
      await this.artistsService.findOne({ id: body.artistId });
    }
    const album: AlbumsEntity = await this.albumsRepository.create({
      id: crypto.randomUUID(),
      ...body,
    });
    return await this.albumsRepository.save(album);
  }

  async update(
    params: IdParamDto,
    body: UpdateAlbumDto,
  ): Promise<AlbumsEntity> {
    if (body.artistId !== null) {
      await this.artistsService.findOne({ id: body.artistId });
    }
    const album: AlbumsEntity = await this.findOne(params);

    await this.albumsRepository.update(
      { id: params.id },
      {
        ...album,
        ...body,
      },
    );

    return this.albumsRepository.findOneBy({ id: params.id });
  }

  async delete(params: IdParamDto) {
    const album = await this.findOne(params);
    await this.albumsRepository.delete(album.id);
  }
}
