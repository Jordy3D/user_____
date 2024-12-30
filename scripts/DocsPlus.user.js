// ==UserScript==
// @name         Docs Plus
// @namespace    Bane
// @version      0.0.3
// @description  Add buttons and the like to Docs
// @author       Bane
// @match        https://docs.google.com/document/d/*/edit*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

// ==Tags==
// @site-name    Google Docs
// @site-url     https://docs.google.com/
// @description  Add buttons and the like to Docs
// ==/Tags==

// ==ChangeLog==
// 0.0.1    - Initial version
//              - Added toggle to display standard document outline or a the document tabs
// 0.0.2    - Fixed it to work with multiple tabs rather than just the first one
// 0.0.3    - Re-add HTML policy escaping because I KNEW I WAS GOING TO NEED IT AND IT TRICKED ME
// ==/ChangeLog==

// keep trying to create the buttons every 100ms until successful
let interval = setInterval(() => {
    // core loop

    // create bane-doc-tabs
    addCustomCSS();
    createBaneDocTabs();
}, 100);


//#region Main Functions

function createBaneDocTabs() {
    let leftSidebarContainerContent = document.querySelector(".left-sidebar-container-content");
    if (!leftSidebarContainerContent) return;

    let navigationWidgetHat = leftSidebarContainerContent.querySelector(".navigation-widget-hat");
    if (!navigationWidgetHat) return;

    if (navigationWidgetHat.querySelector(".bane-doc-tabs")) return;

    console.log("[Docs Plus] Creating bane-doc-tabs");

    let baneDocTabs = document.createElement("div");
    baneDocTabs.classList.add("bane-doc-tabs");
    navigationWidgetHat.appendChild(baneDocTabs);

    let outlineTab = document.createElement("span");
    outlineTab.classList.add("bane-doc-tab");
    outlineTab.textContent = "Outline";
    baneDocTabs.appendChild(outlineTab);

    let documentsTab = document.createElement("span");
    documentsTab.classList.add("bane-doc-tab");
    documentsTab.classList.add("bane-doc-tab-selected");
    documentsTab.textContent = "Documents";
    baneDocTabs.appendChild(documentsTab);

    let selectedChapterItem = document.querySelector(".chapter-item > [aria-selected='true']");
    if (!selectedChapterItem) return;

    // set selectedChapterItem to the parent chapter-item
    selectedChapterItem = selectedChapterItem.parentElement;

    console.log("[Docs Plus] Found selected chapter item");

    // find the .updating-navigation-item-list in the selectedChapterItem
    // if it exists, find the .outlines-widget in the .left-sidebar-container-content and create an empty div with the class "bane-doc-outline" and add it after the .outlines-widget
    let updatingNavigationItemList = selectedChapterItem.querySelector(".updating-navigation-item-list");
    if (!updatingNavigationItemList) return;

    console.log("[Docs Plus] Found updating navigation item list");

    let outlinesWidget = leftSidebarContainerContent.querySelector(".outlines-widget");
    if (!outlinesWidget) return;

    console.log("[Docs Plus] Creating bane-doc-outline");

    let baneDocOutline = document.createElement("div");
    baneDocOutline.classList.add("bane-doc-outline");
    baneDocOutline.classList.add("bane-hidden");

    // move the updatingNavigationItemList element and append it to the baneDocOutline
    // leave behind a div marker for where the updatingNavigationItemList was so it can be reinserted later
    let updatingNavigationItemListORIGINMarker = document.createElement("div");
    updatingNavigationItemListORIGINMarker.classList.add("bane-hidden");
    updatingNavigationItemListORIGINMarker.classList.add("bane-updating-navigation-item-list-marker");
    updatingNavigationItemList.parentElement.appendChild(updatingNavigationItemListORIGINMarker);

    // create a destination for the baneDocOutline
    let updatingNavigationItemListDESTINATIONMarker = document.createElement("div");
    updatingNavigationItemListDESTINATIONMarker.classList.add("bane-hidden");
    updatingNavigationItemListDESTINATIONMarker.classList.add("bane-updating-navigation-item-list-marker");
    baneDocOutline.appendChild(updatingNavigationItemListDESTINATIONMarker);

    outlinesWidget.after(baneDocOutline);

    console.log("[Docs Plus] Adding event listeners");

    // find all .chapter-container elements and add a click event listener to each
    let chapterContainers = document.querySelectorAll(".chapter-container");
    chapterContainers.forEach(chapterContainer => {
        chapterContainer.addEventListener("click", () => {
            // delete the bane-doc-tabs, bane-doc-outline, and anything else that was created
            // run the createBaneDocTabs function again
            baneDocTabs.remove();
            baneDocOutline.remove();
            updatingNavigationItemListORIGINMarker.remove();
            updatingNavigationItemListDESTINATIONMarker.remove();
            createBaneDocTabs();
        });
    });

    // add event listeners to the tabs
    outlineTab.addEventListener("click", () => {
        // add bane-hidden to the outlinesWidget and remove it from the baneDocOutline
        outlinesWidget.classList.add("bane-hidden");
        baneDocOutline.classList.remove("bane-hidden");

        // remove bane-doc-tab-selected from documentsTab and add it to outlineTab
        documentsTab.classList.remove("bane-doc-tab-selected");
        outlineTab.classList.add("bane-doc-tab-selected");

        // move the updatingNavigationItemList to the baneDocOutline
        updatingNavigationItemListDESTINATIONMarker.after(updatingNavigationItemList);
    });

    documentsTab.addEventListener("click", () => {
        // add bane-hidden to the baneDocOutline and remove it from the outlinesWidget
        baneDocOutline.classList.add("bane-hidden");
        outlinesWidget.classList.remove("bane-hidden");

        // remove bane-doc-tab-selected from outlineTab and add it to documentsTab
        outlineTab.classList.remove("bane-doc-tab-selected");
        documentsTab.classList.add("bane-doc-tab-selected");

        // reinsert the updatingNavigationItemList
        updatingNavigationItemListORIGINMarker.after(updatingNavigationItemList);
    });
}

