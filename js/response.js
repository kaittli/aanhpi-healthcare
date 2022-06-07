const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRIHr3uHd7EcxlEEW1sQLev1UarBfMhcdlV4u5lPM-SDsuqsnjhIwoqM8GmUQoMO-G6MxvY1a6MpgVR/pub?output=csv"
const ts = "Timestamp";
const q1 = "Are you satisfied with the quality of care you have received from the Ashe Center? ";
const q2 = "Why or why not?";
const q3 = "If you feel comfortable, could you describe your experience(s) seeking out medical attention at the Ashe Center?";
const q4 = "Do you think that having UCSHIP and/or BruinCare has facilitated your access to the Ashe Center? Why or why not?";
const q5 = "Have you ever received any kind of medical attention at the Ashe Center before?"
const q6 = "Have you sought medical treatment elsewhere during your time at UCLA (on-campus/off-campus)?";
const q7 = "Please share the most recent location where you have received medical attention during your time at UCLA (full address).";
const q8 = "Is there a reason why you have not sought out medical treatment at the Ashe Center?";
const q9 = "How was your experience getting treatment off campus?"; 
const q10 = "Are you covered by UCSHIP or BruinCare?";

function loadData(url){
    Papa.parse(url, {
        header: true,
        download: true,
        complete: results => processData(results)
    });
}

function processData(results){
    console.log(results);
    createTables(results.data);
}
//make it so that this function only pertains to responses where people said yes to ashe
function createTables(data){
    const newTable = document.createElement("table");
    const tableTitle = document.createElement("caption");
    tableTitle.innerHTML = "<p>Anonymized Responses</p>";
    tableTitle.classList.add('response-table-title');
    newTable.classList.add('response-table');
    newTable.appendChild(tableTitle);
    
    //making the description
    const tableDescription = document.createElement("caption");
    tableDescription.innerHTML = "<p>Curious about individuals' experiences specific to the Ashe Center? Read more!</p>";
    tableDescription.classList.add('response-table-description');
    newTable.appendChild(tableDescription);

    const thead = document.createElement("thead");
    const theadRow = document.createElement("tr");
    //making the headers
    const tsHead = document.createElement("th");
    tsHead.innerHTML = `<p>${ts}</p>`;
    theadRow.appendChild(tsHead); // Add title to table row
    thead.appendChild(theadRow); // Add table head row to table head
    newTable.appendChild(thead); // Add table head to table
    tsHead.classList.add('title');

    const q1Head = document.createElement("th");
    q1Head.innerHTML = `<p>${q1}</p>`;
    theadRow.appendChild(q1Head); 
    thead.appendChild(theadRow); 
    newTable.appendChild(thead);
    q1Head.classList.add('title');

    const q2Head = document.createElement("th");
    q2Head.innerHTML = `<p>${q2}</p>`;
    theadRow.appendChild(q2Head); 
    thead.appendChild(theadRow); 
    newTable.appendChild(thead);
    q2Head.classList.add('title');

    const q3Head = document.createElement("th");
    q3Head.innerHTML = `<p>${q3}</p>`;
    theadRow.appendChild(q3Head); 
    thead.appendChild(theadRow); 
    newTable.appendChild(thead);
    q3Head.classList.add('title');

    const q4Head = document.createElement("th");
    q4Head.innerHTML = `<p>${q4}</p>`;
    theadRow.appendChild(q4Head); 
    thead.appendChild(theadRow); 
    newTable.appendChild(thead);
    q4Head.classList.add('title');

    const newTable2 = document.createElement("table");
    //making the description
    const tableDescription2 = document.createElement("caption");
    tableDescription2.innerHTML = "<br><br><p>What about individuals' medical care experiences at locations other than the Ashe Center around UCLA?</p>";
    tableDescription2.classList.add('response-table-description');
    newTable2.appendChild(tableDescription2);
    const thead2 = document.createElement("thead");
    const theadRow2 = document.createElement("tr");
    //making the headers
    const tsHead2 = document.createElement("th");
    tsHead2.innerHTML = `<p>${ts}</p>`;
    theadRow2.appendChild(tsHead2); // Add title to table row
    thead2.appendChild(theadRow2); // Add table head row to table head
    newTable2.appendChild(thead2); // Add table head to table
    tsHead2.classList.add('title');

    const q6Head = document.createElement("th");
    q6Head.innerHTML = `<p>${q6}</p>`;
    theadRow2.appendChild(q6Head); 
    thead2.appendChild(theadRow2); 
    newTable2.appendChild(thead2);
    q6Head.classList.add('title');

    const q7Head = document.createElement("th");
    q7Head.innerHTML = `<p>${q7}</p>`;
    theadRow2.appendChild(q7Head); 
    thead2.appendChild(theadRow2); 
    newTable2.appendChild(thead2);
    q7Head.classList.add('title');

    const q8Head = document.createElement("th");
    q8Head.innerHTML = `<p>${q8}</p>`;
    theadRow2.appendChild(q8Head); 
    thead2.appendChild(theadRow2); 
    newTable2.appendChild(thead2);
    q8Head.classList.add('title');

    const q9Head = document.createElement("th");
    q9Head.innerHTML = `<p>${q9}</p>`;
    theadRow2.appendChild(q9Head); 
    thead2.appendChild(theadRow2); 
    newTable2.appendChild(thead2);
    q9Head.classList.add('title');

    const q10Head = document.createElement("th");
    q10Head.innerHTML = `<p>${q10}</p>`;
    theadRow2.appendChild(q10Head); 
    thead2.appendChild(theadRow2); 
    newTable2.appendChild(thead2);
    q10Head.classList.add('title');

    // DATA IS THE ENTIRE GOOGLE SHEETS DATA
    data.forEach(row => {
        const newTableRow = document.createElement("tr");
        const tsField = document.createElement("td");
        tsField.innerHTML = `<p>${row[ts]}</p>`;
        tsField.classList.add('borders');
        newTableRow.appendChild(tsField);
        
        if (row[q5].includes('Yes')) {
            [q1, q2, q3, q4].forEach(question => {
                const qField = document.createElement("td");
                qField.classList.add('borders');
                if (!row[question]) {
                    qField.innerHTML = `<p>N/A</p>`;
                } else {
                    qField.innerHTML = `<p>${row[question]}</p>`;
                }
                newTableRow.appendChild(qField);
            });
            newTable.appendChild(newTableRow);
        } else {
            [q6, q7, q8, q9, q10].forEach(question => {
                const qField = document.createElement("td");
                qField.classList.add('borders');
                if (!row[question]) {
                    qField.innerHTML = `<p>N/A</p>`;
                } else {
                    qField.innerHTML = `<p>${row[question]}</p>`;
                }
                newTableRow.appendChild(qField);
            });
            newTable2.appendChild(newTableRow);
        }
            
    });
    
    const spaceForTable = document.getElementById('main1');
    spaceForTable.appendChild(newTable); //this adds the table to our page
    spaceForTable.appendChild(newTable2); //this adds the table to our page
}

loadData(dataUrl);
