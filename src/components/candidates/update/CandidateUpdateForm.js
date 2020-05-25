import React, {Component} from 'react';
import './CandidateUpdateForm.css';
import * as Constants from '../../../constants' ;
import * as Commons from '../../../commons.js' ;
import CandidateUpdateFormPositionCodeSelect from './CandidateUpdateFormPositionCodeSelect.js' ;

import { Redirect } from 'react-router-dom'
import { Button } from 'react-bootstrap';
import {withRouter} from 'react-router-dom'
const COURSE_CODE_API = '/api/v1/coursepage/' ;
const CANDIDATE_API = '/api/v1/candidatecustom/' ;
const FULL_COURSECODE_API_URI = Constants.BACKEND_API_PREFIX + COURSE_CODE_API ;
const FULL_CANDIDATE_API_URI = Constants.BACKEND_API_PREFIX + CANDIDATE_API ;

class CandidateUpdateForm extends Component {
	
	componentDidMount() {			
		Commons.debugMessage("CandidateUpdateForm.componentDidMount - START");
//		this.fetchCourseCodes.bind(this);
//		this.fetchCourseCodes();
		this.fetchUserDetail();
      }
	
	constructor (props) {
		super(props);
		const { match: { params } } = props;
		Commons.debugMessage("constructor - DEBUG - id: " + params.id);
		this.goBack = this.goBack.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		
		this.state = {
				currentCandidateId : params.id,
				courseCodes : [],
				selectedPositionCode: '',
//				positionCode : '',
				candidate : {
					id: '',
					firstname : '',
					lastname : '',
					email: '',
					courseCode: ''
				},
				redirect: false
		}
	}
	
	redirectToCandidatesList = () => {
	    this.setState({
	      redirect: true
	    })
	  }
	
	 renderRedirect = () => {
	      if (this.state.redirect) {
	    	  let target = '/candidates/'+this.state.positionCode ;
	          return <Redirect to={target} />
	      }
	  }
	
	fetchCourseCodes = () =>{
		Commons.executeFetch (FULL_COURSECODE_API_URI, 'GET', this.setCourseCodes);
	}
	
	fetchUserDetail = () =>{
		Commons.debugMessage("CandidateUpdateForm.fetchUserDetail - DEBUG - id: " + this.state.currentCandidateId);
		Commons.executeFetch (FULL_CANDIDATE_API_URI + this.state.currentCandidateId, 'GET', this.setCurrentCandidate);
//		this.initializeSelectedPositionCode();
	}
	
//	setCourseCodes = (responseData) => {
//		this.setState({ courseCodes: responseData });
//		this.initializeSelectedPositionCode();
//	}
	
//	initializeSelectedPositionCode = () => {
//		Commons.debugMessage("CandidateUpdateForm.initializeSelectedPositionCode - START - this.state.candidate.courseCode: " + this.state.candidate.courseCode + " - this.state.courseCodes.length: "  +  this.state.courseCodes.length);
//		if ((this.state.courseCodes !== null) && (this.state.courseCodes.length>0) && (this.state.candidate.courseCode!==null)) {
//			for (let currentPosition of this.state.courseCodes) {
////				Commons.debugMessage("CandidateUpdateForm.initializeSelectedPositionCode - DEBUG - checking currentPosition.code: " + currentPosition.code + " - this.state.candidate.courseCode: " + this.state.candidate.courseCode);
//				if (currentPosition.code===this.state.candidate.courseCode) {
//					this.setState({selectedPositionCode:currentPosition.title});
//					Commons.debugMessage("CandidateUpdateForm.initializeSelectedPositionCode - DEBUG - selectedPositionCode: " + currentPosition.title);
//					break;
//				}
//			}
//		}
//	}
	
	setCurrentCandidate = (responseData) => {
		this.setState({ candidate: responseData });
	}
	  
	  handleSubmit(event) {
	    console.log(this.state);
	    event.preventDefault();
	    this.sendInsertRequest();
	  }
	
