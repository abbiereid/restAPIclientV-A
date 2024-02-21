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

                //result title
                const resultTitle = document.createElement('h2');
                if (result._primaryTitle === undefined) {
                    resultTitle.textContent = 'No title available';
                } else {
                    resultTitle.textContent = result._primaryTitle;
                }
                resultsContainer.appendChild(resultTitle);

                //----------------------------------------------

                //result image
                const resultImage = document.createElement('img');
                if ((result._images._primary_thumbnail) === undefined) {
                    resultImage.src = 'https://via.placeholder.com/80';
                } else {
                    resultImage.src = result._images._primary_thumbnail;
                }
                resultsContainer.appendChild(resultImage);

                //----------------------------------------------

                //result description
                const resultDate = document.createElement('p');
                if (result._primaryDate === undefined) {
                    resultDate.textContent = 'No description available';
                } else {
                    resultDate.textContent = result._primaryDate;
                }
                resultsContainer.appendChild(resultDate);

                //----------------------------------------------
            });
        })
        .catch(error => console.log(error));
}