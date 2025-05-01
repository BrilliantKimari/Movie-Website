// Wait until the full DOM is loaded before running scripts
document.addEventListener('DOMContentLoaded', function() {
    highlightCurrentPage();      // Highlights the active page link in the navigation
    setupLetsGoButton();         // Adds event listener to "Let's Go" button
    setupWatchlistButtons();     // Enables all "Add to Watchlist" buttons
    displayWatchlist();          // Loads and displays saved watchlist movies
    setupWatchlistForm();        // Sets up the watchlist form submission
});


// Highlight Active Nav Link

function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Loop through all nav links and set 'active' class only on current page
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}


// Setup "Let's Go" Button

function setupLetsGoButton() {
    const letsGoButton = document.querySelector('#lets-go');

    // If button exists, navigate to movie.html on click
    if (letsGoButton) {
        letsGoButton.addEventListener('click', function() {
            window.location.href = 'movie.html';
        });
    }
}


// Setup Add to Watchlist Buttons

function setupWatchlistButtons() {
    // Find all buttons with the 'add-to-watchlist' class
    document.querySelectorAll('.add-to-watchlist').forEach(button => {
        button.addEventListener('click', function() {
            const movieCard = this.closest('.movie-card'); // Get parent card

            // Extract movie info from the card
            const movie = {
                title: movieCard.querySelector('h2').textContent,
                rating: movieCard.querySelector('p').textContent,
                image: movieCard.querySelector('img').src
            };

            addToWatchlist(movie); // Save movie to localStorage
            alert(`${movie.title} added to your watchlist!`);
        });
    });
}


// Add a Movie Object to Local Storage

function addToWatchlist(movie) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

    // Only add if not already in list (based on title)
    if (!watchlist.some(item => item.title === movie.title)) {
        watchlist.push(movie);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }
}


// Display Saved Watchlist Items

function displayWatchlist() {
    const watchlistContainer = document.getElementById('watchme');
    if (!watchlistContainer) return;

    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

    // Show message if watchlist is empty
    if (watchlist.length === 0) {
        watchlistContainer.innerHTML += `<p class="empty-watchlist">Your watchlist is empty</p>`;
        return;
    }

    // Create and insert watchlist movie cards
    watchlistContainer.innerHTML += `
        <div class="watchlist-items">
            ${watchlist.map(movie => `
                <div class="watchlist-item">
                    <img src="${movie.image}" alt="${movie.title}">
                    <h3>${movie.title}</h3>
                    <p>${movie.rating}</p>
                    <button class="remove-btn">Remove</button>
                </div>
            `).join('')}
        </div>
    `;

    // Add event listeners to each remove button
    document.querySelectorAll('.remove-btn').forEach((button, index) => {
        button.addEventListener('click', function() {
            removeFromWatchlist(index);
        });
    });
}


// Remove Movie from Watchlist by Index

function removeFromWatchlist(index) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlist.splice(index, 1); // Remove movie at given index
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    location.reload(); // Refresh to update UI
}


// Handle Watchlist Form Submit

function setupWatchlistForm() {
    const form = document.getElementById('watchbook');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent actual form submission
            alert('Your information has been saved!');
            form.reset(); // Clear the form inputs
        });
    }
}
