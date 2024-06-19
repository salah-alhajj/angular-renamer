import * as vscode from 'vscode';
import { extractComponentName } from './components_handlers';

async function isDirectory(uri: vscode.Uri): Promise<boolean> {
    try {
        const fileStat = await vscode.workspace.fs.stat(uri);
        return fileStat.type === vscode.FileType.Directory;
    } catch (error) {
        vscode.window.showErrorMessage(`Error checking if ${uri.fsPath} is a directory: ${error}`);
        return false;
    }
}

async function isAngularComponentFolder(folderPath: string): Promise<boolean> {
    const files = await vscode.workspace.fs.readDirectory(vscode.Uri.file(folderPath));

    const hasComponentTs = files.some(([name]) => name.endsWith('.component.ts'));
    const hasComponentHtml = files.some(([name]) => name.endsWith('.component.html'));
    const hasComponentCss = files.some(([name]) => name.endsWith('.component.css'));
    const isComponentFolder = hasComponentTs && hasComponentHtml && hasComponentCss;
    return isComponentFolder;
}
async function checkWorkspaceFolders() {
    if (vscode.workspace.workspaceFolders) {
        for (const folder of vscode.workspace.workspaceFolders) {
            const fileRenamed = folder.uri;
			const nameComponent=fileRenamed.path.split('/')[ fileRenamed.path.split('/').length-1];
			

            const isDir = await isDirectory(fileRenamed);

            if (isDir) {
                if (await isAngularComponentFolder(fileRenamed.fsPath)) {
                    const componentName = extractComponentName(fileRenamed.fsPath);
                }
                
            }
            else{
                vscode.window.showErrorMessage(`Error checking if ${fileRenamed.fsPath} is a directory`);

            }
        }
    }
}
export{
    isDirectory,
    isAngularComponentFolder,
    checkWorkspaceFolders
}