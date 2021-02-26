var canvas = document.getElementById("renderCanvas");

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };
var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    // scene.clearColor = new BABYLON.Color3.FromInts(50, 50, 50);
    scene.environmentTexture = new BABYLON.CubeTexture("/assets/textures/environment.env", scene);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 4, 5, BABYLON.Vector3.Zero(), scene)

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    camera.wheelDeltaPercentage = 0.05;

    // Our built-in 'sphere' shape.
    var box = BABYLON.MeshBuilder.CreateTiledBox("box", { size: 1, updatable: true }, scene);

    let setBoxSize = (x, y, z, box) => {
        let positions = box.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        let numberOfVertices = positions.length / 3;
        for (let i = 0; i < numberOfVertices; i++) {
            positions[i * 3] = x * positions[i * 3] / 2 / Math.abs(positions[i * 3]);
            positions[i * 3 + 1] = y * positions[i * 3 + 1] / 2 / Math.abs(positions[i * 3 + 1]);
            positions[i * 3 + 2] = z * positions[i * 3 + 2] / 2 / Math.abs(positions[i * 3 + 2]);
        }
        box.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
    }
    setBoxSize(1, 2, 3, box);
    setBoxSize(0.5, 0.5, 0.5, box);
    setBoxSize(1, 1, 1, box);



    var pbr = new BABYLON.PBRMaterial("pbr", scene);
    console.log(colors.oak);
    pbr.albedoColor = new BABYLON.Color3.FromHexString(colors.walnut);
    pbr.metallic = 0.0; // set to 1 to only use it from the metallicRoughnessTexture
    pbr.roughness = 0.7; // set to 1 to only use it from the metallicRoughnessTexture
    box.material = pbr;

    return scene;
};
var engine;
var scene;
initFunction = async function () {
    var asyncEngineCreation = async function () {
        try {
            return createDefaultEngine();
        } catch (e) {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
        }
    }

    engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';
    scene = createScene();
};
initFunction().then(() => {
    sceneToRender = scene
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});