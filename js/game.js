//Declaring Variables
let container, camera, scene, renderer, light, controls, water, sphere, geometry, cube,
    material, ship, secondShip, shootbullet = false,shootbomb, meshArray = [],
    shark, intersects, time, delta, moveDistance, rotateAngle, rotation_matrix,
    loader, waterGeometry,sky, uniforms, parameters, cubeCamera, theta, phi, normal, position,
    shark2, topCamera, SCREEN_HEIGHT, SCREEN_WIDTH, ASPECT,VIEW_ANGLE, NEAR, FAR,hit = 0,
    bulletCount=11,distance,fourthFrames=0,thirdFrames=0,secondViewport=false,frames =0,secondFrames =0,
    secondShootbomb,secondShootbullet=false,secondPosition,secondBulletCount=16,secondMeshArray=[],secondHit=0,
    bulletLeft = true,secondBulletLeft=true,$elie = $("#box"), degree = 0,timer,bulletover=false,
    secondBulletOver=false,score_playerA=0,scorePlayerB=0,DistanceTravelBullet,bullet,shaking=0,mountain,
    impact,treasure,COINS, coins,TRESURE_BOX, Treasure_Box,scorePlayer1 = 0,
    scorePlayer2 = 0,NoOfBulletPlayer1 = 5, NoOfBulletPlayer2 = 5,POWER_BOX, Power_Box,
    master_shootbomb,PowerObj,coinsOBJ;

//Declaring Short Forms
let keyboard = new THREEx.KeyboardState();
let clock = new THREE.Clock();
let bGroup = new THREE.Group();
let raycaster = new THREE.Raycaster();
let pivotPoint = new THREE.Object3D();
let secondPivotPoint = new THREE.Object3D();
let direction = new THREE.Vector3();
let far = new THREE.Vector3();
let finalship = new THREE.Group();
let secondFinalShip = new THREE.Group();
let bulletGroup=new THREE.Group();
let bulletArray = new THREE.Group();
let bulletArray2 = new THREE.Group();
let box = document.getElementById("box");
document.getElementById("playername1").innerHTML=localStorage["player1"];
document.getElementById("playername2").innerHTML=localStorage["player2"];

//Declaring Sounds
let game_sound = document.getElementById("game_sound");
let missile_sound = document.getElementById("missile_sound");
let sea_sound = document.getElementById("sea_sound");
let blast_sound = document.getElementById("blast_sound");
let hit_sound = document.getElementById("hit_sound");
let collect1_sound = document.getElementById("collect1_sound");
let collect2_sound = document.getElementById("collect2_sound");

