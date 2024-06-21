import * as vscode from 'vscode';
import { isDirectory, isAngularComponent, isAngularProject, checkOldFile } from '../../general';

jest.mock('vscode');

describe('Checker functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isDirectory', () => {
    it('should return true for directories', async () => {
      (vscode.workspace.fs.stat as jest.Mock).mockResolvedValue({ type: vscode.FileType.Directory });
      const result = await isDirectory('/path/to/dir');
      expect(result).toBe(true);
    });

    it('should return false for files', async () => {
      (vscode.workspace.fs.stat as jest.Mock).mockResolvedValue({ type: vscode.FileType.File });
      const result = await isDirectory('/path/to/file');
      expect(result).toBe(false);
    });
  });

  describe('isAngularComponent', () => {
    it('should return true for Angular component directories', async () => {
      (vscode.workspace.fs.readDirectory as jest.Mock).mockResolvedValue([
        ['component.component.ts', vscode.FileType.File],
        ['component.component.html', vscode.FileType.File],
        ['component.component.css', vscode.FileType.File],
      ]);
      const result = await isAngularComponent('/path/to/component');
      expect(result).toBe(true);
    });

    it('should return false for non-component directories', async () => {
      (vscode.workspace.fs.readDirectory as jest.Mock).mockResolvedValue([
        ['file.ts', vscode.FileType.File],
      ]);
      const result = await isAngularComponent('/path/to/non-component');
      expect(result).toBe(false);
    });
  });

  describe('isAngularProject', () => {
    it('should return true if angular.json exists', async () => {
      (vscode.workspace.workspaceFile as any) = { fsPath: '/path/to/workspace.code-workspace' };
      (vscode.workspace.fs.readDirectory as jest.Mock).mockResolvedValue([
        ['angular.json', vscode.FileType.File],
      ]);
      const result = await isAngularProject();
      expect(result).toBe(true);
    });

    it('should return false if angular.json does not exist', async () => {
      (vscode.workspace.workspaceFile as any) = { fsPath: '/path/to/workspace.code-workspace' };
      (vscode.workspace.fs.readDirectory as jest.Mock).mockResolvedValue([]);
      const result = await isAngularProject();
      expect(result).toBe(false);
    });
  });

  describe('checkOldFile', () => {
    it('should delete old file if it exists', async () => {
      (vscode.workspace.fs.stat as jest.Mock).mockResolvedValue({});
      await checkOldFile('/path/to/old/file');
      expect(vscode.workspace.fs.delete).toHaveBeenCalled();
    });

    it('should return false if old file does not exist', async () => {
      (vscode.workspace.fs.stat as jest.Mock).mockRejectedValue(new Error('File not found'));
      const result = await checkOldFile('/path/to/nonexistent/file');
      expect(result).toBe(false);
    });
  });
});