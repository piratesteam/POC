let container,camera,scene,renderer,light,controls,water,sphere,geometry,cube,material,ship,secondShip,shootbomb,master_shootbomb,shark,intersects,time,delta,moveDistance,rotateAngle,rotation_matrix,loader,waterGeometry,sky,uniforms,parameters,cubeCamera,theta,phi,normal,position,secondShark,topCamera,SCREEN_HEIGHT,SCREEN_WIDTH,ASPECT,VIEW_ANGLE,NEAR,FAR,distance,secondShootbomb,secondPosition,relativeCameraOffset,cameraOffset,timer,coinsOBJ,powerObj,DistanceTravelBullet,bullet,mountain,treasure,COINS,coins,TRESURE_BOX,Treasure_Box,POWER_BOX,Power_Box,relativeCameraOffset2,cameraOffset2,originPoint,vertexIndex,localVertex,globalVertex,directionVector,raycast,allMesh,collisionResults,meshArray=[],hit=0,fourthFrames=0,thirdFrames=0,frames=0,secondFrames=0,secondMeshArray=[],secondHit=0,$elie=$("#box"),degree=0,scorePlayer1=0,scorePlayer2=0,firstPlayerBullets=5,secondPlayerBullets=5,keyboard=new THREEx.KeyboardState,clock=new THREE.Clock,bGroup2=new THREE.Group,raycaster=new THREE.Raycaster,pivotPoint=new THREE.Object3D,pivotPoint2=new THREE.Object3D,direction=new THREE.Vector3,far=new THREE.Vector3,finalship=new THREE.Group,secondFinalShip=new THREE.Group,bulletGroup=new THREE.Group,bulletArray=new THREE.Group,bulletArray2=new THREE.Group,box=document.getElementById("box"),game_sound=document.getElementById("game_sound"),missile_sound=document.getElementById("missile_sound"),sea_sound=document.getElementById("sea_sound"),blast_sound=document.getElementById("blast_sound"),hit_sound=document.getElementById("hit_sound"),collect1_sound=document.getElementById("collect1_sound"),collect2_sound=document.getElementById("collect2_sound");function init(){scene=new THREE.Scene,SCREEN_WIDTH=window.innerWidth,SCREEN_HEIGHT=window.innerHeight,VIEW_ANGLE=90,ASPECT=SCREEN_WIDTH/SCREEN_HEIGHT,NEAR=.1,FAR=2e4,camera=new THREE.PerspectiveCamera(120,ASPECT,NEAR,FAR),scene.add(camera),topCamera=new THREE.PerspectiveCamera(120,ASPECT,NEAR,FAR),scene.add(topCamera),(renderer=Detector.webgl?new THREE.WebGLRenderer({antialias:!0}):new THREE.CanvasRenderer).setSize(SCREEN_WIDTH,SCREEN_HEIGHT),(container=document.getElementById("container")).appendChild(renderer.domElement),THREEx.WindowResize(renderer,topCamera),THREEx.WindowResize(renderer,camera),light=new THREE.HemisphereLight(16777147,526368,1),scene.add(light),waterGeometry=new THREE.PlaneBufferGeometry(1e4,1e4),(water=new THREE.Water(waterGeometry,{textureWidth:512,textureHeight:512,waterNormals:(new THREE.TextureLoader).load("images/waternormals.jpg",function(e){e.wrapS=e.wrapT=THREE.RepeatWrapping}),alpha:1,sunDirection:light.position.clone().normalize(),sunColor:16777215,waterColor:7695,distortionScale:3.7,fog:void 0!==scene.fog})).rotation.x=-Math.PI/2,scene.add(water),sky=new THREE.Sky,(uniforms=sky.material.uniforms).turbidity.value=10,uniforms.rayleigh.value=2,uniforms.luminance.value=1,uniforms.mieCoefficient.value=.005,uniforms.mieDirectionalG.value=.8,parameters={distance:100,inclination:.8,azimuth:-.3},(cubeCamera=new THREE.CubeCamera(.1,1,512)).renderTarget.texture.generateMipmaps=!0,cubeCamera.renderTarget.texture.minFilter=THREE.LinearMipMapLinearFilter,scene.background=cubeCamera.renderTarget,(loader=new THREE.GLTFLoader).load("models/bomb/scene.gltf",function(e){e.scene.traverse(function(e){e.rotateOnAxis(new THREE.Vector3(1,1,0),Math.PI/4),(master_shootbomb=new THREE.Group).add(e),master_shootbomb.scale.x=10,master_shootbomb.scale.y=10,master_shootbomb.scale.z=10})}),geometry=new THREE.CylinderGeometry(.8,.8,3,32),material=new THREE.MeshBasicMaterial({color:"black"}),(bullet=new THREE.Mesh(geometry,material)).rotation.x=-Math.PI/2,bulletGroup.add(bullet),scene.add(bulletArray),scene.add(bulletArray2),(loader=new THREE.GLTFLoader).load("models/mountain/scene.gltf",function(e){e.scene.position.set(0,0,0),scene.add(e.scene)}),POWER_BOX=new THREE.Mesh(new THREE.BoxGeometry(10,10,10),new THREE.MeshBasicMaterial({color:"yellow"})),addPowerBox(),(loader=new THREE.GLTFLoader).load("models/treasure/scene.gltf",function(e){e.scene.position.set(0,5,-80),e.scene.scale.x=.035,e.scene.scale.y=.035,e.scene.scale.z=.035,TRESURE_BOX=e.scene}),COINS=new THREE.Mesh(new THREE.BoxGeometry(10,10,10),new THREE.MeshBasicMaterial({color:65280,opacity:.5,transparent:!0})),addCoins(),(loader=new THREE.GLTFLoader).load("models/shark/scene.gltf",function(e){e.scene.scale.x=5,e.scene.scale.y=5,e.scene.scale.z=5,e.scene.position.set(-40,1.5,0),shark=e.scene,pivotPoint.add(shark),scene.add(pivotPoint)}),(loader=new THREE.GLTFLoader).load("models/shark2/scene.gltf",function(e){e.scene.scale.x=.2,e.scene.scale.y=.2,e.scene.scale.z=.2,e.scene.position.set(40,1.5,0),(secondShark=e.scene).rotation.x=-6,pivotPoint2.add(secondShark),scene.add(pivotPoint2)}),loader=new THREE.TextureLoader,normal=loader.load("./models/ship/Galleon.jpg"),(loader=new THREE.TDSLoader).setResourcePath("Objects/"),loader.load("models/ship/Galleon.3ds",function(e){e.traverse(function(e){e.isMesh&&(secondMeshArray.push(e),e.material.normalMap=normal)}),(ship=e).name=localStorage.player1,ship.rotation.x=-Math.PI/2,ship.rotation.z=Math.PI/2,camera.position.z=ship.position.z+120,finalship.add(ship),finalship.add(pivotPoint),finalship.name="player1"}),loader=new THREE.TextureLoader,normal=loader.load("./models/ship/Galleon.jpg"),(loader=new THREE.TDSLoader).setResourcePath("Objects/"),loader.load("models/ship/Galleon.3ds",function(e){e.traverse(function(e){e.isMesh&&(meshArray.push(e),e.material.normalMap=normal)}),(secondShip=e).name=localStorage.player2,secondShip.rotation.x=-Math.PI/2,secondShip.rotation.z=-Math.PI/2,topCamera.position.z=ship.position.z+60,bGroup2.add(secondShip),secondFinalShip.add(bGroup2),secondFinalShip.add(pivotPoint2),secondFinalShip.position.set(40,0,0),secondFinalShip.name="player2"}),scene.add(finalship),scene.add(secondFinalShip),scene.add(bulletArray),scene.add(bulletArray2),renderer.setSize(window.innerWidth,window.innerHeight),renderer.autoClear=!1}function rotate(){$elie.css({WebkitTransform:"rotate("+degree+"deg)"}),$elie.css({"-moz-transform":"rotate("+degree+"deg)"}),timer=setTimeout(function(){++degree,rotate()},1)}function onKeyDown(e){78==e.keyCode&&(missile_sound.play(),shootbomb&&(bulletArray.remove(shootbomb),shootbomb=void 0),0!=firstPlayerBullets&&(firstPlayerBullets--,shootbomb=bulletGroup.clone(),bulletArray.add(shootbomb),shootbomb.rotation=finalship.rotation,shootbomb.position.x=finalship.position.x,shootbomb.position.z=finalship.position.z,shootbomb.position.y=4,0==finalship.rotation.z?shootbomb.rotation.y=finalship.rotation.y:shootbomb.rotation.y=-finalship.rotation.y+Math.PI,position=new THREE.Vector3(finalship.position.x,finalship.position.y,finalship.position.z))),96==e.keyCode&&(missile_sound.play(),secondShootbomb&&(bulletArray2.remove(secondShootbomb),secondShootbomb=void 0),0!=secondPlayerBullets&&(secondPlayerBullets--,secondShootbomb=bulletGroup.clone(),bulletArray2.add(secondShootbomb),secondShootbomb.rotation=secondFinalShip.rotation,secondShootbomb.position.x=secondFinalShip.position.x,secondShootbomb.position.z=secondFinalShip.position.z,secondShootbomb.position.y=4,0==secondFinalShip.rotation.z?secondShootbomb.rotation.y=secondFinalShip.rotation.y:secondShootbomb.rotation.y=-secondFinalShip.rotation.y+Math.PI,secondPosition=new THREE.Vector3(secondFinalShip.position.x,secondFinalShip.position.y,secondFinalShip.position.z))),67==e.keyCode&&(secondViewport=!0,renderer.render(scene,topCamera)),86==e.keyCode&&(secondViewport=!1)}function update(){if(delta=clock.getDelta(),moveDistance=8*delta,rotateAngle=Math.PI/2*delta/8,keyboard.pressed("D")&&(rotate(),setTimeout(()=>{clearTimeout(timer)},1)),keyboard.pressed("A")&&(rotate(),setTimeout(()=>{clearTimeout(timer)},1)),keyboard.pressed("W")&&(sea_sound.play(),finalship.translateX(1.5*moveDistance)),keyboard.pressed("S")&&(sea_sound.play(),finalship.translateX(1.5*-moveDistance)),rotation_matrix=(new THREE.Matrix4).identity(),keyboard.pressed("A")&&(sea_sound.play(),finalship.rotateOnAxis(new THREE.Vector3(0,1,0),rotateAngle)),keyboard.pressed("D")&&(sea_sound.play(),finalship.rotateOnAxis(new THREE.Vector3(0,1,0),-rotateAngle)),keyboard.pressed("up")&&(sea_sound.play(),secondFinalShip.translateX(1.5*-moveDistance)),keyboard.pressed("down")&&(sea_sound.play(),secondFinalShip.translateX(1.5*moveDistance)),rotation_matrix=(new THREE.Matrix4).identity(),keyboard.pressed("left")&&(sea_sound.play(),secondFinalShip.rotateOnAxis(new THREE.Vector3(0,1,0),rotateAngle)),keyboard.pressed("right")&&(sea_sound.play(),secondFinalShip.rotateOnAxis(new THREE.Vector3(0,1,0),-rotateAngle)),relativeCameraOffset=new THREE.Vector3(-50,10,10),cameraOffset=relativeCameraOffset.applyMatrix4(finalship.matrixWorld),camera.position.x=cameraOffset.x,camera.position.y=cameraOffset.y,camera.position.z=cameraOffset.z,camera.lookAt(finalship.position),relativeCameraOffset2=new THREE.Vector3(50,10,10),cameraOffset2=relativeCameraOffset2.applyMatrix4(secondFinalShip.matrixWorld),topCamera.position.x=cameraOffset2.x,topCamera.position.y=cameraOffset2.y,topCamera.position.z=cameraOffset2.z,topCamera.lookAt(secondFinalShip.position),SCREEN_WIDTH=window.innerWidth,SCREEN_HEIGHT=window.innerHeight,camera.aspect=.5*SCREEN_WIDTH/SCREEN_HEIGHT,topCamera.aspect=.5*SCREEN_WIDTH/SCREEN_HEIGHT,camera.updateProjectionMatrix(),topCamera.updateProjectionMatrix(),renderer.setSize(window.innerWidth,window.innerHeight),renderer.setViewport(2,2,SCREEN_WIDTH,SCREEN_HEIGHT),renderer.clear(),renderer.setViewport(1,1,.5*SCREEN_WIDTH-2,SCREEN_HEIGHT-2),renderer.render(scene,camera),renderer.clearDepth(),renderer.setViewport(.5*SCREEN_WIDTH+1,1,.5*SCREEN_WIDTH-2,SCREEN_HEIGHT-2),renderer.render(scene,topCamera),shootbomb&&shootbomb.translateZ(12*moveDistance),secondShootbomb&&secondShootbomb.translateZ(12*moveDistance),Power_Box)for(originPoint=Power_Box.position.clone(),vertexIndex=0;vertexIndex<Power_Box.geometry.vertices.length;vertexIndex++)localVertex=Power_Box.geometry.vertices[vertexIndex].clone(),globalVertex=localVertex.applyMatrix4(Power_Box.matrix),directionVector=globalVertex.sub(Power_Box.position),raycast=new THREE.Raycaster(originPoint,directionVector.clone().normalize()),allMesh=meshArray.concat(secondMeshArray),(collisionResults=raycast.intersectObjects(allMesh)).length>0&&(scene.remove(Power_Box),Power_Box=void 0,scene.remove(powerObj),powerObj=void 0,collect1_sound.play(),console.log(collisionResults[0].object.parent.parent),"player1"==collisionResults[0].object.parent.parent.name?(firstPlayerBullets=5,scorePlayer1+=100):"player2"==collisionResults[0].object.parent.parent.parent.name&&(secondPlayerBullets=5,scorePlayer2+=100));if(coins)for(originPoint=coins.position.clone(),vertexIndex=0;vertexIndex<coins.geometry.vertices.length;vertexIndex++)localVertex=coins.geometry.vertices[vertexIndex].clone(),globalVertex=localVertex.applyMatrix4(coins.matrix),directionVector=globalVertex.sub(coins.position),raycast=new THREE.Raycaster(originPoint,directionVector.clone().normalize()),allMesh=meshArray.concat(secondMeshArray),(collisionResults=raycast.intersectObjects(allMesh)).length>0&&(scene.remove(coins),coins=void 0,scene.remove(coinsOBJ),coinsOBJ=void 0,collect2_sound.play(),console.log(collisionResults[0].object.parent.parent),"player1"==collisionResults[0].object.parent.parent.name?(scorePlayer1+=500,console.log("player1 score:"+scorePlayer1)):"player2"==collisionResults[0].object.parent.parent.parent.name&&(scorePlayer2+=500,console.log("player2 score:"+scorePlayer2)));shootbomb&&((position=shootbomb.position.clone()).z+=2,raycaster.set(shootbomb.position,direction.subVectors(shootbomb.position,position).normalize()),raycaster.far=far.subVectors(shootbomb.position,position).length(),(intersects=raycaster.intersectObjects(meshArray)).length>0&&(hit++,hit_sound.play(),bulletArray.remove(shootbomb),shootbomb=void 0)),secondShootbomb&&((secondPosition=secondShootbomb.position.clone()).z+=2,raycaster.set(secondShootbomb.position,direction.subVectors(secondShootbomb.position,secondPosition).normalize()),raycaster.far=far.subVectors(secondShootbomb.position,secondPosition).length(),(intersects=raycaster.intersectObjects(secondMeshArray)).length>0&&(secondHit++,hit_sound.play(),bulletArray2.remove(secondShootbomb),secondShootbomb=void 0)),coinsOBJ&&coinsOBJ.rotateOnAxis(new THREE.Vector3(0,1,0),2*-rotateAngle),powerObj&&powerObj.rotateOnAxis(new THREE.Vector3(0,1,0),2*-rotateAngle),(distance=finalship.position.distanceTo(secondFinalShip.position))<55&&(finalship.position.x=finalship.position.x-5,secondFinalShip.position.x=secondFinalShip.position.x+5),distance<150&&Math.floor(camera.position.z)>60&&(camera.position.z-=.5),distance>150&&Math.floor(camera.position.z)<120&&(camera.position.z+=.5),parameters.distance=500,Math.floor(parameters.inclination)<.5&&(parameters.inclination+=.001),Math.floor(parameters.inclination)>.5&&(parameters.inclination-=.001),parameters.azimuth+=5e-4,theta=Math.PI*(parameters.inclination-.5),phi=2*Math.PI*(parameters.azimuth-.5),light.position.x=parameters.distance*Math.cos(phi),light.position.y=parameters.distance*Math.sin(phi)*Math.sin(theta),light.position.z=parameters.distance*Math.sin(phi)*Math.cos(theta),sky.material.uniforms.sunPosition.value=light.position.copy(light.position),water.material.uniforms.sunDirection.value.copy(light.position).normalize(),cubeCamera.update(renderer,sky)}function render(){switch(pivotPoint.position.set(finalship.position.x,finalship.position.y,finalship.position.z),pivotPoint.rotation.y+=.01,pivotPoint2.position.set(secondFinalShip.position.x,secondFinalShip.position.y,secondFinalShip.position.z),pivotPoint2.rotation.y+=.01,1==hit&&($("#4").hide(),(frames+=1)<20?secondShip.rotation.x+=.005:frames>=20&&frames<40?secondShip.rotation.x-=.005:frames>=40&&frames<80?secondShip.rotation.x-=.005:frames>=80&&frames<120&&(secondShip.rotation.x+=.005)),2==hit&&($("#5").hide(),(secondFrames+=1)<40?secondShip.rotation.x+=.005:secondFrames>=40&&secondFrames<60?secondShip.rotation.x-=.005:secondFrames>=60&&secondFrames<100?secondShip.rotation.x-=.005:secondFrames>=100&&secondFrames<140&&(secondShip.rotation.x+=.005)),3==hit&&(blast_sound.play(),$("#6").hide(),localStorage.playerwin=ship.name,secondShip.rotation.x+=.01,secondShip.position.y-=.1,setTimeout(function(){location.replace("scoreboard.html")},5e3)),1==secondHit&&($("#1").hide(),(thirdFrames+=1)<20?ship.rotation.x+=.005:thirdFrames>=20&&thirdFrames<40?ship.rotation.x-=.005:thirdFrames>=40&&thirdFrames<80?ship.rotation.x-=.005:thirdFrames>=80&&thirdFrames<120&&(ship.rotation.x+=.005)),2==secondHit&&($("#2").hide(),(fourthFrames+=1)<40?ship.rotation.x+=.005:fourthFrames>=40&&fourthFrames<60?ship.rotation.x-=.005:fourthFrames>=60&&fourthFrames<100?ship.rotation.x-=.005:fourthFrames>=100&&fourthFrames<140&&(ship.rotation.x+=.005)),3==secondHit&&(blast_sound.play(),localStorage.playerwin=secondShip.name,$("#3").hide(),ship.rotation.x+=.01,ship.position.y-=.1,setTimeout(function(){location.replace("scoreboard.html")},5e3)),firstPlayerBullets){case 1:$("#11").show(),$("#12").hide(),$("#13").hide(),$("#14").hide(),$("#15").hide();break;case 2:$("#11").show(),$("#12").show(),$("#13").hide(),$("#14").hide(),$("#15").hide();break;case 3:$("#11").show(),$("#12").show(),$("#13").show(),$("#14").hide(),$("#15").hide();break;case 4:$("#11").show(),$("#12").show(),$("#13").show(),$("#14").show(),$("#15").hide();break;case 5:$("#11").show(),$("#12").show(),$("#13").show(),$("#14").show(),$("#15").show();break;default:$("#11").hide(),$("#12").hide(),$("#13").hide(),$("#14").hide(),$("#15").hide()}switch(secondPlayerBullets){case 1:$("#16").show(),$("#17").hide(),$("#18").hide(),$("#19").hide(),$("#20").hide();break;case 2:$("#16").show(),$("#17").show(),$("#18").hide(),$("#19").hide(),$("#20").hide();break;case 3:$("#16").show(),$("#17").show(),$("#18").show(),$("#19").hide(),$("#20").hide();break;case 4:$("#16").show(),$("#17").show(),$("#18").show(),$("#19").show(),$("#20").hide();break;case 5:$("#16").show(),$("#17").show(),$("#18").show(),$("#19").show(),$("#20").show();break;default:$("#16").hide(),$("#17").hide(),$("#18").hide(),$("#19").hide(),$("#20").hide()}$("#player1coin").text(scorePlayer1),$("#player2coin").text(scorePlayer2),time=.001*performance.now(),camera.position.y=Math.sin(2*time)+1+10,water.material.uniforms.time.value+=1/60,renderer.render(scene,camera)}function animate(){requestAnimationFrame(animate),render(),update()}function addPowerBox(){setTimeout(()=>{Power_Box=POWER_BOX.clone(),powerObj=master_shootbomb.clone(),Power_Box.position.set(getRndInteger(-100,100),2,getRndInteger(0,-100)),powerObj.position.set(Power_Box.position.x,10,Power_Box.position.z),scene.add(Power_Box),scene.add(powerObj),setTimeout(()=>{scene.remove(Power_Box),scene.remove(powerObj),Power_Box=void 0,powerObj=void 0,addPowerBox()},1e4)},3e4)}function addCoins(){setTimeout(()=>{coins=COINS.clone(),coinsOBJ=TRESURE_BOX.clone(),coins.position.set(getRndInteger(-100,100),4,getRndInteger(0,-100)),coinsOBJ.position.set(coins.position.x,coins.position.y,coins.position.z),scene.add(coins),scene.add(coinsOBJ),console.log("coins Added"),setTimeout(()=>{scene.remove(coinsOBJ),coinsOBJ=void 0,scene.remove(coins),coins=void 0,addCoins()},3e4)},1e4)}function getRndInteger(e,o){return Math.floor(Math.random()*(o-e))+e}window.addEventListener("keydown",onKeyDown,!1),init(),animate();