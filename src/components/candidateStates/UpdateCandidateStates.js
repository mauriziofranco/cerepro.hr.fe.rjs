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

class UpdateCandidateStates extends React.Component {
    constructor(props) {
        super(props);
        this.state = { idItemToLoad: null,
            roleId: props.roleId || 4,
            statusCode: "",
            statusLabel: "",
            statusDescription: "",
            statusColor: "",
        };
        this.gridRef = React.createRef();
    }

    handleChange = (event) => {
        this.setState(
            { [event.target.name]: event.target.value }
        );
    }

    handleSubmit = (event) => {
        event.preventDefault();
        var item = {
            roleId: this.state.roleId,
            statusCode: this.state.statusCode,
            statusLabel: this.state.statusLabel,
            statusDescription: this.state.statusDescription,
            statusColor: this.state.statusColor
        };
        Commons.executeFetch(Constants.FULL_CANDIDATE_STATES_API_URI + this.props.idItemToUpdate, "PUT", this.updateSuccess, Commons.operationError, JSON.stringify(item), true);
    }

    updateSuccess = (response) => {
        console.log("CANDIDATE STATE SUCCESSFULLY UPDATED");
        console.log(response);
        toast.success("Candidate State successfully updated", {
            position: toast.POSITION.BOTTOM_LEFT
        });
        this.setState({ isModalOpen: false });
        this.props.refreshCandidateStatesList();
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
        Commons.executeFetch(Constants.FULL_CANDIDATE_STATES_API_URI + this.props.idItemToUpdate, "GET", this.setItemToUpdate);
    }

    setItemToUpdate = (responseData) => {
        this.setState({
            itemLoaded: true,
            roleId: responseData.roleId,
            statusCode: responseData.statusCode,
            statusLabel: this.state.statusLabel,
            statusDescription: this.state.statusDescription,
            statusColor: this.state.statusColor
        });
    }

  render() {
    return (
      <div>
        <Dialog
          open={this.state.isModalOpen}
          onClose={() => this.setState({ isModalOpen: false })}
        >
          <DialogTitle>Edit Candidate States</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Status Code"
              name="statusCode"
              value={this.state.statusCode}
              onChange={this.handleChange}
              style={{ marginBottom: "10px" }}
            />
            <TextField
              fullWidth
              label="Status Label"
              name="statusLabel"
              value={this.state.statusLabel}
              onChange={this.handleChange}
              style={{ marginBottom: "10px" }}
            />
            <TextField
              fullWidth
              label="Status Description"
              name="statusDescription"
              value={this.state.statusDescription}
              onChange={this.handleChange}
              style={{ marginBottom: "10px" }}
            />
            <TextField
              fullWidth
              label="Status Color"
              name="statusColor"
              value={this.state.statusColor}
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

export default UpdateCandidateStates;