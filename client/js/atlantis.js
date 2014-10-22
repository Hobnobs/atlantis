var atlantis = {};

atlantis.run = function(){
    //Enums!
    var constants = {cameraspeed: 0.1, degreeToRadian: Math.PI / 180};

    var scene;
    var camera;
    var renderer;
    var effect;
    var entities;
    var input;
//    var clock;
    var rendererStats;
    var fpsStats;
    init();
    gameLoop();


    ////////////////////////////////////////////////////
    //Functions
    ////////////////////////////////////////////////////

    function init() {
        scene = scene = new THREE.Scene();
        
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100 );
        camera.speed = constants.cameraspeed;
        camera.position.z = 7;
        
        renderer = new THREE.WebGLRenderer();
        
        renderer.setSize( window.innerWidth, window.innerHeight);
        
        effect = new THREE.OculusRiftEffect( renderer );
//        effect.setSize( window.innerWidth, window.innerHeight );

        document.body.appendChild( renderer.domElement );

        //debugInit(); //Don't forget about the GameLoop calls
        
        entities = new function (){
                                    this.num = 0;
                                    this.objects = [];
                                  };
        
        inputInit();    
        
//        clock = new THREE.Clock();
    
        window.addEventListener('resize', resizeWindow, false);

        createCube([0,0,0],3,false);
        createCube([6,0,0],3);
        createCube([-6,0,0],3);
        createCube([0,6,0],3);
        createCube([0,-6,0],3);
        createCube([6,6,0],3);
        createCube([6,-6,0],3);
        createCube([-6,-6,0],3);
        createCube([-6,6,0],3);

        createPlane([0,-10,0]);
    }

    function debugInit() {
        rendererStats   = new THREEx.RendererStats();
        fpsStats = new Stats();
        
        rendererStats.domElement.style.position = 'absolute';
        rendererStats.domElement.style.left = '0px';
        rendererStats.domElement.style.bottom   = '0px';
        document.body.appendChild( rendererStats.domElement );
        
        fpsStats.domElement.style.position	= 'absolute';
	    fpsStats.domElement.style.right	= '0px';
	    fpsStats.domElement.style.bottom	= '0px';
	    document.body.appendChild( fpsStats.domElement );
        
    }

    function inputInit() {
    
        input = new function ()  {
                                    this.up = false;
                                    this.down = false;
                                    this.left = false;
                                    this.right = false;
                                    this.forward = false;
                                    this.backward = false;
                                    this.oculus = false;    
                                };
                                
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
            else if(event.keyCode == 79) {
                if (input.oculus == true) {
                    input.oculus = false;
                    resizeWindow();
                }else{
                    input.oculus = true;
                }
            }
        });

        document.addEventListener('keyup', function(event) {
            if(event.keyCode == 65) {
                input.left = false; //A
            }
            else if(event.keyCode == 68) {
                input.right = false;//D
            }
            else if(event.keyCode == 81) {
                input.up = false; //Q
            }
            else if(event.keyCode == 69) {
                input.down = false; //E
            }
            else if(event.keyCode == 87) {
                input.forward = false; // W
            }
            else if(event.keyCode == 83) {
                input.backward = false; //S
            }
        });
    }

    function resizeWindow() {
		renderer.setSize( window.innerWidth, window.innerHeight );
        effect.setSize( window.innerWidth, window.innerHeight );

		camera.aspect	= window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
    }

    function gameLoop() {
        //rendererStats.update(renderer);
        //fpsStats.update();
        requestAnimationFrame(gameLoop);
        checkInputs(input);
        //updatePhysics();
        updateEntities();
        if(input.oculus == false) {
            renderer.render(scene, camera);
        } else {
            effect.render(scene, camera);
        }
    }

    function checkInputs(input){
        if(input.left)       {camera.position.x -= camera.speed;};
        if(input.right)      {camera.position.x += camera.speed;};
        if(input.up)         {camera.position.y += camera.speed;};
        if(input.down)       {camera.position.y -= camera.speed;};
        if(input.forward)    {camera.position.z -= camera.speed;};
        if(input.backward)   {camera.position.z += camera.speed;};
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

    /////////////////////////////////////////
    //Testing functions
    /////////////////////////////////////////
    function createCube(pos, num, wireframe, lineColor, faceColor) {
        //If nothing was passed, default to creating 1 cube
        num = (typeof num === "undefined") ? 1 : num;
        wireframe = (typeof wireframe === "undefined") ? true : num;
        lineColor = (typeof lineColor === "undefined") ? new THREE.Color( 0x00ff00 ) : lineColor;
        faceColor = (typeof faceColor === "undefined") ? new THREE.Color( 0x000000 ) : faceColor;
        
        for (var i = 0; i < num; i++) {
            var geometry = new THREE.BoxGeometry(i+1,i+1,i+1);
            var colorCube;

            if (i % 3 == 0) colorCube = new THREE.Color( 1, 0, 0 );
            else if (i % 3 == 1) colorCube = new THREE.Color( 0, 1, 0 );
            else if (i % 3 == 2) colorCube = new THREE.Color( 0, 0, 1 );
            else colorCube = new THREE.Color( 1, 1, 1 );
           
            var material;

            if(wireframe == true) {
                material = new THREE.MeshBasicMaterial( { color: colorCube, wireframe: true } );
            } else {
                material = new  THREEx.SolidWireframeMaterial(geometry, lineColor, faceColor);
            }
            
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
//        var material = new THREE.MeshBasicMaterial( { color: colorPlane, side: THREE.DoubleSide, wireframe: true} );
        var material = new THREEx.SolidWireframeMaterial(geometry);
        entities.objects[entities.num] = new THREE.Mesh( geometry, material );
        scene.add( entities.objects[entities.num] );
        entities.objects[entities.num].name = "Plane";
        entities.objects[entities.num].rotation.x = -90 * constants.degreeToRadian;
        entities.objects[entities.num].position.x = pos[0];
        entities.objects[entities.num].position.y = pos[1];
        entities.objects[entities.num].position.z = pos[2];
        entities.num++;
            
    }
}

