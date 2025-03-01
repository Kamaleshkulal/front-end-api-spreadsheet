# Front-End API Spreadsheet

## Overview
This project provides custom Google Apps Script functions to enhance spreadsheet functionality, including custom calculations, data quality checks, validation, and chart generation.

## Prerequisites
Ensure you have the following installed:
- **Node.js 20.0.0** (Use [NVM](https://github.com/nvm-sh/nvm) to manage Node.js versions)
- **NPM** (Node Package Manager)

## Installation Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/Kamaleshkulal/front-end-api-spreadsheet.git
   ```
2. Navigate to the project directory:
   ```sh
   cd front-end-api-spreadsheet
   ```
3. Use Node.js version 20.0.0:
   ```sh
   nvm use 20.0.0
   ```
4. Install dependencies:
   ```sh
   npm install
   ```
5. Run the development server:
   ```sh
   npm run dev
   ```

Live Backend Server

The backend server for this project is available at:
https://sheetapp.onrender.com/

Ensure the backend server is running when using the application.




## Custom Spreadsheet Functions

### 1. Calculation Functions
- **customSUM(range):** Returns the sum of all numerical values in the given range.
- **customAVERAGE(range):** Returns the average of all numerical values in the range.
- **customMAX(range):** Returns the maximum value in the range.
- **customMIN(range):** Returns the minimum value in the range.
- **customCOUNT(range):** Counts the number of numerical values in the range.

### 2. Data Quality Functions
- **customTRIM(cell):** Removes extra spaces from the given cell.
- **customUPPER(cell):** Converts the text in the cell to uppercase.
- **customLOWER(cell):** Converts the text in the cell to lowercase.
- **removeDuplicates():** Removes duplicate rows from the sheet.
- **findAndReplace(findText, replaceText):** Finds and replaces occurrences of `findText` with `replaceText`.

### 3. Data Entry & Validation
- **validateNumericInput(cell):** Checks if the input is numeric and returns validation status.

### 4. Chart Creation
- **createPieChart(dataRange):** Creates a pie chart using data from the specified range.
- **createBarChart(dataRange):** Creates a bar chart using data from the specified range.
- **createLineChart(dataRange):** Creates a line chart using data from the specified range.

## Usage Instructions
These functions can be used in Google Sheets by pasting the script into the **Apps Script Editor** (Extensions > Apps Script) and running them within a spreadsheet.

## License
This project is open-source and available under the MIT License.



scripts

```sh
function customSUM(range) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var values = sheet.getRange(range).getValues().flat();
  return values.reduce((acc, num) => acc + (isNaN(num) ? 0 : num), 0);
}

function customAVERAGE(range) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var values = sheet.getRange(range).getValues().flat().filter(num => !isNaN(num));
  return values.length ? values.reduce((acc, num) => acc + num, 0) / values.length : 0;
}

function customMAX(range) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var values = sheet.getRange(range).getValues().flat().filter(num => !isNaN(num));
  return Math.max(...values);
}

function customMIN(range) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var values = sheet.getRange(range).getValues().flat().filter(num => !isNaN(num));
  return Math.min(...values);
}

function customCOUNT(range) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var values = sheet.getRange(range).getValues().flat();
  return values.filter(num => !isNaN(num)).length;
}

// ----------------- Data Quality Functions -----------------
function customTRIM(cell) {
  return cell.trim();
}

function customUPPER(cell) {
  return cell.toUpperCase();
}

function customLOWER(cell) {
  return cell.toLowerCase();
}

function removeDuplicates() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var range = sheet.getDataRange();
  var data = range.getValues();
  
  var uniqueData = [];
  var seen = new Set();
  
  for (var i = 0; i < data.length; i++) {
    var row = data[i].join(); // Convert row to string
    if (!seen.has(row)) {
      uniqueData.push(data[i]);
      seen.add(row);
    }
  }
  
  sheet.clearContents();
  sheet.getRange(1, 1, uniqueData.length, uniqueData[0].length).setValues(uniqueData);
}

function findAndReplace(findText, replaceText) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var range = sheet.getDataRange();
  var values = range.getValues();
  
  for (var i = 0; i < values.length; i++) {
    for (var j = 0; j < values[i].length; j++) {
      if (values[i][j] == findText) {
        values[i][j] = replaceText;
      }
    }
  }
  range.setValues(values);
}

// ----------------- Data Entry & Validation -----------------
function validateNumericInput(cell) {
  if (isNaN(cell)) {
    return "Invalid: Not a number";
  }
  return "Valid";
}

// ----------------- Create Charts (Pie, Bar, Line) -----------------
function createPieChart(dataRange) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var chart = sheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(sheet.getRange(dataRange))
      .setPosition(5, 5, 0, 0)
      .setOption('title', 'Pie Chart')
      .setOption('is3D', true)
      .build();
    sheet.insertChart(chart);
  } catch (e) {
    Logger.log("Error: " + e.message);
  }
}

function createBarChart(dataRange) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var chart = sheet.newChart()
      .setChartType(Charts.ChartType.BAR)
      .addRange(sheet.getRange(dataRange))
      .setPosition(10, 5, 0, 0)
      .setOption('title', 'Bar Chart')
      .build();
    sheet.insertChart(chart);
  } catch (e) {
    Logger.log("Error: " + e.message);
  }
}

function createLineChart(dataRange) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var chart = sheet.newChart()
      .setChartType(Charts.ChartType.LINE)
      .addRange(sheet.getRange(dataRange))
      .setPosition(15, 5, 0, 0)
      .setOption('title', 'Line Chart')
      .build();
    sheet.insertChart(chart);
  } catch (e) {
    Logger.log("Error: " + e.message);
  }
}
```
