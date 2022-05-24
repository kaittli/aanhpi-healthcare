// declare variables
let mapOptions = {'center': [34.0709,-118.444],'zoom':12}

let mild = L.featureGroup();
let intensive = L.featureGroup();
let preventative = L.featureGroup();
let other = L.featureGroup();

let layers = {
    "Mild Injury": mild,
    "Intensive Care": intensive,
    "Preventative Treatment": preventative,
    "Other": other
}

let circleOptions = {
    radius: 6,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.7
}

// use the variables
const map = L.map('the_map').setView(mapOptions.center, mapOptions.zoom);

let Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});

Stamen_TonerLite.addTo(map)

// add layer control box
L.control.layers(null,layers).addTo(map)

function addMarker(data){
    if(data['What type of medical care are you sharing your experience about?'] == "Small (needing ice, bandages, etc)"){
        circleOptions.fillColor = "magenta"
        mild.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>Mild Injury</h2>`))
        createButtons(data.lat,data.lng,data['What type of medical care are you sharing your experience about?'])
    }
    else if(data['What type of medical care are you sharing your experience about?'] == "Intensive (physical therapy, radiology, etc)"){
        circleOptions.fillColor = "yellow"
        intensive.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>Intensive Care</h2>`))
        createButtons(data.lat,data.lng,data['What type of medical care are you sharing your experience about?'])
    }
    else if(data['What type of medical care are you sharing your experience about?'] == "Preventative (vaccinations, shots, screenings, etc)"){
        circleOptions.fillColor = "cyan"
        preventative.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>Preventative Treatment</h2>`))
        createButtons(data.lat,data.lng,data['What type of medical care are you sharing your experience about?'])
    }
    else{
        circleOptions.fillColor = "black"
        other.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>Other</h2>`))
        createButtons(data.lat,data.lng,data['What type of medical care are you sharing your experience about?'])
    }
    return data
}

function createButtons(lat,lng,title){
    const newButton = document.createElement("button"); // adds a new button
    newButton.id = "button"+title; // gives the button a unique id
    newButton.innerHTML = title; // gives the button a title
    newButton.setAttribute("lat",lat); // sets the latitude 
    newButton.setAttribute("lng",lng); // sets the longitude 
    newButton.addEventListener('click', function(){
        map.flyTo([lat,lng]); //this is the flyTo from Leaflet
    })
    const spaceForButtons = document.getElementById('placeForButtons')
    spaceForButtons.appendChild(newButton);//this adds the button to our page.
}

function addChart(){
    // create the new chart here, target the id in the html called "chart"
    new Chart(document.getElementById("chart"), {
        type: 'pie', //can change to 'bar','line' chart or others
        data: {
            // labels for data here
        labels: ["Mild","Intensive", "Preventative", "Other"],
        datasets: [
            {
            label: "Count",
            backgroundColor: ["green", "red", "blue", "orange"],
            data: [mild, intensive, preventative, other]
            }
        ]
        },
        options: {
            responsive: true, //turn on responsive mode changes with page size
            maintainAspectRatio: false, // if `true` causes weird layout issues
            legend: { display: true },
            title: {
                display: true,
                text: 'Survey Respondants'
            }
        }
    });
}

const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRIHr3uHd7EcxlEEW1sQLev1UarBfMhcdlV4u5lPM-SDsuqsnjhIwoqM8GmUQoMO-G6MxvY1a6MpgVR/pub?output=csv"

function loadData(url){
    Papa.parse(url, {
        header: true,
        download: true,
        complete: results => processData(results)
    })
}

function processData(results){
    console.log(results)
    results.data.forEach(data => {
        console.log(data)
        addMarker(data)
    })
    mild.addTo(map) // add our layers after markers have been made
    intensive.addTo(map) // add our layers after markers have been made  
    preventative.addTo(map) // add our layers after markers have been made  
    other.addTo(map) // add our layers after markers have been made  
    let allLayers = L.featureGroup([mild,intensive,preventative,other]);
    map.fitBounds(allLayers.getBounds());
}

loadData(dataUrl)