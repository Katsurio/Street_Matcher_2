/**
 * Created by Katsurio on 10/8/16.
 */

/** @function - Function that
 * @name
 * @param {}  -
 * @return {} - Returns
 */

var first_card_clicked = null,
    second_card_clicked = null,
    total_possible_matches = 9,
    match_counter = 0,
    matches = 0,
    attempts = 0,
    accuracy = 0,
    games_played = 0;

function display_stats() {
    accuracy = (matches / attempts) * 100;
    $('.games-played .value').text(games_played);
    $('.attempts .value').text(attempts);
    $('.accuracy .value').text(accuracy.toFixed()); // cut (+ '%') for looks
}

function reset_stats() {
    accuracy = 0;
    matches = 0;
    attempts = 0;
    match_counter = 0;
    display_stats();
}

function reset_cards() {
    $('.winner').remove();
    $(first_card_clicked).removeClass('clicked');
    $(second_card_clicked).removeClass('clicked');
    first_card_clicked = null;
    second_card_clicked = null;
    $('.card').removeClass('clicked').click(card_clicked);
}
function card_clicked() {
    if($(this).hasClass('clicked')) {
        return;
    }
    $(this).find(".back").hide();
    if (first_card_clicked === null) {
        first_card_clicked = $(this).addClass('clicked');
    } else {
        second_card_clicked = $(this).addClass('clicked');
        if($(first_card_clicked).find('.front img').attr('src') == $(second_card_clicked).find('.front img').attr('src')) {
            ++match_counter;
            ++matches;
            ++attempts;
            first_card_clicked = null;
            second_card_clicked = null;
            display_stats();
            if(match_counter === total_possible_matches) {
                $('.main-content').append('<img class="winner" src="images/you-win.png">');
            }
            return false;
        } else {
            $('.card').off();
            ++attempts;
            function two_cards_mismatch_timeout() {
                $(first_card_clicked).removeClass('clicked').find(".back").show();
                $(second_card_clicked).removeClass('clicked').find(".back").show();
                first_card_clicked = null;
                second_card_clicked = null;
                $('.card').click(card_clicked);
            }
            setTimeout(two_cards_mismatch_timeout, 2000);
            display_stats();
        }
    }
    display_stats();
}

function apply_click_handlers(){
    display_stats();
    $('.card').click(card_clicked);
    $('.reset').click(function() {
        games_played++;
        reset_stats();
        display_stats();
        reset_cards();
        $('.card').find('.back').show();
    })
}
$(document).ready(apply_click_handlers);