import { useState, useEffect, useRef } from 'react'
import './App.css'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';
import Accordion from 'react-bootstrap/Accordion';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Link, Outlet } from 'react-router-dom';
function App() {
  const [invfile, setInvFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [loading4, setLoading4] = useState(false);
  const [loading5, setLoading5] = useState(false);
  const [loading6, setLoading6] = useState(false);
  const [loading7, setLoading7] = useState(false);
  const [loading8, setLoading8] = useState(false);
  const [errorloading, seterrorLoading] = useState(false);
  const [link,setLink]=useState([[],[],[],[],[],[],[],[]])
  const [errorlinks, seterrorLinks] = useState([]);

  const [index1, setIndex1] = useState(0);
  const [index2, setIndex2] = useState(0);
  const [index3, setIndex3] = useState(0);
  const [index4, setIndex4] = useState(0);
  const [index5, setIndex5] = useState(0);
  const [index6, setIndex6] = useState(0);
  const [index7, setIndex7] = useState(0);
  const [index8, setIndex8] = useState(0);
  const [errorindex, seterrorIndex] = useState(0);

  const [speed1, setSpeed1] = useState(0);
  const [speed2, setSpeed2] = useState(0);
  const [speed3, setSpeed3] = useState(0);
  const [speed4, setSpeed4] = useState(0);
  const [speed5, setSpeed5] = useState(0);
  const [speed6, setSpeed6] = useState(0);
  const [speed7, setSpeed7] = useState(0);
  const [speed8, setSpeed8] = useState(0);
  const [errorspeed, setSpeederror] = useState(0);

  const [totalProduct, setTotalProduct] = useState(0);
  const [urlError1, setUrlError1] = useState(false);
  const [urlError2, setUrlError2] = useState(false);
  const [urlError8, setUrlError8] = useState(false);
  const [urlError3, setUrlError3] = useState(false);
  const [urlError4, setUrlError4] = useState(false);
  const [urlError5, setUrlError5] = useState(false);
  const [urlError6, setUrlError6] = useState(false);
  const [urlError7, setUrlError7] = useState(false);
  const [errurlerr, setErrurlerr] = useState(false);
  const [graph, setGraph] = useState(null)
  const stopRef = useRef(false);
  const timerRef = useRef(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [linkid, setLinkid]= useState('');

  useEffect(() => {
    getinvurl();
    getupdatedproduct();
    geterrorurl();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  function divideArrayIntoParts(array) {
    const totalParts = 8;
    const partSize = Math.ceil(array.length / totalParts); // Calculate size of each part
    const result = [];

    for (let i = 0; i < totalParts; i++) {
        const start = i * partSize;
        const end = start + partSize;
        result.push(array.slice(start, end)); // Slice array into parts
    }

    return result;
}
const getinvurl = async () => {
  try {
    let result = await fetch('http://localhost:10000/getinvurl', {
      method: "GET",
      headers: { 'Content-Type': 'application/json' }
    })
    result = await result.json();
    setLinkid(result._id)
    let dividedarr=divideArrayIntoParts(result.url);
    setLink(dividedarr)
    console.log(dividedarr);
  } catch (err) {
    console.log(err)
  }
};

  const categorizePriceRanges = (products) => {
    const ranges = [
      { range: "0-50", count: 0 },
      { range: "51-100", count: 0 },
      { range: "101-150", count: 0 },
      { range: "151-200", count: 0 },
      { range: "201+", count: 0 },
    ];

    products.forEach((product) => {
      const price = product.price;
      if (price <= 50) ranges[0].count += 1;
      else if (price <= 100) ranges[1].count += 1;
      else if (price <= 150) ranges[2].count += 1;
      else if (price <= 200) ranges[3].count += 1;
      else ranges[4].count += 1;
    });

    return ranges;
  };

  const showgraph = () => {
    const gr = categorizePriceRanges();
    setGraph(gr);
  }

  const handleBeforeUnload = (event) => {
    event.preventDefault();
    stopTimer();
  };
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000); // Increment every second
  };
  const stopTimer = async () => {
    settime(timerRef.current)
    clearInterval(timerRef.current);
    timerRef.current = null;
  };
  const formatElapsedTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = (time % 60).toFixed(1);
    return `${minutes} m ${seconds} s`;
  };
  const formatElapsedTime1 = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = (time % 60).toFixed(0);
    return `${minutes} m ${seconds} s`;
  };
 
  const geterrorurl = async () => {
    try {
      let result = await fetch('http://localhost:10000/geterrorurl', {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
      })
      result = await result.json();
      seterrorLinks(result.links);
    } catch (err) {
      console.log(err)
    }
  };
  // --------upload file for inventory update----
  const setInventoryfile = (e) => {
    setInvFile(e.target.files[0]);
  };

  const uploadinventoryfile = async () => {
    setLoading(true)
    if(!invfile){
      alert("Please select file first");
      setLoading(false)
      return;
    }
    const formData = new FormData();
    formData.append('file', invfile);
    try {
      const response = await axios.post('http://localhost:10000/uploadinvfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert(response.data.msg);
      window.location.reload();
      setLoading(false)

    } catch (error) {
      console.error('Error uploading file:', error);
      setLoading(false)
      alert(error);
    }
  };

  const uploadinventoryfile2 = async () => {
    setLoading(true)
    const formData = new FormData();
    formData.append('file', invfile);
    try {
      const response = await axios.post('http://localhost:10000/uploadinvfile2', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert(response.data.msg);
      window.location.reload();
      setLoading(false)

    } catch (error) {
      console.error('Error uploading file:', error);
      setLoading(false)
      alert(error);
    }
  };
  const settime = (time) => {
    fetch('http://localhost:10000/settime', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ time: time + elapsedTime })
    })
  }
  const autofetchData = async (link,isfirst) => {
    try {
      let result = await fetch('http://localhost:10000/autofetchdata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: link,id:linkid, isfirst:isfirst })
      });
      result = await result.json();
      return result
    } catch (err) {
      setUrlError1(true);
      console.log("Error in autofetchData:", err);
      return false; // Return false in case of error to prevent further execution
    }
  };
  const autofetchData2 = async (link ,isfirst) => {
    try {
      let result = await fetch('http://localhost:10000/inv/autofetchdata2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: link,id:linkid, isfirst:isfirst })
      });
      result = await result.json();
      return result
    } catch (err) {
      console.log("Error in autofetchData2:", err);
      return false; // Return false in case of error to prevent further execution
    }
  };
  const autofetchData3 = async (link ,isfirst) => {
    try {
      let result = await fetch('http://localhost:10000/inv/autofetchdata3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: link,id:linkid, isfirst:isfirst })
      });
      result = await result.json();
      return result
    } catch (err) {
      console.log("Error in autofetchData3:", err);
      return false; // Return false in case of error to prevent further execution
    }
  };
  const autofetchData4 = async (link ,isfirst) => {
    try {
      let result = await fetch('http://localhost:10000/inv/autofetchdata4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: link,id:linkid, isfirst:isfirst })
      });
      result = await result.json();
      return result
    } catch (err) {
      console.log("Error in autofetchData4:", err);
      return false; // Return false in case of error to prevent further execution
    }
  };
  const autofetchData5 = async (link ,isfirst) => {
    try {
      let result = await fetch('http://localhost:10000/inv/autofetchdata5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: link,id:linkid, isfirst:isfirst })
      });
      result = await result.json();
      return result
    } catch (err) {
      console.log("Error in autofetchData5:", err);
      return false; // Return false in case of error to prevent further execution
    }
  };
  const autofetchData6 = async (link ,isfirst) => {
    try {
      let result = await fetch('http://localhost:10000/inv/autofetchdata6', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: link,id:linkid, isfirst:isfirst })
      });
      result = await result.json();
      return result
    } catch (err) {
      console.log("Error in autofetchData6:", err);
      return false; // Return false in case of error to prevent further execution
    }
  };
  const autofetchData7 = async (link ,isfirst) => {
    try {
      let result = await fetch('http://localhost:10000/inv/autofetchdata7', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: link,id:linkid, isfirst:isfirst })
      });
      result = await result.json();
      return result
    } catch (err) {
      console.log("Error in autofetchData7:", err);
      return false; // Return false in case of error to prevent further execution
    }
  };
  const autofetchData8 = async (link ,isfirst) => {
    try {
      let result = await fetch('http://localhost:10000/inv/autofetchdata8', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: link,id:linkid, isfirst:isfirst })
      });
      result = await result.json();
      return result
    } catch (err) {
      console.log("Error in autofetchData8:", err);
      return false; // Return false in case of error to prevent further execution
    }
  };
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const autofetch = async () => {
    let index = index1;
    setLoading1(true);
    startTimer();
    stopRef.current = false;
    while (index < link[0].length && !stopRef.current) {
      try {
        const startTime = performance.now();
        var result;
      if(index==0){
          result = await autofetchData(link[0][index],true);
        }else{
          result = await autofetchData(link[0][index],false);
        }
        const endTime = performance.now();
        const timeTaken1 = (endTime - startTime) / 1000;
        setSpeed1(timeTaken1.toFixed(1));
        console.log(`Thread-I || index: ${index} || result ${result}`);
        if (result === true) {
          index += 1;
          setIndex1(index)
          setUrlError1(false)
        } else {
          setUrlError1(true);
          console.log("An error occurred.");
          index += 1;
          setIndex1(index)
          geterrorurl();
        }
      } catch (err) {
        console.log("Error in autofetch:", err);
      }
    }
    setLoading1(false);
    stopTimer();
  };
  const autofetch2 = async () => {
    let index = index2;
    setLoading2(true);
    stopRef.current = false;
    while (index < link[1].length && !stopRef.current) {
      try {
        const startTime = performance.now(); // Start the timer
        var result;
        if(index==0){
            result = await autofetchData2(link[1][index],true);
          }else{
            result = await autofetchData2(link[1][index],false);
          }
         const endTime = performance.now(); // End the timer
        const timeTaken1 = (endTime - startTime) / 1000;
        setSpeed2(timeTaken1.toFixed(1));
        console.log(`Thread-II || index: ${index} || result ${result}`);
        if (result === true) {
          index += 1;
          setIndex2(index)
          setUrlError2(false)
        } else {
          setUrlError2(true);
          console.log("An error occurred.");
          index += 1;
          setIndex2(index)
          geterrorurl();
        }
      } catch (err) {
        console.log("Error in autofetch:", err);
      }
    } setLoading2(false)
  };
  const autofetch3 = async () => {
    let index = index3;
    setLoading3(true);
    stopRef.current = false;
    while (index < link[2].length && !stopRef.current) {
      try {
        const startTime = performance.now(); // Start the timer
        var result;
        if(index==0){
            result = await autofetchData3(link[2][index],true);
          }else{
            result = await autofetchData3(link[2][index],false);
          }        const endTime = performance.now(); // End the timer
        const timeTaken1 = (endTime - startTime) / 1000;
        setSpeed3(timeTaken1.toFixed(1));
        console.log(`Thread-III || index: ${index} || result ${result}`);
        if (result === true) {
          index += 1;
          setIndex3(index)
          setUrlError3(false)
        } else {
          setUrlError3(true);
          console.log("An error occurred.");
          index += 1;
          setIndex3(index)
          geterrorurl();
        }
      } catch (err) {
        console.log("Error in autofetch:", err);
      }
    } setLoading3(false)
  };
  const autofetch4 = async () => {
    let index = index4;
    setLoading4(true);
    stopRef.current = false;
    while (index < link[3].length && !stopRef.current) {
      try {
        const startTime = performance.now(); // Start the timer
        var result;
        if(index==0){
            result = await autofetchData4(link[3][index],true);
          }else{
            result = await autofetchData4(link[3][index],false);
          }        const endTime = performance.now(); // End the timer
        const timeTaken1 = (endTime - startTime) / 1000;
        setSpeed4(timeTaken1.toFixed(1));
        console.log(`Thread-IV || index: ${index} || result ${result}`);
        if (result === true) {
          index += 1;
          setIndex4(index)
          setUrlError4(false)
        } else {
          setUrlError4(true);
          console.log("An error occurred.");
          index += 1;
          setIndex4(index)
          geterrorurl();
        }
      } catch (err) {
        console.log("Error in autofetch:", err);
      }
    } setLoading4(false)
  };
  const autofetch5 = async () => {
    let index = index5;
    setLoading5(true);
    stopRef.current = false;
    while (index < link[4].length && !stopRef.current) {
      try {
        const startTime = performance.now(); // Start the timer
        var result;
        if(index==0){
            result = await autofetchData5(link[4][index],true);
          }else{
            result = await autofetchData5(link[4][index],false);
          }        const endTime = performance.now(); // End the timer
        const timeTaken1 = (endTime - startTime) / 1000;
        setSpeed5(timeTaken1.toFixed(1));
        console.log(`Thread-V || index: ${index} || result ${result}`);
        if (result === true) {
          index += 1;
          setIndex5(index)
          setUrlError5(false)
        } else {
          setUrlError5(true);
          console.log("An error occurred.");
          index += 1;
          setIndex5(index)
          geterrorurl();
        }
      } catch (err) {
        console.log("Error in autofetch5:", err);
      }
    } setLoading5(false)
  };

  const autofetch6 = async () => {
    let index = index6;
    setLoading6(true);
    stopRef.current = false;
    while (index < link[5].length && !stopRef.current) {
      try {
        const startTime = performance.now(); // Start the timer
        var result;
        if(index==0){
            result = await autofetchData6(link[5][index],true);
          }else{
            result = await autofetchData6(link[5][index],false);
          }         const endTime = performance.now(); // End the timer
        const timeTaken1 = (endTime - startTime) / 1000;
        setSpeed6(timeTaken1.toFixed(1));
        console.log(`Thread-VI || index: ${index} || result ${result}`);
        if (result === true) {
          index += 1;
          setIndex6(index)
        } else {
          setUrlError6(true);
          console.log("An error occurred.");
          index += 1;
          setIndex6(index)
          geterrorurl();
        }
      } catch (err) {
        console.log("Error in autofetch6:", err);
      }
    } setLoading6(false)
  };
  const autofetch7 = async () => {
    let index = index7;
    setLoading7(true);
    stopRef.current = false;
    stopRef.current = false;
    while (index < link[6].length && !stopRef.current) {
      try {
        const startTime = performance.now();
        var result;
        if(index==0){
            result = await autofetchData7(link[6][index],true);
          }else{
            result = await autofetchData7(link[6][index],false);
          }         const endTime = performance.now();
        const timeTaken1 = (endTime - startTime) / 1000;
        setSpeed7(timeTaken1.toFixed(1));
        console.log(`Thread-VII || index: ${index} || result ${result}`);
        if (result === true) {
          index += 1;
          setIndex7(index)
          setUrlError7(false)
        } else {
          setUrlError7(true);
          console.log("An error occurred.");
          index += 1;
          setIndex7(index)
          geterrorurl();
        }
      } catch (err) {
        console.log("Error in autofetch7:", err);
      }
    } setLoading7(false)
  };
  const autofetch8 = async () => {
    let index = index8;
    setLoading8(true);
    stopRef.current = false;
    while (index < link[7].length && !stopRef.current) {
      try {
        const startTime = performance.now(); // Start the timer
        var result;
        if(index==0){
            result = await autofetchData8(link[7][index],true);
          }else{
            result = await autofetchData8(link[7][index],false);
          }         const endTime = performance.now(); // End the timer
        const timeTaken1 = (endTime - startTime) / 1000;
        setSpeed8(timeTaken1.toFixed(1));
        console.log(`Thread-VIII || index: ${index} || result ${result}`);
        if (result === true) {
          index += 1;
          setIndex8(index)
          setUrlError8(false)
        } else {
          setUrlError8(true);
          console.log("An error occurred.");
          index += 1;
          setIndex8(index)
          geterrorurl();
        }
      } catch (err) {
        console.log("Error in autofetch8:", err);
      }
    } setLoading8(false)
  };

  const stopFetching = () => {
    stopRef.current = true; // Set stop condition
  };

  const getupdatedproduct = async () => {

    let result = await fetch('http://localhost:10000/getupdatedproduct', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    result = await result.json();
    setTotalProduct(result.num);
  }
  const downloadInvontory = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const response = await axios({
        url: 'http://localhost:10000/download-inventory',
        method: 'GET',
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Updated_inventory.xlsx'); // File name
      document.body.appendChild(link);
      link.click();
      link.remove();
      setLoading(false)
    } catch (error) {
      console.error('Error downloading the file:', error);
      setLoading(false)
    }
  }
  const startall = async () => {
    autofetch();
    await delay(1000)
    autofetch2();
    await delay(1000)
    autofetch3();
    await delay(2000)
    autofetch4();
    await delay(2000)
    autofetch5();
    await delay(2000)
    autofetch6();
    await delay(2000)
    autofetch7();
    await delay(2000)
    autofetch8();
  }
  return (
    <div style={{ opacity: loading ? 0.5 : 1, color: loading ? 'black' : null, paddingLeft: '3vw', paddingRight: '3vw' }}>
      {loading && ( // Show spinner while loading is true
        <div className="loading-overlay">
          <Spinner animation="border" variant="primary" /> {/* Spinner from Bootstrap */}
        </div>
      )}
      <div>
        <h2>Inventory Updation</h2>
        {/* -----Manual inventory updatiuon----------- */}

        <div className='pb-2 mt-4' style={{ border:'1px solid black'}}>
          <h4>Upload direct source file</h4>
          <input type="file" onChange={setInventoryfile} accept=".xlsx, .xls" />
          <button onClick={uploadinventoryfile2} >Upload</button>
        </div>
        {/* --------Inventory updation */}
        <div>
          <input type="file" onChange={setInventoryfile} accept=".xlsx, .xls" />
          <button onClick={uploadinventoryfile} >Upload</button>
          <button onClick={startall} className='ms-4' >Start All</button>
          <button onClick={stopFetching} className='ms-4' disabled={!loading1}>
            Pause
          </button>
          <button className='ms-4 mt-4' variant="secondary" onClick={downloadInvontory}>
            Download Result
          </button>
          <Link className='ms-4' to='analysis'>Analysis Data</Link>

        </div>
      </div>
      <div className="timer_container mt-4">
        <div className='timer'>Elapsed Time : &nbsp;<span style={{ fontWeight: 'bolder' }}>{formatElapsedTime(elapsedTime)}</span></div>
        {
          (loading1 || loading2 || loading3 || loading4 || loading5 || loading6 || loading7 || loading8) && <div className='timer'>Expected Time :&nbsp;<span style={{ fontWeight: 'bolder' }}>{formatElapsedTime1((speed1 / 8) * (link[0].length + link[1].length + link[2].length + link[3].length + link[4].length + link[5].length + link[6].length + link[7].length - (index1 + index2 + index3 + index4 + index5 + index6 + index7 + index8)))}</span> </div>
        }
        <div className="timer">
          Total updated Product : {totalProduct} <span onClick={getupdatedproduct}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="ms-4 bi bi-arrow-clockwise" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
          </svg></span>
        </div>
      </div>
      <Accordion className='mt-4' defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Total Number of Product's URL: {link[0] ? link[0].length + link[1].length + link[2].length + link[3].length + link[4].length + link[5].length + link[6].length + link[7].length : 0} &nbsp;&nbsp; || &nbsp;&nbsp; Total Number of urls fetched : {index1 + index2 + index3 + index4 + index5 + index6 + index7 + index8} &nbsp;&nbsp; || &nbsp;&nbsp; Remaining urls :  {link[0] ? link[0].length + link[1].length + link[2].length + link[3].length + link[4].length + link[5].length + link[6].length + link[7].length - (index1 + index2 + index3 + index4 + index5 + index6 + index7 + index8) : 0} &nbsp;&nbsp; || &nbsp;&nbsp; Net Speed : &nbsp; <span style={{ color: 'red' }}> {(speed1 / 8).toFixed(1)} s / URL</span></Accordion.Header>
          <Accordion.Body>
            <div className="thread" style={{ backgroundColor: loading1 ? 'rgb(11 109 91 / 99%)' : 'black', boxShadow: loading1 ? '#000000 8px 3px 55px -17px' : '0' }}>
              <div className="container">
                <div className="row">
                  <div className="cus_row col-lg-3 col-md-6 col-sm-12 mt-2 mb-2">
                    <button className='startbtn me-3' onClick={autofetch}>Start-I</button>
                    <input className='inputbtn' type="number" placeholder={index1} onChange={(e) => setIndex(e.target.value)} />
                  </div>

                  <div className="cus_row col-lg-3 col-md-6 col-sm-12 mt-2 mb-2">
                    <h4> {index1}/{link[0].length}</h4>
                    <div className='ms-4 me-4' style={{ height: 50, width: 50 }}>
                      <CircularProgressbar
                        value={(index1 / link[0].length * 100)}
                        text={`${(index1 / link[0].length * 100).toFixed(0)}%`}
                      />;
                    </div>
                    <h4>
                      {speed1} s / URL
                    </h4>
                  </div>

                  <div className="cus_row col-lg-6 col-md-6 col-sm-12 mt-2 mb-2">
                    {urlError1 && <p style={{ color: 'red' }}>Error while fetching this url -</p>}
                    <a href={link[0][index1]} target='_blank' style={{ color: urlError1 ? 'red' : 'white' }}>{index1 === link[0].length ? 
                    (
                      <>
                        Completed <img className='ms-3' src="/static/celebr.png" alt="Completed" height='40' style={{transform: 'rotate(70deg)'}} />
                      </>
                    ) : link[0][index1]}</a>
                  </div>

                </div>
              </div>
            </div>

            <div className="thread mt-2" style={{ backgroundColor: loading2 ? 'rgb(11 109 91 / 99%)' : 'black', boxShadow: loading2 ? '#000000 8px 3px 55px -17px' : '0' }}>
              <div className="container">
                <div className="row">
                  <div className="cus_row col-lg-3 col-md-6 col-sm-12 mt-2 mb-2">
                    <button className='startbtn me-3' onClick={autofetch2}>Start-II</button>
                    <input className='inputbtn' type="number" placeholder={index2} onChange={(e) => setIndex2(e.target.value)} />
                  </div>

                  <div className="cus_row col-lg-3 col-md-6 col-sm-12 mt-2 mb-2">
                    <h4> {index2}/{link[1].length}</h4>
                    <div className='ms-4 me-4' style={{ height: 50, width: 50 }}>
                      <CircularProgressbar
                        value={(index2 / link[1].length * 100)}
                        text={`${(index2 / link[1].length * 100).toFixed(0)}%`}
                      />;
                    </div>
                    <h4>
                      {speed2} s / URL
                    </h4>
                  </div>

                  <div className="cus_row col-lg-6 col-md-6 col-sm-12 mt-2 mb-2">
                    {urlError2 && <p style={{ color: 'red' }}>Error while fetching this url -</p>}
                    <a href={link[1][index2]} target='_blank' style={{ color: urlError2 ? 'red' : 'white' }}>{index2 === link[1].length ?  (
                      <>
                        Completed <img className='ms-3' src="/static/celebr.png" alt="Completed" height='40' style={{transform: 'rotate(70deg)'}} />
                      </>
                    ) : link[1][index2]}</a>
                  </div>

                </div>
              </div>
            </div>

            <div className="thread mt-2" style={{ backgroundColor: loading3 ? 'rgb(11 109 91 / 99%)' : 'black', boxShadow: loading3 ? '#000000 8px 3px 55px -17px' : '0' }}>
              <div className="container">
                <div className="row">
                  <div className="cus_row col-lg-3 col-md-6 col-sm-12 mt-2 mb-2">
                    <button className='startbtn me-3' onClick={autofetch3}>Start-III</button>
                    <input className='inputbtn' type="number" placeholder={index3} onChange={(e) => setIndex3(e.target.value)} />
                  </div>

                  <div className="cus_row col-lg-3 col-md-6 col-sm-12 mt-2 mb-2">
                    <h4> {index3}/{link[2].length}</h4>
                    <div className='ms-4 me-4' style={{ height: 50, width: 50 }}>
                      <CircularProgressbar
                        value={(index3 / link[2].length * 100)}
                        text={`${(index3 / link[2].length * 100).toFixed(0)}%`}
                      />;
                    </div>
                    <h4>
                      {speed3} s / URL
                    </h4>
                  </div>

                  <div className="cus_row col-lg-6 col-md-6 col-sm-12 mt-2 mb-2">
                    {urlError3 && <p style={{ color: 'red' }}>Error while fetching this url -</p>}
                    <a href={link[2][index3]} target='_blank' style={{ color: urlError3 ? 'red' : 'white' }}>{index3 === link[2].length ?  (
                      <>
                        Completed <img className='ms-3' src="/static/celebr.png" alt="Completed" height='40' style={{transform: 'rotate(70deg)'}} />
                      </>
                    ) : link[2][index3]}</a>
                  </div>

                </div>
              </div>
            </div>

            <div className="thread mt-2" style={{ backgroundColor: loading4 ? 'rgb(11 109 91 / 99%)' : 'black', boxShadow: loading4 ? '#000000 8px 3px 55px -17px' : '0' }}>
              <div className="container">
                <div className="row">
                  <div className="cus_row col-lg-3 col-md-6 col-sm-12 mt-2 mb-2">
                    <button className='startbtn me-3' onClick={autofetch4}>Start-IV</button>
                    <input className='inputbtn' type="number" placeholder={index4} onChange={(e) => setIndex4(e.target.value)} />
                  </div>

                  <div className="cus_row col-lg-3 col-md-6 col-sm-12 mt-2 mb-2">
                    <h4> {index4}/{link[3].length}</h4>
                    <div className='ms-4 me-4' style={{ height: 50, width: 50 }}>
                      <CircularProgressbar
                        value={(index4 / link[3].length * 100)}
                        text={`${(index4 / link[3].length * 100).toFixed(0)}%`}
                      />;
                    </div>
                    <h4>
                      {speed4} s / URL
                    </h4>
                  </div>

                  <div className="cus_row col-lg-6 col-md-6 col-sm-12 mt-2 mb-2">
                    {urlError4 && <p style={{ color: 'red' }}>Error while fetching this url -</p>}
                    <a href={link[3][index4]} target='_blank' style={{ color: urlError4 ? 'red' : 'white' }}>{index4 === link[3].length ?  (
                      <>
                        Completed <img className='ms-3' src="/static/celebr.png" alt="Completed" height='40' style={{transform: 'rotate(70deg)'}} />
                      </>
                    ) : link[3][index4]}</a>
                  </div>

                </div>
              </div>
            </div>

            <div className="thread mt-2" style={{ backgroundColor: loading5 ? 'rgb(11 109 91 / 99%)' : 'black', boxShadow: loading5 ? '#000000 8px 3px 55px -17px' : '0' }}>
              <div className="container">
                <div className="row">
                  <div className="cus_row col-lg-3 col-md-6 col-sm-12 mt-2 mb-2">
                    <button className='startbtn me-3' onClick={autofetch5}>Start-V</button>
                    <input className='inputbtn' type="number" placeholder={index5} onChange={(e) => setIndex5(e.target.value)} />
                  </div>

                  <div className="cus_row col-lg-3 col-md-6 col-sm-12 mt-2 mb-2">
                    <h4> {index5}/{link[4].length}</h4>
                    <div className='ms-4 me-4' style={{ height: 50, width: 50 }}>
                      <CircularProgressbar
                        value={(index5 / link[4].length * 100)}
                        text={`${(index5 / link[4].length * 100).toFixed(0)}%`}
                      />;
                    </div>
                    <h4>
                      {speed5} s / URL
                    </h4>
                  </div>

                  <div className="cus_row col-lg-6 col-md-6 col-sm-12 mt-2 mb-2">
                    {urlError5 && <p style={{ color: 'red' }}>Error while fetching this url -</p>}
                    <a href={link[4][index5]} target='_blank' style={{ color: urlError5 ? 'red' : 'white' }}>{index5 === link[4].length ?  (
                      <>
                        Completed <img className='ms-3' src="/static/celebr.png" alt="Completed" height='40' style={{transform: 'rotate(70deg)'}} />
                      </>
                    ) : link[4][index5]}</a>
                  </div>

                </div>
              </div>
            </div>

            <div className="thread mt-2" style={{ backgroundColor: loading6 ? 'rgb(11 109 91 / 99%)' : 'black', boxShadow: loading6 ? '#000000 8px 3px 55px -17px' : '0' }}>
              <div className="container">
                <div className="row">
                  <div className="cus_row col-lg-3 col-md-6 col-sm-12 mt-2 mb-2">
                    <button className='startbtn me-3' onClick={autofetch6}>Start-VI</button>
                    <input className='inputbtn' type="number" placeholder={index6} onChange={(e) => setIndex6(e.target.value)} />
                  </div>

                  <div className="cus_row col-lg-3 col-md-6 col-sm-12 mt-2 mb-2">
                    <h4> {index6}/{link[5].length}</h4>
                    <div className='ms-4 me-4' style={{ height: 50, width: 50 }}>
                      <CircularProgressbar
                        value={(index6 / link[5].length * 100)}
                        text={`${(index6 / link[5].length * 100).toFixed(0)}%`}
                      />;
                    </div>
                    <h4>
                      {speed6} s / URL
                    </h4>
                  </div>

                  <div className="cus_row col-lg-6 col-md-6 col-sm-12 mt-2 mb-2">
                    {urlError6 && <p style={{ color: 'red' }}>Error while fetching this url -</p>}
                    <a href={link[5][index6]} target='_blank' style={{ color: urlError6 ? 'red' : 'white' }}>{index6 === link[5].length ?  (
                      <>
                        Completed <img className='ms-3' src="/static/celebr.png" alt="Completed" height='40' style={{transform: 'rotate(70deg)'}} />
                      </>
                    ) : link[5][index6]}</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="thread mt-2" style={{ backgroundColor: loading7 ? 'rgb(11 109 91 / 99%)' : 'black', boxShadow: loading7 ? '#000000 8px 3px 55px -17px' : '0' }}>
              <div className="container">
                <div className="row">
                  <div className="cus_row col-lg-3 col-md-6 col-sm-12 mt-2 mb-2">
                    <button className='startbtn me-3' onClick={autofetch7}>Start-VII</button>
                    <input className='inputbtn' type="number" placeholder={index7} onChange={(e) => setIndex7(e.target.value)} />
                  </div>

                  <div className="cus_row col-lg-3 col-md-6 col-sm-12 mt-2 mb-2">
                    <h4> {index7}/{link[6].length}</h4>
                    <div className='ms-4 me-4' style={{ height: 50, width: 50 }}>
                      <CircularProgressbar
                        value={(index7 / link[6].length * 100)}
                        text={`${(index7 / link[6].length * 100).toFixed(0)}%`}
                      />;
                    </div>
                    <h4>
                      {speed7} s / URL
                    </h4>
                  </div>

                  <div className="cus_row col-lg-6 col-md-6 col-sm-12 mt-2 mb-2">
                    {urlError7 && <p style={{ color: 'red' }}>Error while fetching this url -</p>}
                    <a href={link[6][index7]} target='_blank' style={{ color: urlError7 ? 'red' : 'white' }}>{index7 === link[6].length ?  (
                      <>
                        Completed <img className='ms-3' src="/static/celebr.png" alt="Completed" height='40' style={{transform: 'rotate(70deg)'}} />
                      </>
                    ) : link[6][index7]}</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="thread mt-2" style={{ backgroundColor: loading8 ? 'rgb(11 109 91 / 99%)' : 'black', boxShadow: loading8 ? '#000000 8px 3px 55px -17px' : '0' }}>
              <div className="container">
                <div className="row">
                  <div className="cus_row col-lg-3 col-md-6 col-sm-12 mt-2 mb-2">
                    <button className='startbtn me-3' onClick={autofetch8}>Start-VIII</button>
                    <input className='inputbtn' type="number" placeholder={index8} onChange={(e) => setIndex8(e.target.value)} />
                  </div>

                  <div className="cus_row col-lg-3 col-md-6 col-sm-12 mt-2 mb-2">
                    <h4> {index8}/{link[7].length}</h4>
                    <div className='ms-4 me-4' style={{ height: 50, width: 50 }}>
                      <CircularProgressbar
                        value={(index8 / link[7].length * 100)}
                        text={`${(index8 / link[7].length * 100).toFixed(0)}%`}
                      />;
                    </div>
                    <h4>
                      {speed8} s / URL
                    </h4>
                  </div>

                  <div className="cus_row col-lg-6 col-md-6 col-sm-12 mt-2 mb-2">
                    {urlError8 && link[7].length < index8 && <p style={{ color: 'red' }}>Error while fetching this url -</p>}
                    <a href={link[7][index8]} target='_blank' style={{ color: (urlError8 && link[7].length < index8) ? 'red' : 'white' }}>{index8 === link[7].length ?  (
                      <>
                        Completed <img className='ms-3' src="/static/celebr.png" alt="Completed" height='40' style={{transform: 'rotate(70deg)'}} />
                      </>
                    ) : link[7][index8]}</a>
                  </div>
                </div>
              </div>
            </div>

          </Accordion.Body>
        </Accordion.Item>
        {
          errorlinks.length > 0 &&
          <Accordion.Item eventKey="1">
            <Accordion.Header> <span style={{ color: 'red' }}>Number of url in which error occur: &nbsp; {errorlinks.length} </span> </Accordion.Header>
            <Accordion.Body>
              <div className="thread mt-2 mb-4" style={{ backgroundColor: errorloading ? 'rgb(11 109 91 / 99%)' : 'red', boxShadow: errorloading ? '#000000 8px 3px 55px -17px' : '0' }}>
                <div className="container">
                  <div className="row">
                    <div className="cus_row col-lg-3 col-md-6 col-sm-12 mt-2 mb-2">
                      <button className='startbtn me-3' onClick={autofetcherror}>Start</button>
                      <input className='inputbtn' type="number" placeholder={errorindex} onChange={(e) => seterrorCustomIndex(e.target.value)} />
                      <button className='startbtn ms-3' onClick={() => setautoerrorindex(errorcustomIndex)} >
                        Set Index
                      </button>
                    </div>

                    <div className="cus_row col-lg-3 col-md-6 col-sm-12 mt-2 mb-2">
                      <h4> {errorindex}/{errorlinks.length}</h4>
                      <div className='ms-4 me-4' style={{ height: 50, width: 50 }}>
                        <CircularProgressbar
                          value={(errorindex / errorlinks.length * 100)}
                          text={`${(errorindex / errorlinks.length * 100).toFixed(0)}%`}
                        />;
                      </div>
                      <h4>
                        {errorspeed} s / URL
                      </h4>
                    </div>

                    <div className="cus_row col-lg-6 col-md-6 col-sm-12 mt-2 mb-2">
                      {errurlerr && <p style={{ color: 'white' }}>Error while fetching this url -</p>}
                      <a href={errorlinks[errorindex]} target='_blank' style={{ color: errurlerr ? 'blue' : 'white' }}>{errorindex === errorlinks.length ? "Completed" : errorlinks[errorindex]}</a>
                    </div>

                  </div>
                </div>
              </div>
              <h4>Error urls List</h4>
              <ol>
                {
                  errorlinks.map((el, index) => (
                    <li key={index}><a href={el} target='_blank'>{el}</a></li>
                  ))
                }
              </ol>
            </Accordion.Body>
          </Accordion.Item>
        }
      </Accordion>
      <hr />
      <Outlet />
    </div>
  )
}

export default App
