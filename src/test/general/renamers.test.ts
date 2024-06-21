import * as vscode from 'vscode';
import * as path from 'path';
import { renameAngularFiles } from '../../general/renamers';

jest.mock('vscode');

describe('renameAngularFiles', () => {
  const mockRename = vscode.workspace.fs.rename as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRename.mockResolvedValue(undefined);
  });

  it('should rename service files correctly', async () => {
    await renameAngularFiles('/path/to', 'old-service', 'new-service', 'service');

    expect(mockRename).toHaveBeenCalledTimes(2);
    expect(mockRename).toHaveBeenCalledWith(
      vscode.Uri.file('/path/to/old-service.service.ts'),
      vscode.Uri.file('/path/to/new-service.service.ts')
    );
    expect(mockRename).toHaveBeenCalledWith(
      vscode.Uri.file('/path/to/old-service.service.spec.ts'),
      vscode.Uri.file('/path/to/new-service.service.spec.ts')
    );
  });

  it('should rename guard files correctly', async () => {
    await renameAngularFiles('/path/to', 'old-guard', 'new-guard', 'guard');

    expect(mockRename).toHaveBeenCalledTimes(2);
    expect(mockRename).toHaveBeenCalledWith(
      vscode.Uri.file('/path/to/old-guard.guard.ts'),
      vscode.Uri.file('/path/to/new-guard.guard.ts')
    );
    expect(mockRename).toHaveBeenCalledWith(
      vscode.Uri.file('/path/to/old-guard.guard.spec.ts'),
      vscode.Uri.file('/path/to/new-guard.guard.spec.ts')
    );
  });

  it('should handle errors when renaming files', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockRename.mockRejectedValueOnce(new Error('Rename failed'));

    await renameAngularFiles('/path/to', 'old-pipe', 'new-pipe', 'pipe');

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to rename file'));
    expect(mockRename).toHaveBeenCalledTimes(2); // It should still try to rename both files
  });

  it('should use the correct file extensions for different types', async () => {
    await renameAngularFiles('/path/to', 'old-directive', 'new-directive', 'directive');

    expect(mockRename).toHaveBeenCalledWith(
      vscode.Uri.file('/path/to/old-directive.directive.ts'),
      vscode.Uri.file('/path/to/new-directive.directive.ts')
    );
  });
});