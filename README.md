# Activity Generator
Generates and logs endpoint activity. Used for testing the EDR agent by allowing us to compare the logs of this app to the data capture by the EDR agent

## Getting Started

### Prerequisites
  Ensure a recent version of Node is installed
  Note: NPM is not required except for the convenience of using npm run

  ```sh
   node -v # greater than 18
  ```

### Install
  Clone the project from github
  ```
  
  ```
### Quick Start

In terminal window 1
```sh
npm run request_server
```
In terminal window 2
```sh
npm run sample
```
## Usage

This program takes one argument: the path to an instructions file. This file should be in JSON format with the following structure:

Example:
```json
{
    "actions": [
      {
        "action": "run process",
        "command": "/bin/ls",
        "args": [
          "-l"
        ]
      },
      {
        "action": "create file",
        "path": "./temp/temp1.txt",
        "content": "temp 1"
      },
    ]
}
```

See a more complete examples [here](./tools/sample_instructions.json)


## Run
```sh
  npm run start ./tools/sample_instructions.json
```

### Output
The output from a run will be saved in the `./logs` directory. 

## Development Tools

### Example Instruction File
In the `tools` directory, you will find a sample instructions file. This serves as both documentation and an instruction set useful for development, as it covers all use cases.

### TCP/UDP Server
Run the included server during development to create a destination for network requests.

In a separate terminal window run:
```
npm run request-server
```

## Test
Run unit tests with the following command:

```
npm run test
```

## TODO / Roadmap

### More Testing
While there is some testing of the core components we could add some more unit testing as well as a full integration test.

### Argument for output/log file
Currently, log files are saved in the ./logs directory. We should consider allowing an argument to specify an output file location.

### Windows Support
To support Windows, we may need to adjust how we resolve file paths.

## Possible Issues
Here are a few possible issue we might see once we start testing this with the Endpoint Detection and Response (EDR) agent

1. Network Request Data Size: There may be a mismatch between what we report and what the EDR captures. This might need reconciliation.
2. Network Request Fail/Success: Currently, TCP network requests are marked as failed if there is no connection. This may need reconciliation with how EDR captures failed network requests. (Note: This issue does not occur with UDP.)




