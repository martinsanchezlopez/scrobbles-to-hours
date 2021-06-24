throwZeroError = false;


function constructObject(artist, name, pC, time, rank){ //pC for playcount
    let timeHour = time/60;
    let object = {};
    
    if(rank != undefined){
        object.rank = rank;
    }
    
    object.artist = artist;
    object.name = name;
    if(!isNaN(timeHour)){
        object.playcountHour= timeHour.toFixed(1);
        object.playcountMinute= parseInt(time);
    }
    else{
        object.playcountHour = 0;
        object.playcountMinute = 0;
        throwZeroError = true;
    }
    object.playcount= pC;


    return object;
}



/*
 * type: either "custom" or "top" or "depth"
 * 
 */
function incrementSearchCount(type){
    blockAjaxStop = true;
    $.getJSON("https://api.countapi.xyz/hit/scorbbleToHours/" + type, function(response) {
    });
    blockAjaxStop = false;
}

/*
 * Conosole log number of searches
 * 
 */
function getSearchCount(type){
    blockAjaxStop = true;
    if(type == undefined){
        type = '';
    }
    $.getJSON("https://api.countapi.xyz/get/scorbbleToHours/" + type, function(response) {
           console.log(response.value);
    });
}


//TODO: save all queries made to session or even some database??
