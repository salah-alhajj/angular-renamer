interface ImportDetails {
    moduleName: string;
    path: string;
}

function extractImports(importLines: string[]): ImportDetails[] {
    const importRegex = /import\s*\{\s*([^\}]+)\s*\}\s*from\s*['"]([^'"]+)['"]/g;
    const imports: ImportDetails[] = [];
    let match;
    for (const importLine of importLines) {
        while ((match = importRegex.exec(importLine)) !== null) {
            const moduleNames = match[1].split(',').map(name => name.trim());
            const path = match[2];

            for (const moduleName of moduleNames) {
                imports.push({ moduleName, path });
            }
        }
    }

    return imports;
}

function getImportLines(code: string, query: string): string[] {
    const lines = code.split('\n');
    const importLines = lines.filter(line => line.trim().startsWith('import')
        && line.trim().includes(query)

    );
    return importLines;
}

function extractExportedClasses(tsCode: string, type: string): string[] {
    try {
      const typeRegex = new RegExp(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()}$`, 'i'); 
      const classRegex = new RegExp(`export\\s+class\\s+(\\w+)`, 'g');
      const classes: string[] = [];
      let match;
  
      while ((match = classRegex.exec(tsCode)) !== null) {
        if (typeRegex.test(match[1])) { 
          classes.push(match[1]); 
        }
      }
  
      return classes;
    } catch (e) {
      return [];
    }
  }
export {
    extractImports,
    getImportLines,
    extractExportedClasses
}  