
function getResultTable(){
    resultHtml = '<table><tr>';
    
    
    if(reportArray[0].rank != undefined){
        resultHtml += '<th>#</th>';
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



