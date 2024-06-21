import * as vscode from 'vscode';
import * as General from '../general'


async function replaceClassName(
    newComponentName: string,
    oldClassNameComponent: string,
    filePath: string
): Promise<void> {
    const newNameClassComponent = General.getClassName(newComponentName,'component');
    
    try {
        const data = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath));
        const text = Buffer.from(data).toString('utf8');

        const classRegex = new RegExp(`\\b${oldClassNameComponent}\\b`, 'g');
        const newText = text.replace(classRegex, newNameClassComponent);


            if (await vscode.workspace.fs.stat(vscode.Uri.file(filePath))) {
                await vscode.workspace.fs.writeFile(
                    vscode.Uri.file(filePath),
                    Buffer.from(newText, 'utf8')
                );
            }
            
            
        // }
    } catch (error) {
        vscode.window.showErrorMessage(`Error replacing class name: ${error}`);
    }
}

export {
    replaceClassName,
}
