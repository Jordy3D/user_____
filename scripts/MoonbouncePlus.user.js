// ==UserScript==
// @name         Moonbounce Plus
// @namespace    Bane
// @version      0.3.3
// @description  A few handy tools for Moonbounce
// @author       Bane
// @match        https://moonbounce.gg/u/@me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moonbounce.gg
// @grant        none
// ==/UserScript==

// ==Changelog==
//
// 0.1.0    - Initial release
//              - Stores some items and recipes (woefully incomplete)
//              - Adds an event listener to item images that copies the item's UUID to the clipboard
// 0.2.0    - Added the ability to copy the item's name and ID along with the UUID (ctrl + click)
// 0.2.1    - Better formatting for copied item info
// 0.3.0    - Deprecated the ability to copy just the item's UUID
//              - Replaced with a full item info copy
// 0.3.1    - Added a few more items
//          - Fixed recipes I forgot to fill in
//          - Added value to the item info copy
// 0.3.2    - Moved the data to a JSON file
//          - Added a notification when an item is copied to the clipboard
//          - Modified the script to load the data from the JSON file
//          - Modified the data extraction to extract as JSON rather than as a javascript object
//          - Code cleanup and reorganization
// 0.3.3    - Changed the Selected Item Window class to a new one (Moonbounce updated their site)
//
// ==/Changelog==

// ==TODO==
//
// - Add more items and recipes (endless task)
// - Add more classes to find elements on the page
// - Add buttons to go to the Marketplace and Backpack on the Moonbounce Portal (whenever it's active on a page)
// - Add a notification when an item is copied to the clipboard
// - Add a notification when the item info is copied to the clipboard
// - Add a notification when a recipe is able to be crafted
//
// ==/TODO==


// ██████╗  █████╗ ████████╗ █████╗ 
// ██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗
// ██║  ██║███████║   ██║   ███████║
// ██║  ██║██╔══██║   ██║   ██╔══██║
// ██████╔╝██║  ██║   ██║   ██║  ██║
// ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝

var items = null;
var recipes = null;

/**
 * Load the data from MoonbouncePlus.json file
 * @param {boolean} isLocal whether to load the data locally or from the web
 */
function loadData(isLocal = false) {
    if (isLocal) {
        var data = require('./data/MoonbouncePlus.json');
        items = data.items;
        recipes = data.recipes;
        return;
    }

    var url = 'https://github.com/Jordy3D/user_____/raw/main/scripts/data/MoonbouncePlus.json';

    // use an XMLHttpRequest to get the data
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        var status = xhr.status;
        if (status === 200) {
            console.log(xhr.response);

            items = xhr.response.items;
            recipes = xhr.response.recipes;
        } else {
            console.error('Failed to load data');
        }
    };
}

/**
 * Classes that are used to find elements on the page
 * name: the name of the class
 * class: the class name
 */
const targetClasses = [
    { name: "Inventory", class: ".cfWcg" },
    { name: "Selected Item Window", class: "._base_adyd1_1" },
    { name: "Selected Item Details", class: "._base_awewl_1" },
    { name: "Moonbounce Portal Buttons", class: "._base_11wdf_1" },
    { name: "Source List Item", class: ".mSsVp" },
    { name: "Diffuse Value", class: ".WVOcs" },
]
const getTargetClass = name => targetClasses.find(x => x.name == name).class;

const targetURLs = [
    { name: "Inventory", url: "https://moonbounce.gg/u/@me/backpack" },
]
const getTargetURL = name => targetURLs.find(x => x.name == name).url;



// ███╗   ███╗ █████╗ ██╗███╗   ██╗
// ████╗ ████║██╔══██╗██║████╗  ██║
// ██╔████╔██║███████║██║██╔██╗ ██║
// ██║╚██╔╝██║██╔══██║██║██║╚██╗██║
// ██║ ╚═╝ ██║██║  ██║██║██║ ╚████║
// ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝

var isWebDoc = typeof document !== 'undefined';

if (isWebDoc) {                 // Actual Web Script

    setInterval(addCopyDetailstoItemImage, 1000);
}
else {                          // Local Debugging Script
    // import the local data/MoonbouncePlus.json file
    loadData(true);

    function displayIncompleteItems() {
        // get the items that are missing a value
        let missingValueItems = items.filter(x => !x.hasOwnProperty('value'));
        // sort the items by name
        missingValueItems.sort((a, b) => a.name.localeCompare(b.name));

        // display the items
        for (let item of missingValueItems)
            console.log(`#${item.id}: ${item.name}`);
    }

    // nicely print each item and a few of its properties
    function displayItems() {
        console.log(`Showing ${items.length} items\n`);

        var displayLog = "ID     Name                                               Rarity     Type           Value";

        for (let item of items) {
            var id = `#${item.id}`.padStart(5, ' ');
            var name = item.name.padEnd(50, ' ');
            var rarity = `[${item.rarity}]`.padEnd(10, ' ');
            var type = `[${item.type}]`.padEnd(13, ' ');

            var value = item.value == null ? "" : item.value.toString().padStart(5, ' ') + ' MP';

            var output = `${id}: ${name} ${rarity} ${type} ${value}`;

            https://moonbounce.gg/images/fp/4b51f64d-a5e1-4fba-8713-f15414306330/c/f/preview.png
            output += `\n       Image URL: https://moonbounce.gg/images/fp/${item.uuid}/c/f/preview.png`;

            displayLog += `\n${output}`;
        }

        console.log(displayLog);
    }

    // displayIncompleteItems();
    displayItems();
}




