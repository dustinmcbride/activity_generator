import fs from "fs";
import os from "os";
import path from "path";
import { ACTIONS, ACTIONS_STATUSES } from "../utils/const.mjs";

export function createFile(filePath, content) {
  let status = ACTIONS_STATUSES.success;
  let errorMessage = null 

  try {
    throwErrorIfFileExists(filePath);
    ensureDirectoryExists(filePath);
    fs.writeFileSync(filePath, content);
  } catch (e) {
    status = ACTIONS_STATUSES.fail;
    errorMessage = e.message;
  }

  return makeResults(status, ACTIONS.createFile, filePath, errorMessage);
}

export function modifyFile(filePath, content) {
  let status = ACTIONS_STATUSES.success;
  let errorMessage = null 

  try {
    throwErrorIfFileDoesNotExists(filePath)
    fs.appendFileSync(filePath, content);
  } catch (e) {
    status = ACTIONS_STATUSES.fail;
    errorMessage = e.message;
  }

  return makeResults(status, ACTIONS.modifyFile, filePath, errorMessage);
}

export function deleteFile(filePath) {
  let status = ACTIONS_STATUSES.success;
  let errorMessage = null 

  try {
    throwErrorIfFileDoesNotExists(filePath)
    fs.unlinkSync(filePath);
  } catch (e) {
    status = ACTIONS_STATUSES.fail;
    errorMessage = e.message;
  }

  return makeResults(status, ACTIONS.deleteFile, filePath, errorMessage);
}

function throwErrorIfFileExists(filePath) {
  if (fs.existsSync(filePath)) {
   throw new Error("File already exists") 
  }
}

function throwErrorIfFileDoesNotExists(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error("File does not exists") 
    }
}

function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function makeResults(status, action, filePath, errorMessage) {
  let realPath = "";

  try {
    realPath = fs.realpathSync(filePath);
  } catch (e) {
    realPath = filePath;
  }

  return {
    action,
    status,
    timestamp: new Date().toISOString(),
    filePath: realPath,
    username: os.userInfo().username,
    execPath: process.execPath,
    processId: process.pid,
    errorMessage
  };
}
