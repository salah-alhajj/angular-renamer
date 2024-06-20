import * as vscode from 'vscode';
import * as path from 'path';
import { renameAngularFiles } from './renamers';
import { extractExportedClasses, extractImports, getImportLines } from './utilities';




async function handler(file: any) {
    const types = ['service', 'guard', 'pipe', 'directive'];

    const type = types.find(t => file.oldUri.path.includes(`.${t}.ts`) ||
        file.newUri.path.includes(`.${t}.spec.ts`)
    );



    if (!type) return;

    const oldName = path.basename(file.oldUri.path).split('.')[0];
    const newName = path.basename(file.newUri.path).split('.')[0];
    await renameAngularFiles(path.dirname(file.newUri.path), oldName, newName, type);

    const fileContent = await vscode.workspace.fs.readFile(vscode.Uri.file(file.newUri.path)).then((data) => {
        return Buffer.from(data).toString('utf8');
    });


    const oldClassName = extractExportedClasses(fileContent, type)[0]



    await replaceClassName(newName, oldName, type, file.newUri.path);

    await replaceInProjectV2(oldName, newName, type, file.newUri.path, oldClassName);
}







function getClassName(name: string, type: string): string {
    let parts = name.split('-');
    let newClassName = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
    type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    return newClassName + type;
}

function replaceClassName(newName: string, oldName: string, type: string, filePath: string): Thenable<void> {
    const newNameClass = getClassName(newName, type);
    const oldNameClass = getClassName(oldName, type);

    return vscode.workspace.fs.readFile(vscode.Uri.file(filePath)).then((data) => {
        const text = Buffer.from(data).toString('utf8');

        const regex = new RegExp(`export class ${oldNameClass}\\b`, 'g');

        if (regex.test(text)) {
            const newText = text.replace(regex, `export class ${newNameClass}`);
            return vscode.workspace.fs.writeFile(
                vscode.Uri.file(filePath),
                Buffer.from(newText, 'utf8')
            ).then(() => {
            });
        } else {
        }
    }, (error) => {
    });
}
async function replaceClassNameV2(
    newComponentName: string,
    oldClassNameComponent: string,
    filePath: string,
    type:string
): Promise<void> {
    const newNameClassComponent = getClassName(newComponentName,type);

    try {
        const data = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath));
        const text = Buffer
			.from(data)
			.toString('utf8');

        const classRegex = new RegExp(`\\b${oldClassNameComponent}\\b`, 'g');
        const newText = text.replace(classRegex, newNameClassComponent);

        if (newText !== text) {
            await vscode.workspace.fs.writeFile(
                vscode.Uri.file(filePath),
                Buffer.from(newText, 'utf8')
            );
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Error replacing class name: ${error}`);
        throw error; // Re-throw the error to propagate it
    }
}





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

    await Promise.all(files.map(async (fileUri) => {
        const data = await vscode.workspace.fs.readFile(fileUri);
        const text = Buffer.from(data).toString('utf8');

        // Extract import lines that include the old class name
        const importLines = getImportLines(text, oldClassName);
        const imports = extractImports(importLines);
        let newText = text.replace(new RegExp(`\\b${oldClassName}/\\b`, 'g'), newClassName);

        for (const imp of imports) {
            if (imp.moduleName === oldClassName) {
                const oldImportPath = imp.path;

                const newImportPath = path.relative(path.dirname(fileUri.fsPath), newPath).replace(/\\/g, '/');
                const finalImportPath = newImportPath.startsWith('.') ? newImportPath : `./${newImportPath}`;

                newText = newText.replace(oldImportPath, finalImportPath.replace('.ts', ''));
            }
        }

        await vscode.workspace.fs.writeFile(fileUri, Buffer.from(newText, 'utf8'));
    }));









}





export {


    getClassName,
    replaceClassName,
    handler

}
