// URL of the django API server
var API_url = 'http://127.0.0.1:8000/meme/';
//List for storing all generated memes
var memesList = new Array();
/*
Array.prototype.last = function() {
    return this[this.length-1];
}*/

//Variable to store the index of previous meme
var previousIndex = -1;
//Variable to store previous meme for last meme option
var previousMeme;
//Variable to store random value for getting random meme
var randomNumber;

/*
jQuery_methods = {
    GetRandomNumber: function(){
        //returning random integer
        return Math.floor(Math.random() * Math.floor(1000));
    },
    GetPreviousMeme: function(){
        var meme;
        //console.log(previousIndex);
        if(previousIndex <= 0){
            meme = null;
        }else{
            meme = memesList[previousIndex-1];
        }
        return meme;
    }
}
*/

function GetRandomNumber(){
    //returning random integer
    return Math.floor(Math.random() * Math.floor(1000));
}
function GetPreviousMeme(){
        var meme;

        //if we are at the end of generated meme's array
        if(previousIndex <= 0){
            //there is nothing to show
            meme = null;
        }else{
            meme = memesList[previousIndex-1];
        }
        return meme;
}
function CheckMeme(src) {
    return $("<img>").attr('src', src);
}
function DisplayMemeData(meme){
    $("#meme-box").html(
        "<h3>" + meme[0] + "</h3>" +
        "<span>" + "Rank: " + meme[1] + "</span>" +
        "<img src=\"" + meme[2] + "\">"
    );
}
function AddMemeToHistory(meme){
    $("#memelist").append(
        "<div class=\"col-sm animated\">" +
        "<span>" + "Rank: " + meme[1] + "</span>" +
        "<img src=\"" + meme[2] + "\">"
        + "</div>"
    );
}
function GetMeme(){
    //Getting random number to use it in request
    randomNumber = GetRandomNumber();
    //Making request to Django server
    $.ajax({
        url: API_url + randomNumber + '/',
        contentType: 'application/json',
        method: 'GET',
        //Case request was successful
        success: function(response, status){
            //Parsing data from request response
            var ParsedObject = JSON.parse(response);

            //if code is 200, OK
            if(ParsedObject.code == 200){
                
                //Checking if meme image url is valid and 
                //client is able to load the image
                CheckMeme(ParsedObject.data.image)
                //Case error
                .on("error", function(e) {
                    //console.log(e.type,this.src)
                    //Calling GetMeme() recursively
                    GetMeme();
                })
                //Case image url is valid
                .on("load", function(e) {
                    //Clearing error message in page in case it was displayed
                    $("#mess").html("");
                    //Assigning data to object variable
                    var meme = [ParsedObject.data.name, ParsedObject.data.rank, ParsedObject.data.image];
                    //Adding data to memeList
                    memesList.push(meme);
                    //Setting previous meme id
                    previousIndex = memesList.length-1;
                    //Displaying generated meme data
                    DisplayMemeData(meme);
                    //Adding generated meme data to the history
                    AddMemeToHistory(meme);
                });
            }
            //Re-running method again
            else{
                //Calling GetMeme() recursively
                GetMeme();
            }
        },
        //Case request was not successful
        error: function (err) {
            console.log("error");
            console.log(err);
        }
    });
}
$(function() {
    //Get random meme from server
    $('#GenerateRandomMeme').on('click', function(){
        GetMeme();
    });
    
    //Get previous meme
    $('#PreviousMeme').on('click', function(){
        //Getting previous meme
        previousMeme = GetPreviousMeme();
        //Re-setting previous meme id
        previousIndex -= 1;
        //Checking if user reached the end of generated memes list
        if(previousMeme == null){
            //console.log('One of Us is lost? There is no previous memes!');
            //Displaying message
            $("#mess").html("One of Us is lost? There is no previously generated memes!");
            //Displaying last object of generated meme list
            DisplayMemeData(memesList[0]);
        }
        //Case user didn't reached the end of generated memes list
        else{
            //console.log(previousMeme);
            //Displaying previous meme
            DisplayMemeData(previousMeme);
        }
    });
});