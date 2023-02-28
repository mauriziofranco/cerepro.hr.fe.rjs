import React from "react";

import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Commons from "../../commons.js";
import * as Constants from "../../constants.js";

class UpdateSurvey extends React.Component {
    constructor(props) {
        super(props);
        this.state = { idItemToLoad: null, label: '', time: '', description: '' };
        this.gridRef = React.createRef();
    }

    componentDidMount() {
      Commons.executeFetch(
        Constants.FULL_SURVEY_API_URI + this.props.idItemToUpdate,
        "GET",
        this.setSurvey,
        Commons.operationError
      );
    }
    
    setSurvey = (data) => {
      this.setState({
        label: data.label,
        time: data.time,
        description: data.description,
      });
    };

    handleChange = (event) => {
        this.setState(
            { [event.target.name]: event.target.value }
        );
    }

    handleSubmit = (event) => {
        event.preventDefault();
        var item = {
            label: this.state.label, time: this.state.time, description: this.state.description
        };
        Commons.executeFetch(Constants.FULL_SURVEY_API_URI + this.props.idItemToUpdate, "PUT", this.updateSuccess, Commons.operationError, JSON.stringify(item), true);
    }

    updateSuccess = (response) => {
        console.log("SURVEY SUCCESSFULLY UPDATED");
        console.log(response);
        toast.success("Survey successfully updated", {
            position: toast.POSITION.BOTTOM_LEFT
        });
        this.setState({ isModalOpen: false });
        this.props.refreshSurveyList();
    }

    cancelSubmit = (event) => {
        event.preventDefault();
        this.setState({ isModalOpen: false });
    }

    initializeAndShow = () => {
        console.log(this.props.idItemToUpdate);
        this.getItemById();
        //this.gridRef.current.show();
    }

    getItemById = () => {
        Commons.executeFetch(Constants.FULL_SURVEY_API_URI + this.props.idItemToUpdate, "GET", this.setItemToUpdate);
    }

    setItemToUpdate = (responseData) => {
        this.setState({
            itemLoaded: true,
            label: responseData.label,
            time: responseData.time,
            description: responseData.description
        });
    }

  render() {
    return (
      <div>
        <Dialog
          open={this.state.isModalOpen}
          onClose={() => this.setState({ isModalOpen: false })}
        >
          <DialogTitle>Edit Survey</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Label"
              name="label"
              value={this.state.label}
              onChange={this.handleChange}
              style={{ marginBottom: "10px" }}
            />
            <TextField
              fullWidth
              label="Time"
              name="time"
              type="number"
              value={this.state.time}
              onChange={this.handleChange}
              style={{ marginBottom: "10px" }}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={this.state.description}
              onChange={this.handleChange}
              style={{ marginBottom: "20px" }}
            />
          </DialogContent>
          <DialogActions>
          <Button
              onClick={this.handleSubmit}
              style={{ marginRight: "14px" }}
              color="primary"
            >
              Save
            </Button>
            <Button 
              onClick={this.cancelSubmit}
              style={{ margin: "7px" }}
              color="secondary"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.setState({ isModalOpen: true })}
          >
            EDIT
      </Button>
    </div>
  </div>
);
}
}

export default UpdateSurvey;