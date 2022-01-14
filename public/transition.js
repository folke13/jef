var reactorNavButton = document.getElementById("reactorNavButton");
var boilerNavButton = document.getElementById("boilerNavButton");
var turbineNavButton = document.getElementById("turbineNavButton");
var inductionNavButton = document.getElementById("inductionNavButton");
var disconnectNavButton = document.getElementById("disconnectNavButton");

var reactorPage = document.getElementsByClassName("reactorPage")[0];
var boilerPage = document.getElementsByClassName("boilerPage")[0];
var turbinePage = document.getElementsByClassName("turbinePage")[0];
var inductionPage = document.getElementsByClassName("inductionPage")[0];

var reactorMouseDown = reactorNavButton.onmousedown;
reactorNavButton.onmousedown = function() {
  if (reactorMouseDown) reactorMouseDown();

  reactorNavButton.style.backgroundColor = "gray";
  boilerNavButton.style.backgroundColor = "#333";
  turbineNavButton.style.backgroundColor = "#333";
  inductionNavButton.style.backgroundColor = "#333";

  reactorPage.style.display = "flex";
  boilerPage.style.display = "none";
  turbinePage.style.display = "none";
  inductionPage.style.display = "none";
};

var boilerMouseDown = boilerNavButton.onmousedown;
boilerNavButton.onmousedown = function() {
  if (boilerMouseDown) boilerMouseDown();

  reactorNavButton.style.backgroundColor = "#333";
  boilerNavButton.style.backgroundColor = "gray";
  turbineNavButton.style.backgroundColor = "#333";
  inductionNavButton.style.backgroundColor = "#333";

  reactorPage.style.display = "none";
  boilerPage.style.display = "flex";
  turbinePage.style.display = "none";
  inductionPage.style.display = "none";
};

var turbineMouseDown = turbineNavButton.onmousedown;
turbineNavButton.onmousedown = function() {
  if (turbineMouseDown) turbineMouseDown();

  reactorNavButton.style.backgroundColor = "#333";
  boilerNavButton.style.backgroundColor = "#333";
  turbineNavButton.style.backgroundColor = "gray";
  inductionNavButton.style.backgroundColor = "#333";

  reactorPage.style.display = "none";
  boilerPage.style.display = "none";
  turbinePage.style.display = "flex";
  inductionPage.style.display = "none";
};

var inductionMouseDown = inductionNavButton.onmousedown;
inductionNavButton.onmousedown = function() {
  if (inductionMouseDown) inductionMouseDown();

  reactorNavButton.style.backgroundColor = "#333";
  boilerNavButton.style.backgroundColor = "#333";
  turbineNavButton.style.backgroundColor = "#333";
  inductionNavButton.style.backgroundColor = "gray";

  reactorPage.style.display = "none";
  boilerPage.style.display = "none";
  turbinePage.style.display = "none";
  inductionPage.style.display = "flex";
};
