import * as vscode from 'vscode';
import * as path from 'path';
async function isDirectory(uri: vscode.Uri | string): Promise<boolean> {
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
        // vscode.window.showErrorMessage(`Error checking if ${uri.fsPath} is a directory: ${error}`);
        return false;
    }
}

async function isAngularComponent(targetPath: string): Promise<boolean> {
    if (!(await isDirectory(targetPath))) {
        targetPath = path.dirname(targetPath);
    }
    const files = await vscode.workspace.fs.readDirectory(vscode.Uri.file(targetPath));

    const hasComponentTs = files.some(([name]) => name.endsWith('.component.ts'));
    const hasComponentHtml = files.some(([name]) => name.endsWith('.component.html'));
    const hasComponentCss = files.some(([name]) => name.endsWith('.component.css'));
    const isComponentFolder = hasComponentTs && hasComponentHtml && hasComponentCss;
    return isComponentFolder;
}
async function isAngularService(targetPath: string): Promise<boolean> {
    if (!(await isDirectory(targetPath))) {
        targetPath = path.dirname(targetPath);
    }
    const files = await vscode.workspace.fs.readDirectory(vscode.Uri.file(targetPath));

    const hasServiceTs = files.some(([name]) => name.endsWith('.service.ts'));
    return hasServiceTs;
}

async function isAngularGuard(targetPath: string): Promise<boolean> {
    if (!(await isDirectory(targetPath))) {
        targetPath = path.dirname(targetPath);
    }
    const files = await vscode.workspace.fs.readDirectory(vscode.Uri.file(targetPath));
    const hasGuardTs = files.some(([name]) => name.endsWith('.component.ts'));
    return hasGuardTs;
}
async function isAngularPipe(targetPath: string): Promise<boolean> {
    if (!(await isDirectory(targetPath))) {
        targetPath = path.dirname(targetPath);
    }
    const files = await vscode.workspace.fs.readDirectory(vscode.Uri.file(targetPath));
    const hasPipeTs = files.some(([name]) => name.endsWith('.pipe.ts'));
    return hasPipeTs;
}
async function isAngularDirective(targetPath: string): Promise<boolean> {
    if (!(await isDirectory(targetPath))) {
        targetPath = path.dirname(targetPath);
    }
    const files = await vscode.workspace.fs.readDirectory(vscode.Uri.file(targetPath));
    const hasDirectiveTs = files.some(([name]) => name.endsWith('.directive.ts'));
    return hasDirectiveTs;
}
async function isAngularProject(): Promise<boolean> {
    const workspaceFile = vscode.workspace.workspaceFile;
    // check if contain angular.json
    if (workspaceFile) {
        const workspacePath = path.dirname(workspaceFile.fsPath);
        const files = await vscode.workspace.fs.readDirectory(vscode.Uri.file(workspacePath));

        const hasAngularJson = files.some(([name]) => {
            return name === 'angular.json';
        });
        return hasAngularJson;
    }

    return false;

}
async function checkOldFile(path: string): Promise<boolean> {
    // check if path is exists
    try {
        // vscode.window.showErrorMessage(`${vscode.Uri.file(path).path} Deleted`)
        await vscode.workspace.fs.stat(vscode.Uri.file(path));
        await vscode.workspace.fs.delete(vscode.Uri.file(path), { recursive: true });
        return true;
    } catch (error) {
        return false;
    }

}
async function isAngularWorkspace(): Promise<boolean> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return false;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    const packageJsonUri = vscode.Uri.file(`${rootPath}/package.json`);

    try {
        const packageJsonContent = await vscode.workspace.fs.readFile(packageJsonUri);
        const packageJson = JSON.parse(packageJsonContent.toString());
        return packageJson.dependencies && '@angular/core' in packageJson.dependencies;
    } catch (error) {
        console.error('Error reading package.json:', error);
        return false;
    }
}
export {
    isAngularComponent,
    isDirectory,
    isAngularProject,
    checkOldFile,
    isAngularService,
    isAngularGuard,
    isAngularPipe,
    isAngularDirective,
    isAngularWorkspace,

};
