// script.js

// Функція для отримання даних з API
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error fetching data from ${url}`);
    }
    return response.json();
}

// Функція для відображення списку фільмів та персонажів
async function displayFilms() {
    const body = document.body;
    const header = document.createElement('h1');
    header.textContent = 'Star Wars Films';
    body.appendChild(header);

    try {
        const films = await fetchData('https://ajax.test-danit.com/api/swapi/films');
        films.forEach(async film => {
            const filmDiv = document.createElement('div');
            filmDiv.innerHTML = `
                <h2>Episode ${film.episodeId}: ${film.name}</h2>
                <p>${film.openingCrawl}</p>
                <div id="characters-${film.id}" class="loading">
                    <div class="spinner"></div>
                    Loading characters...
                </div>
            `;
            body.appendChild(filmDiv); 

            // Отримуємо та виводимо персонажів для фільму
            const charactersContainer = document.getElementById(`characters-${film.id}`);
            try {
                const characterPromises = film.characters.map(characterUrl => fetchData(characterUrl));
                const characters = await Promise.all(characterPromises);

                charactersContainer.innerHTML = '';
                characters.forEach(character => {
                    const characterDiv = document.createElement('div');
                    characterDiv.textContent = character.name;
                    charactersContainer.appendChild(characterDiv);
                });
            } catch (error) {
                charactersContainer.textContent = 'Failed to load characters';
                console.error(error);
            }
        });
    } catch (error) {
        const errorDiv = document.createElement('div');
        errorDiv.textContent = 'Failed to load films';
        body.appendChild(errorDiv);
        console.error(error);
    }
}

displayFilms();
