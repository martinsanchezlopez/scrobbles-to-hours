
function constructObject(artist, name, pC, time, rank){ //pC for playcount
    let timeHour = time/60;
    let object = {};
    
    if(rank != undefined){
        object.rank = rank;
    }
    
    object.artist = artist;
    object.name = name;
    object.playcount= pC;
    object.playcountHour= timeHour.toFixed(1);
    object.playcountMinute= parseInt(time);


    return object;
}


//TODO: save all queries made to session or even some database??
