
import * as vscode from 'vscode';
import { extractComponentName } from './components_handlers';
import { isDirectory } from '../general';
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