import * as THREE from 'three'
import React from 'react';
import ReactDOM from 'react-dom';
import VoxelWorld from '../classes/VoxelWorld'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { wait } from '@testing-library/react';

var renderRequested = false;
var cellSize = 34;

var fov = 75;
var aspect = 2;  // the canvas default
var near = 0.1;
var far = 1000;

var renderer = new THREE.WebGLRenderer({ antialias: true })
var canvas = renderer.domElement;

var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(-cellSize * .3, cellSize * .8, -cellSize * .3);

var controls = new OrbitControls(camera, canvas);

var scene = new THREE.Scene()

var geometry = new THREE.BufferGeometry();

var image = new Image();
var heightmapData = new Float32Array();

var world;

///PARAMETERS


function addLight(x, y, z) {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(x, y, z);
    scene.add(light);
}

function resizeRendererToDisplaySize(renderer) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

function requestRenderIfNotRequested() {
    if (!renderRequested) {
      renderRequested = true;
      requestAnimationFrame(render1);
    }
}

function render1() {
    renderRequested = undefined;

    // if (resizeRendererToDisplaySize(renderer)) {
    //   camera.aspect = canvas.clientWidth / canvas.clientHeight;
    //   camera.updateProjectionMatrix();
    // }

    controls.update();

    renderer.render(scene, camera);
}

//get data from heightmap
function getHeightData(img,scale) {
     
    if (scale == undefined) scale=1;
    
    if(img == undefined) return null;

    var canvas = document.createElement( 'canvas' );
    canvas.width = img.width;
    canvas.height = img.height;
    var context = canvas.getContext( '2d' );

    var size = img.width * img.height;
    var data = new Uint32Array( size );

    console.log(img)
    console.log(img.width)
    console.log(img.height)
    context.drawImage(img,0,0);

    for ( var i = 0; i < size; i ++ ) {
        data[i] = 0
    }

    var imgd = context.getImageData(0, 0, img.width, img.height);
    var pix = imgd.data;

    var j=0;
    for (var i = 0; i<pix.length; i +=4) {
        var all = pix[i]+pix[i+1]+pix[i+2];
        data[j++] = all/3;
    }
    
    return data;
}

class VoxDiv extends React.Component {
    constructor(props) {
      super(props)

      this.start = this.start.bind(this)
      this.stop = this.stop.bind(this)
      this.animate = this.animate.bind(this)
    }

    loadHeightmapData(){
        image.setAttribute("src",URL.createObjectURL(this.props.imgFromImport));
        var newImg = image;
        setTimeout(() => {  heightmapData = getHeightData(newImg,1); console.log(heightmapData) }, 100);
        setTimeout(() => {  cellSize=newImg.height; this.generateWorld() }, 1000);
    }

    componentDidUpdate() {
        if(this.props.imgFromImport)
        {
            this.loadHeightmapData()
            
        }
            
    }

    generateWorld(){
        const width = this.mount.clientWidth
        const height = this.mount.clientHeight
        renderer.setSize(width, height)

        
        scene.background = new THREE.Color('lightblue');

        const loader = new THREE.TextureLoader();
        const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/minecraft/flourish-cc-by-nc-sa.png', render1);
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;

        const tileSize = 16;
        const tileTextureWidth = 256;
        const tileTextureHeight = 64;

        world = new VoxelWorld({
            cellSize,
            tileSize,
            tileTextureWidth,
            tileTextureHeight,
        });

        for (let y = 0; y < cellSize; ++y) {
            for (let z = 0; z < cellSize; ++z) {
                for (let x = 0; x < cellSize; ++x) {
                    const height = heightmapData[x + z*cellSize]%cellSize;
                    
                    if (y < height) {
                        world.setVoxel(x, y-(cellSize - 30), z, y%17+1);
                    }
                }
            }
        }

        const {positions, normals, uvs, indices} = world.generateGeometryDataForCell(0, 0, 0);
        var material = new THREE.MeshLambertMaterial({
            map: texture,
            side: THREE.DoubleSide,
            alphaTest: 0.1,
            transparent: false,
        });

        this.material = material
    
        const positionNumComponents = 3;
        const normalNumComponents = 3;
        const uvNumComponents = 2;

        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
        geometry.setAttribute(
            'normal',
            new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
        geometry.setAttribute(
            'uv',
            new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));
        geometry.setIndex(indices);
        const mesh = new THREE.Mesh(geometry, material);
        camera.position.z = 150


        
        controls.target.set(cellSize / 2, cellSize / 3, cellSize / 2);
        controls.update();
        scene.add(mesh);

        addLight(-1,  2,  4);
        addLight( 1, -1, -2);

        
    
        this.scene = scene
        this.camera = camera
        this.renderer = renderer
        this.mesh = mesh

        render1();

        controls.addEventListener('change', requestRenderIfNotRequested);
        
        this.mount.appendChild(this.renderer.domElement)
        

    }
  
    componentDidMount() {
        

        

        this.generateWorld();

        this.start();
    }

    componentWillUnmount() {
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    stop() {
        cancelAnimationFrame(this.frameId)
    }


    animate() {
        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)
    }

    renderScene() {
        this.renderer.render(this.scene, this.camera)
    }
  
    render() {
      return (
        <div id="voxelCanvas"
          style={{ width: '1024px', height: '576px' }}
          ref={(mount) => { this.mount = mount }}
        />
      )
    }
}


export default VoxDiv;

//ReactDOM.render(<Scene />, document.getElementById('root'))