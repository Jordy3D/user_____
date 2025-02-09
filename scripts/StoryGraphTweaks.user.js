// ==UserScript==
// @name         StoryGraph Tweaks
// @namespace    Bane
// @version      0.5.1
// @description  Tweaks and changes to The StoryGraph
// @author       Bane
// @match        https://app.thestorygraph.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thestorygraph.com
// @grant        none
// ==/UserScript==

// ==Tags==
// @site-name    The StoryGraph
// @site-url     https://app.thestorygraph.com/
// @description  Adds a few tweaks to The StoryGraph
// ==/Tags==

// TODO:
// - Add a button to mark as read today (automatically sets the start and finish date to today) 

// ==ChangeLog==
// 0.1.0    - Initial version
//              - Added buttons to copy book ID and jump to edit page
// 0.2.0    - Added loop to check for new book result divs (on both infinite scroll and page load)
// 0.3.0    - Code cleanup and refactoring
// 0.4.0    - Added buttons to copy author and series IDs
// 0.5.0    - Added support for light and dark mode (previously just dark mode)
// 0.5.1    - Tweaked the CSS a little to improve button positioning in the author and series headers
// ==/ChangeLog==

//=====================================================================================================//

// Main Loop

function main() {
    addCustomCSS();
    handleBookResults();

    const path = window.location.pathname;
    if (path.includes('/authors/'))
        handleAuthorSection();

    if (path.includes('/series/'))
        handleSeriesSection();

}

main();
setInterval(main, 1000);

function handleBookResults() {
    document.querySelectorAll(".book-pane[data-book-id]").forEach(bookResultDiv => {
        if (bookResultDiv.hasAttribute("bane-tweaks")) return;

        const bookDataId = bookResultDiv.getAttribute("data-book-id");
        const actionMenu = bookResultDiv.querySelector("div.action-menu");

        addCustomActions(actionMenu, bookDataId);
        bookResultDiv.setAttribute("bane-tweaks", "");
    });
}

function addCustomActions(actionMenu, bookDataId) {
    const container = document.createElement("div");
    container.classList.add("bane-action-menu");

    // Add Edit button
    const editButton = document.createElement("a");
    editButton.innerText = "Edit";
    editButton.classList.add("bane-edit-button", "bane-action-button");
    editButton.href = `https://app.thestorygraph.com/books/${bookDataId}/edit`;
    editButton.target = "_blank";

    // Add Copy ID button
    const copyIDButton = document.createElement("button");
    copyIDButton.innerText = "Copy ID";
    copyIDButton.classList.add("bane-edit-button", "bane-action-button");
    copyIDButton.onclick = () => navigator.clipboard.writeText(bookDataId);

    container.append(editButton, copyIDButton);
    actionMenu.appendChild(container);
}

function handleAuthorSection() {
    const barcodeModal = document.querySelector('#barcode-scanner-modal');
    if (!barcodeModal) return;

    const authorSection = barcodeModal.nextElementSibling;
    if (!authorSection || authorSection.hasAttribute("bane-author-tweaks")) return;

    const authorId = window.location.pathname.split('/').filter(Boolean)[1];
    if (!authorId) return;

    const menu = document.createElement('div');
    menu.classList.add('bane-header-menu');

    const copyIDButton = document.createElement("button");
    copyIDButton.innerText = "Copy Author ID";
    copyIDButton.classList.add("bane-header-button");
    copyIDButton.onclick = () => navigator.clipboard.writeText(authorId);

    menu.appendChild(copyIDButton);
    authorSection.appendChild(menu);
    authorSection.setAttribute("bane-author-tweaks", "");
}

function handleSeriesSection() {
    const barcodeModal = document.querySelector('#barcode-scanner-modal');
    if (!barcodeModal) return;

    const seriesSection = barcodeModal.nextElementSibling;
    if (!seriesSection || seriesSection.hasAttribute("bane-series-tweaks")) return;

    const seriesId = window.location.pathname.split('/').filter(Boolean)[1];
    if (!seriesId) return;

    const menu = document.createElement('div');
    menu.classList.add('bane-header-menu');

    const copyIDButton = document.createElement("button");
    copyIDButton.innerText = "Copy Series ID";
    copyIDButton.classList.add("bane-header-button");
    copyIDButton.onclick = () => navigator.clipboard.writeText(seriesId);

    menu.appendChild(copyIDButton);
    seriesSection.appendChild(menu);
    seriesSection.setAttribute("bane-series-tweaks", "");
}

function addCustomCSS() {
    // check if the custom CSS has already been added
    if (document.getElementById("bane-custom-css")) return;

    var customCSS = `
        :root {
            --background-1: rgb(255 255 255);
            --background-2: rgb(245 245 245);
            --background-3: rgb(235 235 235);
            --highlight: rgb(56 190 201);
        }

        html.dark:root {
            --background-1: rgb(229 229 229);
            --background-3: rgb(102 102 102);
            --background-2: rgb(51 51 51);
            --highlight: rgb(56 190 201);
        }

        .bane-action-menu {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2px;
            background-color: var(--background-3);
            margin-top: 10px;
            border: 2px solid var(--background-3);
        }

        .bane-action-button {
            cursor: pointer;
            font-size: 0.75rem;
            line-height: 1rem;
            background-color: var(--background-2);
            text-align: center;
            padding: 4px 8px;
        }

        .bane-action-menu > *:only-child {
            grid-column: 1 / -1;
        }

        .bane-action-button:hover {
            background-color: var(--background-3);
        }

        [bane-author-tweaks],
        [bane-series-tweaks] {
            display: flex;
            flex-direction: row;
            gap: 10px;
            margin-bottom: 10px;

            > :first-child {
                flex: 1;
                padding: 10px 0;
                align-items: flex-start;
            }

            .secondary-btn {
                margin-top: 0;
            }

            .section-heading + p {
                margin-bottom: 0;
            }
        }

        .bane-header-menu {
            display: flex;
            flex-direction: column;
            gap: 8px;

            padding: 10px;
            border-left: 1px solid var(--background-3);
        }

        .bane-header-button {
            cursor: pointer;
            font-size: .75rem;
            font-weight: 500;
            line-height: 1rem;
            background-color: var(--background-3);

            border-color: transparent;
            border-radius: .5rem;
            border-width: 1px;

            text-align: center;
            padding: 8px 16px;

            &:hover {
                background-color: var(--highlight);
                color: var(--background-2);
            }
        }
    `;
    var styleElement = document.createElement("style");
    styleElement.innerHTML = customCSS;
    styleElement.id = "bane-custom-css";
    document.head.appendChild(styleElement);
}