
var api = 'https://opentdb.com/api.php?amount=25&difficulty=easy&type=multiple';
// var api = 'https://opentdb.com/api.php?amount=25&category=9&difficulty=easy&type=multiple';
$(document).ready(function() {

// Colors for background
  var colors = new Array(
    [62,35,255],
    [60,255,60],
    [255,35,98],
    [45,175,230],
    [255,0,255],
    [255,128,0]);

  var step = 0;
  //color table indices for:
  // current color left
  // next color left
  // current color right
  // next color right
  var colorIndices = [0,1,2,3];

  //transition speed
  var gradientSpeed = 0.010;

  function updateGradient()
  {

    if ( $===undefined ) return;

  var c0_0 = colors[colorIndices[0]];
  var c0_1 = colors[colorIndices[1]];
  var c1_0 = colors[colorIndices[2]];
  var c1_1 = colors[colorIndices[3]];

  var istep = 1 - step;
  var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
  var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
  var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
  var color1 = "rgb("+r1+","+g1+","+b1+")";

  var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
  var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
  var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
  var color2 = "rgb("+r2+","+g2+","+b2+")";

   $body.css({
     background: "-webkit-gradient(linear, left top, right top, from("+color1+"), to("+color2+"))"}).css({
      background: "-moz-linear-gradient(left, "+color1+" 0%, "+color2+" 100%)"});

    step += gradientSpeed;
    if ( step >= 1 )
    {
      step %= 1;
      colorIndices[0] = colorIndices[1];
      colorIndices[2] = colorIndices[3];

      //pick two new target color indices
      //do not pick the same as the current one
      colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
      colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;

    }
  }

  setInterval(updateGradient,10);






  var $body = $('body');
  var count = 0;
  var userScore = 0;
  var min = 4;
  var sec = 60;
  var i = 0;
  var outOf = 1;

  // Appending divs to body for structure of game
  $body.append('<div id="Nope"><h3 id="wrong"> Not This Time! </h3></div>');
  $nope = $('#Nope');
  $body.append('<div id="title"><h1 id="gameName"> Framework Trivia</h1></div>');
  $title = $('#title');
  $title.append('<div id="score">' + "Score : "+ userScore + '</div>');
  var $userScore = $('#score');
  $title.append('<div id="timer">' + min +" : " + sec + '</div>');
  var $timer = $('#timer');
  $title.append('<div id="outOf">' + "Question : " + outOf + "/25" + '</div>');
  $outOf = $('#outOf');
  var $box = $('<div></div>').attr('id', 'box');
  $body.append($box);
  $body.append('<div id="Correct"><h3 id="right"> Right On!</h3></div>');
  $correct = $('#Correct');



//Game timer
    var timer = setInterval(function(){
        $timer.text(min + " : " + sec--);
        if (sec === 0) {
          if (sec === 0 && min === 0) {
            alert('GAME OVER');
            window.clearInterval(timer);
          } else {
            min--;
            sec = 60;
          }
         }
        },1000);

//Jquery to access the api
  $.get(api).
    done(function(data) {
      console.log(data.results);
      console.log(data.results[i].correct_answer);
      var contentArray = data.results;
      update(contentArray);
    }).
    fail(function(error) {
      console.log(error);
    });

// Function for shuffling the answers
  function shuffleAnswers(correct, incorrectArr) {
      incorrectArr.push(correct);
      for (var i = incorrectArr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = incorrectArr[i];
        incorrectArr[i] = incorrectArr[j];
        incorrectArr[j] = temp;
    }
    return incorrectArr;

 }


  function appendCategory( $category, category) {
    $category.append('<p class="cat">' + category + '</p>');
  }

  function appendQuestion( $questions, question) {
    $questions.append('<p class="quest">' + question + '</p>');
  }

  function appendAnswers( $anList, answer) {
    $anList.append('<label id="label' + count++ + '"><input class="answer" type="radio">' + answer + '</label>');
  }

  function update(data) {
    if (outOf === 26) {
      $('#gameName').text('GAME OVER');
      window.clearInterval(timer);
      $outOf.text("Question : 25/25");

      console.log($final);
      var $final = $('<div>' + 'You Scored ' + userScore + ' = ' + allDone(userScore) + '</div>').attr('class', 'final');

      $box.append($final);
    } else {


    var $category = $('<div></div>').attr('class', 'category');
    var $questions = $('<div></div>').attr('class', 'questions');
    var $answers = $('<div></div>').attr('class', 'answers');
    var $anList = $('<form></form').attr({ class :'answerList'});
    appendCategory( $category, data[i].category);
    appendQuestion($questions, data[i].question);
    var answers = shuffleAnswers(data[i].correct_answer, data[i].incorrect_answers);
    // $.each(answers, appendAnswers);
    for (var k = 0; k < answers.length; k++) {
      appendAnswers($anList, answers[k]);
    }
    $answers.append($anList);
    $box.append($category, $questions, $answers);
    $('.answer').click(function(event) {

      checkAndContinue(i, data, event.target);
    });
   }
  }

  function checkAndContinue(index, data, clicked) {
    var $clicked = $(clicked);
    if (data[index].correct_answer === $clicked.parent().text()) {
      var updatedScore = userScore += 1;
      $userScore.text("Score : "+ userScore);
      console.log(userScore);
      $correct.append('<p class="pop"> Ka-Pow!&#10003</p>');
    } else {
      $nope.append('<p class="pop"> Nope!&times</p>');
    }
    i++;
    console.log("outof :" + outOf);
    outOf++;
    console.log("outof after ++ :" + outOf);

    $outOf.text("Question : " + outOf + "/25");
    $box.empty();
    update(data);
  }


  function allDone(score) {
    // var $final = $('<div>' + 'You Scored ' + userScore + ' = ' + allDone(userScore) + '</div>').attr('class', 'final');

    if (score === 25) return "FLAWLESS VICTORY";
    else if (score >= 20) return "YOUR PRO";
    else if (score >= 15) return "NICE JOB";
    else if (score >= 10) return "STUDY UP";
    else return "FAIL";
    

  }









});
