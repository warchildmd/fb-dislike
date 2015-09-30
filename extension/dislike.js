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
            // .parent()
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
            // .parent()
            .after(dislikeButton);
    });

    $('body').on('click', 'a.UFIDisikeLink', function() {
        alert($(this).attr('fbid'));
        chrome.runtime.sendMessage({
            request: "c_user"
        }, function(response) {
            console.log(response);
        });
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
