
import * as vscode from 'vscode';
import { isDirectory } from '../general/checker';
import { extractComponentName } from './components_handlers';

async function checkWorkspaceFolders() {
    if (vscode.workspace.workspaceFolders) {
        for (const folder of vscode.workspace.workspaceFolders) {
            const fileRenamed = folder.uri;
			const nameComponent=fileRenamed.path.split('/')[ fileRenamed.path.split('/').length-1];
			

            const isDir = await isDirectory(fileRenamed);

            if (isDir) {
                
                    const componentName = extractComponentName(fileRenamed.fsPath);
                }
                
            
            else{
                vscode.window.showErrorMessage(`Error checking if ${fileRenamed.fsPath} is a directory`);

            }
        }
    }
}
export{
    
    checkWorkspaceFolders
}