// ███████╗██╗   ██╗███╗   ██╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗
// ██╔════╝██║   ██║████╗  ██║██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
// █████╗  ██║   ██║██╔██╗ ██║██║        ██║   ██║██║   ██║██╔██╗ ██║███████╗
// ██╔══╝  ██║   ██║██║╚██╗██║██║        ██║   ██║██║   ██║██║╚██╗██║╚════██║
// ██║     ╚██████╔╝██║ ╚████║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║███████║
// ╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝

/**
 * Add an event listener to item images that copies the item's UUID to the clipboard
 * If ctrl is held, also copy the item's name and ID
 */
function addCopyDetailstoItemImage() {
    if (!isTargetURL(getTargetURL("Inventory"))) return;

    let itemWindow = findSelectedItemWindow();
    if (itemWindow == null) return;

    let items = itemWindow.querySelectorAll("img");
    if (items.length == 0) return;

    let details = itemWindow.querySelector(getTargetClass("Selected Item Details"));

    addSupportCSS();

    function addSupportCSS() {
        addCSS(`
._base_107fx_1 
{
  cursor: pointer;
  user-select: none;
  
  transition: transform 100ms ease-in-out;
  
  &:hover
  {
    transform: scale(1.05);
  }
  &:active
  {
    transform: scale(0.96);
  }
}
        `, "copyDetailsToItemCSS");
    }

    
    function getUUIDFromSrc(src) {
        let start = src.indexOf("/fp/") + 4;                                // find the index of /fp/ and add 4 to get the start of the uuid
        let end = src.indexOf("/c/");                                       // find the index of /c/ to get the end of the uuid
        let uuid = src.substring(start, end);                               // get the substring between the start and end

        return uuid;
    }

    function getDetails(details) {
        let nameIdBlock = details.children[0];                                  // get the first child of the details element
        let name = nameIdBlock.children[0].innerText;                           // get the text of the first child (the name)
        let id = nameIdBlock.children[1].innerText;                             // get the text of the second child (the id)
        id = id.substring(1);                                                   // remove the # from the beginning of the id

        let info = details.children[1];                                         // get the second child of the details element
        let description = info.children[0].innerText;                           // get the text of the first child (the description)
        let rarity = info.children[1].children[0].innerText;                    // get the text of the first child of the second child (the rarity)
        let type = info.children[1].children[1].innerText;                      // get the text of the second child of the second child (the type)

        // get the value of the item
        let valueDiv = info.querySelector(getTargetClass("Diffuse Value"));     // get the element with the value
        let value = null;                                                       // set the value to 0 by default
        if (valueDiv != null) {
            value = valueDiv.innerText;                                         // get the text of the value
            value = value.replace("MP", "").trim();                             // clean up the value
        }

        let sources = details.children[2];                                      // get the third child of the details element
        let sourceObjects = sources.querySelectorAll(getTargetClass("Source List Item"));
        // get the p from each source object and add it to the source list
        let sourceList = [];
        for (let source of sourceObjects) {
            let p = source.querySelector("p");
            sourceList.push(p.innerText);
        }

        return { name: name, id: id, description: description, rarity: rarity, type: type, value: value, sources: sourceList };
    }

    function cleanJSONString(jsonString, id, value) {
        jsonString = jsonString.replace(/:/g, ": ");                        // replace all instances of ":" with ": "
        jsonString = jsonString.replace(/,/g, ", ");                        // replace all instances of "," with ", "
        jsonString = jsonString.replace(/{/g, "{ ");                        // replace all instances of "{" with "{ "
        jsonString = jsonString.replace(/}/g, " }");                        // replace all instances of "}" with " }"

        jsonString = jsonString.replace(`"${id}"`, id);                     // Replace the id string with just the id
        jsonString = jsonString.replace(`"${value}"`, value);               // Replace the value string with just the value

        return jsonString;
    }

    for (let item of items) {
        // If the item is not an item image, skip it
        if (item.alt != "item") continue;

        // if the item has an event listener, skip it
        if (item.classList.contains("item-uuid-event")) continue;

        console.log("Adding event listener to item");

        // add an event listener to the item's parent
        item.parentElement.addEventListener("click", function () {
            let img = this.querySelector("img");
            let uuid = getUUIDFromSrc(img.src);                             // get the item's UUID from the image source

            // also get the item name and id, and format it as
            // { id: "item id", name: "item name", uuid: "item uuid" }
            console.log("Copying item info to clipboard");

            let { name, id, description, rarity, type, value, sources } = getDetails(details);

            let itemInfo = { id: id, name: name, uuid: uuid, description: description, rarity: rarity, type: type, value: value, sources: sources };
            let jsonString = JSON.stringify(itemInfo);                  // convert the object to a JSON string

            jsonString = cleanJSONString(jsonString, id, value);        // Clean up the JSON string
            jsonString += ",";                                          // Add a comma to the end of the string

            copyToClipboard(jsonString);

            // Place a notification right below the item, centered directly below it
            let pos = img.getBoundingClientRect();
            let imgCenter = pos.left + (pos.width / 2);
            floatingNotification("Item info copied to clipboard", 1000, "background-color: #333; color: #fff; padding: 5px 10px; border-radius: 5px; transform: translateX(-50%);", { top: pos.bottom + 10 + "px", left: imgCenter + "px" });
        });

        // add a class to the item to show that it has an event listener
        item.classList.add("item-uuid-event");
    }
}





