import logo from './logo.svg';
import './App.css';
import DrawCanvas from './components/DrawCanvas';
import VoxDiv from './components/VoxDiv'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <VoxDiv></VoxDiv>
        <DrawCanvas></DrawCanvas>
      </header>
    </div>
  );
}

export default App;
