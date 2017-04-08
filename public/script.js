var backgrounds =["vnFlag.png","halong.jpg","code.jpg","code2.jpg", "league.jpg", "piano.jpg","sing.jpg  ","brokenheart.png", "love2.jpg", "candle.jpg", "stars.jpg"];
var texts = ["HI, I'M TRI CAO", "I'M FROM VIET NAM",
             "MY COUNTRY IS BEAUTIFUL", "THIS IS HA LONG BAY",
             "I LIKE COMPUTER SCIENCE", "CODING IS VERY FUN",
             "ALGORITHMS ARE ALSO INTERESTING", "BUT THEY ARE VERY HARD",
             "I PLAY LEAGUE OF LEGENDS AFTER WORK", "ONLY AFTER WORK I PROMISE...",
             "I LOVE MUSIC", "I WILL LEARN SOME INSTRUMENTS SOON",
             "I LOVE TO SING AS WELL", "I USUALLY SING IN VIETNAMESE SHOWS",
             "BUT...", "THERE IS ONLY ONE PERSON...",
             "THAT I LIKE TO SING FOR HER OVERNIGHT...", "JUST LIKE I CAN CODE OVERNIGHT...",
             "WITH OUT FEELING BORED!!!"];
$(function(){
    // startAgain();
    changeBackground(0);
    typeQuote(0);
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
        time += 100;
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

    }, 100);
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
