const apiKey = '557439512040e55c35f758f339c8e1d1';
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsDiv = document.getElementById('results');
const popularMoviesDiv = document.getElementById('popular-movies');
const popularTVDiv = document.getElementById('popular-tv');

// Função para carregar os filmes populares
function loadPopularMovies() {
    const searchHeading = document.getElementById('search-heading');
    searchHeading.innerHTML = `Em alta`;

    fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&language=pt-BR`)
        .then(response => response.json())
        .then(data => {
            const popularMovies = data.results;
            popularMovies.forEach(movie => {
                // Verifique se todas as informações necessárias estão presentes
                if (movie.poster_path, movie.overview) {
                    const movieDiv = document.createElement('div');
                    movieDiv.classList.add('result');
                    movieDiv.innerHTML = `
                    <div class="row justify-content-center hover-border">
                        <div class="col-md-3">
                            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} Poster" class="img-fluid">
                        </div>
                        <div class="col-md-9">
                            <h2>${movie.title} <span class="year">(${movie.release_date.slice(0, 4)})</span></h2>
                            <p class="lead">${movie.overview}</p>
                        </div>
                    </div>
                    `;

                    // Adicione o evento de clique à div para redirecionar para a página de detalhes
                    movieDiv.addEventListener('click', () => {
                        const movieId = movie.id;
                        const contentType = 'movie'; // Você pode definir o tipo de conteúdo como 'movie' para filmes populares
                        // Redirecione para a página de detalhes com o mediaType e id
                        window.location.href = `movie-details.html?id=${movieId}&mediaType=${contentType}`;
                    });

                    popularMoviesDiv.appendChild(movieDiv);
                }
            });
        })
        .catch(error => {
            console.error('Erro ao carregar filmes populares:', error);
        });
}

function loadPopularSeries(){
    fetch(`https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}&language=pt-BR`)
        .then(response => response.json())
        .then(data => {
            const popularTV = data.results;
            popularTV.forEach(tv => {
                // Verifique se todas as informações necessárias estão presentes
                if (tv.poster_path, tv.overview) {
                    const tvDiv = document.createElement('div');
                    tvDiv.classList.add('result');
                    tvDiv.innerHTML = `
                    <div class="row justify-content-center hover-border">
                        <div class="col-md-3">
                            <img src="https://image.tmdb.org/t/p/w500${tv.poster_path}" alt="${tv.name} Poster" class="img-fluid">
                        </div>
                        <div class="col-md-9">
                            <h2>${tv.name} <span class="year">(${tv.first_air_date.slice(0, 4)})</span></h2>
                            <p class="lead">${tv.overview}</p>
                        </div>
                    </div>
                    `;

                    // Adicione o evento de clique à div para redirecionar para a página de detalhes
                    tvDiv.addEventListener('click', () => {
                        const tvId = tv.id;
                        const contentType = 'tv'; // Você pode definir o tipo de conteúdo como 'movie' para filmes populares
                        // Redirecione para a página de detalhes com o mediaType e id
                        window.location.href = `movie-details.html?id=${tvId}&mediaType=${contentType}`;
                    });

                    popularTVDiv.appendChild(tvDiv);
                }
            });
        })
        .catch(error => {
            console.error('Erro ao carregar filmes populares:', error);
        });
}

// Função para realizar a pesquisa
function performSearch(query) {

    const searchHeading = document.getElementById('search-heading');
    searchHeading.innerHTML = `Buscando por: ${query}`;

    // Limpe os resultados anteriores
    resultsDiv.innerHTML = '';
    popularMoviesDiv.innerHTML = '';
    popularTVDiv.innerHTML = '';
    fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${query}&language=pt-BR`)
        .then(response => response.json())
        .then(data => {
            
            if (data.results.length === 0) {
                resultsDiv.innerHTML = '<p>Nenhum resultado encontrado.</p>';
            } else {
                data.results.forEach(result => {
                    
                    if (result.poster_path) {
                        const mediaType = result.media_type;
                        const posterPath = `https://image.tmdb.org/t/p/w500${result.poster_path}`;
                        const year = mediaType === 'movie' ? result.release_date.slice(0, 4) : (result.first_air_date ? result.first_air_date.slice(0, 4) : '');
                        const title = mediaType === 'movie' ? result.title : result.name;
                        

                        const resultDiv = document.createElement('div');
                        resultDiv.classList.add('result');

                        resultDiv.innerHTML = `
                            <div class="row justify-content-center">
                                <div class="col-md-3">
                                    <img src="${posterPath}" alt="${title} Poster" class="img-fluid rounded">
                                </div>
                                <div class="col-md-9">
                                    <h2>${title} <span class="year">(${year})</span></h2>
                                    <p class="lead">${result.overview}</p>
                                </div>
                            </div>
                        `;

                        // Adicione o evento de clique à div para redirecionar para a página de detalhes
                        resultDiv.addEventListener('click', () => {
                            const movieId = result.id;
                            const contentType = mediaType;
                            // Redirecione para a página de detalhes com o mediaType e id
                            window.location.href = `movie-details.html?id=${movieId}&mediaType=${contentType}`;
                        });

                        resultsDiv.appendChild(resultDiv);
                    }
                });
            }
        })
        .catch(error => {
            console.error('Erro na busca:', error);
        });
}

// Carregue os filmes populares ao carregar a página
window.addEventListener('load', () => {
    loadPopularMovies();
    loadPopularSeries();
});

// Adicione um evento de clique ao botão de pesquisa
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query === '') {
        return;
    }
    performSearch(query); // Realize a pesquisa
});
