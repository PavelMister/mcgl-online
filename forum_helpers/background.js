chrome.browserAction.onClicked.addListener(function (tab) {
    if (tab.url.indexOf("http://forum.minecraft-galaxy.ru") !== -1) {
        chrome.tabs.executeScript(tab.id, {
            "file": "forum_helpers/bb-garants-post.js",
            "file": "forum_helpers/bb-lupa.js",
            "file": "forum_helpers/bb-userdoc.js",
            "file": "forum_helpers/invite-community.js",
        }, function () { // Execute your code
        });
    }
});