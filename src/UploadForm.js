import React from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

class UploadForm extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            value: ''
        };
    }

    getValidationState() {
        const value = this.state.value;
        if (!!value) {
            return value.length > 0 &&
            (value.endsWith("jpeg") || value.endsWith("jpg")) ? 'success' : 'error';
        }
        return null;
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
    }

    handleClear() {
        if (this.getValidationState() === 'error') {
            this.setState({ value: '' });
        }
    }

    render() {
        return (
            <form className={"form-horizontal center-div"}>
                <FormGroup
                    controlId="formBasicText"
                    validationState={this.getValidationState()}>
                    <ControlLabel>Please select a file to upload</ControlLabel>
                    <FormControl
                        type="file"
                        value={this.state.value}
                        placeholder="Select an image to upload"
                        onChange={this.handleChange}
                    />
                    <FormControl.Feedback onClick={this.handleClear.bind(this)}/>
                    <HelpBlock>Please select a jpg/jpeg image.</HelpBlock>
                </FormGroup>
            </form>
        );
    }
}

export default UploadForm;