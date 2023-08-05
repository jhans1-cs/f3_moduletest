let ipcontainer = document.getElementById("ip");
let container = document.getElementById("IPAdd")

function getUserIp() {
    // Function to get the user's IP address using an API
    $.getJSON("https://api.ipify.org?format=json", function (data) {
        let ipAddress = data.ip;
        ipcontainer.innerHTML = `${ipAddress}`;
    });
}

var locationData;
var postofficeData;
var postalCardDiv;

document.getElementById("dataDiv").style.display = "none";

async function ShowData() {
    // Function to show the data after clicking "Get Started" button

    // Hide the header section
    document.getElementById("head").style.display = "none";

    var dataDiv = document.getElementById("dataDiv");
    dataDiv.style.display = "block";

    var IPAddress;

    // Get the user's IP address using an API
    await $.getJSON("https://api.ipify.org?format=json", function (data) { 
        IPAddress = data.ip;
        container.innerHTML = `IP Address : ${IPAddress}`;
    });

    // Fetch location data based on the IP address
    
    await fetch(`https://ipinfo.io/${IPAddress}?token=0358bc159d3e65`)
        .then(response => response.json())
        .then(response => locationData = response)
        .catch(() => { alert("Problem with fetching data"); });

    var latLong = locationData.loc.split(",");
    let lat = latLong[0].trim();
    let long = latLong[1].trim(); 

    // Display location data on the webpage
    dataDiv.innerHTML += `
        <div class="infoDiv" id="infoDiv1">
            <div>
                <div>Lat : ${lat}</div>
                <div>Long : ${long}</div>
            </div>
            <div>
                <div>City : ${locationData.city}</div>
                <div>Region : ${locationData.region}</div>
            </div>
            <div>
                <div>Organisation : ${locationData.org}</div>
                <div>Hostname : ${"Jhansi"}</div>
            </div>
        </div>

        <div id="mapDiv">
            <p class="location">Your Current Location</p>
            <iframe
                src="https://maps.google.com/maps?q=${lat}, ${long}&z=15&output=embed"
                frameborder="0"
                id="mapFrame"
            ></iframe>
        </div>
    `;

    dataDiv.innerHTML += '<h3>More Information About You</h3>';
    let datetime_str = new Date().toLocaleString("en-US", {
        timeZone: `${locationData.timezone}`,
    });

    // Fetch postal code data based on the location's postal code
    await fetch(`https://api.postalpincode.in/pincode/${locationData.postal}`)
        .then(response => response.json())
        .then(response => response[0])
        .then(response => {
            dataDiv.innerHTML += `
                <div class="infoDiv" id="infoDiv2">
                    <div>TimeZone : ${locationData.timezone}</div>
                    <div>Date And Time : ${datetime_str}</div>
                    <div>Pincode : ${locationData.postal}</div>
                    <div>
                        Message :
                        <p>${response.Message}</p>
                    </div>
                </div>
                <div id="postalInfoDiv">
                    <h3>Post Offices Near You</h3>
                    <div id="searchbarDiv">
                        <span class="material-symbols-outlined">search</span>
                        <input type="text" placeholder="Search By Name" onkeyup="searchPostOffice()" id="searchBox" />
                    </div>
                    <div id="postalCardDiv"></div>
                </div>
            `;

            postalCardDiv = document.getElementById("postalCardDiv");
            return response.PostOffice;
        })
        .then(data => {
            postofficeData = data;
            data.forEach(element => {
                postalCardDiv.innerHTML += `
                    <div class="card">
                        <div>Name : ${element.Name}</div>
                        <div>Branch Type : ${element.BranchType}</div>
                        <div>Delivery Status : ${element.DeliveryStatus}</div>
                        <div>District : ${element.District}</div>
                        <div>Division : ${element.Division}</div>
                    </div>
                `;
            });
        })
        .catch(() => { alert("Problem with fetching data"); });
}

function searchPostOffice() {
    // Function to search for post offices based on the user's input

    postalCardDiv.innerHTML = "";
    var searchValue = document.getElementById("searchBox").value;

    var filteredPostOffice = postofficeData.filter(item => {
        var stringifiedItem = JSON.stringify(item);
        return stringifiedItem.toLowerCase().includes(searchValue.toLowerCase());
    });

    filteredPostOffice.forEach(element => {
        postalCardDiv.innerHTML += `
            <div class="card">
                <div>Name : ${element.Name}</div>
                <div>Branch Type : ${element.BranchType}</div>
                <div>Delivery Status : ${element.DeliveryStatus}</div>
                <div>District : ${element.District}</div>
                <div>Division : ${element.Division}</div>
            </div>
        `;
    });
}

getUserIp();
