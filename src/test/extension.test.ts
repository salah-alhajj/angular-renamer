import * as vscode from 'vscode';
import { activate, deactivate } from '../extension';
import { isAngularProject } from '../general/checker';
import { componentHandler } from '../components/handlers';
import { handler as generalHandler } from '../general/handlers';

jest.mock('vscode');
jest.mock('../src/general/checkers');
jest.mock('../src/components/handlers');
jest.mock('../src/general/handlers');

describe('Extension', () => {
  let context: vscode.ExtensionContext;
  let onDidRenameFilesCallback: (e: vscode.FileRenameEvent) => Promise<void>;

  beforeEach(() => {
    context = {
      subscriptions: []
    } as any;
    jest.clearAllMocks();
  });

  describe('activate', () => {
    it('should register file rename event listener for Angular projects', async () => {
      (isAngularProject as jest.Mock).mockResolvedValue(true);
      
      await activate(context);

      expect(vscode.workspace.onDidRenameFiles).toHaveBeenCalled();
      expect(context.subscriptions.length).toBe(1);
      onDidRenameFilesCallback = (vscode.workspace.onDidRenameFiles as jest.Mock).mock.calls[0][0];
    });

    it('should not register event listener for non-Angular projects', async () => {
      (isAngularProject as jest.Mock).mockResolvedValue(false);
      
      await activate(context);

      expect(vscode.workspace.onDidRenameFiles).not.toHaveBeenCalled();
      expect(context.subscriptions.length).toBe(0);
    });
  });

  describe('file rename handler', () => {
    beforeEach(async () => {
      (isAngularProject as jest.Mock).mockResolvedValue(true);
      await activate(context);
      onDidRenameFilesCallback = (vscode.workspace.onDidRenameFiles as jest.Mock).mock.calls[0][0];
    });

    it('should call componentHandler for component files', async () => {
      await onDidRenameFilesCallback({
        files: [{
          oldUri: { fsPath: '/path/old.component.ts' } as vscode.Uri,
          newUri: { fsPath: '/path/new.component.ts' } as vscode.Uri
        }]
      });

      expect(componentHandler).toHaveBeenCalled();
      expect(generalHandler).not.toHaveBeenCalled();
    });

    it('should call generalHandler for non-component files', async () => {
      await onDidRenameFilesCallback({
        files: [{
          oldUri: { fsPath: '/path/old.service.ts' } as vscode.Uri,
          newUri: { fsPath: '/path/new.service.ts' } as vscode.Uri
        }]
      });

      expect(generalHandler).toHaveBeenCalled();
      expect(componentHandler).not.toHaveBeenCalled();
    });

    it('should handle multiple file renames', async () => {
      await onDidRenameFilesCallback({
        files: [
          {
            oldUri: { fsPath: '/path/old.component.ts' } as vscode.Uri,
            newUri: { fsPath: '/path/new.component.ts' } as vscode.Uri
          },
          {
            oldUri: { fsPath: '/path/old.service.ts' } as vscode.Uri,
            newUri: { fsPath: '/path/new.service.ts' } as vscode.Uri
          }
        ]
      });

      expect(componentHandler).toHaveBeenCalled();
      expect(generalHandler).toHaveBeenCalled();
    });
  });

  describe('deactivate', () => {
    it('should not throw when called', () => {
      expect(() => deactivate()).not.toThrow();
    });
  });
});