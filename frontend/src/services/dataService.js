//import axios from "axios";
//import * as AWS from 'aws-sdk/global';

global.fetch = require('node-fetch');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');

export const dataService = {
    getUserData,
    getAdminData,
    uploadFile,
    deleteFile,
    getUser,

}

export const apiConfig = {
    endpointURL: "https://saraswati.app/api"
}

function getUserData(userName) {
    console.log("user"+userName);
    const requestOption = {
        method: 'GET',
        headers: { "Content-Type": "application/json" }
    }
    return fetch(`${apiConfig.endpointURL}/getUserData/${userName}`, requestOption).then(res => {
        console.log(res); 
        return res.json();
    })
}

function getAdminData() {

    const requestOption = {
        method: 'GET',
        headers: { "Content-Type": "application/json" }
    }
    return fetch(`${apiConfig.endpointURL}/getAdminData`, requestOption).then(res => {
        console.log(res); 
        return res.json();
    })
}

function uploadFile(inputFile, userData, description) {
    const formData = new FormData();
    formData.append('inputFile', inputFile);
    formData.append('userName', userData);
    formData.append('description', description);
    console.log(`UserNAme: ${userData}, desc: ${description}`);
    const requestOption = {
        method: 'POST',
        body: formData,
       // headers: { "Content-Type": inputFile.type }
    }
    return fetch(`${apiConfig.endpointURL}/upload_file`, requestOption).then(res => {
      console.log(res);
        return res;
    })
}
function deleteFile(fileName,id) {
    const requestOption = {
        method: 'DELETE',
        body: JSON.stringify({
            "deleteFile": fileName,
            "userId": id
        }),
        headers: { "Content-Type": "application/json" }
    }
    return fetch(`${apiConfig.endpointURL}/delete_file`, requestOption)
}


function getUser() {
    var poolData = {
        UserPoolId: 'us-west-1_9Nnlhwq6w', 
        ClientId: 'i2r4bvb6ektuud48bj2gu0hr5', 
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();

    console.log("cognito user", cognitoUser);
    
    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
                alert(err.message || JSON.stringify(err));
                return;
            }
            console.log('session validity: ' + session.isValid());
    
            // NOTE: getSession must be called to authenticate user before calling getUserAttributes
            cognitoUser.getUserAttributes(function(err, attributes) {
                if (err) {
                    // Handle error
                    console.log(err);
                } else {
                    // Do something with attributes
                    console.log(attributes);
                }
            });
        });
    }
}

