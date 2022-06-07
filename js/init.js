// declare variables
let mapOptions = {'center': [34.0709,-118.444],'zoom':12}

//for chart1
let mild = L.featureGroup();
let intensive = L.featureGroup();
let preventative = L.featureGroup();
let other = L.featureGroup();
let asheCenter = L.markerClusterGroup();

//for chart2
let yesAsheLayer = L.markerClusterGroup();
let noAsheLayer = L.featureGroup();

//for chart3
let yesCoverageLayer = L.featureGroup();
let noCoverageLayer = L.featureGroup();

let extentCareLayers = {
    "Mild Injury": mild,
    "Intensive Care": intensive,
    "Preventative Treatment": preventative,
    "Other": other,
}

let visitedAsheLayers = {
    "Yes Ashe": yesAsheLayer,
    "No Ashe": noAsheLayer,
}

let coverageLayers = {
    "Yes coverage": yesCoverageLayer,
    "No coverage": noCoverageLayer,
}

// all the layers combined for each chart to add/remove to map

let allCareLayers
let allvisitedAsheLayers
let allcoverageLayers

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
let legendForExtentCare = L.control.layers(null,extentCareLayers).addTo(map);
let legendForAshe = L.control.layers(null,visitedAsheLayers)
let legendForCoverage = L.control.layers(null,coverageLayers)

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
    //for Ashe
        switch(data['Have you ever received any kind of medical attention at the Ashe Center before?']){//['Where did you visit the Ashe Center?']){
            case "Yes":
                circleOptions.fillColor = "purple"; //change these depending on yes or no
                yesAsheLayer.addLayer(L.circleMarker([data.lat,data.lng],circleOptions))//data['Have you ever received any kind of medical attention at the Ashe Center before?'], circleOptions))
            case "No":
                circleOptions.fillColor = "orange";
                noAsheLayer.addLayer(L.circleMarker([data.lat,data.lng],circleOptions))//data['Have you ever received any kind of medical attention at the Ashe Center before?'], circleOptions))
        }
        //for Coverage
        switch(data['Are you covered by UCSHIP or BruinCare?']){
            case "Yes":
                circleOptions.fillColor = "red"; //change these depending on yes or no
                yesCoverageLayer.addLayer(L.circleMarker([data.lat,data.lng],circleOptions))//data['Are you covered by UCSHIP or BruinCare?'], circleOptions))
            case "No":
                circleOptions.fillColor = "pink";
                noCoverageLayer.addLayer(L.circleMarker([data.lat,data.lng],circleOptions))//data['Are you covered by UCSHIP or BruinCare?'], circleOptions))
        }
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
let theCharts

