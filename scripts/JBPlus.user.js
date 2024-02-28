// ==UserScript==
// @name         JB Hi-Fi Plus
// @namespace    Bane
// @version      0.2.0
// @description  Modifications to the JB Hi-Fi web site
// @author       Bane
// @match        https://www.jbhifi.com.au/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jbhifi.com.au
// @grant        none
// ==/UserScript==

// ==Change Log==
// 0.1.0
// - Initial release
// - Add a button to the wishlist page to show only items on sale
// 0.2.0
// - Add a button to the wishlist page to sort items by price (low to high and high to low)
// - Add font copying to style the buttons
// - Remove wasted duplicate of CSS
// - Fix detection of promo tags
// - Fix bad CSS making button text invisible

var promoTagClasses = [
    'promotag-container',
    '_35s76z8',
    '_1591c0l8',
    'BannerTag'
]

setInterval(function () {
    addStyle();

    // if we're on the wishlist page, add a button to the page 
    if (window.location.href.includes('account#/wishlist')) {
        addShowOnSaleButton();
        addSortByPriceButton();
        findPrices();
    }
}, 1000);


function addButton(parent, text, classList, callback) {
    var button = document.createElement('button');

    if (classList instanceof Array)
        classList.forEach(function (c) {
            button.classList.add(c);
        });
    else
        button.classList.add(classList);

    button.innerHTML = `<span>${text}</span>`
    button.addEventListener('click', callback);
    parent.appendChild(button);
}

function copyFont(type='PriceFont') {
    // let objects = document.querySelectorAll('[class*="PriceFont"]');
    // let objects = document.querySelectorAll('[class*="CrazyFont"]');
    let objects = document.querySelectorAll(`[class*="${type}"]`);
    // find the first object with a font-family that isn't blank
    let objectStyle = {};
    objects.forEach(function (o) {
        let style = window.getComputedStyle(o);
        if (style.fontFamily != '')
            objectStyle = style;
    });

    let font = objectStyle.fontFamily;

    console.log(objectStyle);
    console.log(font);
    return font;
}

function addStyle() {
    if (document.querySelector('.bane-style')) return;

    var style = document.createElement('style');
    style.classList.add('bane-style');
    style.innerHTML = `
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: #fff0; }
        ::-webkit-scrollbar-thumb { background: #ffec0f; }
        ::-webkit-scrollbar-thumb:hover { background: #f0dd00; }
        ::-webkit-scrollbar-corner { background: #0000; }  

        .bane-container {
            display: flex;
            gap: 1em;
            margin: 20px 0;
        }
        .bane-button {
            background-color: white;
            color: black;
            font-size: 20px;
            font-family: ${copyFont()};
            padding: 10px 20px;
            border: 1px solid black;
            box-shadow: 2px 2px #000;
            cursor: pointer;
        }
        .bane-button span
        {
            display: block;
            letter-spacing: -1px !important;
            line-height: 1em !important;          
            transform: scaleX(1.15) !important;
        }
        .bane-button:hover {
            box-shadow: 4px 4px #000;
        }

        .bane-button.active {
            background-color: yellow;
        }
        .bane-button:active
        {
            background: #ffec0f;
            transition: background 100ms ease-in-out;
        }

        .ais-hits--items.hide {
            display: none;
        }
    `;

    document.head.appendChild(style);
}

function addShowOnSaleButton() {
    // find .customer-wishlist and add container as second child, with a button inside it
    var wishlist = document.querySelector('.account-details .customer-wishlist');
    if (!wishlist) return;

    if (wishlist.querySelector('.show-onsale')) return;

    // add a container if it doesn't exist
    if (!wishlist.querySelector('.bane-container')) {
        var container = document.createElement('div');
        container.classList.add('bane-container');
        wishlist.insertBefore(container, wishlist.childNodes[1]);
    }
    else
        container = wishlist.querySelector('.bane-container');

    var wishlistContainer = wishlist.querySelector('#wishlist-container');

    // add a button
    addButton(container, 'Show on Sale', ['bane-button', 'show-onsale'], function () {
        this.classList.toggle('active');

        // create an array of all the wishlist container's children
        var items = Array.from(wishlistContainer.children);
        items.forEach(function (item) {
            // if item doesn't contain a child with a promoTagClass, hide it
            var found = false;
            promoTagClasses.forEach(function (c) {
                if (item.querySelector('.' + c)) found = true;
                if (item.querySelector(`[class*="${c}"]`)) found = true;
            });
            if (!found)
                item.classList.toggle('hide');
        });
    });

    addStyle();
}

function findPrice(item) {
    var priceTagSelectors = [
        'PriceTag_actual'
    ];

    var priceObject = item.querySelector(`[class*="${priceTagSelectors[0]}"]`);
    var priceText = priceObject ? priceObject.innerText : '0.00';
    var price = parseFloat(priceText.replace('$', ''));
    return price;
}

function findPrices() {
    var items = document.querySelector('#wishlist-container').children;
    // search through the items and find the price, treating items as an array
    items = Array.from(items);
    items.forEach(function (item) {
        // if the item is already marked as having a price, skip it
        if (item.attributes['data-price']) return;

        var price = findPrice(item);
        item.setAttribute('data-price', price);
    });
}

function addSortByPriceButton() {
    // find .customer-wishlist and add container as second child, with a button inside it
    var wishlist = document.querySelector('.account-details .customer-wishlist');
    if (!wishlist) return;

    if (wishlist.querySelector('.sort-by-price')) return;

    // add a container if it doesn't exist
    if (!wishlist.querySelector('.bane-container')) {
        var container = document.createElement('div');
        container.classList.add('bane-container');
        wishlist.insertBefore(container, wishlist.childNodes[1]);
    }
    else
        container = wishlist.querySelector('.bane-container');

    function lowHigh(a, b) {
        var aPrice = parseFloat(a.getAttribute('data-price'));
        var bPrice = parseFloat(b.getAttribute('data-price'));
        return aPrice - bPrice;
    }
    function highLow(a, b) {
        var aPrice = parseFloat(a.getAttribute('data-price'));
        var bPrice = parseFloat(b.getAttribute('data-price'));
        return bPrice - aPrice;
    }

    function eraseContainer(selector) {
        var container = document.querySelector(selector);
        if (container) container.innerHTML = '';
    }

    function fillContainer(selector, items) {
        var container = document.querySelector(selector);
        if (!container) return;

        // remove all the items from the wishlist
        container.innerHTML = '';

        // add the items back to the wishlist
        items.forEach(function (item) {
            container.appendChild(item);
        });
    }

    // add a button
    addButton(container, 'Sort By Price (↗)', ['bane-button', 'sort-by-price'], function () {
        var items = Array.from(document.querySelectorAll('#wishlist-container > div'));
        items.sort(lowHigh);
        eraseContainer('#wishlist-container');
        fillContainer('#wishlist-container', items);
    });

    // add a button
    addButton(container, 'Sort By Price (↘)', ['bane-button', 'sort-by-price'], function () {
        var items = Array.from(document.querySelectorAll('#wishlist-container > div'));
        items.sort(highLow);
        eraseContainer('#wishlist-container');
        fillContainer('#wishlist-container', items);
    });
}
