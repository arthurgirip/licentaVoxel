import * as THREE from 'three'
import React from 'react';
import ReactDOM from 'react-dom';
import VoxelWorld from '../classes/VoxelWorld'

var renderRequested = false;
var cellSize = 32;

var fov = 75;
var aspect = 2;  // the canvas default
var near = 0.1;
var far = 1000;

var renderer = new THREE.WebGLRenderer({ antialias: true })
var canvas = renderer.domElement;

var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(-cellSize * .3, cellSize * .8, -cellSize * .3);

var scene = new THREE.Scene()

var geometry = new THREE.BufferGeometry();
var material = new THREE.MeshLambertMaterial({color: 'green'});

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

    renderer.render(scene, camera);
}

class VoxDiv extends React.Component {
    constructor(props) {
      super(props)

      this.start = this.start.bind(this)
      this.stop = this.stop.bind(this)
      this.animate = this.animate.bind(this)
    }
  
    componentDidMount() {
        const width = this.mount.clientWidth
        const height = this.mount.clientHeight
        renderer.setSize(width, height)

        
        scene.background = new THREE.Color('lightblue');

        

        var world = new VoxelWorld(cellSize);

        for (let y = 0; y < cellSize; ++y) {
            for (let z = 0; z < cellSize; ++z) {
                for (let x = 0; x < cellSize; ++x) {
                    const height = (Math.sin(x / cellSize * Math.PI * 2) + Math.sin(z / cellSize * Math.PI * 3)) * (cellSize / 6) + (cellSize / 2);
                    if (y < height) {
                        world.setVoxel(x, y, z, 1);
                    }
                }
            }
        }

        const {positions, normals, indices} = world.generateGeometryDataForCell(0, 0, 0);
        
    
        const positionNumComponents = 3;
        const normalNumComponents = 3;
        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
        geometry.setAttribute(
            'normal',
            new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
        geometry.setIndex(indices);
        const mesh = new THREE.Mesh(geometry, material);
        camera.position.z = 100
        scene.add(mesh);

        addLight(-1,  2,  4);
        addLight( 1, -1, -2);

        
    
        this.scene = scene
        this.camera = camera
        this.renderer = renderer
        this.material = material
        this.mesh = mesh

        console.log("VoxDiv")
        console.log(this.scene)
        console.log(this.camera)
        console.log(this.renderer)
        console.log(this.material)

        render1();

        console.log(this.renderer.domElement)
  
        
        this.mount.appendChild(this.renderer.domElement)
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
        <div
          style={{ width: '400px', height: '400px' }}
          ref={(mount) => { this.mount = mount }}
        />
      )
    }
}


export default VoxDiv;

//ReactDOM.render(<Scene />, document.getElementById('root'))