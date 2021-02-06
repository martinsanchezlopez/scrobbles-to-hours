/* RESULT ARRAY
 * results end up here. Emptied after every searched.
 * 
 * For structure of result see constructObject() in data.js
 * 
 * Tables and downloadables are made from this array. Handled in results.js
 * 
 */
let reportArray = [];




let error = false;
/*
 * Append error message to page of a json.
 * 
 * 
 * (I know this is really scuffed but I haven't learned error handling and learning it for this small project would not be worth my time.
 * As I'm learn it next semester and I'm in vacation :D )
 */
function throwError(json){
        $('#error').append("<h1> ERROR : " + json.message + " </h1>");
        error = true;
}





/////////////////////////////////////////////////////   MAIN QUERY FUNCTIONS /////////////////////////////////////////////////

let userName = null;
let queryBlock = false; //used to avoid pointless heavy queries to be spammed

/* Retrieve selected search options
 */
function getSelectedValue(form){
    var e = document.getElementById(form);
    return e.options[e.selectedIndex].value;
}

/*
 * Gets playtime of custom album/track entered by user. Returns nothing. Appends 1-row table to page.
 * If an album, button appears allowing in-depth (song by song) count.
 */
function customReport(){
    $('#error').empty();
    error = false;
    reportArray.length = 0; // reportArray = [] won't work
    

    userName = encodeURIComponent(document.getElementById("userNameInput").value);
    userName.replace(" ", "+");
    let artist = encodeURIComponent(document.getElementById("artistInput").value);
    artist.replace(" ", "+");
    let name = encodeURIComponent(document.getElementById("taInput").value);
    name.replace(" ", "+");
        
    if (userName != "" && artist != "" && name != "" ){
        
        if(getSelectedValue("queryOption") == "track"){
            incrementSearchCount("custom");
            getTrackLT(userName, artist, name);
             document.getElementById("load").innerHTML = "Fetching data...";
        }
        else if(getSelectedValue("queryOption") == "album"){
            incrementSearchCount("custom");
            getAlbumListeningTime(userName, artist, name, -1);
            document.getElementById("load").innerHTML = "Fetching data...";
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

    
/*
 * Gets playtime of custom album/track entered by user. Returns nothing. Appends table with the top titles to page.
 */
function topReport(){
    $('#error').empty();
    error = false;
    reportArray.length = 0;
    queryBlock = true;
    
    userName = encodeURIComponent(document.getElementById("userNameInput").value);
    userName.replace(" ", "+");
    
    if(getSelectedValue("topQueryOption") == "undef"){
        var json = '{"message":"Please select a mode"}';
        throwError(JSON.parse(json));
    }
    if(userName == ''){
        var json = '{"message":"Please type your username"}';
        throwError(JSON.parse(json));
    }
    
    if (!error){
        document.getElementById("load").innerHTML = "Fetching data...";
        let queryMode = getSelectedValue("topQueryOption");
        incrementSearchCount("top");
        $.getJSON("https://ws.audioscrobbler.com/2.0/?method=user.gettop" + queryMode +  "&user=" + userName + "&api_key=7f18ca9d34c83965fff9d9ff7f81a740" + "&limit=" + getSelectedValue("topQueryEntries") + "&period="+ getSelectedValue("topQueryPeriod") + "&format=json", function(json){
            topToHour(json, queryMode);
        });

    }
}













/////////////////////////////////////////////////////   ALBUM FUNCTIONS /////////////////////////////////////////////////

let albumJson = null; //used to save json in case user want in depth report


/*
 * Calculates playtime from given json.
 * Parameter : topMethodOption, boolean indicates the attribute to take into account depending on the json and the search option of the user.
 */
function topToHour(json, topMethodOption){
    if(topMethodOption == "tracks"){
        $.each(json.toptracks.track, function(i, item){
            getPlayTime(item, true);
        });
    }
    else{
        $.each(json.topalbums.album, function(i, item){
            getAlbumListeningTime(userName, item.artist.name, item.name, item.playcount, item["@attr"].rank);
        });
    }
}



        
      
      
function getAlbumListeningTime(user, artist, album, userGetTopPlaycount, rank){ //playcount -1 if the funciton is not called for the user.gettopalbums
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
        reportArray.push(constructObject(json.album.artist, json.album.name, userPlayCount, minutePlayTime, rank));
        
        
            if(!error){
                if(userGetTopPlaycount == -1){
                    var depthOption = '';
                    depthOption += '<br> <button id="aDepth" onclick="getAlbumListeningTimeInDepth(albumJson);">Song by song time count</button><div id="invis">Will give you a more accurate time, specially if you scrobbles are not evenly distributed among tracks of variying length. (This method is also more prone to error depending on if the metadata of the file you played/streamed matches the one last.fm.)</div> '; 
                    $('#depth').append(depthOption);
                }
                    
            }
        //});
        
            
    }); // end OF JSON FUNCTION
}
       
       
function getAlbumListeningTimeInDepth(json){
    if(!queryBlock){
        incrementSearchCount("depth");
        $('#depth').empty();
        totalTime = 0;
        let tracks = [];
        let jsonTracks = json.album.tracks.track;
        for(i=0; i<jsonTracks.length; i++){
            tracks.push(encodeURIComponent (jsonTracks[jsonTracks.length - 1 - i].name) );
        }
        for(i=0; i<jsonTracks.length; i++){
        getTrackLT(userName, json.album.artist, tracks[i]);
        }

        if(!error){
            queryBlock = true;
        }
    }
}
        
        
        
        
        
        
        
        
        
        
        
/////////////////////////////////////////////////////   TRACK FUNCTIONS /////////////////////////////////////////////////
        
/*
 * Queries for a give track (song!) and calculates it's play time.
 * Result is appended to the reportArray, displayed when no queries are left.
 */
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
 * Calculates and displays the play time of a track from a given json.
 * trackJson : json of the track to calculate
 * jsonFromTop : true if the json is the json from user.getTopTracks (topReport), false if from track.getInfo (customReport)
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
}

