/**
 * API Route mock para testing offline de películas
 * Proporciona datos de ejemplo cuando TMDB no está disponible
 */

import { NextRequest, NextResponse } from 'next/server';
import type { TMDBResponse, Movie, Genre, ApiResponse } from '@/lib/types';

// Datos mock de géneros
const mockGenres: Genre[] = [
  { id: 28, name: 'Acción' },
  { id: 12, name: 'Aventura' },
  { id: 16, name: 'Animación' },
  { id: 35, name: 'Comedia' },
  { id: 80, name: 'Crimen' },
  { id: 99, name: 'Documental' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Familia' },
  { id: 14, name: 'Fantasía' },
  { id: 36, name: 'Historia' },
  { id: 27, name: 'Terror' },
  { id: 10402, name: 'Música' },
  { id: 9648, name: 'Misterio' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Ciencia ficción' },
  { id: 10770, name: 'Película de TV' },
  { id: 53, name: 'Suspense' },
  { id: 10752, name: 'Bélica' },
  { id: 37, name: 'Western' },
];

// Datos mock de películas
const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Avatar: El Camino del Agua',
    original_title: 'Avatar: The Way of Water',
    overview: 'Más de una década después de los eventos de la primera película...',
    poster_path: '/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    backdrop_path: '/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg',
    release_date: '2022-12-16',
    adult: false,
    genre_ids: [878, 12, 28],
    original_language: 'en',
    popularity: 8547.326,
    vote_average: 7.6,
    vote_count: 8934,
    video: false,
  },
  {
    id: 2,
    title: 'Top Gun: Maverick',
    original_title: 'Top Gun: Maverick',
    overview: 'Después de más de treinta años de servicio como uno de los mejores aviadores de la Armada...',
    poster_path: '/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    backdrop_path: '/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg',
    release_date: '2022-05-27',
    adult: false,
    genre_ids: [28, 18],
    original_language: 'en',
    popularity: 7234.521,
    vote_average: 8.3,
    vote_count: 7542,
    video: false,
  },
  {
    id: 3,
    title: 'Black Panther: Wakanda Forever',
    original_title: 'Black Panther: Wakanda Forever',
    overview: 'La reina Ramonda, Shuri, M\'Baku, Okoye y las Dora Milaje...',
    poster_path: '/sv1xJUazXeYqALzczSZ3O6nkH75.jpg',
    backdrop_path: '/xDMIl84Qo5Tsu62c9DGWhmPI67A.jpg',
    release_date: '2022-11-11',
    adult: false,
    genre_ids: [28, 12, 18],
    original_language: 'en',
    popularity: 6821.445,
    vote_average: 7.3,
    vote_count: 6234,
    video: false,
  },
  {
    id: 4,
    title: 'Spider-Man: No Way Home',
    original_title: 'Spider-Man: No Way Home',
    overview: 'Peter Parker es desenmascarado y ya no puede separar su vida normal...',
    poster_path: '/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    backdrop_path: '/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg',
    release_date: '2021-12-17',
    adult: false,
    genre_ids: [28, 12, 878],
    original_language: 'en',
    popularity: 6234.123,
    vote_average: 8.1,
    vote_count: 18543,
    video: false,
  },
  {
    id: 5,
    title: 'Encanto',
    original_title: 'Encanto',
    overview: 'La historia de una familia extraordinaria, los Madrigal...',
    poster_path: '/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg',
    backdrop_path: '/3G1Q5xF40HkUBJXxt2DQgQzKTp5.jpg',
    release_date: '2021-11-24',
    adult: false,
    genre_ids: [16, 35, 10751],
    original_language: 'en',
    popularity: 5987.654,
    vote_average: 7.6,
    vote_count: 9876,
    video: false,
  },
  {
    id: 6,
    title: 'Dune',
    original_title: 'Dune',
    overview: 'Paul Atreides, un joven brillante y talentoso...',
    poster_path: '/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    backdrop_path: '/iopYFB1b6Bh7FWZh3onQhph1sih.jpg',
    release_date: '2021-10-22',
    adult: false,
    genre_ids: [878, 12],
    original_language: 'en',
    popularity: 5654.321,
    vote_average: 7.8,
    vote_count: 11234,
    video: false,
  },
];

/**
 * GET /api/mock/movies
 * Retorna datos mock de películas para testing offline
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const genreFilter = searchParams.get('genres');

  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));

  let filteredMovies = [...mockMovies];

  // Filtrar por género si se especifica
  if (genreFilter) {
    const genreIds = genreFilter.split(',').map(id => parseInt(id));
    filteredMovies = mockMovies.filter(movie => 
      movie.genre_ids.some(genreId => genreIds.includes(genreId))
    );
  }

  // Paginación simple
  const itemsPerPage = 20;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMovies = filteredMovies.slice(startIndex, endIndex);

  const mockResponse: TMDBResponse<Movie> = {
    page,
    results: paginatedMovies,
    total_pages: Math.ceil(filteredMovies.length / itemsPerPage),
    total_results: filteredMovies.length,
  };

  const response: ApiResponse<TMDBResponse<Movie>> = {
    success: true,
    data: mockResponse,
    message: `${paginatedMovies.length} películas mock obtenidas`,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache',
      'X-Mock-Data': 'true',
    },
  });
}

/**
 * GET /api/mock/genres
 * Retorna géneros mock para testing offline
 */
export async function POST(request: NextRequest) {
  const response: ApiResponse<Genre[]> = {
    success: true,
    data: mockGenres,
    message: 'Géneros mock obtenidos',
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache',
      'X-Mock-Data': 'true',
    },
  });
}
