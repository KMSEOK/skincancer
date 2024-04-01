import { useState ,useEffect, useRef} from 'react'
import * as mobilenet from "@tensorflow-models/mobilenet";
import '@tensorflow/tfjs-backend-webgl';
import './App.css'

function App() {

  const [isModelLoading, setIsModelLoading] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [model , setModel] = useState(null);
  const imageRef = useRef();

  const loadModel = async () => {
    setIsModelLoading(true);
    try {
      const model = await mobilenet.load();
      setModel(model);
      setIsModelLoading(false);
    } catch (error) {
      console.log(error);
      setIsModelLoading(false);
    }
  };

  useEffect(() => {
    loadModel();
  }, []);

  if (isModelLoading) {
    return <h1 style={{ textAlign: "center" }}>로딩중...</h1>;
  }

  const uploadImage=(e) => {
    const {files} = e.target;
    if (files.length > 0){
      const url = URL.createObjectURL(files[0]);
      //로컬 파일은 웹에서 보안상 차단하는 경우가 많음.
      //그래서 임시로 url만들어서 <img>태그에 사용함
      console.log('files', files)
      console.log('files', url)
      setImageURL(url);
    }else{
      setImageURL(null);
    }
  }

  const hdetectImage = async()=> {
    const results = await model.classify(imageRef.current);
    //setResult (results);
    console.log('results', results)
  }


  return (
    <>
     <h1>머신러닝 이미지 분석앱</h1>
     <input
     type='file'
     accept='image/*'
     onChange={uploadImage}></input>
    
    <div>
      {imageURL && 
      <img
        src ={imageURL}
        ref = {imageRef}
        width= "300px"
        height= "300px"/>}

    </div>
    {imageURL && 
    <button 
    onClick={hdetectImage}>분석하기</button>
}
    
    </>
  )
}

export default App
