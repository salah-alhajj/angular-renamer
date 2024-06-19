import * as vscode from 'vscode';
import * as path from 'path';


// rename folder 


async function renameAngularFiles(folderPath: string, oldComponentName: string,newComponentName:string,type:string) {
    const filesToRename = [
        { oldCF: oldComponentName+`.${type}.ts`, newCF: newComponentName+`.${type}.ts` },
        { oldCF: oldComponentName+`.${type}.spec.ts`, newCF: newComponentName+`.${type}.spec.ts` },
        ];
    for (let i = 0; i < filesToRename.length; i++) 
    {
        const file = filesToRename[i];
        const oldFilePath = path.join(folderPath, `${file.oldCF}`);
        const newFilePath = path.join(folderPath, `${file.newCF}`);

        try {
            
            await vscode.workspace.fs.rename(
                vscode.Uri.file(oldFilePath),
                vscode.Uri.file(newFilePath));
            } 
        catch (error)
         {}
    }
    



    
}
export{
    renameAngularFiles,
}
