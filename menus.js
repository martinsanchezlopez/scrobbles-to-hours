function GetSelectedValue(){
                var e = document.getElementById("country");
                var result = e.options[e.selectedIndex].value;
                
                document.getElementById("result").innerHTML = result;
            }

            function GetSelectedText(){
                var e = document.getElementById("country");
                var result = e.options[e.selectedIndex].text;
                
                console.log(result);
                
            }
