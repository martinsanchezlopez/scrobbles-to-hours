//let userName = "";
let totalTime = 0;
let error = false;
let userName = null;
let queryBlock = false;

let albumJson = null;

let reportArray = [];
let reportCSV = '';

//ljsdkajldsalsdaj TODO parseint pr heures, rajouter heures for track, check bug avec shrines of paralysis, implement album tout //court 

function customReport(){
    $('#error').empty();
    $('#result').empty();
    error =false;
    queryBlock = false;
    let reportArray = [];


    userName = encodeURIComponent(document.getElementById("userNameInput").value);
    userName.replace(" ", "+");
    let artist = encodeURIComponent(document.getElementById("artistInput").value);
    artist.replace(" ", "+");
    let name = encodeURIComponent(document.getElementById("taInput").value);
    name.replace(" ", "+");
        
    if (userName != "" && artist != "" && userName != "" ){
        $("#result").empty(); 
        $('#result').append("<hr>");
        if(getSelectedValue("queryOption") == "track"){
            getTrackLT(userName, artist, name);
        }
        else if(getSelectedValue("queryOption") == "album"){
            getAlbumLT(userName, artist, name, -1);
        }
        else{
            var json = '{"message":"Please select a mode"}';
            throwError(JSON.parse(json));
        }
    }
    else{
        var json = '{"message" : "Please fill all fields"}';
        throwError(JSON.parse(json));
    }
    
    $(document).ajaxStop(function (){
       getResultTable(); 
    });
}

function topReport(){
    $('#error').empty();
    $('#result').empty();
    error =false;
    queryBlock = false;
    let reportArray = [];

    
    userName = encodeURIComponent(document.getElementById("userNameInput").value);
    userName.replace(" ", "+");
    
    let queryMode = getSelectedValue("topQueryOption");
    
    $.getJSON("https://ws.audioscrobbler.com/2.0/?method=user.gettop" + queryMode +  "&user=" + userName + "&api_key=7f18ca9d34c83965fff9d9ff7f81a740" + "&limit=" + getSelectedValue("topQueryEntries") + "&period="+ getSelectedValue("topQueryPeriod") + "&format=json", function(json){
        
            topToHour(json, queryMode);
        });
    
    $(document).ajaxStop(function (){
       getResultTable(); 
    });

}


function topToHour(json, topMethodOption){
    if(topMethodOption == "tracks"){
        $.each(json.toptracks.track, function(i, item){
            getPlayTime(item, true);
        });
    }
    else{
        $.each(json.topalbums.album, function(i, item){
            getAlbumLT(userName, item.artist.name, item.name, item.playcount, item["@attr"].rank);
        });
    }
        
    $(document).ajaxStop(function () {
        //Thought I'd need this cause when testing prior I'd get the albums in the wrong orders depending on the which query finished first. I'll leave it just in case.
        reportArray.sort( (a,b) => {
            return a.rank - b.rank;   
        }); 
        console.log(reportArray);

    });
}



function throwError(json){
        $('#error').append("<h1> ERROR : " + json.message + " </h1>");
        error = true;
}

        
        
