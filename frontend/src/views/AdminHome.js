import React, { useState, useEffect } from 'react';
import {
  ListGroup, ListGroupItem, Card, CardTitle, Button, Col, Row, Container,
  Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Label, Input
} from 'reactstrap'
import axios from "axios"
import { Redirect } from "react-router-dom";

const AdminHome = (props) => {
  const [employees, setEmployees] = useState([])
  const [modal, setModal] = useState({ review: false, feedback: false });
  const [currentEmployee, setCurrentEmployee] = useState(0);
  const [review, setReview] = useState("");
  const [assignFeedback, setAssignFeedback] = useState("");
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    async function getEmployees() {
      try {
        const response = await axios({
          method: 'get',
          url: '/api/users',
          // params: { team: team }
        })
        setEmployees(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    getEmployees()
  }, [refresh])


  const toggle = (modalName) => {
    let newModal = Object.assign({}, modal)
    newModal[modalName] = !newModal[modalName]
    setModal(newModal);
    //clear review input after open or close modal
    setReview("")
    setAssignFeedback("")
  }

  const submitReview = () => {
    try {
      axios({
        method: 'post',
        url: '/api/reviews',
        data: {
          fullname: employees[currentEmployee].fullname,
          username: employees[currentEmployee].username,
          content: review,
          submittedBy: JSON.parse(sessionStorage.user).username
        }
      })
      //toggle refresh after successfully submit review to trigger reload employees data
      setRefresh(!refresh)
    } catch (error) {
      console.log(error)
    }
  }

  const submitAssignFeedback = () => {
    let reviews = employees[currentEmployee].reviews
    if (reviews.length > 0) {
      //hardcode index 0 for now, assuming one employee only has one review
      let review = reviews[0]
      //check the review has feedback or not, if no, create the attribute as an empty array
      if (!review.feedbacks) {
        review.feedbacks = []
      }
      review.feedbacks.push({
        username: employees[currentEmployee].username,
        status: "pending",
        assignTo: assignFeedback
      })
    }
    try {
      axios({
        method: 'post',
        url: '/api/feedbacks',
        data: reviews[0]
      })
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <Container style={{ maxWidth: "800px" }}>
      <Card>
        <CardTitle>All Employees</CardTitle>
        <ListGroup>
          {
            employees.map((employee, index) => {
              return <ListGroupItem key={employee.username}>
                <Row>
                  <Col>{employee.fullname}</Col>
                  <Col><Button
                    onClick={e => {
                      toggle("review")
                      setCurrentEmployee(index)
                    }}>
                    {employee.reviews.length > 0 ? "Check Review" : "Add Review"}</Button></Col>
                  <Col><Button
                    disabled={employee.reviews.length > 0 ? false : true}
                    onClick={e => {
                      toggle("feedback")
                      setCurrentEmployee(index)
                    }}>
                    Assign Feedback</Button></Col>
                </Row>
              </ListGroupItem>
            })
          }
        </ListGroup>
      </Card>

      {//performance review modal
      }
      <Modal isOpen={modal["review"]} toggle={e => toggle("review")} >
        <ModalHeader toggle={e => toggle("review")}>Performance Review</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="review">Review:</Label>
            {//check if there is review in the employee, if no review, render textarea for input
              employees.length > 0 && employees[currentEmployee].reviews.length > 0 ? (
                <div>{employees[currentEmployee].reviews.map(review => (<p>{review.content}</p>))}</div>
              )
                : (<Input type="textarea" name="text" id="review"
                  value={review} onChange={e => setReview(e.target.value)}
                />)
            }
          </FormGroup>
        </ModalBody>
        {//if there is review in the employee, render submit button
          employees.length > 0 && employees[currentEmployee].reviews.length > 0 ? (
            ""
          ) : (
              <ModalFooter>
                <Button color="primary"
                  onClick={e => {
                    submitReview(e)
                    toggle("review")
                  }}
                >
                  Submit</Button>
              </ModalFooter>)
        }
      </Modal>

      {//assign feedback modal
      }
      <Modal isOpen={modal["feedback"]} toggle={e => toggle("feedback")} >
        <ModalHeader toggle={e => toggle("feedback")}>Assign Employee to give Feedback</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="assignFeedback">Select</Label>
            <Input type="select" name="select" id="assignFeedback"
              value={assignFeedback}
              onChange={e => setAssignFeedback(e.target.value)}
            >
              <option></option>
              {//render the list of employees for assigning feedback
                employees.map(e => {
                  //the employee cannot submit feedback for himself, do not render the selected employee in dropdown list
                  if (e.username !== employees[currentEmployee].username) {
                    return <option value={e.username}>{e.fullname}</option>
                  }
                })
              }
            </Input>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary"
            onClick={e => {
              submitAssignFeedback(e)
              toggle("feedback")
            }}
          >
            Submit</Button>
        </ModalFooter>
      </Modal>
    </Container>

  );

}

export default AdminHome;