document.addEventListener('DOMContentLoaded', init);
let items = [];

function init() {
    let divC = document.createElement('div');
    divC.classList.add('slideshow__slide');
    let slideShow = document.querySelector('.slideshow');
    slideShow.prepend(divC);


    let url = '../slideShow.json';
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then(loadContent)
        .catch((err) => {
            console.log('ERROR:', err);
        });
}


function loadContent(data) {
    let dfImages = new DocumentFragment();
    let dfIndicators = new DocumentFragment();
    data.items.forEach((item, idx) => {
        let img = prepareImage(item, idx);
        let indicator = createIndicators(idx);
        dfImages.appendChild(img);
        dfIndicators.appendChild(indicator);
    })
    let contentDiv = document.querySelector('.slideshow__slide');
    contentDiv.appendChild(dfImages);
    let slideShowNav = document.querySelector('.slideshow__nav');
    slideShowNav.appendChild(dfIndicators);
    document.querySelector('.slideshow__item-image').classList.add('current');
    document.querySelector('.slideshow__indicator').classList.add('current-indicator');
    items = document.querySelectorAll('.slideshow__item');
    // start();

}

function prepareImage(item, index) {
    let img = document.createElement('img');
    img.classList.add('slideshow__item-image');
    img.setAttribute("data-index", index)
    img.src = `../images/${item.img}`;
    return img;
}

function createIndicators(index) {
    let button = document.createElement('button');
    button.classList.add('slideshow__indicator');
    button.setAttribute('data-index', index)
    return button;
}

// function start() {
//     setInterval(() => {
//         let [first, ...rest] = items;
//         items = [...rest, first];
//         switchItem(0)
//     }, 3000)
// }

// function switchItem(index) {
//     let current = document.querySelector('.current');
//     current.classList.remove('current');
//     current.classList.add('leaving');
//     setInterval(() => {
//         current.classList.remove('leaving');
//     }, 800)
//     items[index].classList.add('current');
// }