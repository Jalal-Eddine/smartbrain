import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Rank from './components/Rank/Rank'
import Logo from './components/Logo/Logo'
import 'tachyons'

const app = new Clarifai.App({
  apiKey: 'f3e013455e1742eab3618934c65ac9bc'
 });

const particlesOptions = {
  particles: {
    number: {
      value: 60,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      input: '',
      imageURL: ''
      }
    }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(
      //this.state.imageURL wouldn't worked here bc setState is Async
      function(response) {
        // do something with response
        console.log(response.outputs[0].data.regions[0].region_info.bounding_box)//outputs[0].data.regions[0].
      },
      function(err) {
        // there was an error
      }
    );
  }
  render() {
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions}/>
        <Navigation/>
        <Logo/>
        <Rank/>
        <ImageLinkForm onInputChange= {this.onInputChange} onButtonSubmit= {this.onButtonSubmit}/>
        <FaceRecognition imageURL= {this.state.imageURL}/>
      </div>
    );
  }
}

export default App;
