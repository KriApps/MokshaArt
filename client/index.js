
formCont = document.getElementById('form-container');


document.addEventListener('DOMContentLoaded', () => {
const artFormContent = localStorage.getItem('artFormContent');
if (artFormContent) {
    formCont.innerHTML = artFormContent;
}
});

/*
document.getElementById('add-art').addEventListener('click', ()=>{
    event.preventDefault()
    const formHTML = 
    `<div class="form" >
            <form action="/artpics" method="POST" enctype="multipart/form-data" id="art-form">
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
              <button class="submit-btn">Submit</button>
      
            </form>
          </div>
          `;

    formCont.innerHTML = formHTML;
    localStorage.setItem('artFormContent', formCont.innerHTML);
})

/*

const form = document.getElementById('art-form');
console.log(form)
form.addEventListener('submit', async function(event){
    event.preventDefault();
    const formData = new FormData(form);
    const formJSON = JSON.stringify(Object.fromEntries(formData.entries()));
    console.log('Form Data', formData);
    
    const response = await fetch('/name',{
        method: 'POST',
        headers: {
            "Content-Type":"application/json"
        },
        body : formJSON

    });
    //error/exception handling
    if (response.ok){
        const responseBody = await response.text();
        console.log('response from POST: ', responseBody)
    }
    else{

    }
});*/