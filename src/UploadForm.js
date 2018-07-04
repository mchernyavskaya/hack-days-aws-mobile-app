import React from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import { Storage } from 'aws-amplify';
import { S3Image } from 'aws-amplify-react';
import ImageProcessingService from './services/imageProcessingService.js';

class UploadForm extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleUpload = this.handleUpload.bind(this);

        this.state = {
            value: '',
            fileName: null
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

    isValid() {
        return this.getValidationState() === 'success'
    }

    handleUpload(e) {
        const me = this, file = e.target.files && e.target.files.length ?
            e.target.files[0] : null;
        me.setState({ value: e.target.value }, () => {
            if (me.isValid() && file) {
                const name = file.name;
                Storage.put(name, file).then(() => {
                    this.setState({ fileName: name });
                    ImageProcessingService.initiateProcessing(name, 'rotate');
                });
            }
        });
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
                        onChange={this.handleUpload}
                    />

                    <FormControl.Feedback onClick={this.handleClear.bind(this)}/>
                    <HelpBlock>The file should be a jpg/jpeg image.</HelpBlock>

                    { this.state && this.state.fileName &&
                    <div className="s3-image">
                        <S3Image path={this.state.fileName} />
                    </div>
                    }
                </FormGroup>
            </form>
        );
    }
}

export default UploadForm;