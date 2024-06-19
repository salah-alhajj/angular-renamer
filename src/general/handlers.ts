import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { renameAngularFiles } from './renamers';



async function handler(file: any) {
	if (!(
		file.oldUri.path.includes('pipe.ts') ||
		file.oldUri.path.includes('pipe.spec.ts') ||

		file.oldUri.path.includes('directive.ts') ||
		file.oldUri.path.includes('directive.spec.ts') ||

		file.oldUri.path.includes('service.ts') ||
		file.oldUri.path.includes('service.spec.ts') ||

		file.oldUri.path.includes('guard.ts') ||
		file.oldUri.path.includes('guard.spec.ts')


	)) {
		return

	}
	const oldName = path.basename(file.oldUri.path)
	const newName = path.basename(file.newUri.path)
	const type = newName.split('.')[1]
	vscode.window.showInformationMessage(`Type is ${type}`)
	await renameAngularFiles(file.newUri.fsPath, oldName, newName, type)
	replaceClassName(newName,oldName,type,file.newUri.path)
	replaceInProject(newName,oldName,type,)







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


function getClassName(componentFolderName: string, type: string): string {
	// 1- spilit by -
	// 2- capitalize each word
	// 3- join words
	let parts = componentFolderName.split('-');
	let newClassName = '';
	for (var part of parts) {
		newClassName += part.charAt(0).toUpperCase() + part.slice(1);
	}
	// make type lower exclude firs letter
	type = type.toLowerCase().charAt(0).toUpperCase() + type.slice(1);
	return newClassName + type;
}

function replaceClassName(newName: string, oldName: string, type: string, filePath: string): Thenable<void> {
	const newNameClass = getClassName(newName, type);
	const oldNameClass = getClassName(oldName, type);
	// const fullFilePath = 

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



async function replaceInProject(oldName: string, newName: string, type: string): Promise<void> {
	const oldClassName = getClassName(oldName, type);
	const newClassName = getClassName(newName, type);
	const workspaceRoot = vscode.workspace.rootPath;


	if (!workspaceRoot) {
		vscode.window.showErrorMessage('No workspace folder open.');
		return;
	}

	const filesPattern = new vscode.RelativePattern(workspaceRoot, `src/**/*.${type}.ts`);
	const files = await vscode.workspace.findFiles(filesPattern);

	await Promise.all(files.map(async (fileUri) => {
		const data = await vscode.workspace.fs.readFile(fileUri);
		const text = Buffer.from(data).toString('utf8');

		const classNameRegex = new RegExp(`\\b${oldClassName}\\b`, 'g');

		let newText = text;
		const oldImportPath = `${oldName}/${oldName}.${type}`;
		const newImportPath = `${newName}/${newName}.${type}`;
		newText = newText.replaceAll(oldImportPath, newImportPath);
		newText = newText.replaceAll(oldClassName, newClassName);



		// rewrite newText
		await vscode.workspace.fs.writeFile(fileUri, Buffer.from(newText, 'utf8'));
		newText = newText.replace(classNameRegex, newClassName);
	}))

}

export {

	getSpecFilePath,
	getClassName,
	replaceClassName,
	replaceInProject,
	extractName,
	handler

}
