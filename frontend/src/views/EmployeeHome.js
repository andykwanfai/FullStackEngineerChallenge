import React, { useState, useEffect } from 'react';
import {
  ListGroup, ListGroupItem, Card, CardTitle, Button, Col, Row, Container,
  Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Label, Input
} from 'reactstrap'
import axios from "axios"

const EmployeeHome = (props) => {
  const [pendingReviews, setPendingReviews] = useState([])
  const [modal, setModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [currentReview, setCurrentReview] = useState(0);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    async function getPendingReviews() {
      try {
        const username = JSON.parse(sessionStorage.user).username
        const response = await axios({
          method: 'get',
          url: '/api/feedbacks/' + username,
          // params: { username: JSON.parse(sessionStorage.user).username }
        })
        setPendingReviews(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    getPendingReviews()
  }, [refresh])

  const submitFeedback = () => {
    //search the pending feedback
    const feedbackIndex = pendingReviews[currentReview].feedbacks.findIndex(e => {
      return e.status === "pending" && e.assignTo === JSON.parse(sessionStorage.user).username
    })

    let newReview = Object.assign({}, ...pendingReviews)

    newReview.feedbacks[feedbackIndex].content = feedback
    newReview.feedbacks[feedbackIndex].status = "submitted"
    // console.log(newReview)
    try {
      axios({
        method: 'post',
        url: '/api/reviews',
        data: newReview
      })
      //toggle refresh after successfully submit review to trigger reload employees data
      setRefresh(!refresh)
    } catch (error) {
      console.log(error)
    }
  }

  const toggle = () => {
    setModal(!modal);
    //clear review input after open or close modal
    setFeedback("")
  }

  return (
    <Container style={{ maxWidth: "800px" }}>
      <Card>
        <CardTitle>All Pending Feedbacks</CardTitle>
        <ListGroup>
          {
            pendingReviews.map((e, index) => {
              return <ListGroupItem key={e.username}>
                <Row>
                  <Col>{e.fullname}</Col>
                  <Col><Button
                    onClick={e => {
                      toggle()
                      setCurrentReview(index)
                    }}>
                    Submit Feedback</Button></Col>
                </Row>
              </ListGroupItem>
            })
          }
          {
            pendingReviews.length === 0 &&
            <div>No pending feedback</div>
          }
        </ListGroup>
      </Card>
      {//performance review modal
      }
      <Modal isOpen={modal} toggle={toggle} >
        <ModalHeader toggle={toggle}>Submit Feedback</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="review">Review:</Label>
            {
              pendingReviews.length > 0 &&
              <p>{pendingReviews[currentReview].content}</p>
            }
          </FormGroup>
          <FormGroup>
            <Label for="feedback">Feedback:</Label>
            <Input type="textarea" name="text" id="feedback"
              value={feedback} onChange={e => setFeedback(e.target.value)}
            />
          </FormGroup>
          <Button color="primary"
            onClick={e => {
              submitFeedback(e)
              toggle("review")
            }}
          >
            Submit</Button>
          {
            pendingReviews.length > 0 &&
            pendingReviews[currentReview].feedbacks.map((e, index) => {
              //display the feedback of other employees
              if (e.assignTo !== JSON.parse(sessionStorage.user).username && e.status != "pending") {
                return <div>
                  <h5>From: {e.assignTo}</h5>
                  <p>{e.content}</p>
                </div>
              }
            })
          }
        </ModalBody>
      </Modal>
    </Container>
  )

}

export default EmployeeHome;