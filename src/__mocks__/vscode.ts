const vscode = {
  workspace: {
    fs: {
      readFile: jest.fn(),
      writeFile: jest.fn(),
      rename: jest.fn(),
      stat: jest.fn(),
      delete: jest.fn(),
      readDirectory: jest.fn(),
    },
    onDidRenameFiles: jest.fn(),
    workspaceFile: { fsPath: '/mock/workspace/path' },
  },
  Uri: {
    file: jest.fn(f => ({ fsPath: f })),
  },
  FileType: {
    Directory: 2,
    File: 1,
  },
  window: {
    showErrorMessage: jest.fn(),
  },
  ExtensionContext: jest.fn(),
};

module.exports = vscode;