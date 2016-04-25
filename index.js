//Initialize variables
var names = ["Eye", "Twice", "Thrice", "Quad", "Penta", "Flame", "Radiant Soul"];
var prices = [3, 130, 2000, 8500, 26400, 2900, 81000]; //Default prices
var colors = {green: "#008000", yellow: "#B36B00", red: "#993333"};
var priceRows = [];
var priceRowFeedback = {
  success: ["glyphicon-ok", "has-success", colors.green], 
  warning: ["glyphicon-warning-sign", "has-warning", colors.yellow], 
  error: ["glyphicon-remove", "has-error", colors.red]
};
var lsSupport = false;
//Algorithms
var isPrice = function(price){
  return !isNaN(price) && isFinite(price) && price >= 0;
};
var roundToString = function(input){
  return (Math.round(input * 1000) / 1000).toString();
};
//Local storage control
var lsRead = function(id, def){
    //If not supported, just return default
    if(!lsSupport){
      return def;
    }
    //Read item and check if it is valid
    var price = parseFloat(localStorage.getItem(id));
    if(!isPrice(price)){
      return def;
    }else{
      return price;
    }
  };
  var lsWrite = function(id, val){
    if(lsSupport){
      localStorage.setItem(id, val);
    }
  };
//Price row object
var PriceRow = function(name, def){
  //Initialize variables
  this.defPrice = def;
  this.enteredPrice = lsRead("Cat_Forger_" + name, def);
  this.isValid = false;
  //Create elements
  this.name = $("<td>").html("<strong>" + name + "</strong>");
  this.text = name;
  this.input = $("<input type='text'>").addClass("form-control");
  this.icon = $("<span>").addClass("glyphicon form-control-feedback");
  this.inputDiv = $("<div>").addClass("form-group has-feedback").append(this.input, this.icon);
  //Functions
  this.drawFeedback = function(feedback){
    //Remove old feedbacks
    this.icon.removeClass("glyphicon-ok glyphicon-warning-sign glyphicon-remove");
    this.inputDiv.removeClass("has-success has-warning has-error");
    //Draw new feedbacks
    this.icon.addClass(priceRowFeedback[feedback][0]);
    this.inputDiv.addClass(priceRowFeedback[feedback][1]);
    this.name.css("color", priceRowFeedback[feedback][2]);
  };
  this.updatePrice = function(price){
    this.input.val(price);
    this.enteredPrice = price;
    lsWrite("Cat_Forger_" + this.text, price);
  };
  this.validate = function(){
    var priceBuffer = parseFloat(this.input.val());
    if(!isPrice(priceBuffer)){
      //Invalid data
      this.isValid = false;
      this.drawFeedback("error");
    }else if(priceBuffer < (this.defPrice / 2) || priceBuffer > (this.defPrice * 2)){
      //Valid but off from default
      this.isValid = true;
      this.drawFeedback("warning");
      this.updatePrice(priceBuffer);
    }else{
      //Valid
      this.isValid = true;
      this.drawFeedback("success");
      this.updatePrice(priceBuffer);
    }
  };
  this.restoreDef = function(){
    this.input.val(this.defPrice);
    this.validate();
  };
  //Draw table row and put in data
  $("#priceTbody").append(
    $("<tr>").append(
      this.name, 
      $("<td>").append(this.inputDiv)
    )
  );
  //Set in price
  this.input.val(this.enteredPrice);
  this.validate();
  //Bind events
  this.input.change((function(){
    this.validate();
  }).bind(this));
};
getPrice = function(mat){
  return priceRows[names.indexOf(mat)].enteredPrice;
}
//Forge object
var Forge = function(rarity, star){
  //Initialize variables
  this.rarity = rarity;
  this.star = star;
  this.totalCost = 0;
  //Return mat from deconstructing now
  this.deconstruct = function(){
    //Get material list
    var mat = [
      db("decon", "Eye", this.rarity), 
      db("decon", "Flux", this.rarity), 
      db("decon", "Soul", this.rarity)
    ];
    //Calculate total gain in Flux
    var totalFluxGain = (mat[0] * getPrice("Eye")) + (mat[1]);
    //Add Soul price
    if(mat[2] !== "N/A"){
      totalFluxGain += getPrice(mat[2]);
    }
    mat.push(totalFluxGain);
    //Return: [Eye count, Flux count, Soul name, total value in Flux]
    return mat;
  };
  //Forge to next level
  this.forge = function(){
    //Initialize variables
    var needStar = 5 - this.star;
    var subTotal = 0;
    var priceBuffer;
    var mat = [];
    //Eyes
    mat.push(db("forge", "Eye", this.rarity) * needStar);
    priceBuffer = getPrice("Eye") * mat[0];
    subTotal += priceBuffer;
    mat.push(priceBuffer);
    //Flux
    mat.push(db("forge", "Flux", this.rarity) * needStar);
    subTotal += mat[2];
    //Others
    if(this.rarity === 1){ //500 Flux 50 Eyes
      //Eye
      mat[0] += 50;
      priceBuffer = getPrice("Eye") * 50;
      subTotal += priceBuffer;
      mat[1] += priceBuffer;
      //Flux
      mat[2] += 500;
      subTotal += 500;
      //Others
      mat.push("N/A");
      mat.push(0);
    }else if(this.rarity !== 5){ //2 Souls
      //Soul type needed is the same: Shadow Level 2 decompose to 1 Twice and need 2 Twice to forge it to next tier
      mat.push(db("decon", "Soul", this.rarity));
      priceBuffer = getPrice(mat[3]) * 2;
      mat[3] += " (2)";
      subTotal += priceBuffer;
      mat.push(priceBuffer);
    }else{ //3 Penta 3 Flames
      mat.push("Penta (3) and Flame (3)");
      priceBuffer = getPrice(db("decon", "Soul", 5)) * 3 + getPrice(names[5]) * 3;
      subTotal += priceBuffer;
      mat.push(priceBuffer);
    }
    //Update variables
    this.totalCost += subTotal;
    this.rarity += 1;
    this.star = 0;
    //Return: [Eye count, Eye price, Flux count, Others count, Others price]
    return mat;
  };
};
//Database
var db = function(action, mat, rarity){
  if(action === "decon"){
    if(mat === "Eye"){
      return (rarity === 6)? 0 : 7;
    }else if(mat === "Flux"){
      switch(rarity){
        case 1: return 35;
        case 2: return 75;
        case 3: return 250;
        case 4: return 600;
        case 5: return 1000;
        case 6: return 1200; //Radiant
      }
    }else if(mat === "Soul"){
      switch(rarity){
        case 1: return "N/A";
        case 2: return names[1];
        case 3: return names[2];
        case 4: return names[3];
        case 5: return names[4];
        case 6: return names[6];
      }
    }
  }else if(action === "forge"){
    if(mat === "Eye"){
      switch(rarity){
        case 1: return 10;
        case 2: return 15;
        case 3: return 30;
        case 4: return 50;
        case 5: return 60;
      }
    }else if(mat === "Flux"){
      switch(rarity){
        case 1: return 150;
        case 2: return 200;
        case 3: return 250;
        case 4: return 400;
        case 5: return 500;
      }
    }
  }
};
//Draw math div
var drawMathDiv = function(){
  var div = $("#mathContainerDiv");
  var direction, prevCostsBuffer, titleBuffer;
  for(var i = 0; i < 7; i++){
    //Add br for first
    if(i === 0){
      div.append("<br>");
    }
    //One for costs one for gain
    for(var ii = 0; ii < 2; ii++){
      //No costs for first one
      if(i === 0 && ii === 0){
        continue;
      }
      //Title
      if(i === 0 || ii === 0){
        titleBuffer = $("<p>").append($("<strong>").attr("id", "outText" + i.toString()));
      }else{
        titleBuffer = "";
      }
      //Previous costs
      if(i > 1 && ii === 0){
        prevCostsBuffer = $("<tr>").append(
          $("<td>").html("Previous Costs"), 
          $("<td>").attr("id", "outPrevCosts" + i.toString())
        );
      }else{
        prevCostsBuffer = "";
      }
      direction = (ii === 0)? "Costs" : "Gain";
      div.append(
        $("<div>").addClass("mathTableDiv").attr("id", "out" + direction + "Div" + i.toString()).append(
          //Draw title
          titleBuffer, 
          $("<p>").html((ii === 0)? "Costs in forging: " : "Gain from deconstructing: "), 
          //Draw table
          $("<table>").addClass("table table-hover").css("max-width", "600px").append(
            $("<thead>").append(
              $("<tr>").append(
                $("<th>").css("width", "65%").html("Material"), 
                $("<th>").css("width", "35%").html(direction + " (in Flux)")
              )
            ), 
            $("<tbody>").append(
              prevCostsBuffer,
              $("<tr>").append(
                $("<td>").attr("id", "outEye" + direction + "Count" + i.toString()), 
                $("<td>").attr("id", "outEye" + direction + "Price" + i.toString())
              ), 
              $("<tr>").append(
                $("<td>").attr("id", "outFlux" + direction + "Count" + i.toString()), 
                $("<td>").attr("id", "outFlux" + direction + "Price" + i.toString())
              ), 
              $("<tr>").append(
                $("<td>").attr("id", "outSoul" + direction + "Type" + i.toString()), 
                $("<td>").attr("id", "outSoul" + direction + "Price" + i.toString())
              ), 
              $("<tr>").append(
                $("<td>").html("<strong>Total " + direction + " in Flux</strong>"), 
                $("<td>").append(
                  $("<strong>").attr("id", "outTotal" + direction + i.toString())
                )
              )
            )
          )
        )
      );
    }
  }
  //Hide math div
  $("#mathMainDiv").hide();
};
//Calculate
var calculate = function(){
  //Check if prices are valid
  for(var i = 0; i < priceRows.length; i++){
    if(!priceRows[i].isValid){
      $("#mathMainDiv").hide();
      $("#outResultsDiv").hide();
      $("html, body").animate({scrollTop: $("#step1P").offset().top}, "fast");
      return;
    }
  }
  //Initialize forge
  var forge = new Forge(parseInt($("#raritySelect").val()), parseInt($("#starSelect").val()));
  //Hide all tables
  $(".mathTableDiv").hide();
  //Loop until Radiant is reached
  var finalMessages = [];
  var profitList = [];
  var data, costs, gain, total, totalBuffer;
  for(var i = 0; forge.rarity < 6; i++){ //i is forged time
    //Forge
    if(i !== 0){
      $("#outPrevCosts" + i.toString()).html(roundToString(forge.totalCost));
      data = forge.forge();
      $("#outEyeCostsCount" + i.toString()).html("Eye (" + data[0].toString() + ")");
      $("#outEyeCostsPrice" + i.toString()).html(roundToString(data[1]));
      $("#outFluxCostsCount" + i.toString()).html("Flux (" + data[2].toString() + ")");
      $("#outFluxCostsPrice" + i.toString()).html(data[2].toString());
      $("#outSoulCostsType" + i.toString()).html(data[3]);
      $("#outSoulCostsPrice" + i.toString()).html(roundToString(data[4]));
      $("#outTotalCosts" + i.toString()).html(roundToString(forge.totalCost));
      //Show table
      $("#outCostsDiv" + i.toString()).show();
    }
    costs = forge.totalCost;
    //Deconstruct
    data = forge.deconstruct();
    gain = data[3];
    $("#outEyeGainCount" + i.toString()).html("Eye (" + data[0].toString() + ")");
    $("#outEyeGainPrice" + i.toString()).html(roundToString(getPrice("Eye") * data[0]));
    $("#outFluxGainCount" + i.toString()).html("Flux (" + data[1].toString() + ")");
    $("#outFluxGainPrice" + i.toString()).html(data[1].toString());
    $("#outSoulGainType" + i.toString()).html((data[2] === "N/A")? data[2] : data[2] + " (1)");
    $("#outSoulGainPrice" + i.toString()).html((data[2] === "N/A")? 0 : roundToString(getPrice(data[2])));
    $("#outTotalGain" + i.toString()).html(roundToString(gain));
    //Show table
    $("#outGainDiv" + i.toString()).show();
    //Title
    total = gain-costs;
    profitList.push(total);
    if(i === 0){
      totalBuffer = "Deconstruct Directly: " + roundToString(total) + " Flux Profit";
    }else{
      totalBuffer = "Forge to ";
      totalBuffer += (forge.rarity < 6)? "Shadow Level " + forge.rarity.toString() : "Radiant";
      totalBuffer += ": " + roundToString(total) + " Flux Profit";
    }
    $("#outText" + i.toString()).html(totalBuffer)
      .css("color", (total >= 0)? colors.yellow : colors.red);
    //Final message
    if(i === 0){
      totalBuffer = "Deconstruct Directly, " + roundToString(total) + " Flux";
    }else{
      totalBuffer = "Forge to ";
      totalBuffer += (forge.rarity < 6)? "Shadow Level " + forge.rarity.toString() : "Radiant";
      totalBuffer += ", " + roundToString(total) + " Flux, " + roundToString(total - profitList[0]) + " Flux More";
    }
    finalMessages.push(totalBuffer);
  }
  //Get the best choice
  var indexOfMax = 0, max = profitList[0];
  for(var i = 1; i < profitList.length; i++){
    if(profitList[i] > max){
      indexOfMax = i;
      max = profitList[i];
    }
  }
  //Show message
  $("#outProfitP").html("<strong>" + finalMessages[indexOfMax] + "</strong>");
  //Set color of best choice to green
  $("#outText" + indexOfMax).css("color", colors.green);
  //Show elements
  $("#outResultsDiv").show();
  $("#mathMainDiv").show();
  $("html, body").animate({scrollTop: $("#step2P").offset().top}, "fast");
};
//On load
window.onload = function(){
  //Local storage
  if(window.localStorage){
    lsSupport = true;
  }
  if(!lsSupport){
    $("#lsWarningDiv").css("display", "block");
  }
  //Draw price table
  for(var i = 0; i < names.length; i++){
    priceRows.push(new PriceRow(names[i], prices[i]));
  }
  //Draw math div
  drawMathDiv();
  //Hide result div
  $("#outResultsDiv").hide();
  //Bind buttons events
  $("#jumpToChatBtn").click(function(){
    $("html, body").animate({scrollTop: $("#chatDiv").offset().top}, "fast");
  });
  $("#restoreDefBtn").click(function(){
    priceRows.forEach(function(row){
      row.restoreDef();
    });
  });
  $("#calcBtn").click(calculate);
};
