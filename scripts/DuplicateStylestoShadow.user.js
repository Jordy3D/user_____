// ==UserScript==
// @name         Dupe Styles to Shadow
// @namespace    Bane
// @version      0.1.0
// @description  Duplicates all Styles with class "stylus"
// @author       Bane
// @include      /.*/
// @icon
// @grant        none
// ==/UserScript==



const refreshRate = 1000;
const delay = 1000;
const refresh = true;



setTimeout(() => {
    dupeStylesToShadow();

    if (refresh)
        setInterval(dupeStylesToShadow, refreshRate);
}, delay);


// FUNCTIONS

// duplicate all .stylus styles to shadow roots, refreshing what is already there
function dupeStylesToShadow() {
    const shadowRoots = findShadows();
    const styles = findStyles();

    // loop through each shadow root
    shadowRoots.forEach((shadowRoot) => {
        // remove the existing style elements with the class "dupe"
        shadowRoot.querySelectorAll('style.dupe').forEach((dupe) => {
            dupe.remove();
        });

        // loop through each style element
        styles.forEach((style) => {

            // clone the style element
            const clone = style.cloneNode(true);
            clone.classList.add('dupe');

            // append the clone to the shadow root
            shadowRoot.appendChild(clone);
        });
    });
}

// HELPER

// find the shadow root elements
function findShadows() {
    // find every shadow DOM element
    const shadowElements = document.querySelectorAll('body *');
    const shadowRoots = [];

    // loop through each element
    shadowElements.forEach((element) => {
        // if the element has a shadow root, push it to the array
        if (element.shadowRoot) {
            shadowRoots.push(element.shadowRoot);
        }
    });

    return shadowRoots;
}

// find every .stylus style element
function findStyles() {
    return document.querySelectorAll('style.stylus');
}