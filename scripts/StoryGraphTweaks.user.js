// ==UserScript==
// @name         StoryGraph Tweaks
// @namespace    Bane
// @version      0.0.3
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
// - Add a button to copy book ID (done)
// - Add a button to edit book (done)
// - Add a button to mark as read today 
// - Add a button to copy author ID
// - Add a button to copy series ID

// ==ChangeLog==
// 0.0.1    - Initial version
//              - Added buttons to copy book ID and jump to edit page
// 0.0.2    - Added loop to check for new book result divs (on both infinite scroll and page load)
// 0.0.3    - Code cleanup and refactoring
// ==/ChangeLog==

//=====================================================================================================//

// Main Loop

function main() {
    addCustomCSS();

    var bookResultDivs = findBookResultDivs();
    bookResultDivs.forEach(bookResultDiv => {
        if (bookResultDiv.hasAttribute("bane-tweaks")) return;

        var bookDataId = findBookDataId(bookResultDiv);
        var actionMenu = findActionMenu(bookResultDiv);
        
        var customActionContainer = addCustomActionContainer(actionMenu);
        addEditButton(customActionContainer, bookDataId);
        addCopyIDButton(customActionContainer, bookDataId);

        bookResultDiv.setAttribute("bane-tweaks", "");
    });
}

main();
setInterval(main, 1000);

// Functions

function addCustomCSS() {
    // check if the custom CSS has already been added
    if (document.getElementById("bane-custom-css")) return;

    var customCSS = `
        :root {
            --darkGrey: rgb(229 229 229);
            --darkerGrey: rgb(102 102 102);
            --darkestGrey: rgb(51 51 51);
        }

        .bane-action-menu {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2px;
            background-color: var(--darkerGrey);
            margin-top: 10px;
            border: 2px solid var(--darkerGrey);
        }

        .bane-action-button {
            cursor: pointer;
            font-size: 0.75rem;
            line-height: 1rem;
            background-color: var(--darkestGrey);
            text-align: center;
            padding: 4px 8px;
        }

        .bane-action-menu > *:only-child {
            grid-column: 1 / -1;
        }

        .bane-action-button:hover {
            background-color: var(--darkerGrey);
        }
    `;
    var styleElement = document.createElement("style");
    styleElement.innerHTML = customCSS;
    styleElement.id = "bane-custom-css";
    document.head.appendChild(styleElement);
}

function findBookResultDivs() {
    // find every div that is a proper book result
    return document.querySelectorAll(".book-pane[data-book-id]");
}

function findBookDataId(bookResultDiv) {
    // find the id of a book result div
    return bookResultDiv.getAttribute("data-book-id");
}

function findActionMenu(bookResultDiv) {
    // find the action menu of a book result div
    return bookResultDiv.querySelector("div.action-menu");
}

function addCustomActionContainer(actionMenu) {
    // add a custom action container to the action menu
    var customActionContainer = document.createElement("div");
    customActionContainer.classList.add("bane-action-menu");
    actionMenu.appendChild(customActionContainer);
    return customActionContainer;
}

function addEditButton(customActionContainer, bookDataId) {
    // add an edit button to the custom action container
    var editButton = document.createElement("a");
    editButton.innerText = "Edit";
    editButton.classList.add("bane-edit-button", "bane-action-button");
    editButton.href = `https://app.thestorygraph.com/books/${bookDataId}/edit`;
    editButton.target = "_blank";
    customActionContainer.appendChild(editButton);
}

function addCopyIDButton(customActionContainer, bookDataId) {
    // add a copy ID button to the custom action container
    var copyIDButton = document.createElement("button");
    copyIDButton.innerText = "Copy ID";
    copyIDButton.classList.add("bane-edit-button", "bane-action-button");
    copyIDButton.onclick = () => navigator.clipboard.writeText(bookDataId);
    customActionContainer.appendChild(copyIDButton);
}