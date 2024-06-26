import * as vscode from 'vscode';
import * as path from 'path';
import { renameAngularFiles, replaceGuardContent } from './renamers';
import { extractExportedClasses, extractGuardName, extractImports, getImportLines } from './utilities';
import { getAngularRenamerSettings } from '../settings';


async function handler(file: any) {
    const types = ['service', 'guard', 'pipe', 'directive'];
    const settings = getAngularRenamerSettings();
    const type = types.find(t => file.oldUri.path.includes(`.${t}.ts`) ||
        (file.newUri.path.includes(`.${t}.spec.ts`) && settings.renameSpec)
    );

    if (!type) { return; }

    if (type === 'service' && !settings.renameServices ||
        type === 'pipe' && !settings.renamePipes ||
        type === 'directive' && !settings.renameDirectives ||
        type === 'guard' && !settings.renameGuards
    ) {
        return
    }



    const filePath = file.newUri.path.replace('.spec.ts', '.ts');
    const oldName = path.basename(file.oldUri.path.replace('.spec.ts', '.ts')).split('.')[0];
    const newName = path.basename(filePath).split('.')[0];
    await renameAngularFiles(path.dirname(filePath), oldName, newName, type);


    const fileContent = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath)).then((data) => {
        return Buffer.from(data).toString('utf8');
    });

    if (type === 'guard') {
        const oldGuardName=extractGuardName(fileContent)!;
        replaceGuardContent(newName, oldName, filePath)
        if (settings.searchAndReplaceDeeply) {
    
            await replaceInProject(oldName, newName, type, filePath,oldGuardName)
        }
    }
    else {
    
        const oldClassName = extractExportedClasses(fileContent, type)[0];
        await replaceClassName(newName, oldClassName, type, filePath);
        if (settings.searchAndReplaceDeeply) {
            await replaceInProject(oldName, newName, type, filePath, oldClassName)
        }
    }
    


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
            )) {
                await vscode.workspace.fs.writeFile(
                    vscode.Uri.file(filePath),
                    Buffer.from(newText, 'utf8')
                );
            }
        }





    } catch (error) {
        // vscode.window.showErrorMessage(`Error replacing class name: ${error}`);
    }
}


async function replaceInProject(oldName: string, newName: string, type: string, newPath: string, oldClassName: string): Promise<void> {
    const workspaceRoot = vscode.workspace.rootPath;

    if (!workspaceRoot) {
        return;
    }

    const filesPattern = new vscode.RelativePattern(workspaceRoot, `src/**/*.ts`);
    const files = await vscode.workspace.findFiles(filesPattern);

    if (files && files.length > 0) {
        await Promise.all(files.map(async (fileUri) => {
            const data = await vscode.workspace.fs.readFile(fileUri);
            let text = Buffer.from(data).toString('utf8');

            if (type === 'guard') {
                // Existing guard-specific replacements
                const guardImportRegex = new RegExp(`import\\s*{\\s*${oldClassName}(Guard)?\\s*}\\s*from\\s*['"]([^'"]+)['"]`, 'g');
                text = text.replace(guardImportRegex, `import { ${newName}Guard } from '$2'`);
                const guardUsageRegex = new RegExp(`\\b${oldClassName}(Guard)?\\b`, 'g');
                text = text.replace(guardUsageRegex, `${newName}Guard`);

                // Update import path if necessary
                const oldImportPath = `${oldName}.guard`;
                const newImportPath = `${newName}.guard`;
                text = text.replace(new RegExp(oldImportPath, 'g'), newImportPath);
            } else {
                const newClassName = getClassName(newName, type);

                // Updated logic for other types
                const importRegex = new RegExp(`import\\s*{\\s*${oldClassName}\\s*}\\s*from\\s*['"]([^'"]+)['"]`, 'g');
                text = text.replace(importRegex, (match, importPath) => {
                    // Update the file path in the import statement
                    const newImportPath = importPath.replace(
                        `${oldName}.${type}`,
                        `${newName}.${type}`,
                    ).replace(oldClassName,newClassName);
                    // Update the class name in the import statement
                    return `import { ${newClassName} } from '${newImportPath}'`;
                });

                // Update all other references to the old class name
                const classRegex = new RegExp(`\\b${oldClassName}\\b`, 'g');
                text = text.replace(classRegex, newClassName);

                // Update describe block in spec files
                const describeRegex = new RegExp(`describe\\(['"](${oldClassName}|undefined)['"]`, 'g');
                text = text.replace(describeRegex, `describe('${newClassName}'`);
            }

            if (text !== Buffer.from(data).toString('utf8')) {
                if (await vscode.workspace.fs.stat(fileUri)) {
                    await vscode.workspace.fs.writeFile(fileUri, Buffer.from(text, 'utf8'));
                }
            }
            

            

            

            if (text !== Buffer.from(data).toString('utf8')) {
                if (await vscode.workspace.fs.stat(fileUri)) {
                    await vscode.workspace.fs.writeFile(fileUri, Buffer.from(text, 'utf8'));
                }
            }
        }));
    }
}

export {
    getClassName,
    handler,
    replaceClassName,
    replaceInProject,


};
