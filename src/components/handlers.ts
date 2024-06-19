import path from 'path';
import * as vscode from 'vscode';
import { replaceClassName, replaceComponentInProject } from './components_handlers';
import { renameAngularComponentFiles } from './renamers';
import { isDirectory } from '../general';



async function componentHandler(file:any):Promise<void>{

    const isNewDir = await isDirectory(file.newUri);
    if (isNewDir) {
        await handleDir(file);
        
    } else {
        
        await handleFile(file);
    }
}
    async function handleDir(file:any):Promise<void>{
    const newUri = file.newUri;
                const oldUri = file.oldUri;
                const oldComponent = oldUri.path.split('/')[oldUri.path.split('/').length - 1];
                const newComponent = newUri.path.split('/')[newUri.path.split('/').length - 1];


            
                    await renameAngularComponentFiles(newUri.fsPath, oldComponent, newComponent);
                    replaceClassName(newComponent, oldComponent, path.join(newUri.path, newComponent + '.component.ts'));
                    replaceComponentInProject(oldComponent, newComponent)
    
}
async function handleFile(file:any):Promise<void>{
    const newfileName = path.basename(file.newUri.path).split('.')[0];
                const oldfileName = path.basename(file.oldUri.path).split('.')[0];
                const folderPath = path.dirname(file.newUri.path);
                
                    await renameAngularComponentFiles(folderPath, oldfileName, newfileName);
                    vscode.workspace.fs.rename(vscode.Uri.file(folderPath),
                        vscode.Uri.file(path.join(path.dirname(folderPath), newfileName)))
                        replaceClassName(newfileName, oldfileName,
                        path.join(path.dirname(folderPath), newfileName,))
                        replaceComponentInProject(oldfileName, newfileName)

                
                
}
export{handleDir,handleFile,componentHandler}