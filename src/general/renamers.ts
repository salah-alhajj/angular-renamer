import * as vscode from 'vscode';
import * as path from 'path';
async function renameAngularFiles(folderPath: string, oldName: string, newName: string, type: string) {
    const filesToRename = [
        { oldCF: `${oldName}.${type}.ts`, newCF: `${newName}.${type}.ts` },
        { oldCF: `${oldName}.${type}.spec.ts`, newCF: `${newName}.${type}.spec.ts` }
    ];

    for (const file of filesToRename) {
        try {
            await vscode.workspace.fs.rename(
                vscode.Uri.file(path.join(folderPath, file.oldCF)),
                vscode.Uri.file(path.join(folderPath, file.newCF))
            );
        } catch (error) {
            console.error(`Failed to rename file ${file.oldCF} to ${file.newCF}: ${error}`);
        }
    }
}

export {
    renameAngularFiles,
};
