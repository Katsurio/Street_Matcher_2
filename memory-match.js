/**
 * Created by Katsurio on 10/8/16.
 */
var _1stCardClicked = null,
    _2ndCardClicked = null,
    totalPossibleMatches = 9,
    matchCounter = 0,
    matches = 0,
    attempts = 0,
    accuracy = 0,
    gamesPlayed = 0,
    frontOfCardImages = ["images/bison.jpg", "images/bison.jpg", "images/chunli.jpg", "images/chunli.jpg", "images/vega.jpg", "images/vega.jpg", "images/ryu.jpg", "images/ryu.jpg", "images/ken.jpg", "images/ken.jpg", "images/guile.jpg", "images/guile.jpg", "images/blanka.jpg", "images/blanka.jpg", "images/dhalsim.jpg", "images/dhalsim.jpg", "images/sagat.jpg", "images/sagat.jpg"];

/** @function - Function that shuffles the cards' images.
 * @name shuffleCards
 * @param {String[]} cardFaceImgs - An array of strings that contain the paths to the card faces' images.
 */
function shuffleCards(cardFaceImgs)
{
    var randomIndex,
        randomImg,
        i;

    for (i = cardFaceImgs.length; i >= 0; i--)
    {
        randomIndex = Math.floor(Math.random() * i);
        randomImg = cardFaceImgs.splice(randomIndex, 1);

        $('.card-container').append($('<div class="card"></div>'));
        $('.card:last').append($('<div class="front"></div>'), $('<div class="back"></div>'));
        $('.front:last').append($('<img src=' + randomImg + '>'));
        $('.back:last').append($('<img src="images/NEW-streetfighter2_card_back.jpg">'));
    }
}

/** @function - Calculates/displays players stats(games played, attempts, and accuracy)..
 * @name displayStats
 */
function displayStats()
{
    accuracy = (matches / attempts) * 100;
    $('.games-played .value').text(gamesPlayed);
    $('.attempts .value').text(attempts);
    $('.accuracy .value').text(accuracy.toFixed()); // cut (+ '%') for looks
}

/** @function - Resets the players stats upon "Reset" button click.
 * @name resetStats
 */
function resetStats()
{
    accuracy = 0;
    matches = 0;
    attempts = 0;
    matchCounter = 0;
    displayStats();
}

/** @function - Resets game cards to their original starting positions.
 * @name resetCards
 */
function resetCards()
{
    $('.winner').remove();
    $(_1stCardClicked).removeClass('clicked');
    $(_2ndCardClicked).removeClass('clicked');
    _1stCardClicked = null;
    _2ndCardClicked = null;
    $('.card').removeClass('clicked').click(cardClicked);
}

/** @function - Function that checks whether the card clicked is the 1st or 2nd card clicked. If it's the 2nd card clicked, the function then checks whether or not there's a match (increment match counter) or a mismatch (mismatch timeout) and updates the player's stats accordingly.
 * @name cardClicked
 */
function cardClicked()
{
    if ($(this).hasClass('clicked'))
    {
        return;
    }
    $(this).find(".back").hide();

    if (_1stCardClicked === null)
    {
        _1stCardClicked = $(this).addClass('clicked');
    }
    else
    {
        _2ndCardClicked = $(this).addClass('clicked');

        if ($(_1stCardClicked).find('.front img').attr('src') == $(_2ndCardClicked).find('.front img').attr('src'))
        {
            ++matchCounter;
            ++matches;
            ++attempts;
            _1stCardClicked = null;
            _2ndCardClicked = null;
            displayStats();

            if (matchCounter === totalPossibleMatches)
            {
                $('.main-content').append('<img class="winner" src="images/you-win.png">');
            }
            return false;
        }
        else
        {
            $('.card').off();
            ++attempts;
            function _2CardsMismatchTimeout()
            {
                $(_1stCardClicked).removeClass('clicked').find(".back").show();
                $(_2ndCardClicked).removeClass('clicked').find(".back").show();
                _1stCardClicked = null;
                _2ndCardClicked = null;
                $('.card').click(cardClicked);
            }
            setTimeout(_2CardsMismatchTimeout, 2000);
            displayStats();
        }
    }
    displayStats();
}

function applyClickHandlers()
{
    shuffleCards(frontOfCardImages);
    displayStats();
    $('.card').click(cardClicked);
    $('.reset').click(function()
    {
        gamesPlayed++;
        resetStats();
        displayStats();
        resetCards();
        $('.card').find('.back').show();
    })
}

$(document).ready(applyClickHandlers);