import * as THREE from 'three'
import React from 'react';
import ReactDOM from 'react-dom';

class ImportExport extends React.Component {

    state = {
        // Initially, no file is selected
        selectedFile: null
    };
    
    // On file select (from the pop up)
    onFileChange = event => {
        // Update the state
        this.setState(
          { selectedFile: event.target.files[0] },
          () => {this.props.callFromParent(this.state.selectedFile)}
        );
        
    };

    onButtonPress = event => {
        if(this.state.selectedFile)
            console.log(this.state.selectedFile.name);
    }
  
    render() {
      return (
        <div id="buttons">
            <input type="file" onChange={this.onFileChange} />
            <input type="button" value="Log File Name" onClick={this.onButtonPress} />
        </div>
      )
    }
  }
  
  export default ImportExport;