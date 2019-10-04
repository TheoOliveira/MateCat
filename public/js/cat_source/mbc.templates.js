if ( MBC.enabled() )
(function($,MBC) {

    var tpls = { // TODO: make this local

        historyIcon : '' +
            '  <div id="mbc-history" title="View comments"> ' +
            /*'      <span class="icon-bubble2"></span> ' +*/
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="3 3 36 36">' +
                ' <path fill="#fff" fill-rule="evenodd" stroke="none" stroke-width="1" d="M33.125 13.977c-1.25-1.537-2.948-2.75-5.093-3.641C25.886 9.446 23.542 9 21 9c-2.541 0-4.885.445-7.031 1.336-2.146.89-3.844 2.104-5.094 3.64C7.625 15.514 7 17.188 7 19c0 1.562.471 3.026 1.414 4.39.943 1.366 2.232 2.512 3.867 3.439-.114.416-.25.812-.406 1.187-.156.375-.297.683-.422.922-.125.24-.294.505-.508.797a8.15 8.15 0 01-.484.617 249.06 249.06 0 00-1.023 1.133 1.1 1.1 0 00-.126.141l-.109.132-.094.141c-.052.078-.075.127-.07.148a.415.415 0 01-.031.156c-.026.084-.024.146.007.188v.016c.042.177.125.32.25.43a.626.626 0 00.422.163h.079a11.782 11.782 0 001.78-.344c2.73-.697 5.126-1.958 7.189-3.781.78.083 1.536.125 2.265.125 2.542 0 4.886-.445 7.032-1.336 2.145-.891 3.843-2.104 5.093-3.64C34.375 22.486 35 20.811 35 19c0-1.812-.624-3.487-1.875-5.023z"/> ' +
                '</svg>' +
            '  </div>',

        historyOuter : '' +
            ' <div class="mbc-history-balloon-outer hide"> ' +
            '     <div class="mbc-triangle mbc-triangle-top"></div> ' +
            ' </div> ',

        historyViewButton: '' +
            ' <div class="mbc-clearfix mbc-view-comment-wrap"> ' +
            '   <a href="javascript:;" class="mbc-comment-link-btn mbc-view-link mbc-show-comment-btn">View thread</a>' +
            ' </div> ',

        historySegmentLabel: '' +
            ' <span class="mbc-nth-comment mbc-nth-comment-label">Segment <span class="mbc-comment-segment-number"></span></span> ',

        historyHasComments: '' +
            ' <div class="mbc-history-balloon mbc-history-balloon-has-comment"> ' +
            ' ' + // showComment loop here
            ' </div> ',

        historyNoComments : '' +
            ' <div class="mbc-history-balloon mbc-history-balloon-has-no-comments" style="display: block;">' +
            '    <div class="mbc-thread-wrap"> ' +
            '       <div class="mbc-show-comment"> ' +
            '           <span class="mbc-comment-label">No comments</span>'  +
            '       </div> ' +
            '    </div> ' +
            ' </div>',

        activeCommentsNumberInHistory : '' +
            '<span class="mbc-comment-highlight mbc-comment-highlight-balloon-history mbc-comment-notification"></span>',

        divider : '' +
            '<div class="divider"></div>',

        // showResolve : '' +
        //     '<div class="mbc-resolved-comment">' +
        //     ' <span class="mbc-comment-resolved-label">' +
        //     '   <span class="mbc-comment-username mbc-comment-resolvedby"></span>' +
        //     '   <span class="">marked as resolved</span>' +
        //     ' </span>' +
        //     '</div>' ,

        threadWrap : '' +
            ' <div class="mbc-thread-wrap mbc-clearfix">'  +
            '' + // comments go here
            ' </div>',

        showComment : '' +
            '<div class="mbc-show-comment mbc-clearfix">' +
            ' <span class="mbc-comment-label mbc-comment-username mbc-comment-username-label mbc-truncate"></span>' +
            ' <span class="mbc-comment-label mbc-comment-email-label mbc-truncate"></span>' +
            ' <div class="mbc-comment-info-wrap mbc-clearfix">' +
            '   <span class="mbc-comment-info mbc-comment-time pull-left"></span>' +
            ' </div>' +
            ' <p class="mbc-comment-body"></p>' +
            ' </div>' ,

        firstCommentWrap : '' +
            ' <div class="mbc-thread-wrap mbc-thread-wrap-active mbc-clearfix">' +
            '' + // insertCommentHeader
            '</div>',
    };

    $.extend(MBC.const, {
        get tpls() {
            return tpls ;
        }
    });

})(jQuery,MBC);
