import testFile from "./testFile.js";

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

ctx.beginPath();
ctx.fillStyle = "#ff0000";
ctx.rect(10,10,50,50);
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.fillStyle = "#f0f";
ctx.rect(80,50,50,50);
ctx.fill();
ctx.closePath();

//var testThings = new testFile();
//testThings.draw(ctx);