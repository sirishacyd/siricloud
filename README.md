# CMPE 281: project1 Siri Cloud
*	University Name: San Jose State University http://www.sjsu.edu/ 
*	Course: [Cloud Technologies](http://info.sjsu.edu/web-dbgen/catalog/courses/CMPE281.html)
*	Student: [Sirisha Polisetty](https://www.linkedin.com/in/sirishapolisetty/)
* Website Link: https://saraswati.app/
* Demo Link: https://www.youtube.com/watch?v=lnRKVQaZ9bk

### Project Introduction

* Siri Cloud, is an highly available, highly scalable web application, which lets users store their data in the cloud and access from anywhere they want. 
I Have leveraged the following services for various uses in my three tier web application architecture which has a front end that has authentication  by leveraging AWS Cognito. Backend that was hosted using  aws ec2 service with load balancer and auto scaling groups.  I have used dynamodb to store user data about all the files that are uploaded by the users.


![Diagram](https://user-images.githubusercontent.com/103618216/196087012-d2239dd7-4bb8-4d3d-8f60-6d451cdfbe55.jpg)

### AWS services used for project


* EC2:used to host the frontend and backend of my application, leveraged the autoscaling groups, security groups, AMIs for design an highly scalable solution for my application 
 
* ELB :Created an Classic Elastic load balancer attached to my EC2 auto scaling groups to server the user traffic.

* Lambda : Aws lambda has been used to create a lambda function to alert admin whenever delete occurred due to S3 object store lifecycle expiry kicks in.

* AutoScaling Group :  An auto scaling group has been created with 1 instance for my application that can scale up to three instances based on the traffic that my application is receiving

* DynamoDB (Single AZ RDS):I have used dynamo DB with multi-region replication due to cost limitations with RDS.  I have used dynamo DB to store the userdata and upload data for my user and leveraged that to manage the various user operations like create, update and delete.

* CloudFront:Created a cloudfront distribution tether with the s3 bucket for secure access of objects by the user using my application.

* S3 :Created Three Buckets in my application with a multi region access point and with enabled replication across the buckets to ensure a highly available solution.
* S3 Transfer Acceleration:Used s3 Transfer acceleration for faster sync between the multiple s3 buckets.

* R53:Route 53 is used to create hosted zone and link my domain name with my application https://saraswati.app	

* CloudWatch:Cloud watch alerts are set up for ec2 and load balancer health to help us manage the unforeseen events with the cpu utilization and health of ec2 instances in turn my application. 

* SNS:SNS has been integrated with events in the s3 bucket as well as the cloudwatch alerts to notify us using email and SMS.

* AWS  IAM:AWS IAM has been used to create permission policies and roles for the various resources I have created as part of my project.

* AWS Certificate Manager:Leveraged AWS Certificate Manager to create SSL certificates and made https://saraswati.app  secure for all traffic from the internet.


### Features:

```
* User View
* Admin view
* Register to siricloud application
* Sign in using username and password
* View Details including file name, uploaded time, updated time ,file size,description
* Upload the image
* Edit the image
* Delete the image
* Logout
```

### Instructions to run Backend.

```
cd backend
setup aws keys in .env
npm install
node src/app.js
```


### Instructions to run Frontend.

```
cd frontend
npm install
npm start
```

### Deliverables :
```

- Application is Hosted at [https://saraswati.app/](https://saraswati.app/)
- Code is committed at [https://github.com/sirishacyd/siricloud](https://github.com/sirishacyd/siricloud)
```


### Tech Stack :
```

- Frontend : react.js application
- Backend : node.js application
- Database : DynamoDB
- File Hosting : Amazon S3
```


### Screenshots


* Home Page/Landing Page:

<img width="1056" alt="Home" src="https://user-images.githubusercontent.com/103618216/196087805-40f24eaa-232c-4592-befb-344af64dc3c2.png">

* Self-Registration Page:

<img width="810" alt="Self" src="https://user-images.githubusercontent.com/103618216/196090773-714aa323-f9ea-4941-8994-283ac8a7ae99.png">

* File Upload:

<img width="846" alt="upload" src="https://user-images.githubusercontent.com/103618216/196090791-6f5a0b0e-fbb2-48e7-bb2a-43ded74f8b4f.png">


* File Download:

<img width="1040" alt="Download1" src="https://user-images.githubusercontent.com/103618216/196090822-77afc629-b2e4-4039-b68c-c022445aa620.png">

* File Download Routed to AWS Cloudfront with Restricted access only from cloudfront:

<img width="956" alt="Download2" src="https://user-images.githubusercontent.com/103618216/196090835-42b1d205-6433-42ac-80d1-d69b8ede27fe.png">

* File Edit: 

<img width="957" alt="Edit" src="https://user-images.githubusercontent.com/103618216/196090867-75dcf510-0ce3-45b9-b1a0-bc2ea44b785f.png">


* File Delete:

*     Before Delete

<img width="980" alt="Delete" src="https://user-images.githubusercontent.com/103618216/196090900-230ce976-20f6-4c87-a46e-e28cbccaf2d2.png">

*     After Delete:

<img width="1041" alt="del" src="https://user-images.githubusercontent.com/103618216/196090993-2d106054-ab03-4372-96fa-07f2a7c62118.png">


