import * as vscode from 'vscode';
import * as path from 'path';
import { handler, getClassName, replaceClassName, replaceInProject } from '../../general/handlers';
import { renameAngularFiles } from '../../general/renamers';
import { extractExportedClasses, extractImports, getImportLines } from '../../general/utilities';

jest.mock('vscode', () => ({
  workspace: {
    fs: {
      readFile: jest.fn(),
      writeFile: jest.fn(),
      stat: jest.fn(),
    },
    rootPath: '/mock/root',
    findFiles: jest.fn(),
  },
  Uri: {
    file: jest.fn((f) => ({ fsPath: f, path: f })),
  },
  RelativePattern: jest.fn(),
  window: {
    showErrorMessage: jest.fn(),
  },
}));

jest.mock('path', () => ({
  basename: jest.fn((p) => p.split('/').pop()),
  dirname: jest.fn((p) => p.split('/').slice(0, -1).join('/')),
}));

jest.mock('../../general/renamers', () => ({
  renameAngularFiles: jest.fn(),
}));

jest.mock('../../general/utilities', () => ({
  extractExportedClasses: jest.fn(),
  extractImports: jest.fn().mockReturnValue([]),
  getImportLines: jest.fn(),
}));

describe('Angular Handlers and Utility Functions', () => {
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
      (vscode.workspace.findFiles as jest.Mock).mockResolvedValue([
        { fsPath: '/mock/file1.ts' },
        { fsPath: '/mock/file2.ts' },
      ]);
      (extractImports as jest.Mock).mockReturnValue([]);

      await handler(mockFile);

      expect(renameAngularFiles).toHaveBeenCalledWith(
        '/new/path',
        'old-name',
        'new-name',
        'service'
      );
      expect(vscode.workspace.fs.readFile).toHaveBeenCalled();
    });


    it('should not process if file type is not recognized', async () => {
      const mockFile = {
        oldUri: { path: '/old/path/old-name.unknown.ts' },
        newUri: { path: '/new/path/new-name.unknown.ts' },
      };

      await handler(mockFile);

      expect(renameAngularFiles).not.toHaveBeenCalled();
    });

    it('should handle spec files', async () => {
      const mockFile = {
        oldUri: { path: '/old/path/old-name.service.spec.ts' },
        newUri: { path: '/new/path/new-name.service.spec.ts' },
      };

      (vscode.workspace.fs.readFile as jest.Mock).mockResolvedValue(Buffer.from('mock content'));
      (extractExportedClasses as jest.Mock).mockReturnValue(['OldNameService']);
      (vscode.workspace.findFiles as jest.Mock).mockResolvedValue([
        { fsPath: '/mock/file1.ts' },
        { fsPath: '/mock/file2.ts' },
      ]);

      await handler(mockFile);

      expect(renameAngularFiles).toHaveBeenCalledWith(
        '/new/path',
        'old-name',
        'new-name',
        'service'
      );
    });
  });

  describe('getClassName', () => {
    it('should generate correct class name', () => {
      expect(getClassName('my-service', 'service')).toBe('MyServiceService');
      expect(getClassName('auth-guard', 'guard')).toBe('AuthGuardGuard');
      expect(getClassName('custom-pipe', 'pipe')).toBe('CustomPipePipe');
      expect(getClassName('highlight-directive', 'directive')).toBe('HighlightDirectiveDirective');
    });
  });

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

    it('should not write file if content is unchanged', async () => {
      const mockContent = 'export class OldNameService {}';
      (vscode.workspace.fs.readFile as jest.Mock).mockResolvedValue(Buffer.from(mockContent));
      (vscode.workspace.fs.stat as jest.Mock).mockResolvedValue(true);

      await replaceClassName('old-name', 'OldNameService', 'service', '/path/to/file.ts');

      expect(vscode.workspace.fs.writeFile).not.toHaveBeenCalled();
    });

    it('should handle errors when replacing class name', async () => {
      (vscode.workspace.fs.readFile as jest.Mock).mockRejectedValue(new Error('Read error'));

      await replaceClassName('new-name', 'OldNameService', 'service', '/path/to/file.ts');

      expect(vscode.window.showErrorMessage).toHaveBeenCalledWith(expect.stringContaining('Error replacing class name'));
    });
  });

  describe('replaceInProject', () => {
    it('should replace references in project files', async () => {
      (vscode.workspace.findFiles as jest.Mock).mockResolvedValue([
        { fsPath: '/mock/file1.ts' },
        { fsPath: '/mock/file2.ts' },
      ]);
      (vscode.workspace.fs.readFile as jest.Mock).mockResolvedValue(Buffer.from('import { OldNameService } from "./old-name.service";'));
      (getImportLines as jest.Mock).mockReturnValue(['import { OldNameService } from "./old-name.service";']);
      (extractImports as jest.Mock).mockReturnValue([{ moduleName: 'OldNameService', path: './old-name.service' }]);
      (extractExportedClasses as jest.Mock).mockReturnValue(['NewNameService']);

      await replaceInProject('old-name', 'new-name', 'service', '/path/to/new-name.service.ts', 'OldNameService');

      expect(vscode.workspace.findFiles).toHaveBeenCalled();
      expect(vscode.workspace.fs.writeFile).toHaveBeenCalled();
    });

    it('should handle no files found', async () => {
      (vscode.workspace.findFiles as jest.Mock).mockResolvedValue([]);

      await replaceInProject('old-name', 'new-name', 'service', '/path/to/new-name.service.ts', 'OldNameService');

      expect(vscode.workspace.findFiles).toHaveBeenCalled();
      expect(vscode.workspace.fs.writeFile).not.toHaveBeenCalled();
    });

    it('should handle errors when no workspace is open', async () => {
      (vscode.workspace as any).rootPath = undefined;

      await replaceInProject('old-name', 'new-name', 'service', '/path/to/new-name.service.ts', 'OldNameService');

      expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('No workspace folder open.');
    });
  });
});