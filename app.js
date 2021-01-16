//var vfile = require('to-vfile')
var retext = require('retext')
var pos = require('retext-pos')
var keywords = require('retext-keywords')
var toString = require('nlcst-to-string')
var qs = require('querystring');

const express = require('express');
const app = express();
const http = require('http').Server(app);



app.use(express.static('public'))

app.post('/ajax',(req,res)=>{  
    let body = '';
    req.on('data', function(data){
        body += data.toString(); // convert Buffer to string
    });

    req.on('end', function(){
        var post = qs.parse(body);

        retext()
            .use(pos) // Make sure to use `retext-pos` before `retext-keywords`.
            .use(keywords)
            .process(post.myText, function(err, file){
                if (err) throw err
                console.log(file.data.keywords);
                var output = {'keywords':Array(), 'keyphrases':Array()}; //JSON.stringify(file.data);

                file.data.keywords.forEach(function(keyword) {
                  output.keywords.push( keyword.score +  " : " + toString(keyword.matches[0].node) );
                })
              
                file.data.keyphrases.forEach(function(phrase) {
                    output.keyphrases.push( phrase.score + " : " + phrase.matches[0].nodes.map(function(value){return toString(value);}).join('') );
                  })

                res.end(JSON.stringify(output));
            });
    });
});  


//assign port  
var port  = process.env.PORT || 8000;  
app.listen(port,()=>console.log('server run at port '+port));  
