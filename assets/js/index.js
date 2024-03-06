window.addEventListener('load', () => {
    const searchForm = document.querySelector('.search form');
    const searchInput = document.querySelector('#searchBar');
    const searchButton = document.querySelector('#searchButton');

    saytCheck = true;

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        saytCheck = false;
        search(event, searchInput.value);
    });


    if (saytCheck) {
        searchForm.addEventListener('keyup', (event) => {
            event.preventDefault();
            if (searchInput.value.length >= 3) {
                SAYT(event, searchInput.value);
            }
        });
    }
    

    const filterButton = document.querySelector('#filterButton');
    filterButton.addEventListener('click', () => {
        filter();
    });

    const advancedButton = document.querySelector('#advancedButton');
    advancedButton.addEventListener('click', () => {
        const options = document.querySelector('.searchOptions');
        if (options.style.display === 'none') {
            options.style.display = 'block';
        } else {
            options.style.display = 'none';
        }
    });

    const clearButton = document.querySelector('#clearButton');
    clearButton.addEventListener('click', () => {
        const resultsContainer = document.querySelector('.results');
        resultsContainer.textContent = '';
        searchInput.value = '';
        saytCheck = true;
    });
        
})




function search(event, input) {
    event.preventDefault();

    const englandFilter = document.querySelector('#England');
    const franceFilter = document.querySelector('#France');
    const germanyFilter = document.querySelector('#Germany');
    const resultAmount = document.querySelector('.resultAmount');

    let URL = 'https://api.vam.ac.uk/v2/objects/search?q=' + input;

    if (englandFilter.checked) {
        URL += englandFilter.value;
    } else if (franceFilter.checked) {
        URL += franceFilter.value;
    } else if (germanyFilter.checked) {
        URL += germanyFilter.value;
    }

    const orderBy = document.querySelector('#sort').value;
    if (orderBy != 'relevance') {
        URL += "&order_by=" + orderBy;
    }

    URL += "&order_sort="+ document.querySelector('#order').value;

    //fix this
    if (document.querySelector('#imgReq').checked) {
        URL += "&image=true";
    }

    URL += "&data_profile=full";

    URL += "&page_size=" + resultAmount.value;

    console.log(URL);

    const resultsContainer = document.querySelector('.results');
    const loading = document.createElement('img');
    loading.src = 'assets/images/loading.gif';

    resultsContainer.appendChild(loading);


    fetch(URL)
        .then(response => response.json())
        .then(data => {

            resultsContainer.textContent = '';

            const results = data.records;

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

                    //----------------------------------------------
    
                    //result title
                    const resultTitle = document.createElement('h2');

                    resultTitle.textContent = result._primaryTitle || 'No title available';
                    individualResult.appendChild(resultTitle);
    
                    //----------------------------------------------
    
                    //result image

                    //making an image div because of loading times, images move.
                    const imageDiv = document.createElement('div');
                    individualResult.appendChild(imageDiv);

                    const resultImage = new Image();

                    resultImage.src = result._images._primary_thumbnail;

                    resultImage.onload = () => {
                        imageDiv.appendChild(resultImage);
                        resultImage.alt = result.physicalDescription || 'No alt text avaliable, see below for a description of the record';
                    }

                    resultImage.onerror = () => {
                        resultImage.src = 'assets/images/noImage.png';
                        resultImage.classList.add('noImage');
                        imageDiv.appendChild(resultImage);
                        resultImage.alt = 'No image available';
                    }

                    if (result._images._primary_thumbnail) {

                        resultImage.style.cursor = 'pointer';

                        const instruction = document.createElement('p');
                        instruction.textContent = 'Click image to expand';
                        individualResult.appendChild(instruction);

                            
                        resultImage.addEventListener('click', () => {
                            const popup = document.querySelector('.popup');
                            const bigImage = document.createElement('img');
                            bigImage.src = 'https://framemark.vam.ac.uk/collections/'+ result._primaryImageId +'/full/full/0/default.jpg';
                            bigImage.classList.add('bigImage');
                            popup.style.display = 'block';
                            popup.appendChild(bigImage);

                            const close = document.querySelector('.close');
                            close.addEventListener('click', () => {
                                popup.style.display = 'none';
                                popup.removeChild(bigImage);
                            });

                        });
                    }
    
                    //----------------------------------------------
    
                    //result Date
                    const resultDate = document.createElement('h3');

                    resultDate.textContent = result._primaryDate || 'No date available';
                    individualResult.appendChild(resultDate);
    
                    //----------------------------------------------
    
                    //result place

                    const resultPlace = document.createElement('h3');

                    resultPlace.textContent = result._primaryPlace || 'No place available';
                    individualResult.appendChild(resultPlace);
    
                    //----------------------------------------------

                    //result description/extra details

                    const makerTitle = document.createElement('h3');
                    makerTitle.textContent = 'Created By';

                    const resultMaker = document.createElement('p');
                    resultMaker.textContent = result._primaryMaker.name + ' , ' + result._primaryMaker.association || 'No maker available';

                    const descTitle = document.createElement('h3');
                    descTitle.textContent = 'Description';
                    
                    const description = document.createElement('p');
                    description.textContent = result.summaryDescription || 'No description available';

                    //----------------------------------------------

                    //result expand button
                    const expandButton = document.createElement('button');
                    expandButton.classList.add('expandButton');
                    expandButton.textContent = 'View more';
                    individualResult.appendChild(expandButton);
                    expandButton.addEventListener('click', () => {
                        individualResult.appendChild(makerTitle);
                        individualResult.appendChild(resultMaker);
                        individualResult.appendChild(descTitle);
                        individualResult.appendChild(description);
                        individualResult.removeChild(expandButton);
                        individualResult.appendChild(minimiseButton);
                    });

                    //----------------------------------------------

                    //result minimise button
                    const minimiseButton = document.createElement('button');
                    minimiseButton.classList.add('expandButton');
                    minimiseButton.textContent = 'View less';
                    minimiseButton.addEventListener('click', () => {
                        individualResult.removeChild(makerTitle);
                        individualResult.removeChild(resultMaker);
                        individualResult.removeChild(description);
                        individualResult.removeChild(descTitle);
                        individualResult.appendChild(expandButton);
                        individualResult.removeChild(minimiseButton);
                    });
    
                });
            }
        })
        .catch(error => alert(error));
}

