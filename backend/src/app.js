const express = require('express')
const fileUpload = require('express-fileupload');
const app = express()
let cors = require('cors');
const port = 3001
const fs = require('fs');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-1' });
const dotenv = require('dotenv');
const parseResult = dotenv.config()
if (parseResult.error) {
  throw parseResult.error
}

console.log(parseResult.parsed)

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: 'tmp'
}));
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' ,
endpoint: "http://dynamodb.us-west-1.amazonaws.com",
accessKeyId: process.env.AWS_ACCESS_KEY,
secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY});
const s3 = new AWS.S3({
  endpoint: "http://s3.amazonaws.com",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const bucket_name='cmpebucket1'
function deleteFileTemp(path) {
  try {
    fs.unlinkSync(path)
    console.log("File Removed")
  } catch (err) {
    console.error("Error in deleting temp file " + path, err);
  }
}

app.post('/upload_file', function (req, res) {

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  console.log("tempFilePath:" + req.files.inputFile.tempFilePath)
  const fileContent = fs.createReadStream(req.files.inputFile.tempFilePath);
  console.log("mimetype: " + req.files.inputFile.mimetype)
  // Setting up S3 upload parameters
  const params = {
    Bucket: bucket_name,
    Key: req.files.inputFile.name,
    ContentType: req.files.inputFile.mimetype,
    Body: fileContent
  };
  // Uploading files to the bucket
  s3.upload(params, function (err, data) {
    if (err) {
      console.log("Error in uploading file", err);
      return res.status(500).send(`Can not upload the file. ${err}`)
      // Send 500 Response 
    } else {
      deleteFileTemp(req.files.inputFile.tempFilePath);
      updateDataBase();
      console.log(`File uploaded successfully. ${data.Location}`);
      return res.status(200).send(`File uploaded successfully. ${data.Location}`)
    }
  });

  function updateDataBase() {
    console.log(`userName: ${req.body.userName}`)
    console.log(`FileName: ${req.files.inputFile.name}`)
    var currentTime = new Date().toString();
    console.log(`currentTime: ${currentTime}`)
    var userName = req.body.userName
    console.log(req.body);
    var description = req.body.description
    var fileName = req.files.inputFile.name;
    var userId = userName.concat("_", fileName)
    console.log(`userId: ${userId}`)
    console.log(`description: ${description}`)

    ddb.scan({
      TableName: 'UserData',
    }, function (err, data) {
      if (err) {
        console.log("Error", err);

      } else {
        console.log("Success", data.Items);
        const foundItems = data.Items.filter(item => item.userId.S === userId);
        if (foundItems.length > 0) {
          console.log("File is already exists, so updating it", foundItems);
          const foundItem = foundItems[0];
          console.log("Updating FIle item ", foundItem);
          putItem(userId, userName, fileName, description, foundItem.fileCreatedTime.S);
        } else {
          console.log("It is new file, so creating new record ", userId);
          putItem(userId, userName, fileName, description, currentTime);
        }

      }
    });

  }
  function putItem(userId, userName, fileName, description, fileCreationTime) {
    const ddbparams = {
      TableName: 'UserData',
      Item: {
        'userId': { S: userId },
        'userName': { S: userName },
        'fileName': { S: fileName },
        'description': { S: description },
        'fileCreatedTime': { S: fileCreationTime },
        'fileUpdatedTime': { S: new Date().toString() }
      }
    };
  
    // Call DynamoDB to add the item to the table
    ddb.putItem(ddbparams, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data);
      }
    });
  }

});



app.delete('/delete_file', function (req, res) {
  console.log("REQUEST param ", req.body);
  if (!req.body || !req.body.hasOwnProperty('deleteFile')) {
    return res.status(400).send('deleteFile missing in body');
  }
  const fileDeletePath = req.body.deleteFile
  const userId = req.body.userId
  console.log(s3)
  // Setting up S3 delete parameters
  const params = {
    Bucket: bucket_name,
    Key: fileDeletePath
    /*  Delete: { 
         Objects: [ 
           {
             Key: fileDeletePath 
           }
         ],
       }, This method is useful when you want to delete multiple files */
  };
  // Deleting files to the bucket
  s3.deleteObject(params, function (err, data) {
    if (err) {
      console.log("Error in deleting file", err);
      return res.status(500).send(`Can not delete the file. ${err}`)
    } else {
      deleteDatabaseEntry();
      console.log(`File deleted successfully.`);
      return res.status(200).send(`File deleted successfully.`);
    }

  });
  function deleteDatabaseEntry() {
    const ddbparams = {
      TableName: 'UserData',
      Key: {
        "userId": { "S": userId }

      }
    };
    // Call DynamoDB to delete the item from the table
    ddb.deleteItem(ddbparams, function (err, data) {
      console.log
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data);
      }
    });
  }
});

app.get('/getUserData/:userName', function (req, res) {
  var docClient = new AWS.DynamoDB.DocumentClient();
  
  var table = "UserData";
  const userName = req.params.userName
  console.log("userName:"+userName)
  var params = {
      TableName: table,
      FilterExpression: '#userName = :userName',
      ExpressionAttributeNames: {
        '#userName' : 'userName'
      },
      ExpressionAttributeValues: {
        ':userName' : userName
      }

  };
  
  docClient.scan(params, function(err, data) {
      if (err) {
          console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
          return res.status(500).send(`Can not get the data. ${err}`)
      } else {
          console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
          return res.status(200).json(data.Items);
      }
  });
  
});

app.get('/getAdminData', function (req, res) {
  var docClient = new AWS.DynamoDB.DocumentClient();
  var params = {
    TableName: 'UserData',
    /*  Key: {
       'userId': {N: '001'}
     },
     ProjectionExpression: 'ATTRIBUTE_NAME' */
  };

  // Call DynamoDB to read the item from the table
  docClient.scan(params, function (err, data) {
    if (err) {
      console.log("Error", err);
      return res.status(500).send(`Can not get the data. ${err}`)
    } else {
      console.log("Success", data.Items);
      return res.status(200).json(data.Items);
      //return res.status(200).json(data);
    }
  });
});


app.listen(port, () => console.log(`cloud project app listening on port ${port}!`))