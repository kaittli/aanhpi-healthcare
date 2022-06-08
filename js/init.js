// declare variables
let mapOptions = {'center': [34.0709,-118.444],'zoom':12}

//for chart1
let mild = L.featureGroup();
let intensive = L.featureGroup();
let preventative = L.featureGroup();
let other = L.featureGroup();
let asheCare = L.markerClusterGroup();

//for chart2
let yesAsheLayer = L.markerClusterGroup();
let noAsheLayer = L.featureGroup();
let asheVisits = L.markerClusterGroup();

//for chart3
let yesCoverageLayer = L.featureGroup();
let noCoverageLayer = L.featureGroup();
let asheCoverage = L.markerClusterGroup();

let extentCareLayers = {
    "Mild Injury": mild,
    "Intensive Care": intensive,
    "Preventative Treatment": preventative,
    "Other": other,
}

let visitedAsheLayers = {
    "Previously Visited Ashe": yesAsheLayer,
    "Did Not Previously Visit Ashe": noAsheLayer,
}

let coverageLayers = {
    "Covered by UCSHIP/BruinCare": yesCoverageLayer,
    "Not Covered by UCSHIP/BruinCare": noCoverageLayer,
}

// all the layers combined for each chart to add/remove to map

let allCareLayers
let allVisitedAsheLayers
let allCoverageLayers

let mildInjury = 0;
let intensiveCare = 0;
let preventativeTreatment = 0;
let otherCare = 0;
let yesAsheBefore = 0;
let noAsheBefore = 0;
let yesUCSHIP = 0;
let noUCSHIP = 0;

let firstChart

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
let legendForExtentCare = L.control.layers(null,extentCareLayers).addTo(map)
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

function extentOfCare(data){
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
}

function addMarker(data){
    if(data.lat != 0){
    //for Ashe
        switch(data['Have you ever received any kind of medical attention at the Ashe Center before?']){//['Where did you visit the Ashe Center?']){
            case "Yes":
                circleOptions.fillColor = "#833ab4"; //change these depending on yes or no
                yesAsheLayer.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<p>Reason for Choosing Off-Campus Over Ashe: ${data['Is there a reason why you have not sought out medical treatment at the Ashe Center?']}<br/>Experience with Off-Campus Treatment: ${data['How was your experience getting treatment off campus?']}</p>`))
                break;
            case "No":
                circleOptions.fillColor = "#fcb045";  
                noAsheLayer.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<p>Reason for Choosing Off-Campus Over Ashe: ${data['Is there a reason why you have not sought out medical treatment at the Ashe Center?']}<br/>Experience with Off-Campus Treatment: ${data['How was your experience getting treatment off campus?']}</p>`))
                break;
            default:
                console.log("ashe")
                asheVisits.addLayer(L.circleMarker([34.0714005805055,-118.444727043983]))
                break;
        }
        //for Coverage
        switch(data['Are you covered by UCSHIP or BruinCare?']){
            case "Yes":
                circleOptions.fillColor = "#fd1d1d"; //change these depending on yes or no
                yesCoverageLayer.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup('<p>UCSHIP/BruinCare Coverage: Yes</p>'))//data['Are you covered by UCSHIP or BruinCare?'], circleOptions))
                break;
            case "No":
                circleOptions.fillColor = "#ff49c5";
                noCoverageLayer.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup('<p>UCSHIP/BruinCare Coverage: No</p>'))//data['Are you covered by UCSHIP or BruinCare?'], circleOptions))
                break;
            default:
                console.log("ashe")
                asheCoverage.addLayer(L.circleMarker([34.0714005805055,-118.444727043983]))
                break;
        }
    }
    
    if(data.lat != 0){
        if((data['Have you ever received any kind of medical attention at the Ashe Center before?'] == "No") || (data.lat != 0)){
            if(data['What type of medical care are you sharing your experience about?'] == "Small ( ice, bandages, etc)"){
                circleOptions.fillColor = "#833ab4"
                mild.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<p>Type of Treatment: Mild Injury</p>`))
            }
            else if(data['What type of medical care are you sharing your experience about?'] == "Intensive (physical therapy, radiology, etc)"){
                circleOptions.fillColor = "#fd1d1d"
                intensive.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<p>Type of Treatment: Mild Injury</p>`))
            }
            else if(data['What type of medical care are you sharing your experience about?'] == "Preventative (vaccinations, shots, screenings, etc)"){
                circleOptions.fillColor = "#fcb045"
                preventative.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<p>Type of Treatment: Mild Injury</p>`))
            }
            else{
                circleOptions.fillColor = "#ff49c5"
                other.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<p>Type of Treatment: Mild Injury</p>`))
            }
            return data
        }
    }
    else{
        // 🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅
        // step 1 make sure you add all the right data that you need for the popup
        // 🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅
        console.log('ash Sat:!!!!!!!!!!!!!!!')
        // console.log(data)
        console.log(data['Are you satisfied with the quality of care you have received from the Ashe Center? '])
        let fullData = {
            ashSat: data['Are you satisfied with the quality of care you have received from the Ashe Center? '],
            ashWhy: data['Why or why not?'],
            ashExp: data['If you feel comfortable, could you describe your experience(s) seeking out medical attention at the Ashe Center?'],
            ashUCSHIP: data['Are you covered by UCSHIP or BruinCare?'],
            ashFac: data['Do you think that having UCSHIP and/or BruinCare has facilitated your access to the Ashe Center? Why or why not?']
        }
        console.log("ashe")
        asheCare.addLayer(L.circleMarker([34.0714005805055,-118.444727043983],{circleOptions:fullData}))
    }
} 

