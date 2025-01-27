
formCont = document.getElementById('form-container');

/*
document.addEventListener('DOMContentLoaded', () => {
const artFormContent = localStorage.getItem('artFormContent');
if (artFormContent) {
    formCont.innerHTML = artFormContent;
}
});
*/

let forms = document.querySelectorAll('.artpics-form');
console.log(forms)

document.getElementById('add-art').addEventListener('click', ()=>{
    event.preventDefault()

    const formHTML = 
    `<div class="form" >
            <form method="post" enctype="multipart/form-data" id="art-form" class="artpics-form">
              <button id="close-input-btn" class="close-btn" onclick = 
              "formCont.innerHTML = '';
                localStorage.setItem('artFormContent', '');
              ">x</button>
              <h2>Enter your Art </h2><br>

              <label for="title">Title</label><br>
              <input type="text" class="art-input" name="title" id="title" placeholder="Title">
              <br><br>

              <label for="artist">Artist</label><br>
              <input type="text" class="art-input" name="artist" id="artist" placeholder="Artist">
              <br><br>

              <label for="description">Description</label><br>
              <textarea type="text" class="art-input-long" name="description" id="description" placeholder="Description"></textarea>
              <br><br>
              <input class="file-btn" type="file" id="art" name="art" accept="image/png, image/jpeg, image/jpg" />
              <br>
              <small>*Form only accepts png,jpeg and jpg</small>
              <br><br>
              <button type="submit" class="submit-btn" id=" submit-art-btn">Submit</button>
      
            </form>
          </div>
          `;

    formCont.innerHTML = formHTML;
    localStorage.setItem('artFormContent', formCont.innerHTML);

    forms = document.querySelectorAll('.artpics-form');
    console.log(forms)
    
    fetchArt();

    //formCont.appendChild(form)
})

function fetchArt(){
    forms.forEach((form)=>{
        console.log(form)
        form.addEventListener('submit', async function(event){
        event.preventDefault();

        
        const formData = new FormData(form);
        
        console.log('form data', formData)
        
        
        try {
        
            const response = await fetch('/api/artpics', {
                method: 'POST',
            
                body : formData
            });

        if (response.ok){
            const result = await response.json();
            alert("Yay")
        }else{
            const error = await response.text();
            alert("noo", error)

        }
        }catch (error){
        console.log('error', error)
        alert("Error submitting form")
        }
    })
    })
};

fetchArt();

