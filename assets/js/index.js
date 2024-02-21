window.addEventListener('load', () => {
    const searchForm = document.querySelector('.search form');
    const searchInput = document.querySelector('#searchBar');

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        search(event, searchInput.value);
    });
});

async function search(event, input) {
    event.preventDefault();
    const URL = 'https://api.vam.ac.uk/v2/objects/search?q=' + input;
    await fetch(URL)
        .then(response => response.json())
        .then(data => {
            const results = data.records;
            const resultsContainer = document.querySelector('.results');
            resultsContainer.textContent = '';

            results.forEach(result => {
                const resultElement = document.createElement('p');
                resultElement.textContent = JSON.stringify(result);
                resultsContainer.appendChild(resultElement);
            });
        })
        .catch(error => console.log(error));
}