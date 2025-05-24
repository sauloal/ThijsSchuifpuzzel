function main() {
  console.log("Hello, World!");

  let content = document.getElementById("content");

  console.log(content);

  content.innerHTML = "<h1>Hello, Thijs!</h1>";
}

document.addEventListener("DOMContentLoaded", function() {
  main();
});
