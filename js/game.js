//Declaring Variables
let container, camera, scene, renderer, light, controls, water, sphere, geometry, cube,
    material, ship, ship2, shootbullet = false, shootbomb, master_shootbomb, meshArray = [],
    shark, intersects, intersects2, time, delta, moveDistance, rotateAngle, rotation_matrix,
    loader, waterGeometry, sky, uniforms, parameters, cubeCamera, theta, phi, normal, position,
    shark2, topCamera, SCREEN_HEIGHT, SCREEN_WIDTH, ASPECT, VIEW_ANGLE, NEAR, FAR, hit = 0,
    bulletCount = 11, distance, frames4 = 0, frames3 = 0, viewport2 = false, frames = 0, frames2 = 0, shootbomb2,
    shootbullet2 = false, position2, bulletCount2 = 16, meshArray2 = [], master_shootbomb2, hit2 = 0,
    bulletLeft = true, bulletLeft2 = true, $elie = $("#box"), degree = 0, timer, bulletover = false,
    bullet2over = false, meshArray3 = [];

//Declaring Short Forms
let keyboard = new THREEx.KeyboardState();
let clock = new THREE.Clock();
let bGroup2 = new THREE.Group();
let raycaster = new THREE.Raycaster();
let pivotPoint = new THREE.Object3D();
let pivotPoint2 = new THREE.Object3D();
let direction = new THREE.Vector3();
let far = new THREE.Vector3();
let finalship = new THREE.Group();
let finalship2 = new THREE.Group();
let box = document.getElementById("box");
document.getElementById("playername1").innerHTML = localStorage["player1"];
document.getElementById("playername2").innerHTML = localStorage["player2"];

//Declaring Sounds
let game_sound = document.getElementById("game_sound");
let missile_sound = document.getElementById("missile_sound");
let sea_sound = document.getElementById("sea_sound");
let blast_sound = document.getElementById("blast_sound");
let hit_sound = document.getElementById("hit_sound");
let collect1_sound = document.getElementById("collect1_sound");
let collect2_sound = document.getElementById("collect2_sound");




