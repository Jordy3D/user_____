// ==UserScript==
// @name         Bane's Anilist Changes
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Changes to Anilist that I like
// @author       Bane
// @match        https://anilist.co/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anilist.co
// @grant        none
// ==/UserScript==

// ==ChangeLog==
// 0.1 - Initial Release
//     - Added To Watch Section
// 0.2 - Added CSS Fix for List Preview
// 0.3 - Fixed issue where switching pages sometimes didn't work or caused errors

var sourceListPreview = null;

(function () {
    'use strict';

    // log  large text, black text with a red text shadow on the left and a blue text shadow on the right akin 3D glasses
    var css = `
        font-size: 30px;
        text-shadow: #ff0000 -5px 0px 1px, #0004ff 5px 0px 1px;
    `
    console.log("%cBane's Anilist Changes", css);
    setTimeout(addListPreviewCSSFix, 1200);
    setTimeout(addToWatchSection, 1200);

    // continuously repeat addToWatchSection every so often
    setInterval(addToWatchSection, 1000);

    // continuously repeat addSubmissionGrouping every so often
    //setInterval(addSubmissionGrouping, 1000);
})();

submissionEventListenersAdded = false;
// keep trying to add the event listeners until it works by calling addSubmissionGrouping
setInterval(function () {
    if (!submissionEventListenersAdded) {
        addSubmissionGrouping();
    }
}, 1000);

function getSourceListPreview() {
    sourceListPreview = document.getElementsByClassName("list-previews")[0] || document.getElementById("list-preview");
    return sourceListPreview;
}

// To Watch Section

function addToWatchSection() {
    // if the url is not https://anilist.co/home, return
    if (window.location.href != "https://anilist.co/home") return;

    console.log("Adding <To Watch> Section");

    if (document.getElementById("baneToWatchSection") != null) return;

    var sourceListPreview = getSourceListPreview();

    // create new div
    var newDiv = document.createElement("div");
    newDiv.id = "baneToWatchSection";
    newDiv.className = "list-preview-wrap";

    // create div.section-header > h2
    var sectionHeader = document.createElement("div");
    sectionHeader.className = "section-header";
    var sectionHeaderH2 = document.createElement("h2");
    sectionHeaderH2.innerText = "To Watch";
    sectionHeader.appendChild(sectionHeaderH2);

    // find an existing .list-preview and clone it
    var existingListPreview = sourceListPreview.getElementsByClassName("list-preview")[0];
    var listPreview = existingListPreview.cloneNode(true);

    // remove all children from listPreview
    while (listPreview.firstChild)
        listPreview.removeChild(listPreview.firstChild);

    // add elements to new div
    newDiv.appendChild(sectionHeader);
    newDiv.appendChild(listPreview);

    // move all toWatchItems to listPreview
    var toWatchItems = findToWatchItems();
    for (var i = 0; i < toWatchItems.length; i++) {
        var toWatchItem = toWatchItems[i];
        listPreview.appendChild(toWatchItem);
    }

    // add a margin below the new div
    // newDiv.style.marginBottom = "20px";

    // add new div to list-preview as first child
    sourceListPreview.insertBefore(newDiv, sourceListPreview.firstChild);

}

function findToWatchItems() {
    var sourceListPreview = getSourceListPreview();

    // find all .media-preview-card elements that contain .behind-accent
    var mediaPreviewCards = sourceListPreview.getElementsByClassName("media-preview-card");
    var toWatchItems = [];
    for (var i = 0; i < mediaPreviewCards.length; i++) {
        var mediaPreviewCard = mediaPreviewCards[i];
        var behindAccents = mediaPreviewCard.getElementsByClassName("behind-accent");
        if (behindAccents.length > 0)
            toWatchItems.push(mediaPreviewCard);
    }

    return toWatchItems;
}

function addListPreviewCSSFix() {
    var css = `
        .list-preview
        {
            display: flex !important;
            align-items: center;
            flex-wrap: wrap;
            gap: 8.5px !important;
            padding: 15px !important;
        }

        .home { grid-template-columns: auto 490px !important; }

        .media-preview-card.small .content,
        .list-preview .media-preview-card .content,
        .small .cover+.content
        {
            width: 188px !important;
        }

        .list-preview > .media-preview-card:nth-child(4n + 4) .content,
        .list-preview > .media-preview-card:nth-child(4n + 5) .content
        {
            border-radius: 5px 0 0 6px !important;

            left: auto!important;
            right: 100%;
            text-align: right;
        }
    `;

    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    style.id = "baneListPreviewCSSFix";
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
}

// Submission Grouping

const submissionTypes = {
    "pending": "Pending",
    "accepted": "Accepted",
    "partially_accepted": "Partially Accepted",
    "rejected": "Rejected",
};