//Initialization
function init() {

    //Intailizing Scene
    scene = new THREE.Scene();

    //Setting Up Camera And Its postion
    SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    VIEW_ANGLE = 90, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;

    //Camera 1
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);

    //Camera 2
    topCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(topCamera);
    topCamera.position.set(-30, 100, 100);
    topCamera.lookAt(scene.position);

    //Detecting WebGL
    if (Detector.webgl)
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
    else
        renderer = new THREE.CanvasRenderer();

    //Setting Renderer
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container = document.getElementById('container');
    container.appendChild(renderer.domElement);
    THREEx.WindowResize(renderer, topCamera);
    THREEx.WindowResize(renderer, camera);

    //Setting Up Light
    light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(light);

    // Water : Water Geometry
    waterGeometry = new THREE.PlaneBufferGeometry(10000, 10000);

    water = new THREE.Water(waterGeometry, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load(
            "images/waternormals.jpg",
            function(texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }
        ),
        alpha: 1.0,
        sunDirection: light.position.clone().normalize(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: scene.fog !== undefined
    });

    water.rotation.x = -Math.PI / 2;
    scene.add(water);

    // Skybox : Setting Up SkyBox
    sky = new THREE.Sky();
    uniforms = sky.material.uniforms;
    uniforms["turbidity"].value = 10;
    uniforms["rayleigh"].value = 2;
    uniforms["luminance"].value = 1;
    uniforms["mieCoefficient"].value = 0.005;
    uniforms["mieDirectionalG"].value = 0.8;

    parameters = {
        distance: 100,
        inclination: 0.8,
        azimuth: -0.3

    };
    cubeCamera = new THREE.CubeCamera(0.1, 1, 512);
    cubeCamera.renderTarget.texture.generateMipmaps = true;
    cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
    scene.background = cubeCamera.renderTarget;

   //Initializing Models

   //Bomb Box
   loader = new THREE.GLTFLoader();
   loader.load('models/bomb/scene.gltf', function (gltf) {
       gltf.scene.traverse(function (child) {
           child.rotateOnAxis(new THREE.Vector3(1, 1, 0), Math.PI / 4);
           master_shootbomb = new THREE.Group();
           master_shootbomb.add(child);
           master_shootbomb.scale.x = 10;
           master_shootbomb.scale.y = 10;
           master_shootbomb.scale.z = 10;
       });

   });

   //Bomb
   geometry = new THREE.CylinderGeometry( 0.8, 0.8, 3, 32 );
   material = new THREE.MeshBasicMaterial( {color: 'black'} );
   bullet = new THREE.Mesh( geometry, material );
   bullet.rotation.x=-Math.PI/2;
   bulletGroup.add(bullet);
   scene.add(bulletArray);
   scene.add(bulletArray2);

    //Mountain
    loader = new THREE.GLTFLoader();
    loader.load('models/mountain/scene.gltf', function(gltf) {
            scene.add(gltf.scene);
    });

    //Power box
    POWER_BOX = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshBasicMaterial({ color: 'yellow' }));
    addPowerBox();
   
    
    //Treasure Box
    loader = new THREE.GLTFLoader();
    loader.load('models/treasure/scene.gltf', function (gltf) {

        gltf.scene.position.set(0, 5, -80);
        gltf.scene.scale.x = 0.035;
        gltf.scene.scale.y = 0.035;
        gltf.scene.scale.z = 0.035;
        TRESURE_BOX = gltf.scene;
    });

    //coins conatiner
    COINS = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.5, transparent: true, }));
    addCoins();

    //Shark
    loader = new THREE.GLTFLoader();
    loader.load('models/shark/scene.gltf', function(gltf) {

        gltf.scene.scale.x = 5;
        gltf.scene.scale.y = 5;
        gltf.scene.scale.z = 5;
        gltf.scene.position.set(-40, 1.5, 0);
        shark = gltf.scene;
        pivotPoint.add(shark);
        scene.add(pivotPoint);

    });

    //Shark 2 
    loader = new THREE.GLTFLoader();
    loader.load('models/shark2/scene.gltf', function(gltf) {
        gltf.scene.scale.x = 0.2;
        gltf.scene.scale.y = 0.2;
        gltf.scene.scale.z = 0.2;
        gltf.scene.position.set(40, 1.5, 0);
        shark2 = gltf.scene;
        shark2.rotation.x = -6;
        secondPivotPoint.add(shark2);
        scene.add(secondPivotPoint);

    });

    //Ship 1
    loader = new THREE.TextureLoader();
    normal = loader.load("./models/ship/Galleon.jpg");
    loader = new THREE.TDSLoader();
    loader.setResourcePath("Objects/");
    loader.load("models/ship/Galleon.3ds", function(object) {
        object.traverse(function(child) {
            if (child.isMesh) {
                secondMeshArray.push(child);
                child.material.normalMap = normal;
            }
        });
        ship = object; //local to global
        ship.name = localStorage["player1"];
        ship.rotation.x = -Math.PI / 2; //back to front
        ship.rotation.z = (Math.PI/2); //opposite direction
        camera.position.z = ship.position.z + 120; //initial camera position
        finalship.add(ship);
        finalship.add(pivotPoint);
        finalship.name = 'player1';
    });

    //Ship 2
    loader = new THREE.TextureLoader();
    normal = loader.load("./models/ship/Galleon.jpg");
    loader = new THREE.TDSLoader();
    loader.setResourcePath("Objects/");
    loader.load("models/ship/Galleon.3ds", function(object) {
        object.traverse(function(child) {
            if (child.isMesh) {
                meshArray.push(child);
                child.material.normalMap = normal;
            }
        });
        secondShip = object; //local to global
        secondShip.name = localStorage["player2"];
        secondShip.rotation.x = -Math.PI/2; //back to front
        secondShip.rotation.z = -Math.PI/2; //opposite direction
        topCamera.position.z = ship.position.z + 60; //initial camera position
        bGroup.add(secondShip);
        secondFinalShip.add(bGroup);
        secondFinalShip.add(secondPivotPoint);
        secondFinalShip.position.set(40, 0, 0);
        secondFinalShip.name = 'player2';
    });


    //Adding Ships to scene
    scene.add(finalship);
    scene.add(secondFinalShip);

    //Setting Renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
}