// ██╗  ██╗███████╗██╗     ██████╗ ███████╗██████╗ 
// ██║  ██║██╔════╝██║     ██╔══██╗██╔════╝██╔══██╗
// ███████║█████╗  ██║     ██████╔╝█████╗  ██████╔╝
// ██╔══██║██╔══╝  ██║     ██╔═══╝ ██╔══╝  ██╔══██╗
// ██║  ██║███████╗███████╗██║     ███████╗██║  ██║
// ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝

/**
 * Finds the current page's URL
 */
function findCurrentURL() {
    return window.location.href;
}

/**
 * Checks if the current URL is the target URL
 */
function isTargetURL(targetURL) {
    let currentURL = findCurrentURL();
    return currentURL == targetURL;
}


/**
 * Find the inventory on the page
 * @returns the inventory div element | null
 */
function findInventory() {
    // find the inventory div
    let inventory = document.querySelector(getTargetClass("Inventory"));
    if (inventory == null) return;

    return inventory;
}

/**
 * Find the selected item window on the page
 * @returns the selected item window div | null
 */
function findSelectedItemWindow() {
    // find the selected item window
    let selectedItemWindow = document.querySelector(getTargetClass("Selected Item Window"));
    if (selectedItemWindow == null) return;

    return selectedItemWindow;
}


/**
 * Find the Moonbounce Portal on the page
 */
function findMoonbouncePortal() {
    // find #MOONBOUNCE.PORTAL
    let portal = document.querySelector("#MOONBOUNCE.PORTAL");
    if (portal == null) return;

    return portal;
}


/**
 * Find the Moonbounce Portal buttons on the page
 */
function findMoonbouncePortalButtons() {
    let portal = findMoonbouncePortal();
    if (portal == null) return;

    // find the buttons
    let buttons = portal.querySelector(getTargetClass("Moonbounce Portal Buttons"));
    if (buttons == null) return;

    return buttons;
}

/**
 * Copy text to the clipboard
 * @param {string} text the text to copy
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
}

/**
 * Add CSS to the header of the page
 * @param {string} css the CSS to add
 * @param {string} id the id of the CSS element
 */
function addCSS(css, id) {
    if (document.getElementById(id) != null) return;

    let style = document.createElement('style');
    style.id = id;
    style.innerHTML = css;
    document.head.appendChild(style);
}

/**
 * Floating notification that fades out after a few seconds
 * @param {string} message the message to display
 * @param {number} duration the duration of the notification in milliseconds
 * @param {string} css the CSS styles for the notification
 * @param {string} position the position of the notification (top, top-right, top-left, bottom, bottom-right, bottom-left, center, position: absolute)
 */
function floatingNotification(message, duration = 3000, css = "", position = "top") {
    let notification = document.createElement("div");
    notification.innerHTML = message;
    notification.style.position = "fixed";
    notification.style.cssText = css;
    notification.style.zIndex = 1000;
    notification.style.transition = "opacity 0.5s";
    notification.style.opacity = 1;

    switch (position) {
        case "top":
            notification.style.top = "10px";
            notification.style.left = "50%";
            notification.style.transform = "translateX(-50%)";
            break;
        case "top-right":
            notification.style.top = "10px";
            notification.style.right = "10px";
            break;
        case "top-left":
            notification.style.top = "10px";
            notification.style.left = "10px";
            break;
        case "bottom":
            notification.style.bottom = "10px";
            notification.style.left = "50%";
            notification.style.transform = "translateX(-50%)";
            break;
        case "bottom-right":
            notification.style.bottom = "10px";
            notification.style.right = "10px";
            break;
        case "bottom-left":
            notification.style.bottom = "10px";
            notification.style.left = "10px";
            break;
        case "center":
            notification.style.top = "50%";
            notification.style.left = "50%";
            notification.style.transform = "translate(-50%, -50%)";
            break;
        default:
            notification.style.position = "absolute";
            notification.style.top = position.top;
            notification.style.left = position.left;
            break;
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = 0;
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, duration);
}