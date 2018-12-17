$(document).ready(function() {
	var prev;

	$('.personify').hover(
		function() {
        prev = $(this).text();
        $(this).text($(this).attr('id'));
    },
    function() {
        $(this).text(prev);
    });
})