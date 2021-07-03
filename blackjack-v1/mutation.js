  function isDoubled() {
    if (2 * parseInt(document.getElementById("betsize").innerHTML) >
      parseInt(document.getElementById("chips").innerHTML)) {
        return true;
      } else {
        return false;
      }
  }
  // lets add MutationObserver to change style of DD button to grey whenever 2*betsize is higher than the chips available 

  const targetNode = document.querySelector("#betsize");
  const observerOptions = {
    childList: true,
    attributes: true,
    // Omit (or set to false) to observe only changes to the parent node
    subtree: true
  }

  const observer = new MutationObserver(callback);
  observer.observe(targetNode, observerOptions);
  function callback() {
    if (isDoubled()) {
      document.getElementById("double").style.color = "grey";
    }
  }
