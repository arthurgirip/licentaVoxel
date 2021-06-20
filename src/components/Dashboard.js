import * as THREE from 'three'
import React from 'react';
import ReactDOM from 'react-dom';
import DrawCanvas from './DrawCanvas';
import VoxDiv from './VoxDiv'
import ImportExport from './ImportExport';

class Dashboard extends React.Component {

    state = {
        imgFile: ""
    }
    
    loadImage = (importedFile)=>{
        this.setState({imgFile : importedFile})
    }
  
    render() {
      return (
        <div id="dashboard"
        style={{  }}>
            <div id="canvases" style={{display: 'flex'}}>
                <VoxDiv imgFromImport = {this.state.imgFile}></VoxDiv>
                <DrawCanvas imgFromImport = {this.state.imgFile}></DrawCanvas>
            </div>
            <ImportExport callFromParent = {this.loadImage.bind(this)}></ImportExport>
        </div>
      )
    }
  }
  
  export default Dashboard;