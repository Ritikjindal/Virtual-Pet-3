var dog,dogImg,happyDog, database;
var foodS, foodStock;
var feed,addfood,fedTime,lastFed,foodObj;
var gameState="hungry";
var readState;
var bedroomImg,gardenImg,washroomImg, currentTime;

function preload(){
  dogImg=loadImage("images/dogImg.png");
  happyDog=loadImage("images/Happy.png");
  bedroomImg=loadImage("images/BedRoom.png");
  gardenImg=loadImage("images/Garden.png");
  washroomImg=loadImage("images/WashRoom.png");
}

function setup() {
  database=firebase.database();
	createCanvas(1200,500);

  foodObj=new Food();

  dog=createSprite(850,200,60,60);
  dog.addImage(dogImg);
  dog.scale=0.15;
  
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  })

  feed= createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(46,139,87);
  
  currentTime=hour();
  if(currentTime===(lastFed+1)){
    update("playing");
    foodObj.garden();
  }
  else if(currentTime===(lastFed+2)){
    update("sleeping");
    foodObj.bedroom();
  }
  else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }
  else{
    update("hungry");
    foodObj.display();
  }

  

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  })

  if(gameState!=="hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
   // dog.addImage(dogImg);
  }



  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Fed:"+ lastFed%12 +"PM",350,30);
  }
  else if(lastFed===0){
    text("Last Fed: 12 AM",350,30);
  }
  else{
    text("Last Fed:"+ lastFed+"AM",350,30);
  }

  drawSprites();

}
 function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })

  
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}