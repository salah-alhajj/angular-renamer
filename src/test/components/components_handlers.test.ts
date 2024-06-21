import * as vscode from 'vscode';
import { replaceClassName } from '../../components/components_handlers';
import * as General from '../../general';

jest.mock('vscode');
jest.mock('../../src/general');

describe('replaceClassName', () => {
  const mockReadFile = vscode.workspace.fs.readFile as jest.Mock;
  const mockWriteFile = vscode.workspace.fs.writeFile as jest.Mock;
  const mockStat = vscode.workspace.fs.stat as jest.Mock;
  const mockShowErrorMessage = vscode.window.showErrorMessage as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReadFile.mockResolvedValue(Buffer.from(''));
    mockWriteFile.mockResolvedValue(undefined);
    mockStat.mockResolvedValue({} as vscode.FileStat);
    (General.getClassName as jest.Mock).mockReturnValue('NewComponentComponent');
  });

  it('should replace class name in file content', async () => {
    const oldContent = 'export class OldComponentComponent {}';
    const newContent = 'export class NewComponentComponent {}';
    mockReadFile.mockResolvedValue(Buffer.from(oldContent));

    await replaceClassName('new-component', 'OldComponentComponent', '/path/to/file.ts');

    expect(mockWriteFile).toHaveBeenCalledWith(
      vscode.Uri.file('/path/to/file.ts'),
      Buffer.from(newContent)
    );
  });

  it('should not write file if content is unchanged', async () => {
    const content = 'export class OldComponentComponent {}';
    mockReadFile.mockResolvedValue(Buffer.from(content));
    (General.getClassName as jest.Mock).mockReturnValue('OldComponentComponent');

    await replaceClassName('old-component', 'OldComponentComponent', '/path/to/file.ts');

    expect(mockWriteFile).not.toHaveBeenCalled();
  });

  it('should handle read file errors', async () => {
    mockReadFile.mockRejectedValue(new Error('Read error'));

    await replaceClassName('new-component', 'OldComponentComponent', '/path/to/file.ts');

    expect(mockShowErrorMessage).toHaveBeenCalledWith(expect.stringContaining('Error replacing class name'));
  });

  it('should handle write file errors', async () => {
    mockReadFile.mockResolvedValue(Buffer.from('export class OldComponentComponent {}'));
    mockWriteFile.mockRejectedValue(new Error('Write error'));

    await replaceClassName('new-component', 'OldComponentComponent', '/path/to/file.ts');

    expect(mockShowErrorMessage).toHaveBeenCalledWith(expect.stringContaining('Error replacing class name'));
  });

  it('should replace multiple occurrences of the class name', async () => {
    const oldContent = `
      export class OldComponentComponent {}
      const instance = new OldComponentComponent();
    `;
    const newContent = `
      export class NewComponentComponent {}
      const instance = new NewComponentComponent();
    `;
    mockReadFile.mockResolvedValue(Buffer.from(oldContent));

    await replaceClassName('new-component', 'OldComponentComponent', '/path/to/file.ts');

    expect(mockWriteFile).toHaveBeenCalledWith(
      vscode.Uri.file('/path/to/file.ts'),
      Buffer.from(newContent)
    );
  });

  it('should not replace partial matches of the class name', async () => {
    const oldContent = `
      export class OldComponentComponent {}
      const notRelated = 'OldComponentComponentUnrelated';
    `;
    const newContent = `
      export class NewComponentComponent {}
      const notRelated = 'OldComponentComponentUnrelated';
    `;
    mockReadFile.mockResolvedValue(Buffer.from(oldContent));

    await replaceClassName('new-component', 'OldComponentComponent', '/path/to/file.ts');

    expect(mockWriteFile).toHaveBeenCalledWith(
      vscode.Uri.file('/path/to/file.ts'),
      Buffer.from(newContent)
    );
  });
});