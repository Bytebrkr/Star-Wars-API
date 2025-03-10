/**
Resources links:
https://www.w3schools.com/js/js_arrays.asp
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
https://medium.com/designly/create-a-star-wars-like-crawl-using-css-javascript-c40afbdae8db
*//


// Global variables
const filmsData = []; // Stores detailed data for each Star Wars film
const originalOrder = [4, 5, 6, 1, 2, 3, 7, 8, 9]; // Original release order of films: Episode 4, 5, 6, 1, 2, 3, 7, 8, 9

// DOM Elements
const introContainer = document.getElementById('intro-container'); // Container for intro screen
const mainContent = document.getElementById('main-content'); // Main content container
const skipIntroBtn = document.getElementById('skip-intro'); // Button to skip the intro
const filmsContainer = document.getElementById('films-container'); // Container for displaying the film cards
const gridViewBtn = document.getElementById('grid-view'); // Button to switch to grid view
const scrollViewBtn = document.getElementById('scroll-view'); // Button to switch to scroll view
const modal = document.getElementById('modal'); // Modal for showing detailed film info
const modalContent = document.getElementById('modal-content-container'); // Content container for the modal
const closeButton = document.querySelector('.close-button'); // Close button for modal

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Skip intro button: when clicked, hides intro and shows main content
    skipIntroBtn.addEventListener('click', skipIntro);

    // Automatically skip intro after animation completes (70 seconds)
    setTimeout(skipIntro, 70000);

    // View mode toggle - Fixed event listeners for grid and scroll views
    gridViewBtn.addEventListener('click', () => {
        changeViewMode('grid');
    });

    scrollViewBtn.addEventListener('click', () => {
        changeViewMode('scroll');
    });

    // Modal close: closes modal when close button is clicked
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal if clicked outside of it
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Fetch all films data on page load
    fetchAllFilms();
});

/**
 * Skip the intro animation and display the main content.
 * 
 * Precondition: The intro animation must be active.
 * Postcondition: The intro animation is hidden, and the main content is displayed.
 */
function skipIntro() {
    introContainer.style.display = 'none';
    mainContent.classList.remove('hidden');
}

/**
 * Change the layout view mode between grid and scroll view.
 * 
 * Precondition: `mode` must be either 'grid' or 'scroll'.
 * Postcondition: Films container is displayed in the selected layout mode, 
 *                and the appropriate button is marked as active.
 * 
 * @param {string} mode - The view mode to switch to ('grid' or 'scroll').
 */
function changeViewMode(mode) {
    console.log(`Changing to ${mode} view`); // Debug log
    
    if (mode === 'grid') {
        filmsContainer.className = 'grid-layout'; // Apply grid layout class
        gridViewBtn.classList.add('active'); // Highlight grid view button
        scrollViewBtn.classList.remove('active'); // Remove active class from scroll view button
    } else if (mode === 'scroll') {
        filmsContainer.className = 'scroll-layout'; // Apply scroll layout class
        scrollViewBtn.classList.add('active'); // Highlight scroll view button
        gridViewBtn.classList.remove('active'); // Remove active class from grid view button
    }
}

/**
 * Fetch all Star Wars films from the API.
 * 
 * Precondition: The API URL 'https://www.swapi.tech/api/films' is available and responsive.
 * Postcondition: Films data is fetched, sorted by original release order, 
 *                and displayed in the UI.
 */
async function fetchAllFilms() {
    try {
        const response = await fetch('https://www.swapi.tech/api/films');
        const data = await response.json();
        
        // Clear any loading messages before displaying films
        filmsContainer.innerHTML = '';
        
        // Fetch detailed info for each film
        const fetchPromises = data.result.map(film => 
            fetch(`https://www.swapi.tech/api/films/${film.uid}`)
                .then(res => res.json())
                .then(filmData => {
                    return {
                        ...filmData.result.properties,
                        uid: film.uid
                    };
                })
        );
        
        // Wait for all film data to be fetched
        const detailedFilms = await Promise.all(fetchPromises);
        
        // Store all films data
        filmsData.push(...detailedFilms);
        
        // Sort films by original release order
        const sortedFilms = sortFilmsByOriginalOrder(detailedFilms);
        
        // Display sorted films
        displayFilms(sortedFilms);
    } catch (err) {
        console.error('Error fetching films:', err);
        filmsContainer.innerHTML = `<div class="error">Failed to load Star Wars films. The Force is not with us today.</div>`;
    }
}

/**
 * Sort films by their original release order.
 * 
 * Precondition: `films` is an array of film objects.
 * Postcondition: The films array is sorted based on the original release order.
 * 
 * @param {Array} films - The list of films to be sorted.
 * @returns {Array} - The sorted list of films.
 */
function sortFilmsByOriginalOrder(films) {
    return [...films].sort((a, b) => {
        return originalOrder.indexOf(a.episode_id) - originalOrder.indexOf(b.episode_id);
    });
}

/**
 * Display films in the container as cards.
 * 
 * Precondition: `films` is an array of film objects.
 * Postcondition: The films are displayed as cards in the UI, and 
 *                each card has an event listener to show film details.
 * 
 * @param {Array} films - The films to display.
 */
