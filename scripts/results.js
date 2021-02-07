let rankedByScrobbles = false; //default : ranked by playtime and NOT playcount
let timeUnitHour = true; //default time is set to hours

let blockAjaxStop = false;


let csv;

$(document).ajaxStop(function (){
    if(!blockAjaxStop){ //dumb solution to not make table when calling the countingAPI
        buildResultTable(); 
        queryBlock = false;
    }
    else{
        blockAjaxStop = false;
    }
});





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
    document.getElementById("load").innerHTML = "Constructing result table...";
    document.getElementById("resultButtons").style.display = "none";
    document.getElementById("download").style.display = "none";
    let time;
    
    let resultHtml = '<table id="resultTable"><tr>';
    
    if(reportArray[0].rank != undefined){
        
        resultHtml += '<th>#</th>';
    }
    
    if(rankedByScrobbles){
        reportArray.sort( (a,b) => {
            return b.playcount - a.playcount;   
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
    
    resultHtml += '<th>Artist</th><th>Title</th><th>' + time + 'Listened</th><th>Scrobbles</th></tr>';
    
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
    document.getElementById("resultButtons").style.display = "block";
    document.getElementById("download").style.display = "block";
    document.getElementById("load").innerHTML = "";
    
}









function downloadCSV(){
    csv = toCsv(reportArray);
    
    //source: https://www.javatpoint.com/javascript-create-and-download-csv-file
    
    var downloadLink;  
     
    //define the file type to text/csv  
    csv = new Blob([csv], {type: 'text/csv'});  
    downloadLink = document.createElement("a");  
    downloadLink.download = "playtime_results.csv";  
    downloadLink.href = window.URL.createObjectURL(csv);  
    downloadLink.style.display = "none";  
  
    document.body.appendChild(downloadLink);  
    downloadLink.click();  
    
    
    /*document.write(csv);  
    var hiddenElement = document.createElement('a');  
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);  
    hiddenElement.target = '_blank';  
    //provide the name for the CSV file to be downloaded  
    hiddenElement.download = 'results.csv';  
    hiddenElement.click(); */
}











//   CSV   //////// SOURCE : https://gist.github.com/JeffJacobson/2770509 (@JeffJacobson) //////////////////////////////////


/**
* Converts a value to a string appropriate for entry into a CSV table.  E.g., a string value will be surrounded by quotes.
* @param {string|number|object} theValue
* @param {string} sDelimiter The string delimiter.  Defaults to a double quote (") if omitted.
*/
function toCsvValue(theValue, sDelimiter) {
	var t = typeof (theValue), output;

	if (typeof (sDelimiter) === "undefined" || sDelimiter === null) {
		sDelimiter = '"';
	}

	if (t === "undefined" || t === null) {
		output = "";
	} else if (t === "string") {
		output = sDelimiter + theValue + sDelimiter;
	} else {
		output = String(theValue);
	}

	return output;
}

/**
* Converts an array of objects (with identical schemas) into a CSV table.
* @param {Array} objArray An array of objects.  Each object in the array must have the same property list.
* @param {string} sDelimiter The string delimiter.  Defaults to a double quote (") if omitted.
* @param {string} cDelimiter The column delimiter.  Defaults to a comma (,) if omitted.
* @return {string} The CSV equivalent of objArray.
*/
function toCsv(objArray, sDelimiter, cDelimiter) {
	var i, l, names = [], name, value, obj, row, output = "", n, nl;

	// Initialize default parameters.
	if (typeof (sDelimiter) === "undefined" || sDelimiter === null) {
		sDelimiter = '"';
	}
	if (typeof (cDelimiter) === "undefined" || cDelimiter === null) {
		cDelimiter = ",";
	}

	for (i = 0, l = objArray.length; i < l; i += 1) {
		// Get the names of the properties.
		obj = objArray[i];
		row = "";
		if (i === 0) {
			// Loop through the names
			for (name in obj) {
				if (obj.hasOwnProperty(name)) {
					names.push(name);
					row += [sDelimiter, name, sDelimiter, cDelimiter].join("");
				}
			}
			row = row.substring(0, row.length - 1);
			output += row;
		}

		output += "\n";
		row = "";
		for (n = 0, nl = names.length; n < nl; n += 1) {
			name = names[n];
			value = obj[name];
			if (n > 0) {
				row += ","
			}
			row += toCsvValue(value, '"');
		}
		output += row;
	}

	return output;
}



