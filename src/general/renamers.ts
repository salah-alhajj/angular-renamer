import * as vscode from 'vscode';
import * as path from 'path';

export async function renameAngularFiles(folderPath: string, oldName: string, newName: string, type: string) {
    const filesToRename = [
        { oldCF: `${oldName}.${type}.ts`, newCF: `${newName}.${type}.ts` },
        { oldCF: `${oldName}.${type}.spec.ts`, newCF: `${newName}.${type}.spec.ts` },
    ];

    for (const file of filesToRename) {
        try {
            const oldFilePath = path.join(folderPath, file.oldCF);
            const newFilePath = path.join(folderPath, file.newCF);

            // Check if the old file exists
            try {
                await vscode.workspace.fs.stat(vscode.Uri.file(oldFilePath));
            } catch (error) {
                console.log(`Old file ${oldFilePath} does not exist, skipping.`);
                continue;
            }

            // Rename the file
            await vscode.workspace.fs.rename(vscode.Uri.file(oldFilePath), vscode.Uri.file(newFilePath), { overwrite: true });

            // Check if the old file still exists after renaming (this shouldn't happen, but let's be safe)
            try {
                await vscode.workspace.fs.stat(vscode.Uri.file(oldFilePath));
                // If we reach here, it means the old file still exists
                await vscode.workspace.fs.delete(vscode.Uri.file(oldFilePath));
                console.log(`Deleted lingering old file: ${oldFilePath}`);
            } catch (error) {
                // Old file doesn't exist, which is what we want
            }

        } catch (error) {
            console.error(`Failed to rename file ${file.oldCF} to ${file.newCF}: ${error}`);
            vscode.window.showErrorMessage(`Error renaming ${file.oldCF} to ${file.newCF}: ${error}`);
        }
    }
}


export async function replaceGuardContent(newName: string, oldName: string, filePath: string): Promise<void> {
    try {
        const data = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath));
        let text = Buffer.from(data).toString('utf8');

        // Handle function-based guards
        const functionGuardRegex = new RegExp(`export const ${oldName}(Guard)?:\\s*([\\w<>]+)`, 'g');
        text = text.replace(functionGuardRegex, (match, guardSuffix, guardType) => {
            return `export const ${newName}Guard: ${guardType}`;
        });

        // Handle class-based guards (keep existing logic)
        const classGuardRegex = new RegExp(`\\b${oldName}(Guard)?\\b`, 'g');
        text = text.replace(classGuardRegex, `${newName}Guard`);

        if (await vscode.workspace.fs.stat(vscode.Uri.file(filePath))) {
            await vscode.workspace.fs.writeFile(
                vscode.Uri.file(filePath),
                Buffer.from(text, 'utf8')
            );
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Error replacing guard content: ${error}`);
    }
}