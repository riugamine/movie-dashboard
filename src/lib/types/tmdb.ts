/**
 * Tipos para la API de The Movie Database (TMDB)
 */

// Respuesta base de TMDB
export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Género de película
export interface Genre {
  id: number;
  name: string;
}

// Respuesta de géneros
export interface GenresResponse {
  genres: Genre[];
}

// Película de TMDB
export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  adult: boolean;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  video: boolean;
}

// Detalles completos de película
export interface MovieDetails extends Omit<Movie, 'genre_ids'> {
  genres: Genre[];
  runtime: number | null;
  budget: number;
  revenue: number;
  homepage: string | null;
  imdb_id: string | null;
  status: string;
  tagline: string | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
}

// Compañía de producción
export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

// País de producción
export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

// Idioma hablado
export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

// Parámetros para descubrimiento de películas
export interface DiscoverMoviesParams {
  page?: number;
  include_adult?: boolean;
  include_video?: boolean;
  language?: string;
  primary_release_date_gte?: string;
  primary_release_date_lte?: string;
  release_date_gte?: string;
  release_date_lte?: string;
  sort_by?: string;
  vote_average_gte?: number;
  vote_average_lte?: number;
  vote_count_gte?: number;
  with_genres?: string;
  without_genres?: string;
  with_keywords?: string;
  without_keywords?: string;
  with_runtime_gte?: number;
  with_runtime_lte?: number;
}

// Configuración de imágenes de TMDB
export interface TMDBConfiguration {
  images: {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: string[];
    logo_sizes: string[];
    poster_sizes: string[];
    profile_sizes: string[];
    still_sizes: string[];
  };
  change_keys: string[];
}
