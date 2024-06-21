import path from 'path';
import * as vscode from 'vscode';
import { replaceClassName } from './components_handlers';
import { renameAngularComponentFiles } from './renamers';
import { extractExportedClasses, isDirectory } from '../general';
import * as General from '../general';
import { extractImports, getImportLines } from '../general/utilities';


async function replaceInProject(newName: string, type: string, oldClassName: string,oldName:string|null): Promise<void> {

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

            const importLines = getImportLines(text, oldClassName);
            const imports = extractImports(importLines);
            for (const imp of imports) {
                if (imp.path===`./${oldClassName}`)
                if (imp.moduleName === oldClassName) {
                    const oldImportPath = imp.path.split('/')[imp.path.split('/').length - 2] + '/' + imp.path.split('/')[imp.path.split('/').length - 1];
                    const newImportPath = `${newName}/${newName}.component`
                    text = text.replace(oldImportPath, newImportPath)
                    text = text.replaceAll(new RegExp(`\\b${oldClassName}\\b`, 'g'), newClassName);

                }
            }
            if (await vscode.workspace.fs.stat(fileUri)) { await vscode.workspace.fs.writeFile(fileUri, Buffer.from(text, 'utf8')); }
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

        try {
            await replaceClassName(newComponent,
                oldClassName, path.join(file.newUri.path, newComponent + '.component.ts'));

        }
        catch (error) {
            vscode.window.showErrorMessage(`Error replacing class name: ${error}`);
        }


        try {
            await replaceInProject(path.basename(file.newUri.path),
                'component', oldClassName,
                oldComponent
            )
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error replacing in project: ${error}`);

        }
    }
    catch (err) {
        vscode.window.showErrorMessage(`Dir ${err}`)
    }

}
async function handleFile(file: any): Promise<void> {
    const newfileName = path.basename(file.newUri.path).split('.')[0];
    const oldfileName = path.basename(file.oldUri.path).split('.')[0];
    let folderPath = path.dirname(file.newUri.path);



    await renameAngularComponentFiles(folderPath, oldfileName, newfileName);


    await vscode.workspace.fs.rename(vscode.Uri.file(folderPath),
        vscode.Uri.file(path.join(path.dirname(folderPath), newfileName)))

    folderPath=path.join(path.dirname(folderPath),path.basename(newfileName).split('.')[0])


    const data = await vscode.workspace.fs.readFile(
        vscode.Uri.file(path.join(folderPath, newfileName + '.component.ts'))
    );

    const text = Buffer.from(data).toString('utf8');
    const oldClassName = extractExportedClasses(text, 'component')[0]

    await replaceClassName(newfileName, oldClassName, path.join(folderPath, newfileName + '.component.ts'));


    await replaceInProject(
        path.basename(file.newUri.path).split('.')[0],
        'component',
        oldClassName,
        oldfileName
    )



}

export { componentHandler }