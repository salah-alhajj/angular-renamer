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







export {
	extractComponentName,
	getSpecFilePath,
	getComponentClassName,
	
	// replaceComponentInProject
}
