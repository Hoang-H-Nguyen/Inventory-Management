"""Generate Java transport records from the repository's canonical OpenAPI.

Usage from any directory: python3 src/scripts/generate-contracts.py
Only shared/contract/*.java and contracts/api-map.json are generated.
Validation, enum checks and application/domain invariants remain implementation work.
"""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / 'docs/openapi/openapi.json'
TARGET = ROOT / 'backend/src/main/java/com/stockmate/shared/contract'

def camel(value):
    return re.sub(r'[-_]([a-z])', lambda match: match[1].upper(), value)

def java_name(value):
    return 'ApiError' if value == 'Error' else value

def generate_record(name, schema, indent=''):
    nested = []
    def java_type(prop_name, prop):
        if '$ref' in prop:
            return java_name(prop['$ref'].split('/')[-1])
        kind = prop.get('type')
        if kind == 'array':
            return 'List<' + java_type(prop_name + 'Item', prop['items']) + '>'
        if kind == 'object':
            if not prop.get('properties'):
                return 'Map<String, Object>'
            child = prop_name[0].upper() + prop_name[1:] + 'Value'
            nested.append(generate_record(child, prop, indent + '    '))
            return child
        if kind == 'integer':
            wide = prop.get('format') == 'int64' or prop.get('maximum', 0) > 2147483647 or prop.get('minimum', 0) < -2147483648
            return 'Long' if wide else 'Integer'
        if kind == 'number': return 'BigDecimal'
        if kind == 'boolean': return 'Boolean'
        return {'date': 'LocalDate', 'date-time': 'Instant'}.get(prop.get('format'), 'String')

    fields = []
    for field, prop in schema.get('properties', {}).items():
        fields.append(indent + '        ' + java_type(camel(field), prop) + ' ' + camel(field))
    declaration = indent + 'public record ' + name + '(\n' + ',\n'.join(fields) + '\n' + indent + ') {'
    # Java records otherwise print credentials in their auto-generated toString().
    if name in {'LoginInput', 'AuthSession', 'ChangePasswordInput', 'UserCreateInput', 'ResetPasswordInput'}:
        nested.append(indent + '    @Override public String toString() { return "' + name + '[REDACTED]"; }')
    return declaration + ('\n' + '\n'.join(nested) + '\n' + indent if nested else '') + '}\n'

def module_for(path):
    if path == '/me' or path.startswith('/auth/'): return 'auth'
    if path.startswith('/users') or path == '/user-activity': return 'users'
    if re.match(r'/products/\{productId\}/(sales|demand)$', path): return 'demand'
    for prefix, module in [('/products','catalog'),('/suppliers','catalog'),('/supplier-products','catalog'),('/inventory','inventory'),('/placed-orders','orders'),('/backorders','backorders'),('/low-stock','replenishment'),('/replenishment-runs','replenishment'),('/proposals','proposals'),('/ai/','ai'),('/dashboard','dashboard')]:
        if path.startswith(prefix): return module
    raise ValueError('Unmapped API path: ' + path)

if __name__ == '__main__':
    spec = json.loads(SOURCE.read_text())
    TARGET.mkdir(parents=True, exist_ok=True)
    for name, schema in spec['components']['schemas'].items():
        name = java_name(name)
        content = '// Generated from docs/openapi/openapi.json; edit source schema, then regenerate.\n'
        content += 'package com.stockmate.shared.contract;\n\n'
        content += 'import java.math.BigDecimal;\nimport java.time.Instant;\nimport java.time.LocalDate;\nimport java.util.List;\nimport java.util.Map;\n\n'
        content += generate_record(name, schema)
        (TARGET / (name + '.java')).write_text(content)
    mapping = []
    for path, methods in spec['paths'].items():
        for method, operation in methods.items():
            if method not in {'get','post','put','patch','delete'}: continue
            mapping.append({'method': method.upper(), 'path': '/api/v1' + path,
                'operation_id': operation['operationId'], 'module': module_for(path),
                'roles': operation.get('x-roles', [])})
    dest = ROOT / 'contracts/api-map.json'
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(json.dumps(mapping, ensure_ascii=False, indent=2) + '\n')
    print(f'Generated {len(spec["components"]["schemas"])} DTO records and {len(mapping)} API mappings.')
