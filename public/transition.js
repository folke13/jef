var reactorNavButton = document.getElementById("reactorNavButton");
var boilerNavButton = document.getElementById("boilerNavButton");
var turbineNavButton = document.getElementById("turbineNavButton");
var inductionNavButton = document.getElementById("inductionNavButton");

var reactorPage = document.getElementsByClassName("reactorPage")[0];
var boilerPage = document.getElementsByClassName("boilerPage")[0];
var turbinePage = document.getElementsByClassName("turbinePage")[0];
var inductionPage = document.getElementsByClassName("inductionPage")[0];

var reactorMouseDown = reactorNavButton.onmousedown;
reactorNavButton.onmousedown = function() {
  console.log("User Pressed Reactor Navigation Button");
  if (reactorMouseDown) reactorMouseDown();

  reactorPage.style.display = "flex";
  boilerPage.style.display = "none";
  turbinePage.style.display = "none";
  inductionPage.style.display = "none";
};

var boilerMouseDown = boilerNavButton.onmousedown;
boilerNavButton.onmousedown = function() {
  console.log("User Pressed Boiler Navigation Button");
  if (boilerMouseDown) boilerMouseDown();

  reactorPage.style.display = "none";
  boilerPage.style.display = "flex";
  turbinePage.style.display = "none";
  inductionPage.style.display = "none";
};

var turbineMouseDown = turbineNavButton.onmousedown;
turbineNavButton.onmousedown = function() {
  console.log("User Pressed Turbine Navigation Button");
  if (turbineMouseDown) turbineMouseDown();

  reactorPage.style.display = "none";
  boilerPage.style.display = "none";
  turbinePage.style.display = "flex";
  inductionPage.style.display = "none";
};

var inductionMouseDown = inductionNavButton.onmousedown;
inductionNavButton.onmousedown = function() {
  console.log("User Pressed Induction Navigation Button");
  if (inductionMouseDown) inductionMouseDown();

  reactorPage.style.display = "none";
  boilerPage.style.display = "none";
  turbinePage.style.display = "none";
  inductionPage.style.display = "flex";
};
