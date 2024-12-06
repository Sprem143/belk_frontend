import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link, Outlet } from 'react-router-dom';
function Header() {
  return (
    <>
      {['lg'].map((expand) => (
        <Navbar key={expand} expand={expand} bg="dark" data-bs-theme="dark" className="bg-body-tertiary mb-3 ps-4 pe-4">
          <Container fluid>
            <Navbar.Brand href="/" className='fs-3'><img src="/static/gstar.png" height={60} alt="logo" className='me-4' />Gstar Tool</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  Gstar <E-solution></E-solution>                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link href="/" style={{ color: 'white' }} className='fs-6'>Inventory update</Nav.Link>
                  <Nav.Link href="/analysis" style={{ color: 'white' }} className='fs-6'>Analysis</Nav.Link>
                  <Nav.Link href="/rowdata" style={{ color: 'white' }} className='fs-6'>Uploaded-Data</Nav.Link>
                  <Nav.Link href="/calculation" style={{ color: 'white' }} className='fs-6'>Calculation</Nav.Link>
                  <Nav.Link href="/inventory" style={{ color: 'white' }} className='fs-6'>Manual update</Nav.Link>
                  <Nav.Link href="brand" style={{ color: 'white' }} className='fs-6'>Brand Scrapping</Nav.Link>
                  <Nav.Link href="/backup" style={{ color: 'white' }} className='fs-6'>Backup</Nav.Link>
                </Nav>

              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
      <Outlet />
    </>
  );
}

export default Header;