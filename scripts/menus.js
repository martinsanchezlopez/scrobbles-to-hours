function getSelectedValue(form){
    var e = document.getElementById(form);
    return e.options[e.selectedIndex].value;
}

function getSelectedText(form){
    var e = document.getElementById(form);
    return e.options[e.selectedIndex].text;

}
