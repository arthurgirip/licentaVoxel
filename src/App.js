import logo from './logo.svg';
import './App.css';
import VoxelCanvas from './components/VoxelCanvas';
import VoxDiv from './components/VoxDiv'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <VoxelCanvas></VoxelCanvas>
        <VoxDiv></VoxDiv>
      </header>
    </div>
  );
}

export default App;
