import * as vscode from 'vscode';
import * as path from 'path';
async function isDirectory(uri: vscode.Uri| string): Promise<boolean> {
    try {
        // check if uri is uri or string
        if (typeof uri === 'string') {
            uri = vscode.Uri.file(uri);
        }
        const fileStat = await vscode.workspace.fs.stat(uri);
        return fileStat.type === vscode.FileType.Directory;
    } catch (error) {
        if (typeof uri === 'string') {
            uri = vscode.Uri.file(uri);
        }
        vscode.window.showErrorMessage(`Error checking if ${uri.fsPath} is a directory: ${error}`);
        return false;
    }
}

async function isAngularComponent(targetPath: string): Promise<boolean> {
    if (!(await isDirectory(targetPath))){
        targetPath=path.dirname(targetPath);
    }
    const files = await vscode.workspace.fs.readDirectory(vscode.Uri.file(targetPath));

    const hasComponentTs = files.some(([name]) => name.endsWith('.component.ts'));
    const hasComponentHtml = files.some(([name]) => name.endsWith('.component.html'));
    const hasComponentCss = files.some(([name]) => name.endsWith('.component.css'));
    const isComponentFolder = hasComponentTs && hasComponentHtml && hasComponentCss;
    return isComponentFolder;
}
export {isAngularComponent,isDirectory}
