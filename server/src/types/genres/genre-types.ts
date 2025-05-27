enum GenreBase {
  Action = 'Action',
  Adventure = 'Adventure',
  Animation = 'Animation',
  Comedy = 'Comedy',
  Drama = 'Drama',
  Fantasy = 'Fantasy',
  Horror = 'Horror',
  Mystery = 'Mystery',
  Romance = 'Romance',
  SciFi = 'Science Fiction',
  Thriller = 'Thriller',
  Crime = 'Crime',
  Historical = 'Historical',
  War = 'War',
  Western = 'Western',
  Family = 'Family',
  Other = 'Other',
}

export interface GenreData {
  id: number;
  name: string;
  tvdbId?: number;
  tmdbId?: number;
  gamedbId?: number;
}

export type CreateGenreData = Omit<GenreData, 'id'>;

enum AudiovisualGenre {
  Animation = 'Animation',
  TradAnimation = '2D Animation',
  CGIAnimation = '3D Animation',
  Documentary = 'Documentary',
  Musical = 'Musical',
  Biography = 'Biography',
  Sport = 'Sport',
  FilmNoir = 'Film Noir',
  Experimental = 'Experimental',
}

enum FilmFormat {
  ShortFilm = 'Short Film',
  Videoclip = 'Videoclip',
  Advert = 'Advert',
  Trailer = 'Trailer',
}

enum ShowFormat {
  Series = 'Series',
  MiniSeries = 'Mini Series',
  Anthology = 'Anthology Series',
  RealityShow = 'Reality Show',
  TalkShow = 'Talk Show',
  GameShow = 'Game Show',
  NewsShow = 'News Show',
  VarietyShow = 'Variety Show',
  Documentary = 'Documentary Series',
  WebSeries = 'Web Series',
}

enum GameplayGenre {
  Platform = 'Platform',
  Shooter = 'Shooter',
  Fighting = 'Fighting',
  BeatEmUp = "Beat 'em up",
  Stealth = 'Stealth',
  Survival = 'Survival',
  Rhythm = 'Rhythm',
  Strategy = 'Strategy',
  RealTimeStrategy = 'Real-Time Strategy',
  TurnBased = 'Turn-Based',
  TowerDefense = 'Tower Defense',
  RPG = 'Role-Playing Game',
  ActionRPG = 'Action RPG',
  MMORPG = 'Massively Multiplayer Online RPG',
  TacticalRPG = 'Tactical RPG',
  VisualNovel = 'Visual Novel',
  AdventurePoint = 'Point & Click Adventure',
  InteractiveFiction = 'Interactive Fiction',
  Simulation = 'Simulation',
  LifeSim = 'Life Simulation',
  VehicleSim = 'Vehicle Simulation',
  CitySim = 'City Building',
  BusinessSim = 'Business Simulation',
  SportSim = 'Sports Simulation',
  Puzzle = 'Puzzle',
  Board = 'Board Game',
  Educational = 'Educational',
  Trivia = 'Trivia',
  OpenWorld = 'Open World',
  Sandbox = 'Sandbox',
  Battle = 'Battle Royale',
  MOBA = 'Multiplayer Online Battle Arena',
  Roguelike = 'Roguelike',
  Metroidvania = 'Metroidvania',
}

enum GameTheme {
  Medieval = 'Medieval',
  Cyberpunk = 'Cyberpunk',
  PostApocalyptic = 'Post-Apocalyptic',
  Space = 'Space',
  Military = 'Military',
  Superhero = 'Superhero',
  Horror = 'Horror',
  Fantasy = 'Fantasy',
  Historical = 'Historical',
  Contemporary = 'Contemporary',
  Steampunk = 'Steampunk',
  Anime = 'Anime',
  Cartoon = 'Cartoon',
  Realistic = 'Realistic',
}

type FilmGenre = GenreBase | AudiovisualGenre | FilmFormat;
type ShowGenre = GenreBase | AudiovisualGenre | ShowFormat;
type GameGenre = GenreBase | GameTheme;

export { FilmGenre, ShowGenre, GameGenre, GameplayGenre };
