
import { useState, useEffect, useRef } from 'react'
import './App.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import { Link, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';
import Accordion from 'react-bootstrap/Accordion';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Pagination from 'react-bootstrap/Pagination';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';


function Inventory() {
  const [data, setData] = useState([{}]);
  const [realData, setRealData] = useState([{}]);
  const [currentPage, setCurrentPage] = useState(1);
  const [num, setNum] = useState(7)
  const [search, setSearch] = useState('');
  const [result, setResult] = useState([{}]);
  const [remaindata, setRemain] = useState([{}]);
  const itemsPerPage = 10;

  const getupdatedproduct = async () => {
    // setLoading(true)
    let result = await fetch('http://localhost:10000/mic/getupdatedproduct', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    result = await result.json();
    // setLoading(false)
    const uniqueProducts = result.filter((product, index, self) =>
      index === self.findIndex(p => p['upc'] === product['upc'])
    );
    setData(uniqueProducts)
    setRealData(uniqueProducts)
  };
  const remainingdata = async () => {
    setLoading(true)
    let result = await fetch('http://localhost:10000/mic/remainingdata', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    result = await result.json();
    setRemain(result);
    setLoading(false)
  };

  // Pagination calculation for displaying the current page's data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  // --------------------------------------------------------------------
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
  const [link,setLink] =useState([[],[],[],[],[],[],[],[]])
  const [linkid,setLinkid]= useState('')
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

  const [urlError1, setUrlError1] = useState(false);
  const [urlError2, setUrlError2] = useState(false);
  const [urlError8, setUrlError8] = useState(false);
  const [urlError3, setUrlError3] = useState(false);
  const [urlError4, setUrlError4] = useState(false);
  const [urlError5, setUrlError5] = useState(false);
  const [urlError6, setUrlError6] = useState(false);
  const [urlError7, setUrlError7] = useState(false);
  const [errurlerr, setErrurlerr] = useState(false)
  const stopRef = useRef(false);
  const timerRef = useRef('');
  const [elapsedTime, setElapsedTime] = useState(0);
  useEffect(() => {
    getinvurl();
    geterrorurl();
    getupdatedproduct();
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
    let result = await fetch('http://localhost:10000/mic/getinvurl', {
      method: "GET",
      headers: { 'Content-Type': 'application/json' }
    })
    result = await result.json();
    console.log(result.links1)
    setLinkid(result.links1[0]._id)
   let finalarray= divideArrayIntoParts(result.links1[0].url);
   setLink(finalarray)
    console.log(finalarray);
  } catch (err) {
    console.log(err)
  }
};
  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate the page numbers to be displayed
  const paginationRange = () => {
    const range = [];
    const maxPageNumbers = 5; // Max page numbers to show
    let startPage = Math.max(currentPage - Math.floor(maxPageNumbers / 2), 1);
    let endPage = startPage + maxPageNumbers - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - maxPageNumbers + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }
    return range;
  };

  const searchproduct = () => {
    setResult([{}])
    if (search !== null) {
      new Promise(resolve => setTimeout(resolve, 1000))
      const sr = realData.filter((d) => d.ASIN.toLowerCase().includes(search.toLowerCase()))
      setResult(sr);
    }
  }

  const cancelsearch = () => {
    setResult([{}]);
    setSearch(null)
  }

  const priceincrease = () => {
    const ip = realData.filter((d) => (d['Current Price'] - d['Product Cost']) > 0.5 && d.available === 'T');
    setData(ip)
  }

  const pricedecrease = () => {
    const ip = realData.filter((d) => Number(d['Current Price']).toFixed(2) < Number(d['Product Cost']).toFixed(2) && d.available === 'T');
    setData(ip)
  }

  const outofstock = () => {
    const ip = realData.filter((d) => d['quantity'] < num && d.available === 'T');
    setData(ip)
  }
  const remain = () => {
    setData(remaindata);
  }

  const stock = () => {
    const s = realData.filter((d) => d['quantity'] > num && d.available === 'F');
    setData(s)
  }

  const all = () => {
    setData(realData)
  }
  const handleBeforeUnload = (event) => {
    event.preventDefault();

    stopTimer();
  };
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);

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
      let result = await fetch('http://localhost:10000/mic/geterrorurl', {
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
    const formData = new FormData();
    formData.append('file', invfile);
    try {
      const response = await axios.post('http://localhost:10000/mic/uploadinvfile', formData, {
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
    fetch('http://localhost:10000/mic/settime', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ time: time + elapsedTime })
    })
  }
  const seterrorindex = async () => {
    const newIndex = parseInt(errorcustomIndex, 10);
    let result = await fetch('http://localhost:10000/mic/seterrorindex', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ start_index: newIndex })
    });
    result = await result.json();
    result.status ? null : seterrorindex();
    seterrorIndex(result.index)
  };

  const autofetchData = async (link) => {
    try {
      let result = await fetch('http://localhost:10000/mic/autofetchdata1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: link,  linkid:linkid })
      });
      result = await result.json();
      return result
    } catch (err) {
      setUrlError1(true);
      console.log("Error in autofetchData:", err);
      return false; // Return false in case of error to prevent further execution
    }
  };
  const autofetchData2 = async (link) => {
    try {
      let result = await fetch('http://localhost:10000/mic/autofetchdata2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: link })
      });
      result = await result.json();
      return result
    } catch (err) {
      console.log("Error in autofetchData2:", err);
      return false; // Return false in case of error to prevent further execution
    }
  };
  const autofetchData3 = async (link) => {
    try {
      let result = await fetch('http://localhost:10000/mic/autofetchdata3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: link })
      });
      result = await result.json();
      return result
    } catch (err) {
      console.log("Error in autofetchData3:", err);
      return false; // Return false in case of error to prevent further execution
    }
  };
  const autofetchData4 = async (link) => {
    try {
      let result = await fetch('http://localhost:10000/mic/autofetchdata4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: link })
      });
      result = await result.json();
      return result
    } catch (err) {
      console.log("Error in autofetchData4:", err);
      return false; // Return false in case of error to prevent further execution
    }
  };
  const autofetchData5 = async (link) => {
    try {
      let result = await fetch('http://localhost:10000/mic/autofetchdata5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: link })
      });
      result = await result.json();
      return result
    } catch (err) {
      console.log("Error in autofetchData5:", err);
      return false; // Return false in case of error to prevent further execution
    }
  };
  const autofetchData6 = async (link) => {
    try {
      let result = await fetch('http://localhost:10000/mic/autofetchdata6', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: link })
      });
      result = await result.json();
      return result
    } catch (err) {
      console.log("Error in autofetchData6:", err);
      return false; // Return false in case of error to prevent further execution
    }
  };
  const autofetchData7 = async (link) => {
    try {
      let result = await fetch('http://localhost:10000/mic/autofetchdata7', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: link })
      });
      result = await result.json();
      return result
    } catch (err) {
      console.log("Error in autofetchData7:", err);
      return false; // Return false in case of error to prevent further execution
    }
  };
  const autofetchData8 = async (link) => {
    try {
      let result = await fetch('http://localhost:10000/mic/autofetchdata8', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: link })
      });
      result = await result.json();
      return result
    } catch (err) {
      console.log("Error in autofetchData8:", err);
      return false; // Return false in case of error to prevent further execution
    }
  };
  const autofetchDataerror = async (link) => {
    try {
      let result = await fetch('http://localhost:10000/mic/autofetchdata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: link })
      });
      result = await result.json();
      return result
    } catch (err) {
      setErrurlerr(true);
      console.log("Error in autofetchData:", err);
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
        const startTime = performance.now(); // Start the timer
        const result = await autofetchData(link[0][index]);
        const endTime = performance.now(); // End the timer
        const timeTaken1 = (endTime - startTime) / 1000;
        setSpeed1(timeTaken1.toFixed(1));
        console.log(`Thread-I || index: ${index} || result ${result}`);
        if (result === true) {
          index += 1;
          setIndex1(Number(index))
          setUrlError1(false)
        } else {
          setUrlError1(true);
          console.log("An error occurred.");
          await delay(3000);
          index += 1;
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
        const result = await autofetchData2(link[1][index]);
        const endTime = performance.now(); // End the timer
        const timeTaken1 = (endTime - startTime) / 1000;
        setSpeed2(timeTaken1.toFixed(1));
        console.log(`Thread-II || index: ${index} || result ${result}`);
        if (result === true) {
          index += 1;
          index % 10 == 0|| index == link[1].length ? setautoindex2(index) : null;
          setIndex2(index)
          setUrlError2(false)
        } else {
          setautoindex2(index)
          setUrlError2(true);
          console.log("An error occurred.");
          await delay(3000);
          index += 1;
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
        const result = await autofetchData3(link[2][index]);
        const endTime = performance.now(); // End the timer
        const timeTaken1 = (endTime - startTime) / 1000;
        setSpeed3(timeTaken1.toFixed(1));
        console.log(`Thread-III || index: ${index} || result ${result}`);
        if (result === true) {
          index += 1;
          index % 10 == 0 || index == link[2].length? setautoindex3(index) : null;
          setIndex3(index)
          setUrlError3(false)
        } else {
          setautoindex3(index)
          setUrlError3(true);
          console.log("An error occurred.");
          await delay(3000);
          index += 1;
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
        const result = await autofetchData4(link[3][index]);
        const endTime = performance.now(); // End the timer
        const timeTaken1 = (endTime - startTime) / 1000;
        setSpeed4(timeTaken1.toFixed(1));
        console.log(`Thread-IV || index: ${index} || result ${result}`);
        if (result === true) {
          index += 1;
          index % 10 == 0 || index == link[3].length ? setautoindex4(index) : null;
          setIndex4(index)
          setUrlError4(false)
        } else {
          setautoindex4(index)
          setUrlError4(true);
          console.log("An error occurred.");
          await delay(3000);
          index += 1;
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
        const result = await autofetchData5(link[4][index]);
        const endTime = performance.now(); // End the timer
        const timeTaken1 = (endTime - startTime) / 1000;
        setSpeed5(timeTaken1.toFixed(1));
        console.log(`Thread-V || index: ${index} || result ${result}`);
        if (result === true) {
          index += 1;
          index % 10 == 0|| index == link[4].length? setautoindex5(index) : null;
          setIndex5(index)
          setUrlError5(false)
        } else {
          setautoindex5(index)
          setUrlError5(true);
          console.log("An error occurred.");
          await delay(3000);
          index += 1;
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
        const result = await autofetchData6(link[5][index]);
        const endTime = performance.now(); // End the timer
        const timeTaken1 = (endTime - startTime) / 1000;
        setSpeed6(timeTaken1.toFixed(1));
        console.log(`Thread-VI || index: ${index} || result ${result}`);
        if (result === true) {
          index += 1;
          index % 10 == 0 || index == link[5].length? setautoindex6(index) : null;
          setIndex6(index)
          setUrlError6(false)
        } else {
          setautoindex6(index)
          setUrlError6(true);
          console.log("An error occurred.");
          await delay(3000);
          index += 1;
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
        const result = await autofetchData7(link[6][index]);
        const endTime = performance.now();
        const timeTaken1 = (endTime - startTime) / 1000;
        setSpeed7(timeTaken1.toFixed(1));
        console.log(`Thread-VII || index: ${index} || result ${result}`);
        if (result === true) {
          index += 1;
          index % 10 == 0 || index == link[6].length? setautoindex7(index) : null;
          setIndex7(index)
          setUrlError7(false)
        } else {
          setautoindex7(index)
          setUrlError7(true);
          console.log("An error occurred.");
          await delay(3000);
          index += 1;
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
        const result = await autofetchData8(link[7][index]);
        const endTime = performance.now(); // End the timer
        const timeTaken1 = (endTime - startTime) / 1000;
        setSpeed8(timeTaken1.toFixed(1));
        console.log(`Thread-VIII || index: ${index} || result ${result}`);
        if (result === true) {
          index += 1;
          index % 10 == 0  || index == link[7].length? setautoindex8(index) : null;
          setIndex8(index)
          setUrlError8(false)
        } else {
          setautoindex8(index)
          setUrlError8(true);
          console.log("An error occurred.");
          await delay(3000);
          index += 1;
          geterrorurl();
        }
      } catch (err) {
        console.log("Error in autofetch8:", err);
      }
    } setLoading8(false)
  };
  const autofetcherror = async () => {
    let index = errorindex;
    seterrorLoading(true);
    startTimer();
    stopRef.current = false;
    while (index < errorlinks.length && !stopRef.current) {
      try {
        const startTime = performance.now(); // Start the timer
        const result = await autofetchDataerror(errorlinks[index]);
        const endTime = performance.now(); // End the timer
        const timeTaken1 = (endTime - startTime) / 1000;
        setSpeederror(timeTaken1.toFixed(1));
        console.log(`Thread-Error || error_index: ${errorindex} || result ${result}`);
        if (result === true) {
          index += 1;
          seterrorindex(index);
          setErrurlerr(false)
        } else {
          setErrurlerr(true);
          console.log("An error occurred.");
          await delay(3000);
          index += 1;
        }
      } catch (err) {
        console.log("Error in autofetch:", err);
      }
    }
    seterrorLoading(false);
    stopTimer();
  };
  const stopFetching = () => {
    stopRef.current = true; 
  };

  const downloadInvontory = async () => {
    try {
      var ans;
      if (errorlinks.length > 0) {
        ans = confirm("There are some invalid or such a url where error occur. If you visited that then press ok neigher check those url and retry")
      }
      if (!ans) { geterrorurl(); return; }
      if (ans === undefined || true) {
        setLoading(true)
        const response = await axios({
          url: 'http://localhost:10000/mic/download-inventory', // Replace with your backend URL
          method: 'GET',
          responseType: 'blob', // Important to get the response as a blob (binary data)
        });
        // Create a link element to trigger download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Updated_inventory.xlsx'); // File name
        document.body.appendChild(link);
        link.click();
        link.remove();
        setLoading(false)
      }
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
    await delay(1000)
    autofetch4();
    await delay(1000)
    autofetch5();
    await delay(1000)
    autofetch6();
    await delay(1000)
    autofetch7();
    await delay(1000)
    autofetch8();
  }


  return (

    <div style={{ opacity: loading ? 0.5 : 1, color: loading ? 'black' : null, paddingLeft: '3vw', paddingRight: '3vw' }}>
//       {loading && (
        <div className="loading-overlay">
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      <div>
        <h2>Inventory Updation</h2>
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
          Total updated Product : {data.length} <span onClick={getupdatedproduct}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="ms-4 bi bi-arrow-clockwise" viewBox="0 0 16 16">
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
                    <input className='inputbtn' type="number" placeholder={index1} onChange={(e) => setIndex1(Number(e.target.value))} />
                  </div>

                  <div className="cus_row col-lg-3 col-md-6 col-sm-12 mt-2 mb-2">
                    <h4> {index1}/{Array.isArray(link[0]) && link[0].length}</h4>
                    <div className='ms-4 me-4' style={{ height: 50, width: 50 }}>
                    { Array.isArray(link[0]) && <CircularProgressbar
                        value={(index1 / link[0].length * 100)}
                        text={`${(index1 / link[0].length * 100).toFixed(0)}%`}
                      />};
                    </div>
                    <h4>
                      {speed1} s / URL
                    </h4>
                  </div>

                  <div className="cus_row col-lg-6 col-md-6 col-sm-12 mt-2 mb-2">
                    {urlError1 && <p style={{ color: 'red' }}>Error while fetching this url -</p>}
 <a href={link[0][index1]} target='_blank' style={{ color: urlError1 ? 'red' : 'white' }}>{index1 === link[0].length ? "Completed" : link[0][index1]}</a> </div>

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
                    <a href={link[1][index2]} target='_blank' style={{ color: urlError2 ? 'red' : 'white' }}>{index2 === link[1].length ? "Completed" : link[1][index2]}</a>
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
                    <a href={link[2][index3]} target='_blank' style={{ color: urlError3 ? 'red' : 'white' }}>{index3 === link[2].length ? "Completed" : link[2][index3]}</a>
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
                    <a href={link[3][index4]} target='_blank' style={{ color: urlError4 ? 'red' : 'white' }}>{index4 === link[3].length ? "Completed" : link[3][index4]}</a>
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
                    <a href={link[4][index5]} target='_blank' style={{ color: urlError5 ? 'red' : 'white' }}>{index5 === link[4].length ? "Completed" : link[4][index5]}</a>
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
                    <a href={link[5][index6]} target='_blank' style={{ color: urlError6 ? 'red' : 'white' }}>{index6 === link[5].length ? "Completed" : link[5][index6]}</a>
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
                    <a href={link[6][index7]} target='_blank' style={{ color: urlError7 ? 'red' : 'white' }}>{index7 === link[6].length ? "Completed" : link[6][index7]}</a>
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
                    {urlError8 && <p style={{ color: 'red' }}>Error while fetching this url -</p>}
                    <a href={link[7][index8]} target='_blank' style={{ color: urlError8 ? 'red' : 'white' }}>{index8 === link[7].length ? "Completed" : link[7][index8]}</a>
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
              <div className="thread mt-2 mb-4" style={{ backgroundColor: loading2 ? 'rgb(11 109 91 / 99%)' : 'red', boxShadow: loading2 ? '#000000 8px 3px 55px -17px' : '0' }}>
                <div className="container">
                  <div className="row">
                    <div className="cus_row col-lg-3 col-md-6 col-sm-12 mt-2 mb-2">
                      <button className='startbtn me-3' onClick={autofetcherror}>Start</button>
                      <input className='inputbtn' type="number" placeholder={errorindex} onChange={(e) => seterrorCustomIndex(e.target.value)} />
                      <button className='startbtn ms-3' onClick={seterrorindex} >
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
                      {errurlerr && <p style={{ color: 'blue' }}>Error while fetching this url -</p>}
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
        <Accordion.Item eventKey="2">
          <Accordion.Header>Total Number of Updated Products : &nbsp;&nbsp; <span style={{ color: 'blue' }}>{data.length > 1 ? data.length : 0} </span></Accordion.Header>
          <Accordion.Body>

            <div className="d-flex mb-4  p-2 bg-primary text-white"> Filter Product :
              <button onClick={all} className="text-white p-0 ms-4 me-4" style={{ backgroundColor: 'transparent' }}>All</button>
              <button onClick={priceincrease} className="text-white p-0 ms-4 me-4" style={{ backgroundColor: 'transparent' }}>Price Increased</button>
              <button onClick={pricedecrease} className="text-white p-0 ms-4 me-4" style={{ backgroundColor: 'transparent' }}>Price Decrease</button>
              <button onClick={outofstock} className="text-white p-0 ms-4 me-4" style={{ backgroundColor: 'transparent' }}>Out of Stock </button>
              <button onClick={stock} className="text-white p-0 ms-4 me-4" style={{ backgroundColor: 'transparent' }}>Come Back in Stock </button>
              <button onClick={remain} className="text-white p-0 ms-4 me-4" style={{ backgroundColor: 'transparent' }}>Remaining</button>
              <input onChange={(e) => setNum(e.target.value)} style={{ width: '40px' }} type="number" placeholder={num} /> <span className="ms-2 me-4">Which quantity is less than {num}</span>
              <div>
                <input type="text" value={search} style={{ width: '20vw' }} placeholder="Search Products by ASIN" onChange={(e) => { setSearch(e.target.value), searchproduct() }} />
                <svg onClick={cancelsearch} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="ms-2 mb-1 bi bi-x-circle-fill" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                </svg>

              </div>
              {
                result.length > 0 && result[0].ASIN !== undefined &&
                <div className="result">
                  <Table striped bordered hover className="bg-dark">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Image</th>
                        <th>Input UPC</th>
                        <th>SKU</th>
                        <th>Old Price</th>
                        <th>Current Price</th>
                        <th>Quantity</th>
                        <th>Product URL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.length > 0 && result.map((detailArray, i) => (
                        <tr key={i}>
                          <td>{indexOfFirstItem + i + 1}</td>
                          <td><img src={detailArray['Image link']} alt="" height='40px' /></td>
                          <td>{detailArray['upc']}</td>
                          <td>{detailArray['SKUs']}</td>
                          <td>{detailArray['Product Cost']}</td>
                          <td>{detailArray['Current Price']}</td>
                          <td>{detailArray['quantity']}</td>
                          <td><a href={detailArray['Vendor URL']} target='_blank'>Click to see details</a></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              }
            </div>


            <Table striped bordered hover className="bg-dark">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Image</th>
                  <th>Input UPC</th>
                  <th>SKU</th>
                  <th>Old Price</th>
                  <th>Current Price</th>
                  <th>Quantity</th>
                  <th>Product URL</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 && currentItems.map((detailArray, i) => (
                  <tr key={i}>
                    <td>{indexOfFirstItem + i + 1}</td>
                    <td className='p-0'><img className='productImg' src={detailArray['Image link']} alt="" height='45px' /></td>
                    <td>{detailArray['upc']}</td>
                    <td>{detailArray['SKUs']}</td>
                    <td>{detailArray['Product Cost']}</td>
                    <td>{detailArray['Current Price']}</td>
                    <td>{detailArray['quantity']}</td>
                    <td><a href={detailArray['Vendor URL']} target='_blank'>Click to see details</a></td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Pagination */}
            <Pagination>
              <Pagination.Prev onClick={() => handlePaginationClick(currentPage - 1)} disabled={currentPage === 1} />

              {/* Display page numbers with ellipses if needed */}
              {currentPage > 1 && <Pagination.Item onClick={() => handlePaginationClick(1)}>1</Pagination.Item>}
              {currentPage > 3 && <Pagination.Ellipsis />}
              {paginationRange().map((page) => (
                <Pagination.Item
                  key={page}
                  active={page === currentPage}
                  onClick={() => handlePaginationClick(page)}
                >
                  {page}
                </Pagination.Item>
              ))}
              {currentPage < totalPages - 2 && <Pagination.Ellipsis />}
              {currentPage < totalPages && <Pagination.Item onClick={() => handlePaginationClick(totalPages)}>{totalPages}</Pagination.Item>}

              <Pagination.Next onClick={() => handlePaginationClick(currentPage + 1)} disabled={currentPage === totalPages} />
            </Pagination>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <hr />
      <LineChart width={1600} className="bg-dark p-1 mb-4" height={300} data={data}>
        {/* <CartesianGrid stroke="#ccc" /> */}
        <XAxis dataKey="diff" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="Product Cost" stroke="#1bb353" />
        <Line type="monotone" dataKey="Current Price" stroke="red" />
      </LineChart>
      <Outlet />
    </div>
  );
}

export default Inventory;