//Wheel Rotation
function rotate() {
        
    $elie.css({ WebkitTransform: 'rotate(' + degree + 'deg)'});  
    $elie.css({ '-moz-transform': 'rotate(' + degree + 'deg)'});                      
    timer = setTimeout(function() {
        ++degree; rotate();
    },1);
}




//Toggle ViewPort
function onKeyDown(e) {

    //Bullet 1 Shooting
    if (e.keyCode == 78) { //N
        missile_sound.play();
        if(shootbomb){
            bulletArray.remove(shootbomb);
        }
        if (NoOfBulletPlayer1 != 0) {

            NoOfBulletPlayer1--;
            shootbomb = bulletGroup.clone();
            bulletArray.add(shootbomb);
            shootbomb.rotation=finalship.rotation;
           
            shootbomb.position.x = finalship.position.x;
            shootbomb.position.z = finalship.position.z;
            shootbomb.position.y = 4;
            

            if (finalship.rotation.z == 0)
                shootbomb.rotation.y = finalship.rotation.y;
            else
                shootbomb.rotation.y = -finalship.rotation.y + Math.PI;

            position = new THREE.Vector3(finalship.position.x, finalship.position.y, finalship.position.z);

        

        }

    

    }

    //Bullet 2 Shooting
    if (e.keyCode== 96) { //Num 0
        missile_sound.play();
            if (secondShootbomb) {
    
                bulletArray2.remove(secondShootbomb);
            }
    
                if (NoOfBulletPlayer2 != 0) {
                    NoOfBulletPlayer2--;
                    secondShootbomb = bulletGroup.clone();
                    bulletArray2.add(secondShootbomb);
                    secondShootbomb.rotation=secondFinalShip.rotation;
               
                secondShootbomb.position.x = secondFinalShip.position.x;
                secondShootbomb.position.z = secondFinalShip.position.z;
                secondShootbomb.position.y = 4;
    
                if (secondFinalShip.rotation.z == 0)
                    secondShootbomb.rotation.y = secondFinalShip.rotation.y;
                else
                    secondShootbomb.rotation.y = -secondFinalShip.rotation.y + Math.PI;
    
                secondPosition = new THREE.Vector3(secondFinalShip.position.x, secondFinalShip.position.y, secondFinalShip.position.z);
    
            
    
            }
    
        

    }

    if(e.keyCode == 67){
        secondViewport = true;
    renderer.render(scene, topCamera);
    }

    if(e.keyCode == 86){
       secondViewport = false;
    }
    
    
}

