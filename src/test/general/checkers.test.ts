import * as vscode from 'vscode';
import * as path from 'path';
import {
  isAngularComponent,
  isDirectory,
  isAngularProject,
  checkOldFile,
  isAngularService,
  isAngularGuard,
  isAngularPipe,
  isAngularDirective,
  isAngularWorkspace
} from '../../general/checker';

jest.mock('vscode', () => ({
  workspace: {
    fs: {
      stat: jest.fn(),
      readDirectory: jest.fn(),
      delete: jest.fn(),
      readFile: jest.fn(),
    },
    workspaceFile: { fsPath: '/path/to/workspace/angular.code-workspace' },
    workspaceFolders: [{ uri: { fsPath: '/test/path' } }],
  },
  Uri: {
    file: jest.fn((f) => ({ fsPath: f })),
  },
  FileType: {
    Directory: 2,
    File: 1,
  },
  window: {
    showErrorMessage: jest.fn(),
  },
}));

jest.mock('path', () => ({
  dirname: jest.fn((p) => p.split('/').slice(0, -1).join('/')),
}));


describe('isAngularWorkspace', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return false when there are no workspace folders', async () => {
    (vscode.workspace.workspaceFolders as any) = undefined;
    
    const result = await isAngularWorkspace();
    
    expect(result).toBe(false);
  });

  it('should return true for an Angular workspace', async () => {
    const mockPackageJson = {
      dependencies: {
        '@angular/core': '12.0.0'
      }
    };
    
    (vscode.workspace.fs.readFile as jest.Mock).mockResolvedValue(Buffer.from(JSON.stringify(mockPackageJson)));

    const result = await isAngularWorkspace();

    expect(result).toBe(true);
    expect(vscode.Uri.file).toHaveBeenCalledWith('/test/path/package.json');
    expect(vscode.workspace.fs.readFile).toHaveBeenCalled();
  });

  it('should return false for a non-Angular workspace', async () => {
    const mockPackageJson = {
      dependencies: {
        'react': '17.0.2'
      }
    };

    (vscode.workspace.fs.readFile as jest.Mock).mockResolvedValue(Buffer.from(JSON.stringify(mockPackageJson)));

    const result = await isAngularWorkspace();

    expect(result).toBe(false);
  });

  it('should return false when package.json is not found', async () => {
    (vscode.workspace.fs.readFile as jest.Mock).mockRejectedValue(new Error('File not found'));

    const result = await isAngularWorkspace();

    expect(result).toBe(false);
  });

  it('should return false when package.json is invalid JSON', async () => {
    (vscode.workspace.fs.readFile as jest.Mock).mockResolvedValue(Buffer.from('invalid json'));

    const result = await isAngularWorkspace();

    expect(result).toBe(false);
  });
});


