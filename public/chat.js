var backgrounds =["vnFlag.png","halong.jpg","code.jpg","code2.jpg", "league.jpg", "piano.jpg","sing.jpg  ","brokenheart.png", "love2.jpg", "candle.jpg", "stars.jpg"];

$(function(){
    var bg = $("body");
    bg.css({
        'background-image': "linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)), url('./backgrounds/"+ backgrounds[parseInt(Math.random()*10)]+"')",
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
    var username = getCookie("username");
    var socket = io(); //connect to the server that sent this page

    //On connect event, this will emit intro event to the server
    socket.on('connect', function(){
        socket.emit("intro", username);
    });

    //Get userList from the server
    socket.on('userList', (data)=>{
        $('#roomList ul').html("");
        //Populate the userList on the "ul" element of the page
        for (var i in data.users) {
            var ele = $("<li class='user'>"+data.users[i]+"</li>");
            $('#roomList ul').append(ele);
        }
    });



    // Handle input event to send message in the main chat box
    $('#input textarea').keypress(function(ev){
            if(ev.which===13){
                //send message
                if ($(this).val() !==""){
                    socket.emit("message",$(this).val());
                    ev.preventDefault(); //if any
                    $("#chatLog textarea").append((new Date()).toLocaleTimeString()+", "+username+": "+$(this).val()+"\n")
                    $(this).val(""); //empty the input
                }
            }
    });

    //On receiving message event from other users in the main chat box
    socket.on("message",function(data){
        $("#chatLog textarea").append(data+"\n");
        $('#chatLog textarea')[0].scrollTop=$('#chatLog')[0].scrollHeight; //scroll to the bottom
    });
});

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
