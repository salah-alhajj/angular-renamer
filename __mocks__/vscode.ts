const vscode = {
    workspace: {
      fs: {
        readFile: jest.fn(),
        writeFile: jest.fn(),
        rename: jest.fn(),
        stat: jest.fn(),
        delete: jest.fn()
      },
      onDidRenameFiles: jest.fn()
    },
    Uri: {
      file: jest.fn(f => ({ fsPath: f }))
    },
    FileType: {
      Directory: 2,
      File: 1
    },
    window: {
      showErrorMessage: jest.fn()
    }
  };
  
  module.exports = vscode;