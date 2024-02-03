// ==UserScript==
// @name         Infinite Craft Plus
// @namespace    Bane
// @version      0.2.2
// @description  Infinite Craft is fun, but it could be better.
// @author       Bane
// @match        https://neal.fun/infinite-craft/
// @icon         https://neal.fun/favicons/infinite-craft.png
// @grant        none
// ==/UserScript==

// ==Change Log==
// 0.1.0
//  - Initial release
//  - Added search bar to the sidebar
//  - Added dark mode button (with local storage)
//  - Added item count to the sidebar
// 0.2.0
//  - Added random search functionality
//  - Fixed a few CSS issues
// 0.2.1
//  - Code cleanup
// ==/Change Log==



setDarkMode();      // set dark mode based on local storage as soon as the script runs

window.onload = function () {
    addBaseCSS();

    createSearchBar();
    addDarkModeButton();
};

var itemCount = 0;

setInterval(getItemCount, 200);


//#region SEARCH BAR

/** Creates a search bar in the sidebar */
function createSearchBar() {
    // if search bar already exists, don't create another one
    if (document.getElementById('bane-search-bar')) return;

    let sidebar = document.querySelector('.sidebar');

    let searchBar = createElementAndAppend(sidebar, { className: 'bane-search-bar' }, true);
    let input = createElementAndAppend(searchBar, { type: 'input', className: 'bane-search-input' });

    // add event listener to input element
    input.addEventListener('input', function (event) {
        let sidebar = document.querySelector('.sidebar');
        let items = sidebar.querySelectorAll('.item');
        items.forEach(item => item.classList.remove('found'));

        // if search bar is empty, show all items
        if (event.target.value === '') {
            sidebar.classList.remove('searching');
            return;
        }
        sidebar.classList.add('searching');

        let search = event.target.value.toLowerCase();

        let randomPattern = /^r:(\d+)?$/;
        let randomMatch = search.match(randomPattern);
        if (randomMatch) {
            let randomCount = randomMatch[1] ? parseInt(randomMatch[1]) : items.length;

            let randomResults = randomItems(items, randomCount);
            randomResults.forEach(item => item.classList.add('found'));
            return;
        }

        let foundResults = findItems(items, search);
        foundResults.forEach(item => item.classList.add('found'));
    });

    addCSSToHead(`
    .bane-search-input {
        width: 100%;
        padding: 10px;
        font-size: 16px;
    }

    .sidebar.searching .item {
        display: none;
    }

    .sidebar.searching .item.found {
        display: block;
    }

    .sidebar
    {
        height: 100vh;
        display: flex;
        flex-direction: column;
        
        overflow: hidden !important;
    }

    .items
    {
        min-height: unset !important;
        overflow-y: scroll;

        width: 100%;
        min-height: calc(100% - 75px) !important;
        
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
    }

    .instruction
    {
        width: 100%;
    }

    `, 'bane-search-bar-css');
}

/** Returns an array of items that contain the given term */
function findItems(items, term) {
    return items.filter(item => item.textContent.toLowerCase().includes(term));
}

/** Returns a random number of items from the given array */
function randomItems(items, count = 10) {
    if (count > items.length)
        return items;

    const randomItems = new Set();
    while (randomItems.size < count) {
        const random = items[Math.floor(Math.random() * items.length)];
        randomItems.add(random);
    }
    return Array.from(randomItems);
}
//#endregion

//#region ITEM COUNT

/** Gets the number of items discovered. */
function getItemCount() {
    let sidebar = document.querySelector('.sidebar');
    let items = sidebar.querySelectorAll('.item');
    if (items.length !== itemCount) {
        itemCount = items.length;
        updateItemCount();
    }
}

/** Updates the item count in the sidebar */
function updateItemCount() {
    // if item count already exists, don't create another one, just update the count
    let count = document.getElementById('bane-item-count');

    if (!count) {
        let sidebar = document.querySelector('.sidebar');
        let itemCount = sidebar.querySelectorAll('.item').length;
        let sidebarControls = sidebar.querySelector('.sidebar-controls');

        count = createElementAndAppend(sidebarControls, { text: `Items Found: ${itemCount}`, className: 'bane-item-count', id: 'bane-item-count' }, true);

        // add some css to the head
        addCSSToHead(`
        .sidebar-controls
        {
            margin-top: auto;
            padding: 0 10px;
            justify-content: space-between !important;
        }
        `, 'bane-item-count-css');
    }

    // trigger search's input event to update the found items
    let input = document.querySelector('.bane-search-input');
    count.textContent = `Items: ${itemCount}`;

    if (!input) return;
    input.dispatchEvent(new Event('input'));
}
//#endregion

