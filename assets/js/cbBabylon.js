let scene = null;
let engine;
let material;
let pivot;
const scaleFactor = 1 / 40;
const startHeight = 40;
let grid = [];
// let totalHeight;
// let totalLength;

function showWorldAxis(size) {
    var makeTextPlane = function (text, color, size) {
        var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
        var plane = BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
        plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
        plane.material.backFaceCulling = false;
        plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
        plane.material.diffuseTexture = dynamicTexture;
        return plane;
    };
    var axisX = BABYLON.Mesh.CreateLines("axisX", [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
        new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
    ], scene);
    axisX.color = new BABYLON.Color3(1, 0, 0);
    var xChar = makeTextPlane("X", "red", size / 10);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
    var axisY = BABYLON.Mesh.CreateLines("axisY", [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
        new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
    ], scene);
    axisY.color = new BABYLON.Color3(0, 1, 0);
    var yChar = makeTextPlane("Y", "green", size / 10);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
    var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
    ], scene);
    axisZ.color = new BABYLON.Color3(0, 0, 1);
    var zChar = makeTextPlane("Z", "blue", size / 10);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
};

let addColumn = (flip, pivot, material) => {
    let col = [];
    for (let blockID = 0; blockID < buildingBlocks.length; blockID++) {
        let box = BABYLON.MeshBuilder.CreateBox(`box${blockID}`, { width: blockWidth / 40, height: totalHeight / 40, depth: buildingBlocks[blockID].length / 40, updatable: true }, scene);
        box.material = material[buildingBlocks[blockID].woodType];

        // tranlsate along z axis
        let zPos = 0;
        for (let prevBlockID = 0; prevBlockID < blockID; prevBlockID++) {
            col[prevBlockID].position.z += buildingBlocks[blockID].length / 2 * scaleFactor;
            zPos += buildingBlocks[prevBlockID].length;
        }
        zPos /= -2.0;
        zPos *= scaleFactor;
        box.position.z = zPos;

        // translate current block along x axis
        box.position.x = grid.length * blockWidth / 2.0 * scaleFactor;

        // rotate along global z axis
        if (flip) {
            box.parent = pivot;
        }
        col.push(box);
    }

    // translate previous blocks along x axis
    for (let colID = 0; colID < grid.length; colID++) {
        grid[colID].forEach(box => {
            box.position.x = box.position.x - blockWidth / 2.0 * scaleFactor;
        });
    }
    grid.push(col);
}

let removeColumn = () => {
    grid[grid.length - 1].forEach(box => {
        box.dispose();
    });
    grid.pop();
    grid.forEach(column => {
        column.forEach(box => {
            box.position.x += blockWidth / 2.0 * scaleFactor;
        });
    });
}

const renderBoard = (pivot, material) => {
    const totalLengthInputEl = document.getElementById('totalLengthInput');
    while (grid.length < totalLengthInputEl.value / blockWidth) {
        let flip = alternating == true && grid.length % 2 !== 0
        addColumn(flip, pivot, material);
    }
    // for (let col = 0; col < columnCount; col++) {

    //     let flip = alternating == true && col % 2 !== 0
    //     addColumn(flip, pivot, material);
    // }
}

const blockList = document.getElementById('blockInputContainer');
Sortable.create(blockList, {
    filter: '.ignore',
    preventOnFilter: false,
    animation: 250,
    easing: "cubic-bezier(0.87, 0, 0.13, 1)",
    dataIdAttr: 'data-id',
    handle: '.btn__move',
    onEnd: (evt) => {
        console.log(
            {
                item: evt.item,  // dragged HTMLElement
                to: evt.to,    // target list
                from: evt.from,  // previous list
                oldIndex: evt.oldIndex,  // element's old index within old parent
                newIndex: evt.newIndex,  // element's new index within new parent
                oldDraggableIndex: evt.oldDraggableIndex, // element's old index within old parent, only counting draggable elements
                newDraggableIndex: evt.newDraggableIndex, // element's new index within new parent, only counting draggable elements
                clone: evt.clone, // the clone element
                pullMode: evt.pullMode,
            }
        )
        let tmpBlock = buildingBlocks[evt.oldIndex];
        if (evt.oldIndex < evt.newDraggableIndex) {
            for (let index = evt.oldIndex ; index < evt.newIndex; index++){
                buildingBlocks[index] = buildingBlocks[index + 1];
            }
        }
        else {
            for (let index = evt.oldIndex ; index > evt.newIndex; index--){
                buildingBlocks[index] = buildingBlocks[index - 1];
            }
        }
        buildingBlocks[evt.newIndex] = tmpBlock;
        tmpBlock = null;

        // grid.forEach(column => {
        //     column.forEach(box => {
        //         box.dispose();
        //         box = null;
        //     });
        // });
        // grid = [];
        // renderBoard(pivot, material);

        // const t0 = performance.now()
        grid.forEach(column => {
            let tmpBox = column[evt.oldIndex];
            const boxWidth = tmpBox.getBoundingInfo().boundingBox.maximum.z - tmpBox.getBoundingInfo().boundingBox.minimum.z;
            let translateZ = 0;
            if (evt.oldIndex < evt.newDraggableIndex) {
                for (let index = evt.oldIndex ; index < evt.newIndex; index++){
                    column[index] = column[index + 1];
                    column[index].position.z += boxWidth;
                    translateZ -= column[index].getBoundingInfo().boundingBox.maximum.z - column[index].getBoundingInfo().boundingBox.minimum.z;
                }
            }
            else {
                for (let index = evt.oldIndex ; index > evt.newIndex; index--){
                    column[index] = column[index - 1];
                    column[index].position.z -= boxWidth;
                    translateZ += column[index].getBoundingInfo().boundingBox.maximum.z - column[index].getBoundingInfo().boundingBox.minimum.z;

                }
            }
            column[evt.newIndex] = tmpBox;
            column[evt.newIndex].position.z += translateZ; 
            tmpBox = null;
        });
        // const t1 = performance.now()
        // console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
    }
});

