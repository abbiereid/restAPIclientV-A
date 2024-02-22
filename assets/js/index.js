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

            if (results.length === 0) {
                const noResults = document.createElement('h2');
                noResults.textContent = 'No results found';
                resultsContainer.appendChild(noResults);
            } else {
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
                    
                    if ((result._images._primary_thumbnail) === undefined) {
                        resultImage.src = 'https://via.placeholder.com/80';
                    } else {
                        resultImage.src = result._images._primary_thumbnail;
                    }
                    individualResult.appendChild(resultImage);
    
                    //----------------------------------------------
    
                    //result description
                    const resultDate = document.createElement('h3');
                    if (result._primaryDate === '') {
                        resultDate.textContent = 'No date available';
                    } else {
                        resultDate.textContent = result._primaryDate;
                    }
                    individualResult.appendChild(resultDate);
    
                    //----------------------------------------------
    
                    //result place
                    const resultPlace = document.createElement('h3');
                    if (result._primaryPlace === '') {
                        resultPlace.textContent = 'No place available';
                    } else {
                        resultPlace.textContent = result._primaryPlace;
                    }
                    individualResult.appendChild(resultPlace);
    
                    //----------------------------------------------

                    //result description

                    const resultMaker = document.createElement('p');
                    if (result._primaryMaker === '') {
                        resultMaker.textContent = 'No primary maker available';
                    } else {
                        resultMaker.textContent = result._primaryMaker.name + ' , ' + result._primaryMaker.association;
                    }

                    //----------------------------------------------

                    //result expand button
                    const expandButton = document.createElement('button');
                    expandButton.classList.add('expandButton');
                    expandButton.textContent = 'View more';
                    individualResult.appendChild(expandButton);
                    expandButton.addEventListener('click', () => {
                        individualResult.appendChild(resultMaker);
                        individualResult.removeChild(expandButton);
                        individualResult.appendChild(minimiseButton);
                    });

                    //----------------------------------------------

                    //result minimise button
                    const minimiseButton = document.createElement('button');
                    minimiseButton.classList.add('expandButton');
                    minimiseButton.textContent = 'View less';
                    minimiseButton.addEventListener('click', () => {
                        individualResult.removeChild(resultMaker);
                        individualResult.appendChild(expandButton);
                        individualResult.removeChild(minimiseButton);
                    });
    
                });
            }
        })
        .catch(error => console.log(error));
}