describe('Angular Structure Check Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isDirectory', () => {
    it('should return true for a directory', async () => {
      (vscode.workspace.fs.stat as jest.Mock).mockResolvedValue({ type: vscode.FileType.Directory });
      const result = await isDirectory('/path/to/dir');
      expect(result).toBe(true);
    });

    it('should return false for a file', async () => {
      (vscode.workspace.fs.stat as jest.Mock).mockResolvedValue({ type: vscode.FileType.File });
      const result = await isDirectory('/path/to/file.ts');
      expect(result).toBe(false);
    });

    it('should handle errors', async () => {
      (vscode.workspace.fs.stat as jest.Mock).mockRejectedValue(new Error('File not found'));
      const result = await isDirectory('/path/to/nonexistent');
      expect(result).toBe(false);
      expect(vscode.window.showErrorMessage).toHaveBeenCalled();
    });
  });

  describe('isAngularComponent', () => {
    it('should return true for an Angular component directory', async () => {
      (vscode.workspace.fs.readDirectory as jest.Mock).mockResolvedValue([
        ['component.component.ts', vscode.FileType.File],
        ['component.component.html', vscode.FileType.File],
        ['component.component.css', vscode.FileType.File],
      ]);
      const result = await isAngularComponent('/path/to/component');
      expect(result).toBe(true);
    });

    it('should return false for a non-component directory', async () => {
      (vscode.workspace.fs.readDirectory as jest.Mock).mockResolvedValue([
        ['file.ts', vscode.FileType.File],
        ['file.html', vscode.FileType.File],
      ]);
      const result = await isAngularComponent('/path/to/non-component');
      expect(result).toBe(false);
    });
  });

  describe('isAngularService', () => {
    it('should return true for an Angular service file', async () => {
      (vscode.workspace.fs.readDirectory as jest.Mock).mockResolvedValue([
        ['service.service.ts', vscode.FileType.File],
      ]);
      const result = await isAngularService('/path/to/service.service.ts');
      expect(result).toBe(true);
    });

    it('should return false for a non-service file', async () => {
      (vscode.workspace.fs.readDirectory as jest.Mock).mockResolvedValue([
        ['file.ts', vscode.FileType.File],
      ]);
      const result = await isAngularService('/path/to/file.ts');
      expect(result).toBe(false);
    });
  });

  describe('isAngularGuard', () => {
    it('should return true for an Angular guard file', async () => {
      (vscode.workspace.fs.readDirectory as jest.Mock).mockResolvedValue([
        ['guard.component.ts', vscode.FileType.File],
      ]);
      const result = await isAngularGuard('/path/to/guard.guard.ts');
      expect(result).toBe(true);
    });

    it('should return false for a non-guard file', async () => {
      (vscode.workspace.fs.readDirectory as jest.Mock).mockResolvedValue([
        ['file.ts', vscode.FileType.File],
      ]);
      const result = await isAngularGuard('/path/to/file.ts');
      expect(result).toBe(false);
    });
  });

  describe('isAngularPipe', () => {
    it('should return true for an Angular pipe file', async () => {
      (vscode.workspace.fs.readDirectory as jest.Mock).mockResolvedValue([
        ['pipe.pipe.ts', vscode.FileType.File],
      ]);
      const result = await isAngularPipe('/path/to/pipe.pipe.ts');
      expect(result).toBe(true);
    });

    it('should return false for a non-pipe file', async () => {
      (vscode.workspace.fs.readDirectory as jest.Mock).mockResolvedValue([
        ['file.ts', vscode.FileType.File],
      ]);
      const result = await isAngularPipe('/path/to/file.ts');
      expect(result).toBe(false);
    });
  });

  describe('isAngularDirective', () => {
    it('should return true for an Angular directive file', async () => {
      (vscode.workspace.fs.readDirectory as jest.Mock).mockResolvedValue([
        ['directive.directive.ts', vscode.FileType.File],
      ]);
      const result = await isAngularDirective('/path/to/directive.directive.ts');
      expect(result).toBe(true);
    });

    it('should return false for a non-directive file', async () => {
      (vscode.workspace.fs.readDirectory as jest.Mock).mockResolvedValue([
        ['file.ts', vscode.FileType.File],
      ]);
      const result = await isAngularDirective('/path/to/file.ts');
      expect(result).toBe(false);
    });
  });

  describe('isAngularProject', () => {
    it('should return true for an Angular project', async () => {
      (vscode.workspace.fs.readDirectory as jest.Mock).mockResolvedValue([
        ['angular.json', vscode.FileType.File],
      ]);
      const result = await isAngularProject();
      expect(result).toBe(true);
    });

    it('should return false for a non-Angular project', async () => {
      (vscode.workspace.fs.readDirectory as jest.Mock).mockResolvedValue([
        ['package.json', vscode.FileType.File],
      ]);
      const result = await isAngularProject();
      expect(result).toBe(false);
    });
  });

  describe('checkOldFile', () => {
    it('should return true and delete the file if it exists', async () => {
      (vscode.workspace.fs.stat as jest.Mock).mockResolvedValue({});
      (vscode.workspace.fs.delete as jest.Mock).mockResolvedValue(undefined);
      const result = await checkOldFile('/path/to/old-file.ts');
      expect(result).toBe(true);
      expect(vscode.workspace.fs.delete).toHaveBeenCalled();
    });

    it('should return false if the file does not exist', async () => {
      (vscode.workspace.fs.stat as jest.Mock).mockRejectedValue(new Error('File not found'));
      const result = await checkOldFile('/path/to/nonexistent-file.ts');
      expect(result).toBe(false);
      expect(vscode.workspace.fs.delete).not.toHaveBeenCalled();
    });
  });
});