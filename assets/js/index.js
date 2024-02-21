window.addEventListener('load', () => {
    const searchForm = document.querySelector('.search form');
    const searchInput = document.querySelector('#searchBar');

    // searchForm.addEventListener('submit', (event) => {
    //     event.preventDefault();
    //     search(event, searchInput.value);
    // });

    searchForm.addEventListener('keyup', (event) => {
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

                //create individual result container
                const individualResult = document.createElement('div');
                individualResult.classList.add('individualResult');
                resultsContainer.appendChild(individualResult);

                //result title
                const resultTitle = document.createElement('h2');
                if (result._primaryTitle === '') {
                    resultTitle.textContent = 'No title available';
                } else {
                    resultTitle.textContent = result._primaryTitle;
                }
                individualResult.appendChild(resultTitle);

                //----------------------------------------------

                //result image
                const resultImage = document.createElement('img');
                if ((result._images._primary_thumbnail) === '') {
                    resultImage.src = 'https://via.placeholder.com/80';
                } else {
                    resultImage.src = result._images._primary_thumbnail;
                }
                individualResult.appendChild(resultImage);

                //----------------------------------------------

                //result description
                const resultDate = document.createElement('p');
                if (result._primaryDate === '') {
                    resultDate.textContent = 'No date available';
                } else {
                    resultDate.textContent = result._primaryDate;
                }
                individualResult.appendChild(resultDate);

                //----------------------------------------------

                //result place
                const resultPlace = document.createElement('p');
                if (result._primaryPlace === '') {
                    resultPlace.textContent = 'No place available';
                } else {
                    resultPlace.textContent = result._primaryPlace;
                }
                individualResult.appendChild(resultPlace);

                //----------------------------------------------
            });
        })
        .catch(error => console.log(error));
}