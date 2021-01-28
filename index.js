//let userName = "";


function s2h(){
        let userName = document.getElementById("userNameInput").value;
        let artist = document.getElementById("artistInput").value;
        let name = document.getElementById("taInput").value;
            
        if (userName != "" && artist != "" && userName != "" ){
            if(getSelectedValue("queryOption") == "track"){
                getTrackLT(userName, artist, name);
            }
            if(getSelectedValue("queryOption") == "album"){
                getAlbumLT(userName, artist, name);
            }
            else{
                alert("Please choose a search type");   
            }
        }
        else{
         alert("Please fill all thingies");   
        }
}
        
        
function getAlbumLT(user, artist, album){
    let tracks = [];
    $.getJSON("http://ws.audioscrobbler.com/2.0/?method=album.getInfo&user="+ user + "&api_key=7f18ca9d34c83965fff9d9ff7f81a740&limit=10&artist=" + artist + "&track=" + album + "&format=json&autocorrect=1", function(json) {
            var html = '';
            $.each(json, function(i, item) {
                let jsonTracks = item.tracks.track;
                for(i=0; i<tracks.length; i++){
                    tracks.add(jsonTracks[i].name);
                }
            });
            let totalTime = 0;
            for(i=0; i<tracks.length; i++){
                totalTime += getTrackLT(user, artist, tracks[i]);
            }
            html+= "<h3> Total listened time : " + totalTime + "</h2>";
            $('#result').append(html);
        });
    
}
        
        
function getTrackLT(user, artist, track){
        
        $.getJSON("http://ws.audioscrobbler.com/2.0/?method=track.getInfo&user="+ user + "&api_key=7f18ca9d34c83965fff9d9ff7f81a740&limit=10&artist=" + artist + "&track=" + track + "&format=json&autocorrect=1", function(json) {
            var html = '';
            $.each(json, function(i, item) {
                var timeListened = getPlayTime(item);
                html += constructResult(item, timeListened);
            });
            $('#result').append(html);
        });
        
        return timeListened;
}

function getPlayTime(trackJson){
            let name = trackJson.name;
            let duration = trackJson.duration; 
            let playcount = trackJson.userplaycount;
            return ( parseInt( (duration*playcount)/60000, 10) );
    
}

function constructResult(json, time){
            return ("<p>" + json.artist.name + " - " + json.name + " - " + "Scrobbles : " + json.userplaycount + " Time listened : " + time + " minutes </p>");
}

//function getInputValue() {
        // Selecting the input element and get its value 
      //  userName = document.getElementById("userNameInput").value;
  //    }
