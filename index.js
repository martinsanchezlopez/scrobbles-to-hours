//let userName = "";

console.log();
let totalTime = 0;
let error = false;
let userName = null;
let queryBlock = false;

let albumJson = null;

//ljsdkajldsalsdaj TODO parseint pr heures, rajouter heures for track, check bug avec shrines of paralysis, implement album tout //court 

function s2h(){
        $('#error').empty();
        error =false;
        
        queryBlock = false;
        
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
                getAlbum(userName, artist, name);
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

function blockQueries(){
    queryBlock = true;
}
        
        
function getAlbum(user, artist, album){
    let albumDuration = 0;
    var totalTimeHtml = '';
    $.getJSON("http://ws.audioscrobbler.com/2.0/?method=album.getInfo&user="+ user + "&api_key=7f18ca9d34c83965fff9d9ff7f81a740&limit=10&artist=" + artist + "&album=" + album + "&format=json&autocorrect=1", function(json) {
        if(json.error != undefined){
            throwError(json);
            return;
        }
        /*
            $.each(json, function(i, item) {
                let jsonTracks = item.tracks.track;
                for(i=0; i<jsonTracks.length; i++){
                    tracks.push(jsonTracks[jsonTracks.length - 1 - i].name);
                }
                for(i=0; i<jsonTracks.length; i++){
                getTrackLT(user, artist, tracks[i]);
            }
            });*/
        
        let jsonTracks = json.album.tracks.track;
        for(i=0; i<jsonTracks.length; i++){
            albumDuration += parseInt(jsonTracks[i].duration);
        }
        albumJson = json; // for use if user chooses in depth count
        
        $(document).ajaxStop(function () {
            if(!error){
                let minutePlayTime = (albumDuration*parseInt(json.album.userplaycount) )/(jsonTracks.length*60);
                let hourPlayTime = minutePlayTime/60;
                
                totalTimeHtml = "<h3> You listened to " + album.replace("+", " ") + " a total of " + parseInt( minutePlayTime) + " minutes or " + parseInt(hourPlayTime) + " hours! </h3>";
                totalTimeHtml += '<br> <a id="aDepth" onclick="getAlbumInDepth(albumJson);">In depth time count</a><div id="invis">This will give you a more accurate time, specially if you scrobbles are not equitably distributed among the tracks of the album. (This method is also more prone to error depending on if the metadata of the file you played/streamed matches the one last.fm.)</div> '; 
                $('#depth').append(totalTimeHtml);
            }
        });
        
            
    });
}
       
       
function getAlbumInDepth(json){
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
                let depthTimeHtml = '';
                depthTimeHtml = "<h3> You listened to " + json.album.name + " a total of " + parseInt( totalTime) + " minutes or " + parseInt(totalTime/60) + " hours! </h3>";
                $('#depth').append(depthTimeHtml);
                queryBlock = true;
            }
        });
    }
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
