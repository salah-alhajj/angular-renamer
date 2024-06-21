import * as vscode from 'vscode';
import { handler, getClassName, extractExportedClasses } from '../../general';
import { renameAngularFiles } from '../../general/renamers';


jest.mock('vscode');
jest.mock('../../src/general/renamers');
jest.mock('../../src/general/utilities');

describe('General handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handler', () => {
    it('should handle service file rename', async () => {
      const mockFile = {
        oldUri: { path: '/old/path/service.service.ts' },
        newUri: { path: '/new/path/new-service.service.ts' }
      };

      (vscode.workspace.fs.readFile as jest.Mock).mockResolvedValue(Buffer.from('mock content'));
      (extractExportedClasses as jest.Mock).mockReturnValue(['OldServiceService']);

      await handler(mockFile);

      expect(renameAngularFiles).toHaveBeenCalled();
      expect(vscode.workspace.fs.writeFile).toHaveBeenCalled();
    });

    // Add more tests for other types (guard, pipe, directive)
  });

  describe('getClassName', () => {
    it('should generate correct class name', () => {
      expect(getClassName('my-service', 'service')).toBe('MyServiceService');
      expect(getClassName('auth-guard', 'guard')).toBe('AuthGuardGuard');
      expect(getClassName('custom-pipe', 'pipe')).toBe('CustomPipePipe');
      expect(getClassName('highlight', 'directive')).toBe('HighlightDirective');
    });
  });
});