function addSubmissionGrouping() {
    var submissionWrapID = "baneSubmissionWrap";
    var submissionGroupID = "baneSubmissionGrouping";

    // TODO: Work out how to MOVE the elements without causing a gross lag caused by looping through all the elements and shit

    console.log("Adding Submission Grouping");

    // if the url is not user/***/submissions, return
    if (!window.location.href.includes("/submissions")) return;

    addSubmissionEventListeners();


    function addSubmissionEventListeners() {
        console.log("Adding Submission Event Listeners");

        // find submissions
        var submissions = document.getElementsByClassName("submissions")[0];

        if (submissions == null) {
            console.log("Submissions not found");
            return;
        }

        // find .filter-group
        var filterGroup = submissions.getElementsByClassName("filter-group")[0];

        // add a click event listener to the spans in .filter-group
        var filterSpans = filterGroup.getElementsByTagName("span");
        for (var i = 0; i < filterSpans.length; i++) {
            var filterSpan = filterSpans[i];
            filterSpan.addEventListener("click", function () {
                groupSubmissions();
            });
        }

        submissionEventListenersAdded = true;
    }

    function clearBaneSubmissionGrouping() {
        console.log("Clearing Submission Grouping");

        // find baneSubmissionGrouping
        var baneSubmissionGrouping = document.querySelectorAll(`[id*="${submissionGroupID}"]`);
        
        // delete all baneSubmissionGrouping
        for (var i = 0; i < baneSubmissionGrouping.length; i++) {
            baneSubmissionGrouping[i].remove();
        }

        // make sure the original submission list is visible
        var submissionList = document.getElementsByClassName("submissions")[0].getElementsByClassName("submissions-wrap")[0];
        if (submissionList != null) {
            submissionList.style.display = "block";
        }
    }

    function groupSubmissions() {
        clearBaneSubmissionGrouping();

        console.log("Grouping Submissions");
        // find submissions
        var submissions = document.getElementsByClassName("submissions")[0];

        // find .submissions-page
        var submissionsPage = submissions.getElementsByClassName("submissions-page")[0];
        if (submissionsPage == null) return;

        // find the submission list at .submissions-wrap
        var submissionList = submissionsPage.getElementsByClassName("submissions-wrap")[0];
        if (submissionList == null) return;

        // get the submission filter from the submission list's class names
        var submissionFilter = submissionList.className.split(" ")[1];

        // find all submissions
        var submissions = submissionList.getElementsByClassName("submission");

        // if there are no submissions, return
        if (submissions.length == 0) return;

        console.log("Resetting groups");
        // find all submission groupings
        var submissionGroupings = submissionsPage.querySelectorAll(`[id*="${submissionGroupID}"]`);

        // remove all submission groupings
        for (var i = 0; i < submissionGroupings.length; i++) {
            console.log("Removing Submission Grouping");
            var submissionGrouping = submissionGroupings[i];

            submissionGrouping.remove();
        }

        // if the submission grouping already exists, return
        if (document.getElementById("baneSubmissionGrouping-" + submissionFilter) != null) return;

        console.log("Adding Submission Grouping");

        // create new div for submission grouping
        var newSubmissionList = document.createElement("div");
        newSubmissionList.id = "baneSubmissionGrouping-" + submissionFilter;
        newSubmissionList.className = "submissions-wrap";
        submissionsPage.appendChild(newSubmissionList);

        // create new div for each submission type
        for (var i = 0; i < Object.keys(submissionTypes).length; i++) {
            var newId = `${submissionGroupID}-${Object.keys(submissionTypes)[i]}`;
            if (document.getElementById(newId) != null) continue;

            var submissionGroup = document.createElement("div");
            submissionGroup.classList.add("submission-group");
            submissionGroup.classList.add("bane-submission-group");
            submissionGroup.classList.add(`${submissionFilter}-submissions`);
            submissionGroup.id = newId;
            newSubmissionList.appendChild(submissionGroup);

            console.log("Adding Submission Group: " + newId);

            // add header
            var submissionGroupHeader = document.createElement("h2");
            submissionGroupHeader.className = "submission-group-header";
            submissionGroupHeader.innerText = Object.values(submissionTypes)[i];
            submissionGroup.appendChild(submissionGroupHeader);
        }

        // clone each submission to the correct submission group
        for (var i = 0; i < submissions.length; i++) {
            var submission = submissions[i].cloneNode(true);
            console.log("Cloning Submission: " + submission.id);

            var submissionType = getSubmissionStatus(submission);
            var submissionGroup = document.getElementById(`${submissionGroupID}-${submissionType}`);
            submissionGroup.appendChild(submission);
        }

        function getSubmissionStatus(submission) {
            // find the .status element in the submission and get the second class name
            var status = submission.getElementsByClassName("status")[0];
            if (status == null) return null;

            return status.className.split(" ")[1];
        }


        // hide the original submission list
        submissionList.style.display = "none";

        // add the new submission list
        // submissionList.parentElement.insertBefore(newSubmissionList, submissionList);


    }
}


// Just here to consume any mistaken s from saving