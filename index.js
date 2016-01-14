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
//Database and kernal function
var Database = {
  //Deconstruction values
  eye: 7, //Shadow 1 to 4 all give 7 eyes
  //Flux: S level star
  //Shadow Level 1
  fluxS10: 25;
  fluxS11: 35,
  fluxS12: 50,
  fluxS13: 80,
  fluxS14: 110,
  fluxS15: 140,
  //Shadow Level 2
  fluxS20: 100;
  fluxS21: 120,
  fluxS22: 150,
  fluxS23: 200,
  fluxS24: 250,
  fluxS25: 350,
  //Shadow Level 3
  fluxS30: 400;
  fluxS31: 450,
  fluxS32: 500,
  fluxS33: 550,
  fluxS34: 650,
  fluxS35: 750,
  //Shadow Level 4
  fluxS40: 1000;
  fluxS41: 1100,
  fluxS42: 1200,
  fluxS43: 1300,
  fluxS44: 1500,
  fluxS45: 1700
}
var calculate = function(){
  
};
return true;};
