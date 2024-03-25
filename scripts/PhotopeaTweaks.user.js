// ==UserScript==
// @name         PhotopeaTweaks
// @namespace    Bane
// @version      0.1
// @description  Tweaks to Photopea.
// @author       Bane
// @match        https://www.photopea.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=photopea.com
// @grant        none
// ==/UserScript==

// ==ChangeLog==
// 0.1 - Initial version
//     - Added buttons to support custom sizes in the new project window
//        - Includes TVDB and Fanart.tv size templates
//        - Mimics the style of the existing predefined sizes
// ==/ChangeLog==

// Size Templates
// Each size template has a label (a group name) and an array of size objects
// Each size object has a name, width, height, unit, and unitShort
// An example size object is:
// { name: 'Poster', width: 680, height: 1000, unit: 'pixels', unitShort: 'px' }
var sizeTemplates = [
    {
        label: 'TVDB',
        sizes: [
            { name: 'Poster', width: 680, height: 1000, unit: 'pixels', unitShort: 'px' },
            { name: 'Banner', width: 758, height: 140, unit: 'pixels', unitShort: 'px' },
            { name: 'Background', width: 1920, height: 1080, unit: 'pixels', unitShort: 'px' },
            { name: 'Episode (4:3)', width: 640, height: 480, unit: 'pixels', unitShort: 'px' },
            { name: 'Episode (16:9)', width: 640, height: 360, unit: 'pixels', unitShort: 'px' },
        ]
    },
    {
        label: 'Fanart.tv',
        sizes: [
            { name: 'Thumbnail', width: 1000, height: 562, unit: 'pixels', unitShort: 'px' },
            { name: 'Poster', width: 1000, height: 1426, unit: 'pixels', unitShort: 'px' },
            { name: 'Banner', width: 1000, height: 185, unit: 'pixels', unitShort: 'px' },
            { name: 'Background', width: 1920, height: 1080, unit: 'pixels', unitShort: 'px' },
        ]
    }
];

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


function spawnSizeTemplateButton(label, sizes) {
    // if the button already exists, return
    if (document.querySelector('.newproject .fitem:is(:contains("' + label + '"))')) return;

    // find .newproject, and find the button with innertext "Print" to get the parent
    var newProjectWindow = document.querySelector('.newproject');
    var buttons = newProjectWindow.querySelectorAll('button.fitem');

    var printButton = null;
    buttons.forEach(function (button) {
        if (button.innerText.includes('Print'))
            printButton = button;
    });
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
            var customSize = document.createElement('div');
            customSize.className = 'customsize';
            customSize.style.width = '100px';
            customSize.style.height = '100px';

            // calculate the ratio
            var ratio = size.width / size.height;

            var ratioPreview = document.createElement('div');
            ratioPreview.className = 'customsize--ratioPreview';

            // resize the ratioPreview div based on the ratio
            // the maximum height of the ratioPreview div is 50px
            // the maximum width of the ratioPreview div is 95px

            if (ratio > 1) { // width is bigger
                width = 80;
                height = width / ratio;

                // if the height is bigger than 50px, shrink the width
                if (height > 50) {
                    height = 50;
                    width = 50 * ratio;
                }

                ratioPreview.style.width = width + 'px';
                ratioPreview.style.height = height + 'px';
            }
            else { // height is bigger
                height = 50;
                width = height * ratio;

                // if the width is bigger than 95px, shrink the height
                if (width > 95) {
                    width = 95;
                    height = 95 / ratio;
                }

                ratioPreview.style.width = width + 'px';
                ratioPreview.style.height = height + 'px';
            }

            customSize.appendChild(ratioPreview);

            var nameLabel = createBasicElement('customsize--Name', size.name);
            customSize.appendChild(nameLabel);

            var sizeText = createBasicElement('customsize--Size', `${size.width}x${size.height} ${size.unitShort}`);
            customSize.appendChild(sizeText);


            customSize.addEventListener('click', function () {
                // set the width input value to size.width and trigger the change event
                var widthInput = document.querySelector('.newproject input[id="405"]');
                widthInput.value = size.width;
                widthInput.dispatchEvent(new Event('change'));

                // find the unit select input and set the value to size.unit
                var unitInput = document.querySelector('.newproject select[id="dd406"]');
                var unitOption = Array.from(unitInput.options).find(function (option) {
                    return option.innerText.toLowerCase() === size.unit.toLowerCase();
                });
                unitInput.value = unitOption.value || 0;

                // set the height input value to size.height and trigger the change event
                var heightInput = document.querySelector('.newproject input[id="407"]');
                heightInput.value = size.height;
                heightInput.dispatchEvent(new Event('change'));
            });




            imageSet.appendChild(customSize);
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


// Helper Functions

function createBasicElement(className, text, tag = 'div') {
    var element = document.createElement(tag);
    element.className = className;
    element.innerText = text;
    return element;
}

function applyAppropriateActiveButtonStatus(container, activeButton, statusClass = 'bactive') {
    container.querySelectorAll('button').forEach(function (button) {
        button.classList.remove(statusClass);
    });

    activeButton.classList.add(statusClass);
}


function addCSSToHead(css, id) {
    if (document.getElementById(id)) return;

    var style = document.createElement('style');
    style.type = 'text/css';
    style.id = id;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
}