import { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from 'react-bootstrap/Accordion';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function Calculation() {

    const [file, setFile] = useState(null);
    const [noOfProduct, setNoOfProduct] = useState('');
    const [dPrice, setdPrice] = useState([{}]);
    const [iPrice, setiPrice] = useState([{}]);
    const [nPrice, setnPrice] = useState([{}]);
    const [products, setProducts] = useState([{}]);
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(75);
    const [sp, setSp] = useState(30);
    useEffect(() => {
        getfinalsheet();
    }, [])

    const calculate = async () => {
        try {
            setLoading(true);
            let result = await fetch('https://calculate-dkpd.onrender.com/calculation/calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ percentage: percentage, sp: sp })
            })
            result = await result.json();
            setProducts(result.products)
            setiPrice(result.iPrice);
            setdPrice(result.dPrice);
            setnPrice(result.nPrice);
            setNoOfProduct(result.number);
            setLoading(false);
            downloadExcel();
        } catch (err) {
            setLoading(false);
            console.log(err)
        }
    }
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const getfinalsheet = async () => {
        try {
            let result = await fetch('https://calculate-dkpd.onrender.com/calculation/getsheet', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            result = await result.json();
            setProducts(result.products)
            setiPrice(result.iPrice);
            setdPrice(result.dPrice);
            setnPrice(result.nPrice);
            setNoOfProduct(result.number);
        } catch (err) {
            console.log(err)
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        setLoading(true);
        try {
            console.log("function called")
            const response = await axios.post('https://calculate-dkpd.onrender.com/calculation/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.number > 0) {
                calculate();
            }
            setNoOfProduct(response.data.number);
            getfinalsheet();
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error uploading file:', error);
            alert('Failed to upload file');
        }
    };

    // ----------download excel sheet--------------
    const downloadExcel = async () => {
        try {
            setLoading(true);
            const response = await axios({
                url: 'https://calculate-dkpd.onrender.com/calculation/download-excel', // Replace with your backend URL
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
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error downloading the file:', error);
        }
    };


    return (
        <div className='d-flex flex-column p-4' style={{ opacity: loading ? 0.5 : 1, color: loading ? 'black' : null }}>

            <div>
                <h2>Upload Excel File</h2>
                <div className='mt-4 d-flex flex-column align-items-center' >
                    <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
                   <div className="d-flex justify-content-center">
                   <InputGroup className="mb-3 mt-4 me-4" style={{ width: '200px' }}>
                        <InputGroup.Text id="inputGroup-sizing-default">
                            Max Price %
                        </InputGroup.Text>
                        <Form.Control
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                            value={percentage}
                            style={{ width: '60px' }}
                            onChange={(e) => setPercentage(e.target.value)}
                        />
                    </InputGroup>

                    <InputGroup className="mb-3 mt-4" style={{ width: '200px' }}>
                        <InputGroup.Text id="inputGroup-sizing-default">
                            Selling Price %
                        </InputGroup.Text>
                        <Form.Control
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                            value={sp}
                            style={{ width: '60px' }}
                            onChange={(e) => setSp(e.target.value)}
                        />
                    </InputGroup>
                   </div>
                   
                </div>
                <button className='ms-4' onClick={handleSubmit}>Upload</button>
                    <button className='mt-4 ms-4' onClick={downloadExcel}>
                        Download
                    </button>
            </div>




            {/* Display spinner while loading */}
            {loading && ( // Show spinner while loading is true
                <div className="loading-overlay">
                    <Spinner animation="border" variant="primary" />
                </div>
            )}


            <Accordion className='mt-4'>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Number of Product uploaded : {noOfProduct}</Accordion.Header>
                    <Accordion.Body>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    {/* <th>UPC</th> */}
                                    <th>S.No</th>
                                    <th>SKU</th>
                                    <th>Original Cost</th>
                                    <th>Current Cost</th>
                                    <th>Fulfillment</th>
                                    <th>Amazon Fees% </th>
                                    <th>Template</th>
                                    <th>Min Profit</th>
                                    <th>Inventory</th>
                                    <th>T Cost</th>
                                    <th>Max Price</th>
                                    <th>Min Price</th>
                                    <th>Amz. Fee</th>
                                    <th>N profit</th>
                                    <th>Min</th>
                                    <th>Max</th>
                                    <th>s price</th>
                                    <th>S.P-MIN.P</th>
                                    <th>Mx.P-S.P</th>
                                    <th>Diff.</th>
                                </tr>
                            </thead>
                            {products.length > 0 && products.map((p, i) => (
                                <tbody>
                                    <tr key={i}>
                                        <td style={{ padding: '0 !important' }}>
                                            {i + 1}
                                        </td>
                                        <td style={{ padding: '0 !important' }}>
                                            {p.SKU}
                                        </td>
                                        <td> {p['Original Product Cost']}</td>
                                        <td> {p['Current Products Cost']}</td>
                                        <td> {p.Fulfillment}</td>
                                        <td> {p['Amazon Fees%']}</td>
                                        <td> {p['Shipping Template used']}</td>
                                        <td> {p['Min Profit $- Calculations']}</td>
                                        <td> {p['Current Inventory']}</td>
                                        <td> {p['Total Cost']}</td>
                                        <td> {p['Maximum Price']}</td>
                                        <td> {p['Minimum Price']}</td>
                                        <td> {p['Amazon Fee']}</td>
                                        <td> {p['Net Profit']}</td>
                                        <td> {p['Min']}</td>
                                        <td> {p.Max}</td>
                                        <td> {p['Selling Price']}</td>
                                        <td> {p['Selling - Min Price for Checking']}</td>
                                        <td> {p['Max Price - Selling Price']}</td>
                                        <td> {p['Price difference with new-old']}</td>
                                    </tr>
                                </tbody>
                            ))}
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Price Increased: {iPrice.length}</Accordion.Header>
                    <Accordion.Body>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    {/* <th>UPC</th> */}
                                    <th>S.No</th>
                                    <th>SKU</th>
                                    <th>Original Cost</th>
                                    <th>Current Cost</th>
                                    <th>Fulfillment</th>
                                    <th>Amazon Fees% </th>
                                    <th>Template</th>
                                    <th>Min Profit</th>
                                    <th>Inventory</th>
                                    <th>T Cost</th>
                                    <th>Max Price</th>
                                    <th>Min Price</th>
                                    <th>Amz. Fee</th>
                                    <th>N profit</th>
                                    <th>Min</th>
                                    <th>Max</th>
                                    <th>s price</th>
                                    <th>S.P-MIN.P</th>
                                    <th>Mx.P-S.P</th>
                                    <th>Diff.</th>
                                </tr>
                            </thead>
                            {iPrice.length > 0 && iPrice.map((p, i) => (
                                <tbody>
                                    <tr key={i}>
                                        <td style={{ padding: '0 !important' }}>
                                            {i + 1}
                                        </td>
                                        <td style={{ padding: '0 !important' }}>
                                            {p.SKU}
                                        </td>
                                        <td> {p['Original Product Cost']}</td>
                                        <td> {p['Current Products Cost']}</td>
                                        <td> {p.Fulfillment}</td>
                                        <td> {p['Amazon Fees%']}</td>
                                        <td> {p['Shipping Template used']}</td>
                                        <td> {p['Min Profit $- Calculations']}</td>
                                        <td> {p['Current Inventory']}</td>
                                        <td> {p['Total Cost']}</td>
                                        <td> {p['Maximum Price']}</td>
                                        <td> {p['Minimum Price']}</td>
                                        <td> {p['Amazon Fee']}</td>
                                        <td> {p['Net Profit']}</td>
                                        <td> {p['Min']}</td>
                                        <td> {p.Max}</td>
                                        <td> {p['Selling Price']}</td>
                                        <td> {p['Selling - Min Price for Checking']}</td>
                                        <td> {p['Max Price - Selling Price']}</td>
                                        <td> {p['Price difference with new-old']}</td>
                                    </tr>
                                </tbody>
                            ))}
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                    <Accordion.Header>Price Decreased: {dPrice.length}</Accordion.Header>
                    <Accordion.Body>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    {/* <th>UPC</th> */}
                                    <th>S.No</th>
                                    <th>SKU</th>
                                    <th>Original Cost</th>
                                    <th>Current Cost</th>
                                    <th>Fulfillment</th>
                                    <th>Amazon Fees% </th>
                                    <th>Template</th>
                                    <th>Min Profit</th>
                                    <th>Inventory</th>
                                    <th>T Cost</th>
                                    <th>Max Price</th>
                                    <th>Min Price</th>
                                    <th>Amz. Fee</th>
                                    <th>N profit</th>
                                    <th>Min</th>
                                    <th>Max</th>
                                    <th>s price</th>
                                    <th>S.P-MIN.P</th>
                                    <th>Mx.P-S.P</th>
                                    <th>Diff.</th>
                                </tr>
                            </thead>
                            {dPrice.length > 0 && dPrice.map((p, i) => (
                                <tbody>
                                    <tr key={i}>
                                        <td style={{ padding: '0 !important' }}>
                                            {i + 1}
                                        </td>
                                        <td style={{ padding: '0 !important' }}>
                                            {p.SKU}
                                        </td>
                                        <td> {p['Original Product Cost']}</td>
                                        <td> {p['Current Products Cost']}</td>
                                        <td> {p.Fulfillment}</td>
                                        <td> {p['Amazon Fees%']}</td>
                                        <td> {p['Shipping Template used']}</td>
                                        <td> {p['Min Profit $- Calculations']}</td>
                                        <td> {p['Current Inventory']}</td>
                                        <td> {p['Total Cost']}</td>
                                        <td> {p['Maximum Price']}</td>
                                        <td> {p['Minimum Price']}</td>
                                        <td> {p['Amazon Fee']}</td>
                                        <td> {p['Net Profit']}</td>
                                        <td> {p['Min']}</td>
                                        <td> {p.Max}</td>
                                        <td> {p['Selling Price']}</td>
                                        <td> {p['Selling - Min Price for Checking']}</td>
                                        <td> {p['Max Price - Selling Price']}</td>
                                        <td> {p['Price difference with new-old']}</td>
                                    </tr>
                                </tbody>
                            ))}
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                    <Accordion.Header>Price didn't changes: {nPrice.length}</Accordion.Header>
                    <Accordion.Body>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    {/* <th>UPC</th> */}
                                    <th>S.No</th>
                                    <th>SKU</th>
                                    <th>Original Cost</th>
                                    <th>Current Cost</th>
                                    <th>Fulfillment</th>
                                    <th>Amazon Fees% </th>
                                    <th>Template</th>
                                    <th>Min Profit</th>
                                    <th>Inventory</th>
                                    <th>T Cost</th>
                                    <th>Max Price</th>
                                    <th>Min Price</th>
                                    <th>Amz. Fee</th>
                                    <th>N profit</th>
                                    <th>Min</th>
                                    <th>Max</th>
                                    <th>s price</th>
                                    <th>S.P-MIN.P</th>
                                    <th>Mx.P-S.P</th>
                                    <th>Diff.</th>
                                </tr>
                            </thead>
                            {nPrice.length > 0 && nPrice.map((p, i) => (
                                <tbody>
                                    <tr key={i}>
                                        <td style={{ padding: '0 !important' }}>
                                            {i + 1}
                                        </td>
                                        <td style={{ padding: '0 !important' }}>
                                            {p.SKU}
                                        </td>
                                        <td> {p['Original Product Cost']}</td>
                                        <td> {p['Current Products Cost']}</td>
                                        <td> {p.Fulfillment}</td>
                                        <td> {p['Amazon Fees%']}</td>
                                        <td> {p['Shipping Template used']}</td>
                                        <td> {p['Min Profit $- Calculations']}</td>
                                        <td> {p['Current Inventory']}</td>
                                        <td> {p['Total Cost']}</td>
                                        <td> {p['Maximum Price']}</td>
                                        <td> {p['Minimum Price']}</td>
                                        <td> {p['Amazon Fee']}</td>
                                        <td> {p['Net Profit']}</td>
                                        <td> {p['Min']}</td>
                                        <td> {p.Max}</td>
                                        <td> {p['Selling Price']}</td>
                                        <td> {p['Selling - Min Price for Checking']}</td>
                                        <td> {p['Max Price - Selling Price']}</td>
                                        <td> {p['Price difference with new-old']}</td>
                                    </tr>
                                </tbody>
                            ))}
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

        </div>
    )
}

export default Calculation;
