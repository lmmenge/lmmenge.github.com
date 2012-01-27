function showScreenshot(name)
{
  var screenView = document.getElementById("screenshotView");
  if(screenView != null)
  {
    screenView.src = "images/content/"+name;
    //if(document.getElementByName("iPhone") != null)
      location.href = "#iPhone";
  }
}