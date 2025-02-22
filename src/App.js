import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation'
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Rank from './components/Rank/Rank'
import Logo from './components/Logo/Logo'
import 'tachyons'


// particules API for the interactive background 
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
const initialStatte = 
    {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn:false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }

class App extends Component {
  constructor() {
    super()
    this.state = initialStatte
    }
  
  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }
//Listen to Input change
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
// calculate the location of the face based on the API data recieved
//it recieve an object of the percentage of the face location 
  calculateFaceLocation = (data) => {
    const clariFaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clariFaiFace.left_col * width,
      topRow: clariFaiFace.top_row * height,
      rightCol: width - (clariFaiFace.right_col * width),
      bottomRow: height - (clariFaiFace.bottom_row * height)
    }
  }
// update the state of the box 
  displayFaceBox = (box) => {
    this.setState({box: box});
  }
//listen to click change
//connect to Clarifai API
//setState is Async function
//this.state.imageURL wouldn't worked in .predict() bc setState is Async
// response is an array of percentage
// calculateFaceLocation turn it to usable values which passed to the state by displayFaceBox
/* we can do this too 
this.setState({imageUrl: this.state.input}, () => {
  ---> do something after the state of the imageUrl change
});
*/
onButtonSubmit = () => {
  this.setState({imageUrl: this.state.input});
  fetch('https://afternoon-beach-63320.herokuapp.com/imageurl', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            input: this.state.input
          })
        })
    .then(response => response.json())
    .then(response => {
      if (response) {
        fetch('https://afternoon-beach-63320.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count}))
            //object.assign update only part of object which is here entries
          })
          .catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err)); 
}
// 
  onRouteChange = (route) => {
    if(route === 'signout')
    {this.setState(initialStatte)
  } else if (route === 'home'){
    this.setState({isSignedIn: true})}
    this.setState({route: route})
  }

  render() {
    const {isSignedIn, box, imageUrl, route} = this.state;
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions}/>
        <Navigation isSignedIn= {isSignedIn} onRouteChange= {this.onRouteChange}/>
        {route === 'home'? 
              <div>
                <Logo/>
                <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
                <ImageLinkForm onInputChange= {this.onInputChange} onButtonSubmit= {this.onButtonSubmit}/>
                <FaceRecognition imageUrl={imageUrl} box={box}/>
              </div>
        : route === 'signin'?
        <Signin loadUser={this.loadUser} onRouteChange= {this.onRouteChange} on/>
        : <Register loadUser={this.loadUser} onRouteChange= {this.onRouteChange} on/>
         } 
      </div>
    );
  }
}

export default App;
