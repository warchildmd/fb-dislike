$(document).ready(function() {
    console.log(window.location);

    if (window.location.hash.indexOf('access_token') != -1) {
        console.log('Access Token detected in URL');
        var paramPairs = window.location.hash.split('&');
        for (var i = 0; i < paramPairs.length; i++) {
            var keyValuePair = paramPairs[i].split('=');
            var key = (keyValuePair[0][0] == '?' || keyValuePair[0][0] == '#') ? keyValuePair[0].substring(1) : keyValuePair[0];
            var value = keyValuePair[1];
            if (key === 'access_token') {
                localStorage.setItem('accessToken', value);
                break;
            }
        }
    }
});
