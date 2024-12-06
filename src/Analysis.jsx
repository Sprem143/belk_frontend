import { useEffect, useState } from "react";
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import { Spinner } from "react-bootstrap";
import Pagination from 'react-bootstrap/Pagination';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

export default function Analysis() {
  const [loading, setLoading]=useState(false)
  const [data, setData] = useState([{}]);
  const [realData, setRealData] = useState([{}])
  const [num, setNum] = useState(7);
  const [newData,setNewData]=useState([{}]);
  const [iprice,setiprice]=useState(0);
  const [dprice,setdprice]=useState(0);
  const [oos,setoos]=useState(0);
  const [na,setna]=useState(0);

  const [search, setSearch] = useState(null);
  const [result, setResult] = useState([{}]);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getdata();
  }, [])


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
    const ip = realData.filter((d) => d['Current Price'] > d['Product price']);
    setData(ip)
  }

  const pricedecrease = () => {
    const ip = realData.filter((d) => d['Current Price'] < d['Product price']);
    setData(ip)
  }

  const outofstock = () => {
    const ip = realData.filter((d) => d['Current Quantity'] < num);
    setData(ip)
  }

  const all = () => {
    setData(realData)
  }

  const getdata = async () => {
    setLoading(true)
    let data = await fetch('https://brand-b-1.onrender.com/analysis/getdata', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    data = await data.json();
    setLoading(false)
    const uniqueProducts = data.filter((product, index, self) => 
      index === self.findIndex(p => p['Input UPC'] === product['Input UPC'])
    );
    setData(uniqueProducts);
    setRealData(uniqueProducts);
    let newdata= data.map((d)=> {
      return {
        ...d,
        diff: (d['Current Price']-d['Product price']).toFixed(2)
      }
    })
    setNewData(newdata);
    let i= uniqueProducts.filter((d)=>d['Current Price'].toFixed(2)>d['Product price'].toFixed(2));
    setiprice(i.length);
    let d=uniqueProducts.filter((d)=>d['Current Price'].toFixed(2)<d['Product price'].toFixed(2));
    setdprice(d.length);
    let o= uniqueProducts.filter((d)=>d['quantity']<10);
    setoos(o.length)
    let n=uniqueProducts.filter((d)=>d['Current Price'].toFixed(2)==d['Product price'].toFixed(2));
    setna(n.length);
  }



  // Pagination calculation for displaying the current page's data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

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

  return (
<div style={{ opacity: loading ? 0.5 : 1, color: loading ? 'black' : null, paddingLeft: '3vw', paddingRight: '3vw' }}>
      {loading && ( // Show spinner while loading is true
        <div className="loading-overlay">
          <Spinner animation="border" variant="primary" /> {/* Spinner from Bootstrap */}
        </div>
      )}      <h1 className="mb-4">Quick Data Analysis</h1>
      <Accordion className="mb-4" defaultActiveKey={'0'}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Total Number of Updated Products : &nbsp;&nbsp; <span style={{ color: 'blue' }}>{data.length > 1 ? data.length : 0} </span></Accordion.Header>
          <Accordion.Body>

            <div className="d-flex mb-4  p-2 bg-primary text-white"> Filter Product :  <button onClick={all} className="text-white p-0 ms-4 me-4" style={{ backgroundColor: 'transparent', border:'none' }}>All</button> <button onClick={priceincrease} className="text-white p-0 ms-4 me-4" style={{ backgroundColor: 'transparent' , border:'none'}}>Price Increased</button> 
             <button onClick={pricedecrease} className="text-white p-0 ms-4 me-4" style={{ backgroundColor: 'transparent', border:'none'}}>Price Decrease</button>
              <button onClick={outofstock} className="text-white p-0 ms-4 me-4" style={{ backgroundColor: 'transparent',border:'none' }}>Out of Stock </button> <input onChange={(e) => setNum(e.target.value)} style={{ width: '40px' }} type="number" placeholder={num} /> <span className="ms-2 me-4">Which quantity is less than {num}</span>
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
                  <th>ASIN</th>
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
                    <td>{detailArray['Input UPC']}</td>
                    <td>{detailArray['ASIN']}</td>
                    <td>{detailArray['SKU']}</td>
                    <td>{detailArray['Product price']}</td>
                    <td>{detailArray['Current Price']}</td>
                    <td>{detailArray['Current Quantity']}</td>
                    <td><a href={detailArray['Product link']} target='_blank'>Click to see details</a></td>
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
                  <th>ASIN</th>
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
                    <td><img src={detailArray['Image link']} alt="" height='40px' /></td>
                    <td>{detailArray['Input UPC']}</td>
                    <td>{detailArray['ASIN']}</td>
                    <td>{detailArray['SKU']}</td>
                    <td>{detailArray['Product price']}</td>
                    <td>{detailArray['Current Price']}</td>
                    <td>{detailArray['Current Quantity']}</td>
                    <td><a href={detailArray['Product link']} target='_blank'>Click to see details</a></td>
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
        {/* Repeat similar structure for other Accordions */}
      </Accordion>

      {/* Back Up Files Section */}
<h3>Comparative Price Insights</h3>
<div className="d-flex">
  <div className="me-4">Current Price : <span className="text-danger">Red</span> <span style={{height:'15px', width:'20px', backgroundColor:'red'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> </div>
  <div className="me-4">Old Price : <span style={{color:'#1bb353'}}>Red</span> <span style={{height:'15px', backgroundColor:'#1bb353'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> </div>
  <p className="me-4">Price Increased : {iprice} 
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="red" className="ms-2 bi bi-graph-up-arrow" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5"/>
</svg></p>
  <p className="me-4">Price Decreased : {dprice}
     <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="#1bb353" className="ms-2 bi bi-graph-down-arrow" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M0 0h1v15h15v1H0zm10 11.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-1 0v2.6l-3.613-4.417a.5.5 0 0 0-.74-.037L7.06 8.233 3.404 3.206a.5.5 0 0 0-.808.588l4 5.5a.5.5 0 0 0 .758.06l2.609-2.61L13.445 11H10.5a.5.5 0 0 0-.5.5"/>
</svg></p>
  <p className="me-4">Out of stock(less than 10) : {oos} 
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" className="ms-2 bi bi-cart-x-fill" viewBox="0 0 16 16">
  <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7.354 5.646 8.5 6.793l1.146-1.147a.5.5 0 0 1 .708.708L9.207 7.5l1.147 1.146a.5.5 0 0 1-.708.708L8.5 8.207 7.354 9.354a.5.5 0 1 1-.708-.708L7.793 7.5 6.646 6.354a.5.5 0 1 1 .708-.708"/>
</svg></p>
<p>No price Change : {na}</p>
</div>
<p></p>
      <LineChart width={1600} className="bg-dark p-1" height={300} data={newData}>
      {/* <CartesianGrid stroke="#ccc" /> */}
      <XAxis dataKey="diff" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="Product price" stroke="#1bb353" />
      <Line type="monotone" dataKey="Current Price" stroke="red" />
    </LineChart>
     
    </div>
  )
}
