import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imageURL}) => {
  return (
    <div className='center ma'>
      <div className= "absolute mt2">
        <img id='inputimage' alt='' src={imageURL} width='500px' heigh='auto'/>
      </div>
    </div>
  );
}

export default FaceRecognition;