	sendInsertRequest = () => {
		const formData = new FormData();

		const fileInput = document.querySelector("#imgpath");
		if (fileInput.files[0]!==undefined) {
			console.log("fileInput: " + fileInput);
			console.log("fileInput.files[0]: " + fileInput.files[0]);
			console.log("fileInput.files[0].name: " + fileInput.files[0].name);
			formData.append("files", fileInput.files[0])
			formData.append("imgpath", fileInput.files[0].name)
		}
		const fileInput2 = document.querySelector("#cvpath");
		if (fileInput2.files[0]!==undefined) {
			console.log("fileInput2: " + fileInput2);
			console.log("fileInput2.files[0]: " + fileInput2.files[0]);
			console.log("fileInput2.files[0].name: " + fileInput2.files[0].name);
			formData.append("files", fileInput2.files[0])
			formData.append("cvExternalPath", fileInput2.files[0].name)
		}
		
// formData.append("file", fileInput.files[0]);
	    formData.append("firstname", this.state.firstname);
	    formData.append("lastname", this.state.lastname);
	    formData.append("email", this.state.email);
	    formData.append("userId", 13);
	    formData.append("insertedBy", 13);
	    formData.append("courseCode", this.state.positionCode);

	    const options = {
	      method: "POST",
	      body: formData
	    };
	    fetch(FULL_CANDIDATE_API_URI, options).then(() => {
	    	
	    	this.redirectToCandidatesList();
	    });
	    
		
	}
	
    handleInputChange(event) {
	    const target = event.target;
	    const value = target.value;
	    const name = target.name;

	    this.setState({
	      [name]: value,    });
	}
    
    goBack(event){
    	event.preventDefault();
        this.props.history.goBack();
    }
    
    setCandidateNewPositionCode = (code) => {
    	Commons.debugMessage("code: " + code);
    	this.setState({selectedPositionCode: code});
    }
	
	render () {
		return (
			<div className="panel-container">
			    {this.renderRedirect()}
			    <div className="panel">
			        <div className="panel-heading">
			           Inserisci nuovo candidato
			        </div>
			        <div className="panel-body">
			            <form onSubmit={this.handleSubmit}>
				            <div className="row">
				                <div className="col-25">
                                    <label>Nome</label>
                                </div>
                                <div className="col-75">
                                    <input type="text" className="candidate-input-form" name="firstname" placeholder="Nome" onChange={this.handleInputChange} value={this.state.candidate.firstname} required/>
                                </div>
				            </div>
				            <div className="row">
				                <div className="col-25">
				                    <label >Cognome</label>
				                </div>
				                <div className="col-75">
				                    <input type="text" className="candidate-input-form" name="lastname" placeholder="Cognome" onChange={this.handleInputChange} value={this.state.candidate.lastname} required/>
				                </div>
				            </div>
				            <div className="row">
				                <div className="col-25">
				                    <label>Email</label>
				                </div>
				                <div className="col-75">
				                    <input type="email" className="candidate-input-form" name="email" placeholder="Email" onChange={this.handleInputChange} value={this.state.candidate.email} required/>
				                </div>
				            </div>
				            <div className="row">
				                <div className="col-25">
				                    <label>Posizione</label>
				              </div>
				              <div className="col-75">
				              {/*
					              <select name="positionCode" className="candidate-input-form" onChange={this.handleInputChange} required>
					              {this.state.courseCodes.map((e, key) => {
							        	if (this.state.candidate.courseCode===e.code) {
							        		return <option key={key} defaultValue value={e.code}>{e.title}</option>;	
							        	} else {
							        		return <option key={key} value={e.code}>{e.title}</option>;
							        	}
							        })}
						          </select>
						       */}
						          <CandidateUpdateFormPositionCodeSelect defaultValue={this.state.candidate.courseCode} setCandidateNewPositionCode={this.setCandidateNewPositionCode}/>
				              </div>
				            </div>
				            <div className="row">
				                <div className="col-25">
				                    <label>Allega CV(.doc,.pdf,.docx,.odt)</label>
				                </div>
				                <div className="col-75">
				                    <input type="file" id="cvpath" accept=".doc,.pdf,.docx,.odt" />
				                </div>
				            </div>
				            <div className="row">
				                <div className="col-25">
				                    <label>Allega immagine profilo(.png,.jpeg,.gif,.jpg)</label>
				                </div>
				                <div className="col-75">
				                    <input type="file" id="imgpath" accept=".png,.jpeg,.gif,.jpg" />
				                </div>
				            </div>
				            <div className="row insert-form-buttons">
				                <Button type="submit" variant="secondary">INSERISCI</Button>
				                &nbsp;&nbsp;&nbsp;&nbsp;
				                <Button variant="warning" onClick={this.goBack}>Annulla</Button>
				            </div>
			            </form>
		            </div>
	            </div>
	        </div>
		);
	}
}

export default withRouter(CandidateUpdateForm);