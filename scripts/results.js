let rankedByScrobbles = true;

function switchRank(){
    rankedByScrobbles = !rankedByScrobbles;
    buildResultTable();
    if(rankedByScrobbles){ //ranked by playcount
        document.getElementById("sort").innerHTML = "Rank by time listened";
    }
    else{
        document.getElementById("sort").innerHTML = "Rank by scrobbles";
    }
}




function buildResultTable(){
    $('#result').empty();
    
    let resultHtml = '<button type="button" onclick="switchRank();" id="sort">Rank by listened time</button><table id="resultTable"><tr>';
    
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
    
    resultHtml += '<th>Artist</th><th>Title</th><th>Scrobbles</th><th>Minutes Listened</th><th>Hours Listened</th></tr>';
    
    for(i=0; i<reportArray.length; i++){
        resultHtml += '<tr>';
        for (let value of Object.values(reportArray[i])){
            
            resultHtml += '<td>' + value + '</td>';
        }
        resultHtml += '</tr>';
    }
    
    resultHtml += '</table>';
    $('#result').append(resultHtml);
    
    
}


$(document).ajaxStop(function (){
    buildResultTable(); 
});


function testTable(){
    reportArray = testArray;
    buildResultTable();
    
}



