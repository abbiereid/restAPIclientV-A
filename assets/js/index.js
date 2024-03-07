window.addEventListener('load', () => {
    const searchForm = document.querySelector('.search form');
    const searchInput = document.querySelector('#searchBar');

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
        const filterBox = document.querySelector('#filterBox');
        filterBox.classList.toggle('hidden');
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
        URL += "&image=false";
    } else {
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

                    resultImage.src = 'https://framemark.vam.ac.uk/collections/'+ result._primaryImageId + '/full/full/0/default.jpg';

                    resultImage.onload = () => {
                        imageDiv.appendChild(resultImage);
                        resultImage.alt = result.physicalDescription || 'No alt text avaliable, see below for a description of the record';

                        const instruction = document.createElement('p');
                        instruction.textContent = 'Click image to expand';
                        imageDiv.appendChild(instruction);

                        resultImage.classList.add('clickable');

                        resultImage.addEventListener('click', () => {
                            const popup = document.querySelector('.popup');
                            const bigImage = document.createElement('img');
                            bigImage.src = resultImage.src;
                            bigImage.classList.add('bigImage');
                            popup.classList.remove('hidden');
                            popup.appendChild(bigImage);

                            const close = document.querySelector('.close');
                            close.addEventListener('click', () => {
                                popup.classList.add('hidden');
                                popup.removeChild(bigImage);
                            });

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

