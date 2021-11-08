document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "q":
      document.getElementById("hit").click();
      break;
    case "w":
      document.getElementById("stand").click();
      break;
    case "e":
      document.getElementById("reset").click();
      break;
  }
});

