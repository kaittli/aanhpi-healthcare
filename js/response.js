const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRIHr3uHd7EcxlEEW1sQLev1UarBfMhcdlV4u5lPM-SDsuqsnjhIwoqM8GmUQoMO-G6MxvY1a6MpgVR/pub?output=csv"
const ts = "Timestamp";
const q1 = "Are you satisfied with the quality of care you have received from the Ashe Center? ";
const q2 = "Why or why not?";
const q3 = "If you feel comfortable, could you describe your experience(s) seeking out medical attention at the Ashe Center?";
const q4 = "Do you think that having UCSHIP and/or BruinCare has facilitated your access to the Ashe Center? Why or why not?";

function loadData(url){
    Papa.parse(url, {
        header: true,
        download: true,
        complete: results => processData(results)
    });
}

function processData(results){
    console.log(results);
    createTable(results.data);
}

function createTable(data) {
    const newTable = document.createElement("table");
    // DATA IS THE ENTIRE GOOGLE SHEETS DATA
    data.forEach(row => {
        const newTableRow = document.createElement("tr");
        const tsField = document.createElement("td");
        tsField.innerHTML = `<p>${row[ts]}</p>`;
        const q1Field = document.createElement("td");
        q1Field.innerHTML = `<p>${row[q1]}</p>`;
        const q2Field = document.createElement("td");
        q2Field.innerHTML = `<p>${row[q2]}</p>`;
        const q3Field = document.createElement("td");
        q3Field.innerHTML = `<p>${row[q3]}</p>`;
        const q4Field = document.createElement("td");
        q4Field.innerHTML = `<p>${row[q4]}</p>`;
        
        newTableRow.appendChild(tsField);
        newTableRow.appendChild(q1Field);
        newTableRow.appendChild(q2Field);
        newTableRow.appendChild(q3Field);
        newTableRow.appendChild(q4Field);
        
        newTable.appendChild(newTableRow);
    });
    const spaceForTable = document.getElementById('main1');
    spaceForTable.appendChild(newTable); //this adds the table to our page
}

loadData(dataUrl);