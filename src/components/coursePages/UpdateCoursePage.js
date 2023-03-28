import React from "react";

import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  Select
} from "@material-ui/core";

import * as Commons from "../../commons.js";
import * as Constants from "../../constants.js";

import EditButton from "../../commons/EditButton.js";
import CancelButton from "../../commons/CancelButton.js";
import SaveButton from "../../commons/SaveButton.js";

import './UpdateCoursePage.css';

class UpdateCoursePages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idItemToLoad: null,
      title: props.coursePage.title,
      code: props.coursePage.code,
      bodyText: props.coursePage.bodyText,
      owners: [],
      userId:"",
      selectedOwner: props.coursePage.selectedOwner,
      coursePageOwnerFirstname: props.coursePage.coursePageOwnerFirstname,
      coursePageOwnerLastname : props.coursePage.coursePageOwnerLastname
    };
    this.gridRef = React.createRef();
  }

  // setCoursePages = (data) => {
  //   this.setState({
  //     title: data.title,
  //     code: data.code,
  //     bodyText: data.bodyText,
  //     opened_by: data.opened_by,
  //   });
  // };

  handleChange = (event) => {
    this.setState(
      { [event.target.name]: event.target.value }
    );
  }

  handleSubmit = () => {
    const { title, code, bodyText,coursePageOwnerFirstname,coursePageOwnerLastname,userId } = this.state;
    const { coursePage } = this.props;

    const updatedCoursePage = {
      ...coursePage,
      title,
      code,
      bodyText,
      coursePageOwnerFirstname ,
      coursePageOwnerLastname,
      userId
    };

    console.log("item updatato " + JSON.stringify(updatedCoursePage))

    Commons.executeFetch(
      Constants.COURSEPAGE_CUSTOM_API + updatedCoursePage.id,
      "PUT",
      this.updateSuccess,
      Commons.operationError,
      JSON.stringify(updatedCoursePage),
      true
    );
  }

  updateSuccess = (response) => {
    Commons.operationSuccess();
    this.props.refreshCoursePagesList();
    this.setState({ isModalOpen: false });
  }

  // updateCoursePage = () => {
  //   const { title, code, bodyText,coursePageOwnerFirstname,coursePageOwnerLastname } = this.state;
  //   const { coursePage } = this.props;

  //   const updatedCoursePage = {
  //     ...coursePage,
  //     title,
  //     code,
  //     bodyText,
  //     coursePageOwnerFirstname,
  //     coursePageOwnerLastname
  //   };

  //   Commons.executeFetch(
  //     Constants.FULL_COURSEPAGE_API_URI + updatedCoursePage.id,
  //     "PUT",
  //     this.updateSuccess,
  //     Commons.operationError,
  //     JSON.stringify(updatedCoursePage),
  //     true
  //   );
  // };

  cancelSubmit = (event) => {
    event.preventDefault();
    this.setState({ isModalOpen: false });
  }

  initializeAndShow = () => {
    console.log(this.props.idItemToUpdate);
    // this.getItemById();
    //this.gridRef.current.show();
  }


  // getItemById = () => {
  //   Commons.executeFetch(Constants.COURSEPAGE_CUSTOM_API + this.props.idItemToUpdate, "GET", this.setItemToUpdate);
  // }

  componentDidMount = () => {
    this.fetchOwners();
  }

  fetchOwners = () => {
    Commons.executeFetch(Constants.BACKEND_API_PREFIX + Constants.GET_USER_BY_ROLE_API + "50", "GET", this.setOwners);
  }

  setOwners = (retrievedOwners) => {
    Commons.debugMessage("setOwners - START - owners: " + retrievedOwners);
    this.setState({
      owners: retrievedOwners,
    });
    console.log(retrievedOwners);
  }

  setItemToUpdate = (responseData) => {
    this.setState({
      itemLoaded: true,
      title: responseData.title,
      code: responseData.code,
      bodyText: responseData.bodyText,
    });
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.state.isModalOpen}
          onClose={() => this.setState({ isModalOpen: false })}
        >
          <DialogTitle className="commonDialogTitle">MODIFICA POSIZIONE</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="TITOLO POSIZIONE"
              name="title"
              value={this.state.title}
              onChange={this.handleChange}
              style={{ marginBottom: "10px" }}
            />
            <TextField
              fullWidth
              label="CODICE ALFANUMERICO"
              name="code"
              value={this.state.code}
              onChange={this.handleChange}
              style={{ marginBottom: "10px" }}
            />
            <TextField
              fullWidth
              label="BREVE DESCRIZIONE"
              name="bodyText"
              value={this.state.bodyText}
              onChange={this.handleChange}
              style={{ marginBottom: "20px" }}
            />
            <InputLabel>HR RESPONSABILE DELLA POSIZIONE</InputLabel>
            <Select
              fullWidth
              label="Proprietario"
              name="proprietario"
              value={this.state.selectedOwner}
              onChange={(e) => this.setState({ selectedOwner: e.target.value,coursePageOwnerFirstname : e.target.value.firstname,coursePageOwnerLastname:e.target.value.lastname,userId:e.target.value.id })}
              style={{ marginBottom: "10px" }}
            >
              {this.state.owners.map((owner) => (
                <option key={owner} value={owner}>{owner.firstname + " " + owner.lastname}</option>
              ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <SaveButton onClickFunction={() => this.handleSubmit()} />
            <CancelButton onClickFunction={() => this.setState({ isModalOpen: false })} />
          </DialogActions>
        </Dialog>
        <div>
          <EditButton onClickFunction={() => this.setState({ isModalOpen: true })} />
        </div>
      </div>
    );
  }
}

export default UpdateCoursePages;