async function SAYT(event,input) {
    event.preventDefault();
    const URL = 'https://api.vam.ac.uk/v2/sayt/search?q=' + input + "&data_profile=full";
    await fetch(URL)
        .then(response => response.json())
        .then(data => {
            
            const results = data.records;
            const resultsContainer = document.querySelector('.results');
            resultsContainer.textContent = '';

            //suggestions heading
            const suggestions = document.createElement('h2');

            if (results.length === 0) {
                suggestions.textContent = 'No suggestions found';
                resultsContainer.appendChild(suggestions);
            } else {

                suggestions.textContent = 'Suggestions';
                resultsContainer.appendChild(suggestions);
                const instructions = document.createElement('p');
                instructions.textContent = 'Click suggestion to search';
                resultsContainer.appendChild(instructions);

                results.forEach(result => {
                    //suggestions title
                    const resultTitle = document.createElement('h3');
                    resultTitle.classList.add('suggestionTitle');
    
                    resultTitle.textContent = result.displayName || 'No title available';
                    resultsContainer.appendChild(resultTitle);

                    resultTitle.addEventListener('click', () => {
                        search(event, result.displayName);
                    });

                });
            }
        })
        .catch(error => alert(error));
}


//filtering - needs work
function filter() {
    const filterBox = document.querySelector('.filterBox');
    if (filterBox.style.display === 'inline-block') {
        filterBox.style.display = 'none';
    } else {
        filterBox.style.display = 'inline-block';
    }
}
