import React, { useState , useEffect} from 'react';
import * as tf from '@tensorflow/tfjs';

const ImageClassifier = () => {
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const classNames = ['Avocado fruit', 'Cashew fruit', 'Coconut', 'Dragon Fruit', 'Durian', 'Fig fruit', 'Gooseberry', 'Guava', 'Jackfruit', 'Java plum fruit', 'Jujube', 'Longan', 'Lychee', 'Mangosteen', 'Papaya', 'Persimmon', 'Pineapple fruit', 'Pomegranate', 'Rambutan fruit', 'Sapodilla fruit', 'Star apple fruit', 'Star fruit', 'Sweetsop', 'Tamarind fruit', 'Watermelon fruit', 'Wax apple'];

  useEffect(() => {
    const loadModel = async () => {
      try {
        const model = await tf.loadLayersModel('https://pub-16cdaa3ce2034099afb2eb070ad2d765.r2.dev/file 2/model.json');
        setModel(model);
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

  return (
    <div>
      <h1>Image Classifier</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {uploadedImage && (
        <div>
          <h2>Uploaded Image</h2>
          <img
            src={uploadedImage}
            alt="Uploaded"
            style={{ maxWidth: '256px', maxHeight: '256px' }}
          />
        </div>
      )}
      {prediction !== null && (
        <div>
          <h2>Prediction</h2>
          <p>Class: {getClassName()}</p>
        </div>
      )}
    </div>
  );
};

export default ImageClassifier;
