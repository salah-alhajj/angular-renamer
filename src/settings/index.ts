import * as vscode from 'vscode';
import { AngularRenamerSettings } from './settings.interface';



export function getAngularRenamerSettings(): AngularRenamerSettings {
    const configuration = vscode.workspace.getConfiguration('angularRenamer');
    return {
        // searchAndReplaceDeeply
        searchAndReplaceDeeply: configuration.get<boolean>('searchAndReplaceDeeply', true),
        updateImports: configuration.get<boolean>('updateImports', true),
        autoRenameClasses: configuration.get<boolean>('autoRenameClasses', true),
        renameComponents: configuration.get<boolean>('renameComponents', true),
        renameServices: configuration.get<boolean>('renameServices', true),
        renameDirectives: configuration.get<boolean>('renameDirectives', true),
        renamePipes: configuration.get<boolean>('renamePipes', true),
        renameGuards: configuration.get<boolean>('renameGuards', true),
        renameSpec: configuration.get<boolean>('renameSpec', true),
    };
}

// Usage example

