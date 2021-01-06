const leftArrow = document.querySelector('.fa-arrow-circle-left');
const rightArrow = document.querySelector('.fa-arrow-circle-right');
const pause = document.querySelector('.fa-pause-circle');
const play = document.querySelector('#play');
const indicatorsNav = document.querySelector('.slideshow__nav');

let delay = 3000;
let items = [];
let counter = 1;
let timmy;


document.addEventListener('DOMContentLoaded', init);


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

    //Clone first and last child of contentDiv and insert them at opposite ends.

    let firstClone = contentDiv.firstChild.cloneNode(true);
    let lastClone = contentDiv.lastChild.cloneNode(true);
    firstClone.id = "firstClone";
    lastClone.id = "lastClone";

    contentDiv.prepend(lastClone);
    contentDiv.append(firstClone);
    //Insert nav indicators
    let slideShowNav = document.querySelector('.slideshow__nav');
    slideShowNav.appendChild(dfIndicators);

    //Add current class to the first image on the list
    document.querySelector('.slideshow__item-image').classList.add('current');
    //add current class to the first indicator
    document.querySelector('.slideshow__indicator').classList.add('current-indicator');

    //store the array of images in the empty array item
    items = document.querySelectorAll('.slideshow__item-image');

    //Wait for images to load before measuring width, otherwise you get incorrect results, since I'm generating them with JS.Then set the first image, not the clone as the first image displayed on screen.
    let itemsArr = Array.from(items);
    itemsArr[0].addEventListener("load", () => {
        size = items[0].clientWidth;
        console.log(size, itemsArr)
        contentDiv.style.transform = `translateX(-${size * counter}px)`;
        //Set eventlistners on buttons
        leftArrow.addEventListener('click', () => {
            if (counter <= 0) return;
            counter--;
            contentDiv.style.transition = 'all 250ms ease-in';
            contentDiv.style.transform = `translateX(-${size * counter}px)`;
        })

        rightArrow.addEventListener('click', () => {
            if (counter >= items.length - 1) return;
            counter++;
            contentDiv.style.transition = 'all 250ms ease-in';
            contentDiv.style.transform = `translateX(-${size * counter}px)`;
        })

        contentDiv.addEventListener('transitionend', () => {
            if (items[counter].id === 'lastClone') {
                contentDiv.style.transition = 'none';
                counter = items.length - 2;
                contentDiv.style.transform = `translateX(-${size * counter}px)`;
            }
            if (items[counter].id === 'firstClone') {
                contentDiv.style.transition = 'none';
                counter = 1;
                contentDiv.style.transform = `translateX(-${size * counter}px)`;
            }
        })

        start(contentDiv);
        pause.addEventListener('click', () => {
            clearInterval(timmy);
            pause.style.display = "none";
            play.style.display = "block";
            indicatorsNav.style.display = "flex";

        })
        play.addEventListener('click', () => {
            let contentDiv = document.querySelector('.slideshow__slide');
            start(contentDiv);
            play.style.display = "none"
            pause.style.display = "block"
            indicatorsNav.style.display = "none";
        })
        indicatorsNav.addEventListener('click', (ev) => {
            if (!ev.target.closest('button')) return;
            indicatorsNav.querySelector('.current-indicator').classList.remove('current-indicator');
            ev.target.classList.add('current-indicator');
            let idx = ev.target.closest('button').getAttribute('data-index');
            console.log(idx)
            let contentDiv = document.querySelector('.slideshow__slide');
            contentDiv.style.transition = 'all 250ms ease-in';
            contentDiv.style.transform = `translateX(-${size * (+idx + 1)}px)`;
        })
    })
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

function start(slide) {
    timmy = setInterval(() => {
        counter++;
        slide.style.transition = 'all 250ms ease-in';
        slide.style.transform = `translateX(-${size * counter}px)`;
    }, delay)
}




