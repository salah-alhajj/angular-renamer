import * as vscode from 'vscode';
import * as path from 'path';
import { renameAngularFiles } from '../../general/renamers';

jest.mock('vscode', () => {
    const workspace = {
        fs: {
            rename: jest.fn(),
        },
    };

    const Uri = {
        file: jest.fn((filePath: string) => ({ fsPath: filePath })),
    };

    return { workspace, Uri };
});

describe('renameAngularFiles', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should rename Angular files correctly', async () => {
        const mockRename = vscode.workspace.fs.rename as jest.Mock;
        const folderPath = '/path/to/folder';
        const oldName = 'old-component';
        const newName = 'new-component';
        const type = 'component';

        await renameAngularFiles(folderPath, oldName, newName, type);

        expect(mockRename).toHaveBeenCalledTimes(2);
        expect(mockRename).toHaveBeenCalledWith(
            { fsPath: path.join(folderPath, `${oldName}.${type}.ts`) },
            { fsPath: path.join(folderPath, `${newName}.${type}.ts`) },
            { overwrite: true }
        );
        expect(mockRename).toHaveBeenCalledWith(
            { fsPath: path.join(folderPath, `${oldName}.${type}.spec.ts`) },
            { fsPath: path.join(folderPath, `${newName}.${type}.spec.ts`) },
            { overwrite: true }
        );
    });

    it('should handle errors gracefully', async () => {
        const mockRename = vscode.workspace.fs.rename as jest.Mock;
        mockRename.mockImplementationOnce(() => {
            throw new Error('Test error');
        });

        const folderPath = '/path/to/folder';
        const oldName = 'old-component';
        const newName = 'new-component';
        const type = 'component';

        console.error = jest.fn();  // Mock console.error to suppress error output in test

        await renameAngularFiles(folderPath, oldName, newName, type);

        expect(mockRename).toHaveBeenCalledTimes(2); // Ensuring the mock is called twice
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining(`Failed to rename file ${oldName}.${type}.ts to ${newName}.${type}.ts: Error: Test error`)
        );
    });
});
