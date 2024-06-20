import path from 'path';
import * as vscode from 'vscode';
import { renameAngularComponentFiles } from './renamers';
import { extractExportedClasses, isDirectory } from '../general';
import * as General from '../general';
import { extractImports, getImportLines } from '../general/utilities';




async function replaceInProjectV2(oldName: string, newName: string, type: string, newPath: string, oldClassName: string): Promise<void> {
    // Read file from newPath


    const newClassName = General.getClassName(newName, type);
    const workspaceRoot = vscode.workspace.rootPath;

    if (!workspaceRoot) {
        vscode.window.showErrorMessage('No workspace folder open.');
        return;
    }

    const filesPattern = new vscode.RelativePattern(workspaceRoot, `src/**/*.ts`);
    const files = await vscode.workspace.findFiles(filesPattern);


    await Promise.all(files.map(async (fileUri) => {
        try {
            const data = await vscode.workspace.fs.readFile(fileUri);
            let text = Buffer.from(data).toString('utf8');
            if (!text.includes(oldClassName)) {
                return
            }

            // Extract import lines that include the old class name
            const importLines = getImportLines(text, oldClassName);
            const imports = extractImports(importLines);


            for (const imp of imports) {
                if (imp.moduleName === oldClassName) {
                    const oldImportPath = imp.path.split('/')[imp.path.split('/').length-2]+'/'+imp.path.split('/')[imp.path.split('/').length-1];
                    const newImportPath = `${newName}/${newName}.component`

                
                    console.log(`msg: ${oldImportPath}`)
                    console.log(`msg: ${newImportPath}`)
                    text = text.replace(oldImportPath, newImportPath)
                    text = text.replaceAll(new RegExp(`\\b${oldClassName}\\b`, 'g'), newClassName);

                }
            }

            await vscode.workspace.fs.writeFile(fileUri, Buffer.from(text, 'utf8'));
        } catch (error) {
            vscode.window.showErrorMessage(`Error processing file: ${fileUri.fsPath}, ${error}`);
        }
    }));
}

async function componentHandler(file: any): Promise<void> {

    const isNewDir = await isDirectory(file.newUri);
    if (isNewDir) {
        await handleDir(file);

    } else {

        await handleFile(file);
    }
}
async function handleDir(file: any): Promise<void> {


    const newComponent = path.basename(file.newUri.path);
    const oldComponent = path.basename(file.oldUri.path);


    try {
        await renameAngularComponentFiles(file.newUri.fsPath, oldComponent, newComponent);


        const data = await vscode.workspace.fs.readFile(
            vscode.Uri.file(path.join(file.newUri.path,
                path.basename(file.newUri.path) + '.component.ts'))
        );
        const text = Buffer.from(data).toString('utf8');
        const oldClassName = extractExportedClasses(text, 'component')[0]
        await General.replaceClassName(newComponent, oldClassName,'component', path.join(file.newUri.path, newComponent + '.component.ts'));

        await replaceInProjectV2(
            path.basename(file.oldUri.path),
            path.basename(file.newUri.path),
            'component',
            path.join(file.newUri.path, `${newComponent}.component.ts`,),
            oldClassName
        )
    }
    catch (err) {
        vscode.window.showErrorMessage(`${err}`)
    }

}
async function handleFile(file: any): Promise<void> {
    const newfileName = path.basename(file.newUri.path).split('.')[0];
    const oldfileName = path.basename(file.oldUri.path).split('.')[0];
    const folderPath = path.dirname(file.newUri.path);

    await renameAngularComponentFiles(folderPath, oldfileName, newfileName);
    vscode.workspace.fs.rename(vscode.Uri.file(folderPath),
        vscode.Uri.file(path.join(path.dirname(folderPath), newfileName)))
    const data = await vscode.workspace.fs.readFile(
        vscode.Uri.file(path.join(folderPath, newfileName + '.component.ts'))
    );
    const text = Buffer.from(data).toString('utf8');
    const oldClassName = extractExportedClasses(text, 'component')[0]
    await replaceClassName(newfileName, oldClassName, path.join(file.newUri.path, oldfileName + '.component.ts'));

    await replaceInProjectV2(
        oldfileName, newfileName,
        'component', folderPath,
        oldClassName)




}



export { componentHandler }