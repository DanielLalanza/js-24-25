// Lista de películas
let peliculas = [];

// Referencias al DOM
const moviesContainer = document.getElementById('moviesContainer');
const genreSelect = document.getElementById('genreSelect');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const sortButton = document.getElementById('sortButton');
const quickFilterButtons = document.querySelectorAll('.quick-filter');

// Cargar datos del JSON
function cargarPeliculas() {
  fetch('peliculas.json')
    .then(response => response.json())
    .then(data => {
      peliculas = data;
      cargarGeneros();
      mostrarPeliculas(peliculas);
    })
    .catch(error => console.error('Error al cargar el JSON:', error));
}

// Cargar géneros en el select
function cargarGeneros() {
    genreSelect.innerHTML = '<option value="Todos">Todos</option>'; // Agrega "Todos" solo una vez
    const generos = [...new Set(peliculas.map(p => p.genero))];
    generos.forEach(genero => {
      const option = document.createElement('option');
      option.value = genero;
      option.textContent = genero;
      genreSelect.appendChild(option);
    });
    genreSelect.addEventListener('change', filtrarPeliculas);
  }

// Mostrar películas en el DOM
function mostrarPeliculas(lista) {
  moviesContainer.innerHTML = '';

  if (lista.length === 0) {
    moviesContainer.innerHTML = '<p>No hay resultados.</p>';
    return;
  }

  lista.forEach(({ imagen, titulo, genero, año }) => {
    const peliculaElemento = document.createElement('div');
    peliculaElemento.classList.add('movie-card');
    peliculaElemento.innerHTML = `
      <img src="${imagen}" alt="Póster de ${titulo}" class="movie-poster">
      <div class="movie-title">${titulo}</div>
      <div class="movie-genre">Género: ${genero}</div>
      <div class="movie-year">Año: ${año}</div>
    `;
    moviesContainer.appendChild(peliculaElemento);
  });
}

// Filtrar por género
function filtrarPeliculas() {
  const generoSeleccionado = genreSelect.value;
  const filtradas = generoSeleccionado === 'Todos' ? peliculas : peliculas.filter(p => p.genero === generoSeleccionado);
  mostrarPeliculas(filtradas);
}

// Buscar por título
function buscarPeliculas() {
  const query = searchInput.value.toLowerCase();
  const filtradas = peliculas.filter(p => p.titulo.toLowerCase().includes(query));
  mostrarPeliculas(filtradas);
}

// Ordenar por año
function ordenarPeliculas() {
  const ordenAsc = sortButton.getAttribute('data-order') === 'asc';
  peliculas.sort((a, b) => ordenAsc ? b.año - a.año : a.año - b.año);
  
  sortButton.setAttribute('data-order', ordenAsc ? 'desc' : 'asc');
  sortButton.textContent = `Ordenar por año (${ordenAsc ? 'DESC' : 'ASC'})`;

  filtrarPeliculas();
}

// Eventos
searchButton.addEventListener('click', buscarPeliculas);
searchInput.addEventListener('keyup', (e) => e.key === 'Enter' && buscarPeliculas());
sortButton.addEventListener('click', ordenarPeliculas);
quickFilterButtons.forEach(btn => btn.addEventListener('click', () => {
  genreSelect.value = btn.dataset.genero;
  filtrarPeliculas();
}));

// Iniciar la aplicación
cargarPeliculas();
