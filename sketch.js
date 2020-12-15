var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score, highscore;

var checkpoint, die, jump;

var gameState;

var gameOver, gameOverimg, restart, restartimg;

function preload(){
 trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  checkpoint = loadSound("checkPoint.mp3");
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
  
  gameOverimg = loadImage("gameOver.png");
  restartimg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  trex.velocityX = 3;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;

  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  highscore = 0;
  
  gameState = "play";

  gameOver = createSprite(300,80,0,0)
  gameOver.addImage("gameover",gameOverimg);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  restart = createSprite(300,120,0,0);
  restart.addImage("restart",restartimg);
  restart.scale = 0.3;
  restart.visible = false;
}

function draw() {
  background(255);
  camera.position.x = trex.x+250;
  camera.position.y = 100;
  
  if(gameState=="play"){
    trex.velocityX = (5+score/50);
  
  score = score + Math.round(getFrameRate()/60);
  if(score%100==0&&score>0){
    checkpoint.play();
  }
  
  if(keyDown("space")&&trex.collide(invisibleGround)) {
    trex.velocityY = -13;
    jump.play();
  }
  
  trex.velocityY = trex.velocityY + 0.8;
  invisibleGround.x = trex.x+150;
  
  
  if (ground.x < trex.x-50){
    ground.x = (trex.x-50)+ground.width/2;
  }
    
  if(obstaclesGroup.isTouching(trex)){
     gameState = "end";
     trex.velocityX = 0;
     die.play();
  }
  
  trex.collide(invisibleGround);
  spawnClouds();
  spawnObstacles();
  }
  
  else if(gameState=="end"){
    trex.changeAnimation("running");
    trex.addAnimation("running",trex_collided);
    //ground.velocityX = 0;
    trex.velocityY = 0;
    if(highscore<score){
      highscore = score;
    }
    //obstaclesGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    //cloudsGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    restart.x = trex.x + 250;
    gameOver.x = trex.x + 250;
    gameOver.visible = true;
    restart.visible = true;
    if(mousePressedOver(restart)){
      reset();
    }
  }
    
  drawSprites();
  
  fill("black");
  text("SCORE: "+ score, trex.x+450,30);
  text("HIGH SCORE: "+highscore,trex.x-40,30);
  
}


function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % (60-Math.round(score/40)) === 0) {
    var cloud = createSprite(trex.x+550,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    //cloud.velocityX = -(3+score/100);
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if(frameCount % (50-Math.round(score/40)) === 0) {
    var obstacle = createSprite(trex.x+550,170,10,40);
    //obstacle.velocityX = -(4+score/100);
    
    //generate random obstacles 
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameOver.visible = false;
  restart.visible = false;
  score = 0;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running");
  trex.addAnimation("running",trex_running);
  gameState = "play";
}
