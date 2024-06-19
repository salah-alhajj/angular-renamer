import * as vscode from 'vscode';
import * as path from 'path';

async function isDirectory(uri: vscode.Uri): Promise<boolean> {
    try {
        const fileStat = await vscode.workspace.fs.stat(uri);
        return fileStat.type === vscode.FileType.Directory;
    } catch (error) {
        vscode.window.showErrorMessage(`Error checking if ${uri.fsPath} is a directory: ${error}`);
        return false;
    }
}
export{isDirectory}