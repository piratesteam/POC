//GlobalVariables
let scene,renderer,camera,light;

//WindowListners:
window.addEventListener("resize",onWindowResize,false);
window.addEventListener("keydown", onKeyDown, false);




/////////////////////////////////////////////  Windows Event Description  //////////////////////////////////////////////////////////

function onWindowResize(){
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
}

function onKeyDown(e){
    console.log(e);
}

//////////////////////////////////////////////////////////////////////////////////////////////////

//Game Elements
//Intialization Function
function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,0.1,1000);
    camera.position.z=10;
    renderer= new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild( renderer.domElement );
}

//Light
function createLight() {
    light = new THREE.DirectionalLight(0xffffff, 9.5);
    light.position.set(0, 0, 5);
    scene.add(light);
}



//Animate Function
function animate(){
    requestAnimationFrame( animate );
    cube.rotation.x +=0.1;
    renderer.render( scene, camera );
    
}





//Game Calls
init();
createLight();
var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
var material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );



animate();