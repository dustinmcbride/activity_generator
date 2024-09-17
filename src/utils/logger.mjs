import fs from 'fs';
import path from 'path';

export default class Logger {
  constructor() {
    const appDir = path.resolve();

    this.logEntries = [];
    this.logDir = path.join(appDir, 'logs'); 
    this.ensureLogDirectory();
    this.currentLogFile = this.getLogFileName();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
    }
  }

  getLogFileName() {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return path.join(this.logDir, `${date}.json`);
  }

  log(entry) {
    this.logEntries.push(entry);
    this.writeLogs();
  }

  writeLogs() {
    const logFileName = this.currentLogFile;
    let existingLogs = [];

    // Check if the file exists and read existing logs
    if (fs.existsSync(logFileName)) {
      const data = fs.readFileSync(logFileName, 'utf8');
      if (data) {
        existingLogs = JSON.parse(data);
      }
    }

    // Combine existing logs with new entries
    const updatedLogs = existingLogs.concat(this.logEntries);

    // Write to file
    fs.writeFileSync(logFileName, JSON.stringify(updatedLogs, null, 2), 'utf8');

    // Clear the in-memory log entries after writing to file
    this.logEntries = [];
  }
}