//Update Clock
function update() {
    delta = clock.getDelta();
    moveDistance = 8 * delta;
    rotateAngle = (Math.PI / 2) * delta / 8;

    //Wheel Rotation
    if (keyboard.pressed("D")){
        rotate();
        setTimeout(()=>{
            clearTimeout(timer);
        },1)

    }

    if (keyboard.pressed("A")){
        rotate();
        setTimeout(()=>{
            clearTimeout(timer);
        },1)

    }

    
    //Movement Forward and Backward Ship 1
    if (keyboard.pressed("W")){
         sea_sound.play();
         finalship.translateX(moveDistance*1.2);
        
    }
    if (keyboard.pressed("S")) {
        sea_sound.play();
        finalship.translateX(-moveDistance*1.2);
       
    }
    //Rotate left/right Ship 1
    rotation_matrix = new THREE.Matrix4().identity();
    if (keyboard.pressed("A")) {
        sea_sound.play();
        finalship.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle);

    }
    if (keyboard.pressed("D")){
        sea_sound.play();
         finalship.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle);

    }
    //Movement Forward and Backward Ship 2
    if (keyboard.pressed("up")){
         sea_sound.play();
         secondFinalShip.translateX(-moveDistance*1.2);
    }
    if (keyboard.pressed("down")) {
        sea_sound.play();
        secondFinalShip.translateX(moveDistance*1.2);
         
    }

    //Rotate left/right Ship 2
    rotation_matrix = new THREE.Matrix4().identity();
    if (keyboard.pressed("left")){
        sea_sound.play();
         secondFinalShip.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle);
    }
    if (keyboard.pressed("right")) {
        sea_sound.play();
        secondFinalShip.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle);
    }

    //Rendering Multiple Viewports and Cameras
    SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    topCamera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();
    topCamera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setViewport(2, 2, SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.clear();

    // Main Camera
    renderer.setViewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.render(scene, camera);

    // Top/Alternate Camera
    renderer.clearDepth();
    renderer.setViewport(0.0005 * SCREEN_WIDTH, 1, 0.3 * SCREEN_WIDTH - 2, SCREEN_HEIGHT - 300);

    //Toggle Top ViewPort
    if(secondViewport){
    renderer.render(scene, topCamera);
    }

    //Bomb Velocity 
    if (shootbomb) 
    shootbomb.translateZ(moveDistance * 12);

    //Bomb2 Velocity
    if (secondShootbomb)
    secondShootbomb.translateZ(moveDistance * 12);

    if (Power_Box) {
        
        var originPoint = Power_Box.position.clone();

        for (var vertexIndex = 0; vertexIndex < Power_Box.geometry.vertices.length; vertexIndex++) {
            var localVertex = Power_Box.geometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4(Power_Box.matrix);
            var directionVector = globalVertex.sub(Power_Box.position);

            var raycast = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
            var Allmesh = meshArray.concat(secondMeshArray);

            var collisionResults = raycast.intersectObjects(Allmesh);
            if (collisionResults.length > 0) {
                scene.remove(Power_Box);
                Power_Box = undefined;
                scene.remove(PowerObj)
                PowerObj = undefined;
                collect1_sound.play();
                if (collisionResults[0].object.parent.parent.name == "player1") {

                    NoOfBulletPlayer1 = 5;
                    scorePlayer1 += 100;

                } else
                    if (collisionResults[0].object.parent.parent.parent.name == "player2") {
                        NoOfBulletPlayer2 = 5;
                        scorePlayer2 += 100;
                    }



            }
        }
    }




    if (coins) {
        
        var originPoint = coins.position.clone();

        for (var vertexIndex = 0; vertexIndex < coins.geometry.vertices.length; vertexIndex++) {
            var localVertex = coins.geometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4(coins.matrix);
            var directionVector = globalVertex.sub(coins.position);

            var raycast = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
            var Allmesh = meshArray.concat(secondMeshArray);

            var collisionResults = raycast.intersectObjects(Allmesh);
            if (collisionResults.length > 0) {
                scene.remove(coins);
                coins = undefined;
                scene.remove(coinsOBJ);
                coinsOBJ = undefined;
                collect2_sound.play();
               
                if (collisionResults[0].object.parent.parent.name == "player1") {
                    scorePlayer1 += 500;
                    console.log("player1 score:" + scorePlayer1)

                } else
                    if (collisionResults[0].object.parent.parent.parent.name == "player2") {
                        scorePlayer2 += 500;
                        console.log("player2 score:" + scorePlayer2)
                    }



            }
        }
    }

    if (coinsOBJ) {
        coinsOBJ.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle * 2);
    }

    if (PowerObj) {
        PowerObj.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle * 2);
    }



//Collision Detection (Bomb to Ships)
      if(shootbomb){
        position = shootbomb.position.clone();
        position.z+=2;  
        raycaster.set(shootbomb.position, direction.subVectors(shootbomb.position,position).normalize());
        raycaster.far = far.subVectors(shootbomb.position, position).length();
        intersects = raycaster.intersectObjects(meshArray);
         if (intersects.length > 0) {
            hit++;
            hit_sound.play();
            scene.remove(shootbomb);
            shootbomb=undefined;
        }

      }

      if(secondShootbomb){
        secondPosition = secondShootbomb.position.clone();
        secondPosition.z+=2;  
        raycaster.set(secondShootbomb.position, direction.subVectors(secondShootbomb.position,secondPosition).normalize());
        raycaster.far = far.subVectors(secondShootbomb.position, secondPosition).length();
        intersects = raycaster.intersectObjects(secondMeshArray);
         if (intersects.length > 0) {
            secondHit++;
            hit_sound.play();
            scene.remove(secondShootbomb);
            secondShootbomb=undefined;
        }

      }

    //Adjusting Camera According to Distance between Ships
    distance =finalship.position.distanceTo( secondFinalShip.position );
  
    // if(distance<30)
    // {
    //     finalship.position.x = finalship.position.x - 25;
    //     secondFinalShip.position.x = secondFinalShip.position.x +25;
    // }

    // if(distance<150 && Math.floor(camera.position.z)>80)
    // camera.position.z -= 0.5;
      
    // if(distance>150 && Math.floor(camera.position.z)<160 )
    // camera.position.z+= 0.5;
        
    if(distance<55)
    {
        finalship.position.x = finalship.position.x - 5;
        secondFinalShip.position.x = secondFinalShip.position.x +5;
    }

    if(distance<150 && Math.floor(camera.position.z)>60)
    camera.position.z -= 0.5;
      
    if(distance>150 && Math.floor(camera.position.z)<120 )
    camera.position.z+= 0.5;
        

    //Updating Sun
    parameters.distance = 500;
    if (Math.floor(parameters.inclination) < 0.5)
        parameters.inclination += 0.001;
    if (Math.floor(parameters.inclination) > 0.5)
        parameters.inclination -= 0.001;
    parameters.azimuth += 0.0005;

    function updateSun() {
        theta = Math.PI * (parameters.inclination - 0.5);
        phi = 2 * Math.PI * (parameters.azimuth - 0.5);

        light.position.x = parameters.distance * Math.cos(phi);
        light.position.y =
            parameters.distance * Math.sin(phi) * Math.sin(theta);
        light.position.z =
            parameters.distance * Math.sin(phi) * Math.cos(theta);

        sky.material.uniforms["sunPosition"].value = light.position.copy(
            light.position
        );
        water.material.uniforms["sunDirection"].value
            .copy(light.position)
            .normalize();

        cubeCamera.update(renderer, sky);
    }

    updateSun();

}

