// ==UserScript==
// @name         PhotopeaTweaks
// @namespace    Bane
// @version      0.1.1
// @description  Tweaks to Photopea.
// @author       Bane
// @match        https://www.photopea.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=photopea.com
// @grant        none
// ==/UserScript==

// ==ChangeLog==
// 0.1.0    - Initial version
//          - Added buttons to support custom sizes in the new project window
//              - Includes TVDB and Fanart.tv size templates
//              - Mimics the style of the existing predefined sizes
// 0.1.1    - Added double-click to sizes to instantly create the project
//          - Added the rest of the main TVDB and Fanart.tv sizes
//          - Added a conversion object to convert the unit to the correct value for where it is used
//          - Added a TODO list
//          - Updated URL match to include more than just the homepage
//              - This should now fix loading in images externally and the desktop app
//          - Updated size template
//              - Dropped the need for a fullUnit (ie: "pixels"), instead converting the unit when needed
//              - Added support for background colors in the size templates
//              - Added support for custom background colors in the size templates
// ==/ChangeLog==

// ==TODO==
//      - Add a way to save custom sizes from the new project window
//      - Save/Load custom sizes from local storage
//      - Add more size templates
//      - Find a way to add rulers to the canvas
// ==/TODO==

// ==Photopea Notes==
//     - When using % as a unit in creation, "100%" width is 1280px, and "100%" height is 720px
// ==/Photopea Notes==

//================================================================================================================//

// ██╗███╗   ██╗██╗████████╗
// ██║████╗  ██║██║╚══██╔══╝
// ██║██╔██╗ ██║██║   ██║   
// ██║██║╚██╗██║██║   ██║   
// ██║██║ ╚████║██║   ██║   
// ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   

// Size Templates
// Each size template has a label (a group name) and an array of size objects
// Each size object has the following properties:
//    - name: The name of the size
//    - width: The width of the size
//    - height: The height of the size
//    - unit: The unit of the size (px, %, cm, mm, in)
//    - background: The background color of the size (optional) (white, black, transparent, or a hex color)
var sizeTemplates = [
    // {
    //     label: 'Test',
    //     sizes: [
    //         { name: 'Normal 100x100', width: 100, height: 100, unit: 'px' },
    //         { name: 'Transparent 100x100', width: 100, height: 100, unit: 'px', background: 'transparent' },
    //         { name: 'White 100x100', width: 100, height: 100, unit: 'px', background: 'white' },
    //         { name: 'Black 100x100', width: 100, height: 100, unit: 'px', background: 'black' },
    //         { name: 'Custom 100x100', width: 100, height: 100, unit: 'px', background: '#ff00ff' },
    //     ]
    // },
    {
        label: 'TVDB',
        sizes: [
            { name: 'Poster', width: 680, height: 1000, unit: 'px' },
            { name: 'Banner', width: 758, height: 140, unit: 'px' },
            { name: 'Clearlogo', width: 800, height: 310, unit: 'px', background: 'transparent' },
            { name: 'Background', width: 1920, height: 1080, unit: 'px' },
            { name: 'Episode (4:3)', width: 640, height: 480, unit: 'px' },
            { name: 'Episode (16:9)', width: 640, height: 360, unit: 'px' },
            { name: 'Clearart', width: 1000, height: 562, unit: 'px', background: 'transparent' },
            { name: 'Icon', width: 1024, height: 1024, unit: 'px' },
            { name: 'Actor/Character', width: 300, height: 450, unit: 'px' },
        ]
    },
    {
        label: 'Fanart.tv',
        sizes: [
            { name: 'Poster', width: 1000, height: 1426, unit: 'px' },
            { name: 'Banner', width: 1000, height: 185, unit: 'px' },
            { name: 'Thumb', width: 1000, height: 562, unit: 'px' },
            { name: 'ClearLogo', width: 800, height: 310, unit: 'px', background: 'transparent' },
            { name: 'Background', width: 1920, height: 1080, unit: 'px' },
            { name: 'ClearART', width: 1000, height: 562, unit: 'px', background: 'transparent' },
            { name: 'Character Art', width: 512, height: 512, unit: 'px' },
        ]
    }
];

