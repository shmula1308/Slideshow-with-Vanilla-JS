document.addEventListener('DOMContentLoaded', init);
let items = [];

function init() {
    let contentDiv = document.createElement('div');
    contentDiv.classList.add('slideshow__content');
    let slideShow = document.querySelector('.slideshow');
    slideShow.appendChild(contentDiv);
    createSlideShowBtns();

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

function createSlideShowBtns() {
    let prevBtn = document.createElement('button');
    prevBtn.classList.add('slideshow__btn', 'slideshow__btn--left')
    let nextBtn = document.createElement('button');
    nextBtn.classList.add('slideshow__btn', 'slideshow__btn--right');
    let playPauseBtn = document.createElement('button');
    playPauseBtn.classList.add('slideshow__playPause');
    let contentDiv = document.querySelector('.slideshow__content');
    contentDiv.append(prevBtn, nextBtn, playPauseBtn)
}

function loadContent(data) {
    let dfContent = new DocumentFragment();
    let dfIndicators = new DocumentFragment();
    data.items.forEach((item, idx) => {
        let div = createItem(item, idx);
        let indicator = createIndicators(idx);
        dfContent.appendChild(div);
        dfIndicators.appendChild(indicator);
    })
    let contentDiv = document.querySelector('.slideshow__content');
    contentDiv.prepend(dfContent);
    let slideShowNav = document.querySelector('.slideshow__nav');
    slideShowNav.appendChild(dfIndicators);
    document.querySelector('.slideshow__item').classList.add('current');
    document.querySelector('.slideshow__indicator').classList.add('current-indicator');

}

function createItem(item, index) {
    let itemDiv = document.createElement('div');
    itemDiv.classList.add('slideshow__item');
    itemDiv.setAttribute('data-index', index);
    let title = document.createElement('h1');
    title.classList.add('slideshow__item-title');
    title.textContent = item.title;
    let p = document.createElement('p');
    p.classList.add('slideshow__item-text');
    p.textContent = item.msg;
    let img = document.createElement('img');
    img.classList.add('slideshow__item-image');
    img.src = `../images/${item.img}`;
    itemDiv.append(title, p, img);
    return itemDiv;
}

function createIndicators(index) {
    let button = document.createElement('button');
    button.classList.add('slideshow__indicator');
    button.setAttribute('data-index', index)
    return button;
}