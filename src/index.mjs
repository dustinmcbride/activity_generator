import runProcess from "./actions/run_process.mjs";
import Logger from "./utils/logger.mjs";
import { ACTIONS, ACTIONS_STATUSES } from "./utils/const.mjs";
import { createFile, deleteFile, modifyFile } from "./actions/file.mjs";
import networkRequest from "./actions/network.mjs";
import loadInstructionsFile from "./utils/load_instructions.mjs";

const logger = new Logger();

// Load instructions file
const instructions = loadInstructionsFile();

console.log(`Running ${instructions.length} actions...`);
console.log(`Current PID: ${process.pid}`);

// Run instructions
let failedActionCount = 0;
let actionResults = null;

instructions.forEach(async (instruction) => {
  switch (instruction.action) {
    case ACTIONS.runProcess:
      actionResults = runProcess(instruction.command, instruction.args);
      break;
    case ACTIONS.createFile:
      actionResults = createFile(instruction.path, instruction.content);
      break;
    case ACTIONS.modifyFile:
      actionResults = modifyFile(instruction.path, instruction.content);
      break;
    case ACTIONS.deleteFile:
      actionResults = deleteFile(instruction.path);
      break;
    case ACTIONS.networkRequest:
      actionResults = await networkRequest({
        protocol: instruction.protocol,
        host: instruction.host,
        port: instruction.port,
        message: instruction.message,
      });
      break;
    default:
      actionResults = {
        action: instruction.action,
        status: ACTIONS_STATUSES.fail,
        errorMessage: "Invalid action name",
      };
  }

  if (actionResults.status !== ACTIONS_STATUSES.success) {
    failedActionCount += 1;
  }

  logger.log(actionResults);
});

let actionSuccessfulCount = instructions.length - failedActionCount;

console.log(
  `Completed ${actionSuccessfulCount} of ${instructions.length} actions successfully`
);
console.log(`See logs in ${logger.getLogFileName()}\n`);
