import React, { useState , useEffect} from 'react';
import * as tf from '@tensorflow/tfjs';
import './application.css';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CssBaseline from '@mui/material/CssBaseline';
import GitHubIcon from '@mui/icons-material/GitHub';


const ImageClassifier = () => {
  const hiddenFileInput = React.useRef(null);
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const classNames = ['Avocado fruit', 'Cashew fruit', 'Coconut', 'Dragon Fruit', 'Durian', 'Fig fruit', 'Gooseberry', 'Guava', 'Jackfruit', 'Java plum fruit', 'Jujube', 'Longan', 'Lychee', 'Mangosteen', 'Papaya', 'Persimmon', 'Pineapple fruit', 'Pomegranate', 'Rambutan fruit', 'Sapodilla fruit', 'Star apple fruit', 'Star fruit', 'Sweetsop', 'Tamarind fruit', 'Watermelon fruit', 'Wax apple'];

  useEffect(() => {
    const loadModel = async () => {
      try {
        const model = await tf.loadLayersModel('https://pub-16cdaa3ce2034099afb2eb070ad2d765.r2.dev/file 2/model.json');
        setModel(model);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading the model:', error);
      }
    };

    loadModel();
  }, []);

  const getClassName = () => {
    if (prediction !== null && prediction >= 0 && prediction < classNames.length) {
      return classNames[prediction];
    }
    return 'Unknown';
  };

  const handleImageUpload = async (event) => {
    const imageFile = event.target.files[0];
    const imageURL = URL.createObjectURL(imageFile);
    setUploadedImage(imageURL);
    const img = document.createElement('img');
    img.src = imageURL;

    img.onload = async () => {
      const tensor = tf.browser.fromPixels(img).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
      
      if (model) {
        const predictions = model.predict(tensor);
        const logits = tf.squeeze(predictions);
        const classes = await logits.argMax().data();
        setPrediction(classes);
      }
    };
  };
  
  const GoToGitHub = () => {
    window.open('https://github.com/taiyo14/cambodian-fruits-classifier', '_blank');
  }

  const clickUpload = (event) => {
    hiddenFileInput.current.click();
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <CssBaseline/>
      <AppBar position="static" style={{ margin: 0 }}>
        <Toolbar variant="dense">
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h4" color="inherit" component="div" style={{flexGrow:'1', textAlign:'center'}}>
            Cambodian Fruits Classifier
          </Typography>
          <IconButton edge="end" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={GoToGitHub}>
            <GitHubIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <div className="app-container">
        {isLoading ? (
          <div>Loading model...</div>
        ) : (
          <div style={{paddingTop: '10%'}}>
            <div className='centered'>
              <Button variant="contained" onClick={clickUpload}>Upload Image</Button>
            </div>
            <input ref={hiddenFileInput} type="file" accept="image/*" onChange={handleImageUpload} style={{display:'none'}}/>
              {uploadedImage && (
                <div>
                  <div className='centered'>
                    <h2>Uploaded Image</h2>
                  </div>
                  <div className='centered'>
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      style={{ maxWidth: '256px', maxHeight: '256px' }}
                    />
                  </div>
                </div>
              )}
              {prediction !== null && (
                <div>
                  <div className='centered'>
                    <h2>Prediction</h2>
                  </div>
                  <div className='centered'>
                    <p>{getClassName()}</p>
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    </Box>
  );
};

export default ImageClassifier;