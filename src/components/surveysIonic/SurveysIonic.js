import React from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Timer from "./Timer.js";
import * as Commons from '../../commons.js';
import * as Constants from '../../constants';
import '../loader/LoadingSpinnerComponent.css';
import proxima_arrow from '../../images/proxima_red_great_arrow.png'
import { ToastContainer, toast } from 'react-toastify';
import { IonButton, IonCard, IonCardContent } from '@ionic/react';
import './SurveysIonic.css';

class SurveysIonic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            surveyReplyId: 0,
            currentSlide: 0,
            questions: [],
            questionsDiv: [],
            survey: "",
            timer: "",
            surveyLoading: true,
            errore: false,
            buttonReady: false,
            formatTimer: "",
            shouldRenderTime: false,
            idUpdate: "",
            errorMessage: "",
        };
    }

    componentDidMount() {
        // const queryParameters = new URLSearchParams(window.location.search)
        // const tokenId = queryParameters.get("tokenId")
        // console.log(tokenId)

        // const hashParameters = new URLSearchParams(window.location.hash.substring(10))
        // const tokenId = hashParameters.get("tokenId")
        // console.log(tokenId)

        const hashString = window.location.hash.slice(1);
        const url = new URL(hashString, window.location.href);
        const tokenId = url.searchParams.get("tokenId");
        console.log(tokenId);

        Commons.executeFetchWithHeader(Constants.FULL_QUESTIONCANDIDATE_API_URI + tokenId, 'GET', {
            'Content-Type': 'application/json'
        }, this.successFetch, this.unSuccessFetch)

        // fetch(Environment.APPLICATION_BACKEND_PREFIX_URL + 'survey/getSurveyForCandidate/' + tokenId).then(response => response.json())
        //     .then(responseData => {
        //         this.setState({
        //             questions: responseData.questions,
        //             survey: responseData,
        //             timer: responseData.time * 60,
        //             surveyLoading: false
        //         })
        //     })
        //     .catch(err => {
        //         console.error(err)
        //         window.alert(`Error loading survey: ${err.message}`)
        //         this.setState({ error: true, surveyLoading: false })
        //     });
    }

    successFetch = (responseData) => {
        if (responseData.expiredToken != null) {
            this.setState({ error: true, surveyLoading: false, errorMessage: responseData.expiredToken })
        } else {
            this.setState({
                questions: responseData.questions,
                survey: responseData,
                timer: responseData.time * 60,
                surveyLoading: false
            })
        }
    }

    // unSuccessFetch = (error) => {
    //     this.setState({ error: true, surveyLoading: false })
    //     toast.error(error.status, {
    //         position: toast.POSITION.BOTTOM_LEFT,
    //     });
    // }

    unSuccessFetch = (responseData) => {
        this.setState({ error: true, surveyLoading: false, errorMessage: responseData.invalidToken })
    }

    createSurveyreplies = () => {
        console.log("createSurveyreplies")
        const item = {
            surveyId: this.state.survey.surveyId,
            userTokenId: this.state.survey.candidateTokenId,
            candidateId: this.state.survey.candidateId
        };
        // const requestOptions = {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(item)
        // };
        // fetch(Environment.APPLICATION_BACKEND_PREFIX_URL + 'surveyreplyrequest/start/', requestOptions)
        //     .then(response => {
        //         if (response.status === 201) {
        //             return response.json();
        //         } else {
        //             console.log(response.status);
        //         }
        //     })
        //     .then(data => {
        //         console.log("risposta del json: " + JSON.stringify(data));
        //         this.setState({
        //             idUpdate: data.id
        //         })
        //     })

        Commons.executeFetchWithHeader(Constants.FULL_QUESTIONSTART_API_URI, 'POST', {
            'Content-Type': 'application/json'
        }, this.successStart, this.unSuccessStart, JSON.stringify(item), true)
    }

    successStart = (data) => {
        console.log("survey creatoo")
        console.log("risposta del json: " + JSON.stringify(data));
        this.setState({
            idUpdate: data.id
        })
    }

    unSuccessStart = (error) => {
        toast.error(error.status, {
            position: toast.POSITION.BOTTOM_LEFT,
        });
    }

    getButtons() {
        console.log("getButtons")
        const button = []
        const numSlides = document.getElementsByClassName("slide").length;
        for (let i = 0; i < numSlides; i++) {
            var idButton = 'Button' + (i + 1);
            button.push(<Button variant="outline-secondary" id={idButton} onClick={() => this.handleSelectedSlide(i)}>{i + 1}</Button>)
        }
        if (numSlides > 0 && this.state.buttonReady === false) {
            console.log("sono maggiore di zero")
            this.setState({
                buttonReady: true
            });
        }
        return button;
    }

    highlightButton(index) {
        var indexButtons = document.getElementById("indexButton").children
        for (var i = 0; i < indexButtons.length; i++) {
            var buttonChild = indexButtons[i];
            buttonChild.setAttribute("class", "btn btn-outline-secondary")
        }
        var button = document.getElementById("Button" + (index + 1))
        button.setAttribute("class", "btn btn-dark")

    }

    handleNextSlide = () => {
        console.log("handleNextSlide")
        const numSlides = document.getElementsByClassName("slide").length;
        if (this.state.currentSlide !== numSlides - 1) {
            const nextSlide = this.state.currentSlide + 1;
            document.getElementsByClassName("slide")[this.state.currentSlide].style.display = "none";
            document.getElementsByClassName("slide")[nextSlide].style.display = "block";
            this.setState({ currentSlide: nextSlide });
            this.highlightButton(nextSlide)
            if (this.state.currentSlide === numSlides - 2) {
                document.getElementsByClassName("sendSurvey")[0].style.display = "block";
                document.getElementsByClassName("forwardButton")[0].style.display = "none";
            }
        };
    }

    handlePrevSlide = () => {
        console.log("handlePrevSlide")
        const numSlides = document.getElementsByClassName("slide").length;
        if (this.state.currentSlide !== 0) {
            const prevSlide = this.state.currentSlide - 1;
            document.getElementsByClassName("slide")[this.state.currentSlide].style.display = "none";
            document.getElementsByClassName("slide")[prevSlide].style.display = "block";
            this.setState({ currentSlide: prevSlide });
            this.highlightButton(prevSlide)
            if (this.state.currentSlide !== numSlides - 2) {
                document.getElementsByClassName("sendSurvey")[0].style.display = "none";
                document.getElementsByClassName("forwardButton")[0].style.display = "block";
            }
        }
    };

    handleSelectedSlide = index => {
        console.log("handleSelectedSlide " + index)
        const numSlides = document.getElementsByClassName("slide").length;
        document.getElementsByClassName("slide")[this.state.currentSlide].style.display = "none";
        document.getElementsByClassName("slide")[index].style.display = "block";
        this.setState({ currentSlide: index });
        this.highlightButton(index)
        if (index === numSlides - 1) {
            document.getElementsByClassName("sendSurvey")[0].style.display = "block";
            document.getElementsByClassName("forwardButton")[0].style.display = "none";
            
        } else {
            document.getElementsByClassName("sendSurvey")[0].style.display = "none";
            document.getElementsByClassName("forwardButton")[0].style.display = "block";
        }
    };

    startSurvey = () => {
        document.getElementsByClassName("startSurvey")[0].style.display = "none";
        document.getElementsByClassName("start")[0].style.display = "none";
        document.getElementsByClassName("movementButtons")[0].style.display = "block";
        document.getElementsByClassName("slide")[0].style.display = "block";
        this.setState({ shouldRenderTime: true });
        // this.highlightButton(0);
    };

    sendSurvey = () => {
        const numSlides = document.getElementsByClassName("slide").length;
        var checkDiv = "";
        var checkboxes = [];
        var jsonArrayResponse = [];

        for (let i = 0; i < numSlides; i++) {
            var jsonResponse = {};
            checkDiv = document.getElementById(i)
            checkboxes = checkDiv.getElementsByTagName("input")
            jsonResponse.questionId = checkDiv.getAttribute("name")
            for (let i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    this.switchResponse(i, "true", jsonResponse)
                }
                else {
                    this.switchResponse(i, "false", jsonResponse)
                }
            }

            jsonArrayResponse.push(jsonResponse)
        }

        const item = {
            surveyId: this.state.survey.surveyId,
            userTokenId: this.state.survey.candidateTokenId,
            candidateId: this.state.survey.candidateId,
            answers: jsonArrayResponse,
        };

        console.log(jsonArrayResponse)

        // const requestOptions = {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(item)
        // };
        const id = this.state.idUpdate
        // fetch(Environment.APPLICATION_BACKEND_PREFIX_URL + 'surveyreplyrequest/end/' + id, requestOptions)
        //     .then(response => {
        //         if (response.status === 200) {
        //             response.json()
        //             this.completeQuestion()
        //         } else {
        //             console.log(response.status);
        //         }
        //     })
        console.log(" file da modificare problema jsojn" + JSON.stringify(item));
        Commons.executeFetchWithHeader(Constants.FULL_QUESTIONSEND_API_URI + id, 'PUT', {
            'Content-Type': 'application/json'
        }, this.successEnd, this.unSuccessEnd, JSON.stringify(item))
    }

    successEnd = () => {
        this.completeQuestion()
    }

    unSuccessEnd = (error) => {
        toast.error(error.status, {
            position: toast.POSITION.BOTTOM_LEFT,
        });
    }

    completeQuestion = () => {
        document.getElementsByClassName("sendSurvey")[0].style.display = "none";
        document.getElementsByClassName("movementButtons")[0].style.display = "none";
        document.getElementsByClassName("questionComplete")[0].style.display = "block";
        document.getElementsByClassName("slide")[0].style.display = "none";
        document.getElementsByClassName("list")[0].style.display = "none";
        this.setState({ shouldRenderTime: false })
    }

    switchResponse(index, value, jsonResponse) {
        switch (index) {
            case 0: jsonResponse.cansa = value
                break;
            case 1: jsonResponse.cansb = value
                break;
            case 2: jsonResponse.cansc = value
                break;
            case 3: jsonResponse.cansd = value
                break;
            case 4: jsonResponse.canse = value
                break;
            case 5: jsonResponse.cansf = value
                break;
            case 6: jsonResponse.cansg = value
                break;
            case 7: jsonResponse.cansh = value
                break;
            default: ;
        }
    }

    render() {
        const { surveyLoading, error, shouldRenderTime } = this.state;

        if (surveyLoading) {
            return <div className="modalLoaderDialog">
                <div className="loader modalLoader">
                    <img src={proxima_arrow} alt="loading..." className="proxima_arrow_spinner" />
                </div>
            </div>
        }

        if (error) {
            return <div>
                <div><b>{this.state.errorMessage}</b></div>
                <br></br>
                <br></br>
            </div>;
        }


        const list = this.state.questions.map((element, i) => {
            return (
                <div id={i} name={element.id} className="slide" style={{ display: "none" }}>
                    <br></br>
                    <div>
                        <h4>{element.label}</h4>
                    </div>
                    {element.ansa !== null ?
                        <div>
                            <ion-item>
                                <ion-checkbox slot="start" id="ansa" type="checkbox"></ion-checkbox>
                                <ion-label>{element.ansa}</ion-label>
                            </ion-item>
                            {/* <span><input id="ansa" type="checkbox" /></span>
                            <span>{element.ansa}</span> */}
                        </div>
                        : null}
                    {element.ansb !== null ?
                        <div>
                            <ion-item>
                                <ion-checkbox slot="start" id="ansb" type="checkbox"></ion-checkbox>
                                <ion-label>{element.ansb}</ion-label>
                            </ion-item>
                            {/* <span><input id="ansb" type="checkbox" /></span>
                            <span>{element.ansb}</span> */}
                        </div>
                        : null}
                    {element.ansc !== null ?
                        <div>
                            <ion-item>
                                <ion-checkbox slot="start" id="ansc" type="checkbox"></ion-checkbox>
                                <ion-label>{element.ansc}</ion-label>
                            </ion-item>
                            {/* <span><input id="ansc" type="checkbox" /></span>
                            <span>{element.ansc}</span> */}
                        </div>
                        : null}
                    {element.ansd !== null ?
                        <div>
                            <ion-item>
                                <ion-checkbox slot="start" id="ansd" type="checkbox"></ion-checkbox>
                                <ion-label>{element.ansd}</ion-label>
                            </ion-item>
                            {/* <span><input id="ansd" type="checkbox" /></span>
                            <span>{element.ansd}</span> */}
                        </div>
                        : null}
                    {element.anse !== null ?
                        <div>
                            <ion-item>
                                <ion-checkbox slot="start" id="anse" type="checkbox"></ion-checkbox>
                                <ion-label>{element.anse}</ion-label>
                            </ion-item>
                            {/* <span><input id="anse" type="checkbox" /></span>
                            <span>{element.anse}</span> */}
                        </div>
                        : null}
                    {element.ansf !== null ?
                        <div >
                            <ion-item>
                                <ion-checkbox slot="start" id="ansf" type="checkbox"></ion-checkbox>
                                <ion-label>{element.ansf}</ion-label>
                            </ion-item>
                            {/* <span><input id="ansf" type="checkbox" /></span>
                            <span>{element.ansf}</span> */}
                        </div>
                        : null}
                    {element.ansg !== null ?
                        <div >
                            <ion-item>
                                <ion-checkbox slot="start" id="ansg" type="checkbox"></ion-checkbox>
                                <ion-label>{element.ansg}</ion-label>
                            </ion-item>
                            {/* <span><input id="ansg" type="checkbox" /></span>
                            <span>{element.ansg}</span> */}
                        </div>
                        : null}
                    {element.ansh !== null ?
                        <div >
                            <ion-item>
                                <ion-checkbox slot="start" id="ansh" type="checkbox"></ion-checkbox>
                                <ion-label>{element.ansh}</ion-label>
                            </ion-item>
                            {/* <span><input id="ansh" type="checkbox" /></span>
                            <span>{element.ansh}</span> */}
                        </div>
                        : null}
                </div>
            )
        },
        )

        return (
            <div align="center">
                <div id="start" className="start">
                    <IonButton className="startSurvey" id="startSurvey" onClick={() => {this.startSurvey(); this.createSurveyreplies(); }}>Inizia il questionario</IonButton>
                </div>
                <div className="questionComplete" style={{ display: "none" }} >
                    <br></br>
                    <br></br>
                    Questionario Inviato
                </div>
                <div className="list" style={{ display: "block" }}>
                    {list}
                </div>
                <ButtonToolbar className="movementButtons" style={{ display: "none" }}>
                    <ButtonGroup id="indexButton" className="me-2" aria-label="Second group">
                        {this.getButtons()}
                    </ButtonGroup>
                    <br>
                    </br>
                    <ButtonGroup className="me-2" aria-label="First group">
                        <IonButton onClick={this.handlePrevSlide} className="small-btn">Indietro</IonButton>
                    </ButtonGroup>
                    <ButtonGroup>
                        <IonButton className="me-2 small-btn forwardButton" onClick={this.handleNextSlide}>Avanti</IonButton>
                    </ButtonGroup>
                </ButtonToolbar>
                <h3 className="time">
                    {shouldRenderTime && <Timer duration={this.state.timer} sendSurveyProp={this.sendSurvey} />}
                </h3>
                <br />
                <br />
                <br />
                <IonButton className="sendSurvey" color="danger" size="lg" onClick={this.sendSurvey} style={{ display: "none" }}>
                    Invia il questionario
                </IonButton>
            </div>
        )
    }
}
export default SurveysIonic;