import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function App() {
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

  const [file, setFile] = useState(null);
  const [urlProduct, setUrlProduct] = useState([{}]);
  const [urldetail, setUrldetail] = useState([[]]); // Array of arrays to hold multiple details
  const [url, setUrl] = useState([]);
  const [product, setProduct] = useState([]);
  const [links, setLinks] = useState([]);
  const [noOfUpdatedPr, setNoOfUpdatedPr]= useState(0);
  const [noOfTotalPr,setNoOfTotalPr]=useState(0)

  useEffect(() => {
    getlinks();
  }, []);

  const getlinks = async () => {
    try {
      let result = await fetch('http://localhost:10001/links', {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
      })
      result = await result.json();
      setLinks(result.links[0].url);
      setNoOfTotalPr(result.notp)
    } catch (err) {
      console.log(err)
    }
  };

  // ---search product detail from given url
  const getPrice = async () => {
    try {
      let result = await fetch('http://localhost:10001/price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url })
      });
      result = await result.json();
      setUrldetail(result); // Add result as a new array within urldetail
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  }

  const checkurl = async (url, index) => {
    try {
      let result = await axios.post('http://localhost:10001/checkurl',
        { url: url }, {
        headers: { 'Content-Type': 'application/json' }
      });

      // Axios automatically parses JSON, no need to call `.json()` as in fetch
      setUrldetail((prevDetails) => [...prevDetails, result.data]);
      handleShow();
      document.getElementById(index).style.background = 'green';
      console.log("url detail", urldetail)
    } catch (err) {
      console.log(err);
      document.getElementById(index).style.background = 'red'
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:10001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert(response.data.msg);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    }
  };
  const autofetchData = async (link) => {
    try {
      console.log(link)
      let result = await fetch('http://localhost:10001/autofetchdata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: link })
      })
      result = await result.json();
      if (result) {
        return true
      }
    } catch (err) {
      console.log("error while auto faeching for links")
    }
  }

