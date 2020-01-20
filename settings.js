/*
 * Settings functions.
 */
class Settings {

    getStorage() {
        var itemsData;
        chrome.storage.local.get(['otherUrl', 'resetTime', 'installApp', 'refreshAt'], function (items) {
            if (typeof items !== 'undefined' && items.length > 0) {
                otherUrl   = items.otherUrl;
                resetTime  = items.resetTime;
                installApp = items.installApp;
                refreshAt  = items.refreshAt;
            };
        });
    }

    setStorage(field, value) {
        if (field == null || field == undefined || field == "") {
            return false;
        }
        if (value == null || value == undefined || value == "") {
            return false;
        }

        if (field == "otherUrl") {
            chrome.storage.local.set({otherUrl: value});
        }
        if (field == "resetTime") {
            chrome.storage.local.set({resetTime: value});
        }
        if (field == "installApp") {
            chrome.storage.local.set({installApp: value});
        }
        if (field == "refreshAt") {
            chrome.storage.local.set({refreshAt: value});
        }
        return true;
    }
}