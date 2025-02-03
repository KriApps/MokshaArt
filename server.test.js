const request = require('supertest');
const app = require('./app');
const fs = require('fs');
const path = require('path');




describe('Test Moksha Art Services', ()=>{

    test('POST /api/artpics should upload an art picture and return 201', async () => {
        
        await request(app)
        .post('/api/artpics')
        .field('title', 'Test Art')
        .field('artist', 'Test Artist')
        .field('description', 'Test Description')
        .attach('art', path.join(__dirname, 'test.PNG')) 
        .expect(200)
        .expect('Content-Type', /json/);

    
    });

    test('POST /api/artpics should return 400 when no file is uploaded', async () => {
        await request(app)
        .post('/api/artpics')
        .field('title', 'Test Art')
        .field('artist', 'Test Artist')
        .field('description', 'Test Description')
        .expect(400)
        .expect('Content-Type', /json/);
    });

    test('POST /api/artpics should return 400 when no title, artist or description uploaded', async () => {
        await request(app)
        .post('/api/artpics')
        .attach('art', path.join(__dirname, 'test.PNG')) 
        .expect(400)
        .expect('Content-Type', /json/);
    });

    

    test('GET /artgallery returns status of 200 and json file', async()=>{
        await request(app)
        .get('/artgallery')
        .expect(200)
        .expect('Content-Type', /json/);
    });

    

    test('GET /artgallery returns status of 404 and json error when file cannot be found', async()=>{
        const originalArtFile = path.join(__dirname, 'artgallery.json');
        const tempArtFile = path.join(__dirname, 'artgallery.json.temp');

        fs.renameSync(originalArtFile, tempArtFile);
        
        try{
            return request(app)
            .get('/artgallery')
            .expect(200)
            .expect('Content-Type', /json/);
        }finally{
            fs.renameSync(tempArtFile, originalArtFile);
        }
    });
    

    test('GET /artgallery/:id returns status of 200 and json object', async()=>{
        await  request(app)
        .get('/artgallery/1')
        .expect(200)
        .expect('Content-Type', /json/);
    });

    test('GET /artgallery/:id returns status of 404 and json object with erroneous data of under the starting id', async()=>{
        await request(app)
        .get('/artgallery/0')
        .expect(404)
        .expect('Content-Type', /json/);
    });
    test('GET /artgallery/:id returns status of 404 and json object with erroneous data of over available ids', async()=>{
        await request(app)
        .get('/artgallery/999999')
        .expect(404)
        .expect('Content-Type', /json/);
    });
    test('GET /artgallery/:id returns status of 200 and json object when id is boundary', async()=>{
        
        await request(app)
        .get('/artgallery/1')
        .expect(200)
        .expect('Content-Type', /json/);
    })

    test('POST /artcomments should return 400 when no commentMaker, comment and artofCommentId is uploaded', async () => {
        await request(app)
        .post('/artcomments')
        .expect(400)
        .expect('Content-Type', /json/);
    }); 

    test('POST /artcomments should return 200 when everything is entered and sent ', async () => {
        
        const data = fs.readFileSync('artComments.json', 'utf8' )
        const artCommentsList = JSON.parse(data);

        let idCounter = artCommentsList.length+1 || 1;

        await request(app)
        .post('/artcomments')
        .field('commentMaker', 'Test commentMaker')
        .field('comment', 'Test comment')
        .field('artofCommentId', idCounter)
        .expect(200)
        .expect('Content-Type', /json/);
        
    });

    test('GET /comments/:id returns status of 200 and json objec when valid id is entered', async()=>{
        await  request(app)
        .get('/comments/1')
        .expect(200)
        .expect('Content-Type', /json/);
    });


    test('GET /comments/:id returns status of 200 and json object when id is boundary', async()=>{
        const data = fs.readFileSync('artComments.json', 'utf8' )
        const artCommentsList = JSON.parse(data);
        const maxId = artCommentsList.length;

        await request(app)
        .get(`/comments/${maxId}`)
        .expect(200)
        .expect('Content-Type', /json/);
    });

    test('GET /morecomments/:id returns status of 200 and json object when valid id is entered', async()=>{
        await request(app)
        .get('/morecomments/1')
        .expect(200)
        .expect('Content-Type', /json/);
    });

    test('GET /morecomments/:id returns status of 404 and json object with erroneous data of under the starting id', async()=>{
        await request(app)
        .get('/morecomments/0')
        .expect(404)
        .expect('Content-Type', /json/);
    });

    test('GET /morecomments/:id returns status of 404 and json object with erroneous data of over available ids', async()=>{
        await request(app)
        .get('/morecomments/999999')
        .expect(404)
        .expect('Content-Type', /json/);
    });

    test('GET /morecomments/:id returns status of 200 and json object when id is boundary', async()=>{  
        const data = fs.readFileSync('artComments.json', 'utf8' )
        const artCommentsList = JSON.parse(data);
        const maxId = artCommentsList.length;

        await request(app)
        .get(`/morecomments/${maxId}`)
        .expect(200)
        .expect('Content-Type', /json/);
    });

    test('PATCH /addLikeComment/:id should return 200 when everything  ', async () => {
        
        await request(app)
        .patch('/addLikeComment/1')
        .expect(200)
        .expect('Content-Type', /json/);
        
    });

})

