//Variables
var defaultPrices = [3.8, 900, 3700, 13000, 39000];
var isValid = [true, true, true, true, true];
//Database
var Database = {
  //Deconstruction values, thanks to the author of: 
  //https://docs.google.com/spreadsheets/d/1G-9Fg8rGDKFV0zweJlWLKy1JLpbqf7pm6H7BxTX_PUc/edit#gid=1022828731
  eye: 7, //Shadow 1 to 4 all give 7 eyes
  //Flux: S level star
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
  fluxS45: 1700
}
//On change validation
var priceValidate = function(id, index){
  var valueBuffer = parseFloat($(id).val());
  console.log(valueBuffer);/////TESTING??????????????????????????????????????
  $(id + "Div").removeClass("has-success has-warning has-error");
  $(id + "Icon").removeClass("glyphicon-ok glyphicon-warning-sign glyphicon-remove")
  if(isNaN(valueBuffer) || valueBuffer < 0){
    //Not valid
    $(id  + "Div").addClass("has-error");
    $(id + "Icon").addClass("glyphicon-remove");
    isValid[index] = false;
  }else if(valueBuffer < defaultPrices[index] / 2 || valueBuffer > defaultPrices[index] * 2){
    //Warning: price far away from normal
    $(id  + "Div").addClass("has-warning");
    $(id + "Icon").addClass("glyphicon-warning-sign");
    isValid[index] = true;
  }else{
    //Passed all tests
    $(id  + "Div").addClass("has-success");
    $(id + "Icon").addClass("glyphicon-ok");
    isValid[index] = true;
  }
};
//Kernal
var calculate = function(){
  //If prices are not valid
  if(!(isValid[0] && isValid[1] && isValid[2] && isValid[3] && isValid[4])){
    $("html, body").animate({scrollTop: $("#step1").offset().top}, "fast");
    return;
  }
  //Prices are valid, start calculating
  
};
//Init
window.onload = function(){
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
  //Calculate! button
  $("#theButton").click(function(){
    $("#ourputResultsDiv").css("display", "inline");
    calculate();
  });
};
