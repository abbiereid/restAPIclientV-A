window.addEventListener('load', () => {
    const searchForm = document.querySelector('.search form');
    const searchInput = document.querySelector('#searchBar');
    
    let SAYTcheck = true;

    const error = document.querySelector('#searchBlank');

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        SAYTcheck = false;

        if (searchInput.value.length == 0) {
           if (error.classList.contains('hidden')) {
               error.classList.remove('hidden');
           }
        } else {
            search(event, searchInput.value);
            if (!(error.classList.contains('hidden'))) {
                error.classList.add('hidden');
            }
        }

    });


    searchForm.addEventListener('keyup', (event) => {
        event.preventDefault();
        if (SAYTcheck && searchInput.value.length >= 3) {
            SAYT(event, searchInput.value);
        }
    });

    const advancedButton = document.querySelector('#advancedButton');
    advancedButton.addEventListener('click', () => {
        const options = document.querySelector('#searchOptions');
        options.classList.toggle('hidden');
    });

    const clearButton = document.querySelector('#clearButton');
    clearButton.addEventListener('click', () => {
        const resultsContainer = document.querySelector('.results');
        resultsContainer.textContent = '';
        searchInput.value = '';
        SAYTcheck = true;
    });

})

function search(event, input) {
    event.preventDefault();

    //building the URL

    const englandFilter = document.querySelector('#England');
    const franceFilter = document.querySelector('#France');
    const germanyFilter = document.querySelector('#Germany');
    const resultAmount = document.querySelector('#resultAmount');

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
        URL += "&image=false";
    } else {
        URL += "&image=true";
    }

    URL += "&data_profile=full";

    URL += "&page_size=" + resultAmount.value;

    //----------------------------------------------

    //getting results container

    const resultsContainer = document.querySelector('.results');
    const loading = document.createElement('img');
    loading.src = 'assets/images/loading.gif';

    //----------------------------------------------

    const popup = document.querySelector('#popup');
    const close = document.querySelector('#close');

    close.addEventListener('click', () => {
        popup.classList.toggle('hidden');
        popup.children[1].remove();
        resultsContainer.classList.toggle('hidden');
    });

    //----------------------------------------------

    resultsContainer.appendChild(loading);

    //----------------------------------------------

    fetch(URL)
        .then(response => response.json())
        .then(data => {

            resultsContainer.textContent = '';
            resultsContainer.classList.add('flexContainer');

            const results = data.records;

            if (results.length === 0) {
                const noResults = document.createElement('h2');
                noResults.textContent = 'No results found';
                noResults.classList.add('textError');
                resultsContainer.appendChild(noResults);
            } else {
                results.forEach(result => {

                    //create individual result container
                    const individualResult = document.createElement('div');
                    individualResult.classList.add('individualResult');
                    resultsContainer.appendChild(individualResult);

                    //----------------------------------------------

                    const contentDiv = document.createElement('div');
                    contentDiv.classList.add('contentDiv');
                    individualResult.appendChild(contentDiv);

                    const imageDiv = document.createElement('div');
                    imageDiv.classList.add('imageDiv');
                    individualResult.appendChild(imageDiv);

                    const extraDiv = document.createElement('div');
                    extraDiv.classList.add('extraDiv');
                    extraDiv.classList.add('hidden');
                    individualResult.appendChild(extraDiv);

                    //----------------------------------------------
    
                    //result title
                    const resultTitle = document.createElement('h2');

                    resultTitle.textContent = result._primaryTitle || 'No title available';
                    contentDiv.appendChild(resultTitle);
    
                    //----------------------------------------------
    
                    //result image

                    const resultImage = new Image();

                    resultImage.src = result._images._primary_thumbnail;

                    resultImage.onload = () => {
                        imageDiv.appendChild(resultImage);
                        resultImage.alt = result.physicalDescription || 'No alt text avaliable, see below for a description of the record';

                        const instruction = document.createElement('p');
                        instruction.textContent = 'Click image to expand';
                        imageDiv.appendChild(instruction);

                        resultImage.classList.add('clickable');

                        resultImage.addEventListener('click', () => {
                            const bigImage = new Image();
                            bigImage.src = 'https://framemark.vam.ac.uk/collections/'+ result._primaryImageId + '/full/full/0/default.jpg';
                            bigImage.classList.add('bigImage');
                            bigImage.alt = resultImage.alt;

                            resultsContainer.classList.toggle('hidden');

                            bigImage.onload = () => {
                                popup.classList.toggle('hidden');
                                popup.appendChild(bigImage);
                            }

                            bigImage.onerror = () => {
                                popup.classList.toggle('hidden');
                                const error = document.createElement('h2');
                                popup.appendChild(error);
                                error.classList.add('textError');
                                error.textContent = 'There was a problem expanding this image, please try again later';
                            }
                        });
                    }

                    resultImage.onerror = () => {
                        resultImage.src = 'assets/images/noImage.png';
                        resultImage.classList.add('noImage');
                        imageDiv.appendChild(resultImage);
                        resultImage.alt = 'No image available';
                    }
    
                    //----------------------------------------------
    
                    //result Date
                    const resultDate = document.createElement('h3');

                    resultDate.textContent = result._primaryDate || 'No date available';
                    contentDiv.appendChild(resultDate);
    
                    //----------------------------------------------
    
                    //result place

                    const resultPlace = document.createElement('h3');

                    resultPlace.textContent = result._primaryPlace || 'No place available';
                    contentDiv.appendChild(resultPlace);
    
                    //----------------------------------------------

                    //result description/extra details

                    const makerTitle = document.createElement('h3');
                    makerTitle.textContent = 'Created By';
                    extraDiv.appendChild(makerTitle);

                    const resultMaker = document.createElement('p');
                    resultMaker.textContent = result._primaryMaker.name + ' , ' + result._primaryMaker.association || 'No maker available';
                    extraDiv.appendChild(resultMaker);

                    const descTitle = document.createElement('h3');
                    descTitle.textContent = 'Description';
                    extraDiv.appendChild(descTitle);
                    
                    const description = document.createElement('p');
                    description.textContent = result.summaryDescription || 'No description available';
                    extraDiv.appendChild(description);

                    //----------------------------------------------

                    //result expand button
                    const expandButton = document.createElement('button');
                    expandButton.classList.add('expandButton');
                    expandButton.textContent = 'View more';
                    individualResult.appendChild(expandButton);
                    expandButton.addEventListener('click', () => {
                        extraDiv.classList.toggle('hidden');
                        expandButton.textContent = extraDiv.classList.contains('hidden') ? 'View more' : 'View less';

                        const allResults = document.querySelectorAll('.individualResult');
                        allResults.forEach(result => {
                            if (result !== individualResult) {
                                result.classList.toggle('hidden');
                            }
                        });

                        individualResult.classList.toggle('expanded');

                    });
                });
            }
        })
        .catch(error => searchError(error));
}
    

function SAYT(event,input) {
    event.preventDefault();
    const URL = 'https://api.vam.ac.uk/v2/sayt/search?q=' + input + "&data_profile=full";
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            
            const results = data.records;
            const resultsContainer = document.querySelector('.results');
            resultsContainer.textContent = '';
            resultsContainer.classList.remove('flexContainer');

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
                    resultTitle.classList.add('clickable');
    
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

function searchError(error) {
    console.log(error);
    const noResults = document.createElement('h2');
    noResults.textContent = 'There has been a problem with your search, please try again';
    noResults.classList.add('textError');
    const resultsContainer = document.querySelector('.results');
    resultsContainer.textContent = '';
    resultsContainer.appendChild(noResults);
}