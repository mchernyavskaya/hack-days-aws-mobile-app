import config from '../config/config.js';
import uid from 'uid';
import 'whatwg-fetch';

let checkStatus = (response) => {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        let error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
};

let parseJSON = (response) => response.json();

let ImageProcessingService = {
    initiateProcessing(fileName, operation) {
        let url = config.apiGateway.processImageUrl,
            uidLength = config.uid.length;
        let UID = uid(uidLength),
            body = { fileName, operation, UID };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(checkStatus)
            .then(parseJSON)
            .then(
                (data) => {
                    console && console.log('request succeeded with JSON response', data);
                }
            )
            .catch(
                (error) => {
                    console && console.error('request failed', error);
                }
            );
        return UID;
    },

    async checkImageReady(operation, UID) {
        let rootUrl = config.awsmobile.publicBucket;
        const response = await fetch(rootUrl + this.processedFileName(operation, UID));
        return response.statusCode >= 200 && response.statusCode < 300;
    },

    processedFileName(operation, UID) {
        return `${UID}_processed.png`;
    }
};
export default ImageProcessingService;