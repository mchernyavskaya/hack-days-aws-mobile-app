import React from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import { Button, ButtonGroup } from 'react-bootstrap';
import { Storage } from 'aws-amplify';
import { S3Image } from 'aws-amplify-react';
import ImageProcessingService from './services/imageProcessingService.js';

const OPS = {
    rotate: 'rotate',
    rmback: 'rmback'
};

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
            e.target.files[ 0 ] : null;
        me.setState({ value: e.target.value }, () => {
            if (me.isValid() && file) {
                const name = file.name;
                Storage.put(name, file).then(() => {
                    this.setState({ fileName: name });
                });
            }
        });
    }

    handleClear() {
        if (this.getValidationState() === 'error') {
            this.setState({ value: '' });
        }
    }

    initiateRotate() {
        let uid = ImageProcessingService.initiateProcessing(this.state.fileName, OPS.rotate);
        this.setState({
            rotateUID: uid,
            rotateFileName: null
        });
    }

    checkRotateReady() {
        let op = OPS.rotate, me = this;
        let uid = this.state.rotateUID;
        me.setState({ rotateFileName: null }, () => {
            if (uid && ImageProcessingService.checkImageReady(op, uid)) {
                me.setState({
                    rotateFileName: ImageProcessingService.processedFileName(op, uid)
                });
            }
        });
    }

    initiateBackgroundRemoval() {
        let uid = ImageProcessingService.initiateProcessing(this.state.fileName, OPS.rmback);
        this.setState({ rmbackUID: uid, rmbackFileName: null });
    }

    checkBackgroundRemovalReady() {
        let op = OPS.rmback, me = this;
        let uid = this.state.rmbackUID;
        me.setState({ rmbackFileName: null }, () => {
            if (uid && ImageProcessingService.checkImageReady(op, uid)) {
                me.setState({ rmbackFileName: ImageProcessingService.processedFileName(op, uid) });
            }
        });
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

                    {this.state && this.state.fileName &&
                    <div className="s3-image">
                        <ControlLabel>Source image</ControlLabel>
                        <S3Image path={this.state.fileName}/>
                    </div>
                    }

                    {
                        this.renderOperationPanel(
                            OPS.rotate,
                            this.initiateRotate,
                            this.state.rotateUID,
                            this.checkRotateReady,
                            this.state.rotateFileName)
                    }
                    {
                        this.renderOperationPanel(
                            OPS.rmback,
                            this.initiateBackgroundRemoval,
                            this.state.rmbackUID,
                            this.checkBackgroundRemovalReady,
                            this.state.rmbackFileName)
                    }
                </FormGroup>
            </form>
        );
    }

    renderOperationPanel(opName,
                         initiateHandler,
                         initiateStateProp,
                         checkResultHandler,
                         checkResultStateProp) {
        return (<div className="image-operation-panel">
            <ControlLabel>{`Magic happens here for [${opName}]`}</ControlLabel>
            <div>
                <ButtonGroup>
                    <Button disabled={!this.state.fileName}
                            onClick={initiateHandler.bind(this)}>
                        {`Initiate`}
                    </Button>
                    <Button disabled={!this.state.fileName}
                            onClick={checkResultHandler.bind(this)}>
                        {`Check`}
                    </Button>
                </ButtonGroup>
                <div>
                    {checkResultStateProp &&
                    <div className="s3-image">
                        <S3Image path={checkResultStateProp}/>
                    </div>
                    }
                    {!checkResultStateProp &&
                    <div>
                        Looks like the magic hasn't been done yet.
                    </div>
                    }
                </div>
            </div>
        </div>)
    }
}

export default UploadForm;