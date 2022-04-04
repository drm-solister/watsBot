const gify = require('gify');
const fs = require('fs');
const path = require('path');
var http = require('http');

module.exports = {
    name: "gif",
    aliases: ['gify', 'vidtogif'],
    description: "random testing stuff for the test branch",
    guildOnly: false,
    hidden: true,
    requireArgs: false,
    execute(message){

        message.channel.send("working here")

        var url = 'http://video.twimg.com/ext_tw_video/1458941833040519172/pu/vid/480x366/EdrgtL8SN3qGSp92.mp4';
        var file = fs.createWriteStream('out.mp4');
        
        http.get(url, function(res){
         console.log(res.statusCode);
         res.pipe(file);
         res.on('end', function(){
           console.log('done');
         });
        });
        
        var opts = {
          height: 300,
          rate: 30
        };
        
        console.time('convert');
        gify('out.mp4', 'out.gif', opts, function(err){
          if (err) throw err;
          console.timeEnd('convert');
          var s = fs.statSync('out.gif');
          console.log('size: %smb', s.size / 1024 / 1024 | 0);
          fs.rmdir(path.resolve('/tmp/'), (err) => {
              if(err)
                console.log(err)
          })
        });

    }

}

// stuff to do here:
// figure out why the gif process crashes like sometimes but then works the next time always
// delete temporary files after the gif is made and sent
// get either - recent video link - video link sent with command - video link in the message that was replied to when the command was used
// find video frame rate and size, limit gifs to those under 8mb
// test performance on raspberry pi, if processing times are long, limit size and quality and make a temporary "coverting..." message