"use strict";

/**
 * Constants and variables. 
 */
const names = ["Eye", "Twice", "Thrice", "Quad", "Penta", "Flame", "Radiant Soul"],
      prices = [1.7, 25, 500, 3500, 12500, 2000, 32000], //Default prices
      colors = { green: "#008000", yellow: "#B36B00", red: "#993333" };
const priceRowFeedback = {
    success: ["glyphicon-ok", "has-success", colors.green],
    warning: ["glyphicon-warning-sign", "has-warning", colors.yellow],
    error: ["glyphicon-remove", "has-error", colors.red]
};
let priceRows = [];
let lsSupport = false;

/**
 * Check if an input is a valid price. 
 * @function
 * @param {*} input - The input to be checked. 
 * @return {boolean} True if the input is valid, false otherwise. 
 */
const isPrice = function (input) {
    return !isNaN(input) && isFinite(input) && input >= 0;
};
/**
 * Round a number to 3 digits after the decimal place. 
 * @function
 * @param {number} input - The number to be rounded. 
 * @return {string} The string representing the rounded input number. 
 */
const roundToString = function (input) {
    return (Math.round(input * 1000) / 1000).toString();
};

/**
 * Safely read price from Local Storage. 
 * @function
 * @param {string} id - The name of the Local Storage item to retrieve. 
 * @param {number} def - The default price to return if the item cannot be retrieved. 
 * @return {number} A valid price from Local Storage or the default price. 
 */
const lsRead = function (id, def) {
    if (lsSupport) {
        //Read data from Local Storage
        const price = parseFloat(localStorage.getItem("Cat_Forger_" + id));
        //Check if the data read is a valid price
        if (!isPrice(price)) {
            return def;
        } else {
            return price;
        }
    } else {
        //Local Storage not supported, return the default value
        return def;
    }
};
/**
 * Safely write price to Local Storage. 
 * @function
 * @param {string} id - The name of the Local Storage item to write to. 
 * @param {number} val - The price value to write. 
 * @return {boolean} True if the operation was successful, false otherwise. 
 */
const lsWrite = function (id, val) {
    if (lsSupport) {
        localStorage.setItem("Cat_Forger_" + id, val);
        return true;
    } else {
        return false;
    }
};

/**
 * Price row constructor. 
 * All instance variables should only be changed by instance methods. 
 * @constructor
 * @param {string} name - The name of the row. 
 * @param {number} def - The default price. 
 */
const PriceRow = function (name, def) {
    //Initialize variables
    this.defPrice = def;
    this.enteredPrice = lsRead(name, def);
    this.isValid = false;
    //Initialize elements
    this.name = $("<td>").html("<strong>" + name + "</strong>");
    this.text = name;
    this.input = $("<input type='text'>").addClass("form-control");
    this.icon = $("<span>").addClass("glyphicon form-control-feedback");
    this.inputDiv = $("<div>").addClass("form-group has-feedback").append(this.input, this.icon);
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
    this.input.change(this.validate.bind(this));
};
/**
 * Update feedback state of the price row. 
 * This method should only be called by @see PriceRow#updatePrice . 
 * @private
 * @method
 * @param {string} feedback - A valid feedback state from @see priceRowFeedback . 
 */
PriceRow.prototype.drawFeedback = function (feedback) {
    //Remove old feedbacks
    this.icon.removeClass("glyphicon-ok glyphicon-warning-sign glyphicon-remove");
    this.inputDiv.removeClass("has-success has-warning has-error");
    //Draw new feedbacks
    this.icon.addClass(priceRowFeedback[feedback][0]);
    this.inputDiv.addClass(priceRowFeedback[feedback][1]);
    this.name.css("color", priceRowFeedback[feedback][2]);
};
/**
 * Update price of the price row, then save the price to Local Storage. 
 * This method will assume input is a valid price. 
 * This method should only be called by @see PriceRow#updatePrice . 
 * @private
 * @method
 * @param {number} price - The new price to set. 
 */
PriceRow.prototype.updatePrice = function (price) {
    this.input.val(price);
    this.enteredPrice = price;
    lsWrite(this.text, price);
};
/**
 * Validate a price from user input. 
 * This method will read input from input form. 
 * The input from the user will be checked, then @see PriceRow#drawFeedback and @see PriceRow#updatePrice will be called to update the price row. 
 * @method
 * @listens this.input.change
 */
