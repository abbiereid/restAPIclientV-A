window.addEventListener('load', () => {
    const searchForm = document.querySelector('.search form');
    const searchInput = document.querySelector('#searchBar');

    searchForm.addEventListener('keyup', (event) => {
        event.preventDefault();
        search(event, searchInput.value);
    });

    //Need to ask whether I should bite the bullet and use the submit event instead of keyup, alognside the actual API Search as you type. Just annoying because of the three character minimum.
})

//need to add clear option


async function search(event, input) {
    event.preventDefault();
    const URL = 'https://api.vam.ac.uk/v2/objects/search?q=' + input + "&data_profile=full"; //data profile full means entire record is returned, more details
    await fetch(URL)
        .then(response => response.json())
        .then(data => {
            console.log(data);

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

                    resultTitle.textContent = result._primaryTitle || 'No title available';
                    individualResult.appendChild(resultTitle);
    
                    //----------------------------------------------
    
                    //result image
                    const resultImage = document.createElement('img');
                    let big = false;

                    resultImage.src = result._images._primary_thumbnail || 'https://via.placeholder.com/80';
                    individualResult.appendChild(resultImage);
                    resultImage.alt = result.physicalDescription || 'No alt text available, see below for details';

                    const instruction = document.createElement('p');
                    instruction.textContent = 'Click image to expand';
                    individualResult.appendChild(instruction);


                    if(resultImage != undefined) {
                        resultImage.addEventListener('click', () => {
                            if (big) {
                                resultImage.src = result._images._primary_thumbnail;
                                resultImage.classList.remove('bigImage');
                                big = false;
                            } else {
                                resultImage.src = 'https://framemark.vam.ac.uk/collections/'+ result._primaryImageId +'/full/full/0/default.jpg';
                                resultImage.classList.add('bigImage');
                                big = true;
                            }
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
        .catch(error => console.log(error));
}

