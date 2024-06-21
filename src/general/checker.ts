import * as vscode from 'vscode';
import * as path from 'path';
async function isDirectory(uri: vscode.Uri| string): Promise<boolean> {
    try {
        // check if uri is uri or string
        if (typeof uri === 'string') {
            uri = vscode.Uri.file(uri);
        }
        const fileStat = await vscode.workspace.fs.stat(uri);
        return fileStat.type === vscode.FileType.Directory;
    } catch (error) {
        if (typeof uri === 'string') {
            uri = vscode.Uri.file(uri);
        }
        vscode.window.showErrorMessage(`Error checking if ${uri.fsPath} is a directory: ${error}`);
        return false;
    }
}

async function isAngularComponent(targetPath: string): Promise<boolean> {
    if (!(await isDirectory(targetPath))){
        targetPath=path.dirname(targetPath);
    }
    const files = await vscode.workspace.fs.readDirectory(vscode.Uri.file(targetPath));

    const hasComponentTs = files.some(([name]) => name.endsWith('.component.ts'));
    const hasComponentHtml = files.some(([name]) => name.endsWith('.component.html'));
    const hasComponentCss = files.some(([name]) => name.endsWith('.component.css'));
    const isComponentFolder = hasComponentTs && hasComponentHtml && hasComponentCss;
    return isComponentFolder;
}
async function isAngularService(targetPath: string): Promise<boolean> {
    if (!(await isDirectory(targetPath))){
        targetPath=path.dirname(targetPath);
    }
    const files = await vscode.workspace.fs.readDirectory(vscode.Uri.file(targetPath));

    const hasServiceTs = files.some(([name]) => name.endsWith('.service.ts'));
    return hasServiceTs;
}

async function isAngularGuard(targetPath: string): Promise<boolean> {
    if (!(await isDirectory(targetPath))){
        targetPath=path.dirname(targetPath);
    }
    const files = await vscode.workspace.fs.readDirectory(vscode.Uri.file(targetPath));
    const hasGuardTs = files.some(([name]) => name.endsWith('.component.ts'));
    return hasGuardTs;
}
async function isAngularPipe(targetPath: string): Promise<boolean> {
    if (!(await isDirectory(targetPath))){
        targetPath=path.dirname(targetPath);
    }
    const files = await vscode.workspace.fs.readDirectory(vscode.Uri.file(targetPath));
    const hasPipeTs = files.some(([name]) => name.endsWith('.pipe.ts'));
    return hasPipeTs;
}
async function isAngularDirective(targetPath: string): Promise<boolean> {
    if (!(await isDirectory(targetPath))){
        targetPath=path.dirname(targetPath);
    }
    const files = await vscode.workspace.fs.readDirectory(vscode.Uri.file(targetPath));
    const hasDirectiveTs = files.some(([name]) => name.endsWith('.directive.ts'));
    return hasDirectiveTs;
}
async function isAngularProject():Promise<boolean>{
    const workspaceFile = vscode.workspace.workspaceFile;
    // check if contain angular.json
    if (workspaceFile) {
        const workspacePath = path.dirname(workspaceFile.fsPath);
        const files = await vscode.workspace.fs.readDirectory(vscode.Uri.file(workspacePath));
        
        const hasAngularJson = files.some(([name]) => {
            console.log(`msg: ${name}`)
            return name === 'angular.json';
        });
        return hasAngularJson;
    }
    
    return false;

}
export {
    isAngularComponent,
    isDirectory,
    isAngularProject
}
