import * as vscode from 'vscode';
import * as Components from '../components';
import * as General from '../general';
import { activate } from '../extension';

jest.mock('vscode', () => ({
  workspace: {
    onDidRenameFiles: jest.fn(),
  },
  Uri: {
    file: jest.fn((path) => ({ path, scheme: 'file' })),
  },
}));

jest.mock('../components', () => ({
  componentHandler: jest.fn(),
}));

jest.mock('../general', () => ({
  isAngularComponent: jest.fn(),
  handler: jest.fn(),
}));

describe('Extension Activation', () => {
  let mockContext: vscode.ExtensionContext;
  let onDidRenameFilesCallback: (event: vscode.FileRenameEvent) => Promise<void>;

  beforeEach(() => {
    mockContext = {} as vscode.ExtensionContext;
    (vscode.workspace.onDidRenameFiles as jest.Mock).mockImplementation((callback) => {
      onDidRenameFilesCallback = callback;
    });
    jest.clearAllMocks();
  });

  it('should register onDidRenameFiles event handler', () => {
    activate(mockContext);
    expect(vscode.workspace.onDidRenameFiles).toHaveBeenCalled();
  });

  it('should call componentHandler for Angular component files', async () => {
    activate(mockContext);

    const mockFile = {
      oldUri: vscode.Uri.file('/old/path/component.ts'),
      newUri: vscode.Uri.file('/new/path/component.ts'),
    };
    const mockEvent: vscode.FileRenameEvent = { files: [mockFile] };

    (General.isAngularComponent as jest.Mock).mockResolvedValue(true);

    await onDidRenameFilesCallback(mockEvent);

    expect(General.isAngularComponent).toHaveBeenCalledWith('/new/path/component.ts');
    expect(Components.componentHandler).toHaveBeenCalledWith(mockFile);
    expect(General.handler).not.toHaveBeenCalled();
  });

  it('should call general handler for non-Angular component files', async () => {
    activate(mockContext);

    const mockFile = {
      oldUri: vscode.Uri.file('/old/path/service.ts'),
      newUri: vscode.Uri.file('/new/path/service.ts'),
    };
    const mockEvent: vscode.FileRenameEvent = { files: [mockFile] };

    (General.isAngularComponent as jest.Mock).mockResolvedValue(false);

    await onDidRenameFilesCallback(mockEvent);

    expect(General.isAngularComponent).toHaveBeenCalledWith('/new/path/service.ts');
    expect(Components.componentHandler).not.toHaveBeenCalled();
    expect(General.handler).toHaveBeenCalledWith(mockFile);
  });

  it('should handle multiple files in a single event', async () => {
    activate(mockContext);

    const mockFiles = [
      {
        oldUri: vscode.Uri.file('/old/path/component.ts'),
        newUri: vscode.Uri.file('/new/path/component.ts'),
      },
      {
        oldUri: vscode.Uri.file('/old/path/service.ts'),
        newUri: vscode.Uri.file('/new/path/service.ts'),
      },
    ];
    const mockEvent: vscode.FileRenameEvent = { files: mockFiles };

    (General.isAngularComponent as jest.Mock)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    await onDidRenameFilesCallback(mockEvent);

    expect(General.isAngularComponent).toHaveBeenCalledTimes(2);
    expect(Components.componentHandler).toHaveBeenCalledWith(mockFiles[0]);
    expect(General.handler).toHaveBeenCalledWith(mockFiles[1]);
  });
});