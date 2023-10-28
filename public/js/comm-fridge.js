var xhttp;
window.onload = function(){
	let pageId = document.getElementsByTagName("body")[0].id;
	if(pageId != null&& pageId == "edit_a_fridge"){
		let items = document.querySelectorAll("input");
  		let submitButton = document.getElementById("btnSubmit").addEventListener("click",sendUpdate);
		// add an event listener to all of the text fields
		for(let i = 0; i< items.length - 1; i++){
			items[i].addEventListener("input", checkTextField);
		}
		let querry = window.location.search.substring(1);
		let fridgeId = querry;
		if(fridgeId !== ""){
			requestData("http://localhost:8000/fridges/" + fridgeId, "ite");
		}
	}else if(pageId != null&& pageId == "view_items"){
		// extract the query parameters from the URL. The method used here is different than what is used on the server side (where we may have access to additional libraries)
			requestData("http://localhost:8000/fridges", pageId);
			let submitButton = document.getElementById("submit_btn").addEventListener("click",deleteItem);

	}else if(pageId != null&& pageId == "add_a_fridge"){
		let items = document.querySelectorAll("input");
  		let submitButton = document.getElementById("btnSubmit").addEventListener("click",sendFridge);
		// add an event listener to all of the text fields
		for(let i = 0; i< items.length - 1; i++){
			items[i].addEventListener("input", checkTextField);
		}
		requestData("http://localhost:8000/fridges/items","process");

	}else if(pageId != null&& pageId == "search_fridges"){
		let items = document.querySelectorAll("input");
  		let submitButton = document.getElementById("btnSubmit").addEventListener("click",searchFridge);
		// add an event listener to all of the text fields
		for(let i = 0; i< items.length - 1; i++){
			items[i].addEventListener("input", checkTextField);
		}

	}
	
}

function requestData(URL, page){
	xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object
  let processingFunction = processFridgeData;

  // if the request is coming from the update page, then the AJAX processing function will be processUpdateData(). Otherwise, we will call the processHomeData function
  if(page === "view_items"){
    processingFunction = displayFridges;
  }else if(page === "displayFridge"){
	  processingFunction = displayFridgeContents;
  }else if(page === "populateLeft"){
	  processingFunction = populateLeftMenu;
  }else if(page === "process"){
	processingFunction = processFridgeData;
  }else if(page === "ite")
		processingFunction = processUpdateData;

	xhttp.onreadystatechange = processingFunction; // specify what should happen when the server sends a response
  xhttp.open("GET", URL, true); // open a connection to the server using the GET protocol
  // *** important: if this header is not set, then the server would not be able to use the "Accept" header value to determine the type of resources to respond with
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.send(); // send the request to the server
}


function retrieveFridgesData(URL){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = processFridgesData;
	xhttp.open("GET",URL,true);
	xhttp.send();

}

function sendUpdate(event){
	event.preventDefault();
	let select = document.getElementById("accepted_types");
	xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object
	let requestBody = {}
	let items = document.querySelectorAll("input");
	for(let i = 0; i< items.length-1; i++){
		requestBody[items[i].id] = items[i].value;
	}
	let selections = []
	for(select of select.selectedOptions)
	{
		selections.push(select.label);
	}
	requestBody["accepted_types"] = selections;

	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
		  console.log("The category data was successfully updated!");
		  console.log(xhttp.responseText);
		}
		else if(xhttp.status === 400){
		  console.log(xhttp.responseText);
		}
		else if(xhttp.status === 404){
		  console.log(xhttp.responseText);
		}
	};
	let URL = "http://localhost:8000/fridges/" + window.location.search.substring(1);
  	console.log(URL);
  	console.log(requestBody); // specify what should happen when the server sends a response
  	xhttp.open("PUT", URL, true); // open a connection to the server using the GET protocol
 	 // *** important: if this header is not set, then the server would not be able to use the "Accept" header value to determine the type of resources to respond with
	  xhttp.setRequestHeader("Content-type","application/json");
	  xhttp.setRequestHeader("Accept", "application/json");
  	xhttp.send(JSON.stringify(requestBody)); // send the request to the server
	res = document.getElementById("respArea");
	res.classList.remove("hidden");
	res.innerHTML = "The fridge has been succesfully changed"
}

