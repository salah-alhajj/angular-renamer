interface ImportDetails {
    moduleName: string;
    path: string;
}

export function extractGuardName(fileContent: string): string | null {
    // Match class-based guards
    const classGuardRegex = /export\s+class\s+(\w+)Guard?\s+implements\s+Can[A-Za-z]+/;
    const classMatch = fileContent.match(classGuardRegex);
    if (classMatch) {
        return classMatch[1]+'Guard';
    }

    // Match function-based guards
    const functionGuardRegex = /export\s+const\s+(\w+)Guard?:\s+Can[A-Za-z]+Fn/;
    const functionMatch = fileContent.match(functionGuardRegex);
    if (functionMatch) {
        return functionMatch[1]+'Guard';
    }

    return null; // Return null if no guard is found
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
  return lines.filter(line => line.trim().startsWith('import') && line.includes(query))
    .map(line => line.trim());
}


function extractExportedClasses(tsCode: string, type: string): string[] {
  const typeRegex = new RegExp(`${type}$`, 'i');
  const classRegex = /export\s+class\s+(\w+)/g;
  return Array.from(tsCode.matchAll(classRegex))
    .map(match => match[1])
    .filter(className => typeRegex.test(className));
}


export {
    extractImports,
    getImportLines,
    extractExportedClasses
};  