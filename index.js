//let userName = "";

console.log();
let totalTime = 0;
let error = false;


function s2h(){
        $('#error').empty();
        let userName = document.getElementById("userNameInput").value;
        userName.replace(" ", "+");
        let artist = document.getElementById("artistInput").value;
        artist.replace(" ", "+");
        let name = document.getElementById("taInput").value;
        name.replace(" ", "+");
            
        if (userName != "" && artist != "" && userName != "" ){
            $("#result").empty(); 
            $('#result').append("<hr>");
            if(getSelectedValue("queryOption") == "track"){
                getTrackLT(userName, artist, name);
            }
            if(getSelectedValue("queryOption") == "album"){
                getAlbumLT(userName, artist, name);
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
}

function throwError(json){
        $('#error').append("<h1> ERROR : " + json.message + " </h1>");
        error = true;
}
        
        
function getAlbumLT(user, artist, album){
    totalTime=0;
    let tracks = [];
    var totalTimeHtml = '';
    $.getJSON("http://ws.audioscrobbler.com/2.0/?method=album.getInfo&user="+ user + "&api_key=7f18ca9d34c83965fff9d9ff7f81a740&limit=10&artist=" + artist + "&album=" + album + "&format=json&autocorrect=1", function(json) {
        if(json.error != undefined){
            throwError(json);
            return;
        }
            $.each(json, function(i, item) {
                let jsonTracks = item.tracks.track;
                for(i=0; i<jsonTracks.length; i++){
                    tracks.push(jsonTracks[jsonTracks.length - 1 - i].name);
                }
            });
            for(i=0; i<jsonTracks.length; i++){
                getTrackLT(user, artist, tracks[i]);
            }
        });
        $(document).ajaxStop(function () {
            if(!error){
                totalTimeHtml = "<h3> You listened to " + album.replace("+", " ") + " a total of " + totalTime + " minutes or " +totalTime/60 + " hours ! </h3>";
                $('#result').append(totalTimeHtml);
            }
    });
}
        
        
function getTrackLT(user, artist, track){
        $.getJSON("http://ws.audioscrobbler.com/2.0/?method=track.getInfo&user="+ user + "&api_key=7f18ca9d34c83965fff9d9ff7f81a740&limit=10&artist=" + artist + "&track=" + track + "&format=json&autocorrect=1", function(json) {
            if(json.error != undefined){
            throwError(json);
            return;
            }
            var html = '';
            $.each(json, function(i, item) {
                timeListened = getPlayTime(item);
                html += constructResult(item, timeListened);
            });
            $('#result').append(html);
        });
    
}


function getPlayTime(trackJson){
            let name = trackJson.name;
            let duration = trackJson.duration; 
            let playcount = trackJson.userplaycount;
            totalTime+= ( parseInt( (duration*playcount)/60000, 10) );
            return ( parseInt( (duration*playcount)/60000, 10) );
    
}

function constructResult(json, time){
            return ("<p>" + json.artist.name + " - " + json.name + " - " + "Scrobbles : " + json.userplaycount + " Time listened : " + time + " minutes </p>");
}

//function getInputValue() {
        // Selecting the input element and get its value 
      //  userName = document.getElementById("userNameInput").value;
  //    }
