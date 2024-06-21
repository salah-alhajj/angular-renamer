import * as vscode from 'vscode';
jest.mock('vscode');
import { renameAngularComponentFiles } from '../../components/renamers';

describe('renameAngularComponentFiles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should rename component files', async () => {
    await renameAngularComponentFiles('/path/to/component', 'old-component', 'new-component');

    expect(vscode.workspace.fs.rename).toHaveBeenCalledTimes(4); // 3 main files + 1 style file
    expect(vscode.workspace.fs.rename).toHaveBeenCalledWith(
      expect.any(vscode.Uri),
      expect.any(vscode.Uri)
    );
  });

  it('should handle errors when renaming files', async () => {
    (vscode.workspace.fs.rename as jest.Mock).mockRejectedValue(new Error('Rename error'));

    await renameAngularComponentFiles('/path/to/component', 'old-component', 'new-component');

    // Even if some renames fail, it should attempt to rename all files
    expect(vscode.workspace.fs.rename).toHaveBeenCalledTimes(7);
  });
});