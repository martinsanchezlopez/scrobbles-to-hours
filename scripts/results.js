let rankedByScrobbles = false; //default : ranked by playtime and NOT playcount
let timeUnitHour = true; //default time is set to hours

let blockAjaxStop = false;

/*
 * Change sorting of the result table between playcount and playtime
 */
function switchSort(){
    rankedByScrobbles = !rankedByScrobbles;
    buildResultTable();
    if(rankedByScrobbles){ //ranked by playcount
        document.getElementById("sortButton").innerHTML = "Sort by playtime";
    }
    else{
        document.getElementById("sortButton").innerHTML = "Sort by scrobbles";
    }
}


/*
 * Change time unit of the result table
 */
function switchTimeUnit(){
    timeUnitHour = !timeUnitHour;
    buildResultTable();
    if(timeUnitHour){
        document.getElementById("timeUnitButton").innerHTML = "Display time in minutes";
    }
    else{
        document.getElementById("timeUnitButton").innerHTML = "Display time in hours";
    }
}




function buildResultTable(){
    $('#result').empty();
    let time;
    let resultHtml = '<button type="button" onclick="switchSort();" id="sortButton">Sort by scrobbles</button>' +
    '<button type="button" onclick="switchTimeUnit();" id="timeUnitButton">Display time in minutes</button>' +
    '<table id="resultTable"><tr>';
    
    if(reportArray[0].rank != undefined){
        
        resultHtml += '<th>#</th>';
    }
    
    if(rankedByScrobbles){
        reportArray.sort( (a,b) => {
            return a.rank - b.rank;   
        });
    }
    else{
        reportArray.sort( (a,b) => {
            return b.playcountMinute - a.playcountMinute;   
        });
    }
    
    
    if(timeUnitHour){
        time = 'Hours';
    }
    else{
        time = 'Minutes';   
    }
    
    resultHtml += '<th>Artist</th><th>Title</th><th>Scrobbles</th><th>' + time + 'Listened </tr>';
    
    for(i=0; i<reportArray.length; i++){
        resultHtml += '<tr>';
        for (let entry of Object.entries(reportArray[i])){
            
            if( (timeUnitHour && entry[0] != "playcountMinute") || (!timeUnitHour && entry[0] != "playcountHour")){
                resultHtml += '<td>' + entry[1] + '</td>';
            }
        }
        resultHtml += '</tr>';
    }
    
    resultHtml += '</table>';
    $('#result').append(resultHtml);
    
    
}


$(document).ajaxStop(function (){
    if(!blockAjaxStop){ //dumb solution to not make table when calling the countingAPI
        buildResultTable(); 
    }
    else{
        blockAjaxStop = false;
    }
});




