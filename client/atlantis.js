document.addEventListener('keydown', function(event) {
    if(event.keyCode == 65) {
        input.left = true; //A
    }
    else if(event.keyCode == 68) {
        input.right = true;//D
    }
    else if(event.keyCode == 81) {
        input.up = true; //Q
    }
    else if(event.keyCode == 69) {
        input.down = true; //E
    }
    else if(event.keyCode == 87) {
        input.forward = true; // W
    }
    else if(event.keyCode == 83) {
        input.backward = true; //S
    }
});

function createCube(pos, num) {
    //If nothing was passed, default to creating 1 cube
    num = (typeof num === "undefined") ? 1 : num;
    
    for (var i = 0; i < num; i++) {
        var geometry = new THREE.BoxGeometry(i+1,i+1,i+1);
        var colorCube;
        if (entities.num % 3 == 0) colorCube = new THREE.Color( 1, 0, 0 );
        else if (entities.num % 3 == 1) colorCube = new THREE.Color( 0, 1, 0 );
        else if (entities.num % 3 == 2) colorCube = new THREE.Color( 0, 0, 1 );
        else colorCube = new THREE.Color( 1, 1, 1 );
       
        var material = new THREE.MeshBasicMaterial( { color: colorCube, wireframe: true } );
    
        entities.objects[entities.num] = new THREE.Mesh( geometry, material );
        entities.objects[entities.num].position.x = pos[0];
        entities.objects[entities.num].position.y = pos[1];
        entities.objects[entities.num].position.z = pos[2];
        scene.add( entities.objects[entities.num] );
        entities.objects[entities.num].name = "Cube";
        entities.num++;
    }
    
}

function createPlane(pos) {
    var geometry = new THREE.PlaneGeometry(50,50,20,20);
    var colorPlane = new THREE.Color(1, 1, 1);
    var material = new THREE.MeshBasicMaterial( { color: colorPlane, side: THREE.DoubleSide, wireframe: true} );
    entities.objects[entities.num] = new THREE.Mesh( geometry, material );
    scene.add( entities.objects[entities.num] );
    entities.objects[entities.num].name = "Plane";
    entities.objects[entities.num].rotation.x += 90;
    entities.objects[entities.num].position.x = pos[0];
    entities.objects[entities.num].position.y = pos[1];
    entities.objects[entities.num].position.z = pos[2];
    entities.num++;
        
}

function init() {
    camera.speed = 0.1;
    renderer.setSize( window.innerWidth, window.innerHeight);
    document.body.appendChild( renderer.domElement );

    THREEx.WindowResize(renderer, camera);

    createCube([0,0,0],3);
    createCube([6,0,0],3);
    createCube([-6,0,0],3);
    createCube([0,6,0],3);
    createCube([0,-6,0],3);
    createCube([6,6,0],3);
    createCube([6,-6,0],3);
    createCube([-6,-6,0],3);
    createCube([-6,6,0],3);

    createPlane([0,-10,0]);

    camera.position.z = 7;
}

function checkInputs(){
    if(input.left)       {camera.position.x -= camera.speed; input.left = false;};
    if(input.right)      {camera.position.x += camera.speed; input.right = false;};
    if(input.up)         {camera.position.y += camera.speed; input.up = false;};
    if(input.down)       {camera.position.y -= camera.speed; input.down = false;};
    if(input.forward)    {camera.position.z -= camera.speed; input.forward = false;};
    if(input.backward)   {camera.position.z += camera.speed; input.backward = false;};
}

function updatePhysics(){
    
}

function updateEntities() {
    for (var i = 0; i < entities.num; i++) {
        if (entities.objects[i].name == "Cube"){
            dir = i % 2 ? -1 : 1;
            entities.objects[i].rotation.x += dir * 0.01;
            entities.objects[i].rotation.y += dir * 0.01;        
        }
    }
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    checkInputs();
    //updatePhysics();
    updateEntities();
    renderer.render(scene, camera);
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100 );
var renderer = new THREE.WebGLRenderer();
var entities = new function (){
                                this.num = 0;
                                this.objects = [];
                              };
var input = new function ()  {
                                this.up = false;
                                this.down = false;
                                this.left = false;
                                this.right = false;
                                this.forward = false;
                                this.backward = false;    
                            };

init();
gameLoop();

