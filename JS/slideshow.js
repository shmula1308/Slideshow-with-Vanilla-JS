document.addEventListener('DOMContentLoaded', init);
const pauseBtn = document.querySelector('.fa-pause-circle');
const playBtn = document.querySelector('.fa-play-circle');
const leftArrow = document.querySelector('.fa-arrow-circle-left');
const rightArrow = document.querySelector('.fa-arrow-circle-right');
// Leaving these variable outside so that all functions have access to them
let divC;
let indicatorsNav;
let items = [];
let counter = 1;
let size;
//Timmy is here to stop setInterval() when needed.
let timmy;
//Time delay of the slideshow. You can change this value. Current is 3 seconds. Don't go lower than 300ms
let delay = 3000;


// On resize of the window width of images does not readjust. Here we reload tha page everytime window width or height changes.
window.onresize = () => {
    location.reload();
}

// Init creates the container for slide images and prepends it to the slideshow container in html
function init() {
    let divC = document.createElement('div');
    divC.classList.add('slideshow__slide');
    let slideShow = document.querySelector('.slideshow');
    slideShow.prepend(divC);

    //Here we fetch the json data created stored locally. We pass the data to loadContent(function)

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

// We use DocumentFragment to append created elements to the DOM.
// We create images, dot indicators and cloned images.
function loadContent(data) {
    let dfImages = new DocumentFragment();
    let dfIndicators = new DocumentFragment();
    data.items.forEach((item, idx) => {
        let img = createImages(item, idx);
        let indicator = createIndicators(idx);
        dfImages.appendChild(img);
        dfIndicators.appendChild(indicator);
    })
    divC = document.querySelector('.slideshow__slide');
    divC.appendChild(dfImages);
    let slideShowNav = document.querySelector('.slideshow__nav');
    slideShowNav.appendChild(dfIndicators);
    let clones = createClones(divC);
    divC.prepend(clones[1]);
    divC.append(clones[0]);
    // We assign these DOM element to global variables. Items is an array like item. IndicatorsNav is the container holding the circular indicator buttons.
    items = document.querySelectorAll('.slideshow__item-image');
    indicatorsNav = document.querySelector('.slideshow__nav');

    // Getting the first elements in the list with the specified classes and adding to them current class
    document.querySelector('.slideshow__item-image').classList.add('current');
    document.querySelector('.slideshow__indicator').classList.add('current-indicator');

    // We setup the first image to appear on the screen when loading the page
    setupFirstImage(divC, divC.children);

    //We start the slideshow
    start(divC);

    // This is to make the slideshow infinite. On transitionend event looks for the cloned elements and immidately jumps to the beginning or end of the list. We have removed transtion property so that we don see the jump.
    divC.addEventListener('transitionend', () => {
        if (items[counter].id === 'lastClone') {
            divC.style.transition = 'none';
            counter = items.length - 2;
            divC.style.transform = `translateX(-${size * counter}px)`;
        }
        if (items[counter].id === 'firstClone') {
            divC.style.transition = 'none';
            counter = 1;
            divC.style.transform = `translateX(-${size * counter}px)`;
        }
    })

    //Left and right arrow events
    leftArrow.addEventListener('click', slideBack);
    rightArrow.addEventListener('click', slideForward);

    //Contorlling slides with dot indicators
    indicatorsNav.addEventListener('click', moveSlidesWithDots);

    //Pause and play events
    pauseBtn.addEventListener('click', pause);
    playBtn.addEventListener('click', play);

}

//In order to get the width of the image, we need to wait for it to load. otherwise clientWidth will give us false values. We begin with counter set at value of 1.
function setupFirstImage(content, imagesArr) {
    imagesArr[0].addEventListener('load', () => {
        size = items[0].clientWidth;
        content.style.transform = `translateX(-${size * counter}px)`;
    })
}


function start(divC) {
    timmy = setInterval(() => {
        counter++;
        divC.style.transition = 'all 250ms ease-in';
        divC.style.transform = `translateX(-${size * counter}px)`;
        updateCurrentDot(counter);
    }, delay)
}

//we use closest() method to ignore all click events that are not buttons
function moveSlidesWithDots(ev) {
    if (!ev.target.closest('button')) return;
    //The value returned from data-index is a string. We have to convert it to a number.
    let idx = ev.target.getAttribute('data-index');
    counter = Number(idx) + 1;

    updateCurrentDot(counter)

    divC.style.transition = 'all 250ms ease-in';
    divC.style.transform = `translateX(-${size * (+idx + 1)}px)`;
}

function slideBack() {
    if (counter <= 0) return;
    counter--;

    updateCurrentDot(counter);

    divC.style.transition = 'all 250ms ease-in';
    divC.style.transform = `translateX(-${size * counter}px)`;
}

function slideForward() {
    if (counter >= items.length - 1) return;
    counter++;

    updateCurrentDot(counter);

    divC.style.transition = 'all 250ms ease-in';
    divC.style.transform = `translateX(-${size * counter}px)`;
}


function updateCurrentDot(counter) {
    if (counter === items.length - 1) counter = 1;
    if (counter === 0) counter = items.length - 2;
    indicatorsNav.querySelector('.current-indicator').classList.remove('current-indicator');
    indicatorsNav.children[counter - 1].classList.add('current-indicator')
}

function createImages(item, index) {
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

function createClones(content) {
    let firstClone = content.firstChild.cloneNode(true);
    let lastClone = content.lastChild.cloneNode(true);
    firstClone.id = "firstClone";
    lastClone.id = "lastClone";
    return [firstClone, lastClone]
}

function pause() {
    clearInterval(timmy);
    pauseBtn.style.display = "none";
    playBtn.style.display = "block";
}

function play() {
    start(divC);
    playBtn.style.display = "none"
    pauseBtn.style.display = "block"
}