function displayFilms(films) {
    films.forEach(film => {
        const filmCard = document.createElement('div');
        filmCard.className = 'film-card';
        
        // Format release date
        const releaseDate = new Date(film.release_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Fill card content with film details
        filmCard.innerHTML = `
            <h2 class="film-title">${film.title}</h2>
            <p class="film-episode">Episode ${film.episode_id}</p>
            <div class="film-details">
                <p class="film-detail"><span>Director:</span> ${film.director}</p>
                <p class="film-detail"><span>Release Date:</span> ${releaseDate}</p>
                <p class="film-detail"><span>Producer:</span> ${film.producer}</p>
            </div>
            <div class="film-crawl">${film.opening_crawl}</div>
            <button class="view-details-btn" data-film-id="${film.episode_id}">View Details</button>
        `;
        
        // Add click event for the entire card to show details
        filmCard.addEventListener('click', () => {
            showFilmDetails(film);
        });
        
        filmsContainer.appendChild(filmCard);
    });
    
    // Add click events to detail buttons
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click
            const filmId = parseInt(e.target.dataset.filmId);
            const film = filmsData.find(f => f.episode_id === filmId);
            if (film) {
                showFilmDetails(film);
            }
        });
    });
}

/**
 * Show detailed information about a film in the modal.
 * 
 * Precondition: `film` is a film object containing detailed film information.
 * Postcondition: The modal is displayed with the detailed film information, 
 *                and resources like characters, planets, and starships are loaded.
 * 
 * @param {Object} film - The film whose details need to be displayed.
 */
async function showFilmDetails(film) {
    modalContent.innerHTML = `<h2 class="film-title">${film.title}</h2>
                            <p class="film-episode">Episode ${film.episode_id}</p>
                            <hr style="margin: 15px 0; border-color: #FFE81F;">
                            <p><strong>Director:</strong> ${film.director}</p>
                            <p><strong>Producer:</strong> ${film.producer}</p>
                            <p><strong>Release Date:</strong> ${new Date(film.release_date).toLocaleDateString()}</p>
                            <p><strong>Opening Crawl:</strong></p>
                            <div style="font-style: italic; margin: 15px 0; line-height: 1.6; padding: 15px; background: rgba(0,0,0,0.3);">
                                ${film.opening_crawl}
                            </div>
                            <div class="additional-info">
                                <h3 style="color: #FFE81F; margin-top: 20px;">Characters</h3>
                                <div id="characters-container" class="loading">Loading characters...</div>
                                
                                <h3 style="color: #FFE81F; margin-top: 20px;">Planets</h3>
                                <div id="planets-container" class="loading">Loading planets...</div>
                                
                                <h3 style="color: #FFE81F; margin-top: 20px;">Starships</h3>
                                <div id="starships-container" class="loading">Loading starships...</div>
                            </div>`;
    
    modal.style.display = 'block';
    
    // Fetch and display characters, planets, and starships
    try {
        const characters = await fetchResourcesFromUrls(film.characters);
        displayResourceList('characters-container', characters, 'name');
    } catch (error) {
        document.getElementById('characters-container').innerHTML = 'Failed to load characters';
    }
    
    try {
        const planets = await fetchResourcesFromUrls(film.planets);
        displayResourceList('planets-container', planets, 'name');
    } catch (error) {
        document.getElementById('planets-container').innerHTML = 'Failed to load planets';
    }
    
    try {
        const starships = await fetchResourcesFromUrls(film.starships);
        displayResourceList('starships-container', starships, 'name');
    } catch (error) {
        document.getElementById('starships-container').innerHTML = 'Failed to load starships';
    }
}

/**
 * Fetch resources from a list of URLs.
 * 
 * Precondition: `urls` is an array of valid URLs.
 * Postcondition: An array of resource data is returned.
 * 
 * @param {Array} urls - The list of URLs to fetch data from.
 * @returns {Array} - The array of fetched resources.
 */
async function fetchResourcesFromUrls(urls) {
    const fetchPromises = urls.map(url => 
        fetch(url)
            .then(res => res.json())
            .then(data => data.result.properties)
    );
    
    return Promise.all(fetchPromises);
}

/**
 * Display a list of resources (characters, planets, or starships).
 * 
 * Precondition: `containerId` is the ID of an HTML element to hold the resource list.
 *              `resources` is an array of resources (characters, planets, or starships).
 *              `nameProperty` is the name property to display for each resource.
 * Postcondition: A list of resources is displayed in the container, 
 *                or a message 'None' is shown if no resources exist.
 * 
 * @param {string} containerId - The ID of the container element.
 * @param {Array} resources - The resources to display.
 * @param {string} nameProperty - The property to display for each resource.
 */
function displayResourceList(containerId, resources, nameProperty) {
    const container = document.getElementById(containerId);
    
    if (resources.length === 0) {
        container.innerHTML = 'None'; // If no resources, display 'None'
        return;
    }
    
    const list = document.createElement('ul');
    list.style.cssText = 'list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 10px;';
    
    resources.forEach(resource => {
        const item = document.createElement('li');
        item.style.cssText = 'background: rgba(255,232,31,0.1); padding: 5px 10px; border-radius: 5px; margin: 5px 0;';
        item.textContent = resource[nameProperty] || 'Unknown'; // Display the name or 'Unknown' if not available
        list.appendChild(item);
    });
    
    container.innerHTML = '';
    container.appendChild(list);
}

/**
 * Create animated stars in the background for visual effect.
 * 
 * Precondition: None
 * Postcondition: 100 randomly positioned and animated stars are created and added to the page.
 */
function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';
    document.body.appendChild(starsContainer);
    
    // Create 100 stars with random positions and animation durations
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDuration = `${Math.random() * 3 + 1}s`;
        starsContainer.appendChild(star);
    }
}

// Initialize stars on page load
createStars();
