import React from 'react'
import { Button, Navbar, Card } from "react-bootstrap";
import { useRouteMatch } from 'react-router-dom';

// rfc
function LogInPage() {
    let { path, url, location } = useRouteMatch();
    console.log(location);
    return (
        <div>
            <Navbar bg="light" variant="light">
                <Navbar.Brand>Siri Cloud</Navbar.Brand>
            </Navbar>

            <Card style={{ width: '20rem', margin: "300px", justifyContent: "left"}}>
                <Card.Header>Welcome to Siri Cloud</Card.Header>
                <Card.Body>
                    <Card.Text></Card.Text>
                    <Button  variant="primary" href="https://cmpe281siri.auth.us-west-1.amazoncognito.com/login?client_id=i2r4bvb6ektuud48bj2gu0hr5&response_type=token&redirect_uri=https://saraswati.app/">
                        LogIn / SignUp  {/* <a href="https://cmpe281siri.auth.us-west-1.amazoncognito.com/login?client_id=i2r4bvb6ektuud48bj2gu0hr5&response_type=token&redirect_uri=https://saraswati.app"> LOGIN</a> */}
                    </Button>
                </Card.Body>
            </Card>

        </div>

    )
}

export default LogInPage
