import * as vscode from 'vscode';
import * as path from 'path';
import { extractExportedClasses, handler, getClassName } from '../../general';

jest.mock('vscode', () => ({
  workspace: {
    rootPath: '/mock/root',
    fs: {
      readFile: jest.fn(),
      writeFile: jest.fn(),
      stat: jest.fn(),
    },
    findFiles: jest.fn(),
  },
  Uri: {
    file: jest.fn((f) => ({ fsPath: f, path: f })),
  },
  window: {
    showErrorMessage: jest.fn(),
  },
  RelativePattern: jest.fn(),
}));

jest.mock('path', () => ({
  basename: jest.fn((path) => path.split('/').pop()),
  dirname: jest.fn((path) => path.split('/').slice(0, -1).join('/')),
}));

// Mock the imported functions from '../../general'
jest.mock('../../general', () => ({
  extractExportedClasses: jest.fn(),
  handler: jest.requireActual('../../general').handler,
  getClassName: jest.requireActual('../../general').getClassName,
}));

describe('Angular Rename Handler and Related Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handler', () => {
    it('should handle renaming of Angular files', async () => {
      const mockFile = {
        oldUri: { path: '/old/path/old-name.service.ts' },
        newUri: { path: '/new/path/new-name.service.ts' },
      };

      (vscode.workspace.fs.readFile as jest.Mock).mockResolvedValue(Buffer.from('mock content'));
      (extractExportedClasses as jest.Mock).mockReturnValue(['OldNameService']);
      (vscode.workspace.findFiles as jest.Mock).mockResolvedValue([{ fsPath: '/mock/file.ts' }]);

      await handler(mockFile);

      expect(vscode.workspace.fs.readFile).toHaveBeenCalled();
      expect(vscode.workspace.fs.writeFile).toHaveBeenCalled();
    });

    it('should not process if file type is not recognized', async () => {
      const mockFile = {
        oldUri: { path: '/old/path/old-name.unknown.ts' },
        newUri: { path: '/new/path/new-name.unknown.ts' },
      };

      await handler(mockFile);

      expect(vscode.workspace.fs.readFile).not.toHaveBeenCalled();
      expect(vscode.workspace.fs.writeFile).not.toHaveBeenCalled();
    });
  });

  describe('getClassName', () => {
    it('should generate correct class name', () => {
      expect(getClassName('my-service', 'service')).toBe('MyServiceService');
      expect(getClassName('auth-guard', 'guard')).toBe('AuthGuardGuard');
    });
  });

  // Note: replaceClassName and replaceInProject are not exported, so we can't test them directly
  // You might want to consider exporting these functions for testing purposes

  // If you decide to export replaceClassName and replaceInProject, you can uncomment and adjust these tests:
  /*
  describe('replaceClassName', () => {
    it('should replace class name in file content', async () => {
      const mockContent = 'export class OldNameService {}';
      (vscode.workspace.fs.readFile as jest.Mock).mockResolvedValue(Buffer.from(mockContent));
      (vscode.workspace.fs.stat as jest.Mock).mockResolvedValue(true);

      await replaceClassName('new-name', 'OldNameService', 'service', '/path/to/file.ts');

      expect(vscode.workspace.fs.writeFile).toHaveBeenCalledWith(
        expect.anything(),
        expect.any(Buffer)
      );
    });
  });

  describe('replaceInProject', () => {
    it('should replace references in project files', async () => {
      (vscode.workspace.findFiles as jest.Mock).mockResolvedValue([{ fsPath: '/mock/file.ts' }]);
      (vscode.workspace.fs.readFile as jest.Mock).mockResolvedValue(Buffer.from('import { OldNameService } from "./old-name.service";'));

      await replaceInProject('old-name', 'new-name', 'service', '/path/to/new-name.service.ts', 'OldNameService');

      expect(vscode.workspace.findFiles).toHaveBeenCalled();
      expect(vscode.workspace.fs.writeFile).toHaveBeenCalled();
    });
  });
  */
});