import { ArtistsEntity } from '../../artists/entities/artists.entity';
import { TracksEntity } from '../../tracks/entities/tracks.entity';
import { AlbumsEntity } from '../../albums/entities/albums.entity';

export default interface IFavorites {
  artists: ArtistsEntity[];
  albums: AlbumsEntity[];
  tracks: TracksEntity[];
}

export class Favorites {
  id: string;

  constructor(props: IFavorites) {
    Object.assign(this, props);
  }
}
