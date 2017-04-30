/**
 * Created by Katsurio on 10/8/16.
 */
var _1stCardClicked = null,
    _2ndCardClicked = null,
    totalPossibleMatches = 1, //TODO: CHANGE THIS BACK TO: 9
    matchCounter = 0,
    matches = 0,
    attempts = 0,
    accuracy = 0,
    gamesPlayed = 1,
    backOCard = "images/NEW-streetfighter2_card_back.jpg",
    stageMusic = document.getElementById("stageAudio"),
    stageTrack = new Audio('audio/stage-e-honda.mp3'),
    announcerYou = new Audio('audio/announcer-you.wav'),
    announcerWin = new Audio('audio/announcer-win.wav'),
    audioCheck = true,
    frontOCardImages =
        [
            "images/bison.jpg", "images/bison.jpg", "images/chunli.jpg", "images/chunli.jpg", "images/vega.jpg", "images/vega.jpg", "images/ryu.jpg", "images/ryu.jpg", "images/ken.jpg", "images/ken.jpg", "images/guile.jpg", "images/guile.jpg", "images/blanka.jpg", "images/blanka.jpg", "images/dhalsim.jpg", "images/dhalsim.jpg", "images/sagat.jpg", "images/sagat.jpg"
        ],
    audioTracks =
        ['audio/stage-balrog.mp3', 'audio/stage-blanka.mp3', 'audio/stage-chun-li.mp3', 'audio/stage-dhalsim.mp3', 'audio/stage-e-honda.mp3', 'audio/stage-guile.mp3', 'audio/stage-ken.mp3', 'audio/stage-m-bision.mp3', 'audio/stage-ryu.mp3', 'audio/stage-sagat.mp3', 'audio/stage-vega.mp3', 'audio/stage-zangief.mp3'
        ];


function playAudio ()
{
    if (audioCheck)
    {
        stageTrack.pause();
        $('#playPause').toggleClass('playAudioClass pauseAudioClass');
        audioCheck = false;
    }
    else
    {
        stageTrack.play();
        $('#playPause').toggleClass('pauseAudioClass playAudioClass');
        audioCheck = true;
    }
}

/** @function - Function that shuffles the cards' images.
 * @name shuffleCards
 * @param {String} cardBackImg - A strings that contains the path to the cards' back image.
 * @param {String[]} cardFaceImgs - An array of strings that contain the paths to the card faces' images.
 */
function shuffleCards(cardBackImg, cardFaceImgs)
{
    var randomIndex,
        randomImg,
        i,
        newCardImgArr = cardFaceImgs.slice(0);

    for (i = 2; i > 0; i--) //TODO: CHANGE THIS BACK TO: i = cardFaceImgs.length
    {
        randomIndex = Math.floor(Math.random() * i);
        randomImg = newCardImgArr.splice(randomIndex, 1);

        $('.card-container').append(
            $('<div class="card"></div>'));
        $('.card:last').append(
            $('<div class="front"></div>'), $('<div class="back"></div>'));
        $('.front:last').append(
            $('<img src=' + randomImg + '>'));
        $('.back:last').append(
            $('<img src=' + cardBackImg + '>'));
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
    if (Number.isNaN(accuracy))
    {
        $('.accuracy .value').text("0");
    }
    else
    {
        $('.accuracy .value').text(accuracy.toFixed()); // cut (+ '%') for looks
    }
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
    $('.card').off();
    $('.winner').remove();
    _1stCardClicked = null;
    _2ndCardClicked = null;
    $('.card-container').empty();
    shuffleCards(backOCard, frontOCardImages);
    setTimeout(function()
    {
        $('.card').click(cardClicked);
    }, 1000); //Original val=2000 but might be too long
}

/** @function - Function that checks whether the card clicked is the 1st or 2nd card clicked. If it's the 2nd card clicked, the function then checks whether or not there's a match (increment match counter) or a mismatch (mismatch timeout) and updates the player's stats accordingly.
 * @name cardClicked
 */
function cardClicked()
{
    console.warn("Clicked");
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
                stageTrack.pause();
                stageTrack.currentTime = 0;
                $('#playPause').toggleClass('playAudioClass pauseAudioClass');
                audioCheck = false;
                $('.main-content').append('<img class="winner" src="images/you-win.png">');
                announcerSpeak("announcer-you.wav", "announcer-win.wav", function ()
                {
                    fighterSpeak("fight-voice-hahahaha-girl.wav", "fight-voice-victory-yatta.wav", 1200);
                })
            }
            else
            {
            return false;
            }
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
            displayStats();
            setTimeout(_2CardsMismatchTimeout, 1000); //Original val=2000
        }
    }
    displayStats();
}

function fighterSpeak (say1, say2, timeBetweenWords)
{
    if (say2 === undefined && timeBetweenWords === undefined)
    {
        var fighterSay = new Audio("audio/" + say1),
            fighterSayNext = 0,
            timeBetweenWords = 0;
        fighterSay.play();
    }
    else
    {
        var fighterSay = new Audio("audio/" + say1),
            fighterSayNext = new Audio("audio/" + say2);
        fighterSay.play();
        setTimeout(function()
        {
            fighterSayNext.play();
        }, timeBetweenWords);
    }
}

function announcerSpeak (speech1, speech2, callback)
{
    var announcerSay = new Audio("audio/" + speech1),
        announcerSayNext = new Audio("audio/" + speech2);
    announcerSay.play();
    setTimeout(function()
    {
        announcerSayNext.play();
    }, 500);
    if (callback !== undefined)
    {
        setTimeout(function()
        {
            callback();
        }, 500);
    } else
        {

        }

}

function applyClickHandlers()
{
    stageTrack.play();
    fighterSpeak("announcer-round.wav", "announcer-" + gamesPlayed + ".wav", 800);
    setTimeout(function() {
        fighterSpeak("announcer-fight.wav");
    }, 1500);
    shuffleCards(backOCard, frontOCardImages);
    displayStats();
    $('.card').click(cardClicked);
    $('.reset').click(function()
    {
        gamesPlayed++;
        resetStats();
        displayStats();
        resetCards();
        stageTrack.play();
        $('#playPause').toggleClass('pauseAudioClass playAudioClass');
        audioCheck = true;
        fighterSpeak("announcer-round.wav", "announcer-" + gamesPlayed + ".wav", 800);
        setTimeout(function() {
            fighterSpeak("announcer-fight.wav");
        }, 1500);
    });
    $('#playPause').click(playAudio);
}

$(document).ready(applyClickHandlers);