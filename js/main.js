/*
Elijah Freestone
VFW 1210
Project 3
10-7-12
*/

//Wait until DOM is ready
window.addEventListener("DOMContentLoaded", function() {

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
    
   function saveData(key) {
   		//If the is no key, this means this is a brand ne item and we need a new key.
	   	if(!key) {
			var id = Math.floor(Math.random()*100000001);
		}else{
			//Set the id to the existing key that we're editine so it will save over the data.
			//The key is the same key that has been passed along form the editSubmit handler
			//to the validate function, and then passed here, into the storeData finction.
			id = key;
		}
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
            alert("There are no dates to show.");
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
            var linksLi = document.createElement("ul");
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
                makeSubList.appendChild(linksLi);
            }
            makeItemLinks(localStorage.key(i), linksLi); //Create edit and delete buttons/link for each item in local storage
        }
    };
    
    //Make Item Links
    //Create the edit and delete links for each stored item when displayed
    function makeItemLinks(key, linksLi) {
    	//add edit single item link
    	var editLink = document.createElement("a");
    	editLink.href = "#";
    	editLink.key = key;
    	var editText = "Edit Date";
    	editLink.addEventListener("click", editItem);
    	editLink.innerHTML = editText;
    	linksLi.appendChild(editLink);
    	
    	//Add line break
    	var breakTag = document.createElement("br");
    	linksLi.appendChild(breakTag);
    	
    	//Add delete single item link
    	var deleteLink = document.createElement("a");
    	deleteLink.href = "#";
    	deleteLink.key = key;
    	var deleteText = "Delete Date";
    	//deleteLink.addEventListener("click", deleteItem);
    	deleteLink.innerHTML = deleteText;
    	linksLi.appendChild(deleteLink);
	    
    };
    
    //Function for edit item link
    function editItem() {
	    //Grab the data from our item from local storage
	    var value = localStorage.getItem(this.key);
	    var item = JSON.parse(value);
	    
	    //Show the form
	    toggleControls("off");
	    
	    //Populate the form fields with current localStorage values.
	    $("events").value = item.events[1];
	    $("evdate").value = item.evdate[1];
	    $("evinfo").value = item.evinfo[1];
	    $("importance").value = item.importance[1];
	    var radios = document.forms[0].attend;
	    	for(var i=0; i<radios.length; i++) {
		    	if(radios[i].value == "Yes" && item.attend[1] == "Yes") {
		    		radios[i].setAttribute("checked", "checked");
		    	}else if(radios[i].value == "No" && item.attend[1] == "No") {
			    	radios[i].setAttribute("checked", "checked");
		    	}else if(radios[i].value == "Undecided" && item.attend[1] == "Undecided") {
			    	radios[i].setAttribute("checked", "checked");
			    }
	    	}
	    $("details").value = item.details[1];
	    
	    //Remove the initial listener from the input "Save Date" button.
	    save.removeEventListener("click", saveData)
	    //Change submit button value to edit button
	    $("submit").value = "Edit Date";
	    var editSubmit = $("submit");
	    //Save the key value established in this function as a property of the editSubmit event
	    //so we can use that value when we save the data we edited.
	    editSubmit.addEventListener("click", validate);
	    editSubmit.key = this.key;
	    
    };
    
    function clearData() {
        if(localStorage.length === 0) {
            alert("No data to clear.");
        }else{
            localStorage.clear();
            alert("All dates removed!");
            window.location.reload();
            return false;
        }
    };
    
    function validate(e) {
    	//Define elements we want to check
    	var getEvents = $("events");
    	var getEvdate = $("evdate");
    	var getEvinfo = $("evinfo");
    	
    	//Reset error messages
    	errMsg.innerHTML = "";
    	getEvents.style.border = "1px solid black";
    	getEvdate.style.border = "1px solid black";
   		getEvinfo.style.border = "1px solid black";
    	
    	//Get error messages
    	var messageAry = [];
    	//Event validation
    	if(getEvents.value === "--Choose An Event Type--") {
	    	var eventsError = "Please choose an event type.";
	    	getEvents.style.border = "1px solid red";
	    	messageAry.push(eventsError);
    	}
	    
	    //Event date validation
	    if(getEvdate.value === "") {
		    var evDateError = "Please choose a date for the event.";
	    	getEvdate.style.border = "1px solid red";
	    	messageAry.push(evDateError);
	    }
	    
	    //Event info validation
	    if(getEvinfo.value === "") {
		    var evInfoError = "Please add a brief description of the event";
	    	getEvinfo.style.border = "1px solid red";
	    	messageAry.push(evInfoError);
	    }
	    	
	    //If there were errors, display the on the screen
	    if(messageAry.length >= 1) {
		    for(var i=0, j=messageAry.length; i < j; i++) {
			    var txt = document.createElement("li");
			    txt.innerHTML = messageAry[i];
			    errMsg.appendChild(txt);
		    }
		    e.preventDefault();
		    return false;
	    }else{
		    //If all is ok, save our data! Send the key value that came form the editData function.
		    //Remember this key value was passed through the editSubmit event listener as a property
		    saveData(this.key);
	    }	   
    }; 

    //Variable defaults
    var eventTypes = ["--Choose An Event Type--", "Birthday", "Anniversary", "Other"],
        attendValue,
        errMsg = $("errors");
        
    makeEvType();
    
    //Set link & Submit Click Events
    var save = $("submit");
    save.addEventListener("click", validate);
    var show = $("displayData");
    show.addEventListener("click", showData);
    var clear = $("clearData");
    clear.addEventListener("click", clearData); 
});