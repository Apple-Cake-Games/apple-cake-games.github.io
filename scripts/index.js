const btnplay = document.getElementById("btnPlay")
const btnGit = document.getElementById("icnGithub")
const btnShop = document.getElementById("btnShop")

btnplay.addEventListener("click", function(){

    window.open("/html/alienhazard.html", "_self");

});

btnGit.addEventListener("click", function(){
    window.open("https://github.com/Apple-Cake-Games/apple-cake-games.github.io", "_self");
})

btnShop.addEventListener("click", function(){
    openShop();
})