// Store the unit name conversions
const unitConversion = {
    'px': 'pixels',
    '%': 'percent',
    'cm': 'centimeters',
    'mm': 'millimeters',
    'in': 'inches',
};

// wait for the new project window to appear
var interval = setInterval(function () {
    // if the new project window is open, spawn the size template buttons
    if (document.querySelector('.newproject')) {
        sizeTemplates.forEach(function (sizeTemplate) {
            spawnSizeTemplateButton(sizeTemplate.label, sizeTemplate.sizes);
        });

        clearInterval(interval);
    }
}, 100);


// ███╗   ███╗ █████╗ ██╗███╗   ██╗
// ████╗ ████║██╔══██╗██║████╗  ██║
// ██╔████╔██║███████║██║██╔██╗ ██║
// ██║╚██╔╝██║██╔══██║██║██║╚██╗██║
// ██║ ╚═╝ ██║██║  ██║██║██║ ╚████║
// ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝

// Spawn a button in the new project window to add custom sizes
function spawnSizeTemplateButton(label, sizes) {
    // if the button already exists, return
    if (document.querySelector('.newproject .fitem:is(:contains("' + label + '"))')) return;

    // find the new project window
    var newProjectWindow = document.querySelector('.newproject');
    
    // find the button with innertext "Print" to get the parent
    var buttons = newProjectWindow.querySelectorAll('button.fitem');
    var printButton = Array.from(buttons).find(button => button.innerText.includes('Print'));
    var sizeGroupButtonContainer = printButton.parentElement;

    // find all the buttons in that parent and add an event listener to them
    var buttons = sizeGroupButtonContainer.querySelectorAll('button.fitem');
    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            applyAppropriateActiveButtonStatus(sizeGroupButtonContainer, button);
        });
    });

    // spawn a button in that parent with class .fitem
    var sizeTemplateButton = createBasicElement('fitem', label, 'button');

    // add a click handler to it
    sizeTemplateButton.addEventListener('click', function () {
        // find the .imageset element and clear it
        var imageSet = document.querySelector('.newproject .imageset');
        imageSet.innerHTML = '';

        applyAppropriateActiveButtonStatus(sizeGroupButtonContainer, sizeTemplateButton);

        sizes.forEach(function (size) {
            var customSize = createElementAndAppend(imageSet, { className: 'customsize' });
            customSize.style.width = '100px';
            customSize.style.height = '100px';

            var ratioPreview = createElementAndAppend(customSize, { className: 'customsize--ratioPreview' });

            // calculate the ratio preview size, keeping it within 80x50
            var width, height;
            var ratio = size.width / size.height;
            if (ratio > 1) { // width is bigger
                width = Math.min(80, 50 * ratio);
                height = width / ratio;
            } else { // height is bigger
                height = Math.min(50, 95 / ratio);
                width = height * ratio;
            }

            ratioPreview.style.width = width + 'px';
            ratioPreview.style.height = height + 'px';

            // Create name and size labels
            createElementAndAppend(customSize, { className: 'customsize--Name', text: size.name });
            createElementAndAppend(customSize, { className: 'customsize--Size', text: `${size.width}x${size.height} ${size.unit}` });

            const inputIds = {
                width: '405',
                unit: 'dd406',
                height: '407',
                background: 'dd411',
                colorHex: '483'
            };

            const defaultColorOptions = [
                'white',
                'black',
                'transparent',
            ];

            function setElementValue(id, value) {
                if (!value || !id) return;                                                  // if invalid inputs, return

                const element = document.querySelector(`.newproject [id="${id}"]`);         // find the element by id
                if (!element) return console.error('Element not found:', id, value);        // if element not found, return

                if (id.includes('dd')) {                                                    // if the element is a dropdown
                    var option = Array.from(element.options).find(function (option) {       // find the option that matches the value
                        return option.innerText.toLowerCase() === value.toLowerCase();      // case-insensitive comparison
                    });
                    value = option.value || 0;                                              // default to 0 if no value found
                }

                element.value = value;                                                      // set the value
                element.dispatchEvent(new Event('change'));                                 // trigger event to update value
            }

            function setColourValue(id, value) {
                // first find the colorsample element
                var colorSample = document.querySelector('.colorsample');
                if (!colorSample) return;

                // add a # to the value if it doesn't have one
                if (!value.startsWith('#')) value = '#' + value;

                // click the colorsample element to open the color picker
                colorSample.click();

                var colorPicker = document.querySelector('.colorpicker');

                // find the color input and set the value
                var colorInput = colorPicker.querySelector(`[id="${id}"]`);
                if (colorInput) colorInput.value = value;

                // trigger the change event on the color input
                colorInput.dispatchEvent(new Event('change'));

                // find the "OK" button in the color picker and click it
                var buttons = colorPicker.querySelectorAll('button');
                var okButton = Array.from(buttons).find(button => button.innerText.toLowerCase() === 'ok');
                okButton.click();

                // change the color sample to the new color
                colorSample.style.backgroundColor = value;

            }

            customSize.addEventListener('click', function () {
                // set the width input value to size.width and trigger the change event
                setElementValue(inputIds.width, size.width);

                // find the unit select input and set the value to the size's unit
                setElementValue(inputIds.unit, unitConversion[size.unit]);

                // set the height input value to size.height and trigger the change event
                setElementValue(inputIds.height, size.height);

                // set the background input value to the size's background color
                if (!size.background) size.background = 'white';
                // if the background color is not in the default options, set it to custom
                if (!defaultColorOptions.includes(size.background.toLowerCase())) {
                    setElementValue(inputIds.background, 'custom');
                    setColourValue(inputIds.colorHex, size.background);
                } else {
                    setElementValue(inputIds.background, size.background);
                }
            });

            // add double-click handler
            customSize.addEventListener('dblclick', function () {
                // run the click event
                customSize.click();

                // find the "Create" button in the window and click it
                var buttons = document.querySelectorAll('.newproject button');
                var createButton = Array.from(buttons).find(button => button.innerText.includes('Create'));
                createButton.click();
            });
        });
    });

    sizeGroupButtonContainer.appendChild(sizeTemplateButton);

    // add some CSS to the head
    var css = `
    .imageset
{
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  
  gap: 4px;
}

.imageset .image
{
  margin: 0;
}

.imageset .image:hover
{
  background: #ddd3;
}
.customsize:hover
{
  background: #3a3a3a;
}

.customsize
{
  display: grid;
  grid-template-rows: 60px 20px 10px;
  
  padding: 2px;
  
  height: 100px !important;
  overflow: hidden;
  
  text-align: center;
  
  cursor: pointer;
}

.customsize--ratioPreview
{
  border: 1px solid #c7c7c7;
  
  margin: auto;
}

.customsize--Name
{
  font-size: 11px;
  font-weight: 600;
  color: #c7c7c7;
}

.customsize--Size
{
  font-size: 10px;
  color: #c7c7c790;
}`;
    addCSSToHead(css, 'sizeTemplateCSS');
}

// ██╗  ██╗███████╗██╗     ██████╗ ███████╗██████╗ 
// ██║  ██║██╔════╝██║     ██╔══██╗██╔════╝██╔══██╗
// ███████║█████╗  ██║     ██████╔╝█████╗  ██████╔╝
// ██╔══██║██╔══╝  ██║     ██╔═══╝ ██╔══╝  ██╔══██╗
// ██║  ██║███████╗███████╗██║     ███████╗██║  ██║
// ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝

// DOM Functions

function createBasicElement(className, text, tag = 'div') {         // To Be Removed Eventually
    var element = document.createElement(tag);
    element.className = className;
    element.innerText = text;
    return element;
}

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

function createElementAndAppend(parent, options = {}) {
    const element = createElement(options);
    parent.appendChild(element);
    return element;
}

// State Functions

function applyAppropriateActiveButtonStatus(container, activeButton, statusClass = 'bactive') {
    container.querySelectorAll('button').forEach(function (button) {
        button.classList.remove(statusClass);
    });

    activeButton.classList.add(statusClass);
}

// CSS Functions

function addCSSToHead(css, id) {
    if (document.getElementById(id)) return;

    var style = document.createElement('style');
    style.type = 'text/css';
    style.id = id;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
}