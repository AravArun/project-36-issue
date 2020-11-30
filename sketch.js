var dogImg, happyDogImg, dog, database, foodS, foodStock, lastFed, fedTime, foodObj, feed,addFood, food1, foodCount, milk, milkImg;
var washRoomImg,bedroomImg;    
var changeGameState,readGameState;
var dogImg,happyDogImg,milkImg,deadDogImg,gardenImg,lazydogImg,livingRoomImg,runningRightImg,runningLeftImg,washroomImg,bedroomImg;


function preload() {
  dogImg = loadImage('dog.png');
  happyDogImg = loadImage('dog1.png');
  milkImg = loadImage('Milk.png');
  deadDogImg = loadImage("deadDog.png");
  gardenImg = loadImage("Garden.png");
  lazydogImg = loadImage("Lazy.png");
  livingRoomImg = loadImage("Living Room.png");
  runningRightImg = loadImage("running.png");
  runningLeftImg = loadImage("runningLeft.png");
  washroomImg = loadImage("washroom.png");
  bedroomImg = loadImage("bedroom.png");
}

function setup() {
  database = firebase.database();
  dog = createSprite(650, 250);
  dog.scale = 0.3;
  dog.addImage(dogImg);

  milk = createSprite(565, 300);
  milk.addImage(milkImg);
  milk.scale = 0.1;
  milk.visible = false;
  milk.rotation = 55;
  
  foodS = new Food();
  
  foodS.start();

  addFood = createButton("Add food");
  addFood.position(370, 70);
  addFood.mousePressed(addFoods);

  feed = createButton("Feed your Dog");
  feed.position(450, 70);
  feed.mousePressed(feedDog);

  readGameState = database.ref('gameState');
  readGameState.on("value",function(data){
    gameState=data.val();
  });

  canvas = createCanvas(800, 700);
}

function draw() {  
  background(46, 139, 87);

  foodS.display();

  currentTime=hour();
  textSize(15);
        fill("white");
        stroke(5);
        if(fedTime >= 12) {
            text("Last Feed: " + fedTime % 12 + " PM", 50, 60);
        } else if(fedTime === 0){
            text("Last Feed: 12 AM", 50, 60);
        } else {
            text("Last Feed: " + fedTime + " AM", 50, 60);
        }

  if(currentTime == (lastFed +1)){
    update("playing");
    foodS.garden();
  }else if(currentTime == (lastFed +2)){
    update("sleeping");
    foodS.bedroom();
  }else if(currentTime>(lastFed +2)&& currentTime<=(lastFed+4)){
    update("bathing")
    foodS.washroom();
  }else{
    update("hungry")
    foodS.display();
  }

  if(gameState!="hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(lazydogImg);
  }

  function update(state){
    database.ref('/').update(
      {gameState:state}
    )
  }

  drawSprites();
}

function feedDog() {
  foodS.getFoodStock();
  foodS.updateFedTime();

  if(foodCount === 0) {
    foodCount = 0;
    milk.visible = false;
    dog.addImage(dogImg);
  } else {
    foodS.updateFoodStock(foodCount - 1);
    milk.visible = true;
    dog.addImage(happyDogImg);
  }
}

function addFoods() {
 foodS.getFoodStock();

 foodS.updateFoodStock(foodCount + 1); 
}