function getAlbumLT(user, artist, album, userGetTopPlaycount, rank){ //playcount -1 if the funciton is not called for the user.gettopalbums
    let albumDuration = 0;
    var totalTimeHtml = '';
    $.getJSON("https://ws.audioscrobbler.com/2.0/?method=album.getInfo&user="+ user + "&api_key=7f18ca9d34c83965fff9d9ff7f81a740&limit=10&artist=" + artist + "&album=" + album + "&format=json&autocorrect=1", function(json) {
        if(json.error != undefined){
            throwError(json);
            return;
        }
        
        let jsonTracks = json.album.tracks.track;
        for(i=0; i<jsonTracks.length; i++){
            albumDuration += parseInt(jsonTracks[i].duration);
        }
        albumJson = json; // for use if user chooses in depth count
        
        let userPlayCount;
        if (userGetTopPlaycount == -1){
            userPlayCount = json.album.userplaycount;
        }
        else{
            userPlayCount = userGetTopPlaycount;
        }
        
        let minutePlayTime = parseInt( (albumDuration*parseInt(userPlayCount) )/(jsonTracks.length*60) );
        //let hourPlayTime = (minutePlayTime/60).toFixed(2);
        reportArray.push(constructObject(artist, album, userPlayCount, minutePlayTime, rank));
        
        
        //$(document).ajaxStop(function () {
            if(!error){
                /*let userPlayCount;
                if (userGetTopPlaycount == -1){
                    userPlayCount = json.album.userplaycount;
                }
                else{
                    userPlayCount = userGetTopPlaycount;
                }
                
                let minutePlayTime = (albumDuration*parseInt(userPlayCount) )/(jsonTracks.length*60);
                let hourPlayTime = minutePlayTime/60;*/
                
                //totalTimeHtml = "<h3> You listened to " + album.replace("+", " ") + " a total of " + parseInt( minutePlayTime) + " minutes or " + parseInt(hourPlayTime) + " hours! </h3>";
                //$('#result').append(totalTimeHtml);

                if(userGetTopPlaycount == -1){
                    var depthOption = '';
                    depthOption += '<br> <a id="aDepth" onclick="getAlbumLTInDepth(albumJson);">In depth time count</a><div id="invis">This will give you a more accurate time, specially if you scrobbles are not equitably distributed among the tracks of the album. (This method is also more prone to error depending on if the metadata of the file you played/streamed matches the one last.fm.)</div> '; 
                    $('#depth').append(depthOption);
                }
                    
            }
        //});
        
            
    }); // end OF JSON FUNCTION
}
       
       
function getAlbumLTInDepth(json){
    if(!queryBlock){
        $('#depth').empty();
        $('#result').empty();
        totalTime = 0;
        let tracks = [];
        let jsonTracks = json.album.tracks.track;
        for(i=0; i<jsonTracks.length; i++){
            tracks.push(encodeURIComponent (jsonTracks[jsonTracks.length - 1 - i].name) );
        }
        for(i=0; i<jsonTracks.length; i++){
        getTrackLT(userName, json.album.artist, tracks[i]);
        }

        $(document).ajaxStop(function () {
            if(!error){
                
                /*
                let depthTimeHtml = '';
                depthTimeHtml = "<h3> You listened to " + json.album.name + " a total of " + parseInt( totalTime) + " minutes or " + totalTime/60 + " hours! </h3>";
                $('#depth').append(depthTimeHtml);*/
                queryBlock = true;
            }
        });
    }
}
        
function getTrackLT(user, artist, track){
        $.getJSON("https://ws.audioscrobbler.com/2.0/?method=track.getInfo&user="+ user + "&api_key=7f18ca9d34c83965fff9d9ff7f81a740&limit=10&artist=" + artist + "&track=" + track + "&format=json&autocorrect=1", function(json) {
            if(json.error != undefined){
            throwError(json);
            return;
            }
            getPlayTime(json.track, false);
        });
        
}


/*
 * Calculates and displays the play time of a track
 * trackJson : json of the track to calculate
 * jsonFromTop : true if the json is the json from user.getTopTracks, false if from track.getInfo
 */
function getPlayTime(trackJson, jsonFromTop){
    var html = '';
    let name = trackJson.name;
    let duration = trackJson.duration; 
    let playcount = 0;
    let time = 0;
    let rank = null;   
    
    if(jsonFromTop){ //because the json from the track.getInfo and user.gettoptracks is not the same ...
        playcount  = parseInt(trackJson.playcount);
        time = (duration*playcount)/60;
        let rank = trackJson["@attr"].rank;
        reportArray.push(constructObject(trackJson.artist.name, name, playcount, time, rank));
    }
    else{
        playcount = trackJson.userplaycount;
        time = (duration*playcount)/60000;
        reportArray.push(constructObject(trackJson.artist.name, name, playcount, time));

    }
    //totalTime+= time;
    //html += constructResult(trackJson.artist.name, name, playcount, time );
    //$('#result').append(html);
    
}

/*function constructObject(artist, name, pC, time){ //pC for playcount
    let timeHour = time/60;
    
    var object = {
      artist: artist,
      title: name,
      playcount: pC,
      playtimeMinute: time,
      playtimeHour: timeHour.toFixed(2)
    };
    
    return object;
}*/

function constructObject(artist, name, pC, time, rank){ //pC for playcount
    let timeHour = time/60;
    let object = {};
    
    if(rank != undefined){
        object.rank = rank;
    }
    /*
    var object = {
      artist: artist,
      title: name,
      playcount: pC,
      playtimeMinute: time,
      playtimeHour: timeHour.toFixed(1)
    };*/
    
    object.artist = artist;
    object.name = name;
    object.playcount= pC;
    object.playcountMinute= time;
    object.playcountHour= timeHour.toFixed(1);


    return object;
}

function constructResult(artist, name, playcount, time){
            return ("<p>" + artist+ " - " + name + " - " + "Scrobbles : " + playcount + " Time listened : " + time + " minutes or " + parseInt(time/60) + " hours! </p>");
}

//function getInputValue() {
        // Selecting the input element and get its value 
      //  userName = document.getElementById("userNameInput").value;
  //    }
