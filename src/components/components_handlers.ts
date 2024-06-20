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




async function replaceClassName(
    newComponentName: string,
    oldClassNameComponent: string,
    filePath: string
): Promise<void> {
    const newNameClassComponent = getComponentClassName(newComponentName);

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



export {
	extractComponentName,
	getSpecFilePath,
	getComponentClassName,
	replaceClassName,
	// replaceComponentInProject
}
