// ==UserScript==
// @name         Audible Bonus
// @namespace    Bane
// @version      0.1
// @description  Bonus things for Audible
// @author       Bane
// @match        https://www.audible.com.au/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=audible.com
// @grant        none
// ==/UserScript==

createDownloadSampleButton();

createQuickURLButton();
createQuickURLButtonList();


// create a quickURL button that copies a direct link to the book to the clipboard
function createQuickURLButton() {
    // find h1.bc-heading
    let h1 = document.querySelector('h1.bc-heading');

    // copy the current URL
    let url = window.location.href;
    // the URL should look like:
    // https://www.audible.com.au/pd/Sword-Art-Online-10-Light-Novel-Audiobook/B0BXV6T93S
    // we want
    // https://www.audible.com.au/pd/B0BXV6T93S

    // split the URL by /
    let parts = url.split('/');
    // get the last part
    let last = parts[parts.length - 1];
    // set the new URL
    let newURL = `https://www.audible.com.au/pd/${last}`;

    // create a new button
    let button = document.createElement('button');
    // set the text
    button.innerText = 'Quick URL';
    // set the class
    button.classList.add('bc-button', 'bc-button--primary', 'bc-spacing--small');
    // set the onclick
    button.onclick = function () {
        // copy the new URL to the clipboard
        navigator.clipboard.writeText(newURL);
    }

    // add the button after the h1
    h1.after(button);
}

// create a quickURL button that copies a direct link to the book to the clipboard for books in the list
function createQuickURLButtonList() {
    // find all h3.bc-heading
    let h3s = document.querySelectorAll('h3.bc-heading');
    // for each h3
    h3s.forEach(h3 => {
        // get the a tag
        let a = h3.querySelector('a');
        // if the a tag exists
        if (a) {
            // copy the current URL
            let url = a.href;
            // the URL should look like:
            // https://www.audible.com.au/pd/Sword-Art-Online-10-Light-Novel-Audiobook/B0BXV6T93S?ref_pageloadid=VC47kFDeutX3ngHf&ref=a_series_Sw_c4_lProduct_1_9&pf_rd_p=854fefcc-6417-4e97-b97e-4bd809af7581&pf_rd_r=6AS9WMD038R2X0ESZ35V&pageLoadId=Oia8z5uwWNSGPEoh&creativeId=5f922f04-7f27-45a7-ba24-7bf0c1def1d9
            // we want
            // https://www.audible.com.au/pd/B0BXV6T93S

            // split off evrything after the ? if it exists
            url = url.split('?')[0];
            
            // split the URL by /
            let parts = url.split('/');
            // get the last part
            let last = parts[parts.length - 1];
            // set the new URL
            let newURL = `https://www.audible.com.au/pd/${last}`;

            // create a new button
            let button = document.createElement('button');
            // set the text
            button.innerText = 'Quick URL';
            // set the class
            button.classList.add('bc-button', 'bc-button--primary', 'bc-spacing--small');
            // set the onclick
            button.onclick = function () {
                // copy the new URL to the clipboard
                navigator.clipboard.writeText(newURL);
            }

            // add the button after the h3
            h3.after(button);
        }
    }
    );
}


function createDownloadSampleButton() {
    // find the button with a data-mp3 tag containing https://samples.audible.com/
    let button = document.querySelector('button[data-mp3*="https://samples.audible.com/"]');
    // if the button exists
    if (button) {
        // create a new button
        let newButton = document.createElement('button');
        // set the text
        newButton.innerText = 'Open Sample';
        // set the class
        newButton.classList.add('bc-button', 'bc-button--primary', 'bc-spacing--small');
        // set the onclick
        newButton.onclick = function () {
            downloadSample(button);
        }

        let parent = button.parentElement.parentElement.parentElement;
        // add the button
        parent.appendChild(newButton);

        // set the parent's class to "bane-buttons"
        parent.classList.add('bane-buttons');

        // create a style tag
        let style = document.createElement('style');
        style.id = 'bane-style';
        style.type = 'text/css';
        // set the style
        style.innerHTML = `
            .bane-buttons {
                display: flex;
                flex-direction: row;
                justify-content: center;
                gap: 1em;
                margin-top: 1em;
            }
        `;
        // add the style
        document.getElementsByTagName('head')[0].appendChild(style);
    }
}

function downloadSample(button) {
    // set the name to the aria-label of the button
    let name = button.getAttribute('aria-label').replace('Play Sample for', 'Sample for') + '.mp3';
    // get the url from the data-mp3 tag
    let url = button.getAttribute('data-mp3');
    // open the url in a new tab
    window.open(url, '_blank');
}
