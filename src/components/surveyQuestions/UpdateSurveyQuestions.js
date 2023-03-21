import React from "react";

import {
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Select,
} from "@material-ui/core";

import * as Commons from "../../commons.js";
import * as Constants from "../../constants.js";

class UpdateSurveyQuestions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questionLabelOptions: [],
            surveyLabelOptions: [],
            idItemToLoad: null,
            surveyLabel:this.props.oldSurveyLabel,
            questionLabel:this.props.oldQuestionLabel,
            oldPosition: this.props.oldSurveyPosition,
            // surveyId: 0,
            // questionId: 0,
            // position: 0
        };
        this.gridRef = React.createRef();
    }

    componentDidMount() {
        // chiamata all'API per ottenere i valori di label dell'entità "survey"
        Commons.executeFetch(
            Constants.FULL_SURVEY_API_URI,
            "GET",
            (data) => {
                const options = [];
                for (let i = 0; i < data.length; i++) {
                    options.push({
                        value: data[i].label,
                        label: data[i].label,
                        id: data[i].id,
                    });
                }
                this.setState({ surveyLabelOptions: options });
            },
            console.error
        );

        // chiamata all'API per ottenere i valori di label dell'entità "question"
        Commons.executeFetch(
            Constants.FULL_QUESTION_API_URI,
            "GET",
            (data) => {
                const options = [];
                for (let i = 0; i < data.length; i++) {
                    options.push({
                        value: data[i].label,
                        label: data[i].label,
                        id: data[i].id,
                    });
                }
                this.setState({ questionLabelOptions: options });
            },
            console.error
        );

        Commons.executeFetch(
            Constants.FULL_SURVEYQUESTIONS_API_URI + this.props.idItemToUpdate,
            "GET",
            this.setSurveyQuestions,
            Commons.operationError
        );
    }

    setSurveyQuestions = (data) => {
        this.setState({
            surveyId: data.surveyId,
            questionId: data.questionId,
            position: data.position
        });
    };

    handleChange = (event) => {
        this.setState(
            { [event.target.name]: event.target.value }
        );
    }

    handleSubmit = (event) => {
        event.preventDefault();

        console.log("### HANDLE SUBMIT ###");
        console.log("### label nuova ### " + this.state.surveyLabel);
        console.log("### question nuova ### " + this.state.questionLabel);
        console.log("### valore surveyId ### " + this.state.surveyId);
        console.log("### valore questionId ### " + this.state.questionId);
       var survey_id = 0;
       var question_id = 0;
       var position_new = this.state.oldPosition
        for(let i = 0; i < this.state.surveyLabelOptions.length; i++){
            console.log("i : " + i);
            if(this.state.surveyLabelOptions[i].label === this.state.surveyLabel){
                console.log("*** DENTRO FOR Survey, i vale: " + i + "ID VALE: " + this.state.surveyLabelOptions[i].id)
                // this.setState({surveyId: this.state.surveyLabelOptions[i].id}, () => {console.log(this.state.surveyId)});
                survey_id = this.state.surveyLabelOptions[i].id;
                break;
            }
        }

        for(let j = 0; j < this.state.questionLabelOptions.length; j++){
            console.log("i : " + j);
            if(this.state.questionLabelOptions[j].label === this.state.questionLabel){
                console.log("*** DENTRO FOR QUESTION, i vale: " + j + "ID VALE: " + this.state.questionLabelOptions[j].id)
                // this.setState({questionId: this.state.questionLabelOptions[j].id}, () => {console.log(this.state.questionId)});
                question_id = this.state.questionLabelOptions[j].id;
                break;
            }
        }

        console.log("### NUOVO valore surveyId ### " +survey_id);
        console.log("### NUOVO valore questionId ### " + question_id);

        var item = {
            id: this.props.idItemToUpdate,
            surveyId: survey_id,
            questionId: question_id,
            position: position_new,
        };
        Commons.executeFetch(Constants.FULL_SURVEYQUESTIONS_API_URI + this.props.idItemToUpdate, "PUT", this.updateSuccess, Commons.operationError, JSON.stringify(item), true);
    }

    updateSuccess = (response) => {
        // console.log("SURVEY QUESTION UPDATE SUCCESS");
        // console.log(response);
        // toast.success("SURVEY QUESTION successfully updated", {
        //     position: toast.POSITION.BOTTOM_LEFT
        // });
        Commons.operationSuccess();
        this.setState({ isModalOpen: false });
        this.props.refreshSurveyQuestionsList();
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
        Commons.executeFetch(Constants.FULL_SURVEYQUESTIONS_API_URI + this.props.idItemToUpdate, "GET", this.setItemToUpdate);
    }

    setItemToUpdate = (responseData) => {
        this.setState({
            itemLoaded: true,
            surveyId: responseData.surveyId,
            questionId: responseData.questionId,
            position: responseData.position,
        });
    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.state.isModalOpen}
                    onClose={() => this.setState({ isModalOpen: false })}
                >
                    <DialogTitle>Edit Survey Questions</DialogTitle>
                    <DialogContent>
                        <Select
                            fullWidth
                            label="Survey Label"
                            name="surveyLabel"
                           
                            onChange={this.handleChange}
                            value={this.state.surveyLabel}
                            style={{ marginBottom: "10px" }}
                        >
                            {this.state.surveyLabelOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        <Select
                            fullWidth
                            label="Question Label"
                            name="questionLabel"
                            value={this.state.questionLabel}
                            onChange={this.handleChange}
                            style={{ marginBottom: "10px" }}
                        >
                            {this.state.questionLabelOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        <TextField
                            fullWidth
                            label="Position"
                            name="oldPosition"
                            type="number"
                            value={this.state.oldPosition}
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

export default UpdateSurveyQuestions;