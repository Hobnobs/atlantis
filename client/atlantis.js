function createCube(num) {
    //If nothing was passed, default to creating 1 cube
    num = (typeof num === "undefined") ? 1 : num;
    
    for (var i = 0; i < num; i++) {
        var geometry = new THREE.BoxGeometry(i+1,i+1,i+1);
       
        var colorCube;
        if (i % 3 == 0) colorCube = new THREE.Color( 1, 0, 0 );
        else if (i % 3 == 1) colorCube = new THREE.Color( 0, 1, 0 );
        else if (i % 3 == 2) colorCube = new THREE.Color( 0, 0, 1 );
        else colorCube = new THREE.Color( 1, 1, 1 );
       
        var material = new THREE.MeshBasicMaterial( { color: colorCube, wireframe: true } );
    
        entities.objects[entities.num] = new THREE.Mesh( geometry, material );
        scene.add( entities.objects[entities.num] );
        entities.num++;
    }
    
}

function init() {
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    createCube(3);

    camera.position.z = 7;
}

function updateEntities() {
    for (var i = 0; i < entities.num; i++) {
        dir = i % 2 ? -1 : 1;
        entities.objects[i].rotation.x += dir * 0.01;
        entities.objects[i].rotation.y += dir * 0.01;
    }
    
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    updateEntities();
    renderer.render(scene, camera);
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var entities = new function (){
                                this.num = 0;
                                this.objects = [];
                              };
var renderer = new THREE.WebGLRenderer();


init();
gameLoop();

