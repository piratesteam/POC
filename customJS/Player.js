function get3dObject(){
    var geometry = new THREE.SphereBufferGeometry(1, 32, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    bullet = new THREE.Mesh(geometry, material);
    bullet.position.set(-8, 4, 0);
    // scene.add( sphere );

    //FinalShip
    finalship = new THREE.Group();
    finalship.add(bullet);

    //3ds files dont store normal maps
    var loader = new THREE.TextureLoader();
    var normal = loader.load("./Objects/Galleon.jpg");
    var loader = new THREE.TDSLoader();
    loader.setResourcePath("Objects/");
    loader.load("Objects/Galleon.3ds", function(object) {
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material.normalMap = normal;
            }
        });
        ship = object; //local to global
        ship.rotation.x = -Math.PI / 2; //back to front
        ship.rotation.z = -Math.PI; //opposite direction
        camera.position.z = ship.position.z + 60; //initial camera position
        finalship.add(ship);
    });

    return finalship;

}






function getPLayer(){
    let ship = get3dObject();
    var player={
        hp:5,
        score:0,
        shield:2,
        alive:true,
        shipObject:ship,
        
        decreaseHp :  ()=>{
             this.hp--;
        },
        increaseHp : ()=>{
             this.hp++;
        },
        
        increaseScore : (points)=>{
            this.score+=points;
        },

        decreaseScore : (points)=>{
            this.score-=points;
        },

        increaseShield : (shieldppoints)=>{
            this.shield+=shieldpoints;
        },
        decreaseShield : (shieldppoints)=>{
            this.shield-=shieldpoints;
        }


    }

    return player;
}