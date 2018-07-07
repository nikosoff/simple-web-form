window.onload=function() {
	
	function showCreditCardData(ev) {
		var creditCardData=document.getElementById("creditCardData");
		//var creditCardNumber=creditCardData.getElementById("cardNumber");
		//alert(creditCardNumber);
		if (ev.target.value=="creditCard") {
			creditCardData.style.display="block";
			cardNumber.required=true;
			//alert(cardNumber.required);
		}
		else {
			creditCardData.style.display="none";
			cardNumber.required=false;
		}
	}
	
	function resetAll() {
		
		var ans=confirm("Are you sure for this action?");
		if (ans==false) return;
		
		var inputFields=document.getElementsByTagName("input");
		
		for (i in inputFields) {
			if (inputFields[i].type!="submit" && inputFields[i].type!="button")
				inputFields[i].value="";
		}
		
		document.getElementById("map").style.display="none";
	}
	
	function submitMessage(ev) {
		//validation
		var requiredFields=document.getElementsByClassName("required");
		var errorMessage="Must be filled";
		if (requiredFields!=null) {
			ev.preventDefault();
			for (var i=0;i<requiredFields.length;i++) {
				if (!requiredFields[i].value) {
					var fieldName=requiredFields[i].previousSibling.textContent;
					alert("Field: \""+fieldName.substring(0,fieldName.length-2)+"\" must be filled");
					return false;
				}
			}
		}
		
		var name=document.getElementById("clientName").value;
		name=name.substring(0,1).toUpperCase()+name.substring(1,name.length);
		var msg=name+", your order has been sent";
		alert(msg);
	}
	
	function makeSuggestions() {
		
		xhttp.onreadystatechange=function() {
		
			if (xhttp.readyState==4 && xhttp.status==200) {
		
				var suggestionBlock=document.getElementById("suggestionBox");
				var inputName=document.getElementById("clientName").value.toLowerCase();
				
				if (inputName=="") {
					suggestionBlock.innerHTML="";
					suggestionBlock.style.display="none";
					return;
				}
				
				var xmlFile = xhttp.responseXML;
				
				var listOfSuggestedNames="";
				var suggestedName="";
				nameCollection = xmlFile.getElementsByTagName("Name");

				for (var i=0;i<nameCollection.length;i++) {
					suggestedName=nameCollection[i].childNodes[0].nodeValue;
					if (suggestedName.toLowerCase().startsWith(inputName)) {
						if (listOfSuggestedNames!="") listOfSuggestedNames+="<br/>";
						listOfSuggestedNames+=suggestedName;
					}	
				}
				
				if (listOfSuggestedNames!="") {
					suggestionBlock.innerHTML =listOfSuggestedNames;
					suggestionBlock.style.display="block";
				}
				else {
					suggestionBlock.innerHTML="";
					suggestionBlock.style.display="none";
				}
				
		 
			}
		};
		
		
		xhttp.open("GET","xml/names.xml",true);
		xhttp.send();
	}
	
	//Η παρακάτω μέθοδος είναι επηρεασμένη από: https://developers.google.com/maps/documentation/javascript/geocoding#GeocodingStatusCodes
	function showMap() {
	
		function initMap() {
			geocoder = new google.maps.Geocoder();
			var latlng = new google.maps.LatLng(37.983,23.73);//Athens coordinates
			var mapOptions = {
			zoom: 16,
			center: latlng
			}
			map = new google.maps.Map(document.getElementById("map"), mapOptions);
		}

		function codeAddress() {
			//var clientAddress = document.getElementById("clientAddress").value;
			geocoder.geocode( { 'address': clientAddress}, 
				function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						map.setCenter(results[0].geometry.location);
						var marker = new google.maps.Marker({
							map: map,
							position: results[0].geometry.location,
							title:'Your chosen location'
						});
					} 
					else {
						//alert("You type a wrong location, please try again");
					}
				});
		}
		
		var clientAddress=document.getElementById("clientAddress").value
		if (!clientAddress) return;
		var geocoder;
		var map;
		initMap();
		codeAddress();
		document.getElementById("map").style.display="block";
	}
	
	function waitUserToStopTyping() {
		myVar=setTimeout(showMap, 5000);
	}
	
	function clearTyping() {
		myVar.clearTimeout();
	}
	
	var paymentMethod=document.getElementById("paymentMethod");
	paymentMethod.getElementsByTagName("select")[0].addEventListener("change",showCreditCardData);
	var xhttp=new XMLHttpRequest();
	
	document.getElementById("resetOrder").addEventListener("click",resetAll);
	document.getElementById("mainForm").addEventListener("submit",submitMessage);
	document.getElementById("clientName").addEventListener("input",makeSuggestions);
	document.getElementById("clientAddress").addEventListener("keyup",waitUserToStopTyping);
	document.getElementById("clientAddress").addEventListener("input",clearTyping);
	
	var myVar;
	
}