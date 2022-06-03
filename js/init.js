// declare variables
let mapOptions = {'center': [34.0709,-118.444],'zoom':12}

let mild = L.featureGroup();
let intensive = L.featureGroup();
let preventative = L.featureGroup();
let other = L.featureGroup();
let asheCenter = L.markerClusterGroup();

// if (data['Have you ever received any kind of medical attention at the Ashe Center before?'] == Yes){
//     L.circleMarker = L.markerClusterGroup();
// }

let layers = {
    "Mild Injury": mild,
    "Intensive Care": intensive,
    "Preventative Treatment": preventative,
    "Other": other,
}

let mildInjury = 0;
let intensiveCare = 0;
let preventativeTreatment = 0;
let otherCare = 0;
let yesAsheBefore = 0;
let noAsheBefore = 0;
let yesUCSHIP = 0;
let noUCSHIP = 0;

let circleOptions = {
    radius: 6,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.9
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

function asheBefore(data){
    if(data['Have you ever received any kind of medical attention at the Ashe Center before?'] == "Yes"){
        yesAsheBefore += 1;
    }
    else{
        noAsheBefore += 1;
    }
}

function coveredUCSHIP(data){
    if(data['Are you covered by UCSHIP or BruinCare?'] == "Yes"){
        yesUCSHIP += 1;
    }
    else{
        noUCSHIP += 1;
    }
}

function addMarker(data){
    if(data['What type of medical care are you sharing your experience about?'] == "Small (needing ice, bandages, etc)"){
        mildInjury += 1;
    }
    else if(data['What type of medical care are you sharing your experience about?'] == "Intensive (physical therapy, radiology, etc)"){
        intensiveCare += 1;
    }
    else if(data['What type of medical care are you sharing your experience about?'] == "Preventative (vaccinations, shots, screenings, etc)"){
        preventativeTreatment += 1;
    }
    else{
        otherCare += 1;
    }

    if(data.lat != 0){
        if((data['Have you ever received any kind of medical attention at the Ashe Center before?'] == "No") || (data.lat != 0)){
            if(data['What type of medical care are you sharing your experience about?'] == "Small (needing ice, bandages, etc)"){
                circleOptions.fillColor = "#833ab4"
                mild.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<p>Type of Treatment: Mild Injury<br/>Reason for Choosing Off-Campus Over Ashe: ${data['Is there a reason why you have not sought out medical treatment at the Ashe Center?']}<br/>UCSHIP/BruinCare Coverage: ${data['Are you covered by UCSHIP or BruinCare?']}<br/>Experience with Off-Campus Treatment: ${data['How was your experience getting treatment off campus?']}</p>`))
            }
            else if(data['What type of medical care are you sharing your experience about?'] == "Intensive (physical therapy, radiology, etc)"){
                circleOptions.fillColor = "#fd1d1d"
                intensive.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<p>Type of Treatment: Intensive Care<br/>Reason for Choosing Off-Campus Over Ashe: ${data['Is there a reason why you have not sought out medical treatment at the Ashe Center?']}<br/>UCSHIP/BruinCare Coverage: ${data['Are you covered by UCSHIP or BruinCare?']}<br/>Experience with Off-Campus Treatment: ${data['How was your experience getting treatment off campus?']}</p>`))
            }
            else if(data['What type of medical care are you sharing your experience about?'] == "Preventative (vaccinations, shots, screenings, etc)"){
                circleOptions.fillColor = "#fcb045"
                preventative.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<p>Type of Treatment: Preventative Treatment<br/>Reason for Choosing Off-Campus Over Ashe: ${data['Is there a reason why you have not sought out medical treatment at the Ashe Center?']}<br/>UCSHIP/BruinCare Coverage: ${data['Are you covered by UCSHIP or BruinCare?']}<br/>Experience with Off-Campus Treatment: ${data['How was your experience getting treatment off campus?']}</p>`))
            }
            else{
                circleOptions.fillColor = "#ff49c5"
                other.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<p>Type of Treatment: Other Care<br/>Reason for Choosing Off-Campus Over Ashe: ${data['Is there a reason why you have not sought out medical treatment at the Ashe Center?']}<br/>UCSHIP/BruinCare Coverage: ${data['Are you covered by UCSHIP or BruinCare?']}<br/>Experience with Off-Campus Treatment: ${data['How was your experience getting treatment off campus?']}</p>`))
            }
            return data
        }
    }
    else{
        console.log("ashe")
        asheCenter.addLayer(L.circleMarker([34.0714005805055,-118.444727043983]))
    }
} 

function addTreatmentChart(){
    // create the new chart here, target the id in the html called "chart"
    new Chart(document.getElementById("chartTreatment"), {
        type: 'pie', //can change to 'bar','line' chart or others
        data: {
            // labels for data here
        labels: ["Mild","Intensive", "Preventative", "Other"],
        datasets: [
            {
            label: "Count",
            backgroundColor: ["#833ab4", "#fd1d1d", "#fcb045", "#ff49c5"],
            data: [mildInjury, intensiveCare, preventativeTreatment, otherCare] 
            }
        ]
        },
        options: {
            responsive: true, //turn on responsive mode changes with page size
            maintainAspectRatio: false, // if `true` causes weird layout issues
            legend: { display: true },
            plugins: {
                title: {
                    display: true,
                    text: 'Extent of Care'
                }
            }
        }
    });
}

function addAsheChart(){
    // create the new chart here, target the id in the html called "chart"
    new Chart(document.getElementById("chartAshe"), {
        type: 'pie', //can change to 'bar','line' chart or others
        data: {
            // labels for data here
        labels: ["Yes","No"],
        datasets: [
            {
            label: "Count",
            backgroundColor: ["#833ab4", "#fcb045"],
            data: [yesAsheBefore, noAsheBefore]
            }
        ]
        },
        options: {
            responsive: true, //turn on responsive mode changes with page size
            maintainAspectRatio: false, // if `true` causes weird layout issues
            legend: { display: true },
            plugins: {
                title: {
                    display: true,
                    text: 'Previously Received Care at the Ashe Center'
                }
            }
        }
    });
}

function addUCSHIPChart(){
    // create the new chart here, target the id in the html called "chart"
    new Chart(document.getElementById("chartUCSHIP"), {
        type: 'pie', //can change to 'bar','line' chart or others
        data: {
            // labels for data here
        labels: ["Yes","No"],
        datasets: [
            {
            label: "Count",
            backgroundColor: ["#fd1d1d", "#ff49c5"],
            data: [yesUCSHIP, noUCSHIP]
            }
        ]
        },
        options: {
            responsive: true, //turn on responsive mode changes with page size
            maintainAspectRatio: false, // if `true` causes weird layout issues
            legend: { display: true },
            plugins: {
                title: {
                    display: true,
                    text: 'UCSHIP/BruinCare Coverage'
                }
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
        asheBefore(data)
        coveredUCSHIP(data)
        addMarker(data)
    })
    mild.addTo(map) // add our layers after markers have been made
    intensive.addTo(map) // add our layers after markers have been made  
    preventative.addTo(map) // add our layers after markers have been made  
    other.addTo(map) // add our layers after markers have been made  
    asheCenter.addTo(map)
    let allLayers = L.featureGroup([mild,intensive,preventative,other, asheCenter]);
    map.fitBounds(allLayers.getBounds());
    addTreatmentChart()
    addAsheChart()
    addUCSHIPChart()
}

loadData(dataUrl)
