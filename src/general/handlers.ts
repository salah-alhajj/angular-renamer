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
    const filePath = file.newUri.path.replace('.spec.ts', '.ts');
    const oldName = path.basename(file.oldUri.path.replace('.spec.ts', '.ts')).split('.')[0];
    const newName = path.basename(filePath).split('.')[0];
    await renameAngularFiles(path.dirname(filePath), oldName, newName, type);
    
    
    const fileContent = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath)).then((data) => {
        return Buffer.from(data).toString('utf8');
    });
    const oldClassName = extractExportedClasses(fileContent, type)[0]
    await replaceClassName(newName, oldClassName, type, filePath);

    await replaceInProject(oldName, newName, type, filePath, oldClassName);
    

}



function getClassName(name: string, type: string): string {
    let parts = name.split('-');
    let newClassName = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
    type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    return newClassName + type;
}
async function replaceClassName(
    newName: string,
    oldClassName: string,
    type: string,
    filePath: string,

): Promise<void> {

    const newNameClassComponent = getClassName(newName, type);

    try {
        const data = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath));
        const text = Buffer.from(data).toString('utf8');


        const classRegex = new RegExp(`\\b${oldClassName}\\b`, 'g');
        const newText = text.replace(classRegex, newNameClassComponent);

        if (newText !== text) {
            if (await vscode.workspace.fs.stat(vscode.Uri.file(filePath)
            ))
            {await vscode.workspace.fs.writeFile(
                vscode.Uri.file(filePath),
                Buffer.from(newText, 'utf8')
            );}
        }

    
        

        
    } catch (error) {
        vscode.window.showErrorMessage(`Error replacing class name: ${error}`);
    }
}


async function replaceInProject(oldName: string, newName: string, type: string, newPath: string, oldClassName: string): Promise<void> {
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
        let text = Buffer.from(data).toString('utf8');

        const importLines = getImportLines(text, oldClassName);
        const imports = extractImports(importLines);
        text = text.replace(new RegExp(`\\b${oldClassName}/\\b`, 'g'), newClassName);
    
        for (const imp of imports) {
            if (imp.moduleName === oldClassName) {
                const oldImportPath = imp.path.split('/')[imp.path.split('/').length-1];
                const newImportPath = `${newName}.${type.toLowerCase().replace('.ts','')}`;
                text = text.replace(oldImportPath, newImportPath);
                text = text.replaceAll(new RegExp(`\\b${oldClassName}\\b`, 'g'), newClassName);
            }
        }

        await vscode.workspace.fs.writeFile(fileUri, Buffer.from(text, 'utf8'));
    }));



}

export {
    getClassName,
    handler

}
