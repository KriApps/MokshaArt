
formCont = document.getElementById('form-container');


document.addEventListener('DOMContentLoaded', () => {
const artFormContent = localStorage.getItem('artFormContent');
if (artFormContent) {
    formCont.innerHTML = artFormContent;
    forms = document.querySelectorAll('.artpics-form');
    console.log(forms)
    fetchArt();
}
});



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
    
    
    fetchArt();

    //formCont.appendChild(form)
})

function fetchArt(){
    forms.forEach((form)=>{
        
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
            alert("Art uploaded successfully!")
            formCont.innerHTML = '';
            localStorage.setItem('artFormContent', '');
            displayAddedArt();

        }else{
            const error = await response.text();
            alert("Server could not submit form", error)

        }
        }catch (error){
        console.log('error', error)
        alert("Error submitting form")
        }
    })
    })
};

fetchArt();

async function displayArt(){

    try{
      const response = await fetch('/artgallery');
      
      if (response.ok){
          const result = await response.json();
          
          document.getElementById('artPic-container').innerHTML =  `
          <div id="artgallery-container" class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 art-gallery-css">
          </div>
          `;
          const artgallery = document.getElementById('artgallery-container')


          result.forEach(artMeta => {
              artgallery.innerHTML+=`
                <div class="col">
                <div class="card shadow-sm">
                  <img class="bd-placeholder-img card-img-top" width="100%" height="400" xmlns="http://www.w3.org/2000/svg" src="${artMeta.imagePath}"  aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" />
                  <div class="card-body">
                    <h2>${artMeta.title}</h2>
                    <p class="card-text">${artMeta.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-outline-secondary" onclick = "viewArt('${artMeta.artId}');">View</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              `;
            })
            

            
        }else{
            const error = await response.text();
            alert("Server could not submit form", error)

        }
        
    } catch (error){
      console.log("error fetching JSON data", error)
    }
  };

displayArt();

async function displayAddedArt(){

    try{
      const response = await fetch('/artgallery');
      
      if (response.ok){
          const result = await response.json();
          
          const artgallery = document.getElementById('artgallery-container')

          const artObject = result[result.length-1];

          
          artgallery.innerHTML += `
          <div class="col">
          <div class="card shadow-sm">
            <img class="bd-placeholder-img card-img-top" width="100%" height="400" xmlns="http://www.w3.org/2000/svg" src="${artObject.imagePath}"  aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" />
            <div class="card-body">
              <h2>${artObject.title}</h2>
              <p class="card-text">${artObject.description}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <button type="button" class="btn btn-sm btn-outline-secondary" onclick = "viewArt('${artObject.artId}');">View</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        `;

            
        }else{
            const error = await response.text();
            alert("Server could not submit form", error)

        }
        
    } catch (error){
      console.log("error fetching JSON data", error)
    }
  };

  

async function viewArt(id){

    try{
        const response = await fetch(`/artgallery/${id}`);
        
        if (response.ok){
            const artObject = await response.json();
            
            const artPost = document.getElementById('artPic-container');

            artPost.innerHTML = `
                <button class = "back-btn" id = "artpic-back-btn" style="font-size: 60px; font-weight : 500" onclick = "
                displayArt();
                "><</button>
                <p style = "font-size: 60px; font-weight : 500" >${artObject.title}</p>
                <p style = "font-size: 25px; font-weight : 90" >Art by ${artObject.artist}</p>
                <p>${artObject.description}</p>

                <img  style="width: 50%; height: auto" class="view-artpic" id="view-art" src = "${artObject.imagePath}">
                <br><br>

                <div id = "comments-container" class ="comments-container">
                <h1>Comments</h1><br>
                
                <form method = "post" class="comments-form" id = "comments-form">
                    <input class="comment" id="comment-maker" name="commentMaker" placeholder="Enter your name" type="text"><br><br>
                    <input class="comment" id = "comment" name="comment" placeholder="What are your thoughts?" type = "text"><br><br>
                    <input type="hidden" name="artofCommentId" value = "${artObject.artId}">
                    <button class = "submit-comment" id="submit-comment-btn" type="submit">Send</button>
                </form>


                </div>
            `;

            commentsForms = document.querySelectorAll('.comments-form');
            console.log(commentsForms)

            postComments();




              
          }else{
              const error = await response.text();
              alert("Server could not show image", error)
  
          }
          
      } catch (error){
        console.log("error fetching JSON data", error)
      }
    };

    /*
    document.addEventListener('DOMContentLoaded', () => {
        const artFormContent = localStorage.getItem('artFormContent');
        if (artFormContent) {
            formCont.innerHTML = artFormContent;
            forms = document.querySelectorAll('.artpics-form');
            console.log(forms)
            fetchArt();
        }
        });
  */
    let commentsForms = document.querySelectorAll('.comments-form');
    console.log(commentsForms)

    function postComments(){
        commentsForms.forEach((commentForm)=>{
            
            commentForm.addEventListener('submit', async function(event){
            event.preventDefault();
    
            
            const commentFormData = new FormData(commentForm);
            
            console.log('form data', commentFormData)
            
            
            try {
            
                const response = await fetch('/api/artcomments', {
                    method: 'POST',
                
                    body : commentFormData
                });
    
            if (response.ok){
                const result = await response.json();
                alert("Comment uploaded successfully!")
                //formCont.innerHTML = '';
                //localStorage.setItem('commentFormContent', '');
                //displayAddedArt();
    
            }else{
                const error = await response.text();
                alert("Server could not submit form", error)
    
            }
            }catch (error){
            console.log('error', error)
            alert("Error submitting form")
            }
        })
        })
    };
    
    



    

  
