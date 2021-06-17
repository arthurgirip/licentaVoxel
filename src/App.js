import logo from './logo.svg';
import './App.css';
import VoxelCanvas from './components/VoxelCanvas';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <VoxelCanvas></VoxelCanvas>
        <VoxelCanvas></VoxelCanvas>
        <VoxelCanvas></VoxelCanvas>
      </header>
    </div>
  );
}

export default App;