function addTreatmentChart(){
    // create the new chart here, target the id in the html called "chart"
    theCharts = new Chart(document.getElementById("theCharts"), {
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
let secondChart
function addAsheChart(){
    // create the new chart here, target the id in the html called "chart"
    theCharts = new Chart(document.getElementById("theCharts"), {
        type: 'pie', //can change to 'bar','line' chart or others
        data: {
            // labels for data here
        labels: ["Visited","Not Visited"],
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
let thirdChart
function addUCSHIPChart(){
    // create the new chart here, target the id in the html called "chart"
    theCharts = new Chart(document.getElementById("theCharts"), {
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
    allCareLayers = L.featureGroup([mild,intensive,preventative,other, asheCenter]);
    allCareLayers.addTo(map)
    map.fitBounds(allCareLayers.getBounds()); //the other two charts of this is in filter charts

}

//make three buttons on top and have those connect to the pie charts so when you click on a slice, it filters the data on the map, clicking the button will show one pie chart at time
loadData(dataUrl)
addEventListeners()

function removeChart(){
    if (theCharts){
        theCharts.destroy()
    }
}

function removeMapLayers(){
    // map.removeMapLayers()
    if (allCareLayers != undefined){
        allCareLayers.removeLayer()
        map.removeControl(legendForExtentCare);
        
        // legendForExtentCare.addTo(map)
        
        //L.control.layers(null,extentCareLayers).removeFrom(map)
    }
    if (allvisitedAsheLayers != undefined){
        allvisitedAsheLayers.removeLayer() //remove legend after this
        map.removeControl(legendForAshe);
        // legendForAshe.addTo(map)
        //L.control.layers(null,visitedAsheLayers).removeFrom(map)
    }
    
    if (allcoverageLayers != undefined){
        allcoverageLayers.removeLayer()
        map.removeControl(legendForCoverage);
        // legendForCoverage.addTo(map)
        // L.control.layers(null,coverageLayers).removeFrom(map)
        
    }

    //look up how to remove L.control layer

}

function filterCharts(e){
    removeChart()
    
    let theChartTarget = e.target.id
    switch (theChartTarget) {
        case "extent":
            addTreatmentChart()
            allCareLayers.addTo(map) //add legend afterwards
            break;
        case "visits":
            addAsheChart()
            allvisitedAsheLayers = L.featureGroup([yesAsheLayer,noAsheLayer]);
            allvisitedAsheLayers.addTo(map)
            map.fitBounds(allvisitedAsheLayers.getBounds());
            break;
        case "coverage":
            addUCSHIPChart()
            allcoverageLayers = L.featureGroup([yesCoverageLayer,noCoverageLayer]);
            allcoverageLayers.addTo(map)
            map.fitBounds(allcoverageLayers.getBounds());
            break;
    }
}

// all mapLayers
// allCareLayers
// allcoverageLayers
// allvisitedAsheLayers

//legend controls
// extentCareLayers
// visitedAsheLayers 
// coverageLayers 


function addEventListeners(){
    document.getElementById("extent").onclick = function (event) {
        filterCharts(event)
        removeMapLayers()

        legendForExtentCare = L.control.layers(null,extentCareLayers).addTo(map)
        
    };
    document.getElementById("visits").onclick = function (event) {
        filterCharts(event)
        removeMapLayers()
        legendForAshe = L.control.layers(null,visitedAsheLayers).addTo(map)
        
        map.removeLayer(allCareLayers)
        if (allvisitedAsheLayers!= undefined){
            map.removeLayer(allvisitedAsheLayers)
        }
        // map.removeLayer(allcoverageLayers)
        asheCenter.addTo(map)
    };
    document.getElementById("coverage").onclick = function(event) {
        filterCharts(event)
        removeMapLayers()
        
        if (allCareLayers != undefined){
            map.removeLayer(allCareLayers)
        }
        if (visitedAsheLayers != undefined){
            map.removeLayer(visitedAsheLayers)
        }
        legendForCoverage = L.control.layers(null,coverageLayers).addTo(map)
    };
}

//event listener for the chart clicks, prob do not have time for this
// document.getElementById("chartTreatment").onclick = function (evt) {
//     let activePoints = firstChart.getElementsAtEventForMode(evt, 'point', firstChart.options);
//     // console.log(activePoints)
//     let label = firstChart.data.labels[activePoints[0].index];
//     console.log(label)

//     // change the chart based on the label clicked
//     // reloadChart(label)
//     // createloadMap(label)
// };

// document.getElementById("chartAshe").onclick = function (evt) {
//     let activePoints = secondChart.getElementsAtEventForMode(evt, 'point', secondChart.options);
//     // console.log(activePoints)
//     let label = secondChart.data.labels[activePoints[0].index];
//     console.log(label)

//     // reloadChart
//     // createloadMap
// };

// document.getElementById("chartUCSHIP").onclick = function (evt) {
//     let activePoints = thirdChart.getElementsAtEventForMode(evt, 'point', secondChart.options);
//     // console.log(activePoints)
//     let label = thirdChart.data.labels[activePoints[0].index];
//     console.log(label)

//     // reloadChart
//     // createloadMap
// };