//Render Function
function render() {

    //Sharks revolution around ships
    pivotPoint.position.set(finalship.position.x, finalship.position.y, finalship.position.z)
    pivotPoint.rotation.y += 0.01;
    secondPivotPoint.position.set(secondFinalShip.position.x, secondFinalShip.position.y, secondFinalShip.position.z)
    secondPivotPoint.rotation.y += 0.01;

        //Adjusting Ship hits and Jerk of Ships(Ship1 to secondShip)
    if (hit == 1) {
        $("#4").hide();

        frames = frames + 1;
        if (frames < 20) {

            secondShip.rotation.x += 0.005;
        }

        else if (frames >= 20 && frames < 40) {

            secondShip.rotation.x -= 0.005;
        }

        else if (frames >= 40 && frames < 80) {

            secondShip.rotation.x -= 0.005;

        }

        else if (frames >= 80 && frames < 120) {

            secondShip.rotation.x += 0.005;

        }

    }


    if (hit == 2) {
        $("#5").hide();

        secondFrames = secondFrames + 1;
        if (secondFrames < 40) {

            secondShip.rotation.x += 0.005;

        }
        else if (secondFrames >= 40 && secondFrames < 60) {

            secondShip.rotation.x -= 0.005;
        }

        else if (secondFrames >= 60 && secondFrames < 100) {

            secondShip.rotation.x -= 0.005;

        }
        else if (secondFrames >= 100 && secondFrames < 140) {

            secondShip.rotation.x += 0.005;

        }

    }

    if (hit == 3) {
        blast_sound.play();
        bulletLeft2 = false;
        $("#6").hide();
        localStorage["playerwin"] = ship.name;
        secondShip.rotation.x += 0.01;
        secondShip.position.y -= 0.1;
        setTimeout(function () {
            location.replace("scoreboard.html")
        }, 5000)


    }




    //Adjusting Ship hits and Jerk of Ships(secondShip to Ship1)
    if (secondHit == 1) {
        $("#1").hide();

        thirdFrames = thirdFrames + 1;
        if (thirdFrames < 20) {

            ship.rotation.x += 0.005;

        }
        else if (thirdFrames >= 20 && thirdFrames < 40) {

            ship.rotation.x -= 0.005;
        }

        else if (thirdFrames >= 40 && thirdFrames < 80) {

            ship.rotation.x -= 0.005;

        }
        else if (thirdFrames >= 80 && thirdFrames < 120) {

            ship.rotation.x += 0.005;

        }

    }


    if (secondHit == 2) {
        $("#2").hide();

        fourthFrames = fourthFrames + 1;
        if (fourthFrames < 40) {

            ship.rotation.x += 0.005;
        }
        else if (fourthFrames >= 40 && fourthFrames < 60) {

            ship.rotation.x -= 0.005;
        }

        else if (fourthFrames >= 60 && fourthFrames < 100) {

            ship.rotation.x -= 0.005;

        }
        else if (fourthFrames >= 100 && fourthFrames < 140) {

            ship.rotation.x += 0.005;

        }

    }

    if (secondHit == 3) {
        bulletLeft = false;
        blast_sound.play();
        localStorage["playerwin"] = secondShip.name;
        $("#3").hide();
        ship.rotation.x += 0.01;
        ship.position.y -= 0.1;
        setTimeout(function () {
            location.replace("scoreboard.html")
        }, 5000)
    }
            //Controlling visibility of 1st player Bullets
            switch (NoOfBulletPlayer1) {
                case 1: $("#11").show();
                    $("#12").hide();
                    $("#13").hide();
                    $("#14").hide();
                    $("#15").hide();
                    break;
        
                case 2: $("#11").show();
                    $("#12").show();
                    $("#13").hide();
                    $("#14").hide();
                    $("#15").hide();
                    break;
                case 3: $("#11").show();
                    $("#12").show();
                    $("#13").show();
                    $("#14").hide();
                    $("#15").hide();
                    break;
        
                case 4: $("#11").show();
                    $("#12").show();
                    $("#13").show();
                    $("#14").show();
                    $("#15").hide();
                    break;
        
                case 5: $("#11").show();
                    $("#12").show();
                    $("#13").show();
                    $("#14").show();
                    $("#15").show();
                    break;
        
                default: $("#11").hide();
                    $("#12").hide();
                    $("#13").hide();
                    $("#14").hide();
                    $("#15").hide();
        
            }
        
            //Controlling visibility of 2nd player Bullets
            switch (NoOfBulletPlayer2) {
                case 1: $("#16").show();
                    $("#17").hide();
                    $("#18").hide();
                    $("#19").hide();
                    $("#20").hide();
                    break;
        
                case 2: $("#16").show();
                    $("#17").show();
                    $("#18").hide();
                    $("#19").hide();
                    $("#20").hide();
                    break;
                case 3: $("#16").show();
                    $("#17").show();
                    $("#18").show();
                    $("#19").hide();
                    $("#20").hide();
                    break;
        
                case 4: $("#16").show();
                    $("#17").show();
                    $("#18").show();
                    $("#19").show();
                    $("#20").hide();
                    break;
        
                case 5: $("#16").show();
                    $("#17").show();
                    $("#18").show();
                    $("#19").show();
                    $("#20").show();
                    break;
        
                default: $("#16").hide();
                    $("#17").hide();
                    $("#18").hide();
                    $("#19").hide();
                    $("#20").hide();
                    break;
            }
        
            $('#player1coin').text(scorePlayer1);
            $('#player2coin').text(scorePlayer2);
        

    //Water effect
    time = performance.now() * 0.001;
    camera.position.y = Math.sin(time * 2) + 40;
    water.material.uniforms["time"].value += 1.0 / 60.0;
    renderer.render(scene, camera);
}

