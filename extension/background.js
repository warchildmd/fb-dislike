chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    chrome.tabs.create({
        url: 'https://www.facebook.com/dialog/oauth?client_id=<APP_ID>&response_type=token&redirect_uri=https://www.facebook.com/'
    })
    sendResponse({});
});