// logics
let BULLET = new THREE.Group();
let POWER_BOX, Power_Box;
let NoOfBulletPlayer1 = 5, NoOfBulletPlayer2 = 5;
let scorePlayer1 = 0, scorePlayer2 = 0;
let TRESURE_BOX, Treasure_Box;
let COINS, coins;
let score_playerA = 0, scorePlayerB = 0;



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
    // camera.position.set(0,0,0);

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
            function (texture) {
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


    //bullet
    let bullet_temp = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 3, 32), new THREE.MeshBasicMaterial({ color: 'black' }));
    bullet_temp.rotation.x = -Math.PI / 2;
    BULLET.add(bullet_temp)

    //Power box
    POWER_BOX = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshBasicMaterial({ color: 'yellow' }));
    addPowerBox();






    //Mountain
    loader = new THREE.GLTFLoader();
    loader.load('models/mountain/scene.gltf', function (gltf) {
        gltf.scene.position.set(0, 0, 0);
        scene.add(gltf.scene);
    });

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




    //Bomb
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




    //Shark
    loader = new THREE.GLTFLoader();
    loader.load('models/shark/scene.gltf', function (gltf) {

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
    loader.load('models/shark2/scene.gltf', function (gltf) {
        gltf.scene.scale.x = 0.2;
        gltf.scene.scale.y = 0.2;
        gltf.scene.scale.z = 0.2;
        gltf.scene.position.set(40, 1.5, 0);
        shark2 = gltf.scene;
        shark2.rotation.x = -6;
        pivotPoint2.add(shark2);
        scene.add(pivotPoint2);

    });

    //Ship 1
    loader = new THREE.TextureLoader();
    normal = loader.load("./models/ship/Galleon.jpg");
    loader = new THREE.TDSLoader();
    loader.setResourcePath("Objects/");
    loader.load("models/ship/Galleon.3ds", function (object) {
        object.traverse(function (child) {
            if (child.isMesh) {
                meshArray2.push(child);
                child.material.normalMap = normal;
            }
        });
        ship = object; //local to global
        ship.name = localStorage["player1"];
        ship.rotation.x = -Math.PI / 2; //back to front
        ship.rotation.z = (Math.PI / 2); //opposite direction
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
    loader.load("models/ship/Galleon.3ds", function (object) {
        object.traverse(function (child) {
            if (child.isMesh) {
                meshArray.push(child);
                child.material.normalMap = normal;
            }
        });
        ship2 = object; //local to global
        ship2.name = localStorage["player2"];
        ship2.rotation.x = -Math.PI / 2; //back to front
        ship2.rotation.z = -Math.PI / 2; //opposite direction
        topCamera.position.z = ship.position.z + 60; //initial camera position
        bGroup2.add(ship2);
        finalship2.add(bGroup2);
        finalship2.add(pivotPoint2);
        finalship2.position.set(40, 0, 0);
        finalship2.name = 'player2';
    });


    //Adding Ships to scene
    scene.add(finalship);
    scene.add(finalship2);

    //Setting Renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
}

//Wheel Rotation
function rotate() {

    $elie.css({ WebkitTransform: 'rotate(' + degree + 'deg)' });
    $elie.css({ '-moz-transform': 'rotate(' + degree + 'deg)' });
    timer = setTimeout(function () {
        ++degree; rotate();
    }, 1);
}




//Toggle ViewPort
function onKeyDown(e) {

    if (e.keyCode == 67) {
        viewport2 = true;
        renderer.render(scene, topCamera);
    }

    if (e.keyCode == 86) {
        viewport2 = false;
    }


}

//Update Clock
function update() {
    delta = clock.getDelta();
    moveDistance = 8 * delta;
    rotateAngle = (Math.PI / 2) * delta / 8;

    //Wheel Rotation
    if (keyboard.pressed("D")) {
        rotate();
        setTimeout(() => {
            clearTimeout(timer);
        }, 1)

    }

    if (keyboard.pressed("A")) {
        rotate();
        setTimeout(() => {
            clearTimeout(timer);
        }, 1)

    }

    //Bullet 1 Shooting
    if (keyboard.pressed("space")) { //space
        missile_sound.play();
        if (shootbullet) {

            setTimeout(() => {
                shootbullet = false;
                scene.remove(shootbomb);
            }, 1000);

        }

        if (shootbullet == false && bulletLeft) {

            if (NoOfBulletPlayer1 != 0) {
                NoOfBulletPlayer1--;

                // shootbomb = master_shootbomb.clone();
                shootbomb = BULLET.clone();
                // shootbomb = group.clone();
                scene.add(shootbomb);

                shootbomb.rotation = finalship.rotation;




                shootbomb.position.x = finalship.position.x;
                shootbomb.position.z = finalship.position.z;
                shootbomb.position.y = 4;


                if (finalship.rotation.z == 0)
                    shootbomb.rotation.y = finalship.rotation.y;
                else
                    shootbomb.rotation.y = -finalship.rotation.y + Math.PI;

                position = new THREE.Vector3(finalship.position.x, finalship.position.y, finalship.position.z);

                shootbullet = true;

            }
        }

    }

    //Bullet 2 Movement and Shooting
    if (keyboard.pressed("P")) { //P
        missile_sound.play();
        if (shootbullet2) {

            setTimeout(() => {
                shootbullet2 = false;
                scene.remove(shootbomb);
            }, 1000);

        }

        if (shootbullet2 == false && bulletLeft2) {
            if (NoOfBulletPlayer2 != 0) {
                NoOfBulletPlayer2--;

                shootbomb2 = BULLET.clone();
                scene.add(shootbomb2);
                


                shootbomb2.position.x = finalship2.position.x;
                shootbomb2.position.z = finalship2.position.z;
                shootbomb2.position.y = 4;

                if (finalship2.rotation.z == 0)
                    shootbomb2.rotation.y = finalship2.rotation.y;
                else
                    shootbomb2.rotation.y = -finalship2.rotation.y + Math.PI;

                position2 = new THREE.Vector3(finalship2.position.x, finalship2.position.y, finalship2.position.z);

                shootbullet2 = true;

            }

        }

    }


    //Movement Forward and Backward Ship 1
    if (keyboard.pressed("W")) {
        sea_sound.play();
        finalship.translateX(moveDistance * 1.5);

    }
    if (keyboard.pressed("S")) {
        sea_sound.play();
        finalship.translateX(-moveDistance * 1.5);

    }
    //Rotate left/right Ship 1
    rotation_matrix = new THREE.Matrix4().identity();
    if (keyboard.pressed("A")) {
        sea_sound.play();
        finalship.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle);

    }
    if (keyboard.pressed("D")) {
        sea_sound.play();
        finalship.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle);

    }
    //Movement Forward and Backward Ship 2
    if (keyboard.pressed("up")) {
        sea_sound.play();
        finalship2.translateX(-moveDistance * 1.5);
    }
    if (keyboard.pressed("down")) {
        sea_sound.play();
        finalship2.translateX(moveDistance * 1.5);

    }

    //Rotate left/right Ship 2
    rotation_matrix = new THREE.Matrix4().identity();
    if (keyboard.pressed("left")) {
        sea_sound.play();
        finalship2.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle);
    }
    if (keyboard.pressed("right")) {
        sea_sound.play();
        finalship2.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle);
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
    if (viewport2) {
        renderer.render(scene, topCamera);
    }

    //Bomb Velocity 
    if (shootbomb)
        shootbomb.translateZ(moveDistance * 12);

    //Bomb2 Velocity
    if (shootbomb2)
        shootbomb2.translateZ(moveDistance * 12);

    //  let relativeCameraOffset = new THREE.Vector3(-40, 10, 5);
    // let cameraOffset = relativeCameraOffset.applyMatrix4(finalship.matrixWorld);
    // camera.position.x = cameraOffset.x;
    // camera.position.y = cameraOffset.y;
    // camera.position.z = cameraOffset.z;

    // camera.lookAt(new THREE.Vector3(finalship.position.x - finalship2.position.x, 10, final));


    // Collision Detection by Raycasting (Ship1 to Ship2)
    // if (position && shootbomb) {

    //     console.log(shootbomb.children)
    //     raycaster.set(shootbomb.children[0].position, direction.subVectors(shootbomb.children[0].position, shootbomb.children[1].position).normalize());
    //     raycaster.far = far.subVectors(shootbomb.children[0].position, shootbomb.children[1].position).length();
    //     intersects = raycaster.intersectObjects(meshArray);

    // if (intersects.length > 0) {
    //     hit++;
    //     hit_sound.play();
    //     setTimeout(() => {
    //         shootbullet = false;
    //         scene.remove(shootbomb);
    //     }, 1000);

    //     shootbomb.position.set(position);
    // }

    //  }



  

    if (Power_Box) {
        //    console.log(Power_Box);
        var originPoint = Power_Box.position.clone();

        for (var vertexIndex = 0; vertexIndex < Power_Box.geometry.vertices.length; vertexIndex++) {
            var localVertex = Power_Box.geometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4(Power_Box.matrix);
            var directionVector = globalVertex.sub(Power_Box.position);

            var raycast = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
            var Allmesh = meshArray.concat(meshArray2);

            var collisionResults = raycast.intersectObjects(Allmesh);
            if (collisionResults.length > 0) {
                scene.remove(Power_Box);
                Power_Box = undefined;
                scene.remove(PowerObj)
                PowerObj = undefined;
                collect1_sound.play();
                console.log(collisionResults[0].object.parent.parent);
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
        //    console.log(Power_Box);
        var originPoint = coins.position.clone();

        for (var vertexIndex = 0; vertexIndex < coins.geometry.vertices.length; vertexIndex++) {
            var localVertex = coins.geometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4(coins.matrix);
            var directionVector = globalVertex.sub(coins.position);

            var raycast = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
            var Allmesh = meshArray.concat(meshArray2);

            var collisionResults = raycast.intersectObjects(Allmesh);
            if (collisionResults.length > 0) {
                scene.remove(coins);
                coins = undefined;
                scene.remove(coinsOBJ);
                coinsOBJ = undefined;
                collect2_sound.play();
                console.log(collisionResults[0].object.parent.parent);
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







    if (shootbomb) {
        position = shootbomb.position.clone();
        position.z += 4;
        raycaster.set(shootbomb.position, direction.subVectors(shootbomb.position, position).normalize());
        raycaster.far = far.subVectors(shootbomb.position, position).length();
        intersects = raycaster.intersectObjects(meshArray);
        if (intersects.length > 0) {
            console.log(intersects[0])
            scorePlayer1 += 1000;
            hit++;
            hit_sound.play();
            scene.remove(shootbomb);
            shootbomb = undefined;
        }

    }



    if (shootbomb2) {
        position2 = shootbomb2.position.clone();
        position2.z += 4;
        raycaster.set(shootbomb2.position, direction.subVectors(shootbomb2.position, position2).normalize());
        raycaster.far = far.subVectors(shootbomb2.position, position2).length();
        intersects = raycaster.intersectObjects(meshArray2);
        if (intersects.length > 0) {
            console.log(intersects[0])
            scorePlayer2 += 1000;
            hit2++;
            hit_sound.play();
            scene.remove(shootbomb2);
            shootbomb2 = undefined;
        }

    }




    if (coinsOBJ) {
        coinsOBJ.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle * 2);
    }

    if (PowerObj) {
        PowerObj.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle * 2);
    }




    //Adjusting Camera According to Distance between Ships
    distance = finalship.position.distanceTo(finalship2.position);

    if (distance < 30) {
        finalship.position.x = finalship.position.x - 25;
        finalship2.position.x = finalship2.position.x + 25;
    }

    if (distance < 150 && Math.floor(camera.position.z) > 80)
        camera.position.z -= 0.5;

    if (distance > 150 && Math.floor(camera.position.z) < 160)
        camera.position.z += 0.5;

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

    //Remove Bombs after it crosses the othe ship
    if (shootbomb) {

        var distance2 = finalship.position.distanceTo(shootbomb.position);

        if (distance2 > distance + 40) {
            scene.remove(shootbomb);
            shootbomb = undefined;
        }


    }

    if (shootbomb2) {
        var distance3 = finalship2.position.distanceTo(shootbomb2.position);
        console.log(distance3);
        if (distance3 > distance + 40) {
            scene.remove(shootbomb2);
            shootbomb2 = undefined;
        }

    }

}



//Render Function
function render() {

    //Sharks revolution around ships
    pivotPoint.position.set(finalship.position.x, finalship.position.y, finalship.position.z)
    pivotPoint.rotation.y += 0.01;
    pivotPoint2.position.set(finalship2.position.x, finalship2.position.y, finalship2.position.z)
    pivotPoint2.rotation.y += 0.01;


    //Adjusting Ship hits and Jerk of Ships(Ship1 to Ship2)
    if (hit == 1) {
        $("#4").hide();

        frames = frames + 1;
        if (frames < 20) {

            ship2.rotation.x += 0.005;
        }

        else if (frames >= 20 && frames < 40) {

            ship2.rotation.x -= 0.005;
        }

        else if (frames >= 40 && frames < 80) {

            ship2.rotation.x -= 0.005;

        }

        else if (frames >= 80 && frames < 120) {

            ship2.rotation.x += 0.005;

        }

    }


    if (hit == 2) {
        $("#5").hide();

        frames2 = frames2 + 1;
        if (frames2 < 40) {

            ship2.rotation.x += 0.005;

        }
        else if (frames2 >= 40 && frames2 < 60) {

            ship2.rotation.x -= 0.005;
        }

        else if (frames2 >= 60 && frames2 < 100) {

            ship2.rotation.x -= 0.005;

        }
        else if (frames2 >= 100 && frames2 < 140) {

            ship2.rotation.x += 0.005;

        }

    }

    if (hit == 3) {
        blast_sound.play();
        bulletLeft2 = false;
        $("#6").hide();
        localStorage["playerwin"] = ship.name;
        ship2.rotation.x += 0.01;
        ship2.position.y -= 0.1;
        setTimeout(function () {
            location.replace("scoreboard.html")
        }, 5000)


    }




    //Adjusting Ship hits and Jerk of Ships(Ship2 to Ship1)
    if (hit2 == 1) {
        $("#1").hide();

        frames3 = frames3 + 1;
        if (frames3 < 20) {

            ship.rotation.x += 0.005;

        }
        else if (frames3 >= 20 && frames3 < 40) {

            ship.rotation.x -= 0.005;
        }

        else if (frames3 >= 40 && frames3 < 80) {

            ship.rotation.x -= 0.005;

        }
        else if (frames3 >= 80 && frames3 < 120) {

            ship.rotation.x += 0.005;

        }

    }


    if (hit2 == 2) {
        $("#2").hide();

        frames4 = frames4 + 1;
        if (frames4 < 40) {

            ship.rotation.x += 0.005;
            // ship2.rotation.y += -0.02;
        }
        else if (frames4 >= 40 && frames4 < 60) {

            ship.rotation.x -= 0.005;
        }

        else if (frames4 >= 60 && frames4 < 100) {

            ship.rotation.x -= 0.005;

        }
        else if (frames4 >= 100 && frames4 < 140) {

            ship.rotation.x += 0.005;

        }

    }

    if (hit2 == 3) {
        bulletLeft = false;
        blast_sound.play();
        localStorage["playerwin"] = ship2.name;
        $("#3").hide();
        ship.rotation.x += 0.01;
        ship.position.y -= 0.1;
        setTimeout(function () {
            location.replace("scoreboard.html")
        }, 5000)
    }



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


function addPowerBox() {
    setTimeout(() => {
        Power_Box = POWER_BOX.clone();
        PowerObj = master_shootbomb.clone();
        Power_Box.position.set(getRndInteger(-100, 100), 2, getRndInteger(0, -100));
        PowerObj.position.set(Power_Box.position.x, 10, Power_Box.position.z)
        scene.add(Power_Box);
        scene.add(PowerObj);

        setTimeout(() => {
            scene.remove(Power_Box);
            scene.remove(PowerObj)
            Power_Box = undefined;
            PowerObj = undefined;
            addPowerBox();
        }, 10000);
    }, 30000);
}







function addCoins() {
    setTimeout(() => {
        coins = COINS.clone();
        coinsOBJ = TRESURE_BOX.clone();
        coins.position.set(getRndInteger(-100, 100), 4, getRndInteger(0, -100));
        coinsOBJ.position.set(coins.position.x, coins.position.y, coins.position.z)
        scene.add(coins);
        scene.add(coinsOBJ)
        console.log("coins Added");
        setTimeout(() => {
            scene.remove(coinsOBJ);
            coinsOBJ = undefined;
            scene.remove(coins);
            coins = undefined;
            addCoins();
        }, 30000);
    }, 10000);
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}



// //Listeners
window.addEventListener("keydown", onKeyDown, false);

//Game Calling
init();
animate();





