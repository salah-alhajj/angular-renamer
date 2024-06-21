import { extractImports, getImportLines, extractExportedClasses } from '../../general/utilities';

describe('Utility functions', () => {
  describe('extractImports', () => {
    it('should extract import details', () => {
      const importLines = [
        "import { Component } from '@angular/core';",
        "import { MyService } from './my.service';"
      ];
      const result = extractImports(importLines);
      expect(result).toEqual([
        { moduleName: 'Component', path: '@angular/core' },
        { moduleName: 'MyService', path: './my.service' }
      ]);
    });
  });

  describe('getImportLines', () => {
    it('should get import lines containing the query', () => {
      const code = `
        import { Component } from '@angular/core';
        import { MyService } from './my.service';
        const x = 5;
      `;
      const result = getImportLines(code, 'MyService');
      expect(result).toEqual(["import { MyService } from './my.service';"]);
    });
  });

  describe('extractExportedClasses', () => {
    it('should extract exported classes of the specified type', () => {
      const code = `
        export class MyServiceService {}
        export class NotAService {}
        export class AnotherServiceService {}
      `;
      const result = extractExportedClasses(code, 'service');
      expect(result).toEqual(['MyServiceService', 'AnotherServiceService']);
    });
  });
});