const getnumberofupdatedpr=async()=>{
  try{
    let result = await fetch('http://localhost:10001/noofupdatedpr', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    result=await result.json();
    setNoOfUpdatedPr(result.noup);
  }catch(err){
    console.log(err)
  }
}

  const autofetch = async () => {
    console.log("autofetch");
    let index = 0;
    const intervalId = setInterval(async () => {
      if (index < links.length) {
        try {
          const result = await autofetchData(links[index]); // Wait for autofetchData to complete
          console.log("Index:", index);
          console.log("Return result:", result);
          if (result === true) {
            index++; // Increase index only if the fetch was successful
            getnumberofupdatedpr()
          }
          // If result is false or undefined, index will remain the same and the function will retry
        } catch (err) {
          console.log("Error during autofetch:", err);
        }
      } else {
        clearInterval(intervalId); // Stop the interval when all links have been processed
      }
    }, 120000); // 1-minute interval
  };

  const getlatestdata = async () => {
    try {
      let result = await fetch('http://localhost:10001/getlatestdata', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      result = await result.json();
      setUrldetail(result);
      handleShow1();
    } catch (err) {
      console.log(err)
    }
  }

  const downloadExcel = async () => {
    try {
      const response = await axios({
        url: 'http://localhost:10001/download-excel', // Replace with your backend URL
        method: 'GET',
        responseType: 'blob', // Important to get the response as a blob (binary data)
      });

      // Create a link element to trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data.xlsx'); // File name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  return (
    <>
      <button onClick={() => getPrice()}>Get Price Data</button>
      <br />
      <p>Product URL</p>
      <input type="text" onChange={(e) => setUrl(e.target.value)} />
      <div></div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>UPC</th>
            <th>New Price</th>
            <th>Old Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <ul style={{ listStyle: 'none' }}>
                {urlProduct.map((u, index) => (
                  <li key={u.upc}>{u.upc}</li>
                ))}
              </ul>
            </td>
            <td>
              <ul style={{ listStyle: 'none' }}>
                {urlProduct.map((u, index) => (
                  <li key={index}>{u.newPrice}</li>
                ))}
              </ul>
            </td>
            <td>
              <ul style={{ listStyle: 'none' }}>
                {urlProduct.map((u, index) => (
                  <li key={index} style={{ color: !u.isChange ? 'red' : 'black' }}>{u.oldPrice}</li>
                ))}
              </ul>
            </td>
          </tr>
        </tbody>
      </Table>

      <hr />
      <div>
        <h2>Upload Excel File</h2>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
          <button type="submit">Upload</button>
        </form>
      </div>
      <br />

      <button onClick={() => checkPrice()}>Check Price</button>

      <div>
        {product.length > 0 ? (
          product.map((p, index) => (
            <div key={index}>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <ul>
                        {p.upc_price.map((pr, idx) => (
                          <li key={idx}>
                            {pr.upc} : {pr.current_price} : {pr.old_price}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p>No product data found</p>
        )}
      </div>

      <div>
        <ol>
          {links.map((link, index) => (
            <li key={index} className='mb-1'>
              {link}
              <Button id={index} className='ms-2' variant="primary" onClick={() => checkurl(link, index)}>
                Check
              </Button>
            </li>
          ))}



        </ol>
      </div>
{/* -------link wise result-------- */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Latest Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {urldetail.length > 0 && urldetail.slice(1).map((detailArray, i) => (
            <Table key={i} striped bordered hover>
              <thead>
                <tr>
                  <th colSpan={2}>{i}</th>
                  <th colSpan={3}>{detailArray.url}</th>
                </tr>
                <tr>
                  <th>Image</th>
                  <th>UPC</th>
                  <th>New Price</th>
                  <th>Old Price</th>
                  <th>Quantity</th>
                  <th>Available</th>
                  <th>Product URL</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(detailArray) && detailArray.map((detail, index) => (

                  <tr key={index}>
                    <td>
                      <img src={detail.imgurl} alt="" height='30px' />
                    </td>
                    <td>{detail.upc}</td>
                    <td>{detail.newPrice}</td>
                    <td style={{ color: Number(detail.oldPrice) !== Number(detail.newPrice) ? 'red' : 'black' }}>
                      {detail.oldPrice}
                    </td>
                    <td style={{ color: detail.quantity < 10 ? 'red' : 'black' }}>
                      {detail.quantity}
                    </td>
                    <td>{detail.available}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ))}

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


      {/* ------all result------ */}
      <Modal show={show1} onHide={handleClose1}>
        <Modal.Header closeButton className='d-flex justify-content-center'>
          <Modal.Title className='me-4 pe-4' style={{borderRight:'3px solid black'}}>Latest Product Details</Modal.Title>
          <Modal.Title>Total Product : {urldetail.length}</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Image</th>
                <th>UPC</th>
                <th>New Price</th>
                <th>Old Price</th>
                <th>Quantity</th>
                <th>Available</th>
                <th>Product URL</th>
              </tr>
            </thead>
            {urldetail.length > 0 && urldetail.map((detailArray, i) => (

              <tbody>

                <tr key={i}>
                  <td style={{ padding: '0 !important' }}>
                    <img src={detailArray.imgurl} alt="" height='40px' />
                  </td>
                  <td>{detailArray.upc}</td>
                  <td>{detailArray.newPrice}</td>
                  <td style={{ color: Number(detailArray.oldPrice) !== Number(detailArray.newPrice) ? 'red' : 'black' }}>
                    {detailArray.oldPrice}
                  </td>
                  <td style={{ color: detailArray.quantity < 10 && detailArray.available=='T' ? 'red' : 'black' }}>
                    {detailArray.quantity}
                  </td>
                  <td>{detailArray.available}</td>
                  <td> <a href={detailArray.url} target='_blank'>{detailArray.url}</a> </td>
                </tr>

              </tbody>

            ))}
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose1}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>





      <Button variant="secondary" className='me-4' onClick={autofetch}>
        Start Auto Fetch
      </Button>
      <Button className='me-4' variant="secondary" onClick={getlatestdata}>
        See All Product updated Details
      </Button>

      <Button variant="secondary" onClick={downloadExcel}>
        Download Excel file
      </Button>
  <h4>{noOfUpdatedPr}</h4>
  <h4>{noOfTotalPr}</h4>

    </>
  );
}

export default App;