function searchFridge(event){
	event.preventDefault();
	xhttp = new XMLHttpRequest();
	let querry = "";
	let items = document.querySelectorAll("input");
	querry +="type="+items[0].value;
	querry +="&name="+items[1].value;
	xhttp.onreadystatechange = processItem;
	xhttp.open("GET","http://localhost:8000/search/items?"+querry,true);
	xhttp.setRequestHeader("Accept", "application/json")
	xhttp.send();
	
}

function processItem(){
	if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
		let data = xhttp.responseText;  // Data returned by the AJAX request
		let items = JSON.parse(data);
		let h2 = document.getElementById("view_results");
		h2.classList.remove("hidden");
		let i = 0;
		let newH = document.getElementsByClassName("replace")
		while(newH[0]){
			newH[0].parentNode.removeChild(newH[0]);
		}

		for(let fri of items){
			let box = document.createElement("div");
			box.id = items.indexOf(fri);
			box.classList.add("replace");
			box.value = fri.name;
			let fridgeContent = "<img src="+fri.img+"></span>";
			fridgeContent += "<span><strong>" + fri.name + "</strong></span>";
			fridgeContent	+= "<span>" + fri.type + "</span>";
			box.innerHTML = fridgeContent;
			h2.appendChild(box);
			i++;
	}
	}else if(xhttp.status === 500){
		console.log(xhttp.responseText);
	}
	else {
			console.log("The server is not done processing the request.");
	}
}

function sendFridge(event){
	event.preventDefault();
	let select = document.getElementById("accepted_types");
	xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object
	let requestBody = {}
	let items = document.querySelectorAll("input");
	for(let i = 0; i< items.length-1; i++){
		requestBody[items[i].id] = items[i].value;
	}
	let selections = []
	for(select of select.selectedOptions)
	{
		selections.push(select.label);
	}
	requestBody["accepted_types"] = selections;

	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
		  console.log("The category data was successfully updated!");
		  console.log(xhttp.responseText);
		}
		else if(xhttp.status === 400){
		  console.log(xhttp.responseText);
		}
		else if(xhttp.status === 404){
		  console.log(xhttp.responseText);
		}
	};
	let URL = "http://localhost:8000/fridges";
  	console.log(URL);
  	console.log(requestBody); // specify what should happen when the server sends a response
  	xhttp.open("Post", URL, true); // open a connection to the server using the GET protocol
 	 // *** important: if this header is not set, then the server would not be able to use the "Accept" header value to determine the type of resources to respond with
	  xhttp.setRequestHeader("Content-type","application/json");
	  xhttp.setRequestHeader("Accept", "application/json");
  	xhttp.send(JSON.stringify(requestBody)); // send the request to the server
	res = document.getElementById("respArea");
	res.classList.remove("hidden");
	res.innerHTML = "The Fridge has been successfully added to the available fridges"
}

function deleteItem(event){
	event.preventDefault();
	let querry = ""
	let li = document.getElementById("items_picked");
	let children = li.children;
	for(child of children){
		querry += child.id.split("-")[2];
		let num = parseInt(child.innerHTML.split("<span>")[1].charAt(0));
			querry += "="+num+"&";
		
	}
	querry = querry.slice(0, -1);
	console.log(querry);
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
		  console.log("The category data was successfully deleted!");
		  console.log(xhttp.responseText);
		}
		else if(xhttp.status === 400){
		  console.log(xhttp.responseText);
		}
		else if(xhttp.status === 404){
		  console.log(xhttp.responseText);
		}
	};
	let URL = "http://localhost:8000/fridges/"+ document.getElementsByTagName("body")[0].id+"/items?"+querry;
	li.innerHTML = "";
  	console.log(URL);
  	xhttp.open("DELETE", URL, true);
	xhttp.setRequestHeader("Content-type","application/json");
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.send();
	let left = document.getElementById("categories");
		left.innerHTML = "";
	let bar = document.getElementById("meter").firstChild;
	bar.innerHTML = "";
	let mid = document.getElementById("middle-column");
		mid.innerHTML = "";
	itemsDisplay(null);
}

