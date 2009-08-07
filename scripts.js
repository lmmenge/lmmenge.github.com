function showScreenshot(name)
{
  var screenView = document.getElementById("screenshotView");
  if(screenView != null)
  {
    screenView.src = "images/content/"+name;
  }
}