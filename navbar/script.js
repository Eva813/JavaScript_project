//透過點擊

const navToggle = document.querySelector('.nav-toggle');
const links =document.querySelector('.links');

function showLinks(){
  links.classList.toggle('show-links');
  console.log(links.classList);
  // console.log(links.classList.contains("random"));
  // console.log(links.classList.contains("links"));
  // if (links.classList.contains("show-links")) {
  //   links.classList.remove("show-links");
  // } else {
  //   links.classList.add("show-links");
  // }
}


navToggle.addEventListener('click', showLinks)