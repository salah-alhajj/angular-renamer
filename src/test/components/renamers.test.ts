import * as vscode from 'vscode';
import * as path from 'path';
import { renameAngularComponentFiles } from '../../components/renamers';

jest.mock('vscode', () => ({
  workspace: {
    fs: {
      rename: jest.fn(),
    },
  },
  Uri: {
    file: jest.fn((f) => ({ fsPath: f })),
  },
}));

jest.mock('path', () => ({
  join: jest.fn((a, b) => `${a}/${b}`),
}));

describe('renameAngularComponentFiles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should rename Angular component files correctly', async () => {
    const folderPath = '/path/to/component';
    const oldComponentName = 'old-component';
    const newComponentName = 'new-component';

    // Mock successful rename for all files
    (vscode.workspace.fs.rename as jest.Mock).mockResolvedValue(undefined);

    await renameAngularComponentFiles(folderPath, oldComponentName, newComponentName);

    // Check if rename was called for the first three files (always present)
    expect(vscode.workspace.fs.rename).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything()
    );
    expect(vscode.workspace.fs.rename).toHaveBeenCalledTimes(4); // 3 main files + 1 style file

    // Check specific rename calls
    expect(vscode.workspace.fs.rename).toHaveBeenCalledWith(
      vscode.Uri.file(`${folderPath}/${oldComponentName}.component.spec.ts`),
      vscode.Uri.file(`${folderPath}/${newComponentName}.component.spec.ts`)
    );
    expect(vscode.workspace.fs.rename).toHaveBeenCalledWith(
      vscode.Uri.file(`${folderPath}/${oldComponentName}.component.ts`),
      vscode.Uri.file(`${folderPath}/${newComponentName}.component.ts`)
    );
    expect(vscode.workspace.fs.rename).toHaveBeenCalledWith(
      vscode.Uri.file(`${folderPath}/${oldComponentName}.component.html`),
      vscode.Uri.file(`${folderPath}/${newComponentName}.component.html`)
    );
  });

  it('should handle errors when renaming files', async () => {
    const folderPath = '/path/to/component';
    const oldComponentName = 'old-component';
    const newComponentName = 'new-component';

    // Mock failed rename for all files
    (vscode.workspace.fs.rename as jest.Mock).mockRejectedValue(new Error('File not found'));

    await renameAngularComponentFiles(folderPath, oldComponentName, newComponentName);

    // Check if rename was attempted for all files
    expect(vscode.workspace.fs.rename).toHaveBeenCalledTimes(7); // All possible files
  });

  it('should rename only existing style file', async () => {
    const folderPath = '/path/to/component';
    const oldComponentName = 'old-component';
    const newComponentName = 'new-component';

    // Mock successful rename for main files and one style file (e.g., .scss)
    (vscode.workspace.fs.rename as jest.Mock)
      .mockResolvedValueOnce(undefined) // spec.ts
      .mockResolvedValueOnce(undefined) // .ts
      .mockResolvedValueOnce(undefined) // .html
      .mockRejectedValueOnce(new Error('File not found')) // .css
      .mockResolvedValueOnce(undefined) // .scss
      .mockRejectedValue(new Error('File not found')); // other style files

    await renameAngularComponentFiles(folderPath, oldComponentName, newComponentName);

    expect(vscode.workspace.fs.rename).toHaveBeenCalledTimes(5); // 3 main files + 2 style file attempts

    // Check if .scss file was renamed
    expect(vscode.workspace.fs.rename).toHaveBeenCalledWith(
      vscode.Uri.file(`${folderPath}/${oldComponentName}.component.scss`),
      vscode.Uri.file(`${folderPath}/${newComponentName}.component.scss`)
    );
  });
});