//#region DARK MODE

/** Toggles dark mode on the page */
function toggleDarkMode() {
    let html = document.querySelector('html');
    html.classList.toggle('invert');

    // save dark mode state to local storage
    let darkMode = localStorage.getItem('darkMode') === 'true';
    localStorage.setItem('darkMode', !darkMode);
}

/** Sets dark mode based on local storage */
function setDarkMode() {
    let isDarkMode = localStorage.getItem('darkMode') === 'true';
    let html = document.querySelector('html');
    if (isDarkMode) html.classList.add('invert');
}

/** Adds a dark mode button to the page */
function addDarkModeButton() {
    let controls = document.querySelector('.side-controls');

    // if dark mode button already exists, don't create another one
    if (document.getElementById('dark-mode-button')) return;

    // add inverted class to html based on local storage
    let html = document.querySelector('html');
    if (localStorage.getItem('darkMode') === 'true')
        html.classList.add('invert');

    let darkModeButton = createImgAndAppend(controls, { src: 'https://www.svgrepo.com/show/309493/dark-theme.svg', alt: 'Dark Mode', className: 'dark-mode-button' }, true);

    console.log(darkModeButton);

    darkModeButton.addEventListener('click', toggleDarkMode);

    addCSSToHead(`
    .dark-mode-button {
        width: 23px;
        cursor: pointer;
    }
    `, 'bane-dark-mode-button-css');
}
//#endregion

//#region BASE CSS

/** Adds some preliminary CSS to the page */
function addBaseCSS() {
    addCSSToHead(`
    html.invert { filter: invert(1); }
    html.invert .item span { filter: invert(1) }

    .container::before
    {
        content: "Infinite Craft Plus by Bane";
        
        position: absolute;
        bottom: 0;
        padding: 5px;
        
        font-size: 8pt;
        opacity: .2;
    }
    `, 'bane-base-css');
}
//#endregion

//#region Helper functions

/**
 * Create an element and append it to the document
 * @param {Object} options - object with properties for the element
 * @param {string} options.type - the type of the element
 * @param {string} options.text - the text content of the element
 * @param {string} options.className - the class name of the
 * @param {string} options.id - the id of the element
 * @returns {HTMLElement} the new element
*/
function createElement(options = {}) {
    const {
        type = 'div',
        text = '',
        className = '',
        id = ''
    } = options

    let element = document.createElement(type);
    if (text) element.textContent = text;
    if (className) element.className = className;
    if (id) element.id = id;

    return element;
}

/**
 * Create an element and append it to a parent element
 * @param {HTMLElement} parent - the parent element to append the new element to
 * @param {Object} options - object with properties for the element
 * @param {string} options.type - the type of the element
 * @param {string} options.text - the text content of the element
 * @param {string} options.className - the class name of the
 * @param {string} options.id - the id of the element
 * @param {boolean} asFirst - whether to append the new element as the first child of the parent
 * @returns {HTMLElement} the new element 
 */
function createElementAndAppend(parent, options = {}, asFirst = false) {

    let element = createElement(options);
    if (asFirst)
        parent.insertBefore(element, parent.firstChild);
    else
        parent.appendChild(element);

    return element;
}

function createImgAndAppend(parent, options = {}, asFirst = false) {
    const {
        src = '',
        alt = '',
        className = '',
        id = ''
    } = options

    let element = document.createElement('img');
    element.src = src;
    element.alt = alt;
    element.className = className;
    element.id = id;

    if (asFirst)
        parent.insertBefore(element, parent.firstChild);
    else
        parent.appendChild(element);

    return element;
}

/**
 * Add CSS to the head of the document
 * @param {string} css - the css to add to the head
 * @param {string} id - the id of the style element
 */
function addCSSToHead(css, id) {
    // if the css exists in the head already, don't add it again
    if (document.getElementById(id)) return;

    let style = createElement({ type: 'style', text: css, id: id });
    document.head.appendChild(style);
}
//#endregion