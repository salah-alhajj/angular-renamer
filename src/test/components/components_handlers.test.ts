import * as vscode from 'vscode';
import * as General from '../../general';
import { replaceClassName } from '../../components/components_handlers';

// Mock vscode namespace
jest.mock('vscode', () => ({
  workspace: {
    fs: {
      readFile: jest.fn(),
      writeFile: jest.fn(),
      stat: jest.fn(),
    },
  },
  Uri: {
    file: jest.fn((f) => ({ fsPath: f })),
  },
  window: {
    showErrorMessage: jest.fn(),
  },
}), { virtual: true });

describe('replaceClassName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should replace class name in file content', async () => {
    const mockFileContent = 'class OldComponent {}';
    const expectedNewContent = 'class NewTestComponent {}';
    
    // Mock file system operations
    (vscode.workspace.fs.readFile as jest.Mock).mockResolvedValue(Buffer.from(mockFileContent));
    (vscode.workspace.fs.stat as jest.Mock).mockResolvedValue(true);
    (vscode.workspace.fs.writeFile as jest.Mock).mockResolvedValue(undefined);

    // Mock General.getClassName
    jest.spyOn(General, 'getClassName').mockReturnValue('NewTestComponent');

    await replaceClassName('new-test', 'OldComponent', '/path/to/file.ts');

    expect(vscode.workspace.fs.readFile).toHaveBeenCalledWith(expect.anything());
    expect(vscode.workspace.fs.writeFile).toHaveBeenCalledWith(
      expect.anything(),
      Buffer.from(expectedNewContent, 'utf8')
    );
    expect(General.getClassName).toHaveBeenCalledWith('new-test', 'component');
  });

  it('should handle file system errors', async () => {
    (vscode.workspace.fs.readFile as jest.Mock).mockRejectedValue(new Error('File read error'));

    await replaceClassName('new-test', 'OldComponent', '/path/to/file.ts');

    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith(expect.stringContaining('File read error'));
  });

  // Add more test cases as needed
});