var backgrounds =["vnFlag.png","Carleton.jpg","code.jpg","Algorithm.jpg", "league.jpg", "piano.jpg","sing.jpg  ","brokenheart.png", "love2.jpg", "candle.jpg", "stars.jpg"];
var texts = ["HI, I'M TRI CAO", "I COME FROM VIET NAM",
             "I'M SECOND YEAR STUDENT IN CARLETON U", "I AM ALSO A TEACHING ASSISTANT",
             "I LIKE COMPUTER SCIENCE", "OBJECT ORIENTED PROGRAMMING AND WEB ARE MY STRENGTH",
             "I LIKE ALGORITHMS AND DATA STRUCTURES", "I AM DOING A RESEARCH ON RANGE SEARCHING",
             "I AM ALWAYS EAGER TO CHALLENGE MYSELF", "I CAN QUICKLY ADAPT TO NEW TECHNOLOGIES",
             "AZURE, SQL, ANGULAR...", "ARE SOME OF WHAT I AM LEARNING THESE DAYS",
             "AT NIGHT, I SING TO MAKE SOME MONEY TOO", "I USUALLY SING IN VIETNAMESE SHOWS",
             "I AM FLEXIBLE, PROACTIVE AND SMART", "AND I WILL NEVER STOP IMPROVING",
             "LIFE IS LEARNING", "AND I ENJOY LEARNING ABOUT TECHNOLOGIES",
             "IT'S ABOUT ME, 'TREEE' CAO"];
$(function(){
    // startAgain();
    changeBackground(0);
    typeQuote(0);

    // handle submitted feedbacks
    var form = $('#form2');
    form.submit(function(e){
        // Prevent default functionality
        e.preventDefault();
        //
        $.post('/feedback', $(this).serialize(), function(data){
            $('#popUps').append($("<h4 id='delete'>Thank you "+data.name+"! <br>Your message was sent </h4>"));
        }, 'json');
    });

    // handle login press
    $('#in').click(function(){
        $('#loginTable').toggle();
        $('#warning').remove();
    });

    // hangle chat press
    $('#chat').click(function(){
        window.location.replace("https://frozen-falls-39454.herokuapp.com/chat")
    });
    $('#main').click(function(){
        window.location.replace("https://frozen-falls-39454.herokuapp.com/")
    });

    $('#resume').click(function(){
        var win = window.open("https://drive.google.com/file/d/0B8snwWQWjzVmX2QzMEJUMUJyaFk/view?usp=sharing", '_blank');
        win.focus();
    });
});


function changeBackground(i){
    var bg = $("#bg");
    bg.css({
        'background-image': "linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)), url('./backgrounds/"+ backgrounds[i]+"')",
    });
    bg.fadeIn(1000, function(){
        setTimeout(function(){
            bg.fadeOut(1000, function(){
                i = i+1;
                if(i=== backgrounds.length){
                    bg.css({
                        'background-image': "linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)), url('./backgrounds/"+ backgrounds[3]+"')",
                    });
                    bg.fadeIn(1000);
                } else{
                    changeBackground(i);
                }
            });
        }, 6000);
    });

}

function typeQuote(i){
    var quote = $("<p class='text'></p>").appendTo($('#intro'));
    quote.empty();
    var display = "";
    var index = 0;
    var time = 0;
    quote.text(display+"_");
    var animation = setInterval(function(){
        time += 70;
        display += texts[i].charAt(index);
        quote.text(display+"_");
        if(index< texts[i].length)
            index++;
        else{
            clearInterval(animation);
            if(i< texts.length-1){
                quote.fadeOut(4000-time, function(){
                    $(this).remove();
                    typeQuote(++i);
                });
            } else {
                quote.fadeOut(16000-time, function(){
                    $(this).remove();
                    startAgain();
                });
            }

        }

    }, 70);
}

function startAgain(){
    var button = $("<div id='restart'></div>").appendTo($("#intro"));
    var bg = $("#bg");
    button.text("Restart");
    button.animate({"opacity": 1}, 1000);
    button.click(function(){
        button.fadeOut(1000, function(){
            button.remove();
        });
        bg.fadeOut(1000, function(){
            changeBackground(0);
            typeQuote(0);
        });
    });
}
