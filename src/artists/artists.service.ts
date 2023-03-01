import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import * as crypto from 'crypto';
import { IdParamDto } from '../common/dto/id-param.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtistsEntity } from './entities/artists.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    @InjectRepository(ArtistsEntity)
    private artistsRepository: Repository<ArtistsEntity>,
  ) {}

  async findAll(): Promise<ArtistsEntity[]> {
    return await this.artistsRepository.find();
  }

  async findAllFavorites(): Promise<ArtistsEntity[]> {
    return await this.artistsRepository.findBy({ isFavorite: true });
  }

  async findOne(params: IdParamDto): Promise<ArtistsEntity> {
    const artist = await this.artistsRepository.findOneBy({ id: params.id });
    if (!artist) {
      throw new NotFoundException('No artist with this id');
    }
    return artist;
  }

  async create(body: CreateArtistDto): Promise<ArtistsEntity> {
    const artist: ArtistsEntity = await this.artistsRepository.create({
      ...body,
      id: crypto.randomUUID(),
    });
    return await this.artistsRepository.save(artist);
  }

  async update(
    params: IdParamDto,
    body: UpdateArtistDto,
  ): Promise<ArtistsEntity> {
    const artist: ArtistsEntity = await this.findOne(params);

    await this.artistsRepository.update(
      { id: params.id },
      {
        ...artist,
        ...body,
      },
    );

    return this.artistsRepository.findOneBy({ id: params.id });
  }

  async delete(params: IdParamDto): Promise<void> {
    const artist = await this.findOne(params);
    await this.artistsRepository.delete(artist.id);
  }
}
