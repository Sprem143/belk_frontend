import { useEffect, useState } from "react";
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import * as XLSX from 'xlsx';
import Spinner from 'react-bootstrap/Spinner';


export default function Backup() {

  const [loading, setLoading]=useState(false)
  const [data, setData] = useState([{}]);
  const [backup, setBackup] = useState([{}]);
  const [search, setSearch] = useState(null);
  const [result, setResult] = useState([{}]);
  const [name,setName]=useState('');
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getbackup();
  }, [])


  const searchproduct = () => {
    setResult([{}])
    if (search !== null) {
      new Promise(resolve => setTimeout(resolve, 1000))
      const sr = data.filter((d) => d.ASIN.toLowerCase().includes(search.toLowerCase()) || d['Input UPC'].toLowerCase().includes(search.toLowerCase()))
      setResult(sr);
    }
  }

  const cancelsearch = () => {
    setResult([{}]);
    setSearch(null)
  }

  const setbackupdata = (name) => {
    let bd = backup.filter((b) => b.name == name)
    setData(bd[0].data);
    setName(bd[0].name)

  }
  
  const getbackup = async () => {
    let backup = await fetch('http://localhost:10000/analysis/getbackup', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    backup = await backup.json();
    setBackup(backup);
    setData(backup[backup.length-1].data);
    setName(backup[backup.length-1].name)
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

  const handleDownload = (data) => {
    const jsondata = data.data.map((item) => {
        return {
            'Input UPC': item['Input UPC'],
            ASIN: item['ASIN'],
            'Amazon link': item['Amazon link'],
            SKU: item['SKU'],
            'Image link': item['Image link'],
            'Available Quantity': item['Available Quantity'],
            'Product price': item['Product price'],
            'Product link': item['Product link'],
            'Fulfillment': item['Fulfillment'],
            'Amazon Fees%': item['Amazon Fees%'],
            'Shipping Template': item['Shipping Template'],
            'Min Profit': item['Min Profit'],
            'Current Price': item['Current Price'],
            'Current Quantity': item['Current Quantity']
        }
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(jsondata);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const excelFile = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelFile], { type: 'application/octet-stream' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'backup.xlsx'; // Set the file name
    link.click(); // Trigger the download
  };

  const deletebackup=async(name)=>{
try{
  setLoading(true)
let res= await fetch('http://localhost:10000/deletebackup',{
    method:'DELETE',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({name})
});
res=await res.json();
if(res.status){
    window.location.reload();
}

}catch(err){
    console.log(err);
    alert('Error while deleting');
    setLoading(false)
}
  }

  return (
    <div className="bg-dark ps-4 pe-4" style={{opacity: loading ? 0.5 : 1, color: loading ? 'black' : null, marginTop: '-17px', paddingTop: '17px', minHeight: '1200px' }}>
         {loading && ( // Show spinner while loading is true
        <div className="loading-overlay">
          <Spinner animation="border" variant="primary" /> {/* Spinner from Bootstrap */}
        </div>
      )}
      <h1 className="fw mb-4">Welcome to analysis page</h1>
      <Accordion className="mb-4" defaultActiveKey={'0'}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Total Number of Product in &nbsp; <span style={{fontWeight:'bolder'}}> {name} </span> &nbsp;: &nbsp;&nbsp; <span style={{ color: 'blue' }}>{data.length > 1 ? data.length : 0} </span></Accordion.Header>
          <Accordion.Body>

            <div className="d-flex mb-4  p-2 bg-primary text-white"> 
              <div>
               Search Products :  <input type="text" value={search} style={{ width: '20vw' }} placeholder="Search Products by ASIN" onChange={(e) => { setSearch(e.target.value), searchproduct() }} />
                <svg onClick={cancelsearch} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="me-4 ms-2 mb-1 bi bi-x-circle-fill" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                </svg>
                ( Press space key after paste word)
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
                    <td><img src={detailArray['Image link']} alt="img" height='40px' /></td>
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
                    <td><img src={detailArray['Image link']} alt="img" height='40px' /></td>
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
      <h1 className="fw mb-4 mt-4">Back Up Files</h1>
      <ul style={{ width: '49vw' }}>
        {
          backup.map((b) => (
            <li key={b._id} style={{ color: 'white' }} className="m-2">{b.name} - ({b.data ? b.data.length : 0} Products)  
            <button className="ms-4 p-0 ps-1 pe-1" onClick={() => setbackupdata(b.name)}>See details</button>
             <button onClick={()=>handleDownload(b)} className="ms-4 p-0 ps-1 pe-1 me-4">Download</button>
              <button className="p-0" style={{ backgroundColor: 'transparent' }} onClick={()=>{
                deletebackup(b.name)
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1h-4a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1l1 8a2.5 2.5 0 0 0 2.5 2h5a2.5 2.5 0 0 0 2.5-2l1-8h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-4z" />
              </svg>
            </button></li>
          ))
        }
      </ul>
    
    </div>
  )
}
