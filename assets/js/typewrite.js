
// $(window).scroll(function() {
//     if ($(window).scrollTop() > ($('.typewriter-why').offset().top - 200) &&
//         $('.typewriter-why').attr('writing') == "false" && $('.typewriter-why').attr('done') == "false") {

//         var $target = $($('.typewriter-why').attr('href'));
//         $('.typewriter-why').find("span[class='blinking-cursor']").remove()

//         $('.typewriter-why').attr('writing', 'true');
//         $target.toggle().typewriter(5);
//         $('.typewriter-why').attr('done', 'true');

//         return false;
//     }
// });

// $('document').ready(function() {
   
//     $('.typewriter-why').find("span[class='blinking-cursor']").click(function(event) {

//         var $target = $($('.typewriter-why').attr('href'));
//         $('.typewriter-why').find("span[class='blinking-cursor']").remove();

//         $('.typewriter-why').attr('writing', 'true');
//         $target.toggle().typewriter(5);
//         $('.typewriter-why').attr('done', 'true');

//         return false;
//     });
// });

// // $('document').ready(function() {
   
// //     $('.blinking-cursor').click(function(event) {

// //         var $target = $($('.typewriter-why').attr('href'));

// //         $('.typewriter-why').attr('writing', 'false');
// //         $target.toggle().typedeleter(5);

// //         $('.typewriter-why').append("<span class='blinking-cursor'>█</span>");
// //         return false;
// //     });
// // });


// jQuery.fn.typewriter = function (delta) {
//     var recurse = function (node, delay) {
//         // Only convert text nodes
//         if (node.nodeType == 3) {
//             var str = node.textContent || '';
//             node.textContent = '';
//             var progress = 0;
//             // Initial timer to delay next descendant
//             setTimeout(function () {
//                 // Repeat timer until complete
//                 var timer = setInterval(function () {
//                     var ss = str.substring(0, progress++) + (progress & 1 ? '█' : '');
//                     node.textContent = ss;
//                     if (progress >= str.length) {
//                         clearInterval(timer);
//                         node.textContent = str;
//                     }
//                 }, delta);
//             }, delay * delta);
//             delay += str.length;
//         } else {
//             var $node = $(node);
//             if ($node.is(':visible')) {
//                 $(node).contents().each(function (index) {
//                     delay = recurse(this, delay);
//                 });
//             }
//         }
//         return delay;
//     }
//     this.each(function () {
//         // Start with the specified node with delay = 0
//         recurse(this, 0);
//     });
//     return this;
// };


// jQuery.fn.typedeleter = function (delta) {
//     var recurse = function (node, delay) {
//         // Only convert text nodes
//         if (node.nodeType == 3) {
//             var str = node.textContent || '';
//             node.textContent = '';
//             var progress = str.length;
//             // Initial timer to delay next descendant
//             setTimeout(function () {
//                 // Repeat timer until complete
//                 var timer = setInterval(function () {
//                     var ss = str.substring(0, progress--) + (progress & 1 ? '█' : '');
//                     node.textContent = ss;
//                     if (progress >= str.length) {
//                         clearInterval(timer);
//                         node.textContent = str;
//                     }
//                 }, delta);
//             }, delay * delta);
//             delay += str.length;
//         } else {
//             var $node = $(node);
//             if ($node.is(':visible')) {
//                 $(node).contents().each(function (index) {
//                     delay = recurse(this, delay);
//                 });
//             }
//         }
//         return delay;
//     }
//     this.each(function () {
//         // Start with the specified node with delay = 0
//         recurse(this, 0);
//     });
//     return this;
// };
