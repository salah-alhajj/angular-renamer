import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { renameAngularFiles } from './renamers';
import { extractExportedClasses } from './utilities';




async function handler(file: any) {
    const types = ['component', 'service', 'guard', 'pipe', 'directive'];

    const type = types.find(t => file.oldUri.path.includes(`.${t}.ts`));
    if (!type) return;

    const oldName = path.basename(file.oldUri.path).split('.')[0];
    const newName = path.basename(file.newUri.path).split('.')[0];

    await renameAngularFiles(path.dirname(file.newUri.path), oldName, newName, type);

    const fileContent= await vscode.workspace.fs.readFile(vscode.Uri.file(path.dirname(file.newUri.path))).then((data) => {
        return Buffer.from(data).toString('utf8');
    });

    const oldClassName =  extractExportedClasses(fileContent,type) 

    

    await replaceClassName(newName, oldName, type, file.newUri.path);
    await replaceInProjectV2(oldName, newName, type,path.dirname(file.newUri.path));
}



function extractName(folderPath: string): string {
	const folderName = path.basename(folderPath);
	return folderName.split('.')[0];
}

function getSpecFilePath(filePath: string): string {
	const dirName = path.dirname(filePath);
	const baseName = path.basename(filePath, '.ts');
	return path.join(dirName, `${baseName}.spec.ts`);
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
			// vscode.window.showErrorMessage(`Class name ${oldNameClassComponent} not found in the file.`);
		}
	}, (error) => {
		//   vscode.window.showErrorMessage(`Error reading or writing file: ${error}`);
	});
}



// async function replaceInProject(oldName: string, newName: string, type: string): Promise<void> {
// 	const oldClassName = getClassName(oldName, type);
// 	const newClassName = getClassName(newName, type);
// 	const workspaceRoot = vscode.workspace.rootPath;


// 	if (!workspaceRoot) {
// 		vscode.window.showErrorMessage('No workspace folder open.');
// 		return;
// 	}

// 	const filesPattern = new vscode.RelativePattern(workspaceRoot, `src/**/*.ts`);
// 	const files = await vscode.workspace.findFiles(filesPattern);

// 	await Promise.all(files.map(async (fileUri) => {
// 		const data = await vscode.workspace.fs.readFile(fileUri);
// 		const text = Buffer.from(data).toString('utf8');

// 		const classNameRegex = new RegExp(`\\b${oldClassName}\\b`, 'g');

// 		let newText = text;
// 		const oldImportPath = `${oldName}.${type}`;
// 		const newImportPath = `${newName}.${type}`;

// 		// newText = newText.replaceAll(oldImportPath, newImportPath);
// 		newText = newText.replaceAll(oldClassName, newClassName);



// 		// rewrite newText
// 		await vscode.workspace.fs.writeFile(fileUri, Buffer.from(newText, 'utf8'));
// 		newText = newText.replace(classNameRegex, newClassName);
// 	}))

// }


async function replaceInProjectV2(oldName: string, newName: string, type: string, newPath: string,oldFileClassName:string| undefined=undefined): Promise<void> {
    // read file from newPath 
    const fileContent= await vscode.workspace.fs.readFile(vscode.Uri.file(newPath)).then((data) => {
        return Buffer.from(data).toString('utf8');
    });

    const oldClassName =  getClassName(oldName, type);
    const newClassName =  extractExportedClasses(fileContent,type)[0]

    
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

        const classNameRegex = new RegExp(`\\b${oldClassName}\\b`, 'g');
        const importPathRegex = new RegExp(`(import\\s+\\{[^\\}]*\\}\\s+from\\s+['"])([^'"]*${oldName}\\.${type})(['"])`, 'g');

        let newText = text.replace(classNameRegex, newClassName);

        newText = newText.replace(importPathRegex, (match, p1, p2, p3) => {
            // Calculate the new import path relative to the fileUri
            const oldImportPath = path.join(path.dirname(fileUri.fsPath), p2);
            const newImportPath = path.relative(
                path.dirname(fileUri.fsPath),
                newPath
            ).replace(/\\/g, '/');  // Ensure correct path separators for different OS

            // Ensure the import path starts with './' or '../' for relative paths
            const finalImportPath = newImportPath.startsWith('.') ? newImportPath : `./${newImportPath}`;

            return `${p1}${finalImportPath}${p3}`;
        });

        await vscode.workspace.fs.writeFile(fileUri, Buffer.from(newText, 'utf8'));
    }));
}
async function replaceInProject(oldName: string, newName: string, type: string, newPath: string): Promise<void> {
    const oldClassName = getClassName(oldName, type);
    const newClassName = getClassName(newName, type);
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

        const classNameRegex = new RegExp(`\\b${oldClassName}\\b`, 'g');
        const importPathRegex = new RegExp(`(import\\s+\\{[^\\}]*\\}\\s+from\\s+['"])([^'"]*${oldName}\\.${type})(['"])`, 'g');

        let newText = text.replace(classNameRegex, newClassName);

        newText = newText.replace(importPathRegex, (match, p1, p2, p3) => {
            // Calculate the new import path relative to the fileUri
            const oldImportPath = path.join(path.dirname(fileUri.fsPath), p2);
            const newImportPath = path.relative(
                path.dirname(fileUri.fsPath),
                newPath
            ).replace(/\\/g, '/');  // Ensure correct path separators for different OS

            // Ensure the import path starts with './' or '../' for relative paths
            const finalImportPath = newImportPath.startsWith('.') ? newImportPath : `./${newImportPath}`;

            return `${p1}${finalImportPath}${p3}`;
        });

        await vscode.workspace.fs.writeFile(fileUri, Buffer.from(newText, 'utf8'));
    }));
}





export {

	getSpecFilePath,
	getClassName,
	replaceClassName,
	replaceInProject,
	extractName,
	handler

}
