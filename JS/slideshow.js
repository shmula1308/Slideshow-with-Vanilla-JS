document.addEventListener('DOMContentLoaded', init);
const pauseBtn = document.querySelector('.fa-pause-circle');
const playBtn = document.querySelector('.fa-play-circle');
const leftArrow = document.querySelector('.fa-arrow-circle-left');
const rightArrow = document.querySelector('.fa-arrow-circle-right');
let divC;
let indicatorsNav;
let items = [];
let counter = 1;
let timmy;

window.onresize = () => {
    location.reload();
}


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

    items = document.querySelectorAll('.slideshow__item-image');
    indicatorsNav = document.querySelector('.slideshow__nav');

    document.querySelectorAll('.slideshow__item-image')[1].classList.add('current');
    document.querySelector('.slideshow__indicator').classList.add('current-indicator');

    setupFirstImage(divC, divC.children);

    start(divC);

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

    leftArrow.addEventListener('click', slideBack);
    rightArrow.addEventListener('click', slideForward);

    indicatorsNav.addEventListener('click', moveSlidesWithDots);

    pauseBtn.addEventListener('click', pause);
    playBtn.addEventListener('click', play);

}

function moveSlidesWithDots(ev) {
    if (!ev.target.closest('button')) return;
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

function start(divC) {
    timmy = setInterval(() => {
        counter++;
        divC.style.transition = 'all 250ms ease-in';
        divC.style.transform = `translateX(-${size * counter}px)`;
        updateCurrentDot(counter);
    }, 3000)
}


function setupFirstImage(content, imagesArr) {
    imagesArr[0].addEventListener('load', () => {
        size = items[0].clientWidth;
        content.style.transform = `translateX(-${size * counter}px)`;
    })
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