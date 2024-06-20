import path from 'path';
import * as vscode from 'vscode';
import { replaceClassName } from './components_handlers';
import { renameAngularComponentFiles } from './renamers';
import { extractExportedClasses, isDirectory } from '../general';
import * as General from '../general';
import { extractImports, getImportLines } from '../general/utilities';


async function replaceInProject(oldName: string, newName: string, type: string, newPath: string): Promise<void> {
    const oldClassName = General.getClassName(oldName, type);
    const newClassName = General.getClassName(newName, type);
    const workspaceRoot = vscode.workspace.rootPath;

    if (!workspaceRoot) {
        vscode.window.showErrorMessage('No workspace folder open.');
        return;
    }

    const filesPattern = new vscode.RelativePattern(workspaceRoot, `src/**/*.ts`);
    const files = await vscode.workspace.findFiles(filesPattern);

    await Promise.all(files.map(async (fileUri) => {
        const data = await vscode.workspace.fs.readFile(fileUri);
        const text = Buffer.from(data).toString('utf8');

        // Extract import lines that include the old class name
        const importLines = getImportLines(text, oldClassName);
        const imports = extractImports(importLines);

        let newText = text.replace(new RegExp(`\\b${oldClassName}\\b`, 'g'), newClassName);

        for (const imp of imports) {
            if (imp.moduleName === oldClassName) {
                const oldImportPath = imp.path;
                const newImportPath = path.relative(path.dirname(fileUri.fsPath), newPath).replace(/\\/g, '/');
                const finalImportPath = newImportPath.startsWith('.') ? newImportPath : `./${newImportPath}`;

                // Handle the case for .component
                const oldImportComponentPath = `${oldImportPath}.component`;
                const newImportComponentPath = `${finalImportPath}.component`;

                newText = newText.replace(oldImportComponentPath, newImportComponentPath);
            }
        }

        await vscode.workspace.fs.writeFile(fileUri, Buffer.from(newText, 'utf8'));
    }));
}

async function replaceInProjectV2(oldName: string, newName: string, type: string, newPath: string, oldClassName: string): Promise<void> {
    // Read file from newPath
    const fileContent = await vscode.workspace.fs.readFile(vscode.Uri.file(newPath)).then((data) => {
        return Buffer.from(data).toString('utf8');
    });

    const newClassName = General.getClassName(newName, type);
    const workspaceRoot = vscode.workspace.rootPath;

    if (!workspaceRoot) {
        vscode.window.showErrorMessage('No workspace folder open.');
        return;
    }

    const filesPattern = new vscode.RelativePattern(workspaceRoot, `src/**/*.ts`);
    const files = await vscode.workspace.findFiles(filesPattern);
    
    vscode.window.showInformationMessage(`Found ${files.length} files`);

    await Promise.all(files.map(async (fileUri) => {
        try {
            const data = await vscode.workspace.fs.readFile(fileUri);
            let text = Buffer.from(data).toString('utf8');
            if(!text.includes(oldClassName)){
                return
            }

            // Extract import lines that include the old class name
            const importLines = getImportLines(text, oldClassName);
            const imports = extractImports(importLines);

            // let newText = text.replace(`${oldName}/${oldName}.component`, `${newClassName}/${newClassName}.component`);

            for (const imp of imports) {
                vscode.window.showInformationMessage(`Processing import: ${imp.moduleName}`);
                if (imp.moduleName === oldClassName) {
                    const oldImportPath = imp.path;
                    const newImport=imp.path.replace(`${oldName}/${oldName}.component`, `${newClassName}/${newClassName}.component`).replaceAll(oldClassName,newClassName)
                    text=text.replace(imp.path,newImport);
                    
                }
            }

            await vscode.workspace.fs.writeFile(fileUri, Buffer.from(text, 'utf8'));
            vscode.window.showInformationMessage(`Updated file: ${fileUri.fsPath}`);
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


try{
    await renameAngularComponentFiles(file.newUri.fsPath, oldComponent, newComponent);


    const data = await vscode.workspace.fs.readFile(
        vscode.Uri.file(path.join(file.newUri.path,
            path.basename(file.newUri.path) + '.component.ts'))
    );
    const text = Buffer.from(data).toString('utf8');
    const oldClassName = extractExportedClasses(text, 'component')[0]

    vscode.window.showInformationMessage(`${oldClassName}`)

    
    await replaceClassName(newComponent, oldClassName, path.join(file.newUri.path, newComponent + '.component.ts'));

    await replaceInProjectV2(
        path.basename(file.oldUri.path),
        path.basename(file.newUri.path),
        'component',
        path.join(file.newUri.path,`${newComponent}.component.ts`,),
        oldClassName[0]
        )}
        catch(err){
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