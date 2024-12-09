import { useEffect, useState } from "react";
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';

export default function Rowdata() {
  const [data, setData] = useState([{}]);
  const [realData, setRealData] = useState([{}])
  const [num, setNum] = useState(7)
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState(null);
  const [result, setResult] = useState([{}]);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getrowdata();
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



  const getrowdata = async () => {
    let data = await fetch('http://localhost:10000/analysis/getrowdata', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    data = await data.json();
    setData(data)
    console.log(data[0])
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
    <div className="bg-dark ps-4 pe-4" style={{ marginTop: '-17px', paddingTop: '17px', minHeight: '1200px' }}>
      <h1 className="fw mb-4">Uploaded Data</h1>
      <Accordion className="mb-4" defaultActiveKey={'0'}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Total Number of Uploaded Products : &nbsp;&nbsp; <span style={{ color: 'blue' }}>{data.length > 1 ? data.length : 0} </span></Accordion.Header>
          <Accordion.Body>

            <div className="d-flex mb-4  p-2 bg-primary text-white">
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
                  <th>Input UPC</th>
                  <th>ASIN</th>
                  <th>SKU</th>
                  <th>Old Price</th>
                  <th>Product URL</th>
                </tr>
              </thead>
              <tbody>
                {result.length > 0 && result.map((detailArray, i) => (
                  <tr key={i}>
                    <td>{indexOfFirstItem + i + 1}</td>
                    <td>{detailArray['Input UPC']}</td>
                    <td>{detailArray['ASIN']}</td>
                    <td>{detailArray['SKU']}</td>
                    <td>{detailArray['Product price']}</td>
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
                  <th>Input UPC</th>
                  <th>ASIN</th>
                  <th>SKU</th>
                  <th>Old Price</th>
                  <th>Product URL</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 && currentItems.map((detailArray, i) => (
                  <tr key={i}>
                    <td>{indexOfFirstItem + i + 1}</td>
                    <td>{detailArray['Input UPC']}</td>
                    <td>{detailArray['ASIN']}</td>
                    <td>{detailArray['SKU']}</td>
                    <td>{detailArray['Product price']}</td>
                   
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
    </div>
  )
}
