import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IdParamDto } from '../common/dto/id-param.dto';
import * as crypto from 'crypto';
import { CreateTrackDto } from './dto/create-track.dto';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { UpdateTrackDto } from './dto/update-track.dto';
import * as lodash from 'lodash';
import { FavoritesService } from '../favorites/favorites.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TracksEntity } from './entities/tracks.entity';

@Injectable()
export class TracksService {
  constructor(
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    @InjectRepository(TracksEntity)
    private tracksRepository: Repository<TracksEntity>,
  ) {}

  async findAll(): Promise<TracksEntity[]> {
    return await this.tracksRepository.find();
  }

  async findAllFavorites(): Promise<TracksEntity[]> {
    return await this.tracksRepository.findBy({ isFavorite: true });
  }

  async findMany(key): Promise<TracksEntity[]> {
    const tracks = await this.findAll();
    return lodash.filter(tracks, lodash.matches(key));
  }

  async findOne(params: IdParamDto): Promise<TracksEntity> {
    const track = await this.tracksRepository.findOneBy({ id: params.id });
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  async create(body: CreateTrackDto): Promise<TracksEntity> {
    if (body.albumId !== null) {
      await this.albumsService.findOne({ id: body.albumId });
    }
    if (body.artistId !== null) {
      await this.artistsService.findOne({ id: body.artistId });
    }
    const track: TracksEntity = await this.tracksRepository.create({
      id: crypto.randomUUID(),
      ...body,
    });
    return await this.tracksRepository.save(track);
  }

  async update(
    body: UpdateTrackDto,
    params: IdParamDto,
  ): Promise<TracksEntity> {
    if (body.albumId !== null) {
      await this.albumsService.findOne({ id: body.albumId });
    }
    if (body.artistId !== null) {
      await this.artistsService.findOne({ id: body.artistId });
    }

    const track: TracksEntity = await this.findOne(params);

    await this.tracksRepository.update(
      { id: params.id },
      {
        ...track,
        ...body,
      },
    );

    return this.tracksRepository.findOneBy({ id: params.id });
  }

  async delete(params: IdParamDto): Promise<void> {
    const track = await this.findOne(params);
    await this.tracksRepository.delete(track.id);
  }
}
