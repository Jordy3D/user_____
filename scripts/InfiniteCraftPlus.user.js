// ==UserScript==
// @name         Infinite Craft Plus
// @namespace    Bane
// @version      0.3.1
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
// 0.2.2
//  - Added cheat mode
//  - Added multi-search (search for multiple items at once)
// 0.3.0
//  - Remove official search bar
//  - Add quick-clear button to search bar
//  - Improve multi-search
// 0.3.1
//  - Patch for the site's update
//  - Remove official dark mode button
// ==/Change Log==



setDarkMode();      // set dark mode based on local storage as soon as the script runs

window.onload = function () {
    addBaseCSS();

    createSearchBar();
    addDarkModeButton();

    addCheatMode();
};

var itemCount = 0;

setInterval(getItemCount, 200);


//#region SEARCH BAR
// ███████╗███████╗ █████╗ ██████╗  ██████╗██╗  ██╗
// ██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝██║  ██║
// ███████╗█████╗  ███████║██████╔╝██║     ███████║
// ╚════██║██╔══╝  ██╔══██║██╔══██╗██║     ██╔══██║
// ███████║███████╗██║  ██║██║  ██║╚██████╗██║  ██║
// ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝

/** Creates a search bar in the sidebar */
function createSearchBar() {
    // if search bar already exists, don't create another one
    if (document.getElementById('bane-search-bar')) return;

    let sidebar = document.querySelector('.sidebar');

    let searchBar = createElementAndAppend(sidebar, { className: 'bane-search-bar' }, true);
    let input = createElementAndAppend(searchBar, { type: 'input', className: 'bane-search-input' });
    let clearButton = createElementAndAppend(searchBar, { type: 'button', text: '🗙', className: 'clear-search' });

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

        let searchInput = event.target.value.toLowerCase();

        let searchTerms = searchInput.split(';');
        searchTerms = searchTerms.map(term => term.trim());

        let randomPattern = /^r:(\d+)?$/;
        let randomMatch = searchTerms.find(term => randomPattern.test(term));

        if (randomMatch) {
            let randomCount = randomMatch.replace('r:', '');
            if (randomCount === '' && searchTerms.length === 1)
                randomCount = items.length;
            else
                randomCount = parseInt(randomCount);

            let randomResults = randomItems(items, randomCount);
            randomResults.forEach(item => item.classList.add('found'));
        }

        searchTerms = searchTerms.map(term => term.trim());

        let foundResults = findItems(items, searchTerms);
        foundResults.forEach(item => item.classList.add('found'));
    });

    // add event listener to clear button
    clearButton.addEventListener('click', function () {
        input.value = '';
        input.dispatchEvent(new Event('input'));
    });

    addCSSToHead(`
    .bane-search-bar
    {
        width: 100%;
        font-size: 16px;
        height: 40px;
        
        display: flex;
        
        border-bottom: 1px solid #ccc;
    }

    .bane-search-input {
        padding: 10px;
        width: 100%;
        
        border: none;
        
        outline: none !important;
    }
    .bane-search-input:focus-visible
    {
        background: #ccc;
        border-right: 1px solid white;
    }

    .sidebar.searching .item {
        display: none;
    }

    .sidebar.searching .item.found {
        display: block;
    }

    .clear-search
    {
        width: 40px;
        border: none;
        
        background: #0000;
        color: #909090;
        
        border-left: 1px solid #ccc;
        
        cursor: pointer;
    }

    .clear-search:hover
    {
        background: #ccc;
    }

    .sidebar
    {
        height: 100vh;
        display: flex;
        flex-direction: column;
        
        overflow: hidden !important;
    }

    .sidebar-inner
    {
        overflow-y: auto; 
        flex: 1;
    }

    .items
    {
        min-height: unset !important;
        overflow-y: scroll;

        width: 100%;
        height: 100%;
        
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
function findItems(items, terms) {
    // add found class to items that contain the search term and are not already found
    let foundItems = [];
    items.forEach(item => {
        let text = item.textContent.toLowerCase();
        // if ANY of the search terms are found in the text, add it
        let found = terms.some(term => text.includes(term));

        if (found) foundItems.push(item);
    });
    return foundItems;
}

/** Returns a random number of items from the given array */
function randomItems(items, count = 10, canRepeat = false) {
    if (count > items.length)
        return items;

    if (canRepeat) {
        let randomItems = [];
        for (let i = 0; i < count; i++) {
            const random = items[Math.floor(Math.random() * items.length)];
            randomItems.push(random);
        }
        return randomItems;
    }

    var randomItems = new Set();
    while (randomItems.size < count) {
        const random = items[Math.floor(Math.random() * items.length)];
        randomItems.add(random);
    }
    return Array.from(randomItems);
}
//#endregion

//#region ITEM COUNT
//  ██████╗ ██████╗ ██╗   ██╗███╗   ██╗████████╗
// ██╔════╝██╔═══██╗██║   ██║████╗  ██║╚══██╔══╝
// ██║     ██║   ██║██║   ██║██╔██╗ ██║   ██║   
// ██║     ██║   ██║██║   ██║██║╚██╗██║   ██║   
// ╚██████╗╚██████╔╝╚██████╔╝██║ ╚████║   ██║   
//  ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   

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
    let countMobile = document.getElementById('bane-item-count-mobile');

    if (!count && !countMobile) {
        let sidebar = document.querySelector('.sidebar');
        let itemCount = sidebar.querySelectorAll('.item').length;
        let sidebarControls = sidebar.querySelector('.sidebar-controls');

        count = createElementAndAppend(sidebarControls, { text: `Items Discovered: ${itemCount}`, className: 'bane-item-count', id: 'bane-item-count' }, true);

        let container = document.querySelector('.container');
        countMobile = createElementAndAppend(container, { text: `Items Discovered: ${itemCount}`, className: 'bane-item-count-mobile', id: 'bane-item-count-mobile' }, true);

        // add some css to the head
        addCSSToHead(`
        .sidebar-controls
        {
            margin-top: auto;
            padding: 10px;
            justify-content: space-between !important;
        }

        .bane-item-count-mobile
        {
            display: none;
        }
        `, 'bane-item-count-css');
    }

    // trigger search's input event to update the found items
    let input = document.querySelector('.bane-search-input');
    count.textContent = `Items Discovered: ${itemCount}`;
    countMobile.textContent = `Items Discovered: ${itemCount}`;

    if (!input) return;
    input.dispatchEvent(new Event('input'));
}
//#endregion

//#region DARK MODE
// ██████╗  █████╗ ██████╗ ██╗  ██╗
// ██╔══██╗██╔══██╗██╔══██╗██║ ██╔╝
// ██║  ██║███████║██████╔╝█████╔╝ 
// ██║  ██║██╔══██║██╔══██╗██╔═██╗ 
// ██████╔╝██║  ██║██║  ██║██║  ██╗
// ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝

var darkModeIcon = 'https://neal.fun/infinite-craft/dark-mode-on.svg';
var lightModeIcon = 'https://neal.fun/infinite-craft/dark-mode.svg';

/** Toggles dark mode on the page */
function toggleDarkMode() {
    let html = document.querySelector('html');
    html.classList.toggle('invert');

    // save dark mode state to local storage
    let darkMode = localStorage.getItem('darkMode') === 'true';
    localStorage.setItem('darkMode', !darkMode);

    // replace the icon with the other icon
    let darkModeButton = document.querySelector('.dark-mode-button');
    darkModeButton.src = darkMode ? lightModeIcon : darkModeIcon;
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

    let isDarkMode = localStorage.getItem('darkMode') === 'true';
    let icon = isDarkMode ? darkModeIcon : lightModeIcon;

    let darkModeButton = createImgAndAppend(controls, { src: icon, alt: 'Dark Mode', className: 'dark-mode-button' }, true);

    darkModeButton.addEventListener('click', toggleDarkMode);

    addCSSToHead(`
    .dark-mode-button {
        width: 23px;
        cursor: pointer;
    }
    `, 'bane-dark-mode-button-css');

    // delete the existing dark mode button (.dark-mode-icon)
    let oldDarkModeButton = document.querySelector('.dark-mode-icon');
    if (oldDarkModeButton) oldDarkModeButton.remove();
}
//#endregion

//#region BASE CSS
// ██████╗  █████╗ ███████╗███████╗
// ██╔══██╗██╔══██╗██╔════╝██╔════╝
// ██████╔╝███████║███████╗█████╗  
// ██╔══██╗██╔══██║╚════██║██╔══╝  
// ██████╔╝██║  ██║███████║███████╗
// ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝

/** Adds some preliminary CSS to the page */
function addBaseCSS() {
    // base CSS
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

    // mobile CSS
    addCSSToHead(`
    @media screen and (max-width: 800px)
    {
        html
        {
            overflow: hidden;
        }
        
        .mobile-instruction
        {
            position: absolute;
            left: 50%;
            bottom: 50px;
            transform: translateX(-50%);
        }
        
        .container
        {
            height: calc(100vh - 130px) !important;
        }
        
        .mobile-items
        {
            height: 100%;
            overflow-y: scroll;
            margin-top: 70px !important;
            align-content: flex-start;
        }
        
        .bane-item-count-mobile
        {
            display: block !important;
            position: absolute;
            left: 50%;
            bottom: 10px;
            transform: translateX(-50%);
        }
    }
    `, 'bane-mobile-css');

    // tweak CSS
    addCSSToHead(`
    .sidebar-input {
        display: none;
    }
    `, 'bane-tweak-css');
}
//#endregion

//#region CHEAT MODE?
//  ██████╗██╗  ██╗███████╗ █████╗ ████████╗
// ██╔════╝██║  ██║██╔════╝██╔══██╗╚══██╔══╝
// ██║     ███████║█████╗  ███████║   ██║   
// ██║     ██╔══██║██╔══╝  ██╔══██║   ██║   
// ╚██████╗██║  ██║███████╗██║  ██║   ██║   
//  ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   

var triedCombos = [];
var results = [];

// load triedCombos and results from local storage
loadFromStorage();

var lastCombo = '';

function addCheatMode() {
    // when ctrl + space is pressed
    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.code === 'Space') {
            // if the screen is not 800px wide or less, don't do anything
            // if (window.innerWidth > 800) return;

            let itemList = document.querySelector('.mobile-items');
            let itemContainers = itemList.querySelectorAll('.mobile-item');
            // get the .item elements from the .mobile-item elements
            let items = Array.from(itemContainers).map(item => item.querySelector('.item'));

            // if any .item has the class .item-selected-mobile, don't do anything
            if (items.some(item => item.classList.contains('item-selected-mobile'))) return;

            // get two random items and add them to the triedCombos array
            // if the combo has already been tried, try again
            let cheatyItems = randomItems(items, 2, canRepeat = true);
            let combo = cheatyOrder(cheatyItems);

            while (triedCombos.includes(combo)) {
                cheatyItems = randomItems(items, 2, canRepeat = true);
                combo = cheatyOrder(cheatyItems);
            }

            triedCombos.push(combo);
            lastCombo = combo;

            // console.log(triedCombos);

            function cheatyOrder(items) {
                let order = [];
                items.forEach(item => order.push(item.textContent.split('\n')[1].trim()));
                // sort the order array alphabetically
                order.sort();
                return order.join(' + ');
            }

            // simulate a click on the two random items as if the user clicked them
            for (let i = 0; i < cheatyItems.length; i++) {
                // fire a click event on the .item inside the .mobile-item
                let event = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });

                cheatyItems[i].dispatchEvent(event);
            }

            saveResults();

            // find the .item-crafted-mobile element and add it to the results array along with the combo like
            // { combo: "Rainbow + Unicorn", result: "🦄" }
            // let craftedItem = document.querySelector('.item-crafted-mobile');
            // if (craftedItem)
            //     logCraftedItem(craftedItem);
        }
    });

    // when .reset is clicked
    document.querySelector('.reset').addEventListener('click', function () {
        clearStorage();
    });

    // if itemCount = 4, then saving didn't work on the site, so clear the local storage
    getItemCount();
    if (itemCount === 4)
        clearStorage();

    function logCraftedItem(craftedItem) {
        let result = craftedItem.textContent.split('\n')[1].trim();
        let resultCombo = { combo: lastCombo, result: result };
        if (!results.some(r => r.combo === resultCombo.combo)) {
            results.push(resultCombo);
            console.log(results);

            console.log(`Combo: ${resultCombo.combo} -> ${resultCombo.result}`);
        }

        saveResults();
    }

    function saveResults() {
        localStorage.setItem('triedCombos', JSON.stringify(triedCombos));
        localStorage.setItem('results', JSON.stringify(results));
    }

    const mobileItems = document.querySelector('.mobile-items');

    // when the .mobile-item list gets a new item
    mobileItems.addEventListener('DOMNodeInserted', function (event) {
        let craftedItem = event.target.querySelector('.item-crafted-mobile');
        if (craftedItem)
            logCraftedItem(craftedItem);
    });

    // when the .mobile-item list has any .item inside it whose class changes
    // the subtree mobification check needs to check children of children
    mobileItems.addEventListener('DOMSubtreeModified', function (event) {
        // if there is a .item-crafted-mobile element, add it to the results array along with the combo if it's not already there
        let craftedItem = event.target.querySelector('.item-crafted-mobile');
        if (craftedItem)
            logCraftedItem(craftedItem);
    });

    mobileItems.addEventListener('DOMCharacterDataModified', function (event) {
        // if there is a .item-crafted-mobile element, add it to the results array along with the combo if it's not already there
        let craftedItem = event.target.querySelector('.item-crafted-mobile');
        if (craftedItem)
            logCraftedItem(craftedItem);
    });

    mobileItems.addEventListener('DOMAttrModified', function (event) {
        // if there is a .item-crafted-mobile element, add it to the results array along with the combo if it's not already there
        let craftedItem = event.target.querySelector('.item-crafted-mobile');
        if (craftedItem)
            logCraftedItem(craftedItem);
    });
}

function saveToStorage(triedCombos, results) {
    localStorage.setItem('triedCombos', JSON.stringify(triedCombos));
    localStorage.setItem('results', JSON.stringify(results));
}
function loadFromStorage() {
    console.log('Loading combos and results from local storage');
    if (localStorage.getItem('triedCombos'))
        triedCombos = JSON.parse(localStorage.getItem('triedCombos'));
    if (localStorage.getItem('results'))
        results = JSON.parse(localStorage.getItem('results'));
}
function clearStorage() {
    console.log('Clearing combos and results from local storage');
    triedCombos = [];
    results = [];
    localStorage.removeItem('triedCombos');
    localStorage.removeItem('results');
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
