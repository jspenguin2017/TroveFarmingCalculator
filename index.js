window.onload = function(){
//Put in default prices
var defaultPrices = [3.8, 900, 3700, 13000, 39000];
$("#eyePrice").val(defaultPrices[0]);
$("#twicePrice").val(defaultPrices[1]);
$("#thricePrice").val(defaultPrices[2]);
$("#quadPrice").val(defaultPrices[3]);
$("#pentaPrice").val(defaultPrices[4]);
//On change validation
var priceValidate = function(id, index){
  var valueBuffer = parseFloat($(id).val());
  if(valueBuffer === NaN || valueBuffer < 0){
    //Not valid
    $(id).removeClass("has-success has-warning has-error");
    $(id).addClass("has-error");
  }
}
$("#eyePrice").change(function());
$("#twicePrice").change(900);
$("#thricePrice").change(3700);
$("#quadPrice").change(13000);
$("#pentaPrice").change(39000);
return true;};