function processUpdateData(){
	if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
		let data = xhttp.responseText;  // Data returned by the AJAX request
	
		// Convert the JSON data received to a JavaScript object
		let fridge = JSON.parse(data);
		console.log(fridge); // print the object, so we can see the fields
		let items = document.querySelectorAll("input");
		for(let i = 0; i< items.length-1; i++){
			if(!(Object.getOwnPropertyNames(fridge.address).includes(items[i].id))){
				items[i].value = fridge[items[i].id];
			}else{
				items[i].value = fridge.address[items[i].id];
			}
		}
		let select = document.getElementById("accepted_types");
		for(let i = 0; i < fridge.accepted_types.length ; i++){
					let box = document.createElement("option")
					box.innerHTML = fridge.accepted_types[i];
					box.value = fridge.accepted_types[i];
					box.addEventListener("click",checkTextField);
					box.selected = 'selected';
					select.appendChild(box);
		}
		requestData("http://localhost:8000/fridges/items","process");
	}else if(xhttp.status === 500){
		console.log(xhttp.responseText);
	  }
	  else {
			console.log("The server is not done processing the request.");
	  }
	  
}

function processFridgeData(){
	let pageId = document.getElementsByTagName("body")[0].id;
	if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
	  let data = xhttp.responseText;  // Data returned by the AJAX request
  
	  // Convert the JSON data received to a JavaScript object
	  let fridges = JSON.parse(data);
	  console.log(fridges); // print the object, so we can see the fields
  
	  // We will iterate over the categories to dynamically create the a list of hyperlinks for the categories. Each hyperlink has a query string in the href, and a name
	 if(pageId == "view_items"){
		displayFridgeContents(fridges)
	 }else{
		 let types = [];
		 let select = document.getElementById("accepted_types");
		 for(fo of select.selectedOptions){
			types.push(fo.label);
		 }
		for(let i = 1; i<= Object.getOwnPropertyNames(fridges).length; i++){
			if(!(types.includes(fridges[i.toString()].type))){
				let box = document.createElement("option")
				box.innerHTML = fridges[i.toString()].type;
				box.value = fridges[i.toString()].type;
				box.addEventListener("click",checkTextField);
				types.push(fridges[i.toString()].type);
				select.appendChild(box);
			}
		}
			checkTextField(null);
	 }
   	}
   	else if(xhttp.status === 500){
	  console.log(xhttp.responseText);
	}
	else {
		  console.log("The server is not done processing the request.");
	}
  }
function checkCart(){
	let ul = document.getElementById('items_picked').getElementsByTagName('li');
	if(ul.length > 0){
		document.getElementById("submit_btn").disabled = false;
		return true;
	}
	document.getElementById("submit_btn").disabled = true;
	return false;
}
function checkTextField(event){
	let res = document.getElementById("respArea");
	let select = document.getElementById("accepted_types");
	res.classList.add("hidden");
	if(event != null){
		let element = event.target;
  	if(element.parentNode.id != "accepted_types"){
		if(element.id == "name" || element.id == "contact_person"|| element.id == "street" || element.id == "postal_code" || element.id == "city" || element.id == "province"){
		if(!isNaN(element.value)){
			element.classList.add("error");
			element.classList.remove("valid");
		}else{
			element.classList.add("valid");
			element.classList.remove("error");
		}
		}
		else if (element.id == "can_accept_items"){
			if(isNaN(element.value)){
				element.classList.add("error");
				element.classList.remove("valid");
			}else{
				element.classList.add("valid");
				element.classList.remove("error");
			}
		}
	}
}
	// check if all the fields are filled
	if(document.getElementsByTagName("body")[0].id != "search_fridges"){
		let numFilled = 0;
		let items = document.querySelectorAll("input");
		for(let i = 0; i< items.length-1; i++){
		if(items[i].value.length > 0 && !items[i].classList.contains("error")){
			numFilled++;
		}
		}
		if(numFilled == 8 && select.selectedIndex != -1){
		document.querySelector("#btnSubmit").disabled = false;
		}
		else{
		document.querySelector("#btnSubmit").disabled = true;
		}
	}else{
		document.querySelector("#btnSubmit").disabled = false;
	}
}

