import * as vscode from 'vscode';
import * as General from '../../general';
import { replaceClassName } from '../../components/components_handlers';

jest.mock('vscode');
jest.mock('../../src/general');

describe('replaceClassName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should replace class name in file content', async () => {
    const mockFileContent = 'export class OldComponentComponent {}';
    const mockNewContent = 'export class NewComponentComponent {}';

    (vscode.workspace.fs.readFile as jest.Mock).mockResolvedValue(Buffer.from(mockFileContent));
    (General.getClassName as jest.Mock).mockReturnValue('NewComponentComponent');

    await replaceClassName('new-component', 'OldComponentComponent', '/path/to/file.ts');

    expect(vscode.workspace.fs.writeFile).toHaveBeenCalledWith(
      expect.any(vscode.Uri),
      Buffer.from(mockNewContent)
    );
  });

  it('should handle errors', async () => {
    (vscode.workspace.fs.readFile as jest.Mock).mockRejectedValue(new Error('Read error'));

    await replaceClassName('new-component', 'OldComponentComponent', '/path/to/file.ts');

    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith(expect.stringContaining('Error replacing class name'));
  });
});