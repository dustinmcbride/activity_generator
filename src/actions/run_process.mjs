import { spawn } from "child_process";
import os from "os";
import { ACTIONS, ACTIONS_STATUSES } from "../utils/const.mjs";

export default function runProcess(path, args = []) {
  let status = ACTIONS_STATUSES.success;
  let errorMessage = null;
  const timestamp = new Date().toISOString();
  let child = null;

  try {
    child = spawn(path, args);
  } catch (e) {
    status = ACTIONS_STATUSES.fail;
    errorMessage = e.message;
  }


  return {
    action: ACTIONS.runProcess,
    timestamp,
    username: os.userInfo().username,
    processName: path,
    commandLine: [path, ...args].join(" "),
    processId: child?.pid,
    status,
    errorMessage,
  };
}
