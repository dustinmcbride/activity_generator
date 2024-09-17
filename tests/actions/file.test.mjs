import fs from "fs";
import os from "os";
import path from "path";
import { ACTIONS, ACTIONS_STATUSES } from "../../src/utils/const.mjs";
import { strict as assert } from "assert";
import { deleteFile, modifyFile, createFile } from "../../src/actions/file.mjs"; // Adjust the path to the makeRequest module
import { describe, it, beforeEach} from "node:test";

describe("File Operations", () => {
  const tempDir = path.join(os.tmpdir(), "test_file_operations");
  const filePath = path.join(tempDir, "test.txt");
  const content = "Hello, world!";
  const appendContent = "Appended text.";

  beforeEach(() => {
    // Ensure the temp directory is clean before running tests
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe("createFile", () => {
    it("should successfully create a file", () => {
      const result = createFile(filePath, content);

      assert.equal(result.action, ACTIONS.createFile);
      assert.equal(result.status, ACTIONS_STATUSES.success);
      assert.equal(result.errorMessage, null);
      assert.equal(fs.existsSync(filePath), true);
      assert.equal(fs.readFileSync(filePath, "utf-8"), content);
    });

    it("should fail if the file already exists", () => {
      createFile(filePath, content);
      const result = createFile(filePath, content);

      assert.equal(result.action, ACTIONS.createFile);
      assert.equal(result.status, ACTIONS_STATUSES.fail);
      assert.equal(result.errorMessage, "File already exists");
    });
  });

  describe("modifyFile", () => {
    it("should successfully modify an existing file", () => {
      createFile(filePath, content);
      const result = modifyFile(filePath, appendContent);

      assert.equal(result.action, ACTIONS.modifyFile);
      assert.equal(result.status, ACTIONS_STATUSES.success);
      assert.equal(result.errorMessage, null);
      assert.equal(fs.existsSync(filePath), true);
      assert.equal(fs.readFileSync(filePath, "utf-8"), content + appendContent);
    });

    it("should fail if the file does not exist", () => {
      const result = modifyFile(filePath, appendContent);

      assert.equal(result.status, ACTIONS_STATUSES.fail);
    });
  });

  describe("deleteFile", () => {
    it("should successfully delete an existing file", () => {
      createFile(filePath, content);
      const result = deleteFile(filePath);

      assert.equal(result.action, ACTIONS.deleteFile);
      assert.equal(result.status, ACTIONS_STATUSES.success);
      assert.equal(result.errorMessage, null);
      assert.equal(fs.existsSync(filePath), false);
    });

    it("should fail if the file does not exist", () => {
      const result = deleteFile(filePath);

      assert.equal(result.action, ACTIONS.deleteFile);
      assert.equal(result.status, ACTIONS_STATUSES.fail);
    });
  });
});
