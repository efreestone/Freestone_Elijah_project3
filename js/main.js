/*
Elijah Freestone
VFW 1210
Project 3
10-7-12
*/

//Wait until DOM is ready
window.addEventListener("DOMContentLoaded", function() {
    //alert(localStorage.value(0));

    //getElementById Function
    function $(x) {
        var theElement = document.getElementById(x);
        return theElement;
    }
    
    //Create select field element and populate with options
    function makeEvType() { 
        var formTag = document.getElementsByTagName("form"), //formTag is an array of all the form tags
            selectLi = $("select"),
            makeSelect = document.createElement("select");
            makeSelect.setAttribute("id", "events");
        for(var i=0, j=eventTypes.length; i<j; i++) {
            var makeOption = document.createElement("option");
            var optText = eventTypes[i];
            makeOption.setAttribute("value", optText);
            makeOption.innerHTML = optText;
            makeSelect.appendChild(makeOption);
        }
        selectLi.appendChild(makeSelect);
    };
    
    //Find value of selected radio button.
    function getSelectedRadio() {
        var radios = document.forms[0].attend;
        for(var i=0; i<radios.length; i++) {
            if(radios[i].checked) {
                attendValue = radios[i].value;
            }
        }
    };
    
    function toggleControls(n) {
        switch(n) {
            case "on":
                $("eventForm").style.display = "none";
                $("clearData").style.display = "inline";
                $("displayData").style.display = "none";
                $("addNew").style.display = "inline";
                break;
            case "off":
                $("eventForm").style.display = "block";
                $("clearData").style.display = "inline";
                $("displayData").style.display = "inline";
                $("addNew").style.display = "none";
                $("items").style.display = "none";
                break;
            default:
                return false;
        }    
    };
    
   function saveData() {
        var id = Math.floor(Math.random()*100000001);
        //Gather up all our form field values and store in an object.
        //Object properties contain array with the form label and input value.
    getSelectedRadio();
        var item         = {};
            item.events   = ["Event:", $("events").value]; //Event type selector
            item.evdate  = ["Date:", $("evdate").value]; //Event Date
            item.evinfo  = ["Info:", $("evinfo").value]; //Event Info
            item.importance = ["Importance:", $("importance").value]; //Event Importance Slider
            item.attend = ["Is attendance required?:", attendValue]; //Attendance Radio Buttons
            item.details = ["Event Details:", $("details").value]; //Event Details
            
        //Save Data into Local Storage: Use Stringify to convert object to a string.
        localStorage.setItem(id, JSON.stringify(item));
        alert("Date Saved!");
    };
    
    function showData() {
        toggleControls("on");
        if(localStorage.length === 0) {
            alert("There are no dates to show.")
        }
        //Write Data from Local Storage to the browser.
        var makeDiv = document.createElement("div");
        makeDiv.setAttribute("id", "items");
        var makeList = document.createElement("ul");
        makeDiv.appendChild(makeList);
        document.body.appendChild(makeDiv);
        $("items").style.display = "block";
        for(var i=0, len=localStorage.length; i<len; i++) {
            var makeLi = document.createElement("li");
            makeList.appendChild(makeLi);
            var key = localStorage.key(i);
            var value = localStorage.getItem(key);
        //Convert the string from local storage value back to an object by using JSON.parse()
            var obj = JSON.parse(value);
            var makeSubList = document.createElement("ul");
            makeLi.appendChild(makeSubList);
            for(var n in obj) {
                var makeSubLi = document.createElement("li");
                makeSubList.appendChild(makeSubLi);
                var optSubText = obj[n][0]+" "+obj[n][1];
                makeSubLi.innerHTML = optSubText;
            }
        }
    };
    
    function clearData() {
        if(localStorage.length === 0) {
            alert("No data to clear.");
        }else{
            localStorage.clear();
            alert("All dates removed!")
            window.location.reload();
            return false;
        }
    };

    //Variable defaults
    var eventTypes = ["--Choose An Event Type--", "Birthday", "Anniversary", "Other"],
        attendValue;
        
    makeEvType();

    //Set link & Submit Click Events
    var save = $("submit");
    save.addEventListener("click", saveData);
    var show = $("displayData");
    show.addEventListener("click", showData);
    var clear = $("clearData");
    clear.addEventListener("click", clearData); 
});