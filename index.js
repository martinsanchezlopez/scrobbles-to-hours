//let userName = "";

function s2h(){
        let userName = document.getElementById("userNameInput").value;
        let artist = document.getElementById("artistInput").value;
        let name = document.getElementById("trackInput").value;
        $.getJSON("http://ws.audioscrobbler.com/2.0/?method=track.getInfo&user="+ userName + "&api_key=7f18ca9d34c83965fff9d9ff7f81a740&limit=10&artist=" + artist + "&track=" + name + "&format=json", function(json) {
            var html = '';
            $.each(json, function(i, item) {
                let name = item.name; 
                let duration = item.duration; 
                let playcount = item.userplaycount;
                let timeListened = parseInt( (duration*playcount)/60000, 10);
                console.log(name, duration, playcount);
                html += "<p>" +artist + " - " + name + " - " + "Play count : " + playcount + " Time listened : " + timeListened + " minutes </p>";
            });
            $('#result').append(html);
        });
}

//function getInputValue() {
        // Selecting the input element and get its value 
      //  userName = document.getElementById("userNameInput").value;
  //    }
