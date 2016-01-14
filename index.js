window.onload = function(){
//Variables
var defaultPrices = [3.8, 900, 3700, 13000, 39000];
var isValid = [true, true, true, true, true];
//On change validation
var priceValidate = function(id, index){
  var valueBuffer = parseFloat($(id).val());
  $(id).removeClass("has-success has-warning has-error");
  $(id + "Icon").removeClass("glyphicon-ok glyphicon-warning-sign glyphicon-remove")
  if(valueBuffer === NaN || valueBuffer < 0){
    //Not valid
    $(id).addClass("has-error");
    $(id + "Icon").addClass("glyphicon-remove");
    isValid[index] = false;
  }else if(valueBuffer < defaultPrices[index] / 2 || valueBuffer > defaultPrice[index] * 2){
    //Warning: price far away from normal
    $(id).addClass("has-warning");
    $(id + "Icon").addClass("glyphicon-warning-sign");
    isValid[index] = true;
  }else{
    //Passed all tests
    $(id).addClass("has-success");
    $(id + "Icon").addClass("glyphicon-ok");
    isValid[index] = true;
  }
};
$("#eyePrice").change(function(){
    priceValidate("#eyePrice", 0)
  });
$("#twicePrice").change(function(){
    priceValidate("#twicePrice", 1)
  });
$("#thricePrice").change(function(){
    priceValidate("#thricePrice", 2)
  });
$("#quadPrice").change(function(){
    priceValidate("#quadPrice", 3)
  });
$("#pentaPrice").change(function(){
    priceValidate("#pentaPrice", 4)
  });
//Write in default prices
$("#eyePrice").val(defaultPrices[0]);
$("#twicePrice").val(defaultPrices[1]);
$("#thricePrice").val(defaultPrices[2]);
$("#quadPrice").val(defaultPrices[3]);
$("#pentaPrice").val(defaultPrices[4]);
//Function for "Calculate!" button
var calculate = function(){
  
};
return true;};
