import { strict as assert } from "assert";
import { describe, it, after } from "node:test";

import runProcess from "../../src/actions/run_process.mjs";
import { ACTIONS, ACTIONS_STATUSES } from "../../src/utils/const.mjs";

describe("run process", () => {
  it("should run a valid process successfully", () => {
    const result = runProcess("echo", ["hello"]);

    assert.equal(result.action, ACTIONS.runProcess);
    assert.equal(result.status, ACTIONS_STATUSES.success);
    assert.equal(result.errorMessage, null);
    assert.equal(result.processName, "echo");
    assert.equal(result.commandLine, "echo hello");
    assert.ok(typeof result.processId === "number");
    assert.ok(typeof result.username === "string");
    assert.ok(typeof result.timestamp === "string");
  });

  it("should fail for an invalid process", () => {
    const result = runProcess(null);

    assert.equal(result.action, ACTIONS.runProcess);
    assert.equal(result.status, ACTIONS_STATUSES.fail);
    assert.ok(typeof result.errorMessage === "string");
    assert.equal(result.processName, null);
    assert.equal(result.commandLine, "");
    assert.equal(result.processId, undefined);
    assert.ok(typeof result.username === "string");
    assert.ok(typeof result.timestamp === "string");
  });
});