function displayFridges(){
if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
		let data = xhttp.responseText;  // Data returned by the AJAX request
	
		// Convert the JSON data received to a JavaScript object
		let fridges = JSON.parse(data);
		console.log(fridges); // print the object, so we can see the fields
	let fridgesSection = document.getElementById("fridges");
	let header = document.createElement("h1");
	header.textContent = "Available fridges";
	fridgesSection.appendChild(header);
	let edit_btn = document.createElement("button");
	edit_btn.id = "editFridge";
	edit_btn.addEventListener("click", processIncrease);

	for(let i = 0; i < fridges.length; i++){
		let fridgeData = document.createElement("div");
		fridgeData.id = "fridge_" + i;

		let fridgeContent = "<img src='images/fridge.svg'></span>";
		fridgeContent += "<span><strong>" + fridges[i].name + "</strong></span>";
		fridgeContent	+= "<span>" + fridges[i].address.street + "</span>";
		fridgeContent += "<span>" + fridges[i].contact_phone + "</span>"
		fridgeContent += "<a class = 'edit' href=" + "fridges/editFridge/?"+ fridges[i].id +"><i class='fa fa-pencil'></i>Edit</a>"

		fridgeData.innerHTML = fridgeContent;
		fridgeData.addEventListener("click", itemsDisplay);
		fridgesSection.appendChild(fridgeData);
	}
}else if(xhttp.status === 500){
	console.log(xhttp.responseText);
}
else {
		console.log("The server is not done processing the request.");
}
}
function itemsDisplay(event){
	if (event != null){
		let i = parseInt(event.target.id.charAt(event.target.id.length-1));
		if(isNaN(i)){
			i = parseInt(event.target.parentNode.id.charAt(event.target.parentNode.id.length-1))
		}
		if(event.target.classList[0] != "edit"){
			requestData("http://localhost:8000/fridges/X/fg-"+(i+1),"displayFridge");
			let pageId = document.getElementsByTagName("body");
			pageId[0].id = "fg-"+(i+1);
		}
	}else{
		let i = parseInt(document.getElementsByTagName("body")[0].id.split("-")[1]);
			requestData("http://localhost:8000/fridges/X/fg-"+(i),"displayFridge");
			let pageId = document.getElementsByTagName("body");
			pageId[0].id = "fg-"+(i);
	}
}

function displayFridgeContents(){
	let submitButton = document.getElementById("submit_btn").classList.add(fridges.id);
	if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
		let data = xhttp.responseText;  // Data returned by the AJAX request
	
		// Convert the JSON data received to a JavaScript object
	let fridge = JSON.parse(data);
	
	document.getElementById("frigeHeading").innerHTML = "Items in the " + fridge.name;
	let bioInformation = "<span id='fridge_name'>" + fridge.name + "</span><br />" + fridge.address.street + "<br />" + fridge.contact_phone;

	document.getElementById("left-column").firstElementChild.innerHTML = bioInformation;
	let capacity = ((fridge.items.length) / (parseInt(fridge.can_accept_items)));
	capacity = Math.round(capacity * 100);

	document.getElementById("meter").innerHTML = "<span style='width: " + (capacity + 14.2)  + "%'>" + capacity + "%</span>";

	requestData("http://localhost:8000/fridges/X/"+fridge.id,"populateLeft");

  let middleColumn = document.getElementById("middle-column");
	console.log(fridge.id);

	for(let element of fridge.items){
		let itemID = parseInt(element.id);
		let item = element;

		let mdItem = document.createElement("div");
		mdItem.className = "item " + item.type;
		mdItem.id = "item-" + itemID;
		mdItem.innerHTML = "<img src='" + item.img + "' width='100px' height='100px'; />";

		let itemDetails = document.createElement("div");
		itemDetails.id = "item_details";
		itemDetails.innerHTML = "<p id='nm-" + itemID + "'>" + item.name + "</p><p>Quantity: <span id='qt-" + itemID + "'>" + element.quantity + "</span></p><p>Pickup item:</p>";

		let buttonsArea = document.createElement("div");
		buttonsArea.className = "pick_button";
		buttonsArea.id = "pickbtn-" + itemID;

		let increaseButton = document.createElement("button");
		increaseButton.className = "button-plus";
		increaseButton.innerHTML = "<i class='fas fa-plus'></i>";
		increaseButton.addEventListener("click", processIncrease);

		let decreaseButton = document.createElement("button");
		decreaseButton.className = "button-minus";
		decreaseButton.innerHTML = "<i class='fas fa-minus'></i>";
		decreaseButton.addEventListener("click", processDecrease);

		let amount = document.createElement("span");
		amount.className = "amount";
		amount.id = "amount-" + itemID;
		amount.textContent = "0";

		buttonsArea.appendChild(increaseButton);
		buttonsArea.appendChild(amount);
		buttonsArea.appendChild(decreaseButton);

		itemDetails.appendChild(buttonsArea);
		mdItem.appendChild(itemDetails);
		middleColumn.appendChild(mdItem);
	}
	document.getElementById("fridges").classList.add("hidden");
	document.getElementById("fridge_details").classList.remove("hidden");
}else if(xhttp.status === 500){
	console.log(xhttp.responseText);
}
else {
		console.log("The server is not done processing the request.");
}
}

