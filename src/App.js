//import logo from './logo.svg';
import {useEffect, useState} from 'react'
import './App.css';
import JSONFormatter from 'json-formatter-js'

var api_url = "http://localhost:3333/api/v1";
const app_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImppbmtvbzJAZ21haWwuY29tIiwiYXBwX25hbWUiOiJNeSBBcHAgMiIsImlhdCI6MTYxNjE3NDE5N30.hrsu1QOLO5yLiYQ_F5LiLqvZVRKuR_y__S3AkGyos-I';

function _(id) {
  return document.getElementById(id)
}

function App() {
  
  const [langList, setLangList] = useState([])
  const [imageUrl, setImageUrl] = useState("")
  const [resultJson, setResultJson] = useState({name:"jinkoo"})

  ////////////////////////
  // fetch the lang list
  useEffect(() => {
    var url = `${api_url}/ocr/lang_list?app_token=${app_token}`
    fetch(url)
    .then(res=>res.json())
    .then(data=>{
      if(data.success){
        setLangList(data.data.list)
      }
      else{
        alert('fecting language list failed!'+data.message)
      }
    })
    .catch(error=>console.error(error))
  },[])
  
  const  onImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file)

    if (file.type.startsWith('image/')) {
      console.log('file is an image')

      console.log(URL.createObjectURL(file))
      setImageUrl(URL.createObjectURL(file))

      // const img = document.createElement("img");
      // img.classList.add("preview_img");
      // img.file = file;

      // _('preview').innerHTML = "";
      // _('preview').appendChild(img);

      // const reader = new FileReader();
      // reader.onload = (function (aImg) { return function (e) { aImg.src = e.target.result; }; })(img);
      // reader.readAsDataURL(file);

    } else if (file.type == 'application/pdf'){
      console.log('file is an pdf')
    } else {
      console.error('Only an image or pdf file is supported.')
    }
     
}

const onSubmit = (e)=>{
  e.preventDefault();
  console.log('onSubmit()')

// ext
var file_input = document.getElementById("img_data")
const ext = file_input.value.split('.').pop()
console.log('file_input.value.split(.).pop()', ext)

var formData = new FormData(e.target)
formData.append("app_token", app_token);
formData.append("img_ext", ext);
formData.append("output_json", "true");
formData.append("output_pdf", "true");

var url = api_url + "/ocr";

console.log('POST', url)

fetch(url, {
  body: formData,
  method: 'post'
})
.then(res=>res.json())
.then(data=>{
  console.log(data)

  if(data.success){
    _("output_text").innerHTML = data.data.text;
    
    const formatter = new JSONFormatter(data.data.json)
    _("output_json").appendChild(formatter.render())
  }
})
.catch(error=>{
  console.log(error)
})

///////////////////////////////////////
// var xhr = new XMLHttpRequest();
// xhr.open("POST", url, true);

// xhr.onreadystatechange = function () { // Call a function when the state changes.
//     if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
//         console.log('request complete');
//         console.log('status', xhr.status);
//         console.log('statusText', xhr.statusText);

//         var res = JSON.parse(xhr.response);
//         const data = res.data;

//         console.log('data', data)
//         _("output_text").innerHTML = data.text;
//         _("output_json").innerHTML = JSON.stringify(data.json);
//     }
// }

// xhr.send(formData);

console.log('req sent!')

}

  return (
    <div className="App">
      
      <h1>OCR DEMO</h1>

      <form 
        method="post" 
        name="myform" 
        id="myform" 
        onSubmit={onSubmit}>
        <div>
          <label>File:</label>
          <input onChange={onImageChange} type="file" name="img_data" id="img_data" accept="image/*,.pdf" required />
        </div>

        <div>
          <label htmlFor="lang">Language:</label>
          <select id="lang" name="lang">
          {
            langList.map(lang=><option key={Math.floor(Math.random()*10000)} value={lang.code}>{lang.code} - {lang.label}</option>)
          }  
          </select>
        </div>

        <div>
          <input type="submit" value="Run OCR!" />
        </div>
      </form>

      <div id='preview'>
        <img className="preview_img" src={imageUrl} />
      </div>

      <div>TEXT</div>
      <div id="output_text"></div>
      <div>JSON</div>
      <div id="output_json">
        <ReactJson src={resultJson}/>
      </div>

      <button className="btn">Add</button>
    </div>
  );
}

export default App;