PriceRow.prototype.validate = function () {
    const priceBuffer = parseFloat(this.input.val());
    if (!isPrice(priceBuffer)) {
        //Invalid data
        this.isValid = false;
        this.drawFeedback("error");
    } else if (priceBuffer < (this.defPrice / 2) || priceBuffer > (this.defPrice * 2)) {
        //Valid but off from default
        this.isValid = true;
        this.drawFeedback("warning");
        this.updatePrice(priceBuffer);
    } else {
        //Valid
        this.isValid = true;
        this.drawFeedback("success");
        this.updatePrice(priceBuffer);
    }
};
PriceRow.prototype.restoreDef = function () {
    this.input.val(this.defPrice);
    this.validate();
};

const getPrice = function (mat) {
    return priceRows[names.indexOf(mat)].enteredPrice;
}
//Forge constructor
const Forge = function (rarity, star) {
    //Initialize variables
    this.rarity = rarity;
    this.star = star;
    this.totalCost = 0;
};
//Forge prototype
//Return mat from deconstructing now
Forge.prototype.deconstruct = function () {
    //Get material list
    const mat = [
      db("decon", "Eye", this.rarity),
      db("decon", "Flux", this.rarity),
      db("decon", "Soul", this.rarity)
    ];
    //Calculate total gain in Flux
    let totalFluxGain = (mat[0] * getPrice("Eye")) + (mat[1]);
    //Add Soul price
    if (mat[2] !== "N/A") {
        totalFluxGain += getPrice(mat[2]);
    }
    mat.push(totalFluxGain);
    //Return: [Eye count, Flux count, Soul name, total value in Flux]
    return mat;
};
//Forge to next level
Forge.prototype.forge = function () {
    //Initialize variables
    let needStar = 5 - this.star,
        subTotal = 0,
        priceBuffer,
        mat = [];
    //Eyes
    mat.push(db("forge", "Eye", this.rarity) * needStar);
    priceBuffer = getPrice("Eye") * mat[0];
    subTotal += priceBuffer;
    mat.push(priceBuffer);
    //Flux
    mat.push(db("forge", "Flux", this.rarity) * needStar);
    subTotal += mat[2];
    //Others
    if (this.rarity === 1) { //500 Flux 50 Eyes
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
    } else if (this.rarity !== 5) { //2 Souls
        //Soul type needed is the same: Shadow Level 2 decompose to 1 Twice and need 2 Twice to forge it to next tier
        mat.push(db("decon", "Soul", this.rarity));
        priceBuffer = getPrice(mat[3]) * 2;
        mat[3] += " (2)";
        subTotal += priceBuffer;
        mat.push(priceBuffer);
    } else { //3 Penta 3 Flames
        mat.push(names[4] + " (3) and " + names[5] + " (3)");
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
//Database
const db = function (action, mat, rarity) {
    if (action === "decon") {
        if (mat === "Eye") {
            return (rarity === 6) ? 0 : 7;
        } else if (mat === "Flux") {
            switch (rarity) {
                case 1: return 35;
                case 2: return 75;
                case 3: return 250;
                case 4: return 600;
                case 5: return 1000;
                case 6: return 1200; //Radiant
            }
        } else if (mat === "Soul") {
            switch (rarity) {
                case 1: return "N/A";
                case 2: return names[1];
                case 3: return names[2];
                case 4: return names[3];
                case 5: return names[4];
                case 6: return names[6];
            }
        }
    } else if (action === "forge") {
        if (mat === "Eye") {
            switch (rarity) {
                case 1: return 10;
                case 2: return 15;
                case 3: return 30;
                case 4: return 50;
                case 5: return 60;
            }
        } else if (mat === "Flux") {
            switch (rarity) {
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
const drawMathDiv = function () {
    let direction, prevCostsBuffer, titleBuffer;
    for (let i = 0; i < 7; i++) {
        //Add br for first
        if (i === 0) {
            $("#mathContainerDiv").append("<br>");
        }
        //One for costs one for gain
        for (let ii = 0; ii < 2; ii++) {
            //No costs for first one
            if (i === 0 && ii === 0) {
                continue;
            }
            //Title
            if (i === 0 || ii === 0) {
                titleBuffer = $("<p>").append($("<strong>").attr("id", "outText" + i.toString()));
            } else {
                titleBuffer = "";
            }
            //Previous costs
            if (i > 1 && ii === 0) {
                prevCostsBuffer = $("<tr>").append(
                  $("<td>").html("Previous Costs"),
                  $("<td>").attr("id", "outPrevCosts" + i.toString())
                );
            } else {
                prevCostsBuffer = "";
            }
            direction = (ii === 0) ? "Costs" : "Gain";
            $("#mathContainerDiv").append(
              $("<div>").addClass("mathTableDiv").attr("id", "out" + direction + "Div" + i.toString()).append(
                //Draw title
                titleBuffer,
                $("<p>").html((ii === 0) ? "Costs in forging: " : "Gain from deconstructing: "),
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
const calculate = function () {
    //Check if prices are valid
    for (let i = 0; i < priceRows.length; i++) {
        if (!priceRows[i].isValid) {
            $("#mathMainDiv").hide();
            $("#outResultsDiv").hide();
            $("html, body").animate({ scrollTop: $("#step1P").offset().top }, "fast");
            return;
        }
    }
    //Initialize forge
    const forge = new Forge(parseInt($("#raritySelect").val()), parseInt($("#starSelect").val()));
    //Hide all tables
    $(".mathTableDiv").hide();
    //Loop until Radiant is reached
    let finalMessages = [], profitList = [];
    let data, costs, gain, total, totalBuffer;
    for (let i = 0; forge.rarity < 6; i++) { //i is forged time
        //Forge
        if (i !== 0) {
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
        $("#outSoulGainType" + i.toString()).html((data[2] === "N/A") ? data[2] : data[2] + " (1)");
        $("#outSoulGainPrice" + i.toString()).html((data[2] === "N/A") ? 0 : roundToString(getPrice(data[2])));
        $("#outTotalGain" + i.toString()).html(roundToString(gain));
        //Show table
        $("#outGainDiv" + i.toString()).show();
        //Title
        total = gain - costs;
        profitList.push(total);
        if (i === 0) {
            totalBuffer = "Deconstruct Directly: " + roundToString(total) + " Flux Profit";
        } else {
            totalBuffer = "Forge to ";
            totalBuffer += (forge.rarity < 6) ? "Shadow Level " + forge.rarity.toString() : "Radiant";
            totalBuffer += ": " + roundToString(total) + " Flux Profit";
        }
        $("#outText" + i.toString()).html(totalBuffer)
          .css("color", (total >= 0) ? colors.yellow : colors.red);
        //Final message
        if (i === 0) {
            totalBuffer = "Deconstruct Directly, " + roundToString(total) + " Flux";
        } else {
            totalBuffer = "Forge to ";
            totalBuffer += (forge.rarity < 6) ? "Shadow Level " + forge.rarity.toString() : "Radiant";
            totalBuffer += ", " + roundToString(total) + " Flux, " + roundToString(total - profitList[0]) + " Flux More";
        }
        finalMessages.push(totalBuffer);
    }
    //Get the best choice
    let indexOfMax = 0, max = profitList[0];
    for (let i = 1; i < profitList.length; i++) {
        if (profitList[i] > max) {
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
    $("html, body").animate({ scrollTop: $("#step2P").offset().top }, "fast");
};
//Initialization
$(document).ready(function () {
    //Local storage
    if (window.localStorage) {
        lsSupport = true;
    }
    if (!lsSupport) {
        $("#lsWarningDiv").css("display", "block");
    }
    //Draw price table
    for (let i = 0; i < names.length; i++) {
        priceRows.push(new PriceRow(names[i], prices[i]));
    }
    //Draw math div
    drawMathDiv();
    //Hide result div
    $("#outResultsDiv").hide();
    //Bind buttons events
    $("#jumpToChatBtn").click(function () {
        $("html, body").animate({ scrollTop: $("#chatDiv").offset().top }, "fast");
    });
    $("#restoreDefBtn").click(function () {
        priceRows.forEach(function (row) {
            row.restoreDef();
        });
    });
    $("#calcBtn").click(calculate);
    //Load Disqus
    disqusLoader("catforger", "http://x01x012013.github.io/Trove/", "main", "Trove Forging Calculator");
});
