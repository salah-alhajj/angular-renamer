import * as vscode from 'vscode';
import * as path from 'path';
// rename folder 
async function renameAngularComponentFiles(folderPath: string, oldComponentName: string,newComponentName:string) {
    const filesToRename = [
        { oldCF: oldComponentName+'.component.spec.ts', newCF: newComponentName+'.component.spec.ts' },
        { oldCF: oldComponentName+'.component.ts', newCF: newComponentName+'.component.ts' },
        { oldCF:  oldComponentName+'.component.html', newCF: newComponentName+'.component.html' },
        // possible styles files
        { oldCF:  oldComponentName+'.component.css', newCF: newComponentName+'.component.css' },
        { oldCF:  oldComponentName+'.component.scss', newCF: newComponentName+'.component.scss' },
        { oldCF:  oldComponentName+'.component.saas', newCF: newComponentName+'.component.saas' },
        { oldCF:  oldComponentName+'.component.less', newCF: newComponentName+'.component.laas' },
    ];

// counter from 0-2
    for (let i = 0; i < 3; i++) 
    {
        const file = filesToRename[i];
        
        const oldFilePath = path.join(folderPath, `${file.oldCF}`);
        const newFilePath = path.join(folderPath, `${file.newCF}`);

        try {
            await vscode.workspace.fs.rename(vscode.Uri.file(oldFilePath), vscode.Uri.file(newFilePath));
        } catch (error) {
        }
    }
    for (let i=3;i < filesToRename.length;i++){
        const file = filesToRename[i];
        
        const oldFilePath = path.join(folderPath, `${file.oldCF}`);
        const newFilePath = path.join(folderPath, `${file.newCF}`);

        try {
            await vscode.workspace.fs.rename(vscode.Uri.file(oldFilePath), vscode.Uri.file(newFilePath));
            // thats mean style file is correct so finish loop
            break;
        } catch (error) {
        }
    }
    
}
export{
    renameAngularComponentFiles,
}
