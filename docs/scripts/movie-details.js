

/*****************************************************API**********************************/
const apiKey = '557439512040e55c35f758f339c8e1d1';

// Obtenha o ID do filme ou série da URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
const mediaType = urlParams.get('mediaType');

// Verifique se é um filme ou uma série
let endpoint;
if (mediaType === 'movie') {
    endpoint = 'movie';
} else if (mediaType === 'tv') {
    endpoint = 'tv';
} else {
    console.error('Tipo de mídia inválido na URL.');
}


// Verifique se o ID do filme ou série é válido (não vazio)
if (!movieId) {
    console.error('ID do filme ou série não encontrado na URL.');
}

  
  fetch(`https://api.themoviedb.org/3/${endpoint}/${movieId}?api_key=${apiKey}&language=pt-BR`)
    .then(response => response.json())
    .then(data => {
        // Exiba os detalhes do filme ou série como desejar
        const title = mediaType === 'movie' ? data.title : data.name;

        const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        let posterResolution;
        if (screenWidth < 768) {
            // Se a largura da tela for menor que 768 pixels (tamanho típico de dispositivos móveis),
            // você pode escolher uma resolução menor, como 'w342' em vez de 'original'.
            posterResolution = 'w780';
        } else {
            // Caso contrário, use a resolução original.
            posterResolution = 'original';
        }

        const posterPath = data.poster_path ? `https://image.tmdb.org/t/p/${posterResolution}/${data.poster_path}` : '';
        let googleProxyURL = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url='; //utliziando um server proxy para evitar problemas com crossorigin
        
        const likes = data.vote_count; // Número de votos
        const views = data.popularity; // Popularidade (visualizações)
        const rating = data.vote_average; // Nota
        const duration = data.runtime; // Tempo de duração em minutos
        const genre = data.genres && data.genres.length > 0 ? data.genres[0].name : 'N/A'; // Gênero principal
        const releaseYear = (data.release_date || data.first_air_date)?.substring(0, 4) || 'N/A'; // Ano de lançamento
        const overview = data.overview; // Sinopse


        document.getElementById('movie-title').textContent = title;

        const minhaImagem = document.getElementById('movie-poster');
        minhaImagem.crossOrigin = 'Anonymous';
        minhaImagem.src = googleProxyURL + encodeURIComponent(posterPath);
        
        document.getElementById('views').textContent = formatNumber(views);
        document.getElementById('likes').textContent = formatNumber(likes);
        document.getElementById('sinopse').textContent = overview;
        if(duration){
          document.getElementById('duration').textContent = `${duration} min`;
        }else{
          document.getElementById('duration').textContent = `Não definido`
        }

        
        document.getElementById('genre').textContent = genre;
        document.getElementById('release-year').textContent = releaseYear;
        document.getElementById('rating').textContent = rating.toFixed(1);
        
        document.getElementById('loading-screen').style.display = 'none';
    })
    .catch(error => {
        console.error('Erro ao carregar os detalhes do filme ou série:', error);
    });




//formatar numeros grandes
function formatNumber(number) {
  if (number < 1000) {
    return number.toString();
  } else if (number < 10000) {
    return (number / 1000).toFixed(1) + 'k';
  } else {
    return (number / 1000).toFixed(0) + 'k';
  }
}



const image = document.querySelector('img');
const colorThief = new ColorThief();

image.onload = function() {
  const colors = colorThief.getPalette(image, 2); // Obter as duas cores predominantes da imagem
  const color1 = colors[0];
  const color2 = colors[1];
  const [R1, G1, B1] = color1;
  const [R2, G2, B2] = color2;

  const gradient = document.querySelector('.gradient')
  gradient.style.background = `radial-gradient(at top left, rgb(${R2}, ${G2}, ${B2}), rgb(${R1}, ${G1}, ${B1}), #1e1e1e 70%)`;

}

const ratingStars = [...document.getElementsByClassName("rating__star")];

function executeRating(stars) {
  const starClassActive = "rating__star fas fa-star";
  const starClassInactive = "rating__star far fa-star";
  const starsLength = stars.length;
  let i;
  stars.map((star) => {
    star.onclick = () => {
      i = stars.indexOf(star);

      if (star.className===starClassInactive) {
        for (i; i >= 0; --i) stars[i].className = starClassActive;
      } else {
        for (i; i < starsLength; ++i) stars[i].className = starClassInactive;
      }
    };
  });
}
executeRating(ratingStars);