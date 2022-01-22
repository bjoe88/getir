<p align="center">
  <img src="https://seeklogo.com/images/G/getir-logo-489FC74138-seeklogo.com.png" />
</p>

# Getir Challenge

This is a RESTful API service that fetches the data in the
provided MongoDB collection and returned the results in the specific format.

## Requirements

- The code should be written in Node.js using express framework
- The endpoint should just handle HTTP POST requests.
- The application should be deployed on AWS or Heroku. You don’t need to use any
API Gateway, Load Balancers or any other layer than the developed application.
- The up to date repo should be publicly available in Github, Bitbucket or equivalent.


## Deliverables

- The public repo URL which has the source code of the project, and a set of
instructions if there is any project specific configurations needed to run the project. ( https://github.com/bjoe88/getir )
- The public endpoint URL of the deployed API which is available for testing. ( http://54.255.145.143:3000/api/v1/records )

## How to run service locally
To run this service locally, run the command below:
```Bash
# Clone this repository
$ git clone https://github.com/bjoe88/getir

# Navigate into the cloned repository
$ cd getir

# Install dependencies
$ npm install

# Run the app
$ npm run start:dev

# Run test
$ npm run test

# Run coverage
$ npm run coverage
```

## Trade off

Because of the limited time I have to design and build this system. Below is the thing I did not implement

- Security: No security aspect has been considered for this service.
- Resiliency: This service does not have any retry mechanism
- Scalability: This service has been deployed into a single container without any auto-scaling feature
- Monitor: This service has basic monitoring using the log. And it does not have any health-check or alarm
- Pipeline: There is no CICD pipeline setup for this repo. All deployment has been done manually.
- Infrastructure: There is no IAC for this service at the moment.
- Experience: The deploy service does not have DNS attach to it
