import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ArtistsEntity } from '../../artists/entities/artists.entity';
import { AlbumsEntity } from '../../albums/entities/albums.entity';

@Entity('tracks')
export class TracksEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  artistId: string | null;

  @Column({ nullable: true })
  albumId: string | null;

  @Column()
  duration: number;

  @ManyToOne(() => ArtistsEntity, { onDelete: 'SET NULL' })
  artist: ArtistsEntity;

  @ManyToOne(() => AlbumsEntity, { onDelete: 'SET NULL' })
  album: AlbumsEntity;

  @Column({ select: false, default: false })
  isFavorite: boolean;
}
