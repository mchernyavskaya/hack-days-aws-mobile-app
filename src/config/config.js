let API_GATEWAY_ROOT = 'https://fl9wpsxzkk.execute-api.eu-central-1.amazonaws.com/prod';
let config = {
    apiGateway: {
        processImageUrl: `${API_GATEWAY_ROOT}/v1/processimage`
    },
    uid: {
        length: 20
    }
};

export default config;