function addCustomCSS() {

    // add style
    addStyle("bane-doc-tabs-style", `
    .bane-doc-tabs {
        order: 2;
        flex: 1;
        
        background-color: #f0f4f9;
        border: none;
        border-radius: 24px;
        font-family: Google Sans, Roboto, sans-serif;
        font-weight: 500;
        min-height: 40px;
        height: 40px;
        -webkit-font-smoothing: antialiased;
        
        display: flex;
        align-content: center;
        align-items: center;
        justify-content: space-between;
    
        .bane-doc-tab
        {
            cursor: pointer;
            display: flex;
            align-content: center;
            align-items: center;
            box-sizing: border-box;
            border-radius: inherit;
            
            flex: 1;
            justify-content: center;
            
            height: 100%;
            margin: 0;

            &:hover {
                background: rgba(68,71,70,.08);
            }

            &:first-child {
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            }

            &:last-child {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }
        }
        
        .bane-doc-tab-selected {
            background: #d3e3fd;

            &:hover {
                background: #C2D3EF;
            }
        }
    }

    .bane-hidden {
        display: none !important;
    }

    .bane-doc-outline {
        height: 100%;
    
        > div {
            visibility: visible;
            height: 100%;
            
            .navigation-item-list {
            display: block !important;
            user-select: unset !important;
            }
        }
    }
    `);
}

//#endregion


//#region Support Functions

var escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
    createHTML: (to_escape) => to_escape
});

function addStyle(id, css, debug = false) {
    // id is the id of the style element
    // css is the style content
    if (document.getElementById(id) == null) {
        if (debug) console.log(`Creating style ${id}`);
        let styleEl = document.createElement("style");
        styleEl.id = id;
        styleEl.innerHTML = escapeHTMLPolicy.createHTML(css);
        document.head.appendChild(styleEl);
    }
}

//#endregion