document.addEventListener('DOMContentLoaded', (event) => {

    var canvas = document.getElementById("renderCanvas");

    window.addEventListener('scroll', () => {
        document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
    });

    canvas.addEventListener('mouseenter', () => {
        const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
        const body = document.body;
        const canvasWidth = canvas.getBoundingClientRect().width;
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}`;
        body.style.paddingRight = '15px';
        canvas.setAttribute("style", `touch-action: none; width: ${canvasWidth}px;`);
    });

    canvas.addEventListener('mouseleave', () => {
        const body = document.body;
        const scrollY = body.style.top;
        body.style.position = '';
        body.style.top = '';
        body.style.paddingRight = '0px';
        canvas.setAttribute("style", "touch-action: none;");
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
    });

    var engine = null;
    // var scene = null;
    var sceneToRender = null;
    var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };
    var createScene = function () {

        // listen to length input slider
        const totalLengthInput = document.getElementById('totalLengthInput');
        totalLengthInput.addEventListener('input', () => {
            const totalLengthInputEl = document.getElementById('totalLengthInput');
            while (grid.length < totalLengthInputEl.value / blockWidth) {
                let flip = alternating == true && grid.length % 2 !== 0
                addColumn(flip, pivot, material);
            }
            while (grid.length > totalLengthInputEl.value / blockWidth) {
                removeColumn();
            }
        });

        // listen to height input slider
        const totalHeightInput = document.getElementById('totalHeightInput');
        totalHeightInput.addEventListener('input', () => {
            totalHeight = totalHeightInput.value;
            grid.forEach(column => {
                column.forEach(box => {
                    // box.scaling = new BABYLON.Vector3(1, totalHeight / startHeight, 1);
                    let positions = box.getVerticesData(BABYLON.VertexBuffer.PositionKind);
                    let numberOfVertices = positions.length / 3;
                    for (let i = 0; i < numberOfVertices; i++) {
                        // positions[i * 3] = x * positions[i * 3] / 2 / Math.abs(positions[i * 3]);
                        positions[i * 3 + 1] = positions[i * 3 + 1] / Math.abs(positions[i * 3 + 1]) * totalHeight / 2.0 * scaleFactor;
                        // positions[i * 3 + 2] = z * positions[i * 3 + 2] / 2 / Math.abs(positions[i * 3 + 2]);
                    }
                    box.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
                });
            });
        });


        // This creates a basic Babylon Scene object (non-mesh)
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3.FromInts(50, 50, 50);
        scene.environmentTexture = new BABYLON.CubeTexture("/assets/textures/ballroom.env", scene);
        // scene.environmentTexture = new BABYLON.CubeTexture("/assets/textures/Studio_Softbox_2Umbrellas_cube_specular.env", scene);

        // This creates and positions a free camera (non-mesh)
        var camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, 0, 16, BABYLON.Vector3.Zero(), scene)

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);
        camera.wheelDeltaPercentage = 0.05;
        // camera.useFramingBehavior = true;


        var maplePBRMaterial = new BABYLON.PBRMaterial("maplePBRMaterial", scene);
        maplePBRMaterial.albedoColor = new BABYLON.Color3.FromHexString(colors.maple);
        maplePBRMaterial.metallic = 0.0;
        maplePBRMaterial.roughness = 0.7;
        var oakPBRMaterial = new BABYLON.PBRMaterial("oakPBRMaterial", scene);
        oakPBRMaterial.albedoColor = new BABYLON.Color3.FromHexString(colors.oak);
        oakPBRMaterial.metallic = 0.0;
        oakPBRMaterial.roughness = 0.7;
        var walnutPBRMaterial = new BABYLON.PBRMaterial("walnutPBRMaterial", scene);
        walnutPBRMaterial.albedoColor = new BABYLON.Color3.FromHexString(colors.walnut);
        walnutPBRMaterial.metallic = 0.0;
        walnutPBRMaterial.roughness = 0.7;

        material = {
            "maple": maplePBRMaterial,
            "oak": oakPBRMaterial,
            "walnut": walnutPBRMaterial,
        }

        pivot = new BABYLON.TransformNode("root");
        const axis = new BABYLON.Vector3(1, 0, 0);
        const angle = Math.PI;
        pivot.rotate(axis, angle, BABYLON.Space.WORLD);
        renderBoard(pivot, material);
        // for (let col = 0; col < columnCount; col++) {

        //     let flip = alternating == true && col % 2 !== 0
        //     addColumn(flip, pivot, material);
        // // for (let col = 0; col < 1; col++) {
        // for (let block = 0; block < buildingBlocks.length; block++) {
        //     if (alternating == true && col % 2 !== 0) {
        //         i = buildingBlocks.length - 1 - block;
        //     }
        //     else {
        //         i = block;
        //     }
        //     let box = BABYLON.MeshBuilder.CreateBox(`box${index}`, { width: blockWidth / 40, height: totalHeight / 40, depth: buildingBlocks[i].length / 40, updatable: true }, scene);
        //     box.material = material[buildingBlocks[i].woodType];

        //     let zPosOffset = 0;
        //     for (let blockOffset = 0; blockOffset < block; blockOffset++) {
        //         if (alternating == true && col % 2 !== 0) {
        //             j = buildingBlocks.length - 1 - blockOffset;
        //         }
        //         else {
        //             j = blockOffset;
        //         }
        //         zPosOffset += buildingBlocks[j].length;
        //     }
        //     zPosOffset = zPosOffset + (buildingBlocks[i].length - totalWidth) / 2;
        //     zPosOffset /= 40;
        //     box.position.z = zPosOffset;
        //     box.position.x -= col * blockWidth / 40;
        // }
        // }
        // var box = BABYLON.MeshBuilder.CreateTiledBox("box", { size: 1, updatable: true }, scene);

        // let setBoxSize = (x, y, z, box) => {
        //     let positions = box.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        //     let numberOfVertices = positions.length / 3;
        //     for (let i = 0; i < numberOfVertices; i++) {
        //         positions[i * 3] = x * positions[i * 3] / 2 / Math.abs(positions[i * 3]);
        //         positions[i * 3 + 1] = y * positions[i * 3 + 1] / 2 / Math.abs(positions[i * 3 + 1]);
        //         positions[i * 3 + 2] = z * positions[i * 3 + 2] / 2 / Math.abs(positions[i * 3 + 2]);
        //     }
        //     box.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
        // }
        // setBoxSize(1, 2, 3, box);
        // setBoxSize(0.5, 0.5, 0.5, box);
        // setBoxSize(1, 1, 1, box);

        // GUI
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        let makeBtn = (name, imagePath) => {
            const btn = BABYLON.GUI.Button.CreateImageOnlyButton(name, imagePath);
            btn.width = "40px"
            btn.height = "40px";
            btn.color = "white";
            btn.cornerRadius = 0;
            btn.thickness = 0;
            btn.background = new BABYLON.Color4.FromInts(50, 50, 50, 255).toHexString();
            btn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            btn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
            btn.top = '-10px';
            btn.left = '-10px';
            btn.hoverCursor = 'pointer';
            btn.pointerEnterAnimation = () => { btn.alpha = 0.5; btn.scaleX = 1.2; btn.scaleY = 1.2 };
            btn.pointerOutAnimation = () => { btn.alpha = 1; btn.scaleX = 1; btn.scaleY = 1 };

            return btn;
        }

        const fsFunction = () => {
            engine.enterFullscreen();
            advancedTexture.removeControl(fsBtn);
            fsExitBtn = makeBtn('fsExitBtn', 'assets/img/fullscreen-exit.svg');
            advancedTexture.addControl(fsExitBtn);
            fsBtn.dispose();
            fsBtn = null;
            fsExitBtn.onPointerUpObservable.add(fsExitFunction);
        }

        const fsExitFunction = () => {
            engine.exitFullscreen();
            advancedTexture.removeControl(fsExitBtn);
            fsBtn = makeBtn('fsBtn', 'assets/img/fullscreen.svg');
            advancedTexture.addControl(fsBtn);
            fsExitBtn.dispose();
            fsExitBtn = null;
            fsBtn.onPointerUpObservable.add(fsFunction);
        }

        let fsBtn = makeBtn('fsBtn', 'assets/img/fullscreen.svg');
        advancedTexture.addControl(fsBtn);
        let fsExitBtn;

        fsBtn.onPointerUpObservable.add(fsFunction);

        return scene;
    };
    // var engine;
    // var scene;
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
}); 