function changecolour(choice){
    document.querySelectorAll(".nav-choice").forEach(nchoice => {
        nchoice.classList.remove("currpage")
    })

    document.getElementById(`${choice}`).classList.add("currpage")
}
console.log("Hi")