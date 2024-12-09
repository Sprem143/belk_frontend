import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function Brand() {
    const [upc, setUpc] = useState([{}]);
    const [productUrl, setProductUrl] = useState([]);
    const [url, setUrl] = useState('');
    const [num, setNum] = useState(0);
    const [file, setFile] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        getproductslink();
    })

    const getproductslink = async () => {
        let data = await fetch('http://localhost:10000/getproducturl', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        data = await data.json();
        setProductUrl(data.url);
        setUpc(data.upc);
      }

      const fetchbrand = async () => {
        if (num > 0) {
          setLoading(true)
          let result = await fetch('http://localhost:10000/fetchbrand', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, num })
          })
          result = await result.json();
          setLoading(false)
          // scrapproduct()
        } else {
          alert("Please enter number of products on vender website");
          setLoading(false)
        }
      }
    
      const scrapproduct = async () => {
        alert("Your Previous saved data will be deleted");
        setLoading(true);
        let result = await fetch('http://localhost:10000/scrapproduct', {
          method: 'get',
          headers: { 'Content-Type': 'application/json' },
        })
        alert(result);
        setLoading(false);
      }
    
      const downloadExcel = async () => {
        try {
          setLoading(true)
          const response = await axios({
            url: 'http://localhost:10000/download-excel', // Replace with your backend URL
            method: 'GET',
            responseType: 'blob', // Important to get the response as a blob (binary data)
          });
    
          // Create a link element to trigger download
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'Upc_list.xlsx'); // File name
          document.body.appendChild(link);
          link.click();
          link.remove();
          setLoading(false)
        } catch (error) {
          console.error('Error downloading the file:', error);
          setLoading(false)
        }
      };
    
      const handleFileChange = (e) => {
        setFile(e.target.files[0]);
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
          const response = await axios.post('http://localhost:10000/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          setLoading(false)
          alert(response.data);
        } catch (error) {
          console.error('Error uploading file:', error);
          alert('Failed to upload file');
        }
      };
    
      const downloadFinalSheet = async () => {
        try {
          setLoading(true);
          const response = await axios({
            url: 'http://localhost:10000/downloadfinalSheet', // Replace with your backend URL
            method: 'GET',
            responseType: 'blob', // Important to get the response as a blob (binary data)
          });
    
          // Create a link element to trigger download
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'comparison_sheet.xlsx'); // File name
          document.body.appendChild(link);
          link.click();
          link.remove();
          setLoading(false)
        } catch (error) {
          console.error('Error downloading the file:', error);
          setLoading(false)
        }
      }

    return (
        <div style={{ opacity: loading ? 0.5 : 1, color: loading ? 'black' : null, paddingLeft: '3vw', paddingRight: '3vw' }}>
            {loading && ( // Show spinner while loading is true
                <div className="loading-overlay">
                    <Spinner animation="border" variant="primary" /> {/* Spinner from Bootstrap */}
                </div>
            )}

            <p>Brand URL</p>
            <input type="text" onChange={(e) => setUrl(e.target.value)} placeholder='Brand URL' />
            <input type="text" className='ms-3' onChange={(e) => setNum(e.target.value)} placeholder='Number of products' />

            <button className='ms-4' onClick={fetchbrand}>Fetch All product URLs</button>
            <br />
            {/* <input type="text" onChange={(e) => setPurl(e.target.value)} placeholder='Brand URL' /> */}
            <button className='ms-4' onClick={scrapproduct}>Start Scraping UPCs</button>
            <button className='ms-4 mt-4' variant="secondary" onClick={downloadExcel}>
                Download UPC List
            </button>

            <div className='d-flex mt-4'>
                <h2 className='me-4'>Upload UPC List</h2>
                <form onSubmit={handleSubmit}>
                    <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
                    <button className='me-4' type="submit">Upload</button>
                </form>
                <button onClick={downloadFinalSheet}>Download Comparison Sheet</button>

            </div>
            <Accordion className='mt-4'>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Number of Products fetched : {productUrl.length}</Accordion.Header>
                    <Accordion.Body>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Products' url</th>
                                </tr>
                            </thead>
                            {productUrl.length > 0 && productUrl.map((p, i) => (
                                <tbody>
                                    <tr key={i}>
                                        <td style={{ padding: '0 !important' }}>
                                            {i + 1}
                                        </td>
                                        <a style={{ background: 'white !important' }} href={p}>{p}</a>
                                    </tr>
                                </tbody>
                            ))}
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>


                <Accordion.Item eventKey="1">
                    <Accordion.Header>TOtal UPCs list: {upc.length}</Accordion.Header>
                    <Accordion.Body>
                        <Table striped bordered hover>
                            <thead>
                                <tr>

                                    <th>S.No</th>
                                    <th>Product URL</th>
                                </tr>
                            </thead>
                            {upc.length > 0 && upc.map((u, i) => (
                                <tbody>
                                    <tr key={i}>
                                        <td style={{ padding: '0 !important' }}>
                                            {i + 1}
                                        </td>

                                        <td>
                                            <p>{u.url}</p>
                                            <ul>
                                                {u.upc ? u.upc.length > 0 && u.upc.map((p, index) => (
                                                    <li key={index}>{p}</li>
                                                )) : null}
                                            </ul>
                                        </td>

                                    </tr>
                                </tbody>
                            ))}
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <hr />
        </div>
    )
}

