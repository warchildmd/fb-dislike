$(document).ready(function() {
    $('a.UFILikeLink').each(function() {
        var dislikeButton = '<span>' + '<a class="UFIDisikeLink" href="#" fbid="' + getFbId(this) + '"role="button" aria-label="Dislike this" aria-live="polite">'
            // + '<i class="UFILikeLinkIcon img sp_jY2DRAhh1Ug sx_595ee1"></i>'
            + '<span>Dislike</span>' + '</a>' + '</span>';
        if ($(this).parent().parent().hasClass('UIActionLinks')) {
            dislikeButton = ' . ' + dislikeButton;
        }
        $(this)
            .parent()
            .after(dislikeButton);
    });
    $('body').on('DOMNodeInserted', 'a.UFILikeLink', function() {
        var dislikeButton = '<span>' + '<a class="UFIDisikeLink" href="#" fbid="' + getFbId(this) + '"role="button" aria-label="Dislike this" aria-live="polite">'
            // + '<i class="UFILikeLinkIcon img sp_jY2DRAhh1Ug sx_595ee1"></i>'
            + '<span>Dislike</span>' + '</a>' + '</span>';
        if ($(this).parent().parent().hasClass('UIActionLinks')) {
            dislikeButton = ' . ' + dislikeButton;
        }
        $(this)
            .parent()
            .after(dislikeButton);
    });

    $('body').on('click', 'a.UFIDisikeLink', function() {
        var fbId = $(this).attr('fbid');
        console.log(localStorage.getItem('accessToken'));
        if (localStorage.getItem('accessToken')) {
            $.ajax({
                method: 'GET',
                url: 'https://127.0.0.1:8000/',
                data: {
                    accessToken: localStorage.getItem('accessToken'),
                    action: 'dislike', // TODO Check which action must be executed
                    fbId: fbId
                },
                success: function(data, textStatus, jqXHR) {
                    // TODO Show new count
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    // TODO Notify of error
                },
                dataType: 'json'
            });
        } else {
            chrome.extension.sendRequest({
                type: "auth"
            }, function(response) {});
        }
    });

    function getFbId(fbLikeButton) {
        var jsonFeedbackParams = $(fbLikeButton)
            .closest('form')
            .find('[name="feedback_params"]')
            .first()
            .val();
        var params = JSON.parse(jsonFeedbackParams);
        return params['target_fbid'];
    }
})
