const axios = require('axios')
const Discord = require('discord.js')
const Canvas = require('canvas');
const snekfetch = require('snekfetch');
const client = new Discord.Client()


 const prefix = "!faceit";      
const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');
	let fontSize = 70;

	do {
		ctx.font = `${fontSize -= 10}px sans-serif`;
	} while (ctx.measureText(text).width > canvas.width - 300);

	return ctx.font;
};
client.on('message', async msg => {

const headers = {
  'Authorization': 'Bearer ' + process.env.FACEIT_KEY,
   }
var nickname = msg.content.replace("!faceit ", "")
   axios.get (`https://open.faceit.com/data/v4/players?nickname=${nickname}`, {headers}).then(async res => {
   
      var playerInfo ={
      name : res.data.nickname,
      elo: res.data.games.csgo.faceit_elo,
      level: res.data.games.csgo.skill_level,
      cover: res.data.cover_image,
      avatar: res.data.avatar,
      county: res.data.country
        
      };
  if(playerInfo.avatar===""){
  playerInfo.avatar = 'https://cdn-frontend.faceit.com/web/69-1549040609/static/media/404-graphic.741598d1.png' }
             if(playerInfo.cover ===""){
          playerInfo.cover ='https://cdn-frontend.faceit.com/web/69-1549040609/static/media/404-graphic.741598d1.png'}
       if (!msg.author.bot && msg.content.startsWith(prefix)) {
      if(playerInfo.name === null){
        msg.reply("Profile not found");
      }else{

  
  	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');
         ctx.globalAlpha = 0.3;

	const background = await Canvas.loadImage(`${playerInfo.cover}`);
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height,);
ctx.globalAlpha = 1;
	ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	ctx.font = '28px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`Level: ${playerInfo.level}`, canvas.width / 2, canvas.height / 2.5);

  ctx.font = '28px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`ELO: ${playerInfo.elo}`, canvas.width / 2, canvas.height / 1.8);      
  
  ctx.font = '28px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`${playerInfo.name}`, canvas.width / 2, canvas.height / 3.8);

        	const { body: lvl } = await snekfetch.get(`https://cdn-frontend.faceit.com/web/960/src/app/assets/images-compress/skill-icons/skill_level_${playerInfo.level}_svg.svg`);
	const level = await Canvas.loadImage(lvl);
	ctx.drawImage(level, 50, 50, 20, 20);
	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const { body: buffer } = await snekfetch.get(`${playerInfo.avatar}`);
	const avatar = await Canvas.loadImage(buffer);
	ctx.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');

	msg.reply("Here are your stats", attachment);
  }
        
}
});
  });


client.login(process.env.BOT_TOKEN)