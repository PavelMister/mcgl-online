/*
 * Settings functions.
 */
class Settings {

    getStorage(field) {
        var returnValue = false;
        chrome.storage.local.get([field], function (items) {
            if (items.hasOwnProperty(field)) {
                console.log("have");
                console.log(items[field]);
                returnValue = items[field];
            } else {

                console.log("not have");
            }
        });
        return  returnValue;
    }

    setStorage(field, value) {
        if (field == null || field == undefined || field == "") {
            return false;
        }
        if (value == null || value == undefined || value == "") {
            return false;
        }

        if (field == "otherUrl") {
            console.log("qq");
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