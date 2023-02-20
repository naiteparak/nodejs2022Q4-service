import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ArtistsEntity } from '../../artists/entities/artists.entity';

@Entity('albums')
export class AlbumsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column({ nullable: true })
  artistId: string | null;

  @ManyToOne(() => ArtistsEntity, {
    onDelete: 'SET NULL',
  })
  artist: ArtistsEntity;
}
