import path from 'path';
import * as vscode from 'vscode';
import { replaceClassName } from './components_handlers';
import { renameAngularComponentFiles } from './renamers';
import { extractExportedClasses, isDirectory } from '../general';
import * as General from '../general';
import { extractImports, getImportLines } from '../general/utilities';


async function replaceInProjectV2(oldName: string, newName: string, type: string, newPath: string, oldClassName: string): Promise<void> {
    // read file from newPath 
    const fileContent = await vscode.workspace.fs.readFile(vscode.Uri.file(newPath)).then((data) => {
        return Buffer.from(data).toString('utf8');
    });

    const newClassName = extractExportedClasses(fileContent, type)[0]

    const workspaceRoot = vscode.workspace.rootPath;

    if (!workspaceRoot) {
        vscode.window.showErrorMessage('No workspace folder open.');
        return;
    }

    const filesPattern = new vscode.RelativePattern(workspaceRoot, `src/**/*.ts`);
    const files = await vscode.workspace.findFiles(filesPattern);
    vscode.window.showInformationMessage(`${files}`)

    await Promise.all(files.map(async (fileUri) => {
        const data = await vscode.workspace.fs.readFile(fileUri);
        const text = Buffer.from(data).toString('utf8');

        // Extract import lines that include the old class name
        const importLines = getImportLines(text, oldClassName);
        const imports = extractImports(importLines);
        let newText = text.replace(new RegExp(`\\b${oldClassName}/${oldClassName}\\b`, 'g'), `${newClassName}/${newClassName}`);

        for (const imp of imports) {
            if (imp.moduleName === oldClassName) {
                const oldImportPath = imp.path;

                const newImportPath = path.relative(path.dirname(fileUri.fsPath), newPath).replace(/\\/g, '/');
                const finalImportPath = newImportPath.startsWith('.') ? newImportPath : `./${newImportPath}`;

                newText = newText.replace(oldImportPath, finalImportPath.replace('.ts',''));
            }
        }

        await vscode.workspace.fs.writeFile(fileUri, Buffer.from(newText, 'utf8'));
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


    await renameAngularComponentFiles(file.newUri.fsPath, oldComponent, newComponent);


    const data = await vscode.workspace.fs.readFile(
        vscode.Uri.file(path.join(path.dirname(file.newUri.path),
            path.basename(file.newUri.path) + '.component.ts'))
    );
    const text = Buffer.from(data).toString('utf8');
    const oldClassName = extractExportedClasses(text, 'component')[0]


    await replaceClassName(newComponent, oldComponent, path.join(file.newUri.path, newComponent + '.component.ts'));

    replaceInProjectV2(
        path.basename(file.oldUri.path),
        path.basename(file.newUri.path),
        'component',
        file.newUri.path,
        oldClassName)

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

    replaceInProjectV2(
        oldfileName, newfileName,
        'component', folderPath, oldClassName)




}



export { componentHandler }