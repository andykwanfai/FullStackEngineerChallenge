import React, { useState, useEffect } from 'react';
import { Container, Button, Form, FormGroup, Label, Input } from 'reactstrap'
import axios from "axios"
import { Redirect } from "react-router-dom";

function Login() {
  // let history = useHistory();
  // const classes = useStyles();
  const [login, setLogin] = useState({ username: '', password: '' })

  const handleChange = (e) => {
    let newValue = Object.assign({}, login)
    newValue[e.target.name] = e.target.value
    setLogin(newValue)
  }

  const handleSubmit = event => {
    event.preventDefault();
    axios({
      method: 'POST',
      url: '/api/login',
      data: login,
    }).then(response => {
      if (response.status === 200) {
        sessionStorage.setItem("isAuth", true)
        sessionStorage.setItem("user", JSON.stringify(response.data))
        window.location = '/'
      }
    })
  }

  if (sessionStorage.getItem('user')) {
    return <Redirect from="/login" to="/" />
  }
  else {
    return (
      <Container>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for='username'>Username</Label>
            <Input name='username' value={login.username} onChange={e => handleChange(e)} placeholder="Username" />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" value={login.password} onChange={e => handleChange(e)} name="password" placeholder="Password" />
          </FormGroup>
          <Button>Submit</Button>
        </Form>
      </Container>
    )
  }
}


export default Login