let theCharts
function addTreatmentChart(){
    // create the new chart here, target the id in the html called "chart"
    theCharts = new Chart(document.getElementById("theCharts"), {
        type: 'pie', //can change to 'bar','line' chart or others
        data: {
            // labels for data here
        labels: ["Mild", "Intensive", "Preventative", "Other"],
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
        labels: ["Visited", "Not Visited"],
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
        labels: ["Yes", "No"],
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
        extentOfCare(data)
        addMarker(data)
    })
    // allCareLayers = L.featureGroup([mild,intensive,preventative,other,asheCare]);

    allCareLayers = L.featureGroup([mild,intensive,preventative,other,asheCare]);
    console.log('🐅🐅🐅🐅🐅')
    console.log(asheCare)
    addCorrectPopup() //initially add pops
    allCareLayers.addTo(map)
    map.fitBounds(allCareLayers.getBounds()); //the other two charts of this is in filter charts

}

// get the ashCare to show up all the time ( * / *****)
// somehow pass in the correct chart to filter the ashCare info
    // this is to show pop-info
// bind 

// 🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅
// step 2 bind the right pop-up depending filter!!!!!!!!!!!!!!!!!
// 🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅
function addCorrectPopup(filter="extent"){
    console.log("addcorrect")
    asheCare.getLayers().forEach(individualMarker => filterPopupOnChartClick(individualMarker, filter))
}

function filterPopupOnChartClick(popupInCluster,filter){
    
    switch (filter){
        case "extent":
            popupInCluster.bindPopup(`<p>Satisfied with Ashe Care: ${popupInCluster.options.circleOptions.ashSat}<br/>Why or Why Not: ${popupInCluster.options.circleOptions.ashWhy}</p>`)
            
            break;
        case "visits":
            popupInCluster.bindPopup(`<p>Experience with Care at Ashe: ${popupInCluster.options.circleOptions.ashExp}</p>`)
            break;
        case "coverage":
            popupInCluster.bindPopup(`<p>UCSHIP/BruinCare Coverage: ${popupInCluster.options.circleOptions.ashUCSHIP}<br/>Whether or Not UCSHIP/BruinCare has Facilitated Access to Ashe: ${popupInCluster.options.circleOptions.ashFac}</p>`)
            break;
    }    
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
        //legendForExtentCare.addTo(map)
        //L.control.layers(null,extentCareLayers).removeFrom(map)
    }
    if (allVisitedAsheLayers != undefined){
        allVisitedAsheLayers.removeLayer() //remove legend after this
        map.removeControl(legendForAshe);
        //legendForAshe.addTo(map)
        //L.control.layers(null,visitedAsheLayers).removeFrom(map)
    }
    
    if (allCoverageLayers != undefined){
        allCoverageLayers.removeLayer()
        map.removeControl(legendForCoverage);
        //legendForCoverage.addTo(map)
        //L.control.layers(null,coverageLayers).removeFrom(map)
    }
    

    //look up how to remove L.control layer

}


// 🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅
// step 3 add set the right filter to the add correct popUp function!!!!!!!!!!!!!!!!!
// 🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅🐅
function filterCharts(e){
    removeChart()
    
    let theChartTarget = e.target.id
    switch (theChartTarget) {
        case "extent":
            addTreatmentChart()
            allCareLayers.addTo(map) //add legend afterwards
            addCorrectPopup('extent')
            break;
        case "visits":
            addAsheChart()
            allVisitedAsheLayers = L.featureGroup([yesAsheLayer,noAsheLayer,asheVisits])
            allVisitedAsheLayers.addTo(map)
            addCorrectPopup('visits')
            map.fitBounds(allVisitedAsheLayers.getBounds())
            break;
        case "coverage":
            addUCSHIPChart()
            allCoverageLayers = L.featureGroup([yesCoverageLayer,noCoverageLayer,asheCoverage])
            allCoverageLayers.addTo(map)
            addCorrectPopup("coverage")
            map.fitBounds(allCoverageLayers.getBounds())
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


    document.getElementById("extent").onclick = function(event){
        filterCharts(event)
        removeMapLayers()
        legendForExtentCare = L.control.layers(null,extentCareLayers).addTo(map)
        
        map.removeLayer(allCoverageLayers)
        map.removeLayer(allVisitedAsheLayers)

        if (allCoverageLayers != undefined){
            map.removeLayer(allCoverageLayers)
        }
        if (allVisitedAsheLayers!= undefined){
            map.removeLayer(allVisitedAsheLayers)
        }
        map.addLayer(asheCare)
    };
    document.getElementById("visits").onclick = function(event){
        filterCharts(event)
        removeMapLayers()
        legendForAshe = L.control.layers(null,visitedAsheLayers).addTo(map)

        map.removeLayer(allCareLayers)
        map.removeLayer(allCoverageLayers)

        if (allCareLayers != undefined){
            map.removeLayer(allCareLayers)
            map.addLayer(asheCare)
        }
        if (allCoverageLayers != undefined){
            map.removeLayer(allCoverageLayers)
            map.addLayer(asheCare)
        }
        map.addLayer(asheCare)
    };
    document.getElementById("coverage").onclick = function(event){
        filterCharts(event)
        removeMapLayers()
        legendForCoverage = L.control.layers(null,coverageLayers).addTo(map)

        map.removeLayer(allCareLayers)
        map.removeLayer(allVisitedAsheLayers)
        map.addLayer(asheCare)
        if (allCareLayers != undefined){
            map.removeLayer(allCareLayers)
            map.addLayer(asheCare)
        }
        if (allVisitedAsheLayers!= undefined){
            map.removeLayer(allVisitedAsheLayers)
            map.addLayer(asheCare)
        }      
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
