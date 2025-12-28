document.addEventListener("DOMContentLoaded", function () {
  const startBtn = document.getElementById("startBtn");
  const game = document.getElementById("game");

  startBtn.addEventListener("click", function () {
    startBtn.style.display = "none";
    game.style.display = "block";
  });
});