//Animate
function animate() {
    requestAnimationFrame(animate);
    render();
    update();
}

//Impact of hit
function getshaking(distance)
        {
            impact=(1/(distance-20)); 
          return impact;
            
        }

        //Adding Power Box
        function addPowerBox() {
            setTimeout(() => {
                Power_Box = POWER_BOX.clone();
                PowerObj = master_shootbomb.clone();
                Power_Box.position.set(getRndInteger(-100, 100), 2, getRndInteger(0, -100));
                PowerObj.position.set(Power_Box.position.x, 10, Power_Box.position.z)
                scene.add(Power_Box);
                scene.add(PowerObj);
                // powerBox = true;
                setTimeout(() => {
                    scene.remove(Power_Box);
                    scene.remove(PowerObj)
                    Power_Box = undefined;
                    PowerObj = undefined;
                    // powerBox = false;
                    addPowerBox();
                }, 10000);
            }, 30000);
        }
        
        //Adding Coin Box
        function addCoins() {
            setTimeout(() => {
                coins = COINS.clone();
                coinsOBJ = TRESURE_BOX.clone();
                coins.position.set(getRndInteger(-100, 100), 4, getRndInteger(0, -100));
                coinsOBJ.position.set(coins.position.x, coins.position.y, coins.position.z);
                // coinBox = true;
                scene.add(coins);
                scene.add(coinsOBJ);
                setTimeout(() => {
                    scene.remove(coinsOBJ);
                    coinsOBJ = undefined;
                    scene.remove(coins);
                    coins = undefined;
                    // coinBox = false;
                    addCoins();
                }, 30000);
            }, 10000);
        }
        
        //Random Positions of Boxes
        function getRndInteger(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
        

//Game Calling
init();
animate();



// //Listeners
window.addEventListener("keydown", onKeyDown, false);