function processIncrease(event) {
	let elementId = event.currentTarget.parentElement.id;
	let numID = elementId.split("-")[1];
	let amount = parseInt(document.getElementById("amount-"+numID).textContent);
	let quantity = parseInt(document.getElementById("qt-" + numID).textContent);
	let name = document.getElementById("nm-" + numID).textContent;

	let elementExists = document.getElementById("pk-item-" + numID);

	if(amount < quantity){
		document.getElementById("amount-"+numID).innerHTML = amount + 1;

		if(elementExists == null){
			let li = document.createElement("li");
			li.setAttribute("id", "pk-item-" + numID);
			li.innerHTML = "<span>" + (amount+1) + "</span> x " + name;
			document.getElementById("items_picked").appendChild(li);
		}
		else {
			document.getElementById("pk-item-"+numID).innerHTML = "<span>" + (amount+ 1) + "</span> x " + name;
		}
	}
	checkCart();
}
function processDecrease(event) {
	let elementId = event.currentTarget.parentElement.id;
	let numID = elementId.split("-")[1];

	let amount = parseInt(document.getElementById("amount-"+numID).textContent);
	let quantity = parseInt(document.getElementById("qt-" + numID).textContent);
	let elementExists = document.getElementById("pk-item-" + numID);
	let name = document.getElementById("nm-" + numID).textContent;

	if(amount > 0){
		document.getElementById("amount-" + numID).innerHTML = parseInt(amount) - 1;
		if(elementExists == null){
				let li = document.createElement("li");
				li.setAttribute("id", "pk-item-" + numID);
				li.innerHTML = "<span>" + parseInt(amount) - 1 + "</span> x " + name;
				document.getElementById("items_picked").appendChild(li);
		}
		else{
			if(amount == 1){
				let item = document.getElementById("pk-item-"+numID);
				console.log("item-"+numID)
				item.remove();
			}
			else{
					document.getElementById("pk-item-"+numID).innerHTML = "<span>" + (amount- 1) + "</span> x " + name;
			}
		}
	}
	checkCart();
}

function populateLeftMenu(){
	if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
		let data = xhttp.responseText;  // Data returned by the AJAX request
		
		// Convert the JSON data received to a JavaScript object
		let fridge = JSON.parse(data);
		console.log(fridge); // print the object, so we can see the fields // print the object, so we can see the fields
		let categories = {};

		for(let element of fridge.items){
		//console.log(element);
		let itemID = parseInt(element.id);
		let item = element;

		let type = item.type;
		if(type in categories == false){
			categories[type] = 1;
		}
		else {
			categories[type]++;
		}
		}

		let leftMenu = document.getElementById("categories");
		for(const[key, value] of Object.entries(categories)){
			let label = key.charAt(0).toUpperCase() + key.slice(1);
			let listItem = document.createElement("li");
			listItem.id = key;
			listItem.className = "category";
			listItem.textContent = label + " (" + value  + ")";

			listItem.addEventListener("click", filterMiddleView);
			leftMenu.appendChild(listItem);
		}
	}else if(xhttp.status === 500){
		console.log(xhttp.responseText);
	}
	else {
			console.log("The server is not done processing the request.");
	}
}

function filterMiddleView(event){
	let elements = document.getElementById("middle-column").children;
	let category = event.target.id;

	for(let i = 0; i < elements.length; i++){
		let item = elements[i];
		if(!item.classList.contains(category)){
			item.classList.add("hidden");
		}
		else{
			item.classList.remove("hidden");
		}
	}
}
