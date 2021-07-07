//SETUP
const serverURL = 'https://ifixit.snipe-it.io/';
const apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMjIwMWNkYzRkYjE5OWZjMGJiNzI4ODg4ZDk4MDljMDYzZGQ3MWRjY2M2NGI1YWUxYmFjNmI3MGUyMTc3NzZlYTk4Y2MzZWEyNzcxODVmZWQiLCJpYXQiOjE2MTI1NjI2NzAsIm5iZiI6MTYxMjU2MjY3MCwiZXhwIjoyMjQzNzE0NjcwLCJzdWIiOiIyMTQiLCJzY29wZXMiOltdfQ.TBUCsrev3Wqy0tIdQ-oZqh0FOZMFc9MaWHmrxaJ7YvJ0hPOtcO3enzTpmbDFseV9aRF9Roh7MlW0qFwdggKAcgFc9RGEOd3GysvZY_V3WHEGDtPzjZFCDi_C9gDnRVuInzhqqX0FYsgMPsRgrk2vlA3Q-1_OGGmwBo68HSydr-o-CKOmvmljIQGh95wLSHexjLT_TMD6sc05b9dxkvLJFeFmr5u2POy95CBlNmyrvPqdAVngNAiTdgzyx2l86GrNcuaT6repbJRinESccYpnBNcmxrgMOqgD32VG8PsFpdefhXFalgX9pY0fRb85aT2bOlQTnXHatBYzMNsjLKfpLYerfwoXwC070nfelTGChaSgpJtUghcUtYGC2R-yqZc2xjvTXaOQxLDTpBMhHyndBJu5-5DWuelkxprDgWl7T4pCH04rR5NqYHFTkuZoH12ooOB-uF_dzHw5hHyIbMImJu213nPuIDWGAuAGpcAZ5OfHh1PuApL5gPyosZhZBBARfgpmLgwnAdO3tz2QIgh1WsjgF2wadb0PcAhlY-MQlWCq_3CbYxuUa_2ppLsgr0yZD0KcJbB4Ipc3BXdiGOyqB1-7Ud6A8KVfUETPPbiJmLyCBn-nTI9FM-TpGUOOTAStkj8WBohK4RU4Wf9QA5lWvqqCW3tnXQMFLD3UkIbcFkw'

function onOpen(e) {
  createCommandsMenu();
}

//Create a menu option on the sheet to run the runGetAssetsByDepartment function
function createCommandsMenu() {
  var ui = SpreadsheetApp.getUi();
      ui.createMenu('Run Script')
      .addItem('Get Hardware', 'getHardwareV2')
      .addToUi();
}

function testGetHardware() {
  var url = serverURL + 'api/v1/hardware';
  var headers = {
    "Accept" : 'application/json',
    "Content-Type" : 'application/json',
    "Authorization" : "Bearer " + apiKey
  };

  var options = {
    "method" : "GET",
    "contentType" : "application/json",
    "headers" : headers
  };

  var response = JSON.parse(UrlFetchApp.fetch(url, options));
  var rows = response.rows;
  let assetCount = response.total;  

  console.log(rows);

  
}

function getHardwareV2(){
  
  // Make API active sheet
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('API');
  //sheet.clearContents();
  //sheet.appendRow(['ID','Asset Name','Asset Tag','Supplier','Category','Manufacturer','Status','Status_Meta','Creation Date','School','Instructor','Checkout Date','Priority']);
  
  // Setup API pull, sample pull for limit
  var headers = {
    "Authorization" : "Bearer " + apiKey
  };
  
  var options = {
    "method" : "GET",
    "contentType" : "application/json",
    "headers" : headers
  };
  
  
  // Declare arrays
  let bigArray = []
  let curAss = []
  let finalArray = []
  
  // Pull database into bigArray
  for (let i = 0; i < 12;i++) {  
    var url = serverURL + 'api/v1/hardware?offset=' + i*500;
  //nice  
    var response = JSON.parse(UrlFetchApp.fetch(url, options));
    var rows = response.rows;
    let assetCount = response.total;
  
    bigArray = bigArray.concat(rows);
  
  };

  // Convert database JSON objects into an array of 5348 arrays with 13 elements each
  for (var k=0; k<bigArray.length; k++){
    curAss = []
    curAss.push(bigArray[k].id);
    curAss.push(bigArray[k].name);
    curAss.push(bigArray[k].asset_tag);
    if (typeof bigArray[k].supplier == 'object' && bigArray[k].supplier != null && typeof bigArray[k].supplier.name == 'string') {
      curAss.push(bigArray[k].supplier.name);
    } else {curAss.push('')};
    if (typeof bigArray[k].category == 'object' && bigArray[k].category != null && typeof bigArray[k].category.name == 'string') {
      curAss.push(bigArray[k].category.name);
    } else {curAss.push('')};
    if (typeof bigArray[k].manufacturer == 'object' && bigArray[k].manufacturer != null && typeof bigArray[k].manufacturer.name == 'string') {
      curAss.push(bigArray[k].manufacturer.name);
    } else {curAss.push('')};
    curAss.push(bigArray[k].status_label.name);
    curAss.push(bigArray[k].status_label.status_meta);
    curAss.push(bigArray[k].created_at.datetime);
    if (bigArray[k].location != null) {
      curAss.push(bigArray[k].location.name);
    } else {curAss.push('')};
    if (bigArray[k].assigned_to != null) {
      curAss.push(bigArray[k].assigned_to.name);
    } else {curAss.push('')};
    if (bigArray[k].last_checkout != null) {
      curAss.push(bigArray[k].last_checkout.datetime);
    } else {curAss.push('')};
    if (typeof bigArray[k].custom_fields.Priority != 'undefined') {
      curAss.push(bigArray[k].custom_fields.Priority.value);    
    } else {curAss.push('')};
    
    finalArray.push(curAss);
    
//    if (k == 2 || k == 1103 || k = 1251 || k == bigArray.length-1) {
//      console.log(curAss);
//      console.log(finalArray[0],finalArray[1]);
//    }
  };
  //console.log(bigArray[0],bigArray[1251]);
  //console.log(finalArray[0],finalArray[1103]);
  sheet.getRange("'API'!A2:M" + (bigArray.length+1)).setValues(finalArray);
 
};
