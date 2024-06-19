import * as vscode from 'vscode';
import * as path from 'path';

function extractComponentName(folderPath: string): string {
	const folderName = path.basename(folderPath);
	return folderName.split('.')[0];
}

function getSpecFilePath(filePath: string): string {
	const dirName = path.dirname(filePath);
	const baseName = path.basename(filePath, '.ts');
	return path.join(dirName, `${baseName}.spec.ts`);
}


function getComponentClassName(componentFolderName: string): string {
	let parts = componentFolderName.split('-');
	let newClassName = '';
	for (var part of parts) {
		newClassName += part.charAt(0).toUpperCase() + part.slice(1);
	}
	return newClassName + 'Component';
}

function replaceClassName(newComponentName: string, oldComponentName: string, filePath: string): Thenable<void> {
	const newNameClassComponent = getComponentClassName(newComponentName);
	const oldNameClassComponent = getComponentClassName(oldComponentName);
	// const fullFilePath = 

	return vscode.workspace.fs.readFile(vscode.Uri.file(filePath)).then((data) => {
		const text = Buffer.from(data).toString('utf8');

		const regex = new RegExp(`export class ${oldNameClassComponent}\\b`, 'g');

		if (regex.test(text)) {
			const newText = text.replace(regex, `export class ${newNameClassComponent}`);
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



async function replaceComponentInProject(oldComponentName: string, newComponentName: string): Promise<void> {
	const oldComponentClassName = getComponentClassName(oldComponentName);
	const newComponentClassName = getComponentClassName(newComponentName);
	const workspaceRoot = vscode.workspace.rootPath;


	if (!workspaceRoot) {
		vscode.window.showErrorMessage('No workspace folder open.');
		return;
	}

	const filesPattern = new vscode.RelativePattern(workspaceRoot, 'src/**/*.component.ts');
	const files = await vscode.workspace.findFiles(filesPattern);

	await Promise.all(files.map(async (fileUri) => {
		const data = await vscode.workspace.fs.readFile(fileUri);
		const text = Buffer.from(data).toString('utf8');

		const classNameRegex = new RegExp(`\\b${oldComponentClassName}\\b`, 'g');

		let newText = text;
		const oldImportPath = `${oldComponentName}/${oldComponentName}.component`;
		const newImportPath = `${newComponentName}/${newComponentName}.component`;
		newText = newText.replaceAll(oldImportPath, newImportPath);
		newText = newText.replaceAll(oldComponentClassName, newComponentClassName);



		// rewrite newText
		await vscode.workspace.fs.writeFile(fileUri, Buffer.from(newText, 'utf8'));




		newText = newText.replace(classNameRegex, newComponentClassName);
	}))

}

export {
	extractComponentName,
	getSpecFilePath,
	getComponentClassName,
	replaceClassName,
	replaceComponentInProject
}
