class AcGameMenu{constructor(t){this.root=t,this.$menu=$('\n            <div class="ac-game-menu">\n                <div class="ac-game-menu-field">\n                    <div class="ac-game-menu-field-item ac-game-menu-field-item-single">\n                        单人模式\n                    </div>\n                    <br>\n                    <div class="ac-game-menu-field-item ac-game-menu-field-item-multiplayer">\n                        多人模式\n                    </div>\n                    <br>\n                    <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">\n                        退出\n                    </div>                \n                </div>\n            </div>\n            '),this.root.$ac_game.append(this.$menu),this.$single=this.$menu.find(".ac-game-menu-field-item-single"),this.$multi=this.$menu.find(".ac-game-menu-field-item-multiplayer"),this.$settings=this.$menu.find(".ac-game-menu-field-item-settings"),this.menu_hide(),this.start()}start(){this.add_listenning_events()}add_listenning_events(){let t=this;this.$single.click((()=>{t.menu_hide(),t.root.playground.playground_show("single_mode")})),this.$multi.click((()=>{t.menu_hide(),t.root.playground.playground_show("multi_mode")})),this.$settings.click((()=>{t.root.settings.logout_on_remote()}))}menu_show(){this.$menu.show()}menu_hide(){this.$menu.hide()}}let last_timestamp,AC_GAME_OBJECTS=[];class AcGameObject{constructor(){AC_GAME_OBJECTS.push(this),this.has_called_start=!1,this.timedelta=0,this.uuid=this.create_uuid()}create_uuid(){let t="";for(let s=0;s<8;s++){t+=parseInt(Math.floor(10*Math.random()))}return t}start(){}update(){}on_destroy(){"me"===this.is_me&&"fighting"===this.playground.state&&(this.playground.state="over",this.playground.end_field.lose())}destroy(){this.on_destroy();for(let t=0;t<AC_GAME_OBJECTS.length;t++)if(AC_GAME_OBJECTS[t]===this){AC_GAME_OBJECTS.splice(t,1);break}}}let AC_GAME_ANIMATION=function(t){for(let s=0;s<AC_GAME_OBJECTS.length;s++){let i=AC_GAME_OBJECTS[s];i.has_called_start?(i.timedelta=t-last_timestamp,i.update()):(i.start(),i.has_called_start=!0)}last_timestamp=t,requestAnimationFrame(AC_GAME_ANIMATION)};requestAnimationFrame(AC_GAME_ANIMATION);class ChatField{constructor(t){this.playground=t,this.$history=$('<div class="chat-field-history">历史记录</div>'),this.$input=$('<input type="text" class="chat-field-input">'),this.$history.hide(),this.$input.hide(),this.func_id=null,this.playground.$playground.append(this.$history),this.playground.$playground.append(this.$input),this.start()}start(){this.add_listening_events()}add_listening_events(){this.$input.keydown((t=>{if(27===t.which&&this.input_hide(),13===t.which){let t=this.playground.root.settings.username,s=this.$input.val();s&&(this.$input.val(""),this.add_message(t,s),this.playground.mps.send_message(s))}}))}history_show(){this.$history.fadeIn(),this.func_id&&clearTimeout(this.func_id),this.func_id=setTimeout((()=>{this.$history.fadeOut(),this.func_id=null}),3e3)}render_message(t){return`<div>${t}</div>`}add_message(t,s){this.history_show();let i=`[${t}] ${s}`;this.$history.append(this.render_message(i)),this.$history.scrollTop(this.$history[0].scrollHeight)}input_show(){this.history_show(),this.$input.show(),this.$input.focus()}input_hide(){this.$input.hide(),this.playground.game_map.$canvas.focus()}}class EndField extends AcGameObject{constructor(t){super(),this.playground=t,this.ctx=this.playground.game_map.ctx,this.state=null,this.win_img=new Image,this.win_img.src="https://cdn.acwing.com/media/article/image/2021/12/17/1_8f58341a5e-win.png",this.lose_img=new Image,this.lose_img.src="https://cdn.acwing.com/media/article/image/2021/12/17/1_9254b5f95e-lose.png"}start(){}update(){this.render()}add_listening_events(){let t=this;this.playground.game_map.$canvas.on("click",(function(){"win"!==t.state&&"lose"!==t.state||(t.playground.playground_hide(),t.playground.root.menu.menu_show())}))}win(){this.state="win";let t=this;setTimeout((function(){t.add_listening_events()}),1e3)}lose(){this.state="lose";let t=this;setTimeout((function(){t.add_listening_events()}),1e3)}render(){let t=this.playground.height/2;"win"===this.state?this.ctx.drawImage(this.win_img,this.playground.width/2-t/2,this.playground.height/2-t/2,t,t):"lose"===this.state&&this.ctx.drawImage(this.lose_img,this.playground.width/2-t/2,this.playground.height/2-t/2,t,t)}}class GameMap extends AcGameObject{constructor(t){super(),this.playground=t,this.$canvas=$("<canvas tabindex=0></canvas>"),this.ctx=this.$canvas[0].getContext("2d"),this.ctx.canvas.width=this.playground.width,this.ctx.canvas.height=this.playground.height,this.playground.$playground.append(this.$canvas)}start(){this.$canvas.focus()}update(){this.render()}resize(){this.ctx.canvas.width=this.playground.width,this.ctx.canvas.height=this.playground.height,this.ctx.fillStyle="rgba(0, 0, 0, 1)",this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height)}render(){this.ctx.fillStyle="rgba(0, 0, 0, 0.2)",this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height)}}class NoticeBoard extends AcGameObject{constructor(t){super(),this.playground=t,this.ctx=this.playground.game_map.ctx,this.message="鼠标右键 移动，按 q + 左键 攻击"}start(){}write_text(t){this.text=t}update(){this.render()}render(){this.ctx.font="20px serif",this.ctx.fillStyle="white",this.ctx.textAlign="center",this.ctx.fillText(`${this.message}`,this.playground.width/2,20),this.playground.players.length<2&&this.ctx.fillText(""+("已就绪"+this.playground.players.length+"人 , 两人后开始游戏"),this.playground.width/2,40)}}class Particle extends AcGameObject{constructor(t,s,i,e,a,h,n,r,l){super(),this.playground=t,this.ctx=this.playground.game_map.ctx,this.x=s,this.y=i,this.radius=e,this.vx=a,this.vy=h,this.color=n,this.speed=r,this.move_length=l,this.friction=.9,this.aps=1/this.playground.scale}start(){}update(){if(this.speed<this.aps||this.move_length<this.aps)return this.destroy(),!1;let t=Math.min(this.move_length,this.speed*this.timedelta/1e3);this.x+=this.vx*t,this.y+=this.vy*t,this.speed*=this.friction,this.move_length-=t,this.render()}render(){let t=this.playground.scale;this.ctx.beginPath(),this.ctx.arc(this.x*t,this.y*t,this.radius*t,0,2*Math.PI,!1),this.ctx.fillStyle=this.color,this.ctx.fill()}}class Player extends AcGameObject{constructor(t,s,i,e,a,h,n,r,l){super(),this.playground=t,this.ctx=this.playground.game_map.ctx,this.x=s,this.y=i,this.move_length=0,this.radius=e,this.color=a,this.speed=h,this.vx=0,this.vy=0,this.damagex=0,this.damagey=0,this.damage_speed=0,this.is_me=n,this.username=r,this.photo=l,this.aps=.01,this.cur_skill=null,this.friction=.9,this.spent_time=0,this.fireballs=[],"robot"!==this.is_me&&(this.img=new Image,this.img.src=l)}start(){if(this.playground.player_count++,this.playground.players.length>=2&&(this.playground.state="fighting"),"me"===this.is_me)this.add_listening_events();else if("robot"===this.is_me){let t=Math.random()*this.playground.width/this.playground.scale,s=Math.random()*this.playground.height/this.playground.scale;this.move_to(t,s)}}add_listening_events(){this.playground.game_map.$canvas.on("contextmenu",(()=>!1)),this.playground.game_map.$canvas.on("mousedown",(t=>{if("multi_mode"===this.playground.mode&&"waiting"===this.playground.state)return!0;const s=this.ctx.canvas.getBoundingClientRect();if(3===t.which){let i=(t.clientX-s.left)/this.playground.scale,e=(t.clientY-s.top)/this.playground.scale;this.move_to(i,e),"multi_mode"===this.playground.mode&&this.playground.mps.send_move_to(i,e)}else if(1===t.which){let i=(t.clientX-s.left)/this.playground.scale,e=(t.clientY-s.top)/this.playground.scale;if("fireball"===this.cur_skill){let t=this.shoot_fireball(i,e);"multi_mode"===this.playground.mode&&this.playground.mps.send_shoot_fireball(i,e,t.uuid)}this.cur_skill=null}})),this.playground.game_map.$canvas.keydown((t=>{if(13===t.which){if("multi_mode"===this.playground.mode)return console.log("send message"),this.playground.chat_field.input_show(),!1;27===t.which&&"multi_mode"===this.playground.mode&&this.playground.chat_field.input_hide()}81===t.which&&(this.cur_skill="fireball")}))}shoot_fireball(t,s){let i=this.x,e=this.y,a=.01*this.playground.height/this.playground.scale,h=Math.atan2(s-this.y,t-this.x),n=Math.cos(h),r=Math.sin(h),l=.5*this.playground.height/this.playground.scale,o=this.playground.height/this.playground.scale,d=.015*this.playground.height/this.playground.scale,g=new FireBall(this.playground,this,i,e,a,n,r,"orange",l,o,d);return this.fireballs.push(g),g}destroy_fireball(t){for(let s=0;s<this.fireballs.length;s++){let i=this.fireballs[s];if(i.uuid===t){i.destroy(),this.fireballs.splice(s,1);break}}}receive_attacked(t,s,i,e,a,h){this.x=t,this.y=s,this.was_attacked(i,e)}get_dist(t,s,i,e){let a=t-i,h=s-e;return Math.sqrt(a*a+h*h)}move_to(t,s){this.move_length=this.get_dist(this.x,this.y,t,s);let i=Math.atan2(s-this.y,t-this.x);this.vx=Math.cos(i),this.vy=Math.sin(i)}was_attacked(t,s){if(this.radius-=s,this.radius<=this.aps){this.destroy();for(let t=0;t<this.playground.players.length;t++){this.playground.players[t]===this&&this.playground.players.splice(t,1)}return!1}this.damagex=Math.cos(t),this.damagey=Math.sin(t),this.damage_speed=10*s;for(let t=0;t<10*Math.random()*5;t++){let t=this.x,s=this.y,i=this.radius*Math.random()*.21,e=Math.random()*Math.PI*2,a=Math.cos(e),h=Math.sin(e),n=this.color,r=10*this.speed,l=this.radius*Math.random()*10;new Particle(this.playground,t,s,i,a,h,n,r,l)}}update_move(){if(this.spent_time+=this.timedelta/1e3,this.spent_time>5&&"robot"===this.is_me&&Math.random()<1/180){let t=this.playground.players[0];this.shoot_fireball(t.x,t.y)}if(this.damage_speed>10*this.aps)this.vx=this.vy=0,this.move_length=0,this.x+=2*this.damagex*this.damage_speed*this.timedelta/1e3,this.y+=2*this.damagey*this.damage_speed*this.timedelta/1e3,this.damage_speed*=this.friction;else if(this.move_length<this.aps){if(this.move_length=0,this.vx=this.vy=0,"robot"===this.is_me){let t=Math.random()*this.playground.width/this.playground.scale,s=Math.random()*this.playground.height/this.playground.scale;this.move_to(t,s)}}else{let t=Math.min(this.move_length,this.speed*this.timedelta/1e3);this.x+=this.vx*t,this.y+=this.vy*t,this.move_length-=t}}update_win(){"fighting"===this.playground.state&&"me"===this.is_me&&1===this.playground.players.length&&(this.playground.state="over",this.playground.end_field.win())}update(){this.update_win(),this.update_move(),this.render()}render(){let t=this.playground.scale;"robot"!==this.is_me?(this.ctx.save(),this.ctx.beginPath(),this.ctx.arc(this.x*t,this.y*t,this.radius*t,0,2*Math.PI,!1),this.ctx.stroke(),this.ctx.clip(),this.ctx.drawImage(this.img,this.x*t-this.radius*t,this.y*t-this.radius*t,this.radius*t*2,this.radius*t*2),this.ctx.restore()):"robot"===this.is_me&&(this.ctx.beginPath(),this.ctx.arc(this.x*t,this.y*t,this.radius*t,0,2*Math.PI,!1),this.ctx.fillStyle=this.color,this.ctx.fill())}}class FireBall extends AcGameObject{constructor(t,s,i,e,a,h,n,r,l,o,d){super(),this.playground=t,this.player=s,this.ctx=this.playground.game_map.ctx,this.x=i,this.y=e,this.radius=a,this.vx=h,this.vy=n,this.color=r,this.speed=l,this.move_length=o,this.damage=d,this.aps=.1}start(){}update(){if(this.move_length<this.aps||this.speed<this.aps)return this.destroy(),!1;this.update_move(),"enemy"!==this.player.is_me&&this.update_attack(),this.render()}update_move(){let t=Math.min(this.move_length,this.speed*this.timedelta/1e3);this.x+=this.vx*t,this.y+=this.vy*t,this.move_length-=t}update_attack(){for(let t=0;t<this.playground.players.length;t++){let s=this.playground.players[t];this.player!=s&&this.is_collision(s)&&this.attack(s)}}attack(t){let s=Math.atan2(t.y-this.y,t.x-this.x);t.was_attacked(s,this.damage),"multi_mode"===this.playground.mode&&this.playground.mps.send_attack(t.uuid,t.x,t.y,s,this.damage,this.uuid),this.destroy()}get_dist(t,s,i,e){let a=t-i,h=s-e;return Math.sqrt(a*a+h*h)}is_collision(t){return this.get_dist(this.x,this.y,t.x,t.y)<this.radius+t.radius}render(){let t=this.playground.scale;this.ctx.beginPath(),this.ctx.arc(this.x*t,this.y*t,this.radius*t,0,2*Math.PI,!1),this.ctx.fillStyle=this.color,this.ctx.fill()}}class MultiPlayerSocket{constructor(t){this.playground=t,this.ws=new WebSocket("wss://app7342.acapp.acwing.com.cn/wss/multiplayer/"),this.start()}start(){this.receive()}receive(){let t=this;this.ws.onmessage=function(s){let i=JSON.parse(s.data),e=i.uuid;if(e===t.uuid)return!1;let a=i.event;"create_player"===a?t.receive_create_player(e,i.username,i.photo):"move_to"===a?t.receive_move_to(e,i.tx,i.ty):"shoot_fireball"===a?t.receive_shoot_fireball(e,i.tx,i.ty,i.ball_uuid):"attack"===a?t.receive_attack(e,i.attackee_uuid,i.x,i.y,i.angle,i.damage,i.ball_uuid):"send_message"===a&&t.receive_message(e,i.text)}}send_create_player(t,s){this.ws.send(JSON.stringify({event:"create_player",uuid:this.uuid,username:t,photo:s}))}receive_create_player(t,s,i){let e=new Player(this.playground,this.playground.width/2/this.playground.scale,.5,.05,"white",.15,"enemy",s,i);e.uuid=t,this.playground.players.push(e)}send_move_to(t,s){this.ws.send(JSON.stringify({event:"move_to",uuid:this.uuid,tx:t,ty:s}))}get_player(t){for(let s=0;s<this.playground.players.length;s++){let i=this.playground.players[s];if(i.uuid===t)return i}return!1}receive_move_to(t,s,i){let e=this.get_player(t);e&&e.move_to(s,i)}send_shoot_fireball(t,s,i){this.ws.send(JSON.stringify({event:"shoot_fireball",uuid:this.uuid,tx:t,ty:s,ball_uuid:i}))}receive_shoot_fireball(t,s,i,e){let a=this.get_player(t);if(a){a.shoot_fireball(s,i).uuid=e}}send_attack(t,s,i,e,a,h){this.ws.send(JSON.stringify({event:"attack",uuid:this.uuid,attackee_uuid:t,x:s,y:i,angle:e,damage:a,ball_uuid:h}))}receive_attack(t,s,i,e,a,h,n){let r=this.get_player(t),l=this.get_player(s);r&&l&&l.receive_attacked(i,e,a,h,n,r)}send_message(t){this.ws.send(JSON.stringify({event:"send_message",uuid:this.uuid,text:t}))}receive_message(t,s){let i=this.get_player(t).username;this.playground.chat_field.add_message(i,s)}}class AcGamePlayground{constructor(t){this.root=t,this.$playground=$('\n<div class="ac-game-playground">\n\n</div>\n'),this.playground_hide(),this.root.$ac_game.append(this.$playground),this.start()}resize(){this.width=this.$playground.width(),this.height=this.$playground.height();let t=Math.min(this.width/16,this.height/9);this.width=16*t,this.height=9*t,this.scale=this.height,this.game_map&&this.game_map.resize()}get_random_color(){return["blue","red","pink","yellow","green","purple"][Math.floor(6*Math.random())]}create_uuid(){let t="";for(let s=0;s<8;s++){t+=parseInt(Math.floor(10*Math.random()))}return t}start(){let t=this,s=this.create_uuid();$(window).on(`resize.${s}`,(function(){t.resize()})),this.root.AcWingOs&&this.root.AcWingOs.api.window.on_close((function(){$(window).off(`resize.${s}`)}))}playground_show(t){if(this.$playground.show(),this.game_map=new GameMap(this),this.resize(),this.mode=t,this.state="waiting",this.player_count=0,this.players=[],this.players.push(new Player(this,this.width/2/this.scale,this.height/2/this.scale,.05*this.height/this.scale,"white",.15*this.height/this.scale,"me",this.root.settings.username,this.root.settings.photo)),"single_mode"===t){for(let t=0;t<5;t++)this.players.push(new Player(this,this.width/2/this.scale,this.height/2/this.scale,.05*this.height/this.scale,this.get_random_color(),.15*this.height/this.scale,"robot"));this.notice_board=new NoticeBoard(this),this.end_field=new EndField(this)}else if("multi_mode"===t){let t=this;this.mps=new MultiPlayerSocket(this),this.chat_field=new ChatField(this),this.mps.uuid=this.players[0].uuid,this.mps.ws.onopen=()=>{t.mps.send_create_player(this.root.settings.username,this.root.settings.photo)},this.notice_board=new NoticeBoard(this),this.end_field=new EndField(this)}}playground_hide(){for(;this.players&&this.players.length>0;)console.log(this.players[0]),this.players[0].destroy(),this.players.splice(0,1);this.game_map&&(this.game_map.destroy(),this.game_map=null),this.end_field&&(this.end_field.destroy(),this.end_field=null),this.notice_board&&(this.notice_board.destroy(),this.notice_board=null),this.$playground.empty(),this.$playground.hide()}}class Settings{constructor(t){this.root=t,this.platform="web",this.root.AcWingOs&&(this.platform="acapp"),this.username="",this.photo="",this.$settings=$('\n            <div class="ac-game-settings">\n                <div class="ac-game-settings-login">\n                    <div class="ac-game-settings-title">\n                        登  录\n                    </div>\n                    <div class="ac-game-settings-username">\n                        <div class="ac-game-settings-item">\n                            <input type="text" placeholder="用户名">\n                        </div>      \n                    </div>\n                    <div class="ac-game-settings-password">\n                        <div class="ac-game-settings-item">\n                            <input type="password" placeholder="密码">\n                        </div>\n                    </div>\n                    <div class="ac-game-settings-submit">\n                        <div class="ac-game-settings-item">\n                            <button>登 录</button>\n                        </div>\n                    </div>\n                    <div class="ac-game-settings-error-message">\n                        \n                    </div>\n                    <div class="ac-game-settings-options">\n                        注册\n                    </div>\n                    <br>\n                    <div class="ac-game-settings-acwing">\n                        <img width="30" src="https://app7342.acapp.acwing.com.cn/static/images/settings/aclogo.png">\n                        <div class="ac-game-settings-acwing-text">\n                            acwing一键登录\n                        </div>\n                    </div>\n                 \n                </div>\n                <div class="ac-game-settings-register">\n                    <div class="ac-game-settings-title">\n                        注册\n                    </div>\n                    <div class="ac-game-settings-username">\n                        <div class="ac-game-settings-item">\n                            <input type="text" placeholder="用户名">\n                        </div>      \n                    </div>\n                    <div class="ac-game-settings-password ac-game-settings-password-first">\n                        <div class="ac-game-settings-item">\n                            <input type="password" placeholder="密码">\n                        </div>\n                    </div>\n                     <div class="ac-game-settings-password ac-game-settings-password-second">\n                        <div class="ac-game-settings-item">\n                            <input type="password" placeholder="确认密码">\n                        </div>\n                    </div>\n                    <div class="ac-game-settings-submit">\n                        <div class="ac-game-settings-item">\n                            <button>注册 </button>\n                        </div>\n                    </div>\n                    <div class="ac-game-settings-error-message">\n                       \n                    </div>\n                    <div class="ac-game-settings-options">\n                        登录\n                    </div>\n            </div>\n            '),this.$login=this.$settings.find(".ac-game-settings-login"),this.$login_username=this.$login.find(".ac-game-settings-username input"),this.$login_password=this.$login.find(".ac-game-settings-password input"),this.$login_submit=this.$login.find(".ac-game-settings-submit button"),this.$login_error_message=this.$login.find(".ac-game-settings-error-message"),this.$login_options=this.$login.find(".ac-game-settings-options"),this.$acwing_lgion=this.$settings.find(".ac-game-settings-acwing img"),this.$login.hide(),this.$register=this.$settings.find(".ac-game-settings-register"),this.$register_username=this.$register.find(".ac-game-settings-username input"),this.$register_password=this.$register.find(".ac-game-settings-password-first input"),this.$register_password_confirm=this.$register.find(".ac-game-settings-password-second input"),this.$register_submit=this.$register.find(".ac-game-settings-submit button"),this.$register_error_message=this.$register.find(".ac-game-settings-error-message"),this.$register_options=this.$register.find(".ac-game-settings-options"),this.$register.hide(),this.root.$ac_game.append(this.$settings),this.start()}start(){"acapp"===this.platform?this.getinfo_acapp():(this.getinfo_web(),this.add_listening_events())}add_listening_events(){this.add_listening_events_login(),this.add_listening_events_register(),this.$acwing_lgion.click((()=>{this.acwing_login()}))}add_listening_events_login(){let t=this;this.$login_options.click((()=>{t.register()})),this.$login_submit.click((()=>{t.login_on_remote()}))}add_listening_events_register(){let t=this;this.$register_options.click((()=>{t.login()})),this.$register_submit.click((()=>{t.register_on_remote()}))}acwing_login(){$.ajax({url:"https://app7342.acapp.acwing.com.cn/settings/acwing/web/apply_code/",type:"GET",success:function(t){"success"===t.result?window.location.replace(t.apply_code_url):alert("获取登录链接失败")}})}login_on_remote(){let t=this.$login_username.val(),s=this.$login_password.val();this.$login_error_message.empty();let i=this;$.ajax({url:"https://app7342.acapp.acwing.com.cn/settings/signin/",type:"GET",data:{username:t,password:s},success:t=>{"success"===t.result?location.reload():i.$login_error_message.html()}})}register_on_remote(){let t=this,s=this.$register_username.val(),i=this.$register_password.val(),e=this.$register_password_confirm.val();this.$register_error_message.empty(),$.ajax({url:"https://app7342.acapp.acwing.com.cn/settings/register/",type:"GET",data:{username:s,password:i,password_confirm:e},success:s=>{"success"===s.result?location.reload():t.$register_error_message.html(s.result)}})}logout_on_remote(){"acapp"===this.platform?this.root.AcWingOs.api.window.close():$.ajax({url:"https://app7342.acapp.acwing.com.cn/settings/signout/",type:"GET",success:t=>{"success"===t.result&&location.reload()}})}acapp_login(t,s,i,e){let a=this;this.root.AcWingOs.api.oauth2.authorize(t,s,i,e,(function(t){"success"===t.result&&(a.username=t.username,a.photo=t.photo,a.settings_hide(),a.root.menu.menu_show())}))}getinfo_acapp(){let t=this;$.ajax({url:"https://app7342.acapp.acwing.com.cn/settings/acwing/acapp/apply_code/",type:"GET",success:s=>{"success"===s.result&&t.acapp_login(s.appid,s.redirect_uri,s.scope,s.state)}})}getinfo_web(){let t=this;$.ajax({url:"https://app7342.acapp.acwing.com.cn/settings/getinfo/",type:"GET",data:{platform:t.platform},success:s=>{console.log(s),"success"===s.result?(t.username=s.data.username,t.photo=s.data.photo,t.settings_hide(),t.root.menu.menu_show()):t.login()}})}settings_hide(){this.$settings.hide()}login(){"web"===this.platform&&(this.$register.hide(),this.$login.show())}register(){"web"===this.platform&&(this.$login.hide(),this.$register.show())}}export class AcGame{constructor(t,s){this.id=t,this.$ac_game=$("#"+t),this.AcWingOs=s,this.settings=new Settings(this),this.menu=new AcGameMenu(this),this.playground=new AcGamePlayground(this),this.start()}start(){}}
