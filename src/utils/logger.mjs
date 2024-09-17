import fs from 'fs';
import path from 'path';

export default class Logger {
  constructor() {
    const appDir = path.resolve();

    this.logEntries = [];
    this.logDir = path.join(appDir, 'logs'); // Directory to store log files
    this.ensureLogDirectory();
    this.currentLogFile = this.getLogFileName();
  }

  // Ensure the log directory exists
  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
    }
  }

  // Get the current date's log file name
  getLogFileName() {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return path.join(this.logDir, `${date}.json`);
  }

  // Log an entry
  log(entry) {
    this.logEntries.push(entry);
    this.writeLogs();
  }

  // Write logs to file
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
