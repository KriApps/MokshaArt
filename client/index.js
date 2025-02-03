
formCont = document.getElementById('form-container');


document.addEventListener('DOMContentLoaded', () => {
const artFormContent = localStorage.getItem('artFormContent');
if (artFormContent) {
    formCont.innerHTML = artFormContent;
    forms = document.querySelectorAll('.artpics-form');
    
    fetchArt();
}
});



let forms = document.querySelectorAll('.artpics-form');




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
        
        
        
        
        try {
        
            const response = await fetch('/api/artpics', {
                method: 'POST',
            
                body : formData
            });

        if (response.ok){
            const result = await response.json();
            
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
      console.log("error fetching Art pictures JSON data", error)
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
                <div id="comment-error" ></div>
                <form method = "post" class="comments-form" id = "comments-form">
                    <input class="comment" id="comment-maker" name="commentMaker" placeholder="Enter your name" type="text"><br><br>
                    <input class="comment" id = "comment" name="comment" placeholder="What are your thoughts?" type = "text"><br><br>
                    <input type="hidden" name="artofCommentId" value = "${artObject.artId}">
                    <button class = "submit-comment" id="submit-comment-btn" type="submit" 
                    ">Send</button>
                </form>
              <div id="comments-display" class="comments-display"></div>


              </div>
          `;

          commentsForms = document.querySelectorAll('.comments-form');
          

          postComments(`${artObject.artId}`);

          document.getElementById('comments-form').addEventListener('submit', function(event){
            event.preventDefault();
            document.getElementById('comment').value = '';
          })

          

          commentsCont = document.querySelector('.comments-display');
          displayComments(`${artObject.artId}`);



            
        }else{
          const error = await response.text();
          alert("Server could not show image", error)

        }
        
    } catch (error){
      console.log("error fetching JSON data", error)
    }
  };

    
let commentsForms = document.querySelectorAll('.comments-form');


function postComments(id){
  commentsForms.forEach((commentForm)=>{
      
      commentForm.addEventListener('submit', async function(event){
        event.preventDefault();
        console.log("submitted")

        
        const commentFormData = new FormData(commentForm);
        
        
        
        
        

        try {
        
            const response = await fetch('/artcomments', {
                method: 'POST',
            
                body : commentFormData
            });

        if (response.ok){
            const result = await response.json();
            console.log("Comment uploaded successfully!");
            
            displayComments(id)
            

        }else{
            const error = await response.text();
            document.getElementById('comment-error').innerHTML = `<div>All fields must be filled <button id="close-error" class="close-error-btn" onclick = "
            document.getElementById('comment-error').innerHTML = ''
            document.getElementById('comment-error').classList.remove('comment-error');;
            ">x</button> </div>`;
            document.getElementById('comment-error').classList.add('comment-error');
            

        }
        }catch (error){
        console.log('error', error)
        alert("Error submitting form, all fields must be filled")
        }
  })
  })
};

  

async function displayComments(id){
  try{
    const response = await fetch(`/comments/${id}`);
    
    if (response.ok){
        const result = await response.json();
        
        
        
        commentsCont = document.querySelector('.comments-display');
        commentsCont.innerHTML = '';

        result.forEach(comment=> {
            commentsCont.innerHTML+=`
            <div id = "artComment${comment.artCommentId}">
              <button class="artComment"  onclick  ="
              moreComment(${comment.artCommentId})
              ">
                <p>${comment.comment}</p>
                <small>-${comment.commentMaker}</small>
              </button>
            </div>

            `;
          })
          

          
      }else{
          const error = await response.text();
          console.log("Server could not show comments", error)

      }
      
  } catch (error){
    console.log("error fetching JSON data", error)
  }
};

async function moreComment(id){
  const artCommentId = parseInt(id);

  try{
    const response = await fetch(`/moreComments/${id}`);
    
    if (response.ok){
        const comment = await response.json();
        
        
        
        const commentDiv = document.getElementById(`artComment${artCommentId}`);
        commentDiv.classList.add('moreComment');
        
        
        commentDiv.innerHTML=`
          <div>
            <p>${comment.comment}</p>
            <small>-${comment.commentMaker}</small><br>
            <button class="like-btn" onclick = "
              likeComment(${comment.artCommentId}, ${comment.commentLikes})
            "><small >${comment.commentLikes}♡</small></button>
          </div>

        `;
          
          

          
      }else{
          const error = await response.text();
          alert("Server could not show comment", error)

      }
      
  } catch (error){
    console.log("error fetching JSON data", error)
  }

}


async function likeComment(id,commLikes){
  const artCommentId = parseInt(id);
  
  
  const likes = {
    commentLikes : commLikes+1
  }
  
  try{
    const response = await fetch(`/addLikeComment/${artCommentId}`,{
      method: 'PATCH'
      
    });

    
    if (response.ok){
        
        const likedComment = await response.json();
        

        const commDiv = document.getElementById(`artComment${artCommentId}`);
      
        
        commDiv.innerHTML=`
          <div>
            <p>${likedComment.comment}</p>
            <small>-${likedComment.commentMaker}</small><br>
            <button class="like-btn" style="cursor:auto"><small>${likedComment.commentLikes}♥</small></button>
          </div>

        `;

          
      }else{
        const error = await response.text();
        console.log("Like could not be added", error);

      }
      
  } catch (error){
    alert("Error adding like");
    console.log("error adding like", error);
  }
}

