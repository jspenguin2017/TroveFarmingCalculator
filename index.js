//Variables
var defaultPrices = [5.4, 840, 3800, 12700, 40000];
var enteredPrices = defaultPrices.slice();
var isValid = [true, true, true, true, true];
//Local storage control
var lsSupport = false;
if(window.localStorage){
  lsSupport = true;
}
var lsRead = function(id, def){
  //If not supported, just return default
  if(!lsSupport){
    return def;
  }
  //Read item and check if it is valid
  var buffer = parseFloat(localStorage.getItem(id));
  if(isNaN(buffer) || !isFinite(buffer) || buffer < 0){
    return def;
  }
  return buffer;
};
var lsWrite = function(id, val){
  //Check if supported
  if(!lsSupport){
    return;
  }
  //Write data
  localStorage.setItem(id, val);
};
//Database
var Database = {
  //Deconstruction values, thanks to the author of: 
  //https://docs.google.com/spreadsheets/d/1G-9Fg8rGDKFV0zweJlWLKy1JLpbqf7pm6H7BxTX_PUc/edit#gid=1022828731
  eyes: 7, //Shadow 1 to 4 all give 7 eyes
  //Flux: fluxS+#level+#stars
  //Shadow Level 1
  fluxS10: 25,
  fluxS11: 35,
  fluxS12: 50,
  fluxS13: 80,
  fluxS14: 110,
  fluxS15: 140,
  //Shadow Level 2
  fluxS20: 100,
  fluxS21: 120,
  fluxS22: 150,
  fluxS23: 200,
  fluxS24: 250,
  fluxS25: 350,
  //Shadow Level 3
  fluxS30: 400,
  fluxS31: 450,
  fluxS32: 500,
  fluxS33: 550,
  fluxS34: 650,
  fluxS35: 750,
  //Shadow Level 4
  fluxS40: 1000,
  fluxS41: 1100,
  fluxS42: 1200,
  fluxS43: 1300,
  fluxS44: 1500,
  fluxS45: 1700,
  //Shadow Level 5 - only need 0 star
  fluxS50: 2000,
  //Forging costs, thanks to the author of: 
  //https://docs.google.com/spreadsheets/d/1G-9Fg8rGDKFV0zweJlWLKy1JLpbqf7pm6H7BxTX_PUc/edit#gid=0
  forgeS1Flux: 75,
  forgeS1Eye: 10,
  forgeS2Flux: 150,
  forgeS2Eye: 15,
  forgeS3Flux: 250,
  forgeS3Eye: 30,
  forgeS4Flux: 400,
  forgeS4Eye: 50,
  //Naming
  S1: "N/A",
  S2: "Twice",
  S3: "Thrice", 
  S4: "Quad", 
  S5: "Penta"
};
//On change validation
var priceValidate = function(oId, index){
  var id = "#" + oId;
  var valueBuffer = parseFloat($(id).val());
  $(id + "Div").removeClass("has-success has-warning has-error");
  $(id + "Icon").removeClass("glyphicon-ok glyphicon-warning-sign glyphicon-remove")
  if(isNaN(valueBuffer) || !isFinite(valueBuffer) || valueBuffer < 0){
    //Not valid
    $(id + "Div").addClass("has-error");
    $(id + "Icon").addClass("glyphicon-remove");
    $(id + "Label").css("color", "#993333");
    isValid[index] = false;
  }else if(valueBuffer < defaultPrices[index] / 2 || valueBuffer > defaultPrices[index] * 2){
    //Warning: price far away from default
    $(id + "Div").addClass("has-warning");
    $(id + "Icon").addClass("glyphicon-warning-sign");
    $(id + "Label").css("color", "#B36B00");
    $(id).val(valueBuffer);
    isValid[index] = true;
    enteredPrices[index] = valueBuffer;
    lsWrite(oId, valueBuffer);
  }else{
    //Passed all tests
    $(id + "Div").addClass("has-success");
    $(id + "Icon").addClass("glyphicon-ok");
    $(id + "Label").css("color", "#008000");
    $(id).val(valueBuffer);
    isValid[index] = true;
    enteredPrices[index] = valueBuffer;
    lsWrite(oId, valueBuffer);
  }
};
//Validate all
var validAll = function(){
  priceValidate("eyePrice", 0);
  priceValidate("twicePrice", 1);
  priceValidate("thricePrice", 2);
  priceValidate("quadPrice", 3);
  priceValidate("pentaPrice", 4);
};
//Math
var roundToString = function(input){
  return (Math.round(input * 1000) / 1000).toString();
};
var getIndexOfMax = function(input){
  var max = input[0];
  var maxIndex = 0;
  for(var i = 1; i < input.length; i++){
    if(input[i] > max){
        maxIndex = i;
        max = input[i];
    }
  }
  return maxIndex;
};
//Kernal
var calculate = function(){
  //Check if prices are valid
  if(!(isValid[0] && isValid[1] && isValid[2] && isValid[3] && isValid[4])){
    //Not valid, scroll to price section
    $("html, body").animate({scrollTop: $("#step1").offset().top}, "fast");
    return;
  }
  //Prices are valid, start calculating
  //Variables
  var shadowLevel = parseInt($("#shadowLevel").val());
  var starNumber = parseInt($("#starNumber").val());
  var starNeeded = 5 - starNumber;
  var profits = []; //Holds profit of each forging method
  var messages = []; //Holds the message to be shown at the end
  var totalFluxGain, totalFluxCosts, buffer; //Variables for calculations
  //Initialize - hide all forging div's
  for(var i = 1; i <= 4; i++){
    $("#outputForge" + i + "Div").css("display", "none");
  }
  //-----Deconstruct Directly-----
  totalFluxGain = 0;
  buffer = 0;
  //Eyes
  buffer = Database["eyes"] * enteredPrices[0];
  $("#outputEyeQuantity0Gain").html("Eyes (" + Database["eyes"] + ")");
  $("#outputEyePrice0Gain").html(roundToString(buffer));
  totalFluxGain += buffer;
  //Flux
  buffer = Database["fluxS" + shadowLevel + starNumber];
  $("#outputFluxQuantity0Gain").html("Flux (" + buffer.toString() + ")");
  $("#outputFluxPrice0Gain").html(roundToString(buffer));
  totalFluxGain += buffer;
  //Forged souls
  $("#outputSoulType0Gain").html((shadowLevel === 1)? Database["S1"] : Database["S" + shadowLevel] + " (1)");
  if(shadowLevel === 1){
    $("#outputSoulPrice0Gain").html("0");
  }else{
    buffer = enteredPrices[shadowLevel - 1];
    $("#outputSoulPrice0Gain").html(roundToString(buffer));
    totalFluxGain += buffer;
  }
  $("#outputTotalGain0").html("<strong>" + roundToString(totalFluxGain) + "</strong>");
  $("#outputDeconProfit").html("<strong>Deconstruct Directly: " + roundToString(totalFluxGain) + " flux profit</strong>");
  $("#outputDeconProfit").css("color", (totalFluxGain > 0)? "#B36B00" : "#993333");
  profits.push(totalFluxGain);
  messages.push("Deconstruct directly is the best choice, your profit is " + roundToString(totalFluxGain) + " flux. ");
  //-----Forge-----
  totalFluxCosts = 0;
  var forgedTime = 0;
  while(shadowLevel < 5){
    //Initialize
    forgedTime += 1;
    //---Costs---
    buffer = 0;
    //Previous Costs
    if(forgedTime !== 1){
      $("#outputPrevious" + forgedTime + "Costs").html(roundToString(totalFluxCosts));
    }
    //Eyes
    buffer = 0;
    if(shadowLevel === 1){
      //Shadow Level 1 costs 500 flux and 50 eyes, unlike other levels
      buffer += 50;
    }
    buffer += Database["forgeS" + shadowLevel + "Eye"] * starNeeded;
    $("#outputEyeQuantity" + forgedTime + "Costs").html("Eyes (" + buffer.toString() + ")");
    $("#outputEyePrice" + forgedTime + "Costs").html(roundToString(buffer * enteredPrices[0]));
    totalFluxCosts += buffer * enteredPrices[0];
    //Flux
    buffer = 0;
    if(shadowLevel === 1){
      //Shadow Level 1 costs 500 flux and 50 eyes, unlike other levels
      buffer += 500;
    }
    buffer += Database["forgeS" + shadowLevel + "Flux"] * starNeeded;
    $("#outputFluxQuantity" + forgedTime + "Costs").html("Flux (" + buffer.toString() + ")");
    $("#outputFluxPrice" + forgedTime + "Costs").html(buffer);
    totalFluxCosts += buffer;
    //Forged souls
    $("#outputSoulType" + forgedTime + "Costs").html((shadowLevel === 1)? Database["S1"] : Database["S" + shadowLevel] + " (2)");
    if(shadowLevel === 1){
      $("#outputSoulPrice" + forgedTime + "Costs").html("0");
    }else{
      buffer = enteredPrices[shadowLevel - 1] * 2;
      $("#outputSoulPrice" + forgedTime + "Costs").html(roundToString(buffer));
      totalFluxCosts += buffer;
    }
    //Total costs
    $("#outputTotalCosts" + forgedTime).html("<strong>" + roundToString(totalFluxCosts) + "</strong>");
    shadowLevel += 1;
    starNumber = 0;
    starNeeded = 5;
    //---Gain---
    buffer = 0;
    totalFluxGain = 0;
    //Eyes
    $("#outputEyeQuantity" + forgedTime + "Gain").html("Eyes (" + Database["eyes"] + ")");
    $("#outputEyePrice" + forgedTime + "Gain").html(roundToString(Database["eyes"] * enteredPrices[0]));
    totalFluxGain += Database["eyes"] * enteredPrices[0];
    //Flux
    buffer = Database["fluxS" + shadowLevel + starNumber];
     $("#outputFluxQuantity" + forgedTime + "Gain").html("Flux (" + buffer.toString() + ")");
    $("#outputFluxPrice" + forgedTime + "Gain").html(buffer);
    totalFluxGain += buffer;
    //Forged souls
    $("#outputSoulType" + forgedTime + "Gain").html(Database["S" + shadowLevel] + " (1)");
    buffer = enteredPrices[shadowLevel - 1];
    $("#outputSoulPrice" + forgedTime + "Gain").html(roundToString(buffer));
    totalFluxGain += buffer;
    //Total
    $("#outputTotalGain" + forgedTime).html("<strong>" + roundToString(totalFluxGain) + "</strong>");
    //Calculate profit
    totalFluxGain -= totalFluxCosts
    $("#outputForge" + forgedTime + "Profit").html("<strong>Forge to Shadow Level " + shadowLevel + ", 0 Stars and Deconstruct: " + 
      roundToString(totalFluxGain) + " flux profit</strong>");
    $("#outputForge" + forgedTime + "Profit").css("color", (totalFluxGain > 0)? "#B36B00" : "#993333");
    profits.push(totalFluxGain);
    messages.push("Forging to Shadow Level " + shadowLevel.toString() + ", 0 stars and deconstruct is the best choice, " + 
      "your profit is " + roundToString(totalFluxGain) + " flux, " + roundToString(totalFluxGain - profits[0]) + 
      " flux more than deconstruct directly. ");
    //Show the table
    $("#outputForge" + forgedTime + "Div").css("display", "inline");
  }
  //Find the best choice and show result
  var indexOfBest = getIndexOfMax(profits);
  if(indexOfBest === 0){
    $("#outputDeconProfit").css("color", "#008000");
  }else{
    $("#outputForge" + indexOfBest + "Profit").css("color", "#008000");
  }
  $("#outputProfit").html("<strong>" + messages[indexOfBest] + "</storng>");
  $("#outputProfit").css("color", "#008000");
  $("#outputMath").css("display", "block");
  $("#outputResultsDiv").css("display", "block");
  $("html, body").animate({scrollTop: $("#step2").offset().top}, "fast");
};
//Init
window.onload = function(){
  //Draw warning if local storage not supported
  if(!lsSupport){
    $("#lsWarningDiv").css("display", "block");
  }
  //Prices Validation
  $("#eyePrice").change(function(){
      priceValidate("eyePrice", 0);
    });
  $("#twicePrice").change(function(){
      priceValidate("twicePrice", 1);
    });
  $("#thricePrice").change(function(){
      priceValidate("thricePrice", 2);
    });
  $("#quadPrice").change(function(){
      priceValidate("quadPrice", 3);
    });
  $("#pentaPrice").change(function(){
      priceValidate("pentaPrice", 4);
    });
  //Write in default prices
  $("#eyePrice").val(lsRead("eyePrice", defaultPrices[0]));
  $("#twicePrice").val(lsRead("twicePrice", defaultPrices[1]));
  $("#thricePrice").val(lsRead("thricePrice", defaultPrices[2]));
  $("#quadPrice").val(lsRead("quadPrice", defaultPrices[3]));
  $("#pentaPrice").val(lsRead("pentaPrice", defaultPrices[4]));
  validAll();
  //Buttons
  $("#theButton").click(calculate);
  $("#btnPriceDefault").click(function(){
    $("#eyePrice").val(defaultPrices[0]);
    $("#twicePrice").val(defaultPrices[1]);
    $("#thricePrice").val(defaultPrices[2]);
    $("#quadPrice").val(defaultPrices[3]);
    $("#pentaPrice").val(defaultPrices[4]);
    validAll();
  });
  $("#btnJumpToChat").click(function(){
    $("html, body").animate({scrollTop: $("#disqusContainer").offset().top}, "fast");
  });
};
