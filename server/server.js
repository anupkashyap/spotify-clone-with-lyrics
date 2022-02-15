const express = require('express');
const SpotifyWebApi=require('spotify-web-api-node');
const cors=require('cors');
const bodyParser=require('body-parser');

const  LyricsFinder=require('lyrics-finder');
const app =express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.post('/login',(req, res) => {

    const code= req.body.code;
    const spotifyApi= new SpotifyWebApi({
        redirectUri:"http://localhost:3000",
        clientId:'7625de28c79e42f08e51de15812f7700',
        clientSecret:'6506775574384283aaf293a760f4e257'

    })

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken:data.body.access_token,
            refreshToken:data.body.refresh_token,
            expiresIn:data.body.expires_in
        })
    }).catch((err)=>{
        console.log(err);
        res.sendStatus(400);
    })
});

app.post('/refresh',(req, res)=>{

    console.log("Refreshing token");
    
    const refreshToken= req.body.refreshToken;
    const spotifyApi= new SpotifyWebApi({
        redirectUri:"http://localhost:3000",
        clientId:'7625de28c79e42f08e51de15812f7700',
        clientSecret:'6506775574384283aaf293a760f4e257',
        refreshToken,
    });

    spotifyApi.refreshAccessToken().then((data) => {
       res.json({
           accessToken: data.accessToken,
           expiresIn: data.expiresIn
       })
    }).catch((err)=>{
       //console.log('Could not refresh access token',err);
        res.sendStatus(400);
    });
})


app.get('/lyrics', async (req,res)=>{
    const lyrics = (await LyricsFinder(req.query.artist,req.query.track)) || "No Lyrics Found";
    res.json({lyrics});
})

app.listen(3001);