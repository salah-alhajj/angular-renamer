import { extractImports, getImportLines, extractExportedClasses } from '../../general/utilities';

describe('extractImports', () => {
    it('should extract module names and paths from import lines', () => {
        const importLines = [
            "import { ModuleA, ModuleB } from './path/to/module';",
            "import { ModuleC } from './path/to/another/module';"
        ];

        const result = extractImports(importLines);

        expect(result).toEqual([
            { moduleName: 'ModuleA', path: './path/to/module' },
            { moduleName: 'ModuleB', path: './path/to/module' },
            { moduleName: 'ModuleC', path: './path/to/another/module' }
        ]);
    });

    it('should handle empty import lines', () => {
        const importLines: string[] = [];

        const result = extractImports(importLines);

        expect(result).toEqual([]);
    });

    it('should handle import lines without curly braces', () => {
        const importLines = [
            "import ModuleA from './path/to/module';"
        ];

        const result = extractImports(importLines);

        expect(result).toEqual([]);
    });
});

describe('getImportLines', () => {
    it('should extract import lines containing the query string', () => {
        const code = `
            import { ModuleA } from './path/to/module';
            import { ModuleB } from './path/to/another/module';
            import { ModuleC } from './different/path/module';
        `;

        const query = 'path/to';

        const result = getImportLines(code, query);

        expect(result).toEqual([
            "import { ModuleA } from './path/to/module';",
            "import { ModuleB } from './path/to/another/module';"
        ]);
    });

    it('should return an empty array if no import lines contain the query string', () => {
        const code = `
            import { ModuleA } from './path/to/module';
            import { ModuleB } from './path/to/another/module';
        `;

        const query = 'different/path';

        const result = getImportLines(code, query);

        expect(result).toEqual([]);
    });
});

describe('extractExportedClasses', () => {
    it('should extract exported classes ending with a specific type', () => {
        const tsCode = `
            export class MyComponent {}
            export class AnotherComponent {}
            export class MyService {}
        `;

        const type = 'Component';

        const result = extractExportedClasses(tsCode, type);

        expect(result).toEqual([
            'MyComponent',
            'AnotherComponent'
        ]);
    });

    it('should handle no exported classes matching the type', () => {
        const tsCode = `
            export class MyService {}
            export class AnotherService {}
        `;

        const type = 'Component';

        const result = extractExportedClasses(tsCode, type);

        expect(result).